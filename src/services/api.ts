import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// APIクライアントクラス
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private tokenProvider: () => Promise<string>;

  constructor(baseURL: string, tokenProvider: () => Promise<string>) {
    this.tokenProvider = tokenProvider;
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // リクエストインターセプター：トークン付与
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.tokenProvider();
        if (token) {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // GET リクエスト
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  // POST リクエスト
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  // PUT リクエスト
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  // PATCH リクエスト
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  // DELETE リクエスト
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

// APIフック作成関数
export const createApiClient = (baseURL: string, tokenProvider: () => Promise<string>) => {
  return new ApiClient(baseURL, tokenProvider);
};
