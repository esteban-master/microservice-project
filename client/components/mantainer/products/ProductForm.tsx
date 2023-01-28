import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useCreateProduct, useGetProduct, useUpdateProduct } from "@/api/mantainer/products";
import { useForm, get } from "react-hook-form";
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from "yup";
import { Product } from "@/types/models";
import { ErrorMessage } from '@hookform/error-message';

const validationSchema = Yup.object({
  name: Yup.string().required('El nombre el requerido').min(3, 'Minimo 3 caracteres'), 
  code: Yup.string().required('El codigo es requerido').min(3, 'Minimo 3 caracteres') 
})

const ProductForm = NiceModal.create(({ id } : { id?: number }) => {
  const modal = useModal()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const getProduct = useGetProduct()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<Product, 'code' | 'name'>>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    defaultValues: async () => {
      if (id) {
        return getProduct(id)
      }
      return new Promise((resolve) => resolve({ name: '', code: ''}))
    },
  });

  const handleSubmitProduct = async (product: Partial<Product>) => {
    if (id) {
      updateProductMutation.mutate({ id, product }, {
        onSuccess() {
          handleClose();
        }
      })
    } else {
      createProductMutation.mutate(product, {
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
        <DialogTitle>{id ? 'Editar producto' : 'Crear producto'}</DialogTitle>
        <form onSubmit={handleSubmit(handleSubmitProduct)}>
            <DialogContent>
              <TextField
                margin="dense"
                id="name"
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
                disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
              >
                {id ? 'Editar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>
      </Dialog>
  )
})

export default ProductForm