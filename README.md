# 概要
YACで提出するアプリのバックエンドです

# 環境構築
1. ローカルにクローン
2. ルートディレクトリで`bun install`を叩いて依存関係のインストール
3. ルートディレクトリで`docker compose up -d`を叩いてdockerコンテナの起動
4. ルートディレクトリで`bun generate`を叩いてdbスキーマの生成
5. ルートディレクトリで`bun migrate:seed`を叩いてdbのマイグレーションシードデータを追加
6. http://localhost:8080/ui にアクセスしてSwagger UIが起動してapi一覧が表示されていることを確認 or http://localhost:8080/articles にアクセスしてレスポンスが表示されていることを確認

# 技術選定
- フレームワーク：Hono
- ORM：drizzle ORM
- postgreSQL
- コンテナ：docker
- スキーマ管理：openapi