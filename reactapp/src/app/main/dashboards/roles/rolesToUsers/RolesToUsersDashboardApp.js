import FusePageSimple from "@fuse/core/FusePageSimple";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "src/app/main/components/StyledTable/StyledTable";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import { styled } from "@mui/system";
import { CustomAlert } from "../../../customAlerts/customAlert";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { environment } from "src/environment/environment";
import axios from "axios";
import CustomAlertTimer from "src/app/main/customAlerts/customAlertTimer";

function createData(funcion) {
  return { funcion };
}

function RolesToUsersDashboardApp() {
  //Alertas
  const [openAlert, setOpenAlert] = useState({ state: false, type: null });
  const [openAlertNotSelect, setOpenAlertNotSelect] = useState({
    state: false,
    type: null,
  });

  //Select seleccionado
  const [tipoUsuarioSelect, setTipoUsuarioSelect] = useState([]);
  const [UsuarioSelect, setUsuarioSelect] = useState([]);
  //Select List
  const [listUsers, setListUsers] = useState([]);
  const [listTipoUsuario, setListTipoUsuario] = useState([]);
  //Rol select
  const [usuarioSelectChange, setUsuarioSelectChange] = useState([]);
  const [rolSelected, setRolSelected] = useState([]);
  //Tablas
  const [rowsA, setRowsA] = useState([]);
  const [rowsB, setRowsB] = useState([]);
  //distcpach
  const dispatch = useDispatch();

  /* Función para traer los datos para los selectores : Usuarios y TipoUsuario */
  const fetchSelectorsData = async () => {
    try {
      //Selector
      const apiUrlUsuario = environment.apiUrl + "Usuario/GetUsuarios";
      const apiUrlTipoUsuario =
        environment.apiUrl + "TipoUsuario/GetTipoUsuario";
      //Tables data

      const [usuarioData, tipoUsuarioData] = await Promise.all([
        axios.get(apiUrlUsuario),
        axios.get(apiUrlTipoUsuario),
      ]);

      // const tipoUsuarioData = await axios.get(apiUrlTipoUsuario);
      setListUsers(usuarioData.data.data);
      setListTipoUsuario(tipoUsuarioData.data.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };
  //Se realiza la petición
  useEffect(() => {
    fetchSelectorsData();
  }, []);

  const handleRemove = async (idRemove, rowRemove) => {
    const { id, descripcion } = idRemove;
    setRolSelected({ id, descripcion });
    const filterUsuario = listUsers.filter(
      (user) => user.idUsuario == UsuarioSelect
    );
    setUsuarioSelectChange(filterUsuario[0]);
    if (UsuarioSelect > 0 && tipoUsuarioSelect > 0) {
      if (rowRemove == "A") {
        setOpenAlert({ state: true, type: "add" });
      } else {
        setOpenAlert({ state: true, type: "remove" });
      }
    } else {
      //Mostrar que falta seleccionar
      if (UsuarioSelect > 0) {
        setOpenAlertNotSelect({ state: true, type: "remove" });
      } else {
        setOpenAlertNotSelect({ state: true, type: "add" });
      }
    }
  };

  const handleUserChange = async (idUser) => {
    try {
      const listUsuario = await getUsuarioAssigned(idUser);
      setUsuarioSelect(idUser);
      setRowsB(listUsuario);
      //Se filtra si esta en A
      const filteredArrayA = rowsA.filter(
        (itemA) => !listUsuario.some((itemB) => itemA.id === itemB.id)
      );
      setRowsA(filteredArrayA);
    } catch (error) {
      return [];
    }
  };
  const handleTipoUsuarioChange = async (idTipoUsuario) => {
    try {
      const listRolByTipoUsuario = await getRolByTipoUsuario(idTipoUsuario);
      setTipoUsuarioSelect(idTipoUsuario);

      if (rowsB.length > 0) {
        const filteredArrayA = listRolByTipoUsuario.filter(
          (itemA) => !rowsB.some((itemB) => itemA.id === itemB.id)
        );
        setRowsA(filteredArrayA);
      } else {
        setRowsA(listRolByTipoUsuario);
      }
    } catch (error) {
      return [];
    }
  };
  //
  const removeRefresh = async (idTipoUsuario, arrayB) => {
    try {
      const listRolByTipoUsuario = await getRolByTipoUsuario(idTipoUsuario);
      if (arrayB.length > 0) {
        const filteredArrayA = listRolByTipoUsuario.filter(
          (itemA) => !arrayB.some((itemB) => itemA.id === itemB.id)
        );
        setRowsA(filteredArrayA);
      } else {
        setRowsA(listRolByTipoUsuario);
      }
    } catch (error) {
      return [];
    }
  };

  const handleConfirm = async (answer) => {
    try {
      const { id, descripcion } = rolSelected;
      const { idUsuario } = usuarioSelectChange;
      if (answer == "remove") {
        const remove = await removeRolUsuario(id, idUsuario);
        const rowsBfilter = rowsB.filter((row) => row.id != id);
        setRowsB(rowsBfilter);
        //Se reacarga el array
        await removeRefresh(tipoUsuarioSelect, rowsBfilter);
      } else {
        const assign = await assignRolUsuario(id, idUsuario);
        const rowsAFilter = rowsA.filter((row) => row.id != id);
        setRowsA(rowsAFilter);
        const nuevoObjeto = { id: id, descripcion: descripcion }; // Puedes reemplazar estos valores con los datos que desees
        const rowsBAdd = rowsB;
        setRowsB([...rowsBAdd, nuevoObjeto]);
        //Add
      }
      const message =
        answer === "add"
          ? "Rol agregado correctamente...!"
          : "Rol removido correctamente...!";
      console.log(message);
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
    } catch (error) {
      return [];
    }
  };
  const assignRolUsuario = async (idRol, idUsuario) => {
    console.log(idRol, idUsuario);
    try {
      const apiAssignRolUsuario = environment.apiUrl + "Roles/AssignRol";
      const { data } = await axios.put(apiAssignRolUsuario, null, {
        params: { IdUsuario: idUsuario, IdRol: idRol },
      });
      return data;
    } catch (error) {
      return [];
    }
  };
  const removeRolUsuario = async (idRol, idUsuario) => {
    try {
      const apiRemoveRolUsuario = environment.apiUrl + "Roles/RemoveRol";
      const { data } = await axios.put(apiRemoveRolUsuario, null, {
        params: { IdUsuario: idUsuario, IdRol: idRol },
      });
      return data;
    } catch (error) {
      return [];
    }
  };
  const getUsuarioAssigned = async (GetRolByUser) => {
    try {
      const apiUrlRolByUsuario = environment.apiUrl + "Roles/GetRolByUser";
      const { data } = await axios.get(apiUrlRolByUsuario, {
        params: { IdUsuario: GetRolByUser },
      });
      const newFormat = data.data.map((c) => {
        return {
          id: c.idRol,
          descripcion: c.desRol,
        };
      });
      return newFormat;
    } catch (error) {
      return [];
    }
  };
  const getRolByTipoUsuario = async (idTipoUsuario) => {
    try {
      const apiUrlRolByTipoUsuario =
        environment.apiUrl + "Roles/GetRolByTipoUsuario";
      const { data } = await axios.get(apiUrlRolByTipoUsuario, {
        params: { IdTipoUsuario: idTipoUsuario },
      });
      const newFormat = data.data.map((c) => {
        return {
          id: c.idRol,
          descripcion: c.desRol,
        };
      });
      return newFormat;
    } catch (error) {
      return [];
    }
  };

  const AssignedFunctionsTable = ({
    title,
    msgEmptyTable,
    directionIcon,
    data,
    onRemoveClick,
  }) => {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" colSpan={2}>
                  {title}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={2} align="center">
                    {msgEmptyTable}
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                data.map((fun) => (
                  <StyledTableRow
                    key={fun.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {directionIcon == "right" ? (
                      <>
                        <StyledTableCell>{fun.descripcion}</StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton onClick={() => onRemoveClick(fun, "A")}>
                            <FuseSvgIcon size={20} color="primary">
                              heroicons-outline:arrow-narrow-right
                            </FuseSvgIcon>
                          </IconButton>
                        </StyledTableCell>
                      </>
                    ) : (
                      <>
                        <StyledTableCell align="left">
                          <IconButton onClick={() => onRemoveClick(fun, "B")}>
                            <FuseSvgIcon size={20} color="primary">
                              heroicons-outline:arrow-narrow-left
                            </FuseSvgIcon>
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell>{fun.descripcion}</StyledTableCell>
                      </>
                    )}
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  const UserControls = ({
    tipoUsuarios,
    tipoUsuarioDefault,
    users,
    userDefault,
    onTipoUsuarioChange,
    onUserChange,
  }) => {
    const [user, setUser] = useState(userDefault); // Estado para almacenar el usuario seleccionado
    const [tipoUsuario, setTipoUsuario] = useState(tipoUsuarioDefault); // Estado para almacenar el usuario seleccionado

    const handleChangeTipoUsuario = (event) => {
      const tipoUsuario = event.target.value;
      setTipoUsuario(tipoUsuario);
      onTipoUsuarioChange(tipoUsuario);
    };

    const handleChangeUser = (event) => {
      const user = event.target.value;
      setUser(user);
      onUserChange(user);
    };

    return (
      <div className="flex gap-x-10 justify-center">
        <FormControl className="w-full sm:w-1/3 max-h-200" size="small">
          <InputLabel>Tipo Usuario</InputLabel>
          <Select
            label="Tipo Usuario"
            value={tipoUsuario}
            onChange={handleChangeTipoUsuario}
          >
            {tipoUsuarios.map((tipoUsuOption) => (
              <MenuItem
                key={tipoUsuOption.idTipoUsuario}
                value={tipoUsuOption.idTipoUsuario}
              >
                {tipoUsuOption.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="w-full sm:w-1/3 " size="small">
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

  return (
    <FusePageSimple
      content={
        <div className="w-full bg-white rounded-lg grid grid-cols-2 gap-24 p-24">
          <div className="col-span-2">
            <UserControls
              tipoUsuarios={listTipoUsuario}
              tipoUsuarioDefault={tipoUsuarioSelect}
              users={listUsers}
              userDefault={UsuarioSelect}
              onUserChange={handleUserChange}
              onTipoUsuarioChange={handleTipoUsuarioChange}
            />
          </div>

          <div className=" rounded-lg p-10">
            <AssignedFunctionsTable
              title="Roles Usuario"
              msgEmptyTable="No hay Roles Usuario Asignados"
              directionIcon="right"
              data={rowsA}
              onRemoveClick={handleRemove}
            />
          </div>
          <div className=" rounded-lg p-10">
            <AssignedFunctionsTable
              title="Usuarios"
              msgEmptyTable="No hay Usuarios Asignados"
              directionIcon="left"
              data={rowsB}
              onRemoveClick={handleRemove}
            />
          </div>
          <CustomAlert
            open={openAlert.state}
            onClose={() => setOpenAlert({ state: false, type: null })}
            title="¡Alerta!"
            message={
              openAlert.type === "add"
                ? `Se agregará el rol  ${rolSelected?.descripcion} al usuario ${usuarioSelectChange?.login}`
                : `Se quitará el rol  ${rolSelected?.descripcion} del usuario ${usuarioSelectChange?.login}`
            }
            onConfirm={() => handleConfirm(openAlert.type)} // Pasamos el parámetro de acción para handleConfirm
          />
          <CustomAlertTimer
            open={openAlertNotSelect.state}
            onClose={() => setOpenAlertNotSelect({ state: false, type: null })}
            title="¡Alerta!"
            autoCloseTime={1.35}
            message={
              openAlertNotSelect.type === "add"
                ? `Se debe seleccionar primero un Usuario`
                : `Se debe seleccionar primero un Rol Usuario `
            }
            onConfirm={() => handleConfirm(openAlertNotSelect.type)} // Pasamos el parámetro de acción para handleConfirm
          />
        </div>
      }
    />
  );
}

export default RolesToUsersDashboardApp;
