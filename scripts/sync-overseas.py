"""Synchronize only the public Computrix catalog; never writes the CN snapshot.

Run: python3 scripts/sync-overseas.py [--list-file path]
Public technical fields are allowlisted; account and administrative data are removed.
"""
import argparse
import concurrent.futures
import json
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = 'https://computrix.ai'
KEYS = '''uniqueId name displayName provider description zhDescription longDescription zhLongDescription contextLength maxCompletionTokens maxTokens currency inputPrice outputPrice inPrice outPrice inPriceZh outPriceZh inHitCachePrice inHitCreatePrice tagList type typeList supportedParametersDefaultValue protocolParameters modelProtocolCompatibility minDiscountRate priceInfo publishedTime offShelfFlag offShelfDate buyTypes specs capabilities languages scenarios modelParameters usageGuide exampleCodes agentIntegrations'''.split()
SUMMARY_KEYS = '''slug uniqueId name displayName provider contextLength maxCompletionTokens maxTokens currency inputPrice outputPrice inPrice outPrice inPriceZh outPriceZh tagList minDiscountRate publishedTime modelProtocolCompatibility sourceUrl sourceRegion sourceCatalog detailVerified'''.split()
SENSITIVE = re.compile(r'^(id|creator|modifier|createdTime|updatedTime|tenantId|userId|accountId|apiKey|secretKey|accessKey|accessToken|token|password|authorization|credentials)$', re.I)


def sanitize(value):
    if isinstance(value, dict):
        return {k: sanitize(v) for k, v in value.items() if not SENSITIVE.match(k)}
    if isinstance(value, list):
        return [sanitize(v) for v in value]
    return value


def fetch(path):
    with urllib.request.urlopen(BASE + path, timeout=45) as response:
        result = json.load(response)
    if not result.get('success'):
        raise RuntimeError(str(result.get('errorMsg') or result.get('errorCode')))
    return result['data']


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--list-file', type=pathlib.Path)
    args = parser.parse_args()
    listing = json.loads(args.list_file.read_text())['data'] if args.list_file else fetch('/api/v1/model-service/public/page-list?page=1&pageSize=999')
    items = listing['items']
    failures = []

    def detail(item):
        verified = True
        try:
            full = {**item, **fetch('/api/v1/model-service/public/get/' + item['uniqueId'])}
        except Exception as error:
            failures.append({'uniqueId': item['uniqueId'], 'reason': str(error)})
            full, verified = item, False
        clean = sanitize({key: full[key] for key in KEYS if key in full})
        # Detail response uses formatted inputPrice/outputPrice; preserve them verbatim.
        clean['inPriceZh'] = clean.get('inPriceZh') or full.get('inputPrice')
        clean['outPriceZh'] = clean.get('outPriceZh') or full.get('outputPrice')
        clean['contextLength'] = clean.get('contextLength') or full.get('contextLimit')
        clean.update(slug='sg-' + item['uniqueId'], sourceRegion='sg', sourceCatalog='Computrix', sourceUrl=BASE + '/sg/models', detailVerified=verified)
        return clean

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        details = list(pool.map(detail, items))
    if len({row['slug'] for row in details}) != len(details):
        raise RuntimeError('Duplicate source SKU IDs')
    folder = ROOT / 'src/content/model-details'
    summaries = []
    for row in details:
        (folder / (row['slug'] + '.json')).write_text(json.dumps(row, ensure_ascii=False, indent=2) + '\n')
        summary = {key: row.get(key) for key in SUMMARY_KEYS}
        description = row.get('zhDescription') or row.get('description') or ''
        summary['zhDescription'] = description[:280] + ('…' if len(description) > 280 else '')
        info = row.get('priceInfo') or {}
        summary['priceInfo'] = {'lowestProviderPrice': info.get('lowestProviderPrice'), 'prices': [{'priceCurrency': stage.get('priceCurrency'), 'price': stage.get('price', [])} for stage in info.get('prices', [])]}
        summaries.append(summary)
    (ROOT / 'src/content/models-overseas.json').write_text(json.dumps(summaries, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'models': len(details), 'detailsVerified': len(details) - len(failures), 'failures': failures}, ensure_ascii=False))


if __name__ == '__main__':
    main()
