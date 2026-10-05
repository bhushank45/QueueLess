import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
