import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useForm, get } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup'
import { Product } from "@/types/models";
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ErrorMessage } from '@hookform/error-message';
import { useCreateProduct, useGetProduct } from "@/api/mantainer/products";
import { useQueryClient } from "@tanstack/react-query";

const validationSchema = Yup.object({
  name: Yup.string().required('El nombre el requerido').min(3, 'Minimo 3 caracteres'), 
  code: Yup.string().required('El codigo es requerido').min(3, 'Minimo 3 caracteres') 
})

const ProductForm = NiceModal.create(({ id } : { id?: number }) => {
  const modal = useModal()
  const mutation = useCreateProduct()
  const queryClient = useQueryClient()
  const product = useGetProduct({ id, success: (data) => {
    console.log('DATA', data)
    setValue('name', data.name)
    setValue('code', data.code)
  }})

  console.log({ loading: product.isInitialLoading, prevData: queryClient.getQueryData(['mantainer/products', id])})

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Product>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      code: ''
    },
  });

  const handleCreate = async (newProduct: Product) => {
    try {
      mutation.mutate(newProduct, {
        onSuccess() {
          handleClose();
        },
      });
    } catch (e) {
      console.log({ e })
    }
  };

  function handleClose() {
    modal.remove()
  }

  return (
    <Dialog open={modal.visible} onClose={handleClose}>
        <DialogTitle>{id ? 'Editar producto' : 'Crear producto'}</DialogTitle>
        
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              focused
              label="Nombre"
              type="text"
              fullWidth
              variant="standard"
              error={Boolean(get(errors, 'name'))}
              {...register("name")}
              helperText={<ErrorMessage errors={errors} name="name" />}
            />
            <TextField
              margin="dense"
              id="name"
              label="Código"
              type="text"
              fullWidth
              variant="standard"
              error={Boolean(get(errors, 'code'))}
              {...register("code")}
              helperText={<ErrorMessage errors={errors} name="code" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={mutation.isLoading}
            >
              Crear
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  )
})

export default ProductForm