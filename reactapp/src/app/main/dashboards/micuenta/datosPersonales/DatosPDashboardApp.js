import FusePageSimple from '@fuse/core/FusePageSimple';
import * as yup from 'yup';
import { Button, TextField, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { environment } from 'src/environment/environment';
import CustomAlert from 'src/app/main/customAlerts/customAlert';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';

/* Formulario de Datos Personales */
function DatosPersonalesForm() {
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDatosPersonales();
  }, []);
  const fetchDatosPersonales = async () => {
    try {
      const apiUrl = `${environment.apiUrl}DatosPersonales/GetDatosPersonales`;
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        console.log('esto es repsonse', response.data.data[0]);
        setDatosPersonales(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error al obtener los datos personales:', error);
    }
  };

  const adaptFormDataToBackend = (formData) => {
    return {
      idDatosPersonales: null, // Asume nulo o ajusta según sea necesario
      nombre: formData.name,
      apellidoPaterno: formData.paternalLastName,
      apellidoMaterno: formData.maternalLastName,
      tipoDocumento: formData.idType,
      nCelular: parseInt(formData.phoneNumber, 10), // Asegúrate de convertir a número
      email: formData.email,
      nombreEmpresa: formData.companyName,
    };
  };

  const onSubmitForm = async (data, e) => {
    try {
      let response;
      const adaptedData = adaptFormDataToBackend(data);

      console.log('data', adaptedData);
      console.log('novedades con datosPersonales', datosPersonales);
      const apiUrl = `${environment.apiUrl}`;

      let message = '';

      if (datosPersonales === undefined) {
        console.log('insertando');
        response = await axios.post(`${apiUrl}DatosPersonales/InsertDatosPersonales`, adaptedData);
        message = 'Creado correctamente...!';
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
        fetchDatosPersonales();
      } else if (datosPersonales.idDatosPersonales > 0) {
        response = await axios.put(`${apiUrl}DatosPersonales/UpdateDatosPersonales`, adaptedData);
        message = 'Editado correctamente...!';

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
        fetchDatosPersonales();
      }

      if (response.status === 200) {
        console.log('Datos personales procesados correctamente');
        setDatosPersonales(data); // Actualizar el estado con los nuevos datos
      } else {
        console.error('Error procesando los datos personales');
      }
    } catch (error) {
      console.error('Hubo un error al enviar los datos al servidor:', error);
    }
  };

  const defaultValues = {
    name: '',
    paternalLastName: '',
    maternalLastName: '',
    companyName: '',
    idType: 'DNI',
    phoneNumber: '',
    email: '',
  };

  const schema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    paternalLastName: yup.string().required('El apellido paterno es requerido'),
    maternalLastName: yup.string().required('El apellido materno es requerido'),
    companyName: yup.string().required('El nombre de la empresa es requerido'),
    idType: yup.string().required('Seleccione un tipo de documento'),
    phoneNumber: yup.string().required('El número de celular es requerido'),
    email: yup
      .string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es requerido'),
  });

  const { handleSubmit, control, formState, setValue, getValues } = useForm({
    defaultValues: datosPersonales || defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (datosPersonales) {
      for (const [key, value] of Object.entries(datosPersonales)) {
        setValue(key, value);
      }
    }
  }, [datosPersonales, setValue]);

  const { isValid } = formState;
  const handleSave = () => {
    setOpenAlert(true);
  };

  const handleCancel = () => {
    setOpenAlert(false);
  };
  useEffect(() => {
    if (datosPersonales) {
      setValue('name', datosPersonales.nombre);
      setValue('paternalLastName', datosPersonales.apellidoPaterno);
      setValue('maternalLastName', datosPersonales.apellidoMaterno);
      setValue('companyName', datosPersonales.nombreEmpresa);
      setValue('idType', datosPersonales.tipoDocumento);
      setValue('phoneNumber', datosPersonales.nCelular);

      // ... y así sucesivamente para el resto de tus campos
    }
  }, [datosPersonales, setValue]);

  const handleConfirm = (formData) => {
    handleSubmit((data) => {
      onSubmitForm(data);
      setOpenAlert(false); // Cerrar la alerta después de guardar
    })(formData);
  };

  return (
    <FusePageSimple
      content={
        <div className="w-full p-24 flex flex-col gap-10 items-center">
          <h1>Mis datos personales</h1>
          <div className="bg-white rounded-lg p-24 w-1/2 flex flex-col gap-y-16">
            <form
              onSubmit={handleSubmit((data) => {
                handleSave(); // This opens the alert
              })}
              className="flex flex-col gap-y-10 items-start"
            >
              <Controller
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                    error={fieldState.invalid}
                    helperText={fieldState.invalid ? fieldState.error.message : ''}
                  />
                )}
                name="name"
                control={control}
              />

              <Controller
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Apellido Paterno"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                    error={fieldState.invalid}
                    helperText={fieldState.invalid ? fieldState.error.message : ''}
                  />
                )}
                name="paternalLastName"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Apellido Materno"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                name="maternalLastName"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre de la Empresa"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                name="companyName"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <FormControl size="small" required fullWidth>
                    <FormLabel className="font-medium text-[12px]" component="legend">
                      Tipo de Documento
                    </FormLabel>
                    <Select {...field} variant="outlined" fullWidth>
                      <MenuItem value="DNI">DNI</MenuItem>
                      <MenuItem value="RUC">RUC</MenuItem>
                    </Select>
                  </FormControl>
                )}
                name="idType"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número de Celular"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                name="phoneNumber"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo Electrónico"
                    variant="outlined"
                    required
                    fullWidth
                    size="small"
                    type="email"
                  />
                )}
                name="email"
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
                Guardar
              </Button>
            </form>

            <CustomAlert
              open={openAlert}
              onClose={() => setOpenAlert(false)}
              title="¡Alerta!"
              message="¿Desea guardar el rol?"
              onConfirm={() => handleConfirm(getValues())} // Pasamos los valores del formulario
            />
          </div>
        </div>
      }
    />
  );
}

export default DatosPersonalesForm;
