import FusePageSimple from "@fuse/core/FusePageSimple";
import _ from "@lodash";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import { environment } from "src/environment/environment";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { TablePaginationActions } from "src/app/main/components/Paginator/TablePaginationActions";
import {
  StyledTableCell,
  StyledTablePagination,
  StyledTableRow,
} from "src/app/main/components/StyledTable/StyledTable";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CustomAlert, {
  CustomAlertNoBtns,
} from "src/app/main/customAlerts/customAlert";
import { formatDate, formatDateForAPI } from "src/app/main/utils/formatDate";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";
import { useCheckoutStore } from "src/app/main/store/CheckoutDetail";
import Checkout from "../Checkout";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
function ProjectDashboardApp({
  setOpenNewOrder,
  triggerNewOrder,
  showPrices,
  updateList,
}) {
  const apiUrl = environment.apiUrl;
  const today = new Date();

  const [daysLater, setDaysLater] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [fechaLimiteCredito, setFechaLimiteCredito] = useState(today);
  const [showImage, setShowImage] = useState(false);

  const [products, setProducts] = useState([]);
  const [selectedProds, setSelectedProds] = useState([]);
  const [isProductSelected, setIsProductSelected] = useState(false);
  const [notas, setNotas] = useState("");
  const dispatch = useDispatch();
  const [sendOrder, setSendOrden] = useState(null);
  const [sendBody, setSendBody] = useState(null);
  const [updateIsCheckout] = useCheckoutStore((state) => [
    state.updateIsCheckout,
  ]);

  const [deliveryDate, updateDeliveryDate] = useCheckoutStore((state) => [
    state.deliveryDate,
    state.updateDeliveryDate,
  ]);

  const [quantity, updateQuantity] = useCheckoutStore((state) => [
    state.quantity,
    state.updateQuantity,
  ]);
  const [total, updateTotal] = useCheckoutStore((state) => [
    state.total,
    state.updateTotal,
  ]);

  const [paymentCheckout, updatePaymentCheckout] = useCheckoutStore((state) => [
    state.paymentCheckout,
    state.updatePaymentCheckout,
  ]);

  const [showAlert, updateShowAlert] = useCheckoutStore((state) => [
    state.showAlert,
    state.updateShowAlert,
  ]);

  const updateShowPrices = useCheckoutStore((state) => state.updateShowPrices);
  const [showDraft, updateShowDraft] = useCheckoutStore((state) => [
    state.showDraft,
    state.updateShowDraft,
  ]);

  const [showAlertDraft, updateShowAlertDraft] = useCheckoutStore((state) => [
    state.showAlertDraft,
    state.updateShowAlertDraft,
  ]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date);
    updateDeliveryDate(date); // zs
  };

  const handleShowImage = (event) => {
    setShowImage(event.target.checked);
  };

  const isDatePickerInvalid = formatDate(selectedDate) < formatDate(daysLater);

  const getHistorialSinPrecio = async () => {
    try {
      const url = apiUrl + "HistorialSinPrecio/GetHistorial";
      const { data } = await axios.get(url, {
        params: { hasPermission: showPrices },
      });
      console.log(data.data);
      setProducts(data.data);
    } catch (error) {}
  };

  const handleSelectedProductsChange = (selectedProducts) => {
    const isProductSelected = Object.values(selectedProducts).some(
      (product) => product.cantidad !== "" && parseInt(product.cantidad) > 0
    );

    console.log(selectedProducts);
    let cant = 0;
    let res = 0;
    Object.values(selectedProducts).forEach((element) => {
      cant += Number(element.cantidad);
      res += element.valorProducto * Number(element.cantidad);
    });
    updateQuantity(cant);
    updateTotal(res);

    setIsProductSelected(isProductSelected);
  };

  const handleChangeNotas = (event) => {
    setNotas(event.target.value);
  };

  const prepareOrderData = () => {
    const filteredItems = Object.values(selectedProds).filter(
      (item) => parseInt(item.cantidad) >= 1
    );
    const detailProductOrder = filteredItems.map((item) => {
      return {
        idDetallePedido: 0,
        idProducto: item.idProducto,
        idCliente: "",
        idTienda: "001",
        precio: item.valorProducto,
        cantidad: parseInt(item.cantidad),
        cantidad_Atendida: 0,
        idRegistroPedido: 0,
      };
    });

    const precioTotal = filteredItems.reduce((total, item) => {
      const cantidad = parseInt(item.cantidad);
      const valorProducto = item.valorProducto;
      return total + cantidad * valorProducto;
    }, 0);

    const productOrder = {
      idTienda: "001",
      fechaPedido: formatDateForAPI(today),
      fechaEntrega: formatDateForAPI(selectedDate),
      valor: precioTotal,
      igv: 0,
      montoTotal: precioTotal,
      descuento: 0,
      estado: "1",
      idTipoDoc: "91",
      totalEnviado: 0,
      fechaRegistro: formatDateForAPI(today),
      horaRegistro: today,
      nota: notas,
      IP: "",
    };

    return { order: productOrder, detail: detailProductOrder };
  };

  const saveOrder = async (order, detail) => {
    const body = {
      pedidoProducto: order,
      listDetallePedidoProducto: detail,
    };
    try {
      const url = apiUrl + "Pedido/SavePedidoAndDetalleProducto";
      await axios.post(url, body);
      setOpenNewOrder(false);
      triggerNewOrder(true);

      dispatch(
        showMessage({
          message: "Pedido creado correctamente...!",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "success",
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseNew = () => {
    setOpenNewOrder(false);
  };

  const handleConfirmDraft = () => {
    const { order, detail } = prepareOrderData();
    saveOrder(order, detail);
  };

  const handleConfirmCheckout = async () => {
    const { order, detail } = prepareOrderData();
    const body = {
      pedidoProducto: order,
      listDetallePedidoProducto: detail,
    };
    try {
      const url = apiUrl + "Pedido/SavePedidoAndDetalleProducto";
      const { data } = await axios.post(url, body);
      dispatch(
        showMessage({
          message: "Pedido creado correctamente...!",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "success",
        })
      );

      updateList(true);

      continueToCheckout(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const continueToCheckout = async (idOrder) => {
    console.log(idOrder);
    const _order = await getPedido(idOrder);
    const _detail = await getDetail(idOrder);
    const _body = prepareForCheckout(_order[0], _detail);
    console.log(_body);
    setSendOrden(_order[0]);
    setSendBody(_body);
    updatePaymentCheckout(true);
    //setpayment
  };

  const prepareForCheckout = (order, detail) => {
    const detailProductOrder = detail.map((item) => {
      return {
        idDetallePedido: 0,
        idProducto: item.idProducto,
        idCliente: "",
        idTienda: "001",
        precio: item.precio,
        cantidad: parseInt(item.cantidad),
        cantidad_Atendida: 0,
        idRegistroPedido: 0,
      };
    });

    const productOrder = {
      idRegistroPedido: order.idRegistroPedido, // X
      idCliente: "",
      idTienda: "",
      fechaPedido: "2023-07-27T16:32:31.977Z",
      fechaEntrega: formatDateForAPI(order.fechaEntrega), // X
      valor: 0,
      igv: 0,
      montoTotal: 0, // X
      descuento: 0,
      estado: "",
      idTipoDoc: "",
      totalEnviado: 0,
      idVendedor: "string",
      fechaRegistro: "2023-07-27T16:32:31.977Z",
      horaRegistro: "2023-07-27T16:32:31.977Z",
      nota: order.nota, // X
      IP: "",
    };

    const body = {
      pedidoProducto: productOrder,
      listDetallePedidoProducto: detailProductOrder,
    };

    return body;
  };

  const getPedido = async (id) => {
    console.log(id);
    try {
      const url = apiUrl + "Pedido/GetPedidoById";
      const { data } = await axios.get(url, {
        params: { Id: id, hasPermission: showPrices },
      });
      console.log(data);

      return data.data;
      // getDetail(order.idRegistroPedido);
    } catch (error) {
      return null;
    }
  };

  const getDetail = async (id) => {
    try {
      const url = apiUrl + "Pedido/GetDetallePedido";
      const { data } = await axios.get(url, {
        params: { IdRegistroPedido: id, hasPermission: showPrices },
      });
      return data.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getValidations = async () => {
    try {
      const url = apiUrl + "Pedido/GetDCreditoNdiasPedido";
      const { data } = await axios.get(url);
      const _daysLater = today.getDate() + Number(data.data[0].nroDiasPedido);
      let date = new Date();
      date.setDate(_daysLater);
      setDaysLater(date);

      const _daysCredit = today.getDate() + Number(data.data[0].diascredito);
      let date2 = new Date();
      date2.setDate(_daysCredit);
      setFechaLimiteCredito(date2);

      setSelectedDate(date);
      updateDeliveryDate(date);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistorialSinPrecio();
    getValidations();
    updateIsCheckout(true);
    // updateDeliveryDate(twoDaysLater);
    updateShowPrices(showPrices);
    updateShowDraft(true);

    return () => {
      updateIsCheckout(false);
      updateShowDraft(false);
    };
  }, []);

  if (paymentCheckout) {
    return (
      <Checkout
        order={sendOrder}
        showPrices={showPrices}
        savePedido={sendBody}
        handleCloseEdit={handleCloseNew}
        updateList={updateList}
        maxPaymentDate={fechaLimiteCredito}
      />
    );
  }

  return (
    <FusePageSimple
      content={
        <div className="w-full p-12 flex flex-col gap-y-10">
          <div className="flex gap-x-10 justify-between">
            <LocalizationProvider
              adapterLocale={es}
              dateAdapter={AdapterDateFns}
            >
              <DatePicker
                format="dd/MM/yyyy"
                slotProps={{ textField: { size: "small" } }}
                label="Entrega del pedido"
                minDate={daysLater}
                value={selectedDate}
                localeText={{
                  cancelButtonLabel: "Cancelar",
                  toolbarTitle: "Eliga una fecha",
                }}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
            <div className="flex gap-x-10">
              <FormControlLabel
                control={
                  <Switch checked={showImage} onChange={handleShowImage} />
                }
                label="Ver Imagen"
              />
              <button type="button" onClick={() => setOpenNewOrder(false)}>
                <ArrowCircleLeftSharpIcon /> Regresar
              </button>
            </div>
          </div>
          <ProductsTable
            data={products}
            selectedProds={selectedProds}
            setSelectedProds={setSelectedProds}
            onSelectedProductsChange={handleSelectedProductsChange}
            showPrices={showPrices}
            showImage={showImage}
          />
          <div className="flex gap-x-10 justify-between items-end">
            <TextField
              label="Notas"
              fullWidth
              size="small"
              variant="outlined"
              multiline
              value={notas}
              onChange={handleChangeNotas}
            />
          </div>

          <CustomAlert
            open={
              showAlertDraft && !(isDatePickerInvalid || !isProductSelected)
            }
            onClose={() => updateShowAlertDraft(false)}
            title="¡Alerta!"
            message="¿Desea guardar el borrador del pedido?"
            onConfirm={() => handleConfirmDraft()}
          />

          <CustomAlertNoBtns
            open={showAlertDraft && (isDatePickerInvalid || !isProductSelected)}
            onClose={() => updateShowAlertDraft(false)}
            title="¡Alerta!"
            message={
              !isProductSelected
                ? `Su pedido esta vacio...!`
                : "Fecha de entrega inválida"
            }
          />

          <CustomAlert
            open={showAlert && !(isDatePickerInvalid || !isProductSelected)}
            onClose={() => updateShowAlert(false)}
            title="¡Alerta!"
            message="¿Desea continuar y confirmar el pedido?"
            onConfirm={() => handleConfirmCheckout()}
          />

          <CustomAlertNoBtns
            open={showAlert && (isDatePickerInvalid || !isProductSelected)}
            onClose={() => updateShowAlert(false)}
            title="¡Alerta!"
            message={
              !isProductSelected
                ? `Su pedido esta vacio...!`
                : "Fecha de entrega inválida"
            }
          />
        </div>
      }
    />
  );
}

const ProductsTable = ({
  data,
  selectedProds,
  setSelectedProds,
  onSelectedProductsChange,
  showPrices,
  showImage,
}) => {
  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeProds = (prod, quantity) => {
    setSelectedProds((prevSelectedProds) => ({
      ...prevSelectedProds,
      [prod.idProducto]: {
        ...prod,
        cantidad: quantity,
        total: quantity * prod.valorProducto, // Calculate the total
      },
    }));
  };

  // Sincronizar la cantidad de selectedProds con los datos en data
  const dataWithQuantities = data.map((prod) => ({
    ...prod,
    cantidad: selectedProds[prod.idProducto]?.cantidad || 0,
    total: (selectedProds[prod.idProducto]?.cantidad || 0) * prod.valorProducto,
  }));

  useEffect(() => {
    onSelectedProductsChange(selectedProds);
  }, [selectedProds]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell className="hidden sm:table-cell">
              N°{" "}
            </StyledTableCell>
            <StyledTableCell>Producto</StyledTableCell>
            <StyledTableCell>Cantidad</StyledTableCell>
            {showPrices && <StyledTableCell>Precio</StyledTableCell>}
            {showPrices && <StyledTableCell>Total</StyledTableCell>}
            <StyledTableCell>
              <div className="flex flex-col">
                  <span className="w-[120px] text-center">Últimos Pedidos</span>
                <div className="flex">
                  <span className="w-[40px] text-center">1</span>
                  <span className="w-[40px] text-center">2</span>
                  <span className="w-[40px] text-center">3</span>
                </div>
              </div>
            </StyledTableCell>
            {showImage && <StyledTableCell>Foto</StyledTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? dataWithQuantities.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : dataWithQuantities
          ).map((prod, i) => (
            <StyledTableRow key={prod.idProducto}>
              <StyledTableCell className="hidden sm:table-cell">
                {" "}
                {++i}{" "}
              </StyledTableCell>
              <StyledTableCell>{prod.descripcionProducto}</StyledTableCell>
              <StyledTableCell>
                <TextField
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 25,
                      minHeight: 25,
                      fontSize: "1.2rem",
                    },
                    width: 60,
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                  }}
                  variant="outlined"
                  type="number"
                  onChange={(e) => handleChangeProds(prod, e.target.value)}
                  defaultValue={prod.cantidad}
                />
              </StyledTableCell>
              {showPrices && (
                <StyledTableCell>
                  {formatCurrency(prod.valorProducto)}
                </StyledTableCell>
              )}
              {showPrices && (
                <StyledTableCell>
                  {formatCurrency(selectedProds[prod.idProducto]?.total || 0)}
                </StyledTableCell>
              )}
              <StyledTableCell>
                <LastOrdersTable
                  cant1={prod.cantidad1}
                  cant2={prod.cantidad2}
                  cant3={prod.cantidad3}
                />
              </StyledTableCell>
              {showImage && (
                <StyledTableCell>
                  {prod.imagen && (
                    <img
                      src={prod.imagen}
                      alt="Preview"
                      className="w-[30px] h-[30px]"
                    />
                  )}
                </StyledTableCell>
              )}
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
              count={data.length}
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

const LastOrdersTable = ({ cant1, cant2, cant3 }) => {
  return (
    <table>
      <tbody>
        <tr className="border-2 border-gray-500 rounded-lg">
          <td className="p-2 w-[40px] h-[22px] text-right">{cant1}</td>
          <td className="p-2 w-[40px] h-[22px] border-x-2 border-gray-500 text-right">
            {cant2}
          </td>
          <td className="p-2 w-[40px] h-[22px] text-right">{cant3}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ProjectDashboardApp;
