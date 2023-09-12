import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CardForm from "../CardForm/CardForm";
import YapeForm from "../YapeForm/YapeForm";
const TemporaryDrawer = ({ data, handleCloseEdit, updateList }) => {
  const [state, setState] = React.useState({
    isOpen: false,
    type: "",
  });

  const toggleDrawer = (type, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ isOpen: open, type: type });
  };

  const list = (type) => (
    <Box
      role="presentation"
      // onClick={toggleDrawer(state["type"], false)}
      // onKeyDown={toggleDrawer(state["type"], false)}
    >
      {type === "transferencia" && (
        <div className="flex flex-col gap-y-12 p-20">
          <section className="flex gap-x-12">
            <SyncAltIcon></SyncAltIcon>
            <p className="font-semibold text-lg">Cuentas Bancarias</p>
          </section>
        </div>
      )}
      {type === "credito" && <CardForm data={data} handleCloseEdit={handleCloseEdit} updateList={updateList}></CardForm>}
      {type === "yape" && <YapeForm data={data} handleCloseEdit={handleCloseEdit} updateList={updateList}></YapeForm>}
    </Box>
  );

  return (
    <div>
      <p className="p-10 text-lg">
        Usa una de las siguientes opciones para pagar:
      </p>

      <div className="flex flex-col gap-y-10">
        <div
          className="bg-white rounded-lg shadow-md p-20 flex gap-x-14 items-center"
          role="button"
          onClick={toggleDrawer("transferencia", true)}
        >
          <SyncAltIcon></SyncAltIcon>
          <p className="font-semibold text-lg">Transferencia o depósito</p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-20 flex gap-x-14 items-center"
          role="button"
          onClick={toggleDrawer("credito", true)}
        >
          <CreditCardIcon></CreditCardIcon>
          <p className="font-semibold text-lg">Tarjeta Crédito / Débito</p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-20 flex gap-x-14 items-center"
          role="button"
          onClick={toggleDrawer("yape", true)}
        >
          <div className="h-28 w-28">
            <img src="https://seeklogo.com/images/Y/yape-app-logo-1FD46D1120-seeklogo.com.png"></img>
          </div>
          <p className="font-semibold text-lg">Yape</p>
        </div>
      </div>

      <Drawer
        PaperProps={{
          sx: {
            width: {
              xs: "85%", // theme.breakpoints.up('xs')
              sm: "85%", // theme.breakpoints.up('sm')
              md: "40%", // theme.breakpoints.up('md')
              lg: "40%", // theme.breakpoints.up('lg')
              xl: "40%", // theme.breakpoints.up('xl')
            },
          },
        }}
        anchor={"right"}
        open={state["isOpen"]}
        onClose={toggleDrawer(state["type"], false)}
      >
        {list(state["type"])}
      </Drawer>
    </div>
  );
};
export default TemporaryDrawer;
