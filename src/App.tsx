import { HashRouter } from "react-router-dom";
import { AppRoutes } from "@/AppRoutes";
import { PwaNotice } from "@/components/PwaNotice";
import "@/styles/app.css";

const App = () => {
  return (
    <HashRouter>
      <AppRoutes />
      <PwaNotice />
    </HashRouter>
  );
};

export default App;
