export const instituteOptions = ["MIST", "BUP", "AFMC"] as const;
export type Institute = (typeof instituteOptions)[number];

export const paymentMethodOptions = ["BKASH", "NAGAD"] as const;
export type PaymentMethod = (typeof paymentMethodOptions)[number];

export const PAYMENT_NUMBER = "01642347728";
export const SELECTED_INSTITUTE_KEY = "selectedInstitute";
