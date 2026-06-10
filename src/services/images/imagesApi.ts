import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../shared/api/axiosBaseQuery";

export type ImageMapping = {
  entity_id: number | string;
  image_id: number | string;
};

type ImageMappingsResponse = {
  mappings?: ImageMapping[];
};

export const imagesApi = createApi({
  reducerPath: "imagesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/images" }),
  tagTypes: ["ImageMappings"],
  endpoints: (builder) => ({
    getCategoryImageMappings: builder.query<ImageMapping[], void>({
      query: () => ({
        url: "/mappings/categories",
        method: "GET",
      }),
      transformResponse: (response: ImageMappingsResponse) =>
        Array.isArray(response?.mappings) ? response.mappings : [],
      providesTags: ["ImageMappings"],
    }),
    getMerchantImageMappings: builder.query<ImageMapping[], void>({
      query: () => ({
        url: "/mappings/merchants",
        method: "GET",
      }),
      transformResponse: (response: ImageMappingsResponse) =>
        Array.isArray(response?.mappings) ? response.mappings : [],
      providesTags: ["ImageMappings"],
    }),
  }),
});

export const {
  useGetCategoryImageMappingsQuery,
  useGetMerchantImageMappingsQuery,
} = imagesApi;
