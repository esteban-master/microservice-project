import { Product } from "./Product"

export type Line = {
  id: string,
  createdAt: string,
  price: number,
  quantity: number
  product: Product
}