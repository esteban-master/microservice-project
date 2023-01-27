import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { useFieldArray, useForm, get, Controller } from "react-hook-form";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Autocomplete, Grid, Stack } from "@mui/material";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message';
const fetcher = (url: string) => fetch(url).then((res) => res.json());
async function createPurchaseOrder(url: string, { arg }: any) {
  const { data } = await axios.post(url, arg);
  return data;
}

const validationSchema = Yup.object({
  description: Yup.string(),
  issueDate: Yup.string().required(),
  expirationDate: Yup.string().required(),
  lines: Yup.array().min(1).of(
    Yup.object({
      productId: Yup.number().min(1).required(),
      price: Yup.number().min(1, 'El minimo es 1').required('El precio es requerido'),
      quantity: Yup.number().min(1).required(),
    })
  ) 
})

export default function PurchaseOrders() {
  const { data, isLoading } = useSWR("/api/purchase-orders", fetcher);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      description: '',
      "expirationDate": "2023-01-25T16:23:17.912Z",
      "issueDate": "2023-01-22T16:23:17.912Z",
      lines: [{ "productId": '', "price": '', "quantity": '' }]
    },
  });
  console.log({ data, get: get(errors, 'description'), errors })

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
              helperText={<ErrorMessage errors={errors} name="description" />}
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
                  {...register(`lines.${index}.price`)}
                  helperText={<ErrorMessage errors={errors} name={`lines.${index}.price`} />}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Cantidad"
                  type="number"
                  fullWidth
                  variant="standard"
                  {...register(`lines.${index}.quantity`)}
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
