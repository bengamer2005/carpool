const Footer = () => {
    return (
        <>
            <div style={{ marginTop: "50px" }}></div>
            <footer className="footer">
                <div className="footer-content">
                    <p className="footer-text" style={{ display: "flex", gap: "4px" }}>Sistema Carpool - Demo  |  Desarrollado por <span style={{ color: "#105abcff" }}>Benito Garcia</span></p>
                    
                    <div style={{ display: "flex", gap: "20px" }}>
                        <a style={{ color: "#105abcff", textDecoration: "none" }} href="https://github.com/bengamer2005" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a style={{ color: "#105abcff", textDecoration: "none" }} href="https://www.linkedin.com/in/leonel-garcia-bb2b97255/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>

                    <p className="footer-text">© 2025</p>
                </div>
            </footer>            
        </>
    )
}

export default Footer