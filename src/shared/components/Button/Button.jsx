import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  align = "center",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        styles.button,
        styles[variant] ?? styles.primary,
        align === "left" ? styles["align-left"] : "",
        fullWidth ? styles["full-width"] : "",
        loading ? styles.loading : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      <span className={styles["button-content"]}>{children}</span>
    </button>
  );
};

export default Button;
