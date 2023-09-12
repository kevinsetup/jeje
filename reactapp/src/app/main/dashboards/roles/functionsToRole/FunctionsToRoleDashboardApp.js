import FusePageSimple from "@fuse/core/FusePageSimple";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import { CustomAlert } from "../../../customAlerts/customAlert";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { environment } from "src/environment/environment";
import axios from "axios";
import {
  StyledTableCell,
  StyledTableRow,
} from "src/app/main/components/StyledTable/StyledTable";

function FunctionsToRoleDashboardApp() {
  const [openAlert, setOpenAlert] = useState({ state: false, type: null });
  const [listRoles, setListRoles] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [assignedFunctions, setAssignedFunctions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedFun, setSelectedFun] = useState(null);
  const dispatch = useDispatch();

  const handleRoleChange = async (selectedRole) => {
    const allFuns = await getFunctions();
    const assignedFuns = await getAssignedFunctions(selectedRole.idRol);
    setSelectedRole(selectedRole);
    const notAssignedFuns = allFuns.filter(
      (func) =>
        !assignedFuns.some(
          (assignedFunc) => func.idFuncion === assignedFunc.idFuncion
        )
    );

    setFunctions(notAssignedFuns);
    setAssignedFunctions(assignedFuns);
  };

  const getFunctions = async () => {
    try {
      const apiUrl = environment.apiUrl + "Funcion/GetFunciones";
      const { data } = await axios.get(apiUrl);
      return data.data;
    } catch (error) {
      return [];
    }
  };

  const getAssignedFunctions = async (idRole) => {
    try {
      const apiUrl = environment.apiUrl + "Funcion/GetFuncionesByRol";
      const { data } = await axios.get(apiUrl, { params: { IdRol: idRole } });
      return data.data;
    } catch (error) {
      return [];
    }
  };

  const fetchRoles = async () => {
    try {
      const apiUrl = environment.apiUrl + "Roles/GetRoles";
      const { data } = await axios.get(apiUrl);
      const filteredData = data.data.filter((role) => role.estado === true);
      setListRoles(filteredData);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  const handleAddClick = async (selectedFun) => {
    setSelectedFun(selectedFun);
    setOpenAlert({ state: true, type: "add" });
  };

  const handleRemoveClick = async (selectedFun) => {
    setSelectedFun(selectedFun);
    setOpenAlert({ state: true, type: "remove" });
  };

  const handleConfirm = async (type) => {
    try {
      if (type === "add") {
        const apiUrl = environment.apiUrl + "Funcion/AssignFuncion";
        const resp = await axios.put(apiUrl, null, {
          params: {
            IdFuncion: selectedFun.idFuncion,
            IdRol: selectedRole.idRol,
          },
        });
        console.log(resp);
      } else if (type === "remove") {
        const apiUrl = environment.apiUrl + "Funcion/RemoveFuncion";
        const resp = await axios.put(apiUrl, null, {
          params: {
            IdFuncion: selectedFun.idFuncion,
            IdRol: selectedRole.idRol,
          },
        });
        console.log(resp);
      }

      await handleRoleChange(selectedRole);
      const message =
        type === "add"
          ? "Función agregada correctamente...!"
          : "Función removida correctamente...!";
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
    } catch (error) {}
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <FusePageSimple
      content={
        <div className="w-full rounded-lg flex flex-col gap-12 p-24">
          <RoleControl roles={listRoles} onRoleChange={handleRoleChange} />
          <div className="flex gap-x-12">
            <div className="w-full sm:w-1/2 p-10">
              <FunctionsTable data={functions} onAddClick={handleAddClick} />
            </div>
            <div className="w-full sm:w-1/2 p-10">
              <AssignedFunctionsTable
                data={assignedFunctions}
                onRemoveClick={handleRemoveClick}
              />
            </div>
          </div>
          <CustomAlert
            open={openAlert.state}
            onClose={() => setOpenAlert({ state: false, type: null })}
            title="¡Alerta!"
            message={
              openAlert.type === "add"
                ? `Se agregará la función ${selectedFun?.nomFuncion} al rol ${selectedRole?.desRol}`
                : `Se quitará la función ${selectedFun?.nomFuncion} del rol ${selectedRole?.desRol}`
            }
            onConfirm={() => handleConfirm(openAlert.type)} // Pasamos el parámetro de acción para handleConfirm
          />
        </div>
      }
    />
  );
}

const RoleControl = ({ roles, onRoleChange }) => {
  const [role, setRole] = useState("");

  const handleChangeRole = (event) => {
    const role = event.target.value;
    setRole(role);
    onRoleChange(role);
  };

  return (
    <div className="flex justify-center">
      <FormControl className="w-full sm:w-1/3" size="small">
        <InputLabel>Rol</InputLabel>
        <Select label="Rol" value={role} onChange={handleChangeRole}>
          {roles.map((role) => (
            <MenuItem key={role.idRol} value={role}>
              {role.desRol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const FunctionsTable = ({ data, onAddClick }) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={2}>
                Funciones
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={2} align="center">
                  No hay funciones para asignar
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((fun) => (
                <StyledTableRow
                  key={fun.idFuncion}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell>{fun.nomFuncion}</StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton onClick={() => onAddClick(fun)}>
                      <FuseSvgIcon size={20} color="primary">
                        heroicons-outline:arrow-narrow-right
                      </FuseSvgIcon>
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const AssignedFunctionsTable = ({ data, onRemoveClick }) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={2}>
                Funciones asignadas
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={2} align="center">
                  No hay funciones asignadas
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((fun) => (
                <StyledTableRow
                  key={fun.rol}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell align="left">
                    <IconButton onClick={() => onRemoveClick(fun)}>
                      <FuseSvgIcon size={20} color="primary">
                        heroicons-outline:arrow-narrow-left
                      </FuseSvgIcon>
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell>{fun.nomFuncion}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default FunctionsToRoleDashboardApp;
