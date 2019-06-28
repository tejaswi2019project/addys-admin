import React, { Component } from "react";
import ManageProductsBox from "./manageProductsBox";
import AddProductsBox from "./addProductsBox";

class InventoryRenderer extends Component {
  state = {
    isManageProductsOpen: true,
    isAddProductsOpen: false
  };

  showManageProductsBox = () => {
    this.setState({ isManageProductsOpen: true, isAddProductsOpen: false });
  };
  showAddProductsBox = () => {
    this.setState({ isManageProductsOpen: false, isAddProductsOpen: true });
  };

  render() {
    return (
      <div className="inventory-outer-div">
        <div className="inventory-nav">
          <div className="inventory-nav-left">
            <img className="login-logo" src="./logofull2.png" alt="logo" />
          </div>
          <div className="inventory-nav-right">
            <div>
              <label>
                Username: <b>{this.props.username}</b>
              </label>
              <br />
              <button
                className="btn btn-primary"
                onClick={this.props.signoutSuccess}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <div className="inventory-box-controller">
          <div
            className={
              "controller " +
              (this.state.isManageProductsOpen ? "selected-controller" : "")
            }
            onClick={this.showManageProductsBox.bind(this)}
          >
            Manage Products
          </div>
          <div
            className={
              "controller " +
              (this.state.isAddProductsOpen ? "selected-controller" : "")
            }
            onClick={this.showAddProductsBox.bind(this)}
          >
            Add Products
          </div>
        </div>
        <div className="inventory-box-container">
          {this.state.isManageProductsOpen && <ManageProductsBox />}
          {this.state.isAddProductsOpen && <AddProductsBox />}
        </div>
      </div>
    );
  }
}

export default InventoryRenderer;
