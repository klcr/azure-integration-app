import { Configuration, LogLevel } from "@azure/msal-browser";

// 認証設定
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || "", // アプリケーションID
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage", // キャッシュの場所（"localStorage"または"sessionStorage"）
    storeAuthStateInCookie: false, // IEとEdgeでは必要に応じてtrueに設定
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
      logLevel: LogLevel.Info,
    },
  },
};

// ログインリクエスト設定
export const loginRequest = {
  scopes: ["User.Read", "Mail.Read", "Files.Read", "Sites.Read.All"],
};

// Microsoft Graph APIのエンドポイント
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
  graphSitesEndpoint: "https://graph.microsoft.com/v1.0/sites",
};
