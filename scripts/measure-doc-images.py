"""Read public source images only to measure intrinsic sizes for neutral placeholders."""
import concurrent.futures, hashlib, json, pathlib, re, subprocess, urllib.request
source = json.loads(pathlib.Path('/tmp/velink-source-image-dimensions-unknown.json').read_text())
cache = pathlib.Path('/tmp/velink-source-images-metadata')
cache.mkdir(exist_ok=True)
def measure(url):
    path = cache / hashlib.sha256(url.encode()).hexdigest()
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        if not path.exists():
            with urllib.request.urlopen(request, timeout=25) as response:
                path.write_bytes(response.read(20_000_000))
        process = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(path)], capture_output=True, text=True)
        width = re.search(r'pixelWidth:\s+(\d+)', process.stdout)
        height = re.search(r'pixelHeight:\s+(\d+)', process.stdout)
        if not width or not height:
            return {'error': 'Cannot verify intrinsic raster dimensions: ' + process.stderr[:200]}
        return {'width': int(width[1]), 'height': int(height[1])}
    except Exception as error:
        return {'error': str(error)}
urls=list(dict.fromkeys(item['sourceUrl'] for item in source))
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results=dict(zip(urls,pool.map(measure,urls)))
path=pathlib.Path('src/content/docs.json')
docs=json.loads(path.read_text())
missing=[]
for doc in docs:
    illustrations=[]
    for item in source:
        if item['slug'] != doc['slug']: continue
        result=results[item['sourceUrl']]
        if 'error' in result:
            missing.append({**item, **result})
            continue
        section=item.get('sectionId')
        if not any(part['id']==section for part in doc['sections']): section=doc['sections'][0]['id']
        illustrations.append({'alt': item['alt'] or '参考文档配图占位', **result, 'sectionId': section})
    if illustrations: doc['illustrations']=illustrations
path.write_text(json.dumps(docs,ensure_ascii=False,indent=2)+'\n')
audit=pathlib.Path('docs/source-audit')
audit.mkdir(parents=True,exist_ok=True)
(audit/'missing-images.json').write_text(json.dumps(missing,ensure_ascii=False,indent=2)+'\n')
(audit/'image-dimensions.json').write_text(json.dumps([dict(item,**results[item['sourceUrl']]) for item in source if 'error' not in results[item['sourceUrl']]],ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'verifiedImages':sum(len(doc.get('illustrations',[])) for doc in docs),'missingImages':len(missing),'uniqueUrls':len(urls)}))
