"""Verify a static review build without browser or external services."""
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote,urlsplit
import json

root=Path('out')
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=set();self.refs=[]
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if attrs.get('id'):self.ids.add(attrs['id'])
  key='href' if tag in ('a','link') else 'src' if tag in ('script','img','audio','track','source') else None
  if key and attrs.get(key):self.refs.append(attrs[key])
pages={}
for file in root.rglob('*.html'):
 page=Page();page.feed(file.read_text());pages[file]=page
assert pages,'No exported HTML found'
checked=0
for file,page in pages.items():
 for ref in page.refs:
  url=urlsplit(ref)
  if url.scheme or url.netloc:continue
  dest=root/unquote(url.path.lstrip('/')) if url.path.startswith('/') else file.parent/unquote(url.path) if url.path else file
  if dest.is_dir():dest=dest/'index.html'
  assert dest.exists(),f'Missing local target: {file}: {ref}'
  if url.fragment and dest in pages:assert unquote(url.fragment) in pages[dest].ids,f'Missing anchor: {ref}'
  checked+=1
scenarios={s['id']:s for s in json.loads(Path('app/demo-scenarios.json').read_text())}
for sample,media in json.loads(Path('app/demo-audio.json').read_text()).items():
 for key in ('src','captions','transcript'):
  asset=root/media[key].lstrip('/')
  assert asset.exists(),f'Missing {sample} {key}'
 assert (root/media['src'].lstrip('/')).stat().st_size>100000,f'Truncated {sample} audio'
 assert len(media['cues'])==len(scenarios[sample]['messages'])>=10
 assert media['duration']>=60 and media['cues'][-1]['end']>=60,f'{sample} must contain at least a minute of conversation'
 assert all(cue['end']>cue['start']>=0 for cue in media['cues'])
 assert all(a['end']<=b['start'] for a,b in zip(media['cues'],media['cues'][1:]))
 captions=(root/media['captions'].lstrip('/')).read_text()
 transcript=(root/media['transcript'].lstrip('/')).read_text()
 for _,message in scenarios[sample]['messages']:
  assert message in captions and message in transcript,f'{sample} transcript does not match the conversation'
expected_logo='131c8dab4e3cb080cc43052d262fc2e3be0d1e6634541d29b743ca93a2f465d1'
assert sha256((root/'images/swift-ai-solutions-logo.png').read_bytes()).hexdigest()==expected_logo
assert not (root/'__qa-responsive.html').exists(),'QA fixture must not be published'
print(f'Export passed: {len(pages)} HTML pages, {checked} local targets, all 3 audio samples/captions, exact logo, no QA fixture.')
