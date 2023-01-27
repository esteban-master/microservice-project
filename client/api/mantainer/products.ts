import axios from "axios";
import { Product } from "@/types/models"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAllProducts = () => {
  const query = useQuery<Product[]>({
    queryKey: ['mantainer/products'],
    queryFn: async () => {
      const { data } = await axios.get('/api/mantainer/products');
      return data;
    },
  })

  return query;
}
export const useGetProduct = ({ id, success }: { id?: number, success?: (data: Product) => void }) => {
  const query = useQuery<Product>({
    queryKey: ['mantainer/products', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/mantainer/products/${id}`);
      return data;
    },
    onSuccess(data) {
      if (success) {
        success(data);
      }
    },
    enabled: Boolean(id),
  })

  return query;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<Product, any, Pick<Product, 'name' | 'code'>>({
    mutationFn: async (newProduct) => {
      const { data } = await axios.post('/api/mantainer/products', newProduct)
      return data;
    },
    onSuccess(data, variables, context) {
      console.log({ data, variables, context })
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