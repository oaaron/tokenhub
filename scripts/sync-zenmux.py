"""Read-only ZenMux public catalog sync, preserving public specifications and USD prices.

python3 scripts/sync-zenmux.py --html /tmp/zenmux-models.html
HTML Flight text references are resolved before JSON parsing. No account APIs are used.
"""
import argparse
import concurrent.futures
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = 'https://zenmux.ai'


def fetch(url):
    return subprocess.run(['curl', '--fail', '--silent', '--show-error', '--max-time', '45', '--retry', '2', url], capture_output=True, text=True, check=True).stdout


def flight(html):
    chunks = []
    for match in re.finditer(r'self\.__next_f\.push\((.*?)\)</script>', html, re.S):
        item = json.loads(match.group(1))
        if len(item) > 1 and item[0] == 1:
            chunks.append(item[1])
    text = ''.join(chunks)
    encoded = text.encode()
    refs = {}
    for match in re.finditer(rb'([a-f0-9]+):T([a-f0-9]+),', encoded):
        refs[match[1].decode()] = encoded[match.end():match.end() + int(match[2], 16)].decode()

    def resolve(value):
        if isinstance(value, str) and re.fullmatch(r'\$[a-f0-9]+', value):
            if value[1:] not in refs:
                raise ValueError('Unresolved Flight text reference: ' + value)
            return refs[value[1:]]
        if isinstance(value, dict):
            return {key: resolve(item) for key, item in value.items()}
        if isinstance(value, list):
            return [resolve(item) for item in value]
        return value

    def get(key):
        token = '"' + key + '":'
        index = text.rfind(token)
        if index < 0:
            raise ValueError('Missing public field: ' + key)
        return resolve(json.JSONDecoder().raw_decode(text[index + len(token):])[0])
    return get


def split(value):
    return [part.strip() for part in (value or '').split(',') if part.strip()]


UNITS = {'millionTokens': ('M_TOKENS', '百万Tokens'), 'counts': ('COUNT', '次'), 'seconds': ('SECOND', '秒'), 'millionPixels': ('M_PIXELS', '百万像素'), 'minutes': ('MINUTE', '分钟'), 'characters': ('CHARACTER', '字符'), 'thousandCharacters': ('K_CHARACTERS', '千字符')}
LABELS = {'text': '文本', 'image': '图像', 'video': '视频', 'audio': '音频', 'file': '文件', 'embedding': '向量嵌入', 'embeddings': '向量嵌入', 'decisions': '结构化决策', 'decision': '结构化决策'}


