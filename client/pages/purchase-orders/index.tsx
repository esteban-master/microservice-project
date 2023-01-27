import { useState } from "react";
// import useSWR from "swr";
// import useSWRMutation from "swr/mutation";
import axios from "axios";
import { useFieldArray, useForm, get, useWatch } from "react-hook-form";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getPurchaseOrders = async () => {
  const { data } = await axios.get('/api/purchase-orders');
  return data;
}

const validationSchema = Yup.object({
  description: Yup.string().required(),
  issueDate: Yup.string().required(),
  expirationDate: Yup.string().required(),
  lines: Yup.array().min(1).of(
    Yup.object({
      productId: Yup.number().positive('Seleccione un producto').integer().required('El producto es requerido'),
      price: Yup.number().positive().integer().min(1, 'El minimo es 1').required('El precio es requerido'),
      quantity: Yup.number().positive().integer().min(1,  'El minimo es 1').required('La cantidad es requerida'),
    })
  ) 
})

export default function PurchaseOrders() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: getPurchaseOrders 
  })

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
      expirationDate: new Date().toISOString(),
      issueDate: new Date().toISOString(),
      lines: [{ "productId": '0', "price": '0', "quantity": '0' }]
    },
  });

  const issueDate = useWatch({
    control,
    name: "issueDate",
  });
  const expirationDate = useWatch({
    control,
    name: "expirationDate",
  });
  console.log({ data, get: get(errors, 'description'), errors })

  const fieldArray = useFieldArray({
    control: control,
    name: "lines",
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      return axios.post('/api/purchase-orders', data)
    }
  });

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async (data: any) => {
    console.log({ data })
    try {
      mutation.mutate(data, {
        onSuccess({ data }, variables, context) {
          queryClient.setQueryData(['purchase-orders'], (old: any) => old.concat(data))
          queryClient.setQueryData(['purchase-orders', data.id], data)
        },
      });
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
              error={Boolean(get(errors, 'description'))}
              margin="dense"
              id="name"
              label="Descripcion"
              type="text"
              fullWidth
              variant="standard"
              {...register("description")}
              helperText={<ErrorMessage errors={errors} name="description" />}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Fecha emision"
                inputFormat="dd-MM-yyyy"
                value={issueDate}
                onChange={(e) => {
                  if (e) {
                    setValue('issueDate', new Date(e).toISOString())
                  }
                }}
                renderInput={(params) =>
                  <TextField
                    {...params} 
                    error={Boolean(get(errors, 'issueDate'))}
                    helperText={<ErrorMessage errors={errors} name="issueDate" />}
                  />
                }
              />
              <DesktopDatePicker
                label="Fecha vencimiento"
                inputFormat="dd-MM-yyyy"
                value={expirationDate}
                onChange={(e) => {
                  if (e) {
                    setValue('expirationDate', new Date(e).toISOString())
                  }
                }}
                renderInput={(params) =>
                  <TextField
                    {...params} 
                    error={Boolean(get(errors, 'expirationDate'))}
                    helperText={<ErrorMessage errors={errors} name="expirationDate" />}
                  />
                }
              />
            </LocalizationProvider>
            {fieldArray.fields.map((_, index) => (
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
                  renderInput={(params) => <TextField 
                    {...params}
                    label="Product"
                    error={Boolean(get(errors,`lines.${index}.productId`))}
                    helperText={<ErrorMessage errors={errors} name={`lines.${index}.productId`} />} 
                  />}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Precio"
                  type="number"
                  fullWidth
                  variant="standard"
                  error={Boolean(get(errors, `lines.${index}.price`))}
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
                  error={Boolean(get(errors, `lines.${index}.quantity`))}
                  {...register(`lines.${index}.quantity`)}
                  helperText={<ErrorMessage errors={errors} name={`lines.${index}.quantity`} />}
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
                quantity: '0',
                price: '0',
                productId: '0',
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
