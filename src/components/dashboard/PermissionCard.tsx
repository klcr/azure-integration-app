import React from 'react';
import { PermissionScope, ServicePermissions } from '../../features/auth/permissionService';

interface PermissionCardProps {
  servicePermission: ServicePermissions;
}

const PermissionCard: React.FC<PermissionCardProps> = ({ servicePermission }) => {
  // ステータスに基づいて色を設定
  const getStatusColor = (status: string) => {
    switch(status) {
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

  // 個別スコープのステータスアイコンを表示
  const getScopeStatusIcon = (granted: boolean) => {
    return granted 
      ? <span style={{ color: '#107C10', marginRight: '8px' }}>✓</span> 
      : <span style={{ color: '#D83B01', marginRight: '8px' }}>✗</span>;
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div
          style={{ 
            width: '16px', 
            height: '16px', 
            borderRadius: '50%', 
            backgroundColor: getStatusColor(servicePermission.status),
            marginRight: '8px' 
          }}
        />
        <h3 style={{ margin: 0 }}>{servicePermission.serviceName}</h3>
      </div>

      <div style={{ fontSize: '14px', marginBottom: '16px' }}>
        <p><strong>ステータス: </strong> 
          {servicePermission.status === 'granted' && '全ての権限が付与されています'}
          {servicePermission.status === 'partial' && '一部の権限が付与されています'}
          {servicePermission.status === 'missing' && '権限が付与されていません'}
        </p>
      </div>

      <h4 style={{ marginBottom: '10px' }}>権限スコープ</h4>
      <div style={{ fontSize: '14px' }}>
        {servicePermission.scopes.length === 0 ? (
          <p>利用可能な権限情報がありません</p>
        ) : (
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {servicePermission.scopes.map((scope: PermissionScope, index: number) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {getScopeStatusIcon(scope.granted)}
                <strong>{scope.scopeName}</strong>: {scope.description}
                {scope.adminConsentRequired && !scope.granted && (
                  <div style={{ fontSize: '12px', color: '#D83B01', marginTop: '4px', marginLeft: '23px' }}>
                    管理者の同意が必要です
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PermissionCard;
