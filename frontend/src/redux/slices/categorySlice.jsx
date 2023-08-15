import { CATEGORY_URL } from "../constants";
import { apiSlice } from "../apiSlice";

export const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORY_URL,
        method: "POST",
        body: data,
      }),
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORY_URL + "/" + data.id,
        method: "PUT",
        body: data,
      }),
    }),
    getCategory: builder.query({
      query: () => ({
        url: CATEGORY_URL,
      }),
      keepUnusedDataFor: 1,
    }),
    getCategoryById: builder.query({
      query: (id) => ({
        url: CATEGORY_URL + "/" + id,
      }),
      keepUnusedDataFor: 1,
    }),
    deleteCategory: builder.mutation({
      query:(id) => ({
        url:CATEGORY_URL + "/" + id,
        method:'DELETE'
      })
    })
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categorySlice;
