import { useState } from 'react';
import styles from '../styles/LoginForm.module.css';
import logo from "../../../../assets/logoinps.jpg";

function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setShowError(true);
      return;
    }

    setShowError(false);
    onSubmit?.(formData);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (

    <div className={styles["login-page"]}>

    
    <div className={styles["login-visual"]}>

      <img src={logo} alt="Login" />

      <h2>
          Instituto Nacional de Promoción Social
      </h2>

    </div>


    


    <div className={styles["login-container"]}>
      <div className={styles["login-header"]}>
        <h2 className={styles["login-title"]}>
          BIENVENIDO
        </h2>

        <p className={styles["login-subtitle"]}>
          Accede a tu portal educativo
        </p>
      </div>

      {showError && (
        <div className={styles["login-error-message"]}>
          Usuario o contraseña incorrectos
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Campo usuario/email */}
        <div className={styles["login-form-group"]}>
          <label htmlFor="email">
            Usuario
          </label>

          <input
            id="email"
            type="email"
            placeholder="Tu usuario"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        {/* Campo contraseña */}
        <div className={styles["login-form-group"]}>
          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        {/* Opciones del formulario */}
        <div className={styles["login-form-options"]}>

          {/* Checkbox recordar sesión */}
          <div className={styles["login-checkbox-wrapper"]}>
            <input
              type="checkbox"
              id="remember"
              checked={formData.remember}
              onChange={handleInputChange}
            />

            <label htmlFor="remember">
              Recordarme
            </label>
          </div>

          {/* Link recuperar contraseña */}
          <a
            href="#"
            className={styles["login-forgot-password"]}
            onClick={handleForgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </a>

        </div>

        {/* Botón iniciar sesión */}
        <button type="submit">
          Iniciar Sesión
        </button>

      </form>
    </div>

    </div>
  );
}

export default LoginForm;