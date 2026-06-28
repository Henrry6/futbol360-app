import { InputNumber, InputNumberProps } from "antd";

export default function FormNumber(props: InputNumberProps) {
  return (
    <InputNumber {...props} className={`w-full! ${props.className ?? ""}`} />
  );
}
