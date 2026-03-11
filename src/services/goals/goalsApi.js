import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

export const goalsApi = createApi({
  reducerPath: "goalsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/purposes" }),
  tagTypes: ["Goals"],
  endpoints: (builder) => ({
    getGoals: builder.query({
      query: () => ({
        url: "/my",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response;
        }

        if (Array.isArray(response?.goals)) {
          return response.goals;
        }

        if (Array.isArray(response?.items)) {
          return response.items;
        }

        return [];
      },
      providesTags: ["Goals"],
    }),
    createGoal: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Goals"],
    }),
    updateGoal: builder.mutation({
      query: ({ goalId, data }) => ({
        url: `/update/${goalId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Goals"],
    }),
    deleteGoal: builder.mutation({
      query: (goalId) => ({
        url: `/delete/${goalId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goals"],
    }),
  }),
});

export const {
  useGetGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
} = goalsApi;
