import { FaFacebook, FaInstagram, FaTelegram, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";

import logo from "@/assets/logoinps.jpg";
import ui from "../styles/Public.module.css";
import styles from "../styles/Footer.module.css";
import ContactList from "./ContactList";

const SOCIAL_ICONS = {
  whatsapp: { icon: FaWhatsapp, label: "WhatsApp" },
  facebook: { icon: FaFacebook, label: "Facebook" },
  instagram: { icon: FaInstagram, label: "Instagram" },
  youtube: { icon: FaYoutube, label: "YouTube" },
  tiktok: { icon: FaTiktok, label: "TikTok" },
  twitter: { icon: FaTwitter, label: "Twitter" },
  telegram: { icon: FaTelegram, label: "Telegram" },
};

// Pie de página. Por debajo de 900 px se oculta: en una columna alargaría mucho la
// página, y el contacto sigue en Admisiones.
const Footer = ({ information, socials }) => (
  <footer className={styles.footer}>
    <div className={`${ui.wrap} ${styles.grid}`}>
      <div>
        <div className={styles.brand}>
          <img className={styles.logo} src={logo} alt="" />
          <h2 className={styles.title}>Instituto Nacional de Promoción Social</h2>
        </div>
        <ContactList className={styles.contact} information={information} inverse />
      </div>

      <div>
        <h2 className={styles.title}>Síguenos</h2>
        <ul className={styles.socials}>
          {socials.map((social) => {
            const known = SOCIAL_ICONS[social.name.toLowerCase()];

            if (!known) return null;

            const Icon = known.icon;

            return (
              <li key={social.name}>
                <a className={styles.social} href={social.url} target="_blank" rel="noopener noreferrer">
                  <Icon className={styles.socialIcon} aria-hidden="true" />
                  <span>{known.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
