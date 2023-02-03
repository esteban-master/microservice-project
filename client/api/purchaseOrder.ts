import axios from "axios";
import { Line, Product, PurchaseOrder } from "@/types/models"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type PurchaseOrderResponse = {
  purchaseOrders: PurchaseOrder[],
  products: Product[]
}
type PurchaseOrderResponseTransform = Pick<PurchaseOrderResponse, 'purchaseOrders'> & { products: { [key: string]: Product } }
type LineForm = Pick<Line, 'price' | 'quantity' | 'id'> & { productId: number }
export type PurchaseOrderForm = Pick<PurchaseOrder, 'description' | 'expirationDate' | 'issueDate'> & { lines: LineForm[], deleteLinesIds: number[] }

const transformDataPurchaseOrder = (data: PurchaseOrder): PurchaseOrderForm => {
  return {
    ...data,
    deleteLinesIds: [],
    lines: data.purchaseOrderLines.map(item => ({
      id: item.line.id,
      productId: item.line.product.id,
      price: item.line.price,
      quantity: item.line.quantity 
    }))};
}

export const useGetAllPurchaseOrders = () => {
  const queryClient = useQueryClient()
  const query = useQuery<PurchaseOrderResponseTransform>({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data } = await axios.get<PurchaseOrderResponse>('/api/purchase-orders');
      const products = data?.products.reduce<{ [key:string]: Product }>((acc, item) => {
        acc[item.id] = item
        return acc;
      }, {})
      return {
        products,
        purchaseOrders: data.purchaseOrders
      };
    },
    onSuccess(data) {
      data.purchaseOrders.forEach(item => queryClient.setQueryData<PurchaseOrderForm>(['purchase-orders', item.id],  transformDataPurchaseOrder(item)))
    },
  })

  return query;
}

export const useGetPurchaseOrder = () => {
  const queryClient = useQueryClient()
  return async (id: number): Promise<PurchaseOrderForm> => {
    return await queryClient.fetchQuery<PurchaseOrderForm>({
      queryKey: ['purchase-orders', id],
      queryFn: async () => {
        const { data } = await axios.get<PurchaseOrder>(`/api/purchase-orders/${id}`);
        return transformDataPurchaseOrder(data)
      }
    })
  }
}

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient()

  return useMutation<PurchaseOrder, any, PurchaseOrderForm>({
    mutationFn: async (newPurchaseOrder) => {
      const { data } = await axios.post('/api/purchase-orders', newPurchaseOrder)
      return data
    },
    onSuccess(data) {
      queryClient.setQueryData<PurchaseOrderResponse>(['purchase-orders'], (old) => {
        if (old) {
          return {
            products: old.products,
            purchaseOrders: old.purchaseOrders.concat(data)
          }
        }
        return old
      })
      queryClient.setQueryData(['purchase-orders', data.id], data)
    },
  });
} 

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient()
  return useMutation<PurchaseOrder, any, { id: number, purchaseOrder: PurchaseOrderForm }>({
    mutationFn: async ({ id, purchaseOrder }) => {
      const { data } = await axios.put(`/api/purchase-orders/${id}`, purchaseOrder)
      return data;
    },
    onSuccess(data) {
      queryClient.setQueryData<PurchaseOrderResponseTransform>(['purchase-orders'], (old) => {
        if (old) {
          const index = old.purchaseOrders.findIndex(item => item.id === data.id)
          return {
            products: old.products,
            purchaseOrders: old.purchaseOrders.slice(0, index).concat(data).concat(old.purchaseOrders.slice(index + 1))
          }
        }
        return {
          products: {},
          purchaseOrders: []
        }
      })
      queryClient.setQueryData<PurchaseOrderForm>(['purchase-orders', data.id], transformDataPurchaseOrder(data))
    },
  });
} 