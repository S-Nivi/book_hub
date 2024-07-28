import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LZString from "lz-string";

let open = false;
let keys = [];
let yes = false;
let file = "";
let username = "";
let current_title = "";

function Dashboard() {
  const navigate = useNavigate();
  const status = localStorage.getItem("logged_status");
  console.log(status);
  if (status == "false") {
    console.log("in");
    alert("User session expired. Please login again.");
    window.location.reload();
    navigate("/");
  }
  let books_arr = JSON.parse(localStorage.getItem("books_arr"));
  console.log(books_arr);
  if (books_arr != null) keys = Object.keys(books_arr);
  console.log(keys);
  console.log(books_arr);
  const username = JSON.parse(localStorage.getItem("username"));
  console.log(username);

  const [image, setimage] = useState(require("../files/book.png"));
  const inputRef = useRef();

  const [Title, setTitle] = useState("");

  const handleTitleChange = (e) => {
    console.log("before", e.target.value);
    setTitle(e.target.value);
    console.log(Title);
  };

  console.log("title value", Title);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let compressedData = LZString.compress(reader.result);
      localStorage.setItem(Title + "_pic", compressedData);
    });

    reader.readAsDataURL(e.target.files[0]);
  };

  const [initialValues, setinitialValues] = useState({
    author: "",
    genre: "",
    desc: "",
    file: "",
  });
  function handleCreate() {
    if (open) {
      document.querySelector(".new_book").style.display = "none";

      document.querySelector(".new_book").style.opacity = 0;

      open = false;
    } else {
      document.querySelector(".new_book").style.opacity = 1;
      document.querySelector(".new_book").style.display = "flex";

      open = true;
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

  const onSubmit = (data) => {
    keys.push(Title);
    data["title"] = Title;

    axios
      .post("http://localhost:3007/books/create", {
        username: username,
        book: data,
      })
      .then((response) => {
        if ("error" in response.data) {
          alert("Invalid user credentials");
        } else {
          console.log(response.data);
        }
      });
    document.querySelector(".new_book").style.opacity = 0;

    document.querySelector(".new_book").style.display = "none";
    if (books_arr != null) books_arr[Title] = data;
    else {
      books_arr = {};
      books_arr[Title] = data;
    }
    console.log(books_arr);
    localStorage.setItem("books_arr", JSON.stringify(books_arr));

    open = false;

    window.location.reload();
  };

  function handleClose() {
    document.querySelector(".new_book").style.opacity = 0;
    document.querySelector(".new_book").style.display = "none";
    open = false;
  }

  function handleViewFav() {
    navigate("/fav_books");
  }

  function handleViewBought() {
    navigate("/bought_books");
  }

  function handleViewProfile() {
    navigate("/profile");
  }

  let profPic = LZString.decompress(localStorage.getItem(username + "_pic"));

  return (
    <div className="dashboard">
      <h1 className="heading">Your Collection</h1>
      <div className="books_container">
        {keys != ""
          ? keys.map((item, index) => {
              return item != "" ? (
                <div className="book" title={item} onClick={handleOpenBook}>
                  {LZString.decompress(localStorage.getItem(item + "_pic")) ==
                    null ||
                  LZString.decompress(localStorage.getItem(item + "_pic")) ==
                    "null" ||
                  LZString.decompress(localStorage.getItem(item + "_pic")) ==
                    "" ? (
                    <img className="book_image" src={image} title={item} />
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
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form className="new_book">
          <h1>CREATE BOOK</h1>

          <input
            placeholder="Title"
            name="title"
            className="a1"
            onChange={handleTitleChange}
            required
          />
          <Field placeholder="Author" name="author" className="a1" required />
          <Field placeholder="Genre" name="genre" className="a1" required />
          <Field
            placeholder="Description..."
            name="desc"
            className="a1 descr"
            required
          />
          <div>
            <input
              type="file"
              name="file"
              ref={inputRef}
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="b1">
            CREATE
          </button>
          <div className="close" onClick={handleClose}>
            x
          </div>
        </Form>
      </Formik>
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
        <div className="FavBooks" onClick={handleViewFav}>
          FAVOURITE BOOKS
        </div>
        <div className="FavBooks" onClick={handleViewBought}>
          PURCHASED BOOKS
        </div>
      </div>

      <img
        src={require("../files/create.png")}
        className="create"
        onClick={handleCreate}
      />
    </div>
  );
}

export default Dashboard;
