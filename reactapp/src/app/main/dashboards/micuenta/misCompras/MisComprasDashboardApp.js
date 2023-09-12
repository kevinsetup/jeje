import FusePageSimple from "@fuse/core/FusePageSimple/FusePageSimple";
import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { environment } from "src/environment/environment";
import axios from "axios";
import permissions from "../../../utils/permissions";
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
import {
  StyledTableCell,
  StyledTablePagination,
  StyledTableRow,
} from "src/app/main/components/StyledTable/StyledTable";
import { TablePaginationActions } from "src/app/main/components/Paginator/TablePaginationActions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { formatDate, formatDateForAPI } from "src/app/main/utils/formatDate";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import Button from "@mui/material/Button";
import Detail from "../../analytics/Components/Detail";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const apiUrl = environment.apiUrl;
const getComprasByDate = async (hasPermission, dateFrom, dateTo) => {
  try {
    const url = apiUrl + "Pedido/GetPedidosConfirmadosByDate";
    const { data } = await axios.get(url, {
      params: {
        fechaInicio: formatDateForAPI(dateFrom),
        fechaFin: formatDateForAPI(dateTo),
        hasPermission: hasPermission,
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const checkPermission = async () => {
  try {
    const url = apiUrl + "Permisos/CheckUserPermission";
    const { data } = await axios.get(url, {
      params: { IdPermiso: permissions.VER_PRECIOS },
    });
    return data.data.result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getOneMonthBefore = (date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
};

const MisComprasDashboardApp = () => {
  const [showPrices, setShowPrices] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [compras, setCompras] = useState([]);
  const [datePick, setDatePick] = useState({
    from: getOneMonthBefore(new Date()),
    to: new Date(),
  });

  const fetchData = async () => {
    const hasPermission = await checkPermission();
    console.log(hasPermission);
    setShowPrices(hasPermission);
    const data = await getComprasByDate(
      hasPermission,
      datePick.from,
      datePick.to
    );
    console.log(data);
    setCompras(data);
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };
  const handleDateChange = (datePick) => {
    setDatePick(datePick);
  };
  const onSearch = async () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (openDetail) {
    return (
      <div className="p-24">
        <Detail
          order={selectedOrder}
          setOpenDetail={setOpenDetail}
          showPrices={showPrices}
          viewOnlyDetail={true}
        />
      </div>
    );
  }

  return (
    <FusePageSimple
      content={
        <div className="w-full p-24 flex flex-col gap-12">
          <Card
            content={
              <div className="flex flex-col md:flex-row justify-between gap-x-10">
                <h2 className="font-semibold"> Mis Compras</h2>

                <div className="flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12 md:items-center">
                  <div>Fecha de registro: </div>

                  <div>
                    <LocalizationProvider
                      adapterLocale={es}
                      dateAdapter={AdapterDateFns}
                    >
                      <DatePicker
                        format="dd/MM/yyyy"
                        value={datePick.from}
                        slotProps={{ textField: { size: "small" } }}
                        label="Desde"
                        localeText={{
                          cancelButtonLabel: "Cancelar",
                          toolbarTitle: "Eliga una fecha",
                        }}
                        onChange={(date) =>
                          handleDateChange({ ...datePick, from: date })
                        }
                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <LocalizationProvider
                      adapterLocale={es}
                      dateAdapter={AdapterDateFns}
                    >
                      <DatePicker
                        format="dd/MM/yyyy"
                        value={datePick.to}
                        slotProps={{ textField: { size: "small" } }}
                        label="Hasta"
                        localeText={{
                          cancelButtonLabel: "Cancelar",
                          toolbarTitle: "Eliga una fecha",
                        }}
                        onChange={(date) =>
                          handleDateChange({ ...datePick, to: date })
                        }
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="whitespace-nowrap w-full md:w-auto"
                      variant="contained"
                      color="primary"
                      endIcon={<Search />}
                      onClick={() => onSearch()}
                    >
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>
            }
          />
          {/* <Card
            content={
              <TextField
                label="Buscar por N° de pedido"
                variant="outlined"
                size="small"
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
              />
            }
          /> */}
          <MisComprasTable
            compras={compras}
            showPrices={showPrices}
            handleOpenDetail={handleOpenDetail}
          />
        </div>
      }
    />
  );
};

const Card = ({ content }) => {
  return (
    <div className="w-full p-20 bg-white rounded-lg shadow-md">{content}</div>
  );
};

const MisComprasTable = ({ compras, handleOpenDetail, showPrices }) => {
  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - compras.length) : 0;
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
            <StyledTableCell>ID </StyledTableCell>
            <StyledTableCell>ID Pedido</StyledTableCell>
            <StyledTableCell>Fecha realizada</StyledTableCell>
            <StyledTableCell>Fecha de entrega</StyledTableCell>
            <StyledTableCell>Nombre empresa</StyledTableCell>
            <StyledTableCell>Vendedor</StyledTableCell>
            <StyledTableCell>Tipo Pago</StyledTableCell>
            {showPrices && <StyledTableCell>Monto Total</StyledTableCell>}
            <StyledTableCell>Estado Pago</StyledTableCell>
            <StyledTableCell>Opciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? compras.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : compras
          ).map((order, i) => (
            <StyledTableRow key={order.idRegistroPedido}>
              <StyledTableCell> {order.idRegistroPedido} </StyledTableCell>
              <StyledTableCell> {order.idPedidoProducto} </StyledTableCell>
              <StyledTableCell>{formatDate(order.fechaPedido)}</StyledTableCell>
              <StyledTableCell>
                {formatDate(order.fechaEntrega)}
              </StyledTableCell>

              <StyledTableCell>{order.nombreEmpresa}</StyledTableCell>
              <StyledTableCell>{`${order.apellidos} ${order.nombres}`}</StyledTableCell>
              <StyledTableCell>{order.tipoPago}</StyledTableCell>
              {showPrices && (
                <StyledTableCell>
                  {formatCurrency(order.montoTotal)}
                </StyledTableCell>
              )}
              <StyledTableCell>{order.descripcionEstadoPago} </StyledTableCell>

              <StyledTableCell>
                <div className="flex gap-x-10">
                  <Button
                    onClick={() => handleOpenDetail(order)}
                    className="whitespace-nowrap "
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Detalle
                  </Button>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <StyledTableRow>
              <TableCell colSpan={6} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <StyledTablePagination
              rowsPerPageOptions={[10, 15, 20, { label: "Todos", value: -1 }]}
              colSpan={6}
              count={compras.length}
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
};
export default MisComprasDashboardApp;
