import React from "react";

// this is how we'll interface with Payload itself
import { useFieldType } from "payload/components/forms";

// we'll re-use the built in Label component directly from Payload
import { Label } from "payload/components/forms";

// we can use existing Payload types easily
import { Props } from "payload/components/fields/Text";

// we'll import and reuse our existing validator function on the frontend, too
import { validateHexColor } from "./config";

// Import the SCSS stylesheet
import "./styles.scss";

// keep a list of default colors to choose from
const defaultColors = [
  "#0F0F0F",
  "#9A9A9A",
  "#F3F3F3",
  "#FF6F76",
  "#FDFFA4",
  "#B2FFD6",
  "#F3DDF3",
];

const baseClass = "custom-color-picker";

const InputField: React.FC<Props> = (props) => {
  const { path, label, required } = props;

  const { value = "", setValue } = useFieldType({
    path,
    validate: validateHexColor,
  });

  return (
    <div className={baseClass}>
      <Label htmlFor={path} label={label} required={required} />
      <ul className={`${baseClass}__colors`}>
        {defaultColors.map((color, i) => (
          <li key={i}>
            <button
              type="button"
              key={color}
              className={`chip ${color === value ? "chip--selected" : ""} chip--clickable`}
              style={{ backgroundColor: color }}
              aria-label={color}
              onClick={() => setValue(color)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InputField;
