import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LZString from "lz-string";

let book_details = {};
let status = "";
let bought_status = "";
function Book() {
  const navigate = useNavigate();
  const Status = localStorage.getItem("logged_status");
  console.log(Status);
  if (Status == "false") {
    console.log("in");
    alert("User session expired. Please login again.");
    window.location.reload();
    navigate("/");
  }
  let liked_books = JSON.parse(localStorage.getItem("liked_books"));
  let bought_books = JSON.parse(localStorage.getItem("bought"));

  console.log(liked_books);
  let book_selected = JSON.parse(localStorage.getItem("book_selected"));
  if (liked_books != null) {
    if (liked_books.includes(book_selected)) {
      status = "REMOVE FROM FAVOURITES";
    } else {
      status = "ADD TO FAVOURITES";
    }
  } else status = "ADD TO FAVOURITES";

  if (bought_books != null) {
    if (bought_books.includes(book_selected)) {
      bought_status = "PURCHASED";
    } else {
      bought_status = "BUY FOR ₹";
    }
  } else {
    bought_status = "BUY FOR ₹";
  }
  const username = JSON.parse(localStorage.getItem("username"));

  let books_arr = JSON.parse(localStorage.getItem("books_arr"));
  book_details = books_arr[book_selected];

  console.log(book_selected, books_arr, book_details);

  const [bookFav, setbookFav] = useState(status);
  const [boughtBook, setboughtBook] = useState(bought_status);

  function handleDeletebook() {
    console.log("in");
    delete books_arr[book_selected];
    if (liked_books != null) {
      if (liked_books.includes(book_selected))
        liked_books.splice(liked_books.indexOf(book_selected));
      axios
        .post("http://localhost:3007/books/removefav", {
          username: username,
          book: book_selected,
        })
        .then((response) => {
          if ("error" in response.data) {
            alert("Invalid user credentials");
          } else {
            console.log(response.data);
          }
        });
    }
    if (bought_books != null) {
      if (bought_books.includes(book_selected))
        bought_books.splice(bought_books.indexOf(book_selected));
      axios
        .post("http://localhost:3007/books/removeBought", {
          username: username,
          book: book_selected,
        })
        .then((response) => {
          if ("error" in response.data) {
            alert("Invalid user credentials");
          } else {
            console.log(response.data);
          }
        });
    }

    axios
      .post("http://localhost:3007/books/delete", {
        username: username,
        books: books_arr,
      })
      .then((response) => {
        if ("error" in response.data) {
          alert("Invalid user credentials");
        } else {
          console.log(response.data);
        }
      });

    localStorage.setItem("books_arr", JSON.stringify(books_arr));
    localStorage.setItem("liked_books", JSON.stringify(liked_books));
    localStorage.setItem("bought", JSON.stringify(bought_books));

    alert(book_selected + " deleted.");
    navigate("/dashboard");
  }
  console.log(liked_books);
  function handleAddFav() {
    if (status == "ADD TO FAVOURITES" || status == "") {
      if (liked_books != null) liked_books.push(book_selected);
      else liked_books = [book_selected];
      axios
        .post("http://localhost:3007/books/addfav", {
          username: username,
          book: book_selected,
        })
        .then((response) => {
          if ("error" in response.data) {
            alert("Invalid user credentials");
          } else {
            console.log(response.data);
          }
        });
      status = "REMOVE FROM FAVOURITES";
    } else {
      liked_books.splice(liked_books.indexOf(book_selected), 1);
      axios
        .post("http://localhost:3007/books/removefav", {
          username: username,
          book: book_selected,
        })
        .then((response) => {
          if ("error" in response.data) {
            alert("Invalid user credentials");
          } else {
            console.log(response.data);
          }
        });
      status = "ADD TO FAVOURITES";
    }
    setbookFav(status);
    localStorage.setItem("liked_books", JSON.stringify(liked_books));
  }

  function handleDash() {
    navigate("/dashboard");
  }

  function handleBuy() {
    axios
      .post("http://localhost:3007/books/buy", {
        username: username,
        book: book_selected,
      })
      .then((response) => {
        if ("error" in response.data) {
          alert("Invalid user credentials");
        } else {
          console.log(response.data);
        }
      });

    alert("You have purchased " + book_selected + ".");

    if (bought_books != null) bought_books.push(book_selected);
    else bought_books = [book_selected];
    localStorage.setItem("bought", JSON.stringify(bought_books));
    setboughtBook("PURCHASED");
  }

  function handleViewProfile() {
    navigate("/profile");
  }
  let profPic = LZString.decompress(localStorage.getItem(username + "_pic"));

  const min = Math.ceil(200);
  const max = Math.floor(700);
  const price = Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <div>
      <div className="bookImageContainer">
        {LZString.decompress(localStorage.getItem(book_selected + "_pic")) ==
          null ||
        LZString.decompress(localStorage.getItem(book_selected + "_pic")) ==
          "null" ||
        LZString.decompress(localStorage.getItem(book_selected + "_pic")) ==
          "" ? (
          <img className="bookOpenImage" src={require("../files/book.png")} />
        ) : (
          <img
            className="bookOpenImage"
            src={LZString.decompress(
              localStorage.getItem(book_selected + "_pic")
            )}
          />
        )}
      </div>
      <div className="bookContainer">
        <h1 className="book_name">{book_details.title.toUpperCase()}</h1>
        <div className="auth_name">Written by {book_details.author}</div>
        <br></br>
        <div className="genre">
          Genre : {book_details.genre}
          <br></br>
          <br></br>About :<br></br>
        </div>
        <p className="desc">
          <br></br>
          {book_details.desc}
        </p>
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
        <button className="fav" onClick={handleAddFav}>
          {bookFav}
        </button>

        <button className="delete" onClick={handleDeletebook}>
          DELETE BOOK
        </button>
        {boughtBook == "PURCHASED" ? (
          <button className="buy" onClick={handleBuy}>
            {boughtBook}
          </button>
        ) : (
          <button className="buy" onClick={handleBuy}>
            {boughtBook + price}
          </button>
        )}
      </div>
    </div>
  );
}

export default Book;
