import { Provider } from "urql";
import { Outlet } from "react-router-dom";
import client from "./utils/graphql";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useContext } from "react";
import { authContext } from "./contexts/auth.context";

function App() {
  //const { theme } = useContext(authContext);
  //TODO react helmet
  return (
    <Provider value={client}>
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
