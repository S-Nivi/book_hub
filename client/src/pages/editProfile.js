import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LZString from "lz-string";

let keys = [];
let name = "Add Name";
let bio = "Add Bio";
let mobile = "Add Mobile Number";

function EditProfile() {
  const [initialValues, setinitialValues] = useState({
    name_value: "",
    bio_value: "",
    mail_value: "",
    mobile_value: "",
  });
  const liked_books = JSON.parse(localStorage.getItem("liked_books"));
  const gmail = JSON.parse(localStorage.getItem("gmail"));
  let mail = gmail;
  const details = JSON.parse(localStorage.getItem("details"));
  let detail = {};
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

  function handleProfile() {
    navigate("/profile");
  }

  const onSubmit = (data) => {
    console.log(
      data.name_value,
      data.bio_value,
      data.mobile_value,
      data.mail_value
    );
    if (details == null) {
      if (data.name_value != "") {
        detail["name"] = data.name_value;
      }
      if (data.bio_value != "") {
        detail["bio"] = data.bio_value;
      }
      if (data.mobile_value != "") {
        detail["mobile"] = data.mobile_value;
      }
      if (data.mail_value != "") {
        mail = data.mail_value;
      }
    } else {
      if (data.name_value != "") {
        details["name"] = data.name_value;
      }
      if (data.bio_value != "") {
        details["bio"] = data.bio_value;
      }
      if (data.mobile_value != "") {
        details["mobile"] = data.mobile_value;
      }
      if (data.mail_value != "") {
        mail = data.mail_value;
      }

      detail = details;
    }

    axios
      .post("http://localhost:3007/profile", {
        username: username,
        details: detail,
        mail: mail,
      })
      .then((response) => {
        if ("error" in response.data) {
          alert("Invalid user credentials");
        } else {
          console.log(response.data);
        }
      });
    localStorage.setItem("gmail", JSON.stringify(mail));
    localStorage.setItem("details", JSON.stringify(detail));
    navigate("/profile");
  };

  let profPic = LZString.decompress(localStorage.getItem(username + "_pic"));

  const [profileImage, setProfileImage] = useState(profPic);
  console.log(profileImage);
  const imageRef = useRef(null);
  const handleImageClick = (e) => {
    imageRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setProfileImage(reader.result);
      let compressedData = LZString.compress(reader.result);
      localStorage.setItem(username + "_pic", compressedData);
    });

    reader.readAsDataURL(e.target.files[0]);
  };

  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += (localStorage[key].length * 2) / 1024 / 1024; // in MB
    }
  }
  console.log(`Total space used: ${total.toFixed(2)} MB`);

  return (
    <div className="dashboard">
      <h1 className="heading">Edit Profile</h1>

      <img className="ProfileMailImage" src={require("../files/mail.png")} />
      <img
        className="ProfileMobileImage"
        src={require("../files/mobile.png")}
      />

      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Field
            className="ProfileNameEdit"
            name="name_value"
            placeholder={name}
          />

          <Field
            className="ProfileMailEdit"
            placeholder={gmail}
            name="mail_value"
          />

          <Field
            className="ProfileMobileEdit"
            placeholder={mobile}
            name="mobile_value"
          />
          <Field
            className="ProfileBioEdit"
            placeholder={bio}
            name="bio_value"
          />
          <div onClick={handleImageClick}>
            {profileImage == null ||
            profileImage == "null" ||
            profileImage == "" ? (
              <img
                className="ProfilePic"
                src={require("../files/profile.png")}
              />
            ) : (
              <img className="ProfilePic" src={profileImage} />
            )}

            <input
              type="file"
              className="input"
              ref={imageRef}
              onChange={handleImageChange}
              hidden
            />
          </div>
          <div className="ProfileUsername">{username}</div>

          <button type="submit" className="profileSubmit">
            <img className="ProfileEdit" src={require("../files/done.png")} />
          </button>
        </Form>
      </Formik>

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
    </div>
  );
}

export default EditProfile;
