import Landing from "./components/Landing"
import Layout from "./components/Layout"
// import Login from "./components/Login"
import { Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import {UserContextProvider} from "./UserContext"

function App() {

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  )
}

export default App
