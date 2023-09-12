import FusePageSimple from "@fuse/core/FusePageSimple";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
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
import UploadPic from "./components/UploadPic";
import { CustomAlertImage } from "src/app/main/customAlerts/customAlert";

const ManageProductsDashboardApp = () => {
  const [products, setProducts] = useState([]);
  const [viewForm, setViewForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPhoto, setShowPhoto] = useState(false);
  const [photo, setPhoto] = useState(null);

  const fetchProducts = async () => {
    try {
      const apiUrl = environment.apiUrl + "Producto/GetProductos";
      const { data } = await axios.get(apiUrl);
      setProducts(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadPhoto = (prod = null) => {
    setSelectedProduct(prod);
    setViewForm(true);
  };

  const handleCancelUpload = () => {
    setViewForm(false);
    fetchProducts();
  };

  const getImage = async (filePath) => {
    try {
      // setLoadOpen(true);
      const apiUrl = environment.apiUrl + "ArchiveManager/GetArchiveImage";
      const response = await axios.get(apiUrl, {
        params: { Ruta: filePath },
      });
      const res = response.data.data;
      // setLoadOpen(false);
      return res;
    } catch (error) {
      console.log(error);
      // setLoadOpen(false);
      return null;
    }
  };

  const handleViewPhoto = async (prod = null) => {
    if (prod.imagen) {
      const image = await getImage(prod.imagen);
      setShowPhoto(true);
      setPhoto("data:image/jpg;base64," + image);
    } else {
      setShowPhoto(true);
      setPhoto(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <FusePageSimple
      className="p-24"
      content={
        viewForm ? (
          <>
            <UploadPic
              onCancel={handleCancelUpload}
              product={selectedProduct}
            />
          </>
        ) : (
          <>
            <ProductsTable
              products={products}
              handleUploadPhoto={(prod) => handleUploadPhoto(prod)}
              handleViewPhoto={(prod) => handleViewPhoto(prod)}
            />
            <CustomAlertImage
              open={showPhoto}
              onClose={() => setShowPhoto(false)}
              photo={photo}
            />
          </>
        )
      }
    />
  );
};

const ProductsTable = ({ products, handleUploadPhoto, handleViewPhoto }) => {
  /* Paginación */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;
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
            <StyledTableCell>Código</StyledTableCell>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell>Foto</StyledTableCell>
            <StyledTableCell>Opc.</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? products.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : products
          ).map((product, i) => (
            <StyledTableRow key={product.idProducto}>
              <StyledTableCell> {++i} </StyledTableCell>
              <StyledTableCell>{product.idProducto}</StyledTableCell>
              <StyledTableCell>{product.descripcionProducto}</StyledTableCell>
              <StyledTableCell>
                <Button
                  onClick={() => handleViewPhoto(product)}
                  className="whitespace-nowrap "
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Ver Foto
                </Button>
              </StyledTableCell>
              <StyledTableCell>
                <Button
                  onClick={() => handleUploadPhoto(product)}
                  className="whitespace-nowrap "
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Subir Foto
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
              rowsPerPageOptions={[10, 15, 20, { label: "Todos", value: -1 }]}
              colSpan={5}
              count={products.length}
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

export default ManageProductsDashboardApp;
