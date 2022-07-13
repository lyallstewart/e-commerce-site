import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:3001'}),
    // Endpoints are injected from other files, hence this is empty
    endpoints: (builder) => ({})
})