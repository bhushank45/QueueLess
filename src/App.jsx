import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Home from "./pages/user/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
