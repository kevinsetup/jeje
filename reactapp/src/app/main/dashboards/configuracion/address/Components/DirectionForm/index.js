import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { useEffect, useState, useWatch } from "react";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { environment } from "src/environment/environment";
import axios from "axios";
import CustomAlert from "src/app/main/customAlerts/customAlert";

/* Form utilities */
const defaultValues = {
  address: "",
};

const addressSchema = yup.object().shape({
  address: yup.string().required("La dirección es requerida."),
});

const AddressForm = ({ isEditing, user, onSave, onCancel }) => {
  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    formState,
  } = useForm({
    defaultValues,
    mode: "all",
    resolver: yupResolver(addressSchema),
  });
  const [openAlert, setOpenAlert] = useState(false);

  const dispatch = useDispatch();

  const { isValid, dirtyFields, errors } = formState;

  const handleSave = async () => {
    setOpenAlert(true);

  };

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = async () => {
    const formData = getValues();

    try {
      // Aquí puedes realizar la lógica para guardar la dirección usando formData.address
      console.log("Guardando dirección:", formData.address);

      const apiUrl = environment.apiUrl + "DireccionEnvio/SaveDirecccionEnvio";
      const requestBody = {
        idDireccionEnvio: 0, // Reemplaza con el ID correcto de la dirección si es necesario
        direccion: formData.address,
        idCliente: "", // Reemplaza con el ID del cliente al que pertenece esta dirección, si es necesario
      };

      if (isEditing) {
        requestBody.idDireccionEnvio = user.idDireccionEnvio
        // Lógica para la edición de la dirección si es necesario
        // Por ejemplo, usar axios.put en lugar de axios.post
        const apiUrlEdit = environment.apiUrl + "DireccionEnvio/EditDirecccionEnvio";
        const response = await axios.put(apiUrlEdit, requestBody);
        console.log("Response:", response.data);
      } else {
        // Lógica para guardar una nueva dirección
        console.log("Xd")
        const response = await axios.post(apiUrl, requestBody);

        console.log("Response:", response.data);
      }

      // Simulando una respuesta exitosa del servidor
      setTimeout(() => {
        dispatch(
          showMessage({
            message: isEditing
              ? "Dirección actualizada correctamente...!"
              : "Dirección guardada correctamente...!",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            variant: "success",
          })
        );
        onCancel();
        onSave();

      }, 1000);
    } catch (error) {
      // Manejar errores si es necesario
      console.error("Error:", error);
    }
  };


  const options = {
    shouldValidate: true,
    shouldDirty: true
  };
  useEffect(() => {
    if (user) {
      setValue("address", user.direccion,  options );

    }  }, [user]);
  return (
    <div className="bg-white rounded-lg p-24 w-full sm:w-1/2 flex flex-col gap-y-16">
      <div className="flex justify-between">
      <h2>{isEditing ? "Editar Dirección" : "Nueva Dirección"}</h2>
        <button type="button" onClick={() => handleCancel()}>
          Regresar
        </button>
      </div>

      <form
        onSubmit={handleSubmit(() => handleSave())}
        className="flex flex-col gap-y-10 items-start"
      >
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              label="Dirección"
              variant="outlined"
              error={!!errors.address}
              helperText={errors?.address?.message}
              required
              fullWidth
              size="small"
            />
          )}
          name="address"
          control={control}
        />

        <Button
          className="whitespace-nowrap w-22"
          color="primary"
          variant="contained"
          type="submit"
          size="medium"
          disabled={_.isEmpty(dirtyFields) || !isValid}
        >
          Guardar
        </Button>
      </form>
      <CustomAlert
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        title="¡Alerta!"
        message={
          isEditing
            ? `¿Desea actualizar la dirección?`
            : `¿Desea guardar la dirección?`
        }
        onConfirm={() => handleConfirm()}
      />
    </div>
  );
};
export default AddressForm;
