import React, { Component } from "react";
import LoginRenderer from "./Login/loginRenderer.jsx";
import InventoryRenderer from "./Inventory/inventoryRenderer.jsx";

class App extends Component {
  state = {
    isLoginPageVisible: true,
    isManageInventoryVisible: false,
    activeUsername: "test"
  };

  loginSuccess = username => {
    this.setState({
      isLoginPageVisible: false,
      isManageInventoryVisible: true,
      activeUsername: username
    });
  };

  signoutSuccess = () => {
    this.setState({
      isLoginPageVisible: true,
      isManageInventoryVisible: false,
      activeUsername: ""
    });
  };

  showLoginPage = () => {
    this.setState({
      isLoginPageVisible: true,
      isManageInventoryVisible: false
    });
  };

  showInventoryPage = () => {
    this.setState({
      isLoginPageVisible: true,
      isManageInventoryVisible: false
    });
  };

  render() {
    return (
      <div className="root-container">
        {this.state.isLoginPageVisible && (
          <LoginRenderer loginSuccess={this.loginSuccess} />
        )}
        {this.state.isManageInventoryVisible && (
          <InventoryRenderer
            signoutSuccess={this.signoutSuccess}
            username={this.state.activeUsername}
          />
        )}
      </div>
    );
  }
}

export default App;
