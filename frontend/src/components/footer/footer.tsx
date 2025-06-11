import "./footer.css";

export default function Footer() {
    return (
        <footer style={{ gridArea: "footer" }}>
            <p className={"footer-center"}>© 2025 – <a href="https://github.com/clagumb" target="_blank">GitHub: Claus Gumbmann</a></p>
        </footer>
    );
}