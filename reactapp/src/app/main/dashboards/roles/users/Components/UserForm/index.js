import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import { useEffect, useState } from "react";
import CustomAlert from "src/app/main/customAlerts/customAlert";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { environment } from "src/environment/environment";
import axios from "axios";

/* Form utilities */
const defaultValues = {
  typeUser: "Responsable",
  userName: "",
  password: "",
  manager: "",
  salesperson: "",
  enablePass: false,
  state:false
};

const newUserSchema = yup.object().shape({
  typeUser: yup.string().oneOf(["responsable", "vendedor"], "Requerido."),
  userName: yup.string().required("Requerido."),
  password: yup.string().required("Requerido."),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Contraseñas deben coincidir.")
    .required("Requerido."),
  manager: yup.object().when("typeUser", {
    is: "responsable",
    then: () => yup.string().required("Requerido.").defined(),
    otherwise: () => yup.string().notRequired().nullable(),
  }),
  salesperson: yup.string().when("typeUser", {
    is: "vendedor",
    then: () => yup.string().required("Requerido.").defined(),
    otherwise: () => yup.string().notRequired().nullable(),
  }),
});

const editUserSchema = yup.object().shape({
  typeUser: yup.string().oneOf(["responsable", "vendedor"], "Requerido."),
  userName: yup.string().required("Requerido."),
  password: yup.string().when("enablePass", {
    is: true,
    then: () => yup.string().required("Requerido."),
    otherwise: () => yup.string().notRequired().nullable(),
  }),

  passwordConfirmation: yup.string().when("enablePass", {
    is: true,
    then: () =>
      yup
        .string()
        .oneOf([yup.ref("password"), null], "Contraseñas deben coincidir.")
        .required("Requerido."),
    otherwise: () => yup.string().notRequired().nullable(),
  }),
  state: yup.boolean().required(),
  enablePass: yup.boolean(),
});

