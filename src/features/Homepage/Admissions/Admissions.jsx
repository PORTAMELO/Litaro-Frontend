import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../components/SectionTitle";
import AdmissionGuide from "./components/AdmissionGuide";
import IntroductionCard from "./components/IntroductionCard";

const introduction =
  "When Dustox flaps its wings, a fine dust is scattered all over. This dust is actually a powerful poison that will even make a pro wrestler sick. This Pokémon searches for food using its antennae like radar.Slakoth’s heart beats just once a minute. Whatever happens, it is content to loaf around motionless. It is rare to see this Pokémon in motion.The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when Charmander is enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely.";

const steps = [
  "You can hear tales told all over the world about how Gengar will pay a visit to children who are naughty",
  "You can hear tales told all over the world about how Gengar will pay a visit to children who are naughty",
  "You can hear tales told all over the world about how Gengar will pay a visit to children who are naughty",
  "You can hear tales told all over the world about how Gengar will pay a visit to children who are naughty",
  "You can hear tales told all over the world about how Gengar will pay a visit to children who are naughty",
  "You can hear tales told all over the world about how Gengar will pay a visit to children who are naughty",
  "You can hear tales told all over the world about how Gengar will pay a visit to children who are naughty",
];
const Admissions = () => {
  return (
    <section>
      <div>
        <SectionTitle
          text="¿Cómo realizar el proceso de admisión?"
          center={true}
        />
        <IntroductionCard introduction={introduction} image={colegio} />
      </div>
      <div>
        <SectionTitle text="Ruta de admisión" center={true} />
        <AdmissionGuide steps={steps} />
      </div>
    </section>
  );
};

export default Admissions;
