import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";

import App from "./App.jsx";
import { store } from "../store/store.js";
import Tbank from "../theme/Tbank.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={Tbank}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