const UserForm = ({ isEditing, user, onSave, onCancel }) => {
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
    resolver: yupResolver(isEditing ? editUserSchema : newUserSchema),
  });

  const [openAlert, setOpenAlert] = useState(false);
  const { isValid, dirtyFields, errors, touchedFields } = formState;
  const [listResponsable, setListResponsable] = useState([]);
  const [listVendedor, setListVendedor] = useState([]);
  const [userInfo, setUserInfo] = useState({
    nombres: "",
    apellidos: "",
    vendedor: "",
    contacto: "",
    distribuidor: "",
  });
  const dispatch = useDispatch();
  const watchTypeUserField = useWatch({
    control,
    name: "typeUser",
  });

  const watchEnablePass = useWatch({
    control,
    name: "enablePass",
  });

  const options = {
    shouldDirty: true,
    shouldValidate: true,
  };

  const handleSave = async () => {
    setOpenAlert(true);
    onSave();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleConfirm = async () => {
    const formData = getValues();

    try {
      if (isEditing) {
        const _body = {
          idUsuario: user.idUsuario,
          login: formData.userName,
          estado: formData.state ? "activado" : "desactivado",
          tipoUsuario:formData.typeUser,
          idTipo: user.idTipo
        };

        if (watchTypeUserField === "responsable") {
          _body.idTipoUsuario = 1;
        } else if (watchTypeUserField === "vendedor") {
          _body.idTipoUsuario = 2;
        }

        if (formData.enablePass) {
          _body.pass = formData.password;
        }
        console.log(formData.enablePass)
        console.log(_body)
        const apiUrl = environment.apiUrl + "Usuario/EditUsuario";
        const response = await axios.put(apiUrl, _body, {
          params: { editPass: formData.enablePass },
        });
        console.log("Response:", response.data);
      } else {
        const body = {
          login: formData.userName,
          pass: formData.password,
          tipoUsuario: formData.typeUser,
          estado: "activado",
          // idRol: , ahora se controla de otra manera: Roles a usuario.
        };

        if (watchTypeUserField === "responsable") {
          body.idTipo = formData.manager;
          body.idTipoUsuario = 1;
        } else if (watchTypeUserField === "vendedor") {
          body.idTipo = formData.salesperson;
          body.idTipoUsuario = 2;
        }

        console.log(body);
        const apiUrl = environment.apiUrl + "Usuario/SaveUsuario";
        const response = await axios.post(apiUrl, body);
        console.log("Response:", response.data);

       
      }
      const message = isEditing
      ? "Usuario actualizado correctamente...!"
      : "Usuario guardado correctamente...!";

    dispatch(
      showMessage({
        message: message,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        variant: "success",
      })
    );
    onCancel();
    } catch (error) {}
  };

  useEffect(() => {
    if (watchTypeUserField === "responsable") {
      resetField("salesperson");
    } else if (watchTypeUserField === "vendedor") {
      resetField("manager");
    }
  }, [watchTypeUserField]);

  useEffect(() => {
    if (user) {
      getInfoUser(user.idUsuario);
      setValue("userName", user.login, options);
      setValue("typeUser", user.tipoUsuario, options);
      setValue("state", user.estado === "activado" ? true : false, options);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (!isEditing) {
      getUnnasignedResponsable();
      getUnnasignedVendedor();
    }
  }, []);

  const getInfoUser = async (id) => {
    try {
      const apiUrl = environment.apiUrl + "Usuario/GetUsuarioEdit";
      const { data } = await axios.get(apiUrl, { params: { idUsuario: id } });
      console.log(data.data[0]);
      setUserInfo(data.data[0]);
    } catch (error) {}
  };

  const getUnnasignedResponsable = async () => {
    try {
      const apiUrl =
        environment.apiUrl + "Responsable/GetUnnasignedResponsable";
      const { data } = await axios.get(apiUrl);
      console.log(data.data);
      setListResponsable(data.data);
    } catch (error) {}
  };
  const getUnnasignedVendedor = async () => {
    try {
      const apiUrl = environment.apiUrl + "Vendedor/GetUnnasignedVendedor";
      const { data } = await axios.get(apiUrl);
      console.log(data.data);
      setListVendedor(data.data);
    } catch (error) {}
  };

  return (
    <div className="bg-white rounded-lg p-24 w-full sm:w-1/2 flex flex-col gap-y-16">
      <div className="flex justify-between">
        <h2>{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</h2>
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
            <FormControl
              disabled={isEditing}
              error={!!errors.typeUser}
              required
            >
              <FormLabel className="font-medium text-[12px]" component="legend">
                Tipo de usuario
              </FormLabel>
              <RadioGroup row {...field} aria-label="typeUser" name="typeUser">
                <FormControlLabel
                  value="responsable"
                  control={<Radio color="primary" />}
                  label="Responsable"
                />
                <FormControlLabel
                  value="vendedor"
                  control={<Radio color="primary" />}
                  label="Vendedor"
                />
              </RadioGroup>
              <FormHelperText>{errors?.typeUser?.message}</FormHelperText>
            </FormControl>
          )}
          name="typeUser"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              label="Usuario"
              variant="outlined"
              error={!!errors.userName}
              helperText={errors?.userName?.message}
              required
              fullWidth
              size="small"
            />
          )}
          name="userName"
          control={control}
        />

        {isEditing && (
          <Controller
            name="enablePass"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl error={!!errors.enablePass}>
                <FormLabel
                  className="font-medium text-[12px]"
                  component="legend"
                >
                  ¿Cambiar contraseña?
                </FormLabel>
                <Switch
                  checked={value || false}
                  onChange={(e) => onChange(e.target.checked)}
                />
                <FormHelperText>{errors?.enablePass?.message}</FormHelperText>
              </FormControl>
            )}
          />
        )}

        {!isEditing || (isEditing && watchEnablePass) ? (
          <>
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contraseña"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  required
                  fullWidth
                  size="small"
                  type="password"
                />
              )}
              name="password"
              control={control}
            />

            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirmar Contraseña"
                  variant="outlined"
                  error={!!errors.passwordConfirmation}
                  helperText={errors?.passwordConfirmation?.message}
                  required
                  fullWidth
                  size="small"
                  type="password"
                />
              )}
              name="passwordConfirmation"
              control={control}
            />
          </>
        ) : null}

        {isEditing && (
          <Controller
            name="state"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl error={!!errors.state}>
                <FormLabel
                  className="font-medium text-[12px]"
                  component="legend"
                >
                  Estado de usuario
                </FormLabel>
                <FormControlLabel
                  control={
                    <Switch
                      checked={value || false}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label={value ? "Activo" : "Inactivo"}
                />
                <FormHelperText>{errors?.state?.message}</FormHelperText>
              </FormControl>
            )}
          />
        )}

        {!isEditing ? (
          <>
            {watchTypeUserField === "responsable" && (
              <Controller
                render={({ field }) => (
                  <FormControl
                    size="small"
                    error={!!errors.manager}
                    required
                    fullWidth
                  >
                    <FormLabel
                      className="font-medium text-[12px]"
                      component="legend"
                    >
                      Responsable
                    </FormLabel>
                    <Select {...field} variant="outlined" fullWidth>
                      {listResponsable.map((resp) => (
                        <MenuItem value={resp.idResponsable}>
                          {resp.nombres} {resp.apellidos}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors?.manager?.message}</FormHelperText>
                  </FormControl>
                )}
                name="manager"
                control={control}
              />

            )}

            {watchTypeUserField === "vendedor" && (
              <Controller
                render={({ field }) => (
                  <FormControl
                    size="small"
                    error={!!errors.salesperson}
                    required
                    fullWidth
                  >
                    <FormLabel
                      className="font-medium text-[12px]"
                      component="legend"
                    >
                      Vendedor
                    </FormLabel>
                    <Select {...field} variant="outlined" fullWidth>
                      {listVendedor.map((ven) => (
                        <MenuItem value={ven.idVendedor}>
                          {" "}
                          {ven.nombres} {ven.apellidos}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors?.salesperson?.message}
                    </FormHelperText>
                  </FormControl>
                )}
                name="salesperson"
                control={control}
              />
            )}
          </>
        ) : (
          <>
            {watchTypeUserField === "responsable" && (
              <>
                <TextField
                  label="Nombres"
                  variant="outlined"
                  fullWidth
                  disabled
                  size="small"
                  value={userInfo.nombres || ""}
                />
                <TextField
                  label="Apellidos"
                  variant="outlined"
                  fullWidth
                  disabled
                  size="small"
                  value={userInfo.apellidos || ""}
                />
              </>
            )}

            {watchTypeUserField === "vendedor" && (
              <>
                <TextField
                  label="Distribuidor"
                  variant="outlined"
                  fullWidth
                  disabled
                  size="small"
                  value={userInfo.distribuidor || ""}
                />
                <TextField
                  label="Contacto"
                  variant="outlined"
                  fullWidth
                  disabled
                  size="small"
                  value={userInfo.contacto || ""}
                />
                <TextField
                  label="Vendedor"
                  variant="outlined"
                  fullWidth
                  disabled
                  size="small"
                  value={userInfo.vendedor || ""}
                />
              </>
            )}
          </>
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
        message={
          isEditing
            ? `¿Desea actualizar los datos del usuario?`
            : `¿Desea guardar el usuario?`
        }
        onConfirm={() => handleConfirm()}
      />
    </div>
  );
};

export default UserForm;
