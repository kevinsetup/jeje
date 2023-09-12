import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import CustomAlert, {
  CustomAlertInput,
} from "src/app/main/customAlerts/customAlert";
import Detail from "./Detail";
import Edit from "./Edit";
import Checkout from "./Checkout";
import { Add, Search } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ProjectDashboardApp from "./NewOrder";
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
import { formatDate } from "src/app/main/utils/formatDate";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
function TabOne({
  orders,
  showPrices,
  handleNewOrder,
  handleUpdateOrder,
  datePick,
  onChangeDatePick,
  onSearch,
  updateList,
}) {
  const apiUrl = environment.apiUrl;
  const [openAlert, setOpenAlert] = useState({
    state: false,
    type: null,
    order: null,
  });
  const dispatch = useDispatch();

  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Nuevo estado
  const [confirmedProducts, setConfirmedProducts] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [openNewOrder, setOpenNewOrder] = useState(false);
  const handleOpenEdit = (order) => {
    setSelectedOrder(order); // Actualizar el producto seleccionado
    setOpenEdit(true);
  };
  const handleOpenCancel = async (order) => {
    console.log(order);
    setOpenAlert({ state: true, type: "add", order: order });
  };
  const handleConfirm = async (value) => {
    console.log(openAlert.order.idRegistroPedido);
    await cancelPedido(openAlert.order.idRegistroPedido, value);
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
  };
  const cancelPedido = async (idRegistroPedido, justificacion) => {
    try {
      const url = apiUrl + "Pedido/CancelarPedidoProducto";
      const { data } = await axios.delete(url, {
        params: {
          IdRegistroPedido: idRegistroPedido,
          Justificacion: justificacion,
        },
      });
      return data.data.result;
    } catch (error) {
      console.log(error);
      return false; // En caso de error, asumimos que no tiene el permiso
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleShowNewOrder = () => {
    setOpenNewOrder(true);
  };

  
  useEffect(() =>{
    console.log('openNewOrder: ' + openNewOrder);
  },[openNewOrder])


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

  if (openEdit) {
    return (
      <Edit
        order={selectedOrder}
        showPrices={showPrices}
        setOpenEdit={setOpenEdit}
        updateList={updateList}
      />
    ); // Pasar el producto como prop
  }

  if (showCheckout) {
    return <Checkout products={confirmedProducts} />;
  }

  if (openNewOrder) {
    
    return (
      <ProjectDashboardApp
        showPrices={showPrices}
        setOpenNewOrder={setOpenNewOrder}
        triggerNewOrder={handleNewOrder}
        updateList={updateList}
      />
    );
  }

  return (
    <div>
      <div className="p-9 rounded-sm w-full flex flex-col md:flex-row justify-between space-y-12 md:space-y-0 md:space-x-12">
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
                  onChangeDatePick({ ...datePick, from: date })
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
                onChange={(date) => onChangeDatePick({ ...datePick, to: date })}
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
        <div className="flex items-end md:items-center">
          <Button
            className="whitespace-nowrap w-full md:w-auto"
            variant="contained"
            color="primary"
            endIcon={<Add />}
            onClick={() => handleShowNewOrder()}
          >
            Nuevo Pedido
          </Button>
        </div>
      </div>
      <OrderTable
        orders={orders}
        handleOpenDetail={handleOpenDetail}
        handleOpenEdit={handleOpenEdit}
        handleOpenCancel={handleOpenCancel}
        showPrices={showPrices}
      />
      <CustomAlertInput
        open={openAlert.state}
        label="Justificación"
        onClose={() => setOpenAlert({ state: false, type: null })}
        title="¡Alerta!"
        message={`¿ Estas seguro de cancelar este pedido ?`}
        onConfirm={(textValue) => {
          handleConfirm(textValue);
        }}
      />
    </div>
  );
}

const OrderTable = ({
  orders,
  handleOpenDetail,
  handleOpenEdit,
  showPrices,
  handleOpenCancel,
}) => {
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
            <StyledTableCell align="center">Opciones</StyledTableCell>
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
                  {" "}
                  {formatCurrency(order.montoTotal)}{" "}
                </StyledTableCell>
              )}
              <StyledTableCell>
                <div className="flex gap-x-10 justify-center">
                  <Button
                    onClick={() => handleOpenDetail(order)}
                    className="whitespace-nowrap "
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Detalle
                  </Button>
                  <Button
                    onClick={() => handleOpenEdit(order)}
                    className="whitespace-nowrap "
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleOpenCancel(order)}
                    className="whitespace-nowrap "
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Cancelar
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

export default TabOne;
