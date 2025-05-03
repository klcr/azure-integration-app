import React from 'react';
import { Button } from '@fluentui/react-components';
import { useAuth } from '../../features/auth/authProvider';

interface LoginPromptProps {
  message?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ 
  message = 'このコンテンツを表示するにはサインインが必要です'
}) => {
  const { login } = useAuth();

  return (
    <div className="card" style={{ 
      backgroundColor: '#EFF6FC',
      textAlign: 'center',
      padding: '30px 20px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0 }}>認証が必要です</h3>
      <p>{message}</p>
      <Button appearance="primary" onClick={login}>
        Microsoft アカウントでサインイン
      </Button>
    </div>
  );
};

export default LoginPrompt;
