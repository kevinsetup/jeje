import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { environment } from 'src/environment/environment';
import axios from 'axios';
import CustomAlert from 'src/app/main/customAlerts/customAlert';

/* Form utilities */
const defaultValues = {
  credito: '',
  typeUser: null, // Agregamos typeUser y lo inicializamos como null para validar si es requerido
};

const creditoSchema = yup.object().shape({
  credito: yup.string().required('El credito es requerido'),
  typeUser: yup.object().nullable().required('El tipo de usuario es requerido'), // Validación para el tipo de usuario
});

function AddressForm({ isEditing, user, onSave, onCancel }) {
  const { handleSubmit, setValue, getValues, control, formState } = useForm({
    defaultValues,
    mode: 'all',
    resolver: yupResolver(creditoSchema),
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [listClient, setListClient] = useState([]);
  const [selectedTypeUser, setSelectedTypeUser] = useState(null);

  const dispatch = useDispatch();

  const { isValid, dirtyFields, errors } = formState;

  const handleSave = async () => {
    onSave();
    setOpenAlert(true);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = async () => {
    const formData = getValues();

    try {
      const dataToSend = {
        credito_inicial: formData.credito,
        idCliente: formData.typeUser?.idCliente || '', // Obtener el ID del cliente seleccionado
      };
      console.log(dataToSend);
      const apiUrl = `${environment.apiUrl}Credito/savecredito`;
      const response = await axios.post(apiUrl, dataToSend);
      console.log(response.data);

      // Aquí puedes realizar la lógica para guardar la dirección usando formData.address
      // console.log('Guardando dirección:', formData.address);

      // const apiUrl = `${environment.apiUrl}DireccionEnvio/SaveDirecccionEnvio`;
      // const requestBody = {
      //   idDireccionEnvio: 0, // Reemplaza con el ID correcto de la dirección si es necesario
      //   direccion: formData.address,
      //   idCliente: '', // Reemplaza con el ID del cliente al que pertenece esta dirección, si es necesario
      // };

      // if (isEditing) {
      //   requestBody.idDireccionEnvio = user.idDireccionEnvio;
      //   // Lógica para la edición de la dirección si es necesario
      //   // Por ejemplo, usar axios.put en lugar de axios.post
      //   const apiUrlEdit = `${environment.apiUrl}DireccionEnvio/EditDirecccionEnvio`;
      //   const response = await axios.put(apiUrlEdit, requestBody);
      //   console.log('Response:', response.data);
      // } else {
      //   // Lógica para guardar una nueva dirección
      //   console.log('Xd');
      //   const response = await axios.post(apiUrl, requestBody);

      //   console.log('Response:', response.data);
      // }

      // Simulando una respuesta exitosa del servidor
      setTimeout(() => {
        dispatch(
          showMessage({
            message: isEditing
              ? 'Dirección actualizada correctamente...!'
              : 'Dirección guardada correctamente...!',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
          })
        );
        onCancel();
      }, 1000);
    } catch (error) {
      // Manejar errores si es necesario
      console.error('Error:', error);
    }
  };

  const options = {
    shouldValidate: true,
    shouldDirty: true,
  };
  useEffect(() => {
    if (user) {
      setValue('address', user.direccion, options);
    }
  }, [user]);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const apiUrl = `${environment.apiUrl}Credito/GetClientes`;
        const { data } = await axios.get(apiUrl);
        console.log(data);
        setListClient(data.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
    fetchClients();
  }, []);
  return (
    <div className="bg-white rounded-lg p-24 w-full sm:w-1/2 flex flex-col gap-y-16">
      <div className="flex justify-between">
        <h2>{isEditing ? 'Editar Dirección' : 'Nueva Dirección'}</h2>
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
              label="Credito en S/"
              variant="outlined"
              error={!!errors.credito}
              helperText={errors?.credito?.message}
              required
              fullWidth
              size="small"
            />
          )}
          name="credito"
          control={control}
        />
        <Controller
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={listClient}
              getOptionLabel={(option) => option.nombreEmpresa}
              value={selectedTypeUser} // Establecemos el valor seleccionado
              onChange={(event, newValue) => {
                setSelectedTypeUser(newValue); // Actualizamos el valor seleccionado
                field.onChange(newValue); // Actualizamos el valor del campo controlado
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente"
                  variant="outlined"
                  error={!!errors.typeUser}
                  helperText={errors?.typeUser?.message}
                  required
                  size="small"
                />
              )}
              style={{ width: '100%' }}
            />
          )}
          name="typeUser"
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
        message={isEditing ? `¿Desea actualizar la dirección?` : `¿Desea guardar la dirección?`}
        onConfirm={() => handleConfirm()}
      />
    </div>
  );
}
export default AddressForm;
