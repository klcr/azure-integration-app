import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../features/auth/authProvider';
import { OutlookService, EmailMessage } from '../features/outlook/outlookService';
import LoginPrompt from '../components/common/LoginPrompt';

const OutlookPage: React.FC = () => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getApiClient } = useApi('https://graph.microsoft.com/v1.0');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchEmails = async () => {
      try {
        setLoading(true);
        const outlookService = new OutlookService(getApiClient());
        const messageList = await outlookService.getMessages(20);
        setMessages(messageList);
        setError(null);
      } catch (err) {
        console.error('Error fetching Outlook messages:', err);
        setError('メールの取得に失敗しました。接続と権限を確認してください。');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [getApiClient, isAuthenticated]);

  return (
    <div>
      <h1>Outlook メッセージ</h1>
      
      {!isAuthenticated ? (
        <>
          <div className="card">
            <h2>Outlook統合について</h2>
            <p>
              Microsoft Outlookは、メール、カレンダー、連絡先を管理するためのMicrosoft 365サービスです。
              このアプリケーションでは、以下のOutlook機能にアクセスできます:
            </p>
            <ul>
              <li>メールメッセージの閲覧</li>
              <li>メールの送信</li>
              <li>添付ファイルの管理</li>
              <li>メールの検索とフィルタリング</li>
            </ul>
          </div>
          
          <LoginPrompt message="サインインすると、Outlookメッセージを閲覧・操作できます。" />
          
          <div className="section">
            <h3>Outlook統合のメリット</h3>
            <div className="grid">
              <div className="card">
                <h4>シングルインターフェース</h4>
                <p>複数のアプリを切り替えることなく、一つのインターフェースからメールにアクセス</p>
              </div>
              <div className="card">
                <h4>クロスサービス連携</h4>
                <p>SharePointドキュメントやDataverseデータとメールを簡単に関連付け</p>
              </div>
              <div className="card">
                <h4>コンテキスト内通信</h4>
                <p>作業中のコンテキストを離れることなくコミュニケーションが可能</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {loading && <p>メッセージを読み込み中...</p>}
          
          {error && (
            <div className="card" style={{ backgroundColor: '#FEE2E2' }}>
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && messages.length === 0 && (
            <p>メッセージが見つかりませんでした。</p>
          )}
          
          {!loading && !error && messages.length > 0 && (
            <div className="section">
              {messages.map((message) => (
                <div key={message.id} className="card">
                  <h3>{message.subject}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>差出人: {message.from.emailAddress.name} ({message.from.emailAddress.address})</span>
                    <span>{new Date(message.receivedDateTime).toLocaleString()}</span>
                  </div>
                  <p>{message.bodyPreview}</p>
                  {message.hasAttachments && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        添付ファイルあり
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OutlookPage;
