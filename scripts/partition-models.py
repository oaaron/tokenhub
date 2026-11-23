"""Partition the public snapshot so catalog navigation does not load every example."""
import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
source=root/'docs/source-audit/raw/models-full.json'
if source.exists(): full=json.loads(source.read_text())
else:
 index=json.loads((root/'src/content/models.json').read_text())
 full=[json.loads((root/'src/content/model-details'/f"{m['slug']}.json").read_text()) for m in index]
folder=root/'src/content/model-details';folder.mkdir(exist_ok=True)
summary=[]
for model in full:
 (folder/f"{model['slug']}.json").write_text(json.dumps(model,ensure_ascii=False,indent=2))
 keys=['slug','uniqueId','name','displayName','provider','contextLength','maxCompletionTokens','maxTokens','currency','inPrice','outPrice','inPriceZh','outPriceZh','tagList','minDiscountRate','publishedTime','modelProtocolCompatibility','sourceUrl']
 row={k:model.get(k) for k in keys}
 text=model.get('zhDescription') or model.get('description') or ''
 row['zhDescription']=text[:280]+('…' if len(text)>280 else '')
 info=model.get('priceInfo') or {}
 row['priceInfo']={'lowestProviderPrice':info.get('lowestProviderPrice'),'prices':[{'priceCurrency':stage.get('priceCurrency'),'price':stage.get('price',[])} for stage in info.get('prices',[])]}
 summary.append(row)
(root/'src/content/models.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
print(f'Partitioned {len(summary)} models.')
