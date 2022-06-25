import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:8443'}),
    // Endpoints are injected from other files, hence this is empty
    endpoints: (builder) => ({})
})