import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Home } from "./pages/Home";
import { Movies } from "./pages/Movies";
import { Sports } from "./pages/Sports";
import { Events } from "./pages/Events";
import { Admin } from "./pages/Admin";
import { Organizer } from "./pages/Organizer";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Logout } from "./pages/Logout";
import { Wishlist } from "./pages/Wishlist";
import { EventDetails } from "./pages/EventDetails";
import { SeatSelection } from "./pages/SeatSelection";
import { Payment } from "./pages/Payment";
import { BookingConfirmation } from "./pages/BookingConfirmation";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/organizer" element={<Organizer />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/event/:id/seats" element={<SeatSelection />} />
        <Route path="/event/:id/payment" element={<Payment />} />
        <Route path="/event/:id/confirmation" element={<BookingConfirmation />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={2500} />
    </Router>
  );
};

export default App;
