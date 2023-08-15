import { apiSlice } from "../apiSlice";
import { PRODUCT_URL } from "../constants";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCT_URL,
      }),
      keepUnusedDataFor: 10,
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: PRODUCT_URL + "/" + id,
      }),
      keepUnusedDataFor: 1,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCT_URL,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: PRODUCT_URL + "/" + id,
        method: "DELETE",
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCT_URL + "/" + data.id,
        method: "PUT",
        body: data,
      }),
    }),
    getProductsByName: builder.query({
      query: (val) => ({
        url: PRODUCT_URL + "/search/" + val,
      }),
      keepUnusedDataFor: 0,
    }),
    getRandomProducts: builder.query({
      query: () => ({
        url: PRODUCT_URL + "/get/random",
      }),
      keepUnusedDataFor:5
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useCreateProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductsByNameQuery,
  useGetRandomProductsQuery
} = productSlice;
