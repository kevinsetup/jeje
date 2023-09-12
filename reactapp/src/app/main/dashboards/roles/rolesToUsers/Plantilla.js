import FusePageSimple from "@fuse/core/FusePageSimple";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import { CustomAlert } from "../../../customAlerts/customAlert";
import { faker } from "@faker-js/faker";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  StyledTableCell,
  StyledTableRow,
} from "src/app/main/components/StyledTable/StyledTable";
import axios from "axios";
import { environment } from "src/environment/environment";

function createData(rol) {
  return { rol };
}

function generateData() {
  return {
    username: faker.person.firstName(),
  };
}

function generateUsers(n) {
  const orders = [];
  for (let i = 0; i < n; i += 1) {
    orders.push(generateData());
  }
  return orders;
}

function RolesToUsersDashboardApp() {
  /* Consts */
  const [openAlert, setOpenAlert] = useState({ state: false, type: null });

  const [listTypeUser, setListTypeUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [listUsers, setListUsers] = useState([]);

  const [roles, setRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  /* Función para traer los datos para los selectores : Usuarios y TipoUsuario */
  const fetchSelectorsData = async () => {
    try {
      const apiUrlTipoUsuario =
        environment.apiUrl + "TipoUsuario/GetTipoUsuario";
      const apiUrlUsuario = environment.apiUrl + "Usuario/GetUsuarios";

      const [tipoUsuarioData, usuarioData] = await Promise.all([
        axios.get(apiUrlTipoUsuario),
        axios.get(apiUrlUsuario),
      ]);

      // const tipoUsuarioData = await axios.get(apiUrlTipoUsuario);
      setListTypeUser(tipoUsuarioData.data.data);
      setAllUsers(usuarioData.data.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchSelectorsData();
  }, []);

  const dispatch = useDispatch();

  /* Listar roles segun su tipo de usuario y el propio usuario */
  const handleUserChange = async (selectedUser) => {
    console.log(selectedUser);
    setSelectedUser(selectedUser);
    //   try {
    //     const apiUrl = environment.apiUrl + "Permisos/GetPermiso"; // URL para la solicitud al backend
    //     const response = await axios.get(apiUrl, {
    //       params: {
    //         selectedUser: selectedUser, // Pasamos el valor seleccionado del Select como parámetro en la solicitud
    //       },
    //     });
    //     // Aquí puedes hacer algo con la respuesta del backend si es necesario
    //     console.log('Respuesta del backend:', response.data);
    //   } catch (error) {
    //     console.error('Error al obtener datos del backend:', error);
    //   }
  };

  const handleTypeUserChange = (typeUser) => {
    const filteredUsers = allUsers.filter((user) => user.idTipoUsuario === typeUser)
    setListUsers(filteredUsers)
  };

  /* Agregar rol al usuario */
  const handleAddClick = async (selectedRole) => {
    setOpenAlert({ state: true, type: "add" });
    setSelectedRole(selectedRole);
  };

  /* Quitar rol del usuario */
  const handleRemoveClick = async (selectedRole) => {
    setOpenAlert({ state: true, type: "remove" });
    setSelectedRole(selectedRole);
  };

  const handleConfirm = (action) => {
    setOpenAlert({ state: false, type: null });

    let message = null;
    if (action === "add") {
      message = "Rol agregado correctamente...!";
    } else if (action === "remove") {
      message = "Rol quitado correctamente!";
    }

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
  };

  return (
    <FusePageSimple
      content={
        <div className="w-full rounded-lg flex flex-col gap-12 p-24">
          <UserControls
            userTypes={listTypeUser}
            users={listUsers}
            onUserChange={handleUserChange}
            onTypeUserChange={handleTypeUserChange}
          />
          <div className="flex gap-x-12">
            <div className="w-full sm:w-1/2 p-10">
              <RolesTable data={roles} onAddClick={handleAddClick} />
            </div>
            <div className="w-full sm:w-1/2 p-10">
              <AssignedRolesTable
                data={assignedRoles}
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
                ? `Se agregará el rol ${selectedRole?.rol} al usuario ${selectedUser}`
                : `Se quitará el rol ${selectedRole?.rol} del usuario ${selectedUser}`
            }
            onConfirm={() => handleConfirm(openAlert.type)} // Pasamos el parámetro de acción para handleConfirm
          />
        </div>
      }
    />
  );
}

const UserControls = ({ userTypes, users, onTypeUserChange, onUserChange }) => {
  const [user, setUser] = useState(""); // Estado para almacenar el usuario seleccionado
  const [typeUser, setTypeUser] = useState(""); // Estado para almacenar el usuario seleccionado

  const handleChangeTypeUser = (event) => {
    const userType = event.target.value;
    setTypeUser(userType)
    onTypeUserChange(userType);
  };

  const handleChangeUser = (event) => {
    const user = event.target.value
    setUser(user)
    onUserChange(user)
  };

  return (
    <div className="flex gap-x-10 justify-center">
      <FormControl className="w-full sm:w-1/3" size="small">
        <InputLabel>Tipo Usuario</InputLabel>
        <Select
          label="Tipo Usuario"
          value={typeUser}
          onChange={handleChangeTypeUser}
        >
          {userTypes.map((userOption) => (
            <MenuItem
              key={userOption.idTipoUsuario}
              value={userOption.idTipoUsuario}
            >
              {userOption.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className="w-full sm:w-1/3" size="small">
        <InputLabel>Usuario</InputLabel>
        <Select label="Usuario" value={user} onChange={handleChangeUser}>
          {users.map((userOption) => (
            <MenuItem key={userOption.idUsuario} value={userOption.idUsuario}>
              {userOption.login}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const RolesTable = ({ data, onAddClick }) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={2}>
                Roles
              </StyledTableCell>
              {/* <StyledTableCell align="right">Agregar</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((role) => (
              <StyledTableRow
                key={role.rol}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell>{role.rol}</StyledTableCell>

                <StyledTableCell align="right">
                  <IconButton onClick={() => onAddClick(role)}>
                    <FuseSvgIcon size={20} color="primary">
                      heroicons-outline:arrow-narrow-right
                    </FuseSvgIcon>
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const AssignedRolesTable = ({ data, onRemoveClick }) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={2}>
                Roles asignados
              </StyledTableCell>
              {/* <StyledTableCell align="right">Quitar</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((role) => (
              <StyledTableRow
                key={role.rol}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align="left">
                  <IconButton onClick={() => onRemoveClick(role)}>
                    <FuseSvgIcon size={20} color="primary">
                      heroicons-outline:arrow-narrow-left
                    </FuseSvgIcon>
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell>{role.rol}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default RolesToUsersDashboardApp;
