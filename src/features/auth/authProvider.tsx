/**
 * Azure Integration App - Authentication Provider
 * 
 * Copyright (c) 2025 Azure Integration App Contributors
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

import React, { PropsWithChildren, useEffect, useState } from "react";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./msalConfig";

// MSALインスタンスの作成
export const msalInstance = new PublicClientApplication(msalConfig);

// 認証コンテキスト
interface AuthContextProps {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  getToken: async () => "",
});

// 認証ステータスプロバイダー
const AuthStatusProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<AccountInfo | null>(null);
  const isAuthenticated = accounts.length > 0;

  useEffect(() => {
    if (accounts.length > 0) {
      setUser(accounts[0]);
    } else {
      setUser(null);
    }
  }, [accounts]);

  const login = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await instance.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getToken = async (): Promise<string> => {
    try {
      if (accounts.length === 0) {
        throw new Error("No user is signed in");
      }

      const silentRequest = {
        scopes: loginRequest.scopes,
        account: accounts[0],
      };

      const response = await instance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // サイレント取得に失敗した場合はインタラクティブフローを実行
        // acquireTokenRedirectはPromiseを返しますが、トークンは返しません
        // リダイレクト後に再度getTokenが呼ばれるので、空文字を返す
        instance.acquireTokenRedirect(loginRequest);
        return "";
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// MSAL認証プロバイダー
export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthStatusProvider>{children}</AuthStatusProvider>
    </MsalProvider>
  );
};

// 認証フック
export const useAuth = () => {
  return React.useContext(AuthContext);
};
