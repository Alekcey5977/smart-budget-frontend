import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";
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
      query: (data) => ({
        url: "/bank_account",
        method: "POST",
        data: {
          bank_account_number: data.number,
          bank_account_name: data.name,
          bank: data.bank,
        },
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
            ])
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
            ])
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useAddBankAccountMutation,
  useDeleteBankAccountMutation,
} = bankApi;
