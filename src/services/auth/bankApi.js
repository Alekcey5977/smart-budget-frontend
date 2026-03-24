import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

export const bankApi = createApi({
  reducerPath: "bankApi",
  // Базовый путь до "me"
  baseQuery: axiosBaseQuery({ baseUrl: "/users/me" }),
  tagTypes: ["BankAccount", "History"],
  endpoints: (builder) => ({
    // Получить список (GET /users/me/bank_accounts)
    getBankAccounts: builder.query({
      query: () => ({
        url: "/bank_accounts", // С буквой S на конце
        method: "GET",
      }),
      providesTags: ["BankAccount", "History"],
    }),

    // Добавить счет (POST /users/me/bank_account)
    addBankAccount: builder.mutation({
      query: (data) => ({
        url: "/bank_account", // БЕЗ буквы S на конце
        method: "POST",
        data: {
          bank_account_number: data.number,
          bank_account_name: data.name,
          bank: data.bank,
        },
      }),
      invalidatesTags: ["BankAccount", "History"],
    }),

    // Удалить счет (DELETE /users/me/bank_account/{id})
    deleteBankAccount: builder.mutation({
      query: (id) => ({
        url: `/bank_account/${id}`, // БЕЗ буквы S
        method: "DELETE",
      }),
      invalidatesTags: ["BankAccount", "History"],
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useAddBankAccountMutation,
  useDeleteBankAccountMutation,
} = bankApi;
