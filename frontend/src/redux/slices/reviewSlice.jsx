import { apiSlice } from "../apiSlice";
import { REVIEW_URL } from "../constants";

export const reviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: REVIEW_URL,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateReviewMutation } = reviewSlice;
