import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { PermissionService, ServicePermissions } from '../features/auth/permissionService';
import { useAuth } from '../features/auth/authProvider';

export const usePermissions = () => {
  const { isAuthenticated } = useAuth();
  const { getApiClient } = useApi('');
  const [permissions, setPermissions] = useState<ServicePermissions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkPermissions = async () => {
    if (!isAuthenticated) {
      setPermissions([]);
      setError('ユーザーが認証されていません。');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const permissionService = new PermissionService(getApiClient());
      const allPermissions = await permissionService.getAllPermissions();
      
      setPermissions(allPermissions);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Permission check error:', err);
      setError('権限確認中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  // 認証状態が変わったら権限チェックを実行
  useEffect(() => {
    if (isAuthenticated) {
      checkPermissions();
    }
  }, [isAuthenticated]);

  return {
    permissions,
    loading,
    error,
    lastChecked,
    checkPermissions
  };
};
