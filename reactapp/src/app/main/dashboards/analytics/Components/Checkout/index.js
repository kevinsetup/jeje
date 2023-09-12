import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  StepButton,
  SvgIcon,
} from "@mui/material";
import { environment } from "src/environment/environment";
import CustomAlert from "src/app/main/customAlerts/customAlert";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import Detail from "../Detail";
import { useCheckoutStore } from "src/app/main/store/CheckoutDetail";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { formatDate } from "src/app/main/utils/formatDate";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
const steps = ["Pedido", "Entrega", "Pago"];
import { blue, grey } from "@mui/material/colors";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import TemporaryDrawer from "src/app/main/dashboards/analytics/Components/Drawer/Drawer";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

function Index({
  order,
  showPrices,
  savePedido,
  handleCloseEdit,
  updateList,
  maxPaymentDate,
}) {
  const [selectedOption, setSelectedOption] = useState("recojo");
  const apiUrl = environment.apiUrl;
  const [openAlert, setOpenAlert] = useState(false);
  const [openAlert2, setOpenAlert2] = useState(false);
  const dispatch = useDispatch();
  const [listAddress, setListAddress] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [updatePaymentCheckout] = useCheckoutStore((state) => [
    state.updatePaymentCheckout,
  ]);

  const [updateShowAlert] = useCheckoutStore((state) => [
    state.updateShowAlert,
  ]);

  const [isAvailable, setIsAvailable] = useState(false);

  const handleOptionClick = (option) => {
    console.log(option);
    setSelectedOption(option);
  };

  const getIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      console.log(response);
      return response.data.ip;
    } catch (error) {
      return "";
    }
  };

  const saveCheckout = async (tipoPago) => {
    // console.log(order);
    // const ip = await getIP();
    // savePedido.pedidoProducto.IP = ip; // Reemplaza 'nuevoValorDeIP' con el valor que deseas asignar

    // console.log(updatedSavePedido);
    const _body = {
      detalleCheckout: {
        idDireccionEnvio: String(selectedValue),
        tipoEntrega: selectedOption,
        tipoPago: tipoPago === 0 ? "Crédito" : "Contado",
        idPedidoProducto: order.idRegistroPedido,
      },
      savePedido,
    };

    try {
      const url = apiUrl + "Pedido/SaveCkeckoutUpdatePedido";
      await axios.post(url, _body);

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
      // setOpenCheckout(false);
      updatePaymentCheckout(false);
      updateList(true);
      handleCloseEdit();
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmAlert = (typePayment) => {
    saveCheckout(typePayment);
    // setActiveStep(2);
  };

  const handleConfirmAlert2 = (typePayment) => {
    // saveCheckout(typePayment);
    setActiveStep(2);
  };

  const getData = async () => {
    try {
      const url = apiUrl + "DireccionEnvio/GetDireccionEnvio";
      const { data } = await axios.get(url);
      console.log(data);
      setListAddress(data.data);
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
      return [];
    }
  };

  const checkAvailability = async () => {
    try {
      console.log(savePedido);
      const url = apiUrl + "Pedido/GetAvailability";
      const { data } = await axios.post(url, savePedido);
      console.log(data.data);
      setIsAvailable(data.data.isAvailable);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const quantity = useCheckoutStore((state) => state.quantity);
  const total = useCheckoutStore((state) => state.total);
  const deliveryDate = useCheckoutStore((state) => state.deliveryDate);
  const [updateIsCheckout] = useCheckoutStore((state) => [
    state.updateIsCheckout,
  ]);

  useEffect(() => {
    getData();
    updateIsCheckout(false);
    return () => {
      updatePaymentCheckout(false); // When New Order
      updateShowAlert(false); // when Edit
    };
  }, []);

  useEffect(() => {
    if (listAddress.length > 0) {
      setSelectedValue(listAddress[0].idDireccionEnvio);
    }
  }, [listAddress]);

  useEffect(() => {
    if (savePedido) {
      checkAvailability();
    }
  }, [savePedido]);

  /* Stepper Functions */
  const [activeStep, setActiveStep] = useState(1);

  const handleStep = (step) => () => {
    if (!(step === 2)) {
      setActiveStep(step);
    }
  };

  useEffect(() => {
    if (activeStep === 0) {
      updatePaymentCheckout(false);
      updateShowAlert(false);
      updateIsCheckout(true);
    }
  }, [activeStep]);

  if (openDetail) {
    return (
      <Detail
        order={order}
        setOpenDetail={setOpenDetail}
        showPrices={showPrices}
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-10">
      <div className="w-full">
        <Stepper nonLinear activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </div>

      {activeStep === 1 && (
        <div className="flex overflow-y-auto flex-col md:flex-row justify-center gap-32">
          <div className="flex flex-col w-full md:w-2/3">
            <div className="w-full rounded-lg">
              <div className=" p-20 bg-white w-full rounded-lg shadow-md">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Dirección de envío
                  </InputLabel>
                  <Select
                    variant="outlined"
                    label="Dirección de envío"
                    size="small"
                    className="flex items-center"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                      },
                    }}
                    // renderValue={(value) => {
                    //   console.log(value);
                    //   return (
                    //     <Box sx={{ display: "flex", gap: 1, alignItems:"center"}}>
                    //       <SvgIcon color="primary">
                    //         <LocationOnIcon/>
                    //       </SvgIcon>
                    //       {selectedValue}
                    //     </Box>
                    //   );
                    // }}
                  >
                    {listAddress.map((address) => (
                      <MenuItem
                        key={address.idDireccionEnvio}
                        value={address.idDireccionEnvio}
                      >
                        {address.direccion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="mt-8 bg-white p-20 w-full rounded-lg shadow-md">
                <p className="text-2xl font-bold">Elige un tipo de entrega</p>
                <div className="mt-5 p-4 w-full">
                  <div className="w-full">
                    <div
                      className={`w-full flex gap-x-16 items-center  border rounded-lg ${
                        selectedOption == "recojo"
                          ? "border-blue-900 p-9"
                          : "border-sky-500 p-9"
                      } `}
                      onClick={() => handleOptionClick("recojo")}
                      role="button"
                    >
                      <StoreMallDirectoryIcon
                        sx={{
                          color:
                            selectedOption == "recojo" ? blue[900] : grey[700],
                        }}
                        fontSize="large"
                      ></StoreMallDirectoryIcon>
                      <div className="flex flex-col gap-y-5">
                        <div
                          className={`font-bold text-xl ${
                            selectedOption == "recojo"
                              ? "text-blue-900 "
                              : "text-gray-700 "
                          } `}
                        >
                          Retiro en tienda
                        </div>
                        <p className="text-gray-700 text-base">
                          Disponible para retirar
                        </p>
                        <p className="text-gray-900 leading-none">En Figueri</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opción de envío a domicilio */}
                <div className="mt-5 p-4 w-full">
                  <div className="w-full">
                    <div
                      className={`w-full flex gap-x-16 items-center border rounded-lg ${
                        selectedOption == "agencia"
                          ? "border-blue-900 p-9 "
                          : "border-sky-500 p-9"
                      } `}
                      onClick={() => handleOptionClick("agencia")}
                      role="button"
                    >
                      <LocalShippingIcon
                        sx={{
                          color:
                            selectedOption == "agencia" ? blue[900] : grey[700],
                        }}
                        fontSize="large"
                      ></LocalShippingIcon>
                      <div className="flex flex-col gap-y-5">
                        <p
                          className={`font-bold text-xl ${
                            selectedOption == "agencia"
                              ? "text-blue-900 "
                              : "text-gray-700 "
                          } `}
                        >
                          Envío a agencia
                        </p>
                        <p className="text-gray-700 text-base">Disponible</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opción de envío a domicilio */}
                <div className="mt-5 p-4 w-full">
                  <div className="w-full">
                    <div
                      className={`w-full flex gap-x-16 items-center border rounded-lg ${
                        selectedOption == "delivery"
                          ? "border-blue-900 p-9"
                          : "border-sky-500 p-9"
                      } `}
                      onClick={() => handleOptionClick("delivery")}
                      role="button"
                    >
                      <LocalShippingIcon
                        sx={{
                          color:
                            selectedOption == "delivery"
                              ? blue[900]
                              : grey[700],
                        }}
                        fontSize="large"
                      ></LocalShippingIcon>
                      <div className="flex flex-col gap-y-5">
                        <p
                          className={`font-bold text-xl ${
                            selectedOption == "delivery"
                              ? "text-blue-900 "
                              : "text-gray-700 "
                          } `}
                        >
                          Envío a domicilio
                        </p>
                        <p className="text-gray-700 text-base">
                          Disponible para enviar a tu dirección
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="w-full bg-white rounded-lg shadow-md p-20 flex flex-col justify-between leading-normal">
              <div className="mb-4 flex flex-col gap-y-5">
                <h2 className="text-xl font-bold">Resumen del pedido</h2>
                <ul>
                  <button
                    type="submit"
                    className="underline"
                    onClick={() => setOpenDetail(true)}
                  >
                    Ver Detalle
                  </button>
                </ul>
                <div className="flex justify-between">
                  <b>Fecha de entrega: </b>
                  <p> {formatDate(deliveryDate)} </p>
                </div>
                <div className="flex justify-between">
                  <b>Fecha máxima de pago: </b>
                  <p> {formatDate(maxPaymentDate)} </p>
                </div>
                <div className="flex justify-between">
                  <b>Cantidad de productos: </b>
                  <p> {quantity} </p>
                </div>
                {showPrices && (
                  <div className="flex justify-between">
                    <b>Total: </b>
                    <p> {formatCurrency(total)} </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center space-y-12">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setOpenAlert(true)}
                  disabled={selectedValue === "" || !isAvailable}
                >
                  Confirmar al crédito
                </Button>
                {showPrices && (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => setActiveStep(2)}
                    disabled={selectedValue === ""}
                  >
                    Confirmar al contado
                  </Button>
                )}
                {!isAvailable && (
                  <>
                    <p className="text-red-800 font-semibold text-md">
                      * Crédito insuficiente.
                    </p>
                    <p className="font-semibold text-md">
                      *Solo disponible pago al contado
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <>
          <TemporaryDrawer
            data={{
              direccion: selectedValue,
              tipoEntrega: selectedOption,
              tipoPago: "Contado",
              idPedidoProducto: order.idRegistroPedido,
            }}
            handleCloseEdit={handleCloseEdit}
            updateList={updateList}
          ></TemporaryDrawer>
        </>
      )}

      <CustomAlert
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        title="¡Alerta!"
        message="¿Desea pagar al crédito?"
        onConfirm={() => handleConfirmAlert(0)}
      />
      <CustomAlert
        open={openAlert2}
        onClose={() => setOpenAlert2(false)}
        title="¡Alerta!"
        message="¿Desea pagar al contado?"
        onConfirm={() => handleConfirmAlert2(1)}
      />
    </div>
  );
}

export default Index;
