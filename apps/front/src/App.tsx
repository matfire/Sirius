import { Provider } from "urql"
import { Outlet } from "react-router-dom"
import client from "./utils/graphql"
import AuthProvider from "./contexts/auth.context"
import Header from "./components/Header"
import ThemeProvider from "./contexts/theme.context"
import Footer from "./components/Footer"

function App() {

  return (
    <Provider value={client}>
      <AuthProvider>
        <ThemeProvider>
          <header>
            <Header />
          </header>
          <main>
            <Outlet />
          </main>
          <footer><Footer /></footer>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
