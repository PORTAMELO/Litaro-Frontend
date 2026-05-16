const SectionTitle = ({ text, center }) => {
    return <div style={{textAlign: center === true ? "center" : "start"}}>
        <h2 style={{fontSize: "2rem"}}>{text}</h2>
    </div>
}

export default SectionTitle;