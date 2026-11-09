import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";
import logo from "../../../../assets/logoinps.jpg";
import { activateRequest, changePasswordRequest, loginRequest } from "../../../../api/Auth";
import { useAuth } from "../../../../shared/hooks/UseAuth";
import Button from "../../../../shared/components/Button/Button";

const PASSWORD_RULES = "mínimo 8 caracteres, con una mayúscula, una minúscula y un número";

const passwordProblem = (password, confirmation) => {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "La contraseña debe tener al menos una letra mayúscula.";
  if (!/[a-z]/.test(password)) return "La contraseña debe tener al menos una letra minúscula.";
  if (!/[0-9]/.test(password)) return "La contraseña debe tener al menos un número.";
  if (password !== confirmation) return "Las contraseñas no coinciden.";
  return null;
};

const EMPTY_FORM = { email: "", password: "", birthDate: "", newPassword: "", confirmPassword: "" };

const MODE_TEXT = {
  login: {
    title: "BIENVENIDO",
    subtitle: "Accede a tu portal educativo",
    button: "Iniciar Sesión",
  },
  activate: {
    title: "ACTIVA TU CUENTA",
    subtitle: `Es tu primer ingreso. Confirma tu fecha de nacimiento y crea tu contraseña (${PASSWORD_RULES}).`,
    button: "Activar e ingresar",
  },
  change: {
    title: "CAMBIA TU CONTRASEÑA",
    subtitle: `Tu contraseña es temporal. Crea una nueva para continuar (${PASSWORD_RULES}).`,
    button: "Guardar e ingresar",
  },
};

const linkStyle = { cursor: "pointer" };

function LoginForm() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setFormData((prev) => ({
      ...EMPTY_FORM,
      email: prev.email,
      password: next === "change" ? prev.password : "",
    }));
  };

  const signIn = async (user, password) => {
    const data = await loginRequest(user, password);

    if (data?.step === "ACTIVATION_REQUIRED") {
      switchMode("activate");
      return;
    }

    if (data?.step === "MUST_CHANGE_PASSWORD") {
      switchMode("change");
      return;
    }

    login(data);
    navigate("/Litaro", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode !== "login") {
      const problem = passwordProblem(formData.newPassword, formData.confirmPassword);
      if (problem) {
        setError(problem);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(formData.email, formData.password);
      } else if (mode === "activate") {
        await activateRequest(formData.email, formData.birthDate, formData.newPassword);
        await signIn(formData.email, formData.newPassword);
      } else {
        await changePasswordRequest(formData.email, formData.password, formData.newPassword);
        await signIn(formData.email, formData.newPassword);
      }
    } catch (err) {
      setError(
        mode === "login"
          ? "Usuario o contraseña incorrectos"
          : (err.message ?? "No fue posible completar la operación."),
      );
    } finally {
      setLoading(false);
    }
  };

  const text = MODE_TEXT[mode];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-visual"]}>
        <img src={logo} alt="Logo INPS" />
        <h2>Instituto Nacional de Promoción Social</h2>
      </div>

      <div className={styles["login-container"]}>
        <div className={styles["login-header"]}>
          <h2 className={styles["login-title"]}>{text.title}</h2>
          <p className={styles["login-subtitle"]}>{text.subtitle}</p>
        </div>

        {error && <div className={styles["login-error-message"]}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles["login-form-group"]}>
            <label htmlFor="email">{mode === "activate" ? "Número de documento" : "Usuario"}</label>
            <input
              id="email"
              type="text"
              placeholder={mode === "activate" ? "Tu número de documento" : "Correo o número de documento"}
              required
              readOnly={mode === "change"}
              autoComplete="username"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {mode === "login" && (
            <div className={styles["login-form-group"]}>
              <label htmlFor="password">Contraseña</label>
              {/* No es obligatoria: un estudiante sin contraseña entra solo con su documento y se le pide activar la cuenta */}
              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          )}

          {mode === "activate" && (
            <div className={styles["login-form-group"]}>
              <label htmlFor="birthDate">Fecha de nacimiento</label>
              <input
                id="birthDate"
                type="date"
                required
                max={today}
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </div>
          )}

          {mode !== "login" && (
            <>
              <div className={styles["login-form-group"]}>
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Nueva contraseña"
                  required
                  autoComplete="new-password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles["login-form-group"]}>
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div
            className={styles["login-form-options"]}
            style={mode === "login" ? { justifyContent: "space-between", gap: "1rem" } : undefined}
          >
            {mode === "login" ? (
              <>
                <a
                  href="#"
                  className={styles["login-forgot-password"]}
                  style={linkStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    switchMode("activate");
                  }}
                >
                  ¿Primer ingreso? Activa tu cuenta
                </a>
                <a href="#" className={styles["login-forgot-password"]}>
                  ¿Olvidaste tu contraseña?
                </a>
              </>
            ) : (
              <a
                href="#"
                className={styles["login-forgot-password"]}
                style={linkStyle}
                onClick={(e) => {
                  e.preventDefault();
                  switchMode("login");
                }}
              >
                Volver al inicio de sesión
              </a>
            )}
          </div>

          <Button type="submit" variant="secondary" fullWidth={true} loading={loading}>
            {text.button}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;