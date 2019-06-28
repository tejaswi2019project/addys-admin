import React, { Component } from "react";
import LoginBox from "./loginBox";
import RegisterBox from "./registerBox";

class LoginRenderer extends Component {
  state = {
    isLoginOpen: true,
    isRegisterOpen: false
  };

  showLoginBox = () => {
    this.setState({ isLoginOpen: true, isRegisterOpen: false });
  };
  showRegisterBox = () => {
    this.setState({ isLoginOpen: false, isRegisterOpen: true });
  };

  render() {
    return (
      <React.Fragment>
        <div className="login-outer-div">
          <img className="login-logo" src="./logofull2.png" alt="logo" />
          <div className="box-controller">
            <div
              className={
                "controller " +
                (this.state.isLoginOpen ? "selected-controller" : "")
              }
              onClick={this.showLoginBox.bind(this)}
            >
              Login
            </div>
            <div
              className={
                "controller " +
                (this.state.isRegisterOpen ? "selected-controller" : "")
              }
              onClick={this.showRegisterBox.bind(this)}
            >
              Register
            </div>
          </div>
          <div className="box-container">
            {this.state.isLoginOpen && (
              <LoginBox
                loginSuccess={this.props.loginSuccess}
                showRegisterBox={this.showRegisterBox}
              />
            )}
            {this.state.isRegisterOpen && (
              <RegisterBox showLoginBox={this.showLoginBox} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginRenderer;
