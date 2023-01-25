import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
async function createProduct(url: string, { arg }: any) {
  const { data } = await axios.post("/api/mantainer/products", arg);
  return data;
}

export default function Products() {
  const { data, isLoading } = useSWR<
    { name: string; id: number; code: string }[]
  >("/api/mantainer/products", fetcher);
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
  const { trigger, isMutating } = useSWRMutation(
    "/api/mantainer/products",
    createProduct /* options */
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
          ? data.map((item) => (
              <li key={item.id}>
                {item.name} - {item.code}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
