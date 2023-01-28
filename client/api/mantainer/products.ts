import axios from "axios";
import { Product } from "@/types/models"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAllProducts = () => {
  const queryClient = useQueryClient()
  const query = useQuery<Product[]>({
    queryKey: ['mantainer/products'],
    queryFn: async () => {
      const { data } = await axios.get('/api/mantainer/products');
      return data;
    },
    onSuccess(data) {
      data.forEach(item => queryClient.setQueryData(['mantainer/products', item.id], item))
    },
  })

  return query;
}
export const useGetProduct = () => {
  const queryClient = useQueryClient()
  return async (id: number): Promise<Product> => {
    return await queryClient.fetchQuery<Product>({
      queryKey: ['mantainer/products', id],
      queryFn: async () => {
        const res = await axios.get(`/api/mantainer/products/${id}`);
        return res.data;
      }
    })
  }
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<Product, any, Partial<Product>>({
    mutationFn: async (newProduct) => {
      const { data } = await axios.post('/api/mantainer/products', newProduct)
      return data;
    },
    onSuccess(data) {
      queryClient.setQueryData<Product[]>(['mantainer/products'], (old) => {
        if (old) {
          return old.concat(data)
        }
        return [data]
      })
      queryClient.setQueryData<Product>(['mantainer/products', data.id], data)
    },
  });
} 

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation<Product, any, { id: number, product: Partial<Product> }>({
    mutationFn: async ({ id, product }) => {
      const { data } = await axios.put(`/api/mantainer/products/${id}`, product)
      return data;
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData<Product[]>(['mantainer/products'], (old) => {
        if (old) {
          const index = old.findIndex(item => item.id === data.id)
          return old.slice(0, index)
          .concat(data)
          .concat(old.slice(index + 1))
        }
        return [data]
      })
      queryClient.setQueryData<Product>(['mantainer/products', data.id], data)
    },
  });
} 