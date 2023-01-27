import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetcher = async () => {
  const { data } = await axios.get('/api/mantainer/products');
  return data;
};

export default function Products() {
  const { data, isLoading } = useQuery({
    queryKey: ['mantainer/products'],
    queryFn: fetcher,
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
    },
  });
  const mutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post('/api/purchase-orders', data)
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
    try {
      mutation.mutate(data, {
        onSuccess(data, variables, context) {
          console.log({ data, variables, context })
          handleClose();
        },
      });
    } catch (e) {
      console.log({ e })
      // error handling
    }
  };

  if (isLoading) {
    return "Cargando...";
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Crear producto
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear producto</DialogTitle>
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="Nombre"
              type="text"
              fullWidth
              variant="standard"
              {...register("name")}
            />
            <TextField
              margin="dense"
              id="name"
              label="Código"
              type="text"
              fullWidth
              variant="standard"
              {...register("code")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Crear</Button>
          </DialogActions>
        </form>
      </Dialog>
      <ul>
        {data
          ? data.map((item: any) => (
              <li key={item.id}>
                {item.name} - {item.code}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
