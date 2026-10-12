"""Read-only SEO checks against a running local preview. No contact form is sent."""
import json
import sys
import urllib.request
import urllib.error
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3000'
PUBLIC = 'https://www.allovv.com'
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.meta={}; self.canon=[]; self.links=[]; self.ids=set(); self.h1=0; self.title=''; self.json=[]; self.mode=None; self.buf=''; self.text=[]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canon.append(a.get('href'))
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='h1': self.h1+=1
        if tag=='title': self.mode='title';self.buf=''
        if tag=='script': self.mode='json' if a.get('type')=='application/ld+json' else 'script';self.buf=''
    def handle_data(self, text):
        if self.mode: self.buf+=text
        else: self.text.append(text)
    def handle_endtag(self, tag):
        if tag=='title': self.title=self.buf; self.mode=None
        if tag=='script':
            if self.mode=='json': self.json.extend([json.loads(self.buf)] if self.buf.startswith('{') else json.loads(self.buf))
            self.mode=None

def fetch(path):
    try:
        with urllib.request.urlopen(BASE+path, timeout=30) as r:return r.status, r.read().decode(), r.geturl()
    except urllib.error.HTTPError as e:return e.code,e.read().decode(),e.geturl()

status, xml, _ = fetch('/sitemap.xml'); assert status==200
urls=[n.text for n in ET.fromstring(xml).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls)==len(set(urls))
pages={}
for url in urls:
    assert url.startswith(PUBLIC) and '/admin' not in url
    path=urllib.parse.urlsplit(url).path or '/'
    status, html, _=fetch(path)
    assert status==200, (path,status)
    page=Page(html);pages[path]=page
    assert page.title and page.meta.get('description'), path
    assert page.h1==1, (path,'h1',page.h1)
    assert page.canon==[url], (path,page.canon,url)
    assert 'noindex' not in page.meta.get('robots',''),path
    assert page.meta.get('og:title') and page.meta.get('og:image'),path
    assert len(page.json)>=2,path
    print('PASS',path)
assert len({p.title for p in pages.values()})==len(pages),'duplicate titles'
for path,page in pages.items():
    for href in page.links:
        target=urllib.parse.urlsplit(urllib.parse.urljoin(PUBLIC+path,href))
        if target.netloc!='www.allovv.com' or target.scheme not in ('http','https'):continue
        dest=target.path or '/'
        if dest in pages:
            if target.fragment: assert urllib.parse.unquote(target.fragment) in pages[dest].ids, (path,href,'missing fragment')
        elif not dest.startswith(('/api/','/admin','/_next/')) and '.' not in dest.split('/')[-1]:
            status,_,_=fetch(dest);assert status==200,(path,href,status)
consulting=''.join(pages['/services/ai-consulting'].text)
assert '人気No.1' not in consulting and '80%削減' not in consulting
for name in ['不動産','物流・運送','人が確認すること','何を一緒に作るのか']:assert name in consulting
for path in ['/guides/ai-workflow','/guides/fde-dx-ax-si']:
    assert any(o.get('@type')=='Article' for o in pages[path].json)
    assert len(''.join(pages[path].text))>1500
status,robots,_=fetch('/robots.txt');assert status==200 and 'Disallow: /admin' in robots and 'Disallow: /api/' in robots and PUBLIC+'/sitemap.xml' in robots
status,html,_=fetch('/this-page-does-not-exist-seo-check');assert status==404 and 'noindex' in Page(html).meta.get('robots','')
status,html,_=fetch('/admin/login');assert status==200 and 'noindex' in Page(html).meta.get('robots','')
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args):return None
try:urllib.request.build_opener(NoRedirect()).open(BASE+'/cases')
except urllib.error.HTTPError as e:assert e.code==308 and e.headers['Location']=='/services/ai-consulting'
else:raise AssertionError('missing /cases permanent redirect')
print('PASS unique titles, canonical, metadata, structured data, internal links/anchors, crawl rules, noindex, 404, 308 redirect')
print('TOTAL',len(pages),'public pages')
