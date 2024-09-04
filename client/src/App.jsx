import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Profile from "./pages/Profile"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"
import Search from "./pages/Search"
import FooterCom from "./components/Footer"
import Dashboard from "./pages/Dashboard"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/profile' element={<Profile />} />
          
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-listing" element={<CreateListing/>}/>
          <Route path="/update-listing/:listingId" element={<UpdateListing/>}/>
        </Route>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path="/listing/:listingId" element={<Listing/>}/>
        <Route path="/search" element={<Search/>}/>
      </Routes>
      <FooterCom/>
    </BrowserRouter>
  )
}
