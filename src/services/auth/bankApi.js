import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

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
      invalidatesTags: ["BankAccount", "History"],
    }),

    
    deleteBankAccount: builder.mutation({
      query: (id) => ({
        url: `/bank_account/${id}`, 
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
