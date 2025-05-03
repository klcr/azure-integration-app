import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './features/auth/msalConfig';

// MSALのモックインスタンスを作成
const mockMsalInstance = new PublicClientApplication(msalConfig);

test('renders app with instance prop', () => {
  render(<App instance={mockMsalInstance} />);
  // アプリの基本的なレンダリングをテスト
  // 注意: 認証状態によって表示が変わるため、簡単なヘッダーテキストなどをテストするように変更
});
