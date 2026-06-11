import styles from "../styles/Footer.module.css";
//prettier-ignore
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaTiktok, FaTwitter, FaTelegram } from "react-icons/fa";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail, MdSchedule } from "react-icons/md";

const socialsMap = {
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  twitter: FaTwitter,
  telegram: FaTelegram,
};

const Footer = ({ information, socials }) => {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["contact-section"]}>
        <p>
          <FaLocationDot className={styles["icon"]} />
          <span> {information.location}</span>
        </p>
        <p>
          <FaPhone className={styles["icon"]} />
          <span> {information.phone}</span>
        </p>
        <p>
          <MdEmail className={styles["icon"]} />
          <span> {information.email}</span>
        </p>
        <p>
          <MdSchedule className={styles["icon"]} />
          <span> {information.schedule}</span>
        </p>
      </div>
      <div className={styles["social-section"]}>
        {socials.map((social, index) => {
          const Icon = socialsMap[social.name.toLowerCase()];
          if (!Icon) return null;
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              className={styles["social"]}
            >
              <Icon className={styles["icon"]} />
              <span> {social.name}</span>
            </a>
          );
        })}
      </div>
      <h1 className={styles["title"]}>
        Instituto Nacional de Promoción Social
      </h1>
    </footer>
  );
};

export default Footer;
