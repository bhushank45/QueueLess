import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Home from "./pages/user/Home";
import Privacy from "./pages/user/Privacy";
import Terms from "./pages/user/Terms";
import Support from "./pages/user/Support";
import Services from "./pages/user/Services";
import Queue from "./pages/user/Queue";
import Dashboard from "./pages/admin/Dashboard";
import AdminQueues from "./pages/admin/AdminQueues";
import AdminServices from "./pages/admin/AdminServices";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/admin/queues" element={<AdminQueues />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
