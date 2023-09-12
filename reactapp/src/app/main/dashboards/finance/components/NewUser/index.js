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
  TextField
} from "@mui/material";
import { faker } from '@faker-js/faker';

function NewUser({ setOpenNewUser }) {



 
  return (
    <div className="bg-white rounded-lg p-24">
      <div className="flex justify-between my-10">
        <h2>Nuevo Usuario</h2>
        <button type="submit" onClick={() => setOpenNewUser(false)}>
          <ArrowCircleLeftSharpIcon /> Regresar
        </button>
      </div>

      <form className="flex flex-col gap-y-10 ">
      <FormControl>
        <FormLabel>Tipo de usuario</FormLabel>
        <RadioGroup defaultValue="Responsable" row>
          <FormControlLabel
            value="Responsable"
            control={<Radio />}
            label="Responsable"
          />
          <FormControlLabel
            value="Vendedor"
            control={<Radio />}
            label="Vendedor"
          />
        </RadioGroup>
      </FormControl>

      <TextField label="Usuario" variant="outlined" />

      <TextField label="Contraseña" type="password" variant="outlined" />

      <FormControl fullWidth>
        <InputLabel>Rol</InputLabel>
        <Select label="Rol">
          <MenuItem value={10}>Administrador</MenuItem>
          <MenuItem value={20}>Secretaria</MenuItem>
          <MenuItem value={30}>Cliente</MenuItem>
          <MenuItem value={40}>Cliente Básico</MenuItem>
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

export default NewUser;
