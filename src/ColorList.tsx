import { threadColors } from "./ColorHelpers.ts";

type ColorListProps = {
  selectedColor: string;
  onColorSelect: (color: string) => void;
};

export const ColorList = ({ selectedColor, onColorSelect }: ColorListProps) => {
  return (
    <ul
      style={{
        listStyle: "none",
        display: "flex",
        flexWrap: "wrap",
        padding: 0,
        margin: 0,
      }}
    >
      {threadColors.threads.map((color) => (
        <li
          style={{
            background: color.hex,
            width: "16px",
            height: "16px",
            border: "1px solid transparent",
            borderColor: color.id === selectedColor ? "black" : "transparent",
          }}
          onClick={() => onColorSelect(color.id)}
          key={color.id}
        ></li>
      ))}
    </ul>
  );
};
