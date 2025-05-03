import React from 'react';
import { Button } from '@fluentui/react-components';
import { useAuth } from '../../features/auth/authProvider';

const Header: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-title">
        <h1>Azure Integration App</h1>
      </div>
      <div className="header-user">
        {isAuthenticated && user ? (
          <div className="user-info">
            <span className="user-name">{user.name || user.username}</span>
            <Button appearance="transparent" onClick={logout}>
              サインアウト
            </Button>
          </div>
        ) : (
          <Button appearance="primary" onClick={login}>
            サインイン
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
