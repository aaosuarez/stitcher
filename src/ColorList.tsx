import dmcColors from "./dmc.json";

type ThreadColor = {
  id: string;
  name: string;
  hex: string;
};

export const ColorList = () => {
  const colors: ThreadColor[] = dmcColors;
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
      {colors.map((color) => (
        <li
          style={{ background: color.hex, width: "16px", height: "16px" }}
          key={color.id}
        ></li>
      ))}
    </ul>
  );
};
