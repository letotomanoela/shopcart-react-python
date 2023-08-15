import { apiSlice } from "../apiSlice";
import { ORDER_URL } from "../constants";

const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: ORDER_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: ORDER_URL,
        method: "POST",
        body: data,
      }),
      keepUnusedDataFor: 5,
    }),
    isDelivered: builder.mutation({
      query: (data) => ({
        url: ORDER_URL + "/is_delivered/" + data.id,
        method: "PUT",
      }),
    }),
    isPaid: builder.mutation({
      query: (data) => ({
        url: ORDER_URL + "/is_paid/" + data.id,
        method: "PUT",
      }),
    }),
  }),
});

export const { useGetOrdersQuery, useCreateOrderMutation, useIsDeliveredMutation, useIsPaidMutation } = orderSlice;
