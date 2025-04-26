import AppRoutes from "./routes/routes";
import "./common.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  localStorage.setItem("isVideoActive", "false")
  return (
    <div>
      <AppRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;
