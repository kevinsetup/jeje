import AppBar from "@mui/material/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { memo } from "react";
import { useSelector } from "react-redux";
import { selectFooterTheme } from "app/store/fuse/settingsSlice";
import clsx from "clsx";
import PoweredByLinks from "../../shared-components/PoweredByLinks";
import DocumentationButton from "../../shared-components/DocumentationButton";
import PurchaseButton from "../../shared-components/PurchaseButton";
import { Button } from "@mui/material";
import { useCheckoutStore } from "src/app/main/store/CheckoutDetail";
import { formatCurrency } from "src/app/main/utils/formatCurrency";
import { formatDate } from "src/app/main/utils/formatDate";

function FooterLayout1(props) {
  const footerTheme = useSelector(selectFooterTheme);

  const quantity = useCheckoutStore((state) => state.quantity);
  const total = useCheckoutStore((state) => state.total);
  const deliveryDate = useCheckoutStore((state) => state.deliveryDate);
  const isCheckout = useCheckoutStore((state) => state.isCheckout);
  const [paymentCheckout, updatePaymentCheckout] = useCheckoutStore((state) => [
    state.paymentCheckout,
    state.updatePaymentCheckout,
  ]);

  const [showAlert, updateShowAlert] = useCheckoutStore((state) => [
    state.showAlert,
    state.updateShowAlert,
  ]);

  const showPrices = useCheckoutStore((state) => state.showPrices);
  const [showDraft, updateShowDraft] = useCheckoutStore((state) => [
    state.showDraft,
    state.updateShowDraft,
  ]);

  const [showAlertDraft, updateShowAlertDraft] = useCheckoutStore((state) => [
    state.showAlertDraft,
    state.updateShowAlertDraft,
  ]);

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar
        id="fuse-footer"
        className={clsx("relative z-20 shadow-md", props.className)}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? footerTheme.palette.background.paper
              : footerTheme.palette.background.default,
        }}
      >
        {isCheckout && (
          <Toolbar className="p-24 min-h-112 flex items-center overflow-x-auto">
            <div className="flex flex-col md:flex-row w-full gap-24">
              <div
                className={`flex flex-col gap-y-6 ${
                  paymentCheckout ? "w-full" : "w-full md:w-2/3"
                }`}
              >
                <div className="flex justify-between font-semibold text-white">
                  <p>Fecha de entrega </p>
                  <p> {formatDate(deliveryDate)} </p>
                </div>
                <div className="flex justify-between font-semibold text-white">
                  <p>Cantidad de productos </p>
                  <p> {quantity} </p>
                </div>
                {showPrices && (
                  <div className="flex justify-between font-semibold text-white">
                    <p>Total</p>
                    <p> {formatCurrency(total)} </p>
                  </div>
                )}
              </div>
              {showDraft && (
                <div className="flex items-center justify-center w-full md:w-1/5">
                  <Button
                    sx={{
                      height: 50,
                    }}
                    size="large"
                    className="whitespace-nowrap w-full md:w-auto"
                    variant="contained"
                    color="secondary"
                    onClick={() => updateShowAlertDraft(true)}
                  >
                    Guardar Borrador
                  </Button>
                </div>
              )}
              {!paymentCheckout && (
                <div className="flex items-center justify-center w-full  md:w-1/5">
                  <Button
                    sx={{
                      height: 50,
                    }}
                    size="large"
                    className="whitespace-nowrap w-full"
                    variant="contained"
                    color="secondary"
                    onClick={() => updateShowAlert(true)}
                  >
                    Continuar y confirmar
                  </Button>
                </div>
              )}
            </div>
          </Toolbar>
        )}
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(FooterLayout1);
