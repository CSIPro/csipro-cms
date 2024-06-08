import { Field } from "payload/types";
import InputField from "./InputField";
import Cell from "./Cell";

export const validateHexColor = (value: string): true | string => {
  return (
    value.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/).length === 1 ||
    `${value} is not a valid hex color`
  );
};

const colorField: Field = {
  name: "color",
  type: "text",
  validate: validateHexColor,
  required: true,
  admin: {
    components: {
      Cell,
      Field: InputField,
    },
  },
};

export default colorField;
