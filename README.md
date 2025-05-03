# Azure Web App 統合テストアプリケーション

Microsoft 365サービス（SharePoint、Outlook、Dataverse）と統合するテスト用Reactアプリケーションです。Microsoft Entra ID認証を使用して、各サービスへのシームレスなアクセスを提供します。

## 機能概要

### 1. マルチサービス統合
- **SharePoint連携**: ドキュメントの閲覧・管理
- **Dataverse連携**: ビジネスデータのエンティティとレコード操作
- **Outlook連携**: メールの閲覧・送信

### 2. 権限管理ダッシュボード
- 各サービスの権限状態の可視化
- 権限スコープの詳細表示
- 管理者同意が必要な権限の識別

### 3. 認証フロー
- Microsoft Entra ID (Azure AD) 認証
- MSAL (Microsoft Authentication Library) 実装
- サイレント認証とリダイレクト認証の両対応

### 4. UI機能
- 未認証時のアプリケーション機能閲覧
- レスポンシブデザイン
- Fluent UI Reactコンポーネント

## 始め方

### 前提条件
- Node.js 16.x以上
- Azure/Microsoft 365アカウント
- Microsoft Entra IDでのアプリケーション登録

### セットアップ

1. リポジトリのクローン:
```
git clone https://github.com/yourusername/azure-integration-app.git
cd azure-integration-app
```

2. 依存パッケージのインストール:
```
npm install
```

3. 環境変数の設定:
`.env.local`ファイルを作成して以下の環境変数を設定:
```
REACT_APP_CLIENT_ID=your-client-id
REACT_APP_TENANT_ID=your-tenant-id
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_DATAVERSE_URL=https://your-org.crm.dynamics.com
REACT_APP_SHAREPOINT_SITE=/sites/your-site
```

4. 開発サーバーの起動:
```
npm start
```

## プロジェクト構造

```
azure-integration-app/
│
├── src/
│   ├── app/                  # アプリケーションロジック
│   │   ├── store/            # 状態管理
│   │   └── types/            # 型定義
│   │
│   ├── components/           # UIコンポーネント
│   │   ├── common/           # 共通コンポーネント
│   │   ├── dashboard/        # ダッシュボード関連
│   │   ├── auth/             # 認証関連
│   │   ├── sharepoint/       # SharePoint関連
│   │   ├── dataverse/        # Dataverse関連
│   │   └── outlook/          # Outlook関連
│   │
│   ├── features/             # 機能モジュール
│   │   ├── auth/             # 認証機能
│   │   ├── sharepoint/       # SharePoint機能
│   │   ├── dataverse/        # Dataverse機能
│   │   └── outlook/          # Outlook機能
│   │
│   ├── hooks/                # カスタムフック
│   ├── pages/                # ページ
│   ├── services/             # サービス層
│   └── utils/                # ユーティリティ
│
└── public/                   # 静的ファイル
    └── web.config            # Azure Web App用構成
```

## 主要機能の使い方

### 認証

アプリケーションは未認証でも機能の概要を確認できますが、実際のデータアクセスには認証が必要です。ヘッダーの「サインイン」ボタンをクリックして、Microsoft アカウントでログインしてください。

### ダッシュボード

ダッシュボードページでは以下の情報を確認できます：
- 権限状態の概要
- 各サービスの詳細な権限スコープ
- 接続状態の可視化
- アクティビティの概要

### SharePoint連携

SharePointページでは以下の機能を使用できます：
- ドキュメントライブラリの閲覧
- ファイルメタデータの表示
- ファイルへの直接リンク

### Dataverse連携

Dataverseページでは以下の機能を使用できます：
- エンティティ一覧の表示
- エンティティのメタデータ確認
- エンティティの検索とフィルタリング

### Outlook連携

Outlookページでは以下の機能を使用できます：
- メールの閲覧
- メールメタデータの表示
- 添付ファイルの確認

## デプロイ

### Azure Web Appへのデプロイ

1. アプリケーションのビルド:
```
npm run build
```

2. Azure Web Appへのデプロイ（CI/CD経由、または手動）:
   - GitHub Actions: `.github/workflows/azure-deploy.yml`を参照
   - Azure CLI: `az webapp deployment source config-zip`
   - VS Code: Azure App Service拡張機能を使用

### 環境設定

本番環境用の設定は`.env.production`ファイルで管理します:
```
REACT_APP_CLIENT_ID=your-production-client-id
REACT_APP_TENANT_ID=your-production-tenant-id
REACT_APP_REDIRECT_URI=https://your-app-name.azurewebsites.net
```

## 技術スタック

- **フロントエンド**: React, TypeScript
- **UI**: Fluent UI React
- **認証**: MSAL (Microsoft Authentication Library)
- **API接続**: Axios
- **ルーティング**: React Router
- **デプロイ**: Azure Web App

## ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

MIT Licenseは以下を許可します:
- ソフトウェアの使用、コピー、変更、結合、公開、配布、サブライセンス、販売
- 同じライセンスの下でのソフトウェアの再配布
- 商用利用

制約:
- ソフトウェアは「現状のまま」提供され、いかなる保証もありません
- 著作権表示とこのライセンス表示をソフトウェアのすべてのコピーまたは重要な部分に含める必要があります

## 貢献

プロジェクトへの貢献を歓迎します。プルリクエストを送信する前に、以下の点にご注意ください:

1. 新機能のための新しいブランチを作成してください
2. コードスタイルガイドに従ってください
3. 適切なテストを追加してください
4. プルリクエストでは変更内容を詳しく説明してください

## 謝辞

- [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Microsoft Graph API](https://developer.microsoft.com/en-us/graph)
- [Fluent UI React](https://developer.microsoft.com/en-us/fluentui)
