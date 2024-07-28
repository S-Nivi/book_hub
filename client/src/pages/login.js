import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  localStorage.setItem("logged_status", "false");
  const initialValues = {
    username: "",
    password: "",
  };
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log(data);
    axios.post("http://localhost:3007/users/login", data).then((response) => {
      if ("error" in response.data) {
        alert("Invalid user credentials");
      } else {
        console.log(response.data);
        localStorage.setItem(
          "username",
          JSON.stringify(response.data.username)
        );
        localStorage.setItem("books_arr", JSON.stringify(response.data.books));
        localStorage.setItem(
          "liked_books",
          JSON.stringify(response.data.liked)
        );
        localStorage.setItem("bought", JSON.stringify(response.data.bought));
        localStorage.setItem("gmail", JSON.stringify(response.data.gmail));
        localStorage.setItem("details", JSON.stringify(response.data.details));
        localStorage.setItem("logged_status", "true");
        navigate("/dashboard");
      }
    });
  };

  return (
    <div className="registerPage">
      <div id="register_rect">LOGIN</div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form id="reg_rect">
          <Field
            placeholder="Username"
            name="username"
            className="a"
            required
          />
          <Field
            type="password"
            placeholder="Password"
            name="password"
            className="a"
            required
          />

          <button type="submit" className="b">
            Login
          </button>
        </Form>
      </Formik>
      <Link className="reg_direct" to="/register">
        Don't have an account? Register
      </Link>
    </div>
  );
}

export default Login;
