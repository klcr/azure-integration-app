import React from 'react';
import { useAuth } from '../features/auth/authProvider';
import LoginPrompt from '../components/common/LoginPrompt';

const Settings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div>
      <h1>設定</h1>
      
      {!isAuthenticated ? (
        <>
          <div className="card">
            <h2>アプリケーション設定</h2>
            <p>
              このページでは、アプリケーションの設定と構成情報を確認・管理できます。
              ユーザー固有の設定を変更するにはサインインが必要です。
            </p>
          </div>
          
          <LoginPrompt message="サインインすると、アカウント情報やAPI設定などの詳細情報を確認できます。" />
          
          <div className="section">
            <h2 className="section-header">アプリケーション情報</h2>
            <div className="card">
              <p><strong>アプリケーション名:</strong> Azure Integration App</p>
              <p><strong>バージョン:</strong> 0.1.0</p>
              <p><strong>環境:</strong> {process.env.NODE_ENV}</p>
              <p><strong>説明:</strong> SharePoint、Outlook、Dataverseと統合するReactアプリケーション</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="section">
            <h2 className="section-header">アカウント情報</h2>
            <div className="card">
              {user ? (
                <div>
                  <p><strong>名前:</strong> {user.name}</p>
                  <p><strong>ユーザー名:</strong> {user.username}</p>
                  <p><strong>アカウントID:</strong> {user.localAccountId}</p>
                  <p><strong>環境:</strong> {process.env.NODE_ENV}</p>
                  <p><strong>テナントID:</strong> {process.env.REACT_APP_TENANT_ID}</p>
                </div>
              ) : (
                <p>ユーザー情報は利用できません。</p>
              )}
            </div>
          </div>
          
          <div className="section">
            <h2 className="section-header">API設定</h2>
            <div className="card">
              <p><strong>SharePointサイト:</strong> {process.env.REACT_APP_SHAREPOINT_SITE || '未設定'}</p>
              <p><strong>Dataverse URL:</strong> {process.env.REACT_APP_DATAVERSE_URL || '未設定'}</p>
            </div>
          </div>
          
          <div className="section">
            <h2 className="section-header">アプリケーション情報</h2>
            <div className="card">
              <p><strong>アプリケーション名:</strong> Azure Integration App</p>
              <p><strong>バージョン:</strong> 0.1.0</p>
              <p><strong>説明:</strong> SharePoint、Outlook、Dataverseと統合するReactアプリケーション</p>
            </div>
          </div>
          
          <div className="section">
            <h2 className="section-header">テーマ設定</h2>
            <div className="card">
              <p>テーマ設定はまだ利用できません。今後のバージョンで追加予定です。</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
