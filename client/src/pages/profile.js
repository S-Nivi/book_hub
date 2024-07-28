import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LZString from "lz-string";

let keys = [];
let name = "Add Name";
let bio = "Add Bio";
let mobile = "Add Mobile Number";

function Profile() {
  const navigate = useNavigate();
  const status = localStorage.getItem("logged_status");
  console.log(status);
  if (status == "false") {
    console.log("in");
    alert("User session expired. Please login again.");

    window.location = "login";
  }
  const liked_books = JSON.parse(localStorage.getItem("liked_books"));
  const gmail = JSON.parse(localStorage.getItem("gmail"));
  const details = JSON.parse(localStorage.getItem("details"));
  console.log(details);

  const username = JSON.parse(localStorage.getItem("username"));
  let books_arr = JSON.parse(localStorage.getItem("books_arr"));
  if (books_arr != null) keys = Object.keys(books_arr);
  console.log(liked_books);

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

  let profPic = LZString.decompress(localStorage.getItem(username + "_pic"));
  return (
    <div className="dashboard">
      <h1 className="heading">Your Profile</h1>

      <div>
        {profPic == null || profPic == "null" || profPic == "" ? (
          <img className="ProfilePic" src={require("../files/profile.png")} />
        ) : (
          <img className="ProfilePic" src={profPic} />
        )}
      </div>
      <img
        className="ProfileEdit1"
        src={require("../files/edit.png")}
        onClick={handleEditProfile}
      />
      <div className="ProfileName">{name}</div>
      <div className="ProfileUsername">{username}</div>
      <img className="ProfileMailImage" src={require("../files/mail.png")} />
      <div className="ProfileMail">{gmail}</div>
      <img
        className="ProfileMobileImage"
        src={require("../files/mobile.png")}
      />
      <div className="ProfileMobile">{mobile}</div>
      <div className="ProfileBio">{bio}</div>

      <div className="navbar">
        <h1 className="nav_title">BOOKHUB</h1>
        <div>
          {profPic == null || profPic == "null" || profPic == "" ? (
            <img className="profile" src={require("../files/profile.png")} />
          ) : (
            <img className="profile" src={profPic} />
          )}
        </div>
      </div>
      <div className="sidebar">
        <div className="FavBooks" onClick={handleDash}>
          DASHBOARD
        </div>
      </div>
      <Link to="/changePassword" className="password">
        Change Password
      </Link>
      <Link to="/login" className="logout">
        LOGOUT
      </Link>
    </div>
  );
}

export default Profile;
