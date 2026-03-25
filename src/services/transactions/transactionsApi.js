import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

function buildTransactionsPayload(filters = {}) {
  const payload = {
    limit: 100,
    offset: 0,
  };

  if (filters.transaction_type) {
    payload.transaction_type = filters.transaction_type;
  }

  if (Array.isArray(filters.category_ids) && filters.category_ids.length > 0) {
    payload.category_ids = filters.category_ids;
  }

  if (filters.start_date) {
    payload.start_date = filters.start_date;
  }

  if (filters.end_date) {
    payload.end_date = filters.end_date;
  }

  if (typeof filters.min_amount === "number") {
    payload.min_amount = filters.min_amount;
  }

  if (typeof filters.max_amount === "number") {
    payload.max_amount = filters.max_amount;
  }

  if (typeof filters.limit === "number") {
    payload.limit = filters.limit;
  }

  if (typeof filters.offset === "number") {
    payload.offset = filters.offset;
  }

  return payload;
}

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/transactions" }),
  tagTypes: ["Transactions", "TransactionCategories"],
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (filters) => ({
        url: "/",
        method: "POST",
        data: buildTransactionsPayload(filters),
      }),
      providesTags: ["Transactions"],
    }),
    getTransactionCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["TransactionCategories"],
    }),
    updateTransactionCategory: builder.mutation({
      query: ({ transactionId, category_id }) => ({
        url: `/${transactionId}/category`,
        method: "PATCH",
        data: { category_id },
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionCategoriesQuery,
  useUpdateTransactionCategoryMutation,
} = transactionsApi;
