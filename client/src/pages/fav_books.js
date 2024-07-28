import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LZString from "lz-string";

let keys = [];

function Fav_books() {
  const navigate = useNavigate();
  const status = localStorage.getItem("logged_status");
  console.log(status);
  if (status == "false") {
    console.log("in");
    alert("User session expired. Please login again.");
    window.location.reload();
    navigate("/");
  }
  const liked_books = JSON.parse(localStorage.getItem("liked_books"));
  const username = JSON.parse(localStorage.getItem("username"));
  let books_arr = JSON.parse(localStorage.getItem("books_arr"));
  if (books_arr != null) keys = Object.keys(books_arr);
  console.log(liked_books);

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
  function handleViewProfile() {
    navigate("/profile");
  }
  let profPic = LZString.decompress(localStorage.getItem(username + "_pic"));

  return (
    <div className="dashboard">
      <h1 className="heading">Your favourite books</h1>
      <div className="books_container">
        {liked_books != "" && liked_books != null
          ? liked_books.map((item, index) => {
              return item != "" ? (
                <div className="book" title={item} onClick={handleOpenBook}>
                  {LZString.decompress(localStorage.getItem(item + "_pic")) ==
                    null ||
                  LZString.decompress(localStorage.getItem(item + "_pic")) ==
                    "null" ||
                  LZString.decompress(localStorage.getItem(item + "_pic")) ==
                    "" ? (
                    <img
                      className="book_image"
                      src={require("../files/book.png")}
                      title={item}
                    />
                  ) : (
                    <img
                      className="book_image"
                      src={LZString.decompress(
                        localStorage.getItem(item + "_pic")
                      )}
                      title={item}
                    />
                  )}
                  <h1 className="book_title" title={item}>
                    {item.toUpperCase()}
                  </h1>
                </div>
              ) : (
                void 0
              );
            })
          : void 0}
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

export default Fav_books;
