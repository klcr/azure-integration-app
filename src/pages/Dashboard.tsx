import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../features/auth/authProvider';
import PermissionStatusSummary from '../components/dashboard/PermissionStatusSummary';
import PermissionCard from '../components/dashboard/PermissionCard';
import LoginPrompt from '../components/common/LoginPrompt';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { permissions, loading, error, lastChecked, checkPermissions } = usePermissions();

  return (
    <div>
      <h1>ダッシュボード</h1>
      
      {!isAuthenticated ? (
        <>
          <div className="card">
            <h2>ダッシュボード概要</h2>
            <p>
              このダッシュボードでは、以下の情報を確認できます：
            </p>
            <ul>
              <li>各サービスへの権限状態</li>
              <li>サービス接続ステータス</li>
              <li>最近のアクティビティ</li>
            </ul>
            <p>
              詳細な情報を見るにはサインインが必要です。
            </p>
          </div>
          
          <LoginPrompt message="サインインすると、権限状態やサービス接続の詳細情報を確認できます。" />
          
          <div className="section">
            <h2 className="section-header">利用可能なサービス</h2>
            <div className="grid">
              <div className="card">
                <h3>SharePoint</h3>
                <p>ドキュメント管理・共有</p>
              </div>
              <div className="card">
                <h3>Dataverse</h3>
                <p>ビジネスデータの保存・管理</p>
              </div>
              <div className="card">
                <h3>Outlook</h3>
                <p>メール・カレンダー管理</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {error && (
            <div className="card" style={{ backgroundColor: '#FEE2E2', marginBottom: '20px' }}>
              <p>{error}</p>
            </div>
          )}
          
          <PermissionStatusSummary 
            permissions={permissions}
            lastChecked={lastChecked}
            loading={loading}
            onRefresh={checkPermissions}
          />
          
          <div className="section">
            <h2 className="section-header">サービス権限の詳細</h2>
            
            {loading && <p>権限情報を取得中...</p>}
            
            {!loading && permissions.length === 0 && !error && (
              <div className="card">
                <p>権限情報はありません。サインインして権限を確認してください。</p>
              </div>
            )}
            
            {permissions.map((permission, index) => (
              <PermissionCard key={index} servicePermission={permission} />
            ))}
          </div>
          
          <div className="section">
            <h2 className="section-header">アクティビティの概要</h2>
            <div className="card">
              <p>最近のアクティビティはありません。</p>
            </div>
          </div>
          
          <div className="section">
            <h2 className="section-header">サービス接続ステータス</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="card">
                <h3 style={{ margin: '0 0 10px 0' }}>SharePoint</h3>
                <div style={{ 
                  backgroundColor: '#ECFAEC', 
                  padding: '6px 10px', 
                  borderRadius: '4px', 
                  display: 'inline-block',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  <span style={{ color: '#107C10' }}>接続済み</span>
                </div>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  最終アクセス: {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="card">
                <h3 style={{ margin: '0 0 10px 0' }}>Dataverse</h3>
                <div style={{ 
                  backgroundColor: '#FFF8E6', 
                  padding: '6px 10px', 
                  borderRadius: '4px', 
                  display: 'inline-block',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  <span style={{ color: '#FFB900' }}>一部接続</span>
                </div>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  最終アクセス: {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="card">
                <h3 style={{ margin: '0 0 10px 0' }}>Outlook</h3>
                <div style={{ 
                  backgroundColor: '#ECFAEC', 
                  padding: '6px 10px', 
                  borderRadius: '4px', 
                  display: 'inline-block',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  <span style={{ color: '#107C10' }}>接続済み</span>
                </div>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  最終アクセス: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
