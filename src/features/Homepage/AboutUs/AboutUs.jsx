import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../components/SectionTitle";
import HistoryCard from "./components/HistoryCard";
import MissionVision from "./components/MissionVision";
import ProfessorCardBoard from "./components/ProfessorCardBoard";

const introtext =
  "Seadra generates whirlpools by spinning its body. The whirlpools are strong enough to " +
  "swallow even fishing boats. This Pokémon weakens prey with these currents, then swallows it whole.Overjoyed " +
  "at finally being able to fly, it flies all over the place and usually doesn’t land until it’s completely exhausted " +
  "and needs to sleep.Minun loves to cheer on its partner in battle. It gives off sparks from its body while it is doing " +
  "so. If its partner is in trouble, this Pokémon gives off increasing amounts of sparks.\n\nPostcards and posters " +
  "featuring Mantine leaping elegantly above the waves are popular souvenirs of Alola.It drifts through the sea searching " +
  "for prey. Its poisonous tentacles break off sometimes, but after a while, they grow back.Delicate equipment can " +
  "malfunction in areas inhabited by Magneton, which send out mysterious electrical signals.";

const mission =
  "Seadra generates whirlpools by spinning its body. The whirlpools are strong enough to " +
  "swallow even fishing boats. This Pokémon weakens prey with these currents, then swallows it whole.Overjoyed " +
  "at finally being able to fly, it flies all over the place and usually doesn’t land until it’s completely exhausted " +
  "and needs to sleep.Minun loves to cheer on its partner in battle. It gives off sparks from its body while it is doing " +
  "so. If its partner is in trouble, this Pokémon gives off increasing amounts of sparks.\n\nPostcards and posters " +
  "featuring Mantine leaping elegantly above the waves are popular souvenirs of Alola.It drifts through the sea searching";

const vision =
  "Seadra generates whirlpools by spinning its body. The whirlpools are strong enough to " +
  "swallow even fishing boats. This Pokémon weakens prey with these currents, then swallows it whole.Overjoyed " +
  "at finally being able to fly, it flies all over the place and usually doesn’t land until it’s completely exhausted " +
  "and needs to sleep.Minun loves to cheer on its partner in battle. It gives off sparks from its body while it is doing " +
  "so. If its partner is in trouble, this Pokémon gives off increasing amounts of sparks.\n\nPostcards and posters " +
  "featuring Mantine leaping elegantly above the waves are popular souvenirs of Alola.It drifts through the sea searching";

const professors = [
  {
    image: colegio,
    name: "Juan Rodriguez",
    role: "Profesor de Filosofía",
    description:
      "If it is attacked, Cascoon remains motionless however badly it may be hurt. It does so because if it were to move, its body would be weak upon evolution.",
  },
  {
    image: colegio,
    name: "Juan Rodriguez",
    role: "Profesor de Filosofía",
    description:
      "If it is attacked, Cascoon remains motionless however badly it may be hurt. It does so because if it were to move, its body would be weak upon evolution.",
  },
  {
    image: colegio,
    name: "Juan Rodriguez",
    role: "Profesor de Filosofía",
    description:
      "If it is attacked, Cascoon remains motionless however badly it may be hurt. It does so because if it were to move, its body would be weak upon evolution.",
  },
  {
    image: colegio,
    name: "Juan Rodriguez",
    role: "Profesor de Filosofía",
    description:
      "If it is attacked, Cascoon remains motionless however badly it may be hurt. It does so because if it were to move, its body would be weak upon evolution.",
  },
  {
    image: colegio,
    name: "Juan Rodriguez",
    role: "Profesor de Filosofía",
    description:
      "If it is attacked, Cascoon remains motionless however badly it may be hurt. It does so because if it were to move, its body would be weak upon evolution.",
  },
];

const AboutUs = () => {
  return (
    <section>
      <div className="section-intro">
        <SectionTitle text="Nosotros" center={true} />
        <HistoryCard imagen={colegio} text={introtext} />
      </div>
      <div className="section-mission-vision">
        <SectionTitle text="Misión y Visión" center={true} />
        <MissionVision mision={mission} vision={vision}></MissionVision>
      </div>
      <div className="section-professors">
        <SectionTitle text="Nuestro cuerpo académico" center={true} />
        <ProfessorCardBoard professors={professors} />
      </div>
    </section>
  );
};

export default AboutUs;
