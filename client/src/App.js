import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Book from "./pages/book";
import Fav_books from "./pages/fav_books";
import Bought_books from "./pages/bought_books";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";
import ChangePassword from "./pages/changePassword";

import Home from "./pages/home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/dashboard" exact element={<Dashboard />} />
          <Route path="/book" exact element={<Book />} />
          <Route path="/fav_books" exact element={<Fav_books />} />
          <Route path="/bought_books" exact element={<Bought_books />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/editprofile" exact element={<EditProfile />} />
          <Route path="/changePassword" exact element={<ChangePassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
