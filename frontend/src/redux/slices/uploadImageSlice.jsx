import { UPLOAD_URL } from "../constants";
import { apiSlice } from "../apiSlice";

export const uploadImageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadImageSlice;
