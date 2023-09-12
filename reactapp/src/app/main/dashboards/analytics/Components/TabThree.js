import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import CustomAlert from "src/app/main/customAlerts/customAlert";
import Detail from "./Detail";
import { Search } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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
import { environment } from "src/environment/environment";
import axios from "axios";
import { formatDate, formatDateForAPI } from "src/app/main/utils/formatDate";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { ExcelFormat } from "src/app/main/components/ExcelGenerator/ExcelFormat";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const getOneMonthBefore = (date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
};

const TabThree = ({ showPrices }) => {
  const apiUrl = environment.apiUrl;
  const [orders, setOrders] = useState([]);

  const [datePick, setDatePick] = useState({
    from: getOneMonthBefore(new Date()),
    to: new Date(),
  });

  const [openAlert, setOpenAlert] = useState({
    state: false,
    type: null,
    order: null,
  });

  const dispatch = useDispatch();
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenCancel = async (order) => {
    console.log(order);
    setOpenAlert({ state: true, type: "add", order: order });
  };

  const handleConfirm = async (answer) => {
    if (answer == "add") {
      console.log(openAlert.order.idRegistroPedido);
      const ss = await cancelPedido(openAlert.order.idRegistroPedido);
      handleUpdateOrder(true);

      dispatch(
        showMessage({
          message: "Pedido cancelado correctamente",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "success",
        })
      );
    }
  };

  const cancelPedido = async (idRegistroPedido) => {
    try {
      const url = apiUrl + "Pedido/CancelarPedidoProducto";
      const { data } = await axios.delete(url, {
        params: { IdRegistroPedido: idRegistroPedido },
      });
      return data.data.result;
    } catch (error) {
      return false;
    }
  };

  const handleDateChange = (datePick) => {
    setDatePick(datePick);
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const getPedidosByDate = async (hasPermission) => {
    try {
      const url = apiUrl + "Pedido/GetPedidosEnviadosByDate";
      const { data } = await axios.get(url, {
        params: {
          fechaInicio: formatDateForAPI(datePick.from),
          fechaFin: formatDateForAPI(datePick.to),
          hasPermission: hasPermission,
        },
      });
      console.log(data.data);
      setOrders(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    await getPedidosByDate(showPrices);
  };

  const onSearch = async () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (openDetail) {
    return (
      <Detail
        order={selectedOrder}
        setOpenDetail={setOpenDetail}
        showPrices={showPrices}
        viewOnlyDetail={true}
      />
    );
  }

  const dowloadExcel = async (orders) => {
    //
    const config = {
      headers: [
        "ID Registro",
        "Fecha Pedido",
        "Fecha Entrega",
        "Monto Total",
        "Nombre Empresa",
        "Apellidos",
        "Nombres",
        "Nota",
      ],
      key: [
        "idRegistroPedido",
        "fechaPedido",
        "fechaEntrega",
        "montoTotal",
        "nombreEmpresa",
        "apellidos",
        "nombres",
        "nota",
      ],
      size: [15, 15, 15, 15, 20, 15, 15, 30], // Tamaño de cada columna (ancho)
      tipeOf: [
        "numero",
        "fecha",
        "fecha",
        "numero",
        "texto",
        "texto",
        "texto",
        "texto",
      ], // Tipo de dato de cada columna ('numero', 'fecha', 'texto', etc.)
      theme: { header: "93c47d", line: "d9ead3", interspersed: true },
    };

    ExcelFormat(orders, config);
  };

  return (
    <div>
      <div className="p-9 rounded-sm w-full flex flex-row justify-between gap-x-12">
        <div className="flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12 md:items-center">
          <div>Fecha de registro: </div>
          <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
            <div>
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
            </div>
            <div>
              <DatePicker
                format="dd/MM/yyyy"
                value={datePick.to}
                slotProps={{ textField: { size: "small" } }}
                label="Hasta"
                localeText={{
                  cancelButtonLabel: "Cancelar",
                  toolbarTitle: "Eliga una fecha",
                }}
                onChange={(date) => handleDateChange({ ...datePick, to: date })}
              />
            </div>
          </LocalizationProvider>

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
          <div className="flex items-end">
            <Button
              className="whitespace-nowrap w-full md:w-auto"
              variant="contained"
              color="primary"
              endIcon={<Search />}
              onClick={() => dowloadExcel(orders)}
            >
              Excel
            </Button>
          </div>
        </div>
      </div>
      <OrderTable
        orders={orders}
        handleOpenDetail={handleOpenDetail}
        showPrices={showPrices}
      />
      <CustomAlert
        open={openAlert.state}
        onClose={() => setOpenAlert({ state: false, type: null })}
        title="¡Alerta!"
        message={`¿ Estas seguro de descargar este pedido ?`}
        onConfirm={() => handleConfirm(openAlert.type)} // Pasamos el parámetro de acción para handleConfirm
      />
    </div>
  );
};

const OrderTable = ({ orders, handleOpenDetail, showPrices }) => {
  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;
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
            <StyledTableCell>Fecha realizada</StyledTableCell>
            <StyledTableCell>Fecha de entrega</StyledTableCell>
            <StyledTableCell>Nombre empresa</StyledTableCell>
            <StyledTableCell>Vendedor</StyledTableCell>
            {showPrices && <StyledTableCell>Monto Total</StyledTableCell>}
            <StyledTableCell>Opciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : orders
          ).map((order, i) => (
            <StyledTableRow key={order.idRegistroPedido}>
              <StyledTableCell> {order.idRegistroPedido} </StyledTableCell>
              <StyledTableCell>{formatDate(order.fechaPedido)}</StyledTableCell>
              <StyledTableCell>
                {formatDate(order.fechaEntrega)}
              </StyledTableCell>

              <StyledTableCell>{order.nombreEmpresa}</StyledTableCell>
              <StyledTableCell>{`${order.apellidos} ${order.nombres}`}</StyledTableCell>
              {showPrices && (
                <StyledTableCell>
                  {formatCurrency(order.montoTotal)}
                </StyledTableCell>
              )}
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
                  {/* <Button
                    onClick={() => handleDownloadOrder(order)}
                    className="whitespace-nowrap "
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Descargar
                  </Button> */}
                  {/* <Button
                    onClick={() => handleOpenCancel(order)}
                    className="whitespace-nowrap "
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Cancelar
                  </Button> */}
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
              count={orders.length}
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

export default TabThree;
