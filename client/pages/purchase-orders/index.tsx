import NiceModal from "@ebay/nice-modal-react";
import Button from "@mui/material/Button";
import { useGetAllPurchaseOrders } from "@/api/purchaseOrder";
import { MODAL } from "@/types/modals";


export default function PurchaseOrders() {
  const { data, isLoading } = useGetAllPurchaseOrders()  

  if (isLoading) {
    return "Cargando...";
  }

  return (
    <div>
      <Button variant="outlined" onClick={() => {
        NiceModal.show(MODAL.PURCHASE_ORDER_FORM, { products: data?.products })
      }}>
        Crear orden de compra
      </Button>
      <ul>
        {data
          ? data.purchaseOrders.map((item) => (
              <li key={item.id}>
                {item.description} - {item.purchaseOrderLines.length} lines

                <ul>
                  {item.purchaseOrderLines.map((item) => <li key={item.line.id}>
                    <p>{`${item.line.product.name} - (Quantity: ${item.line.quantity} Price: ${item.line.price})`}</p>
                  </li>)}
                </ul>
                <Button
                  onClick={() => {
                    NiceModal.show(MODAL.PURCHASE_ORDER_FORM, { id: item.id, products: data.products })
                  }}
                >
                  Editar
                </Button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
