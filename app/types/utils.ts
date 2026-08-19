export interface Movement {
  type: string;
  date: Date | string;
  user?: string;
  nota?: string;
}

export type DocumentStatus =
  | "enabled"
  | "disabled"
  | "issued"
  | "used"
  | "unused"
  | "canceled";

export type Attachment = {
  _id: string;
  name: string;
  mimetype: string;
  fromFileLibrary?: boolean;
};

export type Option = {
  id: string;
  description: string;
  value?: number;
  stringValue?: string;
  show?: boolean;
  cEstado?: string;
  cPais?: string;
  cCodigoPostal?: string;
  usosCfdis?: string;
};

export type Opciones = Record<string, Option[]>;

export interface ValidationError {
  errorFields?: { name: string; errors: string[] }[];
}
