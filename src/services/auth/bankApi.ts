import { createApi } from "@reduxjs/toolkit/query/react";
import { transactionsApi } from "services/transactions/transactionsApi";
import { axiosBaseQuery } from "../../shared/api/axiosBaseQuery";
import { $api } from "../../shared/api/axiosInstance";
import { historyApi } from "./historyApi";
import { notificationApi } from "./notificationApi";

export type BankAccount = {
  bank_account_id: number;
  bank_account_name?: string | null;
  currency?: string;
  bank?: string;
  balance: number | string;
  bank_account_hash?: string;
};

type AddBankAccountArgs = {
  number: string;
  name: string;
  bank: string;
};

type RenameBankAccountArgs = {
  id: number | string;
  name: string;
};

type ApiError = {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
};

export const bankApi = createApi({
  reducerPath: "bankApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/users/me" }),
  tagTypes: ["BankAccount", "History"],
  endpoints: (builder) => ({
    getBankAccounts: builder.query<BankAccount[], void>({
      query: () => ({
        url: "/bank_accounts",
        method: "GET",
      }),
      providesTags: ["BankAccount", "History"],
    }),

    addBankAccount: builder.mutation<BankAccount, AddBankAccountArgs>({
      async queryFn(data, api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          url: "/bank_account",
          method: "POST",
          data: {
            bank_account_number: data.number,
            bank_account_name: data.name,
            bank: data.bank,
          },
        });

        if (result.error) {
          return { error: result.error };
        }

        const bankAccount = result.data as BankAccount;
        const bankAccountId = bankAccount.bank_account_id;

        if (bankAccountId) {
          try {
            await $api.post(`/sync/${bankAccountId}`);
          } catch {
          } finally {
            api.dispatch(
              transactionsApi.util.invalidateTags([
                "Transactions",
                "TransactionCategorySummary",
              ]),
            );
          }
        }

        return { data: bankAccount };
      },
      invalidatesTags: ["BankAccount"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(historyApi.util.invalidateTags(["History"]));
          dispatch(
            notificationApi.util.invalidateTags([
              "UnreadNotificationsCount",
              { type: "Notifications", id: "LIST" },
            ]),
          );
        } catch {}
      },
    }),

    deleteBankAccount: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/bank_account/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BankAccount"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(historyApi.util.invalidateTags(["History"]));
          dispatch(
            notificationApi.util.invalidateTags([
              "UnreadNotificationsCount",
              { type: "Notifications", id: "LIST" },
            ]),
          );
        } catch {}
      },
    }),

    syncBankAccounts: builder.mutation<unknown, void>({
      async queryFn(arg, api) {
        try {
          const result = await $api.post("/sync");
          api.dispatch(
            transactionsApi.util.invalidateTags([
              "Transactions",
              "TransactionCategorySummary",
            ]),
          );
          return { data: result.data };
        } catch (error) {
          const apiError = error as ApiError;

          return {
            error: {
              status: apiError.response?.status,
              data: apiError.response?.data || apiError.message,
            },
          };
        }
      },
      invalidatesTags: ["BankAccount"],
    }),
    renameBankAccount: builder.mutation<BankAccount, RenameBankAccountArgs>({
      query: ({ id, name }) => ({
        url: `/bank_account/${id}`,
        method: "PATCH",
        data: { bank_account_name: name },
      }),
      invalidatesTags: ["BankAccount"],
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useAddBankAccountMutation,
  useDeleteBankAccountMutation,
  useSyncBankAccountsMutation,
  useRenameBankAccountMutation,
} = bankApi;
