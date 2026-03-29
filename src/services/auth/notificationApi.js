import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "src/shared/api/axiosBaseQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Notifications", "UnreadNotificationsCount", "History"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/notifications/user/me",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notifications", id })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    getNotificationById: builder.query({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Notifications", id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data && !data.is_read) {
          dispatch(
            notificationApi.util.invalidateTags(["UnreadNotificationsCount"]),
          );
        }
      },
    }),
    getHistoryById: builder.query({
      query: (id) => ({
        url: `/history/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "History", id }],
    }),

    getUnreadNotificationsCount: builder.query({
      query: () => ({
        url: "/notifications/user/me/unread/count",
        method: "GET",
      }),
      transformResponse: (response) => response?.count ?? 0,
      providesTags: ["UnreadNotificationsCount"],
    }),

    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/mark-as-read`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
        "UnreadNotificationsCount",
      ],
    }),

    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-as-read",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        "UnreadNotificationsCount",
      ],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
        "UnreadNotificationsCount",
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetHistoryByIdQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
