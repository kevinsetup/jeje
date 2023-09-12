import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useCheckoutStore } from "src/app/main/store/CheckoutDetail";
import { environment } from "src/environment/environment";
import Loader from "src/app/main/components/Loader/Loader";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
/* Form utilities */
const defaultValues = {
  phone_number: "",
  code: "",
};

const yapeSchema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Requerido.")
    .min(9, "Número inválido.")
    .max(9, "Número inválido."),
  code: yup.string().required("Requerido.").min(6, "Código inválido."),
});

const YapeForm = ({ data, handleCloseEdit, updateList }) => {
  const apiUrl = environment.apiUrl;
  const dispatch = useDispatch();
  const [loadOpen, setLoadOpen] = useState(false);

  const [updatePaymentCheckout] = useCheckoutStore((state) => [
    state.updatePaymentCheckout,
  ]);
  const [total, updateTotal] = useCheckoutStore((state) => [
    state.total,
    state.updateTotal,
  ]);
  const {
    handleSubmit,
    setValue,
    getValues,
    register,
    reset,
    control,
    watch,
    formState,
    resetField,
  } = useForm({
    defaultValues,
    mode: "all",
    resolver: yupResolver(yapeSchema),
  });

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const handleSave = () => {
    confirmPedido();
  };

  const confirmPedido = async () => {
    const detalleCheckout = {
      IdDireccionEnvio: data.direccion,
      tipoEntrega: data.tipoEntrega,
      tipoPago: data.tipoPago,
      idPedidoProducto: data.idPedidoProducto,
    };
    console.log(detalleCheckout);

    try {
      setLoadOpen(true);

      const url = apiUrl + "Pedido/SaveCheckoutPedidoContado";
      await axios.post(url, detalleCheckout);
      setLoadOpen(false);

      dispatch(
        showMessage({
          message: "Pedido confirmado correctamente...!",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "success",
        })
      );
      updatePaymentCheckout(false);

      updateList(true);
      handleCloseEdit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-y-12 p-20">
      <section className="flex gap-x-12">
        <div className="h-28 w-28">
          <img src="https://seeklogo.com/images/Y/yape-app-logo-1FD46D1120-seeklogo.com.png"></img>
        </div>{" "}
        <p className="font-semibold text-lg">
          Paga con tu Código de aprobación
        </p>
      </section>
      <ul className="list-disc list-inside flex flex-col gap-y-5">
        <li>Encuéntralo en el menú de tu aplicación Yape.</li>
        <li>Copia el código y pégalo abajo.</li>
      </ul>
      <form
        onSubmit={handleSubmit(() => handleSave())}
        className="flex flex-col gap-y-12"
      >
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              label="Celular Yape"
              variant="outlined"
              error={!!errors.phone_number}
              helperText={errors?.phone_number?.message}
              required
              fullWidth
              type="number"
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
              }}
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">+51</InputAdornment>
              //   ),
              // }}
            />
          )}
          name="phone_number"
          control={control}
        />

        <p className="font-semibold text-lg">Código de aprobación</p>

        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <MuiOtpInput
              {...field}
              // error={!!errors.code}
              // helperText={errors?.code?.message}
              // inputProps={{
              //   padding:0
              // }}
              sx={{
                "& .MuiInputBase-input": {
                  padding:0
                }
              }}
              length={6}
              // value={otp}
              gap={"10px"}
              // onChange={handleChange}
              required
            />
          )}
        />

        <Button
          className="whitespace-nowrap"
          color="primary"
          variant="contained"
          type="submit"
          size="medium"
          disabled={_.isEmpty(dirtyFields) || !isValid}
        >
          Yapear {formatCurrency(total)}
        </Button>
      </form>
      <Loader open={loadOpen}></Loader>
    </div>
  );
};
export default YapeForm;
