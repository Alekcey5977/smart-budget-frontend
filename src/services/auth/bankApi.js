import { createApi } from "@reduxjs/toolkit/query/react";
import { transactionsApi } from "services/transactions/transactionsApi";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";
import { $api } from "src/shared/api/axiosInstance";

export const bankApi = createApi({
  reducerPath: "bankApi",
  // Базовый путь до "me"
  baseQuery: axiosBaseQuery({ baseUrl: "/users/me" }),
  tagTypes: ["BankAccount"],
  endpoints: (builder) => ({
    // Получить список (GET /users/me/bank_accounts)
    getBankAccounts: builder.query({
      query: () => ({
        url: "/bank_accounts", // С буквой S на конце
        method: "GET",
      }),
      providesTags: ["BankAccount"],
    }),

    // Добавить счет (POST /users/me/bank_account)
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
    }),

    // Удалить счет (DELETE /users/me/bank_account/{id})
    deleteBankAccount: builder.mutation({
      query: (id) => ({
        url: `/bank_account/${id}`, // БЕЗ буквы S
        method: "DELETE",
      }),
      invalidatesTags: ["BankAccount"],
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useAddBankAccountMutation,
  useDeleteBankAccountMutation,
} = bankApi;
