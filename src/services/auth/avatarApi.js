import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

export const avatarApi = createApi({
  reducerPath: "avatarApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/images" }),
  tagTypes: ["Avatar"],
  endpoints: (builder) => ({
    getDefaultAvatars: builder.query({
      query: () => ({
        url: "/avatars/default",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (response?.images && Array.isArray(response.images)) return response.images;
        return response;
      },
    }),
    getMyAvatar: builder.query({
      query: () => ({
        url: "/avatars/me",
        method: "GET",
      }),
      providesTags: ["Avatar"],
    }),
    updateMyAvatar: builder.mutation({
      query: (imageId) => ({
        url: "/avatars/me",
        method: "PUT",
        data: {
          image_id: imageId,
        },
      }),
      invalidatesTags: ["Avatar"],
    }),
  }),
});

export const {
  useGetDefaultAvatarsQuery,
  useGetMyAvatarQuery,
  useUpdateMyAvatarMutation,
} = avatarApi;
