import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import {
  Button,
  TextField,
} from "@mui/material";

function NewRole({ setOpenNewRole }) {
  return (
    <div className="bg-white rounded-lg p-24">
      <div className="flex justify-between my-10">
        <h2>Nuevo Rol</h2>
        <button type="submit" onClick={() => setOpenNewRole(false)}>
          <ArrowCircleLeftSharpIcon /> Regresar
        </button>
      </div>

      <form className="flex flex-col gap-y-10 ">
        <TextField label="Rol" variant="outlined" />

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

export default NewRole;
