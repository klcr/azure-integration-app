import { useCallback } from 'react';
import { useAuth } from '../features/auth/authProvider';
import { createApiClient } from '../services/api';

export const useApi = (baseUrl: string) => {
  const { getToken } = useAuth();
  
  const getApiClient = useCallback(() => {
    return createApiClient(baseUrl, getToken);
  }, [baseUrl, getToken]);

  return { getApiClient };
};
