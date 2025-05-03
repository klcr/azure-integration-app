import { ApiClient } from "../../services/api";

export interface DataverseEntity {
  entitySetName: string;
  displayName: string;
  primaryIdAttribute: string;
  attributes: DataverseAttribute[];
}

export interface DataverseAttribute {
  logicalName: string;
  displayName: string;
  attributeType: string;
}

export interface DataverseRecord {
  [key: string]: any;
}

export class DataverseService {
  private apiClient: ApiClient;
  private baseUrl: string;

  constructor(apiClient: ApiClient, baseUrl: string) {
    this.apiClient = apiClient;
    this.baseUrl = baseUrl;
  }

  // エンティティ一覧の取得
  async getEntities(): Promise<DataverseEntity[]> {
    const response = await this.apiClient.get<{ value: any[] }>(
      `${this.baseUrl}/api/data/v9.2/EntityDefinitions?$select=EntitySetName,DisplayName,PrimaryIdAttribute&$filter=IsCustomizable/Value eq true`
    );
    
    return response.value.map(entity => ({
      entitySetName: entity.EntitySetName,
      displayName: entity.DisplayName?.UserLocalizedLabel?.Label || entity.EntitySetName,
      primaryIdAttribute: entity.PrimaryIdAttribute,
      attributes: []
    }));
  }

  // エンティティの属性一覧の取得
  async getEntityAttributes(entityLogicalName: string): Promise<DataverseAttribute[]> {
    const response = await this.apiClient.get<{ value: any[] }>(
      `${this.baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${entityLogicalName}')/Attributes?$select=LogicalName,DisplayName,AttributeType`
    );
    
    return response.value.map(attr => ({
      logicalName: attr.LogicalName,
      displayName: attr.DisplayName?.UserLocalizedLabel?.Label || attr.LogicalName,
      attributeType: attr.AttributeType
    }));
  }

  // レコード一覧の取得
  async getRecords(entitySetName: string, select: string[] = [], filter: string = ""): Promise<DataverseRecord[]> {
    let url = `${this.baseUrl}/api/data/v9.2/${entitySetName}`;
    
    if (select.length > 0) {
      url += `?$select=${select.join(',')}`;
    }
    
    if (filter) {
      url += select.length > 0 ? `&$filter=${filter}` : `?$filter=${filter}`;
    }
    
    const response = await this.apiClient.get<{ value: any[] }>(url);
    return response.value;
  }

  // レコードの取得
  async getRecord(entitySetName: string, id: string, select: string[] = []): Promise<DataverseRecord> {
    let url = `${this.baseUrl}/api/data/v9.2/${entitySetName}(${id})`;
    
    if (select.length > 0) {
      url += `?$select=${select.join(',')}`;
    }
    
    return await this.apiClient.get<DataverseRecord>(url);
  }

  // レコードの作成
  async createRecord(entitySetName: string, data: DataverseRecord): Promise<string> {
    const response = await this.apiClient.post<any>(
      `${this.baseUrl}/api/data/v9.2/${entitySetName}`,
      data,
      {
        headers: {
          'Prefer': 'return=representation'
        }
      }
    );
    
    return response.id;
  }

  // レコードの更新
  async updateRecord(entitySetName: string, id: string, data: DataverseRecord): Promise<void> {
    await this.apiClient.patch<void>(
      `${this.baseUrl}/api/data/v9.2/${entitySetName}(${id})`,
      data
    );
  }

  // レコードの削除
  async deleteRecord(entitySetName: string, id: string): Promise<void> {
    await this.apiClient.delete<void>(
      `${this.baseUrl}/api/data/v9.2/${entitySetName}(${id})`
    );
  }
}
