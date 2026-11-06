import { axiosInstance, ApiError, getApiErrorMessage } from "~/lib/axios";
import type { AxiosRequestConfig } from "axios";

interface RequestOptions {
  method?: string;
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Generic API client helper wrapper around axiosInstance.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", token, params, headers = {}, body } = options;

  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
    params,
    headers: { ...headers },
    data: body,
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axiosInstance.request<T>(config);
  return response.data;
}

export { axiosInstance, ApiError, getApiErrorMessage };
