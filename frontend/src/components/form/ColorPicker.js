import styles from "./ColorPicker.module.css"

function ColorPicker({ colors, value, onChange }) {
  return (
    <div className={styles.container}>
      {colors.map((color) => (
        <div
          key={color.value}
          className={`${styles.colorBox} ${value === color.value ? styles.selected : ""}`}
          style={{ backgroundColor: color.hex }}
          onClick={() => onChange(color.value)}
        ></div>
      ))}
    </div>
  )
}

export default ColorPicker
