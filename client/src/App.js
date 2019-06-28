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
      <React.Fragment>
        {this.state.isLoginPageVisible && (
          <div className="root-container">
            <LoginRenderer loginSuccess={this.loginSuccess} />
          </div>
        )}
        <div className="inventory-root-container">
          {this.state.isManageInventoryVisible && (
            <InventoryRenderer
              signoutSuccess={this.signoutSuccess}
              username={this.state.activeUsername}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
