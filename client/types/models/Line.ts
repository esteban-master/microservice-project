import { Product } from "./Product"

export type Line = {
  id: number,
  createdAt: string,
  price: number,
  quantity: number
  product: Product
}