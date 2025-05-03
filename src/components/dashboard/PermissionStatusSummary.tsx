import React from 'react';
import { ServicePermissions } from '../../features/auth/permissionService';

interface PermissionStatusSummaryProps {
  permissions: ServicePermissions[];
  lastChecked: Date | null;
  loading: boolean;
  onRefresh: () => void;
}

const PermissionStatusSummary: React.FC<PermissionStatusSummaryProps> = ({ 
  permissions, 
  lastChecked, 
  loading,
  onRefresh
}) => {
  // 全体的な権限状態を判定
  const getOverallStatus = (): 'granted' | 'partial' | 'missing' => {
    if (permissions.length === 0) return 'missing';
    
    const allGranted = permissions.every(p => p.status === 'granted');
    const anyGranted = permissions.some(p => p.status === 'granted' || p.status === 'partial');
    
    if (allGranted) return 'granted';
    if (anyGranted) return 'partial';
    return 'missing';
  };

  // 状態に応じたヘッダーメッセージ
  const getStatusMessage = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'granted':
        return '全てのサービスへのアクセス権があります';
      case 'partial':
        return '一部のサービスへのアクセス権があります';
      case 'missing':
        return 'サービスへのアクセス権がありません';
      default:
        return '権限状態を確認中...';
    }
  };

  // 状態に応じたメインカラー
  const getStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'granted':
        return '#107C10'; // 緑
      case 'partial':
        return '#FFB900'; // 黄色
      case 'missing':
        return '#D83B01'; // 赤
      default:
        return '#767676'; // グレー
    }
  };

  return (
    <div className="card" style={{ marginBottom: '20px', borderTop: `4px solid ${getStatusColor()}` }}>
      <h2 style={{ marginTop: 0 }}>権限状態概要</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: getStatusColor() }}>{getStatusMessage()}</h3>
          {lastChecked && (
            <span style={{ fontSize: '14px', color: '#666' }}>
              最終確認: {lastChecked.toLocaleString()}
            </span>
          )}
        </div>
        
        <button 
          onClick={onRefresh} 
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0078D4',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '更新中...' : '権限を更新'}
        </button>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {permissions.map((perm, index) => (
          <div 
            key={index}
            style={{ 
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: 
                perm.status === 'granted' ? '#ECFAEC' : 
                perm.status === 'partial' ? '#FFF8E6' : '#FDEAE4',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <div 
              style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%',
                backgroundColor: 
                  perm.status === 'granted' ? '#107C10' : 
                  perm.status === 'partial' ? '#FFB900' : '#D83B01'
              }}
            />
            <span>{perm.serviceName}</span>
          </div>
        ))}
        
        {permissions.length === 0 && !loading && (
          <p>権限情報はありません。サインインして権限を確認してください。</p>
        )}
      </div>
    </div>
  );
};

export default PermissionStatusSummary;
