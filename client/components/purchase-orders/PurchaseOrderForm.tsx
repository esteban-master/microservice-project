import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material"
import { useForm, get, useWatch, useFieldArray } from "react-hook-form";
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from "yup";
import { Product } from "@/types/models";
import { ErrorMessage } from '@hookform/error-message';
import { PurchaseOrderForm, useCreatePurchaseOrder, useGetPurchaseOrder, useUpdatePurchaseOrder } from "@/api/purchaseOrder";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

const PurchaseOrderForm = NiceModal.create(({ id, products } : { id?: number, products: Product[] }) => {
  const modal = useModal()
  const getPurchaseOrder = useGetPurchaseOrder()
  const createPurchaseOrderMutation = useCreatePurchaseOrder()
  const updatePurchaseOrderMutation = useUpdatePurchaseOrder()
  const productsOptions = Object.values(products).map((item) => ({ label: item.name, id: item.id }))

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    getValues
  } = useForm<PurchaseOrderForm>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    defaultValues: async () => {
      if (id) {
        return getPurchaseOrder(id)
      }
      return new Promise(resolve => resolve({
        description: '',
        expirationDate: new Date().toISOString(),
        issueDate: new Date().toISOString(),
        lines: [{ productId: 0, price: 0, quantity: 0, id: '' }],
        deleteLinesIds: []
      }))
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

  const fieldArray = useFieldArray({
    control: control,
    name: "lines",
  });

  const handleSubmitPurchaseOrder = async (purchaseOrder: PurchaseOrderForm) => {
    if (id) {
      updatePurchaseOrderMutation.mutate({ id, purchaseOrder }, {
        onSuccess() {
          handleClose()
        }
      })
    } else {
      createPurchaseOrderMutation.mutate(purchaseOrder, {
        onSuccess() {
          handleClose();
        },
      });
    }
  };

  function handleClose() {
    modal.remove()
  }

  return (
    <Dialog open={modal.visible} onClose={handleClose}>
        <DialogTitle>{id ? 'Editar orden de compra' : 'Crear orden de compra'}</DialogTitle>
        <form onSubmit={handleSubmit(handleSubmitPurchaseOrder)}>
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
            {fieldArray.fields.map((field, index) => (
              <Stack key={field.id}>
                <Autocomplete
                  disablePortal
                  options={productsOptions}
                  defaultValue={field.productId ? { label: products[field.productId].name, id: products[field.productId].id } : null}
                  getOptionLabel={(option) => option.label}
                  sx={{ width: 300 }}
                  onChange={(_, selected) => {
                    setValue(`lines.${index}.productId`, selected?.id!)
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) =>
                    <TextField 
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
                  onClick={() => {
                    setValue('deleteLinesIds', getValues('deleteLinesIds').concat(field.id))
                    fieldArray.remove(index)
                  }}  
                >
                  Remove linea
                </Button>
              </Stack>
            ))}
            <Button
              onClick={() => fieldArray.append({
                quantity: 0,
                price: 0,
                productId: 0,
                id: ''
              })}  
            >
              Otra linea
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">
              {id ? 'Editar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  )
})

export default PurchaseOrderForm