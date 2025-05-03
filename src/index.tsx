/**
 * Azure Integration App
 * 
 * Copyright (c) 2025 Azure Integration App Contributors
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PublicClientApplication, EventType, EventMessage } from '@azure/msal-browser';
import { msalConfig } from './features/auth/msalConfig';

// MSALインスタンス化
const msalInstance = new PublicClientApplication(msalConfig);

// ページロード時にアクティブなアカウントがない場合は最初のアカウントを選択
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// サインインイベントのリスナー
msalInstance.addEventCallback((event: EventMessage) => {
  if (
    event.eventType === EventType.LOGIN_SUCCESS && 
    event.payload && 
    'account' in event.payload && 
    event.payload.account
  ) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App instance={msalInstance} />
  </React.StrictMode>
);

// パフォーマンス計測
reportWebVitals(console.log);
