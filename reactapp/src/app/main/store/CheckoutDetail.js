import { create } from "zustand";

export const useCheckoutStore = create((set) => ({

  isCheckout: false,
  paymentCheckout: false,
  deliveryDate: "",
  quantity: 0,
  total: 0,
  showPrices:false,
  disableCheckout: false,
  showAlert:false,

  showAlertDraft: false,
  showDraft: false,

  updateIsCheckout: (value) => {
    console.log("FooterCheckout: ", value)
    set({ isCheckout: value });
  },
  updateQuantity: (date) => {
    set({ quantity: date });
  },
  updateTotal: (date) => {
    set({ total: date });
  },
  updateDeliveryDate: (date) => {
    set({ deliveryDate: date });
  },
  updatePaymentCheckout: (value) => {
    console.log("ViewCheckout: ", value)
    set({ paymentCheckout: value });
  },

  updateDisableCheckout: (value) => {
    set({ disableCheckout: value });
  },

  updateShowAlert: (value) => {
    set({ showAlert: value });
  },

  updateShowPrices: (value) => {
    set({ showPrices: value });
  },

  updateShowDraft : (value) => {
    set({ showDraft: value });
  },

  updateShowAlertDraft : (value) => {
    set({ showAlertDraft: value });
  }
}));
