import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LZString from "lz-string";

let keys = [];
let name = "Add Name";
let bio = "Add Bio";
let mobile = "Add Mobile Number";
let verify = "VERIFY";

function ChangePassword() {
  const liked_books = JSON.parse(localStorage.getItem("liked_books"));
  const gmail = JSON.parse(localStorage.getItem("gmail"));
  const details = JSON.parse(localStorage.getItem("details"));
  console.log(details);

  const username = JSON.parse(localStorage.getItem("username"));
  let books_arr = JSON.parse(localStorage.getItem("books_arr"));
  if (books_arr != null) keys = Object.keys(books_arr);
  console.log(liked_books);

  const [oldPassword, setoldPassword] = useState();
  const [newPassword, setnewPassword] = useState();

  if (details != null) {
    if ("name" in details) {
      name = details.name;
    }
    if ("bio" in details) {
      bio = details.bio;
    }
    if ("mobile" in details) {
      mobile = details.mobile;
    }
  }

  const navigate = useNavigate();

  function handleOpenBook(data) {
    console.log(username);
    axios
      .get("http://localhost:3007/books", {
        params: { username: username },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data != "nothing") {
          books_arr = response.data;
          keys = Object.keys(books_arr);
          console.log(books_arr);
        } else {
          books_arr = {};
          keys = [];
        }
      });
    localStorage.setItem("book_selected", JSON.stringify(data.target.title));
    localStorage.setItem("books_arr", JSON.stringify(books_arr));

    console.log("sending", data.target.title, books_arr);
    navigate("/book");
  }

  function handleDash() {
    navigate("/dashboard");
  }

  function handleEditProfile() {
    navigate("/editProfile");
  }

  function handlePasswordChange(e) {
    setoldPassword(e.target.value);
  }
  function handlenewChange(e) {
    setnewPassword(e.target.value);
  }
  function handleVerify() {
    axios
      .post("http://localhost:3007/users/login", {
        username: username,
        password: oldPassword,
      })
      .then((response) => {
        if ("error" in response.data) {
          alert("Invalid user credentials");
        } else {
          document.querySelector(".verify").style.display = "none";
          document.querySelector(".verified").style.display = "block";
          document.querySelector(".p_text2").style.display = "block";
          document.querySelector(".input2").style.display = "block";

          document.querySelector(".p_submit").style.display = "block";
        }
      });
  }

  function handleSubmit() {
    console.log(newPassword);
    if (newPassword == undefined) {
      alert("Enter new password");
    } else {
      axios
        .post("http://localhost:3007/users/password", {
          username: username,
          password: newPassword,
        })
        .then((response) => {
          if ("error" == response.data) {
            alert("Invalid user credentials");
          } else {
            alert("Password updated successfully!");
            window.location.reload();
          }
        });
    }
  }
  function handleViewProfile() {
    navigate("/profile");
  }
  let profPic = LZString.decompress(localStorage.getItem(username + "_pic"));

  return (
    <div className="dashboard">
      <h1 className="heading">Change password</h1>
      <div className="p_container">
        <div className="p_username">Username : {username}</div>
        <div className="p_text">Old Password :</div>
        <input
          className="input1"
          type="password"
          onChange={handlePasswordChange}
        />
        <div className="verify" onClick={handleVerify}>
          {verify}
        </div>
        <div className="verified">VERIFIED</div>
        <div className="p_text2">New Password :</div>
        <input
          className="input2"
          type="password"
          required
          onChange={handlenewChange}
        />
        <div className="p_submit" onClick={handleSubmit}>
          SUBMIT
        </div>
      </div>
      <div className="navbar">
        <h1 className="nav_title">BOOKHUB</h1>
        <div>
          {profPic == null || profPic == "null" || profPic == "" ? (
            <img
              className="profile"
              onClick={handleViewProfile}
              src={require("../files/profile.png")}
            />
          ) : (
            <img
              className="profile"
              onClick={handleViewProfile}
              src={profPic}
            />
          )}
        </div>
      </div>
      <div className="sidebar">
        <div className="FavBooks" onClick={handleDash}>
          DASHBOARD
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
