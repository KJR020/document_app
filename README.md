# Document Management Application

- イミュータブルデータモデリングの学習・検証を目的としたドキュメント管理アプリケーション
- `世代バージョンタグ付けパターン`を採用し、ドキュメントのバージョン管理をサポート
  - 参考：WEB+DB PRESS編集部. WEB+DB PRESS Vol.130 (p.90). 株式会社技術評論社.

![alt text](document/img/image.png)

## ERD

```mermaid
erDiagram

  %% ユーザー(R)
  users {
    int id PK
    varchar username
    varchar email
    varchar password_hash
    timestamp created_at
  }
  %% ドキュメント(R)
  documents {
    int id PK
    int created_by FK
    timestamp created_at
  }
  document_versions {
    int id PK
    int document_id FK
    varchar name
    text content
    int parent_directory_id FK
    int document_change_id FK
    timestamp created_at
  }
  %% 現在のバージョン
  %% `UPDATE`,`DELETE`を許容するテーブル
  %% 削除した場合は、
  current_document_versions {
    int document_id PK
    int version_id FK 
    timestamp applied_at
  }
  %% STPで作成/更新/削除の操作履歴を管理
  document_changes {
    int id PK
    int document_id FK
    varchar change_type
    int changed_by FK
    timestamp changed_at
  }

  %% ディレクトリ(R)
  directories {
    int id PK
    varchar name
    int created_by FK
    timestamp created_at
  }
  directory_versions {
    int id PK
    int directory_id FK
    varchar name
    int directory_change_id FK
    timestamp created_at
  }
  %% 現在のバージョン
  %% `UPDATE`,`DELETE`を許容するテーブル
  current_directory_versions {
    int directory_id PK
    int version_id FK
    timestamp applied_at
  }
  %% STPで作成/更新/削除の操作履歴を管理
  directory_changes {
    int id PK
    int directory_id FK
    int version_id FK
    varchar change_type
    int changed_by FK
    timestamp changed_at
  }

  %% ディレクトリの階層構造(閉包テーブル)
  %% `DELETE`を許容する
  %% ディレクトリ移動の場合は閉包テーブルのレコードを`DELETE`して、再度`INSERT`する
  directory_hierarchy {
    int ancestor_id FK
    int descendant_id FK
    int depth
    timestamp created_at
  }
  %% ディレクトリの移動
  %% ディレクトリの階層構造はバージョン管理せず、ディレクトリ移動をイベントとして記録する
  %% 取り消す場合は、逆の移動を行う
  directory_moves {
    int id PK
    int target_directory_id FK
    int from_directory_id FK
    int to_directory_id FK
    int moved_by FK
    timestamp moved_at
  }

  %% リレーションシップ
  %% 主要なリレーションシップのみ記載
  users ||--o{ documents : "作成する"
  users ||--o{ document_changes : "操作を記録する"
  users ||--o{ directories : "作成する"
  users ||--o{ directory_changes : "操作を記録する"
  users ||--o{ directory_hierarchy : "作成する"
  users ||--o{ directory_moves : "操作を記録する"
  
  documents ||--|{ document_versions : "世代を管理する"
  documents ||--|| current_document_versions : "現在のバージョンを管理する"
  documents ||--o{ document_changes : "変更を管理する"
  
  document_versions ||--o{ current_document_versions : "現在のバージョンを管理する"
  document_versions ||--o{ document_changes : "変更を記録する"
  
  directories ||--|{ directory_versions : "世代を管理する"
  directories ||--|| current_directory_versions : "現在のバージョンを管理する"
  directories ||--o{ directory_changes : "変更を管理する"
  directories ||--o{ directory_hierarchy : "階層構造を管理する"
  directories ||--o{ directory_moves : "移動を管理する"
  
  directory_versions ||--o{ current_directory_versions : "現在のバージョンを管理する"
  directory_versions ||--o{ directory_changes : "変更を記録する"

```


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
