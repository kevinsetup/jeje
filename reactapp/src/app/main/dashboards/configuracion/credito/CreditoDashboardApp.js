import FusePageSimple from '@fuse/core/FusePageSimple';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from '@mui/material';
import { TablePaginationActions } from 'src/app/main/components/Paginator/TablePaginationActions';
import {
  StyledTableCell,
  StyledTablePagination,
  StyledTableRow,
} from 'src/app/main/components/StyledTable/StyledTable';
import axios from 'axios';
import { environment } from 'src/environment/environment';
import DirectionForm from './Components/DirectionForm/index';

function UserTable({ handleOpenEditUser }, props) {
  const [listUsers, setListUsers] = useState([]);

  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listUsers.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchUsers = async () => {
    try {
      const apiUrl = `${environment.apiUrl}Credito/GetCreditos`;
      const { data } = await axios.get(apiUrl);
      console.log(data);
      setListUsers(data.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  };
  const handleDelete = async (idDireccionEnvio) => {
    try {
      const apiUrl = `${environment.apiUrl}DireccionEnvio/DeleteDirecccionEnvio`;
      const _body = {
        idDireccionEnvio,
        direccion: '',
        idCliente: '',
      };
      const { data } = await axios.delete(apiUrl, { data: _body });
      console.log(data);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>N° </StyledTableCell>
            <StyledTableCell>Cliente</StyledTableCell>

            <StyledTableCell>Credito inicial</StyledTableCell>
            <StyledTableCell>Credito Utilizado </StyledTableCell>
            <StyledTableCell>Fecha de inserción </StyledTableCell>

            <StyledTableCell>Opciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? listUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : listUsers
          ).map((user, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell> {++i} </StyledTableCell>
              <StyledTableCell>{user.nombres}</StyledTableCell>

              <StyledTableCell>{user.credito_inicial}</StyledTableCell>
              <StyledTableCell>S/ {user.credito_utilizado}</StyledTableCell>
              <StyledTableCell>{user.fechaInsercion}</StyledTableCell>

              <StyledTableCell>
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
              rowsPerPageOptions={[10, 15, 20, { label: 'Todos', value: -1 }]}
              colSpan={5}
              count={listUsers.length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="Items por página"
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'items per page',
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
    // Lógica para guardar el rol
    // Puedes manejarlo según si es una edición o una creación
  };
  return (
    <FusePageSimple
      content={
        <div className="w-full p-24 flex flex-col gap-10 items-center">
          {openForm && (
            <DirectionForm
              isEditing={formMode === 'edit'}
              user={selectedUser}
              onSave={handleSaveUser}
              onCancel={handleCancelForm}
            />
          )}
          {!openForm && (
            <>
              <div className="flex flex-row w-full justify-end">
                <Button
                  onClick={() => handleOpenForm('new')}
                  className="whitespace-nowrap "
                  variant="contained"
                  color="primary"
                  endIcon={<AddIcon />}
                >
                  Nuevo
                </Button>
              </div>
              <UserTable handleOpenEditUser={(user) => handleOpenForm('edit', user)} />
            </>
          )}
        </div>
      }
    />
  );
}

export default UsersDashboardApp;
