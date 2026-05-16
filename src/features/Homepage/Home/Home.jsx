import colegio from "../../../assets/colegio.jpeg";
import SectionTitle from "../components/SectionTitle";
import Banner from "../components/Banner";
import EventCardBoard from "./components/EventCardBoard";
import LevelCardBoard from "./components/LevelCardBoard";
import LocationCardBoard from "./components/LocationCardBoard";
import IntroductionCard from "./components/IntroductionCard";

const text =
  "Individuals that have been set free by Trainers who could no longer raise them have become common " +
  "and they can now be found in Alola.Slugma does not have any blood in its body. Instead, intensely " +
  "hot magma circulates throughout this Pokémon’s body, carrying essential nutrients and oxygen to its " +
  "organs.Kingler has an enormous, oversized claw. It waves this huge claw in the air to communicate with " +
  "others. However, because the claw is so heavy, the Pokémon quickly tires.\n\n" +
  "Bayleef’s neck is ringed by curled-up leaves. Inside each tubular leaf is a small shoot of a tree. The " +
  "fragrance of this shoot makes people peppy.Krabby live on beaches, burrowed inside holes dug into the sand. " +
  "On sandy beaches with little in the way of food, these Pokémon can be seen squabbling with each other over " +
  "territory.Numel stores magma of almost 2,200 degrees Fahrenheit within its body. If it gets wet, the magma " +
  "cools and hardens. In that event, the Pokémon’s body grows heavy and its movements become sluggish.";

const levels = [
  {
    image: colegio,
    title: "Primaria",
    description: "Grados de primero a quinto",
  },
  {
    image: colegio,
    title: "Primaria",
    description: "Grados de primero a quinto",
  },
  {
    image: colegio,
    title: "Primaria",
    description: "Grados de primero a quinto",
  },
];

const events = [
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
  {
    image: colegio,
    label: "Cultural",
    date: "21 de Julio",
    grade: "Grados 10 y 11",
    title: "Dia de la independencia",
    description:
      "Dia nacional en conmemoración de la independencia de Colombia del reino de España",
  },
];

const locations = [
  {
    title: "Sede Uno",
    description:
      "Individuals that have been set free by Trainers who could no longer raise them have become common and they can now be found in Alola.Slugma does not have any blood in its body. Instead, intensely hot magma circulates throughout this Pokémon’s body, carrying essential nutrients and oxygen to its organs.Kingler has an enormous, oversized claw. It waves this huge claw in the air to communicate with others. However, because the claw is so heavy, the Pokémon quickly tires.",
    image: colegio,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0274178414957!2d-74.15683797526184!3d4.589102495385531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9ee20f205309%3A0xdabc9f42e6891511!2sLa%20Isla%20del%20Sol%2C%20Tunjuelito%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1777607374744!5m2!1ses!2sco",
  },
  {
    title: "Sede Dos",
    description:
      "Individuals that have been set free by Trainers who could no longer raise them have become common and they can now be found in Alola.Slugma does not have any blood in its body. Instead, intensely hot magma circulates throughout this Pokémon’s body, carrying essential nutrients and oxygen to its organs.Kingler has an enormous, oversized claw. It waves this huge claw in the air to communicate with others. However, because the claw is so heavy, the Pokémon quickly tires.",
    image: colegio,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.007417837312!2d-74.07113779611724!3d4.592690801834649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99aee5ebe031%3A0x58b7bc4ea2eed86b!2sIglesia%20de%20Nuestra%20Se%C3%B1ora%20de%20Egipto!5e0!3m2!1ses!2sco!4v1777607486294!5m2!1ses!2sco",
  },
  {
    title: "Sede Tres",
    description:
      "Individuals that have been set free by Trainers who could no longer raise them have become common and they can now be found in Alola.Slugma does not have any blood in its body. Instead, intensely hot magma circulates throughout this Pokémon’s body, carrying essential nutrients and oxygen to its organs.Kingler has an enormous, oversized claw. It waves this huge claw in the air to communicate with others. However, because the claw is so heavy, the Pokémon quickly tires.",
    image: colegio,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.1411212335665!2d-74.0159535946034!3d4.568648926788628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9793439fc21b%3A0x22110782cf6083b2!2sParador%20Villa%20Paula!5e0!3m2!1ses!2sco!4v1777607536717!5m2!1ses!2sco",
  },
];

const first_labels = [
  {
    title: "~ 1800",
    subtitle: "Estudiantes",
  },
  {
    title: "7",
    subtitle: "Sedes",
  },
  {
    title: "45",
    subtitle: "Años de historia",
  },
  {
    title: "> 32000",
    subtitle: "Egresados",
  },
];

const second_labels = [
  {
    title: "Respeto",
  },
  {
    title: "Responsabilidad",
  },
  {
    title: "Excelencia",
  },
  {
    title: "Disciplina",
  },
  {
    title: "Compromiso",
  },
];

const Home = () => {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
    >
      {/*Sección introducción*/}
      <div className="section-intro">
        <SectionTitle text="Instituto Nacional de Promoción Social" center={true}/>
        <IntroductionCard text={text} image={colegio} />
      </div>

      <Banner labels={first_labels} />

      {/*Sección ubicaciones*/}
      <div className="section-map">
        <LocationCardBoard locations={locations} />
      </div>

      {/*Seccion niveles academicos*/}
      <div className="section-academic-level">
        <SectionTitle text="Niveles académicos" center={true} />
        <LevelCardBoard levels={levels} />
      </div>

      <Banner labels={second_labels} />

      {/*Seccion eventos*/}
      <div className="section-events">
        <SectionTitle text="Eventos destacados" center={true} />
        <EventCardBoard events={events} />
      </div>
    </section>
  );
};

export default Home;
