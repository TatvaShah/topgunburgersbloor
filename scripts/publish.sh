#!/bin/bash
# usage: scripts/publish.sh <slug>   (run inside the site folder after npm run build passes)
# PREMIUM kit. Creates a NEW public repo TatvaShah/<slug>, pushes main, creates the Vercel project, deploys, and checks the live page.
# Refuses to touch a repo that already exists (client and demo repos are off limits).
# Needs GITHUB_DEMO_REPOS_TOKEN and VERCEL_DEMO_TOKEN in the env. Never echo them.
set -e -o pipefail
S=$1; [ -z "$S" ] && { echo "usage: publish.sh slug"; exit 1; }
T=team_9ZHZvr9YDU86u51UFYgw6o8M
GH="Authorization: Bearer $GITHUB_DEMO_REPOS_TOKEN"; VH="Authorization: Bearer $VERCEL_DEMO_TOKEN"
code=$(curl -s -o /dev/null -w "%{http_code}" -H "$GH" "https://api.github.com/repos/TatvaShah/$S")
[ "$code" = "404" ] || { echo "TatvaShah/$S already exists (HTTP $code). Pick a new slug; never push to an existing repo."; exit 1; }
grep -q "Website by" components/site-footer.tsx || { echo "footer credit missing"; exit 1; }
curl -s -X POST -H "$GH" https://api.github.com/user/repos -d "{\"name\":\"$S\",\"private\":false,\"description\":\"Demo website by ClaudAura\"}" | python3 -c "import json,sys;d=json.load(sys.stdin);print('repo:',d.get('html_url') or d.get('message'))"
# Static share image: WhatsApp and Instagram ignore previews over about 300 KB.
[ -d node_modules ] || npm ci --silent
npm run og
OGB=$(stat -c%s public/og.jpg); [ "$OGB" -lt 204800 ] || { echo "public/og.jpg is $OGB bytes, must be under 200 KB"; exit 1; }
rm -rf node_modules .next
[ -d .git ] || git init -q -b main
git add -A && git -c user.name="TatvaShah" -c user.email="43009439+TatvaShah@users.noreply.github.com" commit -qm "Demo site for $S" || true
git push -q "https://x-access-token:${GITHUB_DEMO_REPOS_TOKEN}@github.com/TatvaShah/$S.git" main 2>&1 | sed "s/${GITHUB_DEMO_REPOS_TOKEN}/***/g"
curl -s -X POST -H "$VH" -H "Content-Type: application/json" "https://api.vercel.com/v10/projects?teamId=$T" -d "{\"name\":\"$S\",\"framework\":\"nextjs\",\"gitRepository\":{\"type\":\"github\",\"repo\":\"TatvaShah/$S\"}}" | python3 -c "import json,sys;d=json.load(sys.stdin);print('project:',d.get('name'),d.get('error'))"
curl -s -X PATCH -H "$VH" -H "Content-Type: application/json" "https://api.vercel.com/v9/projects/$S?teamId=$T" -d '{"ssoProtection":null}' | python3 -c "import json,sys;d=json.load(sys.stdin);print('sso:',d.get('ssoProtection'),d.get('error'))"
DID=$(curl -s -X POST -H "$VH" -H "Content-Type: application/json" "https://api.vercel.com/v13/deployments?teamId=$T&forceNew=1" -d "{\"name\":\"$S\",\"project\":\"$S\",\"target\":\"production\",\"gitSource\":{\"type\":\"github\",\"org\":\"TatvaShah\",\"repo\":\"$S\",\"ref\":\"main\"}}" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('id') or d)")
echo "deploy: $DID"
DOM=$(cat .site-domain 2>/dev/null || echo "$S.vercel.app")
if [ "$DOM" != "$S.vercel.app" ]; then
  curl -s -X POST -H "$VH" -H "Content-Type: application/json" "https://api.vercel.com/v10/projects/$S/domains?teamId=$T" -d "{\"name\":\"$DOM\"}" | python3 -c "import json,sys;d=json.load(sys.stdin);print('domain:',d.get('name'),d.get('error'))"
fi
for i in $(seq 1 60); do st=$(curl -s -H "$VH" "https://api.vercel.com/v13/deployments/$DID?teamId=$T" | python3 -c "import json,sys;print(json.load(sys.stdin).get('readyState'))"); [ "$st" = READY ] || [ "$st" = ERROR ] && break; sleep 10; done
echo "state: $st"
sleep 5
U=https://$DOM
curl -sL -o /tmp/$S.html -w "http %{http_code}\n" $U
python3 - <<P
import re
h=open('/tmp/$S.html').read()
print('title:',re.search(r'<title>(.*?)</title>',h).group(1) if '<title>' in h else None)
og=re.search(r'property="og:image" content="([^"]+)"',h); print('og:',og.group(1) if og else None)
print('double hyphen in visible text:', '-'*2 in re.sub(r'<(script|style)[^>]*>.*?</\1>|<[^>]+>','',h,flags=re.S))
P
curl -sI "https://$DOM/og.jpg" | grep -iE "^(HTTP|content-type|content-length)" | tr -d "\r"
mkdir -p /workspace/claudaura-prospects/premium-showcase
google-chrome --headless --disable-gpu --hide-scrollbars --window-size=1280,800 --screenshot=/workspace/claudaura-prospects/premium-showcase/$S-quick.png $U >/dev/null 2>&1 || true
echo "live: $U"
