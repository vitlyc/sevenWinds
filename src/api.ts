import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Row } from './types'

const baseUrl: string = import.meta.env.VITE_BASE_URL

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Rows'],
  endpoints: (builder) => ({
    getRows: builder.query<Row[], void>({
      query: () => '/list',
      providesTags: ['Rows'],
    }),
    createRow: builder.mutation<{ current: Row; changed: Row[] }, Partial<Row>>(
      {
        query: (body) => ({
          url: '/create',
          method: 'POST',
          body,
        }),
        onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled

            dispatch(
              updateQueryData('getRows', undefined, (draft) => {
                findAndReplaceRow(draft, 112233, data.current)
              })
            )
          } catch (err) {
            console.error('Ошибка при создании строки:', err)
          }
        },
      }
    ),
    deleteRow: builder.mutation<
      { current: Row | null; changed: Row[] },
      number
    >({
      query: (id) => ({
        url: `/${id}/delete`,
        method: 'DELETE',
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled

          dispatch(
            updateQueryData('getRows', undefined, (draft) => {
              findAndDeleteRow(draft, id)
            })
          )
        } catch (err) {
          console.error('Ошибка при удалении строки:', err)
        }
      },
    }),

    updateRow: builder.mutation<
      { current: Row; changed: Row[] },
      { id: number; updatedRow: Partial<Row> }
    >({
      query: ({ id, updatedRow }) => ({
        url: `/${id}/update`,
        method: 'POST',
        body: updatedRow,
      }),
      onQueryStarted: async (
        { id, updatedRow },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data } = await queryFulfilled

          dispatch(
            updateQueryData('getRows', undefined, (draft) => {
              findAndReplaceRow(draft, id, data.current)
            })
          )
        } catch (err) {
          console.error('Ошибка при обновлении строки:', err)
        }
      },
    }),
  }),
})

export const {
  useGetRowsQuery,
  useCreateRowMutation,
  useDeleteRowMutation,
  useUpdateRowMutation,
} = apiSlice

export const { updateQueryData } = apiSlice.util

const findAndDeleteRow = (rows: Row[], targetId: number): boolean => {
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].id === targetId) {
      rows.splice(i, 1)
      return true
    }
    if (rows[i].child && rows[i].child.length > 0) {
      const found = findAndDeleteRow(rows[i].child, targetId)
      if (found) {
        return true
      }
    }
  }
  return false
}

const findAndReplaceRow = (
  rows: Row[],
  targetId: number,
  newRow: Row
): boolean => {
  for (let r of rows) {
    if (r.id === targetId) {
      Object.assign(r, newRow)
      return true
    }
    if (r.child && r.child.length > 0) {
      const found = findAndReplaceRow(r.child, targetId, newRow)
      if (found) return true
    }
  }
  return false
}
