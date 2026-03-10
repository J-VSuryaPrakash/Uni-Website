import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home.jsx";
import DynamicPage from "./pages/DynamicPage.jsx";
import Contact from "./pages/Contact.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import NotFound from "./pages/NotFound.jsx";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Ticker from "./components/Ticker/Ticker.jsx";

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {location.pathname === '/' && <Header />}
      {location.pathname === '/' && <Ticker />}
      <Navbar />
      <Breadcrumbs />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/*" element={<DynamicPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
