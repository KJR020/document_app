# Document Management Application

- イミュータブルデータモデリングの学習・検証を目的としたドキュメント管理アプリケーション
- `世代バージョンタグ付けパターン`を採用し、ドキュメントのバージョン管理をサポート
  - 参考：WEB+DB PRESS編集部. WEB+DB PRESS Vol.130 (p.90). 株式会社技術評論社.

![alt text](document/img/image.png)

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
- ドキュメントのバージョン管理

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
