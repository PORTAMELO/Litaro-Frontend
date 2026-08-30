import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";
import logo from "../../../../assets/logoinps.jpg";
import { loginRequest } from "../../../../api/auth";
import { useAuth } from "../../../../shared/hooks/useAuth";
import Button from "../../../../shared/components/Button/Button";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await loginRequest(formData.email, formData.password);
      login(userData);
      //navigate('/dashboard', { replace: true });
      navigate("/Litaro", { replace: true });
    } catch {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-visual"]}>
        <img src={logo} alt="Logo INPS" />
        <h2>Instituto Nacional de Promoción Social</h2>
      </div>

      <div className={styles["login-container"]}>
        <div className={styles["login-header"]}>
          <h2 className={styles["login-title"]}>BIENVENIDO</h2>
          <p className={styles["login-subtitle"]}>Accede a tu portal educativo</p>
        </div>

        {error && <div className={styles["login-error-message"]}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles["login-form-group"]}>
            <label htmlFor="email">Usuario</label>
            <input
              id="email"
              type="email"
              placeholder="Tu correo"
              required
              autoComplete="username"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles["login-form-group"]}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles["login-form-options"]}>
            <a href="#" className={styles["login-forgot-password"]}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button type="submit" variant="secondary" fullWidth={true} loading={loading}>
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
