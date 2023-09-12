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

/* Components */
const UserControl = ({ users, onUserChange }) => {
  const [user, setUser] = useState("");

  const handleChangeUser = (event) => {
    const user = event.target.value;
    setUser(user);
    onUserChange(user);
  };

  return (
    <div className="flex justify-center">
      <FormControl className="w-full sm:w-1/3" size="small">
        <InputLabel>Usuario</InputLabel>
        <Select label="Usuario" value={user} onChange={handleChangeUser}>
          {users.map((user) => (
            <MenuItem key={user.idUsuario} value={user}>
              {user.login}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const PermissionsTable = ({ data, onAddClick }) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={2}>
                Permisos
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={2} align="center">
                  No hay permisos para asignar
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((perm) => (
                <StyledTableRow
                  key={perm.idPermiso}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell>{perm.nomPermiso}</StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton onClick={() => onAddClick(perm)}>
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

const AssignedPermissionsTable = ({ data, onRemoveClick }) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={2}>
                Permisos asignados
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={2} align="center">
                  No hay permisos asignadas
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((perm) => (
                <StyledTableRow
                  key={perm.idPermiso}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell align="left">
                    <IconButton onClick={() => onRemoveClick(perm)}>
                      <FuseSvgIcon size={20} color="primary">
                        heroicons-outline:arrow-narrow-left
                      </FuseSvgIcon>
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell>{perm.nomPermiso}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function PermissionsToUserDashboardApp() {
  const [openAlert, setOpenAlert] = useState({ state: false, type: null });
  const [listUsers, setListUsers] = useState([]);
  const [perms, setPerms] = useState([]);
  const [assignedPerms, setAssignedPerms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPerm, setSelectedPerm] = useState(null);
  const dispatch = useDispatch();
  const apiUrl = environment.apiUrl;

  const getUsers = async () => {
    try {
      const url = apiUrl + "Usuario/GetUsuarios";
      const { data } = await axios.get(url);
      const filteredData = data.data.filter(
        (user) => user.estado === "activado"
      );
      setListUsers(filteredData);
    } catch (error) {}
  };

  const getPermissions = async () => {
    try {
      const url = apiUrl + "Permisos/GetPermiso";
      const { data } = await axios.get(url);
      return data.data;
    } catch (error) {
      return [];
    }
  };

  const getAssignedPermissions = async (idUser) => {
    try {
      const url = apiUrl + "Permisos/GetPermisosByUsuario";
      const { data } = await axios.get(url, {
        params: { IdUsuario: idUser },
      });
      return data.data;
    } catch (error) {
      return [];
    }
  };

  const handleUserChange = async (selectedUser) => {
    const allPerms = await getPermissions();
    const assignedPerms = await getAssignedPermissions(selectedUser.idUsuario);
    setSelectedUser(selectedUser);
    const notAssignedPerms = allPerms.filter(
      (perm) =>
        !assignedPerms.some(
          (assignedPerm) => perm.idPermiso === assignedPerm.idPermiso
        )
    );
    setPerms(notAssignedPerms);
    setAssignedPerms(assignedPerms);
  };

  const handleAddClick = async (selectedPerm) => {
    setSelectedPerm(selectedPerm);
    setOpenAlert({ state: true, type: "add" });
  };

  const handleRemoveClick = async (selectedPerm) => {
    setSelectedPerm(selectedPerm);
    setOpenAlert({ state: true, type: "remove" });
  };

  const handleConfirm = async (type) => {
    try {
      if (type === "add") {
        const url = apiUrl + "Permisos/AssignPermiso";
        const resp = await axios.put(url, null, {
          params: {
            IdPermiso: selectedPerm.idPermiso,
            IdUsuario: selectedUser.idUsuario
          }
        });
        console.log(resp)
      } else if (type === "remove") {
        const url = apiUrl + "Permisos/RemovePermiso";
        const resp = await axios.put(url, null, {
          params: {
            IdPermiso: selectedPerm.idPermiso,
            IdUsuario: selectedUser.idUsuario
          }
        });
        console.log(resp)
      }

      await handleUserChange(selectedUser);
      const message =
        type === "add"
          ? "Permiso agregado correctamente...!"
          : "Permiso removido correctamente...!";
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
    getUsers();
  }, []);

  return (
    <FusePageSimple
      content={
        <div className="w-full rounded-lg flex flex-col gap-12 p-24">
        <UserControl users={listUsers} onUserChange={handleUserChange} />
        <div className="flex gap-x-12">
          <div className="w-full sm:w-1/2 p-10">
            <PermissionsTable data={perms} onAddClick={handleAddClick} />
          </div>
          <div className="w-full sm:w-1/2 p-10">
            <AssignedPermissionsTable
              data={assignedPerms}
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
              ? `Se agregará el permiso ${selectedPerm?.nomPermiso} al usuario ${selectedUser?.login}`
              : `Se quitará el permiso ${selectedPerm?.nomPermiso} del usuario ${selectedUser?.login}`
          }
          onConfirm={() => handleConfirm(openAlert.type)}
        />
      </div>
      }
    />
  );
}
export default PermissionsToUserDashboardApp;
