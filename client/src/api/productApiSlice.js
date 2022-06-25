import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: () => "/products/all",
        }),
        getProductById: builder.query({
            query: (id) => `/products/${id}`
        }),
        // TODO: Add more
    })
})

export const {
    useGetProductQuery
} = productApiSlice;