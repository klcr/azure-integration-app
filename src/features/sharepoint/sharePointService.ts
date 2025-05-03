import { ApiClient } from "../../services/api";

export interface SharePointFile {
  id: string;
  name: string;
  webUrl: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  size: number;
}

export interface SharePointFolder {
  id: string;
  name: string;
  webUrl: string;
  childCount: number;
}

export class SharePointService {
  private apiClient: ApiClient;
  private siteId: string = "";

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // サイトIDの取得
  async getSiteId(siteUrl: string): Promise<string> {
    if (this.siteId) return this.siteId;

    const encodedSiteUrl = encodeURIComponent(siteUrl);
    const response = await this.apiClient.get<{ id: string }>(
      `https://graph.microsoft.com/v1.0/sites/root:${encodedSiteUrl}`
    );
    this.siteId = response.id;
    return this.siteId;
  }

  // ドライブの取得
  async getDrives(siteId: string): Promise<any[]> {
    const response = await this.apiClient.get<{ value: any[] }>(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`
    );
    return response.value;
  }

  // ファイル一覧の取得
  async getFiles(siteId: string, driveId: string, folderId: string = "root"): Promise<SharePointFile[]> {
    const response = await this.apiClient.get<{ value: any[] }>(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${folderId}/children`
    );
    
    return response.value
      .filter(item => item.file)
      .map(item => ({
        id: item.id,
        name: item.name,
        webUrl: item.webUrl,
        createdDateTime: item.createdDateTime,
        lastModifiedDateTime: item.lastModifiedDateTime,
        size: item.size
      }));
  }

  // フォルダ一覧の取得
  async getFolders(siteId: string, driveId: string, folderId: string = "root"): Promise<SharePointFolder[]> {
    const response = await this.apiClient.get<{ value: any[] }>(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${folderId}/children`
    );
    
    return response.value
      .filter(item => item.folder)
      .map(item => ({
        id: item.id,
        name: item.name,
        webUrl: item.webUrl,
        childCount: item.folder.childCount
      }));
  }

  // ファイルのアップロード
  async uploadFile(siteId: string, driveId: string, folderId: string, fileName: string, fileContent: ArrayBuffer): Promise<SharePointFile> {
    const response = await this.apiClient.put<any>(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${folderId}:/${fileName}:/content`,
      fileContent,
      {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      }
    );
    
    return {
      id: response.id,
      name: response.name,
      webUrl: response.webUrl,
      createdDateTime: response.createdDateTime,
      lastModifiedDateTime: response.lastModifiedDateTime,
      size: response.size
    };
  }

  // ファイルのダウンロード
  async downloadFile(siteId: string, driveId: string, itemId: string): Promise<Blob> {
    const response = await this.apiClient.get<Blob>(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${itemId}/content`,
      {
        responseType: 'blob'
      }
    );
    return response;
  }
}
