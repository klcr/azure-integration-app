import { ApiClient } from "../../services/api";

export interface PermissionScope {
  scopeName: string;
  description: string;
  granted: boolean;
  adminConsentRequired: boolean;
}

export interface ServicePermissions {
  serviceName: string;
  status: 'granted' | 'partial' | 'missing';
  iconName?: string;
  scopes: PermissionScope[];
}

export class PermissionService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Microsoft Graph APIの権限状態を取得
  async getGraphPermissions(): Promise<ServicePermissions> {
    try {
      // Graph APIで利用可能なエンドポイントをチェックして権限状態を確認
      const response = await this.apiClient.get<any>('https://graph.microsoft.com/v1.0/me');
      
      // レスポンスが成功すれば基本ユーザー情報へのアクセス権あり
      const userScopeGranted = !!response && !!response.id;
      
      // 他のスコープをチェック（エンドポイントリクエストで権限確認）
      const mailScopeGranted = await this.checkMailPermission();
      const filesScopeGranted = await this.checkFilesPermission();
      const sitesScopeGranted = await this.checkSitesPermission();
      
      const scopes: PermissionScope[] = [
        {
          scopeName: 'User.Read',
          description: 'Read your profile information',
          granted: userScopeGranted,
          adminConsentRequired: false
        },
        {
          scopeName: 'Mail.Read',
          description: 'Read your email messages',
          granted: mailScopeGranted,
          adminConsentRequired: false
        },
        {
          scopeName: 'Files.Read',
          description: 'Read your files',
          granted: filesScopeGranted,
          adminConsentRequired: false
        },
        {
          scopeName: 'Sites.Read.All',
          description: 'Read items in all site collections',
          granted: sitesScopeGranted,
          adminConsentRequired: true
        }
      ];
      
      // 全体的な権限状態を判定
      const allGranted = scopes.every(scope => scope.granted);
      const anyGranted = scopes.some(scope => scope.granted);
      const status = allGranted ? 'granted' : (anyGranted ? 'partial' : 'missing');
      
      return {
        serviceName: 'Microsoft Graph API',
        status,
        iconName: 'Cloud',
        scopes
      };
    } catch (error) {
      console.error('Error checking Graph permissions:', error);
      return {
        serviceName: 'Microsoft Graph API',
        status: 'missing',
        iconName: 'Cloud',
        scopes: []
      };
    }
  }

  // SharePoint関連権限のチェック
  private async checkSitesPermission(): Promise<boolean> {
    try {
      const siteUrl = process.env.REACT_APP_SHAREPOINT_SITE || '';
      if (!siteUrl) return false;
      
      // サイト情報へのアクセスをチェック
      await this.apiClient.get<any>(`https://graph.microsoft.com/v1.0/sites/root:${siteUrl}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // メール関連権限のチェック
  private async checkMailPermission(): Promise<boolean> {
    try {
      // メール一覧へのアクセスをチェック
      await this.apiClient.get<any>('https://graph.microsoft.com/v1.0/me/messages?$top=1');
      return true;
    } catch (error) {
      return false;
    }
  }

  // ファイル関連権限のチェック
  private async checkFilesPermission(): Promise<boolean> {
    try {
      // ドライブ情報へのアクセスをチェック
      await this.apiClient.get<any>('https://graph.microsoft.com/v1.0/me/drive');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Dataverse APIの権限状態を取得
  async getDataversePermissions(): Promise<ServicePermissions> {
    try {
      const dataverseUrl = process.env.REACT_APP_DATAVERSE_URL;
      if (!dataverseUrl) {
        throw new Error('Dataverse URL not configured');
      }
      
      // Whoami APIでアクセス権をチェック
      const response = await this.apiClient.get<any>(`${dataverseUrl}/api/data/v9.2/WhoAmI`);
      
      // レスポンスが成功すれば基本的なアクセス権あり
      const basicAccessGranted = !!response && !!response.UserId;
      
      // エンティティへのアクセスをチェック
      const entitiesAccessGranted = await this.checkDataverseEntitiesAccess(dataverseUrl);
      
      const scopes: PermissionScope[] = [
        {
          scopeName: 'Basic Access',
          description: 'Basic access to Dataverse API',
          granted: basicAccessGranted,
          adminConsentRequired: true
        },
        {
          scopeName: 'Entities Access',
          description: 'Access to Dataverse entities',
          granted: entitiesAccessGranted,
          adminConsentRequired: true
        }
      ];
      
      // 全体的な権限状態を判定
      const allGranted = scopes.every(scope => scope.granted);
      const anyGranted = scopes.some(scope => scope.granted);
      const status = allGranted ? 'granted' : (anyGranted ? 'partial' : 'missing');
      
      return {
        serviceName: 'Dataverse API',
        status,
        iconName: 'Database',
        scopes
      };
    } catch (error) {
      console.error('Error checking Dataverse permissions:', error);
      return {
        serviceName: 'Dataverse API',
        status: 'missing',
        iconName: 'Database',
        scopes: []
      };
    }
  }

  // Dataverseエンティティへのアクセスをチェック
  private async checkDataverseEntitiesAccess(dataverseUrl: string): Promise<boolean> {
    try {
      await this.apiClient.get<any>(`${dataverseUrl}/api/data/v9.2/EntityDefinitions?$top=1`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // すべてのサービスの権限状態を取得
  async getAllPermissions(): Promise<ServicePermissions[]> {
    const graphPermissions = await this.getGraphPermissions();
    const dataversePermissions = await this.getDataversePermissions();
    
    return [graphPermissions, dataversePermissions];
  }
}
