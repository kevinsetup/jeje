import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import { useState } from "react";
import {
  Button,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
} from "@mui/material";
import { useEffect } from "react";
function EditUser({ setOpenEditUser, user: initialUser }, props) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [estado, setEstado] = useState(false);

  const [user, setUsers] = useState(initialUser || null);

  useEffect(() => {
    console.log(user);
    setTipoUsuario(user.tipo_usuario);
    setNombres(user.username);
    setApellidos(user.lastName);
    setUsuario(user.username);
    setContrasena(user.password);
    setRol(user.rol);
    setEstado(user.estado);
  }, [user]);

  return (
    <div className="bg-white rounded-lg p-24">
      <div className="flex justify-between my-10">
        <h2>Editar Usuario</h2>
        <button type="submit" onClick={() => setOpenEditUser(false)}>
          <ArrowCircleLeftSharpIcon /> Regresar
        </button>
      </div>

      <form className="flex flex-col gap-y-10 ">
        <FormControl>
          <FormLabel>Tipo de usuario</FormLabel>
          <RadioGroup value={tipoUsuario} defaultValue="Responsable" row>
            <FormControlLabel
              value="Responsable"
              control={<Radio />}
              label="Responsable"
              disabled
            />
            <FormControlLabel
              value="Vendedor"
              control={<Radio />}
              label="Vendedor"
              disabled
            />
          </RadioGroup>
        </FormControl>

        <TextField
          disabled
          value={nombres}
          label="Nombres"
          variant="outlined"
        />

        <TextField
          disabled
          label="Apellidos"
          value={apellidos}
          variant="outlined"
        />

        <TextField value={usuario} label="Usuario" variant="outlined" />

        <TextField
          value={contrasena}
          label="Contraseña"
          type="password"
          variant="outlined"
        />

        <FormControl fullWidth>
          <InputLabel>Rol</InputLabel>
          <Select label="Rol" value={rol}>
            <MenuItem value={'Administrador'}>Administrador</MenuItem>
            <MenuItem value={'Secretaria'}>Secretaria</MenuItem>
            <MenuItem value={'Cliente'}>Cliente</MenuItem>
            <MenuItem value={'Cliente Basico'}>Cliente Básico</MenuItem>
          </Select>
        </FormControl>

        {/* <FormControl fullWidth>
            <InputLabel>Responsable</InputLabel>
            <Select label="Rol">
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl> */}
        <FormControlLabel
          control={
            <Switch
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
            />
          }
          label={estado ? "Activo" : "Inactivo"}
          />

        <Button
          className="whitespace-nowrap w-22"
          color="secondary"
          variant="contained"
        >
          Guardar
        </Button>
      </form>
    </div>
  );
}
export default EditUser;
