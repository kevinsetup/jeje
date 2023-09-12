import { styled } from "@mui/system";
import {
  TableCell,
  TableRow,
  tableCellClasses,
  TablePagination,
  tablePaginationClasses,
} from "@mui/material";

/* Estilos personalizados */
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: "12px",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingRight: "5px",
    paddingLeft: "5px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "12px",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingRight: "5px",
    paddingLeft: "5px",
  },
}));

export const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  [`&.${tablePaginationClasses.displayedRows}`]: {
    fontSize : "5px",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // "&:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover,
  // },
  "& td": {
    borderBottom: "1px solid #CCCCCC",
  },
}));