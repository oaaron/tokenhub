import re,urllib.request,concurrent.futures,json
html=urllib.request.urlopen('https://maas.antdigital.com/dt-maas-docs/intro',timeout=30).read().decode()
url=next(u for u in re.findall(r'<script[^>]+src="([^"]+)"',html) if '/umi.' in u)
s=urllib.request.urlopen(url,timeout=30).read().decode()
open('/tmp/velink-docs.js','w').write(s)
u=s[s.index('__webpack_require__.u=function'):s.index('__webpack_require__.miniCssF=')]
namepart=re.search(r'return\(\{(.*?)\}\[c\]\|\|c\)',u).group(1)
names=dict(re.findall(r'(\d+):"([^"]+)"',namepart));hashes=dict(re.findall(r'(\d+):"([a-f0-9]{8})"',u))
ids=[i for i,n in names.items() if n.startswith('docs__') and '.en-US' not in n]+['6785','6666','295','8577','1068','7467']
def fetch(i):
 name=names.get(i,i)+'.'+hashes[i]+'.async.js';url='https://edge.zkobjects.com/page/dt-maas-docs/'+name
 try:
  data=urllib.request.urlopen(url,timeout=25).read().decode();open('/tmp/velink-doc-'+i+'.js','w').write(data);return [i,names.get(i),len(data)]
 except Exception as e:return [i,str(e)]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as e:r=list(e.map(fetch,ids))
print(json.dumps(r,ensure_ascii=False));open('/tmp/velink-doc-chunks.json','w').write(json.dumps(r))
