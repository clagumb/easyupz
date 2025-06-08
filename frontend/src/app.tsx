import Router from 'preact-router'
import Header from './components/header/header';
import Aside from './components/aside/aside';
import Footer from './components/footer/footer';
import Home from './components/home/home';
import './app.css'

export function App() {
  return (
    <>
      <div class="app-grid">
        <Header />
        <Aside />
        <Router>
          <Home path="/start" />
        </Router>
        <Footer />
      </div>
    </>
  );
}
