import ArrowCircleLeftSharpIcon from '@mui/icons-material/ArrowCircleLeftSharp';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import CustomAlert from 'src/app/main/customAlerts/customAlert';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { environment } from 'src/environment/environment';
import axios from 'axios';

const defaultValues = {
  roleName: '',
  typeUser: '',
  state: false,
};

const schema = yup.object().shape({
  roleName: yup.string().required('Requerido'),
  typeUser: yup.number().required('Requerido'),
});

const editSchema = yup.object().shape({
  roleName: yup.string().required('Requerido'),
  typeUser: yup.number().required('Requerido'),
  state: yup.boolean().required(),
});

function RoleForm({ isEditing, role, onCancel }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [listTypeUser, setListTypeUser] = useState([]);
  const dispatch = useDispatch();

  const { handleSubmit, setValue, getValues, register, reset, control, watch, formState } = useForm(
    {
      defaultValues,
      mode: 'all',
      resolver: yupResolver(isEditing ? editSchema : schema),
    }
  );

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const handleSave = () => {
    setOpenAlert(true);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = async () => {
    const formData = getValues(); // Get the current form values

    console.log(formData);

    const body = {
      desRol: formData.roleName,
      idTipoUsuario: formData.typeUser,
      estado: true,
    };

    try {
      if (isEditing) {
        body.idRol = role.idRol;
        body.estado = formData.state;
        // If editing, send a PUT request
        const apiUrl = `${environment.apiUrl}Roles/EditRol`;
        const response = await axios.put(apiUrl, body);
        console.log('Response:', response.data);
      } else {
        // If new role, send a POST request
        const apiUrl = `${environment.apiUrl}Roles/SaveRol`;
        const response = await axios.post(apiUrl, body);
        console.log('Response:', response.data);
      }

      const message = isEditing
        ? 'Rol actualizado correctamente...!'
        : 'Rol guardado correctamente...!';

      // Dispatch the success message
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

      onCancel(); // Close the form after successful save
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors here, e.g., show an error message to the user
    }
  };

  const options = {
    shouldValidate: true,
    shouldDirty: true,
  };

  useEffect(() => {
    if (role) {
      setValue('roleName', role.desRol, options);
      setValue('typeUser', role.idTipoUsuario, options);
      setValue('state', role.estado, options);
    }
  }, [role, setValue]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = `${environment.apiUrl}TipoUsuario/GetTipoUsuario`;
        const { data } = await axios.get(apiUrl);
        setListTypeUser(data.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg p-24 w-1/2 flex flex-col gap-y-16">
      <div className="flex justify-between">
        <h2>{isEditing ? 'Editar Rol' : 'Nuevo Rol'}</h2>
        <button type="button" onClick={() => handleCancel()}>
          <ArrowCircleLeftSharpIcon /> Regresar
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
              label="Rol"
              variant="outlined"
              error={!!errors.roleName}
              helperText={errors?.roleName?.message}
              required
              fullWidth
              size="small"
            />
          )}
          name="roleName"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <FormControl size="small" error={!!errors.typeUser} required fullWidth>
              <FormLabel className="font-medium text-[12px]" component="legend">
                Tipo Usuario
              </FormLabel>
              <Select {...field} variant="outlined" fullWidth>
                {listTypeUser.map((typ) => (
                  <MenuItem key={typ.idTipoUsuario} value={typ.idTipoUsuario}>
                    {typ.nombre}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors?.typeUser?.message}</FormHelperText>
            </FormControl>
          )}
          name="typeUser"
          control={control}
        />

        {isEditing && (
          <Controller
            name="state"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl required error={!!errors.state}>
                <FormControlLabel
                  control={
                    <Switch checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                  }
                  label={value ? 'Activo' : 'Inactivo'}
                />
                <FormHelperText>{errors?.state?.message}</FormHelperText>
              </FormControl>
            )}
          />
        )}

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
        message={isEditing ? '¿Desea actualizar los datos del rol?' : '¿Desea guardar el rol?'}
        onConfirm={() => handleConfirm()}
      />
    </div>
  );
}

export default RoleForm;
