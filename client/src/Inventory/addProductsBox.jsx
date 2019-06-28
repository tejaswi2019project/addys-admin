import React, { Component } from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";

const GetAllCategories = gql`
  query {
    getCategories {
      categoryId
      categoryPath
    }
  }
`;

const CreateProduct = gql`
  mutation createProduct(
    $title: String!
    $details: String!
    $categoryId: String!
    $categoryName: String!
    $categoryPath: String!
    $quantity: Int!
    $imageURLs: [String!]!
  ) {
    createProduct(
      title: $title
      details: $details
      categoryId: $categoryId
      categoryName: $categoryName
      categoryPath: $categoryPath
      quantity: $quantity
      imageURLs: $imageURLs
    ) {
      title
    }
  }
`;

class AddProductsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      details: "",
      categoryId: "",
      categoryName: "",
      categoryPath: "",
      imageURLs: [],
      quantity: 0,
      showErrorMessage: false,
      showAddProductSuccessMessage: false
    };
    this.onInputChange = this.onInputChange.bind(this);
  }

  validateErrorMessage() {
    if (
      this.state.title !== "" &&
      this.state.details !== "" &&
      this.state.categoryId !== "" &&
      this.state.categoryName !== "" &&
      this.state.categoryPath !== "" &&
      this.state.imageURLs.length > 0 &&
      this.state.quantity > 0
    ) {
      this.setState({ showErrorMessage: false });
    } else {
      this.setState({ showErrorMessage: true });
    }
  }

  clearFormFields() {
    document.getElementById("titleInput").value = "";
    document.getElementById("detailsInput").value = "";
    document.getElementById("imageURLsInput").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("categorySelect").selectedIndex = "0";
  }

  onInputChange(e) {
    if (e.target.name === "quantity") {
      this.setState(
        {
          showAddProductSuccessMessage: false,
          quantity: parseInt(e.target.value)
        },
        function() {
          this.validateErrorMessage();
        }
      );
    } else if (e.target.name === "imageURLs") {
      const tempStr = e.target.value;
      var tempArray = [];
      if (tempStr !== "") {
        tempArray = tempStr.split(",");
      }
      this.setState(
        { showAddProductSuccessMessage: false, imageURLs: tempArray },
        function() {
          this.validateErrorMessage();
        }
      );
    } else if (e.target.name === "categoryId") {
      const catId = e.target.value;
      var catPath = "";
      var catName = "";
      if (catId !== "") {
        catPath = e.target.options[e.target.selectedIndex].text;
        catName = catPath.split("> ").reverse()[0];
      }
      this.setState(
        {
          showAddProductSuccessMessage: false,
          categoryId: catId,
          categoryName: catName,
          categoryPath: catPath
        },
        function() {
          this.validateErrorMessage();
        }
      );
    } else {
      this.setState(
        {
          showAddProductSuccessMessage: false,
          [e.target.name]: e.target.value
        },
        function() {
          this.validateErrorMessage();
        }
      );
    }
  }

  handleAddProduct = async () => {
    const {
      title,
      details,
      categoryId,
      categoryName,
      categoryPath,
      imageURLs,
      quantity
    } = this.state;

    const res = await this.props.CreateProduct({
      variables: {
        title: title,
        details: details,
        categoryId: categoryId,
        categoryName: categoryName,
        categoryPath: categoryPath,
        quantity: quantity,
        imageURLs: imageURLs
      }
    });
    console.log(res);
    if (res.data.createProduct && res.data.createProduct.title) {
      this.setState({
        title: "",
        details: "",
        categoryId: "",
        categoryName: "",
        categoryPath: "",
        imageURLs: [],
        quantity: 0,
        showAddProductSuccessMessage: true
      });
      this.clearFormFields();
    }
  };

  render() {
    const {
      data: { loading, getCategories }
    } = this.props;

    if (loading) {
      return false;
    }

    return (
      <div className="inner-container">
        <div className="header">Add Products</div>
        <div className="box">
          {this.state.showAddProductSuccessMessage && (
            <div>
              <small className="success-message">
                The product has been created successfully. <br />
                You may proceed to add more products.
              </small>
              <br />
            </div>
          )}
          <div className="inventory-input-group">
            <label>Title</label>
            <input
              id="titleInput"
              type="text"
              name="title"
              className="inventory-input"
              placeholder="Title"
              onChange={this.onInputChange}
            />
          </div>
          <div className="inventory-input-group">
            <label>Details</label>
            <input
              id="detailsInput"
              type="text"
              name="details"
              className="inventory-input"
              placeholder="Details"
              onChange={this.onInputChange}
            />
          </div>
          <div className="inventory-input-group">
            <label>Category</label>
            <select
              id="categorySelect"
              type="text"
              name="categoryId"
              className="inventory-input"
              onChange={this.onInputChange}
            >
              <option value="">Select a category</option>
              {getCategories.map(category => (
                <option
                  value={category.categoryId}
                  key={`${category.categoryId}-cat-id`}
                >
                  {category.categoryPath}
                </option>
              ))}
            </select>
          </div>
          <div className="inventory-input-group">
            <label>Image URLs</label>
            <textarea
              id="imageURLsInput"
              type="text"
              name="imageURLs"
              className="inventory-input-urls"
              placeholder="Comma delimited: www.example.com,www.example2.com,www.example.com,www.example2.com"
              onChange={this.onInputChange}
            />
          </div>
          <div className="inventory-input-group">
            <label>Quantity</label>
            <input
              id="quantityInput"
              type="text"
              name="quantity"
              className="inventory-input"
              placeholder="Quantity"
              onChange={this.onInputChange}
            />
          </div>
          <small className="danger-error">
            {this.state.showErrorMessage
              ? "Please fill all the fields correctly"
              : ""}
          </small>
          <button
            type="button"
            className="login-btn"
            onClick={this.handleAddProduct}
          >
            Add Product
          </button>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(CreateProduct, { name: "CreateProduct" }),
  graphql(GetAllCategories)
)(AddProductsBox);
