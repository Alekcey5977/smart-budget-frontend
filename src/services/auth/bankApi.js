import { createApi } from "@reduxjs/toolkit/query/react";
import { transactionsApi } from "services/transactions/transactionsApi";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";
import { $api } from "src/shared/api/axiosInstance";
import { historyApi } from "./historyApi";
import { notificationApi } from "./notificationApi";

export const bankApi = createApi({
  reducerPath: "bankApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/users/me" }),
  tagTypes: ["BankAccount", "History"],
  endpoints: (builder) => ({
    getBankAccounts: builder.query({
      query: () => ({
        url: "/bank_accounts",
        method: "GET",
      }),
      providesTags: ["BankAccount", "History"],
    }),

    addBankAccount: builder.mutation({
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

        const bankAccountId = result.data?.bank_account_id;

        if (bankAccountId) {
          try {
            await $api.post(`/sync/${bankAccountId}`);
          } catch {
          } finally {
            api.dispatch(
              transactionsApi.util.invalidateTags(["Transactions"]),
            );
          }
        }

        return { data: result.data };
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

    deleteBankAccount: builder.mutation({
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
    renameBankAccount: builder.mutation({
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
  useRenameBankAccountMutation,
} = bankApi;
