"""Read-only public reference snapshot. No account or inference requests."""
import json, urllib.request, concurrent.futures, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
RAW=ROOT/'docs/source-audit/raw'
RAW.mkdir(parents=True,exist_ok=True)
base='https://maas.antdigital.com'
def fetch(path):
 with urllib.request.urlopen(base+path,timeout=30) as r:
  result=json.load(r)
 if not result.get('success'): raise RuntimeError(str(result))
 return result['data']
models=fetch('/api/v1/model-service/public/page-list?page=1&pageSize=999')['items']
failures=[]
def detail(m):
 try:
  d=fetch('/api/v1/model-service/public/get/'+m['uniqueId'])
  return {**m,**d}
 except Exception as e:
  failures.append({'url':base+'/models/'+m['uniqueId'],'missing':'detail response','reason':str(e)})
  return m
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:models=list(pool.map(detail,models))
# Strip administrative metadata; retain public technical data and source provenance.
keys=['uniqueId','name','displayName','provider','description','zhDescription','longDescription','zhLongDescription','contextLength','maxCompletionTokens','maxTokens','currency','inPrice','outPrice','inPriceZh','outPriceZh','inHitCachePrice','inHitCreatePrice','tagList','type','typeList','supportedParametersDefaultValue','protocolParameters','modelProtocolCompatibility','minDiscountRate','priceInfo','publishedTime','offShelfFlag','offShelfDate','buyTypes','providers','extInfo','specs','capabilities','languages','scenarios','modelParameters','usageGuide','exampleCodes','agentIntegrations','providerDetails']
clean=[]
for m in models:
 row={k:m[k] for k in keys if k in m}
 row['sourceUrl']=base+'/models/'+m['uniqueId']
 row['slug']=m['uniqueId']
 # Public model descriptions are reference facts, not TokenHub availability promises.
 clean.append(row)
(RAW/'models-full.json').write_text(json.dumps(clean,ensure_ascii=False,indent=2))
(RAW/'model-detail-failures.json').write_text(json.dumps(failures,ensure_ascii=False,indent=2))
print(json.dumps({'models':len(clean),'detailsVerified':len(clean)-len(failures),'failures':failures},ensure_ascii=False))

# Runtime summary/detail partition is managed by scripts/partition-models.py.
