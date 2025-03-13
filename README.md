# Document Management Application

Next.jsとPrismaを使用したドキュメント管理アプリケーション。
データベース設計の検証を目的として簡易的な機能のみを実装。

## 技術スタック

- **Frontend**: Next.js 15.1.7 (App Router)
- **Styling**: Tailwind CSS
- **ORM**: Prisma
- **Database**: PostgreSQL 17 (Alpine)
- **Package Manager**: pnpm
- **開発環境**: Docker

## 機能

- ドキュメントの作成、読取、更新、削除（CRUD）
- ドキュメントの一覧表示
- カテゴリーとタグによる分類
- 公開/非公開設定

## セットアップ

### 前提条件

- Node.js
- pnpm
- Docker

### インストール手順

1. リポジトリのクローン：

```bash
git clone <repository-url>
cd document_app
```

2. 依存関係のインストール：

```bash
pnpm install
```

3. PostgreSQLコンテナの起動：

```bash
docker compose up -d
```

4. 環境変数の設定：

`.env`ファイルを作成し、以下の内容を設定：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres?schema=public"
```

5. データベースのマイグレーション：

```bash
pnpm prisma migrate dev
```

6. アプリケーションの起動：

```bash
pnpm dev
```


## API エンドポイント

### ドキュメント管理

- `GET /api/documents` - ドキュメント一覧の取得
- `POST /api/documents` - 新規ドキュメントの作成
- `GET /api/documents/[id]` - 特定のドキュメントの取得
- `PUT /api/documents/[id]` - ドキュメントの更新
- `DELETE /api/documents/[id]` - ドキュメントの削除

### リクエスト例

新規ドキュメントの作成：

```json
POST /api/documents
{
  "title": "サンプルドキュメント",
  "content": "ドキュメントの内容",
  "authorId": "ユーザーID",
  "categoryId": "カテゴリーID",
  "isPublic": true,
  "tagIds": ["タグ1のID", "タグ2のID"]
}
```

## データベース構造

### 主要なモデル

- `User` - ユーザー情報
- `Document` - ドキュメント情報
- `Category` - カテゴリー情報
- `Tag` - タグ情報

詳細なスキーマは `prisma/schema.prisma` を参照してください。

## 開発

### 新しいマイグレーションの作成

```bash
pnpm prisma migrate dev --name <migration-name>
```

### Prisma Clientの生成

```bash
pnpm prisma generate
```

### データベースの初期化

```bash
pnpm prisma migrate reset
