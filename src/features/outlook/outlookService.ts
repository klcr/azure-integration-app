import { ApiClient } from "../../services/api";

export interface EmailMessage {
  id: string;
  subject: string;
  bodyPreview: string;
  from: {
    emailAddress: {
      name: string;
      address: string;
    }
  };
  receivedDateTime: string;
  hasAttachments: boolean;
}

export interface EmailAttachment {
  id: string;
  name: string;
  contentType: string;
  size: number;
}

export class OutlookService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // メール一覧の取得
  async getMessages(top: number = 10, filter: string = ""): Promise<EmailMessage[]> {
    let url = `https://graph.microsoft.com/v1.0/me/messages?$top=${top}`;
    
    if (filter) {
      url += `&$filter=${filter}`;
    }
    
    url += "&$select=id,subject,bodyPreview,from,receivedDateTime,hasAttachments";
    
    const response = await this.apiClient.get<{ value: EmailMessage[] }>(url);
    return response.value;
  }

  // メールの取得
  async getMessage(messageId: string): Promise<any> {
    return await this.apiClient.get<any>(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}`
    );
  }

  // メールの送信
  async sendEmail(subject: string, body: string, toRecipients: { emailAddress: { address: string } }[]): Promise<void> {
    const message = {
      subject,
      body: {
        contentType: "HTML",
        content: body
      },
      toRecipients
    };
    
    await this.apiClient.post<void>(
      `https://graph.microsoft.com/v1.0/me/sendMail`,
      { message }
    );
  }

  // 添付ファイル一覧の取得
  async getAttachments(messageId: string): Promise<EmailAttachment[]> {
    const response = await this.apiClient.get<{ value: EmailAttachment[] }>(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}/attachments?$select=id,name,contentType,size`
    );
    return response.value;
  }

  // 添付ファイルの取得
  async getAttachment(messageId: string, attachmentId: string): Promise<any> {
    return await this.apiClient.get<any>(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}/attachments/${attachmentId}`
    );
  }
}
