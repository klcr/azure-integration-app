import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../features/auth/authProvider';
import { SharePointService, SharePointFile } from '../features/sharepoint/sharePointService';
import LoginPrompt from '../components/common/LoginPrompt';

const SharePointPage: React.FC = () => {
  const [files, setFiles] = useState<SharePointFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getApiClient } = useApi('https://graph.microsoft.com/v1.0');
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchSharePointFiles = async () => {
      try {
        setLoading(true);
        
        const sharePointService = new SharePointService(getApiClient());
        const siteUrl = process.env.REACT_APP_SHAREPOINT_SITE || '';
        
        // 実際のアプリケーションでは、これらのIDをキャッシュまたは状態として保存することを検討してください
        const siteId = await sharePointService.getSiteId(siteUrl);
        const drives = await sharePointService.getDrives(siteId);
        
        if (drives.length > 0) {
          const driveId = drives[0].id;
          const fileList = await sharePointService.getFiles(siteId, driveId);
          setFiles(fileList);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching SharePoint files:', err);
        setError('SharePointファイルの取得に失敗しました。後ほど再試行してください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSharePointFiles();
  }, [getApiClient, isAuthenticated]);
  
  return (
    <div>
      <h1>SharePoint ドキュメント</h1>
      
      {!isAuthenticated ? (
        <>
          <div className="card">
            <h2>SharePoint統合について</h2>
            <p>
              SharePointは、ファイル共有やチームコラボレーションを可能にするMicrosoft 365サービスです。
              このアプリケーションでは、以下の機能を提供しています:
            </p>
            <ul>
              <li>SharePointドキュメントの閲覧</li>
              <li>ドキュメントのアップロードとダウンロード</li>
              <li>フォルダ構造の閲覧とナビゲーション</li>
              <li>ファイルのメタデータの表示</li>
            </ul>
          </div>
          
          <LoginPrompt message="サインインすると、SharePointドキュメントを閲覧・操作できます。" />
          
          <div className="card">
            <h3>SharePoint連携の利点</h3>
            <p>
              • ドキュメントを一元管理し、アプリケーション内から直接アクセス<br />
              • Microsoft 365環境との統合による効率向上<br />
              • ファイル操作のための一貫したインターフェース<br />
              • 他のサービス（Dataverse、Outlook）とのシームレスな連携
            </p>
          </div>
        </>
      ) : (
        <>
          {loading && <p>ドキュメントを読み込み中...</p>}
          
          {error && (
            <div className="card" style={{ backgroundColor: '#FEE2E2' }}>
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && files.length === 0 && (
            <p>ドキュメントが見つかりませんでした。</p>
          )}
          
          {!loading && !error && files.length > 0 && (
            <div className="section">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>名前</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>最終更新日</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>サイズ</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        <a href={file.webUrl} target="_blank" rel="noopener noreferrer">
                          {file.name}
                        </a>
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        {new Date(file.lastModifiedDateTime).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        {(file.size / 1024).toFixed(2)} KB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SharePointPage;
