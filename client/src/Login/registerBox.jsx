import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

const CreateUser = gql`
  mutation createUser($username: String!, $password: String!, $email: String!) {
    createUser(
      username: $username
      password: $password
      email: $email
      approved: false
    ) {
      username
    }
  }
`;

class RegisterBox extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    errors: [],
    pwdState: null,
    hasRegistered: false
  };

  showValidationErr(elm, msg) {
    this.setState(prevState => ({
      errors: [
        ...prevState.errors,
        {
          elm,
          msg
        }
      ]
    }));
  }

  clearValidationErr(elm) {
    this.setState(prevState => {
      let newArr = [];
      for (let err of prevState.errors) {
        if (elm !== err.elm) {
          newArr.push(err);
        }
      }
      return { errors: newArr };
    });
  }

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
    this.clearValidationErr("username");
  }

  onEmailChange(e) {
    this.setState({ email: e.target.value });
    this.clearValidationErr("email");
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value });
    this.clearValidationErr("password");

    this.setState({ pwdState: "weak" });
    if (e.target.value.length > 8) {
      this.setState({ pwdState: "medium" });
    } else if (e.target.value.length > 12) {
      this.setState({ pwdState: "strong" });
    }
  }

  submitRegister = async () => {
    console.log(this.state);

    var errorsExist = false;

    if (this.state.username === "") {
      errorsExist = true;
      this.showValidationErr("username", "Username Cannot be empty!");
    }
    if (this.state.email === "") {
      errorsExist = true;
      this.showValidationErr("email", "Email Cannot be empty!");
    }
    if (this.state.password === "") {
      errorsExist = true;
      this.showValidationErr("password", "Password Cannot be empty!");
    }

    if (!errorsExist) {
      console.log("no errors");
      const res = await this.props.CreateUser({
        variables: {
          username: this.state.username,
          password: this.state.password,
          email: this.state.email
        }
      });
      if (res.data.createUser && res.data.createUser.username) {
        console.log(res.data.createUser.username);
        this.setState({ hasRegistered: true });
      }
    }
  };

  render() {
    let usernameErr = null,
      passwordErr = null,
      emailErr = null;

    for (let err of this.state.errors) {
      if (err.elm === "username") {
        usernameErr = err.msg;
      }
      if (err.elm === "password") {
        passwordErr = err.msg;
      }
      if (err.elm === "email") {
        emailErr = err.msg;
      }
    }

    let pwdWeak = false,
      pwdMedium = false,
      pwdStrong = false;

    if (this.state.pwdState === "weak") {
      pwdWeak = true;
    } else if (this.state.pwdState === "medium") {
      pwdWeak = true;
      pwdMedium = true;
    } else if (this.state.pwdState === "strong") {
      pwdWeak = true;
      pwdMedium = true;
      pwdStrong = true;
    }

    if (this.state.hasRegistered) {
      return (
        <div className="inner-container">
          <div className="header">Register</div>
          <div className="box">
            <label>Thank you for registering.</label>
            <label>
              You will receive an e-mail from the administrator once your
              account has been approved.
            </label>
          </div>
        </div>
      );
    } else {
      return (
        <div className="inner-container">
          <div className="header">Register</div>
          <div className="box">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                className="login-input"
                placeholder="Username"
                onChange={this.onUsernameChange.bind(this)}
              />
              <small className="danger-error">
                {usernameErr ? usernameErr : ""}
              </small>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Password"
                onChange={this.onPasswordChange.bind(this)}
              />
              <small className="danger-error">
                {passwordErr ? passwordErr : ""}
              </small>

              {this.state.password && (
                <div className="password-state">
                  <div className={"pwd pwd-weak " + (pwdWeak ? "show" : "")} />
                  <div
                    className={"pwd pwd-medium " + (pwdMedium ? "show" : "")}
                  />
                  <div
                    className={"pwd pwd-strong " + (pwdStrong ? "show" : "")}
                  />
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                className="login-input"
                placeholder="Email"
                onChange={this.onEmailChange.bind(this)}
              />
              <small className="danger-error">{emailErr ? emailErr : ""}</small>
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={this.submitRegister}
            >
              Register
            </button>
          </div>
        </div>
      );
    }
  }
}

export default graphql(CreateUser, { name: "CreateUser" })(RegisterBox);
