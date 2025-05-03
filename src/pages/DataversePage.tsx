import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../features/auth/authProvider';
import { DataverseService, DataverseEntity } from '../features/dataverse/dataverseService';
import { API_ENDPOINTS } from '../utils/constants';
import LoginPrompt from '../components/common/LoginPrompt';

const DataversePage: React.FC = () => {
  const [entities, setEntities] = useState<DataverseEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getApiClient } = useApi('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchEntities = async () => {
      try {
        setLoading(true);
        const dataverseUrl = API_ENDPOINTS.DATAVERSE;
        
        if (!dataverseUrl) {
          setError('Dataverse URLが設定されていません。環境設定を確認してください。');
          return;
        }
        
        const dataverseService = new DataverseService(getApiClient(), dataverseUrl);
        const entityList = await dataverseService.getEntities();
        setEntities(entityList);
        setError(null);
      } catch (err) {
        console.error('Error fetching Dataverse entities:', err);
        setError('Dataverseエンティティの取得に失敗しました。接続と権限を確認してください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntities();
  }, [getApiClient, isAuthenticated]);

  return (
    <div>
      <h1>Dataverse エンティティ</h1>
      
      {!isAuthenticated ? (
        <>
          <div className="card">
            <h2>Dataverse統合について</h2>
            <p>
              Microsoft Dataverseは、ビジネスデータを低コードで保存、管理するためのクラウドデータベースサービスです。
              Power PlatformやDynamics 365アプリケーションのバックエンドとして使用されます。
            </p>
            <p>
              このアプリケーションでは、以下のDataverse機能にアクセスできます:
            </p>
            <ul>
              <li>エンティティ（テーブル）の一覧表示</li>
              <li>エンティティの属性（フィールド）情報の表示</li>
              <li>レコードの作成・読み取り・更新・削除</li>
              <li>ビジネスデータの可視化</li>
            </ul>
          </div>
          
          <LoginPrompt message="サインインすると、Dataverseエンティティを閲覧・操作できます。" />
          
          <div className="card">
            <h3>Dataverseの主な特徴</h3>
            <ul>
              <li>セキュアなデータストレージと高度なデータモデリング</li>
              <li>リレーショナルデータベースの機能（リレーションシップ、ビジネスルール）</li>
              <li>ロールベースのセキュリティモデル</li>
              <li>Microsoft Entra IDとの統合</li>
              <li>Power Platform（Power Apps、Power Automate、Power BI）との連携</li>
              <li>API経由の柔軟なデータアクセス</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          {loading && <p>エンティティを読み込み中...</p>}
          
          {error && (
            <div className="card" style={{ backgroundColor: '#FEE2E2' }}>
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && entities.length === 0 && (
            <p>エンティティが見つからないか、アクセス権限がありません。</p>
          )}
          
          {!loading && !error && entities.length > 0 && (
            <div className="section">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>表示名</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>エンティティセット名</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>主キー属性</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity) => (
                    <tr key={entity.entitySetName}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        {entity.displayName}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        {entity.entitySetName}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        {entity.primaryIdAttribute}
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

export default DataversePage;
