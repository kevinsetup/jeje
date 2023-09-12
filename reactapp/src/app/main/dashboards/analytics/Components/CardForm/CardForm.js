import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useCheckoutStore } from "src/app/main/store/CheckoutDetail";
import { environment } from "src/environment/environment";
import Loader from "src/app/main/components/Loader/Loader";
import { useState, useEffect } from "react";
import { formatCurrency } from "src/app/main/utils/formatCurrency";

/* Form utilities */
const defaultValues = {
  card_number: "",
  expiration_month: "",
  expiration_year: "",
  cvv: "",
};

const cardSchema = yup.object().shape({
  card_number: yup
    .string()
    .required("Requerido.")
    .min(14, "Ingrese un valor entre 14 y 19 caracteres.")
    .max(19, "Ingrese un valor entre 14 y 19 caracteres."),
  expiration_month: yup.string().required("Requerido."),
  expiration_year: yup.string().required("Requerido."),
  cvv: yup
    .string()
    .required("Requerido.")
    .min(3, "Ingrese un valor entre 3 y 4 caracteres.")
    .max(4, "Ingrese un valor entre 3 y 4 caracteres."),
});

const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const CardForm = ({ data, handleCloseEdit, updateList }) => {
  const [loadOpen, setLoadOpen] = useState(false);
  const apiUrl = environment.apiUrl;
  const dispatch = useDispatch();
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
    resolver: yupResolver(cardSchema),
  });
  const [updatePaymentCheckout] = useCheckoutStore((state) => [
    state.updatePaymentCheckout,
  ]);
    const [total, updateTotal] = useCheckoutStore((state) => [
    state.total,
    state.updateTotal,
  ]);
  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const currentYear = new Date().getFullYear();
  const endYear = currentYear + 14;
  const yearRange = Array.from(
    { length: endYear - currentYear + 1 },
    (_, index) => (currentYear + index).toString()
  );

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
        setLoadOpen(true)
      const url = apiUrl + "Pedido/SaveCheckoutPedidoContado";
      await axios.post(url, detalleCheckout);
      setLoadOpen(false)

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
        <CreditCardIcon></CreditCardIcon>
        <p className="font-semibold text-lg">Tarjeta Crédito / Débito</p>
      </section>
      <p className="font-semibold text-lg py-10">
        Ingresa los datos de tu tarjeta
      </p>

      <form
        onSubmit={handleSubmit(() => handleSave())}
        className="flex flex-col gap-y-12"
      >
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              label="Número de tarjeta"
              variant="outlined"
              error={!!errors.card_number}
              helperText={errors?.card_number?.message}
              required
              fullWidth
              type="number"
              size="medium"
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
              }}
            />
          )}
          name="card_number"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <FormControl
              size="medium"
              error={!!errors.expiration_month}
              required
              fullWidth
            >
              <FormLabel component="legend">Mes de vencimiento</FormLabel>
              <Select {...field} variant="outlined" fullWidth>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>{month}</MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errors?.expiration_month?.message}
              </FormHelperText>
            </FormControl>
          )}
          name="expiration_month"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <FormControl
              size="medium"
              error={!!errors.expiration_year}
              required
              fullWidth
            >
              <FormLabel component="legend">Año de vencimiento</FormLabel>
              <Select {...field} variant="outlined" fullWidth>
                {yearRange.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errors?.expiration_year?.message}
              </FormHelperText>
            </FormControl>
          )}
          name="expiration_year"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              label="CVV"
              variant="outlined"
              error={!!errors.cvv}
              helperText={errors?.cvv?.message}
              required
              fullWidth
              type="number"
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
              }}
              size="medium"
            />
          )}
          name="cvv"
          control={control}
        />
        <Button
          className="whitespace-nowrap"
          color="primary"
          variant="contained"
          type="submit"
          size="medium"
          disabled={_.isEmpty(dirtyFields) || !isValid}
        >
         Pagar {formatCurrency(total)}
        </Button>
      </form>
      <Loader open={loadOpen}></Loader>
    </div>
  );
};
export default CardForm;
