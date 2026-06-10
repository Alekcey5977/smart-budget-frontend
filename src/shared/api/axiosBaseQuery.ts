import { $api } from "./axiosInstance";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

type AxiosBaseQueryArgs = {
  url: string;
  method: string;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
};

type AxiosBaseQueryOptions = {
  baseUrl?: string;
};

type AxiosBaseQueryError = {
  status?: number;
  data?: unknown;
};

export const axiosBaseQuery =
  ({ baseUrl = "" }: AxiosBaseQueryOptions = {}): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    AxiosBaseQueryError
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await $api({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as {
        response?: {
          status?: number;
          data?: unknown;
        };
        message?: string;
      };
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
