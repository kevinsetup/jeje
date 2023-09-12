import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useState, useEffect, useCallback, useRef } from "react";
import Checkout from "../Checkout";
import { environment } from "src/environment/environment";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import _ from "@lodash";
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
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import { formatDate, formatDateForAPI } from "src/app/main/utils/formatDate";
import { debounce, forEach } from "lodash";
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";
import permissions from "src/app/main/utils/permissions";
import { useCheckoutStore } from "src/app/main/store/CheckoutDetail";
import CustomAlert, {
  CustomAlertNoBtns,
} from "src/app/main/customAlerts/customAlert";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Edit = ({ setOpenEdit, order, showPrices, updateList }) => {
  const apiUrl = environment.apiUrl;
  const [products, setProducts] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [showAllItems, setShowAllItems] = useState(false);
  // const twoDaysLater = new Date(order.fechaPedido);
  // twoDaysLater.setDate(twoDaysLater.getDate() + 2);
  const today = new Date();
  const [daysLater, setDaysLater] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const isDatePickerInvalid = formatDate(selectedDate) < formatDate(daysLater);
  const [fechaLimiteCredito, setFechaLimiteCredito] = useState(today);
  const [lastProds, setLastProds] = useState([]);
  const dispatch = useDispatch();
  const [notas, setNotas] = useState("");
  const stateRef = useRef({ selectedDate: null, notas: "" });
  //Checkout
  const [body, setBody] = useState({});
  const [showImage, setShowImage] = useState(false);

  const [quantity, updateQuantity] = useCheckoutStore((state) => [
    state.quantity,
    state.updateQuantity,
  ]);
  const [total, updateTotal] = useCheckoutStore((state) => [
    state.total,
    state.updateTotal,
  ]);
  const [deliveryDate, updateDeliveryDate] = useCheckoutStore((state) => [
    state.deliveryDate,
    state.updateDeliveryDate,
  ]);

  const [updateIsCheckout] = useCheckoutStore((state) => [
    state.updateIsCheckout,
  ]);

  const [showAlert, updateShowAlert] = useCheckoutStore((state) => [
    state.showAlert,
    state.updateShowAlert,
  ]);

  const [payment, updatePayment] = useCheckoutStore((state) => [
    state.paymentCheckout,
    state.updatePaymentCheckout,
  ]);
  const updateShowPrices = useCheckoutStore((state) => state.updateShowPrices);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateDebounced(lastProds);
  };

  const handleShowImage = (event) => {
    setShowImage(event.target.checked);
  };

  const handleChangeNotas = (event) => {
    setNotas(event.target.value);
    updateDebounced(lastProds);
  };

  const updateDebounced = useCallback(
    debounce((lastProds) => {
      dispatch(
        showMessage({
          message: "Guardando datos...!",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "info",
        })
      );
      updateProductQuantity(lastProds);
    }, 1000),
    []
  );

  const updateProductQuantity = (updatedProducts) => {
    setLastProds(updatedProducts);

    const detailProductOrder = updatedProducts.map((item) => {
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

    const precioTotal = updatedProducts.reduce((total, item) => {
      const cantidad = parseInt(item.cantidad);
      const valorProducto = item.precio;
      return total + cantidad * valorProducto;
    }, 0);

    const productOrder = {
      idRegistroPedido: order.idRegistroPedido, // X
      idCliente: "",
      idTienda: "",
      fechaPedido: "2023-07-27T16:32:31.977Z",
      fechaEntrega: formatDateForAPI(stateRef.current.selectedDate), // X
      valor: 0,
      igv: 0,
      montoTotal: precioTotal, // X
      descuento: 0,
      estado: "",
      idTipoDoc: "",
      totalEnviado: 0,
      idVendedor: "string",
      fechaRegistro: "2023-07-27T16:32:31.977Z",
      horaRegistro: "2023-07-27T16:32:31.977Z",
      nota: stateRef.current.notas, // X
      IP: "",
    };

    const body = {
      pedidoProducto: productOrder,
      listDetallePedidoProducto: detailProductOrder,
    };

    updatePedido(body);
  };

  const updatePedido = async (body) => {
    try {
      const url = apiUrl + "Pedido/EditPedidoAndDetalleProducto";
      const { data } = await axios.put(url, body);

      await getPedido();
      dispatch(
        showMessage({
          message: "Pedido actualizado correctamente...!",
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

  const handleShowAllItemsChange = (event) => {
    setShowAllItems(event.target.checked);
  };

  const getDetail = async (id) => {
    try {
      const hasPermission = await checkPermission();
      const url = apiUrl + "Pedido/GetDetallePedido";
      const { data } = await axios.get(url, {
        params: { IdRegistroPedido: id, hasPermission: hasPermission },
      });
      let cant = 0;
      let res = 0;
      data.data.forEach((element) => {
        cant += element.cantidad;
        res += element.precio * element.cantidad;
      });
      setProducts(data.data);

      updateQuantity(cant);
      updateTotal(res);

      setLastProds(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getHistorialSinPrecio = async () => {
    try {
      const hasPermission = await checkPermission();
      const url = apiUrl + "HistorialSinPrecio/GetHistorial";
      const { data } = await axios.get(url, {
        params: { hasPermission: hasPermission },
      });
      setAllItems(data.data);
    } catch (error) {}
  };

  const getPedido = async () => {
    try {
      const hasPermission = await checkPermission();
      const url = apiUrl + "Pedido/GetPedidoById";
      const { data } = await axios.get(url, {
        params: { Id: order.idRegistroPedido, hasPermission: hasPermission },
      });
      getDetail(order.idRegistroPedido);
    } catch (error) {}
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

  /* Update */

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCheckout = () => {
    const detailProductOrder = lastProds.map((item) => {
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
      fechaEntrega: formatDateForAPI(stateRef.current.selectedDate), // X
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
      nota: stateRef.current.notas, // X
      IP: "",
    };

    const body = {
      pedidoProducto: productOrder,
      listDetallePedidoProducto: detailProductOrder,
    };

    return body;
  };

  const handleReturn = () => {
    updateIsCheckout(false);
    setOpenEdit(false);
  };

  const handleConfirmCheckout = () => {
    updatePayment(true);
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetail(order.idRegistroPedido);
    setSelectedDate(new Date(order.fechaEntrega));
    updateDeliveryDate(order.fechaEntrega); // zs
    setNotas(order.nota);
  }, [order]);

  useEffect(() => {
    getHistorialSinPrecio();
    getValidations();
    updateShowPrices(showPrices);
    updateIsCheckout(true);

    return () => {
      updateIsCheckout(false);
    };
  }, []);

  useEffect(() => {
    stateRef.current.selectedDate = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    stateRef.current.notas = notas;
  }, [notas]);

  if (showAlert && !(isDatePickerInvalid || lastProds.length <= 0)) {
    // handleCheckout();
    const _body = handleCheckout();
    return (
      <Checkout
        // setOpenCheckout={setOpenCheckout}
        order={order}
        savePedido={_body}
        handleCloseEdit={handleCloseEdit}
        showPrices={showPrices}
        updateList={updateList}
        maxPaymentDate={fechaLimiteCredito}
      />
    );
  }

  return (
    <FusePageSimple
      content={
        <div className="w-full p-12 flex flex-col gap-y-10">
          <div className="flex gap-x-10 justify-end">
            <button type="button" onClick={() => handleReturn()}>
              <ArrowCircleLeftSharpIcon /> Regresar
            </button>
          </div>
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
                onChange={handleDateChange}
              />
            </LocalizationProvider>

            <div className="flex gap-x-10">
              <FormControlLabel
                control={
                  <Switch
                    checked={showAllItems}
                    onChange={handleShowAllItemsChange}
                  />
                }
                label="Ver lista completa"
              />
              <FormControlLabel
                control={
                  <Switch checked={showImage} onChange={handleShowImage} />
                }
                label="Ver Imagen"
              />
            </div>
          </div>
          <ProductsTable
            data={products}
            allItems={allItems}
            showAllItems={showAllItems}
            onUpdateProducts={updateProductQuantity}
            notas={notas}
            date={selectedDate}
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
          <CustomAlertNoBtns
            open={showAlert && (isDatePickerInvalid || lastProds.length <= 0)}
            onClose={() => updateShowAlert(false)}
            title="¡Alerta!"
            message={
              isDatePickerInvalid
                ? "Fecha de entrega inválida"
                : `Su pedido esta vacio...!`
            }
          />
        </div>
      }
    />
  );
};

const ProductsTable = ({
  data,
  allItems,
  showAllItems,
  onUpdateProducts,
  showPrices,
  showImage,
}) => {
  const [editableData, setEditableData] = useState([]);

  useEffect(() => {
    if (showAllItems) {
      const mergedData = mergeDataWithAllItems();
      setEditableData(mergedData);
    } else {
      setEditableData(data);
    }
  }, [data, allItems, showAllItems]);

  const mergeDataWithAllItems = () => {
    // Hacer una copia transformada de allItems para que tenga la misma estructura que data

    const transformedAllItems = allItems.map((item) => {
      return {
        idProducto: item.idProducto,
        descripcionProducto: item.descripcionProducto,
        cantidad: null,
        precio: item.valorProducto, // Asegúrate de que el atributo precio sea igual a valorProducto
        resultado: null,
        imagen: item.imagen,
        cantidad1: item.cantidad1,
        cantidad2: item.cantidad2,
        cantidad3: item.cantidad3,
      };
    });

    // Fusionar los datos registrados con los productos disponibles (transformados)
    const mergedData = data.map((item) => {
      const matchingItem = transformedAllItems.find(
        (i) => i.idProducto === item.idProducto
      );
      return matchingItem
        ? {
            ...matchingItem,
            cantidad: item.cantidad,
            resultado: item.resultado,
            imagen: item.imagen,
            cantidad1: item.cantidad1,
            cantidad2: item.cantidad2,
            cantidad3: item.cantidad3,
          }
        : item;
    });

    // Agregar los productos disponibles que no están en los datos registrados
    transformedAllItems.forEach((item) => {
      if (!mergedData.some((d) => d.idProducto === item.idProducto)) {
        mergedData.push({
          ...item,
          cantidad: null,
          resultado: null,
          imagen: item.imagen,
          cantidad1: item.cantidad1,
          cantidad2: item.cantidad2,
          cantidad3: item.cantidad3,
        });
      }
    });

    return mergedData;
  };

  const dispatch = useDispatch();

  const updateProductQuantityDebounced = useCallback(
    debounce((updatedProducts) => {
      dispatch(
        showMessage({
          message: "Guardando datos...!",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "info",
        })
      );
      onUpdateProducts(updatedProducts);
    }, 1000),
    []
  );

  const handleQuantityChange = (idProducto, cantidad) => {
    const updatedData = editableData.map((item) =>
      item.idProducto === idProducto ? { ...item, cantidad } : item
    );
    setEditableData(updatedData);
    const updatedProducts = updatedData.filter((item) => item.cantidad > 0);
    updateProductQuantityDebounced(updatedProducts);
  };

  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - editableData.length) : 0;
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
            {/* <StyledTableCell>Código </StyledTableCell> */}
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
            ? editableData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : editableData
          ).map((prod, i) => (
            <StyledTableRow key={prod.idProducto}>
              <StyledTableCell> {++i} </StyledTableCell>
              {/* <StyledTableCell>{prod.idProducto}</StyledTableCell> */}
              <StyledTableCell>{prod.descripcionProducto}</StyledTableCell>
              <StyledTableCell>
                <TextField
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 25,
                      minHeight: 25,
                      fontSize: "1.2rem",
                    },
                    width: 80,
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                  }}
                  variant="outlined"
                  type="number"
                  value={prod.cantidad || ""}
                  onChange={(e) =>
                    handleQuantityChange(prod.idProducto, e.target.value)
                  }
                />
              </StyledTableCell>
              {showPrices && (
                <StyledTableCell>{formatCurrency(prod.precio)}</StyledTableCell>
              )}
              {showPrices && (
                <StyledTableCell>
                  {formatCurrency(prod.resultado)}
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
              <TableCell colSpan={5} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <StyledTablePagination
              rowsPerPageOptions={[10, 15, 20, { label: "Todos", value: -1 }]}
              colSpan={5}
              count={editableData.length}
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
          <td className="p-2 w-[40px] h-[22px] text-right border-x-2 border-gray-500">
            {cant2}
          </td>
          <td className="p-2 w-[40px] h-[22px] text-right">{cant3}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default Edit;
