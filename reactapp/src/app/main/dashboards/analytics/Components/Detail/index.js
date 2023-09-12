import FusePageSimple from "@fuse/core/FusePageSimple";
import _ from "@lodash";
import { useEffect, useState } from "react";
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
import { DatePicker } from "@mui/x-date-pickers";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import { useCheckoutStore } from "src/app/main/store/CheckoutDetail";

const Detail = ({
  setOpenDetail,
  order,
  showPrices,
  viewOnlyDetail,
  cancelOrder,
}) => {
  const apiUrl = environment.apiUrl;
  const [products, setProducts] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [updateIsCheckout] = useCheckoutStore((state) => [
    state.updateIsCheckout,
  ]);
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

  const [paymentCheckout, updatePaymentCheckout] = useCheckoutStore((state) => [
    state.paymentCheckout,
    state.updatePaymentCheckout,
  ]);

  const [showAlert, updateShowAlert] = useCheckoutStore((state) => [
    state.showAlert,
    state.updateShowAlert,
  ]);

  const [showDraft, updateShowDraft] = useCheckoutStore((state) => [
    state.showDraft,
    state.updateShowDraft,
  ]);

  const updateShowPrices = useCheckoutStore((state) => state.updateShowPrices);

  const getDetail = async (id) => {
    try {
      const url = apiUrl + "Pedido/GetDetallePedido";
      const { data } = await axios.get(url, {
        params: { IdRegistroPedido: id, hasPermission: showPrices },
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

      setProducts(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowImage = (event) => {
    setShowImage(event.target.checked);
  };

  useEffect(() => {
    getDetail(order.idRegistroPedido);
    updateDeliveryDate(order.fechaEntrega);
  }, [order]);

  useEffect(() => {
    updateIsCheckout(true);
    updatePaymentCheckout(true);
    updateShowDraft(false);
    updateShowPrices(showPrices);

    return () => {
      updateIsCheckout(false);
      if (viewOnlyDetail) {
        updatePaymentCheckout(false);
      }
    };
  }, []);

  return (
    <FusePageSimple
      content={
        <div className="w-full p-12 flex flex-col gap-y-10">
          <div className="flex gap-x-10 justify-between">
            <DatePicker
              format="dd/MM/yyyy"
              disabled
              slotProps={{ textField: { size: "small" } }}
              label="Entrega del pedido"
              value={new Date(order.fechaEntrega)}
            />
            <div className="flex gap-x-10">
              <FormControlLabel
                control={
                  <Switch checked={showImage} onChange={handleShowImage} />
                }
                label="Ver Imagen"
              />
              <button type="button" onClick={() => setOpenDetail(false)}>
                <ArrowCircleLeftSharpIcon /> Regresar
              </button>
            </div>
          </div>

          <DetailTable
            showImage={showImage}
            data={products}
            showPrices={showPrices}
          />
          <div className="flex gap-x-10 justify-between items-end">
            <TextField
              label="Notas"
              fullWidth
              size="small"
              variant="outlined"
              multiline
              InputProps={{
                readOnly: true,
              }}
              value={order.nota}
            />
          </div>
          {cancelOrder && (
            <>
              <div className="flex gap-x-10 justify-between items-end">
                <TextField
                  label="Justificacion"
                  fullWidth
                  size="small"
                  variant="outlined"
                  multiline
                  InputProps={{
                    readOnly: true,
                  }}
                  value={order.justificacion}
                />
              </div>
            </>
          )}
        </div>
      }
    />
  );
};

const DetailTable = ({ data, showPrices, showImage }) => {
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
            </StyledTableCell>{" "}
            {showImage && <StyledTableCell>Foto</StyledTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((prod, i) => (
            <StyledTableRow key={prod.idProducto}>
              <StyledTableCell> {++i} </StyledTableCell>
              {/* <StyledTableCell>{prod.idProducto}</StyledTableCell> */}
              <StyledTableCell>{prod.descripcionProducto}</StyledTableCell>
              <StyledTableCell> {prod.cantidad} </StyledTableCell>
              {showPrices && (
                <StyledTableCell>{formatCurrency(prod.precio)}</StyledTableCell>
              )}
              {showPrices && (
                <StyledTableCell>
                  {formatCurrency(prod.precio * prod.cantidad)}
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
              <TableCell colSpan={7} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <StyledTablePagination
              rowsPerPageOptions={[10, 15, 20, { label: "Todos", value: -1 }]}
              colSpan={7}
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

export default Detail;
