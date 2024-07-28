import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const initialValues = {
    username: "",
    password: "",
    gmail: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(3).max(10).required("Password is required"),
    gmail: Yup.string()
      .required("Email is required")
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Enter a valid Gmail address"),
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    axios
      .post("http://localhost:3007/users/register", data)
      .then((response) => {
        console.log(response);
        localStorage.setItem(
          "username",
          JSON.stringify(response.data.username)
        );
        localStorage.setItem("books_arr", JSON.stringify(null));
        localStorage.setItem("bought", JSON.stringify(null));
        localStorage.setItem("liked_books", JSON.stringify(null));
        localStorage.setItem("gmail", JSON.stringify(response.data.gmail));
        localStorage.setItem("details", JSON.stringify(null));
        localStorage.setItem("logged_status", "true");

        navigate("/dashboard");
      });
  };
  return (
    <div className="registerPage">
      <div id="register_rect">SIGN UP</div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form id="reg_rect">
          <Field
            placeholder="User name"
            name="username"
            className="a"
            required
          />
          <Field
            type="password"
            placeholder="Password"
            name="password"
            s
            className="a"
            required
          />
          <Field placeholder="Email ID" name="gmail" className="a" required />
          <ErrorMessage
            name="gmail"
            component="span"
            className="error-message"
          />
          <button type="submit" className="b">
            Signup
          </button>
        </Form>
      </Formik>
      <Link to="/login" className="reg_direct">
        Already have an account? Login
      </Link>
    </div>
  );
}

export default Register;
