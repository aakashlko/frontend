import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Recorder from "./pages/Recorder";
import "react-toastify/dist/ReactToastify.css";
import WebcamVideo from "./pages/WebcamVideo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="register" element={<Signup />} />
        <Route exact path="login" element={<Login />} />
        <Route exact path="/" element={<Recorder />} />
        <Route exact path="recorder" element={<WebcamVideo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
