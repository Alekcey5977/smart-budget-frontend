import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

export const imagesApi = createApi({
  reducerPath: "imagesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/images" }),
  tagTypes: ["ImageMappings"],
  endpoints: (builder) => ({
    getCategoryImageMappings: builder.query({
      query: () => ({
        url: "/mappings/categories",
        method: "GET",
      }),
      transformResponse: (response) =>
        Array.isArray(response?.mappings) ? response.mappings : [],
      providesTags: ["ImageMappings"],
    }),
    getMerchantImageMappings: builder.query({
      query: () => ({
        url: "/mappings/merchants",
        method: "GET",
      }),
      transformResponse: (response) =>
        Array.isArray(response?.mappings) ? response.mappings : [],
      providesTags: ["ImageMappings"],
    }),
  }),
});

export const {
  useGetCategoryImageMappingsQuery,
  useGetMerchantImageMappingsQuery,
} = imagesApi;
