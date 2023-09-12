import FusePageSimple from "@fuse/core/FusePageSimple";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";
import { TablePaginationActions } from "src/app/main/components/Paginator/TablePaginationActions";
import {
  StyledTableCell,
  StyledTablePagination,
  StyledTableRow,
} from "src/app/main/components/StyledTable/StyledTable";
import axios from "axios";
import { environment } from "src/environment/environment";
import DirectionForm from "./Components/DirectionForm/index";
import CustomAlert from "src/app/main/customAlerts/customAlert";
import { stubTrue } from "lodash";

function UserTable({ listUsers, handleOpenEditUser, handleDelete }, props) {

  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listUsers.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>N° </StyledTableCell>
            <StyledTableCell>Direccion</StyledTableCell>

            <StyledTableCell>Opciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? listUsers.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : listUsers
          ).map((user, i) => (
            <StyledTableRow key={user.idDireccionEnvio}>
              <StyledTableCell> {++i} </StyledTableCell>
              <StyledTableCell>{user.direccion}</StyledTableCell>
              <StyledTableCell>
                <div className="flex gap-x-10">
                <Button
                  onClick={() => handleOpenEditUser(user)}
                  className="whitespace-nowrap "
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Editar
                </Button>

                <Button
                  onClick={() => handleDelete(user.idDireccionEnvio)}
                  className="whitespace-nowrap "
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Eliminar
                </Button>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <StyledTableRow>
              <TableCell colSpan={5} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <StyledTablePagination
              rowsPerPageOptions={[10, 15, 20, { label: "Todos", value: -1 }]}
              colSpan={5}
              count={listUsers.length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="Items por página"
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "items per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

function UsersDashboardApp() {
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedDir, setSelectedDir] = useState('')
  const [listUsers, setListUsers] = useState([]);

  const handleOpenForm = (mode, user = null) => {
    setFormMode(mode);
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleCancelForm = () => {
    setOpenForm(false);
    setFormMode(null);
    setSelectedUser(null);
  };
  const handleSaveUser = () => {
   fetchUsers();
  };

  const handleOpenAlert = (answer) => {
    console.log(answer)
    setSelectedDir(answer)
    setOpenAlert(true);
  };

  const handleConfirmAlert = async () => {
    try {
      const apiUrl = `${environment.apiUrl}DireccionEnvio/DeleteDirecccionEnvio`;
      const _body = {
        idDireccionEnvio: selectedDir,
        direccion: "",
        idCliente: "",
      };
      const { data } = await axios.delete(apiUrl, { data: _body });
      console.log(data);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

    const fetchUsers = async () => {
    try {
      const apiUrl = `${environment.apiUrl}DireccionEnvio/GetDireccionEnvio`;
      const { data } = await axios.get(apiUrl);
      console.log(data);
      setListUsers(data.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <FusePageSimple
      content={
        <div className="w-full p-24 flex flex-col gap-10 items-center">
          {openForm && (
            <DirectionForm
              isEditing={formMode === "edit"}
              user={selectedUser}
              onSave={handleSaveUser}
              onCancel={handleCancelForm}
            />
          )}
          {!openForm && (
            <>
              <div className="flex flex-row w-full justify-end">
                <Button
                  onClick={() => handleOpenForm("new")}
                  className="whitespace-nowrap "
                  variant="contained"
                  color="primary"
                  endIcon={<AddIcon />}
                >
                  Nuevo
                </Button>
              </div>
              <UserTable
              listUsers={listUsers}
                handleDelete={handleOpenAlert}
                handleOpenEditUser={(user) => handleOpenForm("edit", user)}
              />
              <CustomAlert
                open={openAlert}
                onClose={() => setOpenAlert(false)}
                title="¡Alerta!"
                message={`¿Estas seguro de eliminar esta dirección?`}
                onConfirm={() => handleConfirmAlert()}
              />
            </>
          )}
        </div>
      }
    />
  );
}

export default UsersDashboardApp;
