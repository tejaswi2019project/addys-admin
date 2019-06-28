import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

const GetApprovedUser = gql`
  mutation getApprovedUser($username: String!, $password: String!) {
    getApprovedUser(username: $username, password: $password) {
      username
    }
  }
`;

class LoginBox extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.loginUser = this.loginUser.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  loginUser = async () => {
    console.log(this.state);
    console.log(this.props);

    const res = await this.props.GetApprovedUser({
      variables: {
        username: this.state.username,
        password: this.state.password
      }
    });

    if (res.data.getApprovedUser && res.data.getApprovedUser.username) {
      console.log(res.data.getApprovedUser.username);
      this.props.loginSuccess(res.data.getApprovedUser.username);
    }
  };

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div className="inner-container">
        <div className="header">Login</div>
        <div className="box">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              className="login-input"
              placeholder="Username"
              onChange={this.onUsernameChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"
              onChange={this.onPasswordChange}
            />
          </div>

          <button type="button" className="login-btn" onClick={this.loginUser}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default graphql(GetApprovedUser, { name: "GetApprovedUser" })(LoginBox);
