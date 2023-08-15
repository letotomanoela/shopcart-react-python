import { LOGIN_URL, REGISTER_URL, USER_URL } from "../constants";
import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: LOGIN_URL,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: REGISTER_URL,
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: USER_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: USER_URL + "/" + id,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: USER_URL + "/"+data.id,
        method: "PUT",
        body: data,
      }),
    }),
    changeUserRole: builder.mutation({
      query: (data) => ({
        url: USER_URL + "/role/" + data.userId,
        method: "PUT",
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: USER_URL +"/"+ id,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangeUserRoleMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery
} = userApiSlice;
