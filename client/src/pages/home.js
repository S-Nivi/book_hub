import React from "react";
import { Link } from "react-router-dom";

function Home() {
  for (let key in localStorage) {
    if (!key.endsWith("_pic")) {
      localStorage.removeItem(key);
    }
  }
  let total = 1;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += (localStorage[key].length * 2) / 1024 / 1024; // in MB
    }
  }
  console.log(`Total space used: ${total.toFixed(2)} MB`);
  return (
    <div className="App">
      <Link to="/register" className="reg_link">
        Register
      </Link>
      <Link to="/login" className="log_link">
        Login
      </Link>
      <img className="icon" src={require("../files/book.png")} />
      <img className="icon2" src={require("../files/book.png")} />

      <h1 className="title">Book Hub</h1>
      <div className="line">--------------</div>
      <div className="text">Start your book journey here - Login now</div>
    </div>
  );
}

export default Home;
