import FusePageSimple from '@fuse/core/FusePageSimple';
import * as yup from 'yup';
import { Button, FormControl, FormLabel, Select, MenuItem, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { environment } from 'src/environment/environment';
import CustomAlert from 'src/app/main/customAlerts/customAlert';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

function AccountSettingsForm() {
  const [openAlert, setOpenAlert] = useState(false);
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notificationPreferences: true,
    privacySettings: 'public',
    theme: 'light',
  };

  const handleConfirm = async (data) => {
    console.log('data', formData);
    if (!formData) return; // Si no hay datos, terminamos aquí

    try {
      const apiUrl = `${environment.apiUrl}`;
      console.log('contraseña  Actual ', formData.currentPassword);
      console.log('nueva contrasela  ', formData.newPassword);

      const response = await axios.put(`${apiUrl}DatosPersonales/CambiarContra`, {
        contraseñaActual: formData.currentPassword,
        nuevaContraseña: formData.newPassword,
      });

      // Manejar respuesta
      if (response.data.status === 200) {
        const { message } = response.data;
        dispatch(
          showMessage({
            message,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
          })
        );
        console.log(response.data.message); // Contraseña actualizada correctamente
      } else {
        const { message } = response.data;
        dispatch(
          showMessage({
            message,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'error',
          })
        );
        console.log(response.data.message); // Muestra el mensaje de error
      }
    } catch (error) {
      console.log('error', error);
      console.log('Error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  const onSubmit = async (data) => {
    setFormData(data); // Guardamos los datos en el estado
    setOpenAlert(true); // Mostramos el alerta
  };

  const schema = yup.object().shape({
    currentPassword: yup.string().required('Contraseña actual requerida'),
    newPassword: yup.string().required('Nueva contraseña requerida'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
      .required('Confirmar contraseña requerida'),
    notificationPreferences: yup.boolean().required(),
    privacySettings: yup.string().required(),
    theme: yup.string().required(),
  });

  const { handleSubmit, control, formState } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid } = formState;

  return (
    <FusePageSimple
      content={
        <div className="w-full p-24 flex flex-col gap-10 items-center">
          <h1>Configuración de Cuenta</h1>
          <div className="bg-white rounded-lg p-24 w-1/2 flex flex-col gap-y-16">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-10 items-start">
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Contraseña Actual"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                name="currentPassword"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Nueva Contraseña"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                name="newPassword"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Confirmar Contraseña"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                name="confirmPassword"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <FormControl fullWidth disabled>
                    <FormLabel>Preferencias de Notificación</FormLabel>
                    <Select {...field} variant="outlined">
                      <MenuItem value>Activado</MenuItem>
                      <MenuItem value={false}>Desactivado</MenuItem>
                    </Select>
                  </FormControl>
                )}
                name="notificationPreferences"
                control={control}
                disabled
              />

              <Controller
                render={({ field }) => (
                  <FormControl fullWidth disabled>
                    <FormLabel>Configuración de Privacidad</FormLabel>
                    <Select {...field} variant="outlined">
                      <MenuItem value="public">Público</MenuItem>
                      <MenuItem value="private">Privado</MenuItem>
                    </Select>
                  </FormControl>
                )}
                name="privacySettings"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <FormControl fullWidth disabled>
                    <FormLabel>Tema</FormLabel>
                    <Select {...field} variant="outlined">
                      <MenuItem value="light">Claro</MenuItem>
                      <MenuItem value="dark">Oscuro</MenuItem>
                    </Select>
                  </FormControl>
                )}
                name="theme"
                control={control}
              />

              <Button
                className="whitespace-nowrap w-22"
                color="primary"
                variant="contained"
                type="submit"
                size="medium"
                disabled={!isValid}
              >
                Guardar Cambios
              </Button>

              <CustomAlert
                open={openAlert}
                onClose={() => setOpenAlert(false)}
                title="¡Alerta!"
                message="¿Desea guardar el rol?"
                onConfirm={handleConfirm} // Aquí llamamos a handleConfirm cuando el usuario confirma
              />
            </form>
          </div>
        </div>
      }
    />
  );
}

export default AccountSettingsForm;
