import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import { Toaster } from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<IndexPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/account/:subpage?" element={<ProfilePage/>} />
          <Route path="/account/places" element={<PlacesPage/>} />
          <Route path="/account/places/new" element={<PlacesFormPage/>} />
          <Route path="/account/places/:id" element={<PlacesFormPage/>} />
          <Route path="/place/:id" element={<PlacePage/>}/>
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
