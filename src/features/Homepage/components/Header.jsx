import { Link } from "react-router-dom"; 
import styles from "../styles/Header.module.css";


const Header = () => {
    return (
        <header className={styles["header"]}>

            <div className={styles["brand"]}>
                    
                <img className={styles["logo-placeholder"]}/>       
                <h1>Instituto Nacional de Promoción Social</h1>
            </div>
            

            <nav className={styles["nav"]}>
                <Link to="/Homepage/Inicio" style={{padding: "10px"}}>Inicio</Link>
                <Link to="/Homepage/Nosotros" style={{padding: "10px"}}>Nosotros</Link>
                <Link to="/Homepage/Calendario" style={{padding: "10px"}}>Calendario</Link>
                <Link to="/Homepage/Admisiones" style={{padding: "10px"}}>Admisiones</Link>
            </nav>


            <nav className={styles["nav"]}>
                <Link className={styles["login-button"]} to="/Login" style={{padding: "10px"}}>Iniciar Sesión</Link>
            </nav>
        </header>
    )
}

export default Header;