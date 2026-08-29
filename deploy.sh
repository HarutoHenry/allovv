#!/bin/bash
# ==============================================================================
# allovv.com デプロイスクリプト
#
# これを使えば、どのフォルダ・どのセッションから更新しても
# 必ず「最新の状態」から本番が作られる。
#
# 使い方：  ./deploy.sh
#           ./deploy.sh "コミットメッセージ"
#
# 2026-08-30 作成。古いコミットから切ったブランチに記事だけ足して
# 本番が昔の見た目に戻る事故が起きたため、その再発防止。
# ==============================================================================
set -euo pipefail
cd "$(dirname "$0")"

RED=$'\033[31m'; GRN=$'\033[32m'; YEL=$'\033[33m'; OFF=$'\033[0m'
ng(){ echo "${RED}✗ $1${OFF}"; echo "  → $2"; exit 1; }
ok(){ echo "${GRN}✓ $1${OFF}"; }

echo "── allovv.com デプロイ ──────────────────────────"

# 1. main にいるか（古いブランチからのデプロイを禁じる。今回の事故の直接原因）
BR=$(git rev-parse --abbrev-ref HEAD)
[ "$BR" = "main" ] || ng "いま main ではなく '$BR' にいます" \
  "git switch main で main に戻ってからやり直す。古いブランチから本番に出すと、そのブランチに無い変更が全部消えます"
ok "ブランチ: main"

# 2. GitHub の最新を取ってくる
git fetch --quiet origin
LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main)
BASE=$(git merge-base main origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  if [ "$LOCAL" = "$BASE" ]; then
    ng "GitHub 側のほうが新しい（ローカルが遅れている）" \
       "git pull --rebase origin main で追いついてからやり直す。このまま出すと GitHub にある変更が消えます"
  elif [ "$REMOTE" != "$BASE" ]; then
    ng "ローカルと GitHub が枝分かれしています" \
       "git pull --rebase origin main で合流させる。判断がつかなければ止めて相談すること"
  fi
fi
ok "GitHub との差: 問題なし"

# 3. 未コミットの変更は必ずコミットする（コミット漏れ＝消える事故のもと）
if [ -n "$(git status --porcelain)" ]; then
  MSG="${1:-サイト更新 $(date '+%Y-%m-%d %H:%M')}"
  echo "${YEL}! 未コミットの変更があります。コミットします：${OFF} $MSG"
  git add -A
  git commit -q -m "$MSG"
  ok "コミット済み"
else
  ok "未コミットの変更なし"
fi

# 4. ビルドが通るか（壊れたものを本番に出さない）
echo "── ビルド確認 ──"
npm run build >/tmp/allovv-build.log 2>&1 || {
  tail -30 /tmp/allovv-build.log
  ng "ビルドが失敗しました" "上のエラーを直してからやり直す。全文は /tmp/allovv-build.log"
}
ok "ビルド通過"

# 5. 本番へ
echo "── 本番デプロイ ──"
npx vercel --prod --yes
ok "デプロイ完了"

# 6. GitHub にも反映（ここを飛ばすと、次に誰かが GitHub から作業して逆戻りする）
git push --quiet origin main
ok "GitHub に push 済み（origin/main = 本番と同じ中身）"

echo
echo "${GRN}完了。https://allovv.com を開いて確認してください。${OFF}"
