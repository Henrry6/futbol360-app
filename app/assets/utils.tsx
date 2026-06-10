import dayjs, { Dayjs } from "dayjs";
import { Rule } from "antd/lib/form";

const defaultLocale = "es-MX";
const defaultCurrency = "MXN";

const $filtros = {
  currency(value?: number | string, arg = 2): string {
    if (!value) {
      value = 0;
    }
    return new Intl.NumberFormat(defaultLocale, {
      style: "currency",
      currency: defaultCurrency,
      minimumFractionDigits: arg,
    }).format(typeof value === "number" ? value : parseFloat(value));
  },
  date(value: string | Dayjs | Date, format = "DD/MM/YYYY"): string {
    return dayjs(value).format(format);
  },
  completeDate(value: string): string {
    return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
  },
  month(value: string): string {
    return dayjs(value).format("MM/YYYY");
  },
  percent(value?: number | string, arg = 2): string {
    value ||= 0;
    return new Intl.NumberFormat(defaultLocale, {
      style: "percent",
      minimumFractionDigits: arg,
    }).format(typeof value === "number" ? value : parseFloat(value));
  },
};

export const $rules = {
  required: (message = "El campo es requerido"): Rule => ({
    required: true,
    message,
  }),
  max: (
    max: number,
    message = `Se permite máximo ${max.toString()} caracteres`,
  ): Rule => ({
    max,
    message,
  }),
  min: (
    min: number,
    message = `Se permite mínimo ${min.toString()} caracteres`,
  ): Rule => ({
    min,
    message,
  }),
  email: (message = "El correo electrónico no es válido"): Rule => ({
    type: "email",
    message,
  }),
};

export default $filtros;