def pricing(raw):
    if not raw:
        return []
    records = json.loads(raw)
    stages = []
    for fee in records:
        code = fee['feeItemCode']
        for record in fee.get('feeRecords', []):
            components = record.get('components', [])
            unit = next((item.get('value') for item in components if item.get('code') == 'chargeUnit'), None)
            unit_code, unit_name = UNITS.get(unit, (unit or 'UNPUBLISHED', unit or '未公布单位'))
            constraints = [item for item in components if item.get('code') != 'chargeUnit']
            direction = 'INPUT' if code == 'prompt' or code.startswith(('input_', 'audio_input', 'image_input', 'image_text_input', 'video_input', 'audio_cache')) else 'OUTPUT' if code == 'completion' or code.startswith(('audio_output', 'image_output', 'image_text_output', 'video_output')) or code in ['image', 'audio', 'video', 'audio_and_video'] else 'OTHER'
            price_code = 'INPUT' if code == 'prompt' else 'OUTPUT' if code == 'completion' else code.upper()
            price = {'priceCode': price_code, 'priceNameZH': fee.get('feeItemName', code), 'priceValue': record.get('feeRate'), 'unitCode': unit_code, 'fixedNameZh': unit_name, 'priceCurrency': 'USD', 'direction': direction, 'sourceFeeCode': code, 'constraints': constraints}
            stage_text = '；'.join(f"{item.get('name') or item.get('code')}: {json.dumps(item.get('value'), ensure_ascii=False) if isinstance(item.get('value'), (dict, list)) else item.get('value')}" for item in constraints)
            stages.append({'stage': stage_text, 'stageText': stage_text, 'priceCurrency': 'USD', 'price': [price]})
    return stages


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--html', type=pathlib.Path)
    parser.add_argument('--detail-cache', type=pathlib.Path, default=pathlib.Path('/tmp/velink-zenmux-verified'))
    args = parser.parse_args()
    catalog = flight(args.html.read_text() if args.html else fetch(BASE + '/models'))('models')
    summaries_zh = json.loads((ROOT / 'scripts/zenmux-descriptions-zh.json').read_text())
    args.detail_cache.mkdir(exist_ok=True, parents=True)
    failures = []

    def detail(row):
        path = args.detail_cache / (row['slug'].replace('/', '--') + '.json')
        try:
            if path.exists():
                data = json.loads(path.read_text())
            else:
                source = flight(fetch(BASE + '/' + row['slug']))
                data = {'initialModel': source('initialModel'), 'initialProviders': source('initialProviders')}
                path.write_text(json.dumps(data, ensure_ascii=False))
            return data
        except Exception as error:
            failures.append({'model': row['slug'], 'reason': str(error)})
            return {'initialModel': {}, 'initialProviders': []}

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        detail_rows = list(pool.map(detail, catalog))
    if failures:
        raise RuntimeError(json.dumps(failures, ensure_ascii=False))
    folder = ROOT / 'src/content/model-details'
    models = []
    for row, data in zip(catalog, detail_rows):
        source = data['initialModel']
        provider_rows = []
        protocols, params = set(split(row.get('suitable_api'))), set(split(row.get('supported_parameters')))
        reasoning = [row.get('supports_reasoning', 0)]
        for provider in data['initialProviders']:
            protocol_info = provider.get('api_protocols') or {}
            protocols.update(protocol_info)
            for spec in protocol_info.values():
                params.update(spec.get('supported_parameters') or [])
                reasoning.append(spec.get('supports_reasoning', 0))
            provider_rows.append({
                'name': provider.get('provider'), 'slug': provider.get('provider_slug'), 'iconUrl': provider.get('providerIcon'),
                'contextLength': provider.get('context_length') or None, 'maxCompletionTokens': provider.get('max_completion_tokens') or None,
                'supportsStreaming': provider.get('supports_streaming'), 'apiProtocols': protocol_info,
                'pricingDiscount': provider.get('pricing_discount'),
                'priceInfo': {'prices': pricing(provider.get('pricing_variable'))},
            })
        name = row['slug']
        # Safe unique route slug; the complete public model ID is retained in name.
        slug = 'zm-' + re.sub(r'[^a-zA-Z0-9._~-]', '-', name)
        if name not in summaries_zh:
            raise RuntimeError('Chinese editorial summary missing: ' + name)
        description = summaries_zh[name]
        stages = pricing(row.get('variable_pricings'))
        tags = []
        for key, field in [('INPUT_TYPE', 'input_modalities'), ('OUTPUT_TYPE', 'output_modalities')]:
            for value in split(row.get(field)):
                tags.append({'type': key, 'key': value.upper(), 'value': LABELS.get(value, value)})
        model = {
            'slug': slug, 'uniqueId': row['id'], 'name': name, 'displayName': row['name'], 'provider': row.get('authorName') or row['author'],
            'manufacturerKey': row['author'], 'iconUrl': row.get('iconUrl') or source.get('authorIcon'),
            'zhDescription': description, 'zhLongDescription': description,
            'description': description, 'longDescription': description,
            'contextLength': row.get('context_length') or source.get('context_length') or None, 'maxCompletionTokens': row.get('max_completion_tokens') or None,
            'currency': 'USD', 'tagList': tags, 'publishedTime': row.get('publish_time'),
            'isFree': bool(row.get('isFree')), 'minDiscountRate': row.get('pricing_discount'), 'supportedParams': sorted(params), 'supportedProtocols': sorted(protocols),
            'reasoning': row.get('supports_reasoning', 0), 'reasoningModes': sorted(set(reasoning)),
            'providerNames': list(dict.fromkeys(p['name'] for p in provider_rows)), 'providerDetails': provider_rows,
            'modelProtocolCompatibility': {protocol: True for protocol in sorted(protocols)},
            'supportedParametersDefaultValue': {param: {'enable': True, 'defaultValue': None} for param in sorted(params)},
            'priceInfo': {'prices': stages}, 'pricingDetails': json.loads(row.get('variable_pricings') or '[]'),
            'sourcePublishedPrices': {key: value for key, value in row.items() if key.startswith('pricing_')},
            'exampleCodes': [], 'serviceConfiguration': '服务配置待开通；接入地址、鉴权和可用协议以开通后的服务配置为准。',
            'sourceRegion': 'global', 'sourceCatalog': 'ZenMux', 'sourceUrl': BASE + '/' + name,
            'detailVerified': True, 'aliases': source.get('aliases') or row.get('aliases') or [],
        }
        (folder / (slug + '.json')).write_text(json.dumps(model, ensure_ascii=False, indent=2) + '\n')
        summary = {key: value for key, value in model.items() if key not in ['providerDetails', 'zhLongDescription', 'longDescription', 'exampleCodes', 'supportedParametersDefaultValue', 'pricingDetails']}
        summary['providerDetails'] = [{key: provider[key] for key in ['name', 'slug', 'iconUrl']} for provider in provider_rows]
        # Catalog cards only need distinct fee values and units; full provider conditions stay in lazy details.
        catalog_prices = {}
        for stage in summary['priceInfo']['prices']:
            for price in stage['price']:
                fee = {key: price[key] for key in ['priceCode', 'priceValue', 'unitCode', 'fixedNameZh', 'direction', 'sourceFeeCode'] if key in price}
                fee['priceCurrency'] = price.get('priceCurrency') or stage.get('priceCurrency') or summary.get('currency')
                catalog_prices[json.dumps(fee, sort_keys=True)] = fee
        summary['priceInfo'] = {'prices': [{'priceCurrency': summary.get('currency'), 'price': list(catalog_prices.values())}]}
        models.append(summary)
    if len({model['slug'] for model in models}) != len(models):
        raise RuntimeError('Model route collision')
    (ROOT / 'src/content/models-zenmux.json').write_text(json.dumps(models, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'models': len(models), 'detailsVerified': len(detail_rows), 'providers': sum(len(data['initialProviders']) for data in detail_rows), 'priceRecords': sum(len(model['priceInfo']['prices']) for model in models), 'failures': failures}, ensure_ascii=False))


if __name__ == '__main__':
    main()
