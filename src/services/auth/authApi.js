import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/auth" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        data: {
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          middle_name: userData.middleName || null,
          is_active: true,
          is_superuser: false,
          is_verified: true,
        },
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse: (response) => {
        return response.user || response;
      },
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: "/me",
        method: "PUT",
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName || null,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateUserMutation,
} = authApi;
