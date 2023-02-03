import { Line } from "./Line";
import { Product } from "./Product"

type PurchaseOrderLine = {
  id: number;
  line: Line
}

export type PurchaseOrder = {
  id: number,
  description: string,
  createdAt: string,
  issueDate: string,
  expirationDate: string,
  purchaseOrderLines: PurchaseOrderLine[]
}