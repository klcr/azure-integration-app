import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/authProvider';
import { ROUTES } from '../utils/constants';
import LoginPrompt from '../components/common/LoginPrompt';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      <div className="section">
        <h1>Azure Integration Appへようこそ！</h1>
        {isAuthenticated ? (
          <p>こんにちは、{user?.name || 'ユーザー'}さん！</p>
        ) : (
          <p>このアプリケーションはMicrosoft 365サービスとの統合を提供します。</p>
        )}
      </div>
      
      {!isAuthenticated && (
        <LoginPrompt message="サインインすると、SharePoint、Dataverse、Outlookなどのサービスにアクセスできます。" />
      )}

      <div className="section">
        <h2 className="section-header">統合サービス</h2>
        <div className="grid">
          <div className="card">
            <h3>SharePoint</h3>
            <p>SharePointドキュメントの閲覧・管理</p>
            <p>
              SharePointは、チームコラボレーションとドキュメント管理のためのプラットフォームです。
              このアプリでは、ドキュメントの閲覧・アップロード・ダウンロードが可能です。
            </p>
            <Link to={ROUTES.SHAREPOINT}>SharePointページへ</Link>
          </div>
          <div className="card">
            <h3>Dataverse</h3>
            <p>Dataverseエンティティとレコードの操作</p>
            <p>
              Dataverseは、ビジネスデータを安全に保存・管理するためのクラウドデータベースサービスです。
              このアプリでは、エンティティの閲覧やレコードの編集が可能です。
            </p>
            <Link to={ROUTES.DATAVERSE}>Dataverseページへ</Link>
          </div>
          <div className="card">
            <h3>Outlook</h3>
            <p>メールと予定表の管理</p>
            <p>
              Outlookは、Microsoft 365のメールとカレンダー管理サービスです。
              このアプリでは、メールの閲覧や送信、カレンダーイベントの管理が可能です。
            </p>
            <Link to={ROUTES.OUTLOOK}>Outlookページへ</Link>
          </div>
        </div>
      </div>
      
      <div className="section">
        <h2 className="section-header">主な機能</h2>
        <div className="card">
          <ul>
            <li>Microsoft Entra ID認証による安全なアクセス</li>
            <li>SharePointドキュメントライブラリへの統合</li>
            <li>Dataverseデータの閲覧と編集</li>
            <li>Outlookメールの閲覧と送信</li>
            <li>権限状態の可視化ダッシュボード</li>
            <li>各サービスに対する一元的なアクセス</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
