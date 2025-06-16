import { Router } from 'preact-router'
import AuthProvider from './services/auth-context'
import Header from './components/header/header';
import Aside from './components/aside/aside';
import Footer from './components/footer/footer';
import Home from './components/home/home';
import Gesamtansicht from './components/home/pages/gesamtansicht/gesamtansicht';
import Benutzer from './components/home/pages/benutzer/benutzer';
import Lehrerverwaltung from './components/home/pages/lehrerverwaltung/lehrerverwaltung';
import Login from './components/home/pages/login/login';
import './app.css'

export function App() {
  return (
    <>
      <div className={ "app-grid" }>
        <AuthProvider>
          <Header />
          <Aside />
          <main style={{ gridArea: "main" }}>
            <Router>
              <Login path="/login" />
              <Home path="/" />
              <Gesamtansicht path="/gesamtansicht" />
              <Benutzer path="/benutzer" />
              <Lehrerverwaltung path="/lehrerverwaltung" />
            </Router>
          </main>
          <Footer />
        </AuthProvider>
      </div>
    </>
  );
}
