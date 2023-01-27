
import Button from "@mui/material/Button";
import NiceModal from "@ebay/nice-modal-react";
import { MODAL } from "@/types/modals";
import { useGetAllProducts } from "@/api/mantainer/products";

export default function Products() {
  const { data, isLoading } = useGetAllProducts()

  if (isLoading) {
    return "Cargando...";
  }

  return (
    <div>
      <Button variant="outlined" onClick={() => {
        NiceModal.show(MODAL.PRODUCT_FORM)
      }}>
        Crear producto
      </Button>
      
      <ul>
        {data
          ? data.map((item) => (
              <li key={item.id}>
                {item.name} - {item.code}
                <Button onClick={() => {
                  NiceModal.show(MODAL.PRODUCT_FORM, { id: item.id })
                }} >Editar</Button>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
