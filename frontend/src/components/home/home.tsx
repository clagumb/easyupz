import "./home.css";

export default function Home(_: Props) {
  return (
    <main style={{ gridArea: "main" }}>
      Hauptinhalt
    </main>
  );
}

type Props = {
  path?: string; // optional, wird von preact-router übergeben
};
