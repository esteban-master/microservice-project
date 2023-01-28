import { Product } from "./Product"
import { ProductLine } from "./ProductLine"

type PurchaseOrderLine = {
  productLine: ProductLine,
  product: Product
}

export type PurchaseOrder = {
  id: number,
  description: string,
  createdAt: string,
  issueDate: string,
  expirationDate: string,
  purchaseOrderLines: PurchaseOrderLine[]
}