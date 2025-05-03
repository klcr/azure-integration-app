import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/authProvider';
import { PublicClientApplication } from '@azure/msal-browser';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';

// ページコンポーネント
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SharePointPage from './pages/SharePointPage';
import DataversePage from './pages/DataversePage';
import OutlookPage from './pages/OutlookPage';
import Settings from './pages/Settings';

// 共通コンポーネント
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

import './App.css';

interface AppProps {
  instance: PublicClientApplication;
}

function App({ instance }: AppProps) {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <div className="app-container">
              <Sidebar />
              <main className="app-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/sharepoint" element={<SharePointPage />} />
                  <Route path="/dataverse" element={<DataversePage />} />
                  <Route path="/outlook" element={<OutlookPage />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </FluentProvider>
  );
}

export default App;
