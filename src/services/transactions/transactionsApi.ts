import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/api/axiosBaseQuery";

export type OperationType = "income" | "expense";

export type Transaction = {
  id: string;
  bank_account_id: number;
  category_id: number | null;
  category_name?: string | null;
  merchant_id?: number | null;
  merchant_name?: string | null;
  amount: number | string;
  created_at: string;
  type: OperationType;
  description?: string | null;
};

export type TransactionCategory = {
  id: number;
  name: string;
  type: OperationType | null;
};

type TransactionFilters = {
  transaction_type?: OperationType;
  category_ids?: number[];
  bank_account_ids?: number[];
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  limit?: number;
  offset?: number;
};

type TransactionCategoryFilters = {
  type?: OperationType;
};

type TransactionCategorySummaryFilters = {
  transaction_type?: OperationType;
  start_date?: string;
  end_date?: string;
};

type UpdateTransactionCategoryArgs = {
  transactionId: string;
  category_id: number;
};

function buildTransactionsPayload(filters: TransactionFilters = {}) {
  const payload: TransactionFilters = {
    limit: 100,
    offset: 0,
  };

  if (filters.transaction_type) {
    payload.transaction_type = filters.transaction_type;
  }

  if (Array.isArray(filters.category_ids) && filters.category_ids.length > 0) {
    payload.category_ids = filters.category_ids;
  }

  if (
    Array.isArray(filters.bank_account_ids) &&
    filters.bank_account_ids.length > 0
  ) {
    payload.bank_account_ids = filters.bank_account_ids;
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

function buildCategorySummaryPayload(
  filters: TransactionCategorySummaryFilters = {},
) {
  const payload: TransactionCategorySummaryFilters = {};

  if (filters.transaction_type) {
    payload.transaction_type = filters.transaction_type;
  }

  if (filters.start_date) {
    payload.start_date = filters.start_date;
  }

  if (filters.end_date) {
    payload.end_date = filters.end_date;
  }

  return payload;
}

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/transactions" }),
  tagTypes: [
    "Transactions",
    "Transaction",
    "TransactionCategories",
    "TransactionCategorySummary",
  ],
  endpoints: (builder) => ({
    getTransactions: builder.query<
      Transaction[],
      TransactionFilters | undefined
    >({
      query: (filters) => ({
        url: "/",
        method: "POST",
        data: buildTransactionsPayload(filters ?? {}),
      }),
      providesTags: ["Transactions"],
    }),
    getAllTransactions: builder.query<
      Transaction[],
      TransactionFilters | undefined
    >({
      async queryFn(filters, _api, _extraOptions, fetchWithBQ) {
        const pageSize = 100;
        let offset = 0;
        let allTransactions: Transaction[] = [];

        while (true) {
          const result = await fetchWithBQ({
            url: "/",
            method: "POST",
            data: buildTransactionsPayload({
              ...(filters ?? {}),
              limit: pageSize,
              offset,
            }),
          });

          if (result.error) {
            return { error: result.error };
          }

          const page = Array.isArray(result.data)
            ? (result.data as Transaction[])
            : [];
          allTransactions = [...allTransactions, ...page];

          if (page.length < pageSize) {
            break;
          }

          offset += pageSize;
        }

        return { data: allTransactions };
      },
      providesTags: ["Transactions"],
    }),
    getTransactionById: builder.query<Transaction, string | undefined>({
      query: (transactionId) => ({
        url: `/${transactionId}`,
        method: "GET",
      }),
      providesTags: (result, error, transactionId) => [
        { type: "Transaction", id: transactionId },
      ],
    }),
    getTransactionCategories: builder.query<
      TransactionCategory[],
      TransactionCategoryFilters | undefined
    >({
      query: (filters) => ({
        url: "/categories",
        method: "GET",
        params: filters?.type ? { type: filters.type } : undefined,
      }),
      providesTags: ["TransactionCategories"],
    }),
    getTransactionCategoriesSummary: builder.query<
      unknown,
      TransactionCategorySummaryFilters | undefined
    >({
      query: (filters) => ({
        url: "/categories/summary",
        method: "POST",
        data: buildCategorySummaryPayload(filters ?? {}),
      }),
      providesTags: ["TransactionCategorySummary"],
    }),
    updateTransactionCategory: builder.mutation<
      Transaction,
      UpdateTransactionCategoryArgs
    >({
      query: ({ transactionId, category_id }) => ({
        url: `/${transactionId}/category`,
        method: "PATCH",
        data: { category_id },
      }),
      invalidatesTags: (result, error, { transactionId }) => [
        "Transactions",
        "TransactionCategorySummary",
        { type: "Transaction", id: transactionId },
      ],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetTransactionCategoriesQuery,
  useGetTransactionCategoriesSummaryQuery,
  useUpdateTransactionCategoryMutation,
} = transactionsApi;
