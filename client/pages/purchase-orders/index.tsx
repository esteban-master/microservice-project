import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Autocomplete, Grid, Stack } from "@mui/material";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
async function createPurchaseOrder(url: string, { arg }: any) {
  const { data } = await axios.post(url, arg);
  return data;
}

export default function PurchaseOrders() {
  const { data, isLoading } = useSWR("/api/purchase-orders", fetcher);
  console.log({ data })
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      description: '',
      "expirationDate": "2023-01-25T16:23:17.912Z",
      "issueDate": "2023-01-22T16:23:17.912Z",
      lines: [{ "productId": '', "price": '', "quantity": '' }]
    },
  });

  const fieldArray = useFieldArray({
    control: control,
    name: "lines",
  });

  const { trigger, isMutating } = useSWRMutation(
    "/api/purchase-orders",
    createPurchaseOrder /* options */
  );

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async (data: any) => {
    try {
      console.log({ data })
      await trigger(data /* options */);
      handleClose();
    } catch (e) {
      // error handling
    }
  };

  if (isLoading) {
    return "Cargando...";
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Crear orden de compra
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear producto</DialogTitle>
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="Descripcion"
              type="text"
              fullWidth
              variant="standard"
              {...register("description")}
            />
            {fieldArray.fields.map((field, index) => (
              <Stack>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={data.products.map((item: any) => ({ label: item.name, id: item.id }))}
                  getOptionLabel={(option: any) => option.label}
                  sx={{ width: 300 }}
                  onChange={(_, selected) => {
                    console.log({ selected })
                    setValue(`lines.${index}.productId`, selected.id)
                  }}
                  renderInput={(params) => <TextField {...params} label="Product" />}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Precio"
                  type="number"
                  fullWidth
                  variant="standard"
                  {...register(`lines.${index}.price`, {
                    valueAsNumber: true
                  })}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Cantidad"
                  type="number"
                  fullWidth
                  variant="standard"
                  {...register(`lines.${index}.quantity`, {
                    valueAsNumber: true
                  })}
                />
                <Button
                  onClick={() => fieldArray.remove(index)}  
                >
                  Remove linea
                </Button>
              </Stack>
            ))}
            <Button
              onClick={() => fieldArray.append({
                quantity: '',
                price: '',
                productId: "",
              })}  
            >
              Otra linea
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Crear</Button>
          </DialogActions>
        </form>
      </Dialog>
      <ul>
        {data
          ? data.purchaseOrders.map((item: any) => (
              <li key={item.id}>
                {item.description} - {item.purchaseOrderLines.length} lines

                <ul>
                  {item.purchaseOrderLines.map((line: any) => <li key={line.productLine.line.id}>{`${line.productLine.product.name} - (Quantity: ${line.productLine.line.quantity} Price: ${line.productLine.line.price})`}</li>)}
                </ul>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
