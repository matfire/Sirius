import { Provider } from "urql";
import { Outlet } from "react-router-dom";
import Helmet from "react-helmet"
import client from "./utils/graphql";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useContext } from "react";
import { themeContext } from "./contexts/theme.context";
function App() {
  const { theme } = useContext(themeContext);

  return (
    <Provider value={client}>
      <Helmet>
        <html className={theme === "dark" ? "dark" : ""} />
      </Helmet>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </Provider>
  );
}

export default App;
