import React from 'react';
import { Button } from '@fluentui/react-components';
import { useAuth } from '../features/auth/authProvider';

const SignInPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <h1>Azure Integration App</h1>
          <p>Sign in to access SharePoint, Outlook, and Dataverse</p>
        </div>
        <Button appearance="primary" size="large" className="login-button" onClick={login}>
          Sign in with Microsoft
        </Button>
      </div>
    </div>
  );
};

export default SignInPage;
