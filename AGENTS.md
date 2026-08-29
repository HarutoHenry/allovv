<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Allovv の事業内容（文章を書く前に必ず読むこと）

**「メール返信ドラフト自動作成サービス」を Allovv の主力事業として書かないこと。** 返信文の自動生成は数ある提供例のひとつに過ぎない。

事業の柱は **AI導入コンサルティング全般** と **AIクリエイティブ制作**。3つの領域は `src/components/business-section.tsx` の記述が正:

- **Platform / AIにおまかせ起業**（個人向け）— 起業の手続き・書類作成・専門家連携をAIで自動化
- **Consulting / AI導入コンサルティング**（法人向け）— 業務フロー分析からAIツール選定・導入・定着まで伴走。入り口となる「AIで改善できる業務の洗い出し」が中心的な提供価値
- **Creative / AIクリエイティブ制作**（法人向け）— 画像・動画・広告コピーなど

サイト本文・ニュース記事・提案文など事業を説明するあらゆる場面で、単機能を主語にせず「業務を洗い出し、AIで置き換えられるところから実装する」という枠で書く。

# サイトの更新とデプロイ（2026-08-30 追加・必ず守る）

**本番に出すときは `./deploy.sh` を使う。`npx vercel --prod` を直接叩かない。**

deploy.sh が自動でやること＝①main にいるか確認 ②GitHub の最新を取って遅れ・枝分かれがないか確認
③未コミットの変更をコミット ④ビルド確認 ⑤本番デプロイ ⑥GitHub へ push。
このどれか一つでも飛ばすと、本番が古い状態に巻き戻る。

## 絶対にやってはいけないこと

- **古いコミットからブランチを切って、そこに変更を足して本番に出す。**
  2026-08-30 にこれで事故が起きた。ニュース記事1本を追加するのに、8コミット前の
  コミットから `deploy-news` ブランチを切って記事だけ cherry-pick し、それが origin/main に
  なったため、料金プラン・フッター・business セクション・/services/web が本番から全部消えた。
  **記事1本でも、変更は必ず main の先端の上に足す。**
- **未コミットのまま本番に出して放置する。** ローカルにしか無い状態ができ、
  次に誰かが GitHub 側から作業すると消える。
- **ローカルが origin/main より遅れているのに push・デプロイする。**

## 迷ったときの確認コマンド

```
git status            # 未コミットの変更があるか
git fetch origin && git status   # GitHub と比べて進んでいるか遅れているか
git log --oneline -5  # いま何が入っているか
```

`ahead` も `behind` も出ず、`nothing to commit` なら、ローカル＝GitHub＝本番で揃っている。
