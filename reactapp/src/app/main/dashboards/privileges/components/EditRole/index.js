import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import { Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";

function EditRole({ setOpenEditRole, role: initialRole }, props) {
  const [nomrol, setNomrol] = useState("");

  const [role, setRole] = useState(initialRole || null);
  useEffect(() => {
    console.log(role);
    setNomrol(role.nomrol);
  }, [role]);
  return (
    <div className="bg-white rounded-lg p-24">
      <div className="flex justify-between my-10">
        <h2>Editar Rol</h2>
        <button type="submit" onClick={() => setOpenEditRole(false)}>
          <ArrowCircleLeftSharpIcon /> Regresar
        </button>
      </div>

      <form className="flex flex-col gap-y-10 ">
        <TextField value={nomrol} label="Rol" variant="outlined" />

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

export default EditRole;
