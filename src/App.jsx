import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Vertices from "./pages/Vertices";

import "./App.css";

function LegacyRedirect() {
  React.useEffect(() => {
    window.location.href = "/v1/index.html";
  }, []);

  return <div>Loading...</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Vertices />} />
        <Route path="/v1" element={<LegacyRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
