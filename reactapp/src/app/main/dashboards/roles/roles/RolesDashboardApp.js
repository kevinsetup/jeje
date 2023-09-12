import FusePageSimple from '@fuse/core/FusePageSimple';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import {
  StyledTableCell,
  StyledTablePagination,
  StyledTableRow,
} from 'src/app/main/components/StyledTable/StyledTable';
import axios from 'axios';
import { environment } from 'src/environment/environment';
import RoleForm from './Components/RoleForm';

/* Componentes */
function RoleTable({ handleOpenEditRole }, props) {
  const [roles, setRoles] = useState([]);

  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchRoles = async () => {
    try {
      const apiUrl = `${environment.apiUrl}Roles/GetRoles`;
      const { data } = await axios.get(apiUrl);
      setRoles(data.data);
      setPage(0);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="w-full">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>N° </StyledTableCell>
              <StyledTableCell>Rol</StyledTableCell>
              <StyledTableCell>Tipo Usuario</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell align="center">Opciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : roles
            ).map((role, i) => (
              <StyledTableRow key={role.idRol}>
                <StyledTableCell> {++i} </StyledTableCell>
                <StyledTableCell>{role.desRol}</StyledTableCell>
                <StyledTableCell>{role.nomTipoUsuario}</StyledTableCell>
                <StyledTableCell>{role.estado ? 'Activo' : 'Inactivo'}</StyledTableCell>
                <StyledTableCell align="center">
                  <div className="flex gap-x-10 justify-center">
                    <Button
                      onClick={() => handleOpenEditRole(role)}
                      className="whitespace-nowrap "
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Editar
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
                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                colSpan={5}
                count={roles.length}
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
    </div>
  );
}

/* Dashbaord */
function RolesDashboardApp() {
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleOpenForm = (mode, role = null) => {
    setFormMode(mode);
    setSelectedRole(role);
    setOpenForm(true);
  };

  const handleCancelForm = () => {
    setOpenForm(false);
    setFormMode(null);
    setSelectedRole(null);
  };

  return (
    <FusePageSimple
      content={
        <div className="w-full p-24 flex flex-col gap-10 items-center">
          {openForm && (
            <RoleForm
              isEditing={formMode === 'edit'}
              role={selectedRole}
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
              <RoleTable handleOpenEditRole={(role) => handleOpenForm('edit', role)} />
            </>
          )}
        </div>
      }
    />
  );
}

export default RolesDashboardApp;
