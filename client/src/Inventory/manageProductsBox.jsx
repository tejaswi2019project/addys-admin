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

const UpdateProduct = gql`
  mutation updateProduct(
    $productId: String!
    $title: String!
    $details: String!
    $categoryId: String!
    $categoryName: String!
    $categoryPath: String!
    $quantity: Int!
    $imageURLs: [String!]!
    $price: Float!
  ) {
    updateProduct(
      productId: $productId
      title: $title
      details: $details
      categoryId: $categoryId
      categoryName: $categoryName
      categoryPath: $categoryPath
      quantity: $quantity
      imageURLs: $imageURLs
      price: $price
    )
  }
`;

const GetFilteredProducts = gql`
  mutation getFilteredProducts(
    $categoryId: String!
    $sortField: String!
    $sortDirection: Int!
  ) {
    getFilteredProducts(
      categoryId: $categoryId
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      productId
      title
      details
      categoryId
      categoryName
      categoryPath
      imageURLs
      quantity
      price
    }
  }
`;

class ManageProductsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsList: [],
      categoryIdFilter: "",
      sortFieldFilter: "",
      sortDirectionFilter: 1,
      elementToBeShown: "",
      allCategories: [],
      productId: "",
      title: "",
      details: "",
      categoryId: "",
      categoryName: "",
      categoryPath: "",
      imageURLs: [],
      price: 0,
      quantity: 0,
      showErrorMessage: false
    };
    this.onCategoryFilterChange = this.onCategoryFilterChange.bind(this);
    this.onSortFilterChange = this.onSortFilterChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  validateErrorMessage() {
    if (
      this.state.title !== "" &&
      this.state.details !== "" &&
      this.state.categoryId !== "" &&
      this.state.categoryName !== "" &&
      this.state.categoryPath !== "" &&
      this.state.price > 0 &&
      this.state.imageURLs.length > 0 &&
      this.state.quantity > -2
    ) {
      this.setState({ showErrorMessage: false });
    } else {
      this.setState({ showErrorMessage: true });
    }
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
    } else if (e.target.name === "price") {
      this.setState(
        {
          showAddProductSuccessMessage: false,
          price: parseFloat(e.target.value)
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

  getProducts = async () => {
    console.log(this.state);
    const res = await this.props.GetFilteredProducts({
      variables: {
        categoryId: this.state.categoryIdFilter,
        sortField: this.state.sortFieldFilter,
        sortDirection: this.state.sortDirectionFilter
      }
    });
    if (res.data.getFilteredProducts) {
      this.setState({ productsList: res.data.getFilteredProducts });
    }
  };

  handleSaveProduct = async () => {
    const {
      productId,
      title,
      details,
      categoryId,
      categoryName,
      categoryPath,
      imageURLs,
      quantity,
      price
    } = this.state;
    console.log(this.state);
    const res = await this.props.UpdateProduct({
      variables: {
        productId: productId,
        title: title,
        details: details,
        categoryId: categoryId,
        categoryName: categoryName,
        categoryPath: categoryPath,
        quantity: quantity,
        imageURLs: imageURLs,
        price: price
      }
    });
    console.log(res);
    if (res.data.updateProduct && res.data.updateProduct === true) {
      this.getProducts();
      document.getElementById(productId).style.display = "none";
    }
  };

  onCategoryFilterChange(e) {
    this.setState({
      categoryIdFilter: e.target.options[e.target.selectedIndex].value
    });
  }
  onSortFilterChange(e) {
    const sortVal = e.target.options[e.target.selectedIndex].value;
    switch (sortVal) {
      case "titleAscending":
        this.setState({ sortFieldFilter: "title", sortDirectionFilter: 1 });
        break;
      case "titleDescending":
        this.setState({ sortFieldFilter: "title", sortDirectionFilter: -1 });
        break;
      case "categoryAscending":
        this.setState({
          sortFieldFilter: "categoryPath",
          sortDirectionFilter: 1
        });
        break;
      case "categoryDescending":
        this.setState({
          sortFieldFilter: "categoryPath",
          sortDirectionFilter: -1
        });
        break;
      case "quantityAscending":
        this.setState({ sortFieldFilter: "quantity", sortDirectionFilter: 1 });
        break;
      case "quantityDescending":
        this.setState({ sortFieldFilter: "quantity", sortDirectionFilter: -1 });
        break;
      default:
        break;
    }
  }

  showElement = product => {
    if (
      document.getElementById(product.productId).style.display === "none" ||
      document.getElementById(product.productId).style.display === ""
    ) {
      var elList = document.getElementsByClassName("manage-product-details");
      if (elList.length > 0) {
        for (var x = 0; x < elList.length; x++) {
          elList[x].style.display = "none";
        }
      }

      document.getElementById(product.productId + "-titleInput").value =
        product.title;
      document.getElementById(product.productId + "-detailsInput").value =
        product.details;
      document.getElementById(product.productId + "-quantityInput").value =
        product.quantity;
      document.getElementById(
        product.productId + "-imageURLsInput"
      ).value = product.imageURLs.join(",");
      document.getElementById(product.productId + "-categorySelect").value =
        product.categoryId;

      this.setState(
        {
          productId: product.productId,
          title: product.title,
          details: product.details,
          imageURLs: product.imageURLs,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          categoryPath: product.categoryPath,
          quantity: product.quantity
        },
        function() {
          this.validateErrorMessage();
        }
      );

      document.getElementById(product.productId).style.display = "block";
    } else {
      document.getElementById(product.productId).style.display = "none";
    }
  };

  componentDidMount() {
    this.getProducts();
  }

  render() {
    const {
      data: { loading, getCategories }
    } = this.props;

    if (loading) {
      return false;
    }

    return (
      <div className="inner-container">
        <div className="header">Manage Products</div>
        <div className="manage-product-filters">
          <div className="manage-product-filter-item-outer">
            <label>
              <b>Category</b>
            </label>
            <select
              className="manage-product-filter-item"
              onChange={this.onCategoryFilterChange}
            >
              <option value="">All Categories</option>
              {getCategories.map(cat => (
                <option value={cat.categoryId} key={cat.categoryId}>
                  {cat.categoryPath}
                </option>
              ))}
            </select>
            <label>
              <b>Sort By</b>
            </label>
            <select
              className="manage-product-filter-item"
              onChange={this.onSortFilterChange}
            >
              <option value="">None</option>
              <option value="titleAscending">Title - Ascending</option>
              <option value="titleDescending">Title - Descending</option>
              <option value="categoryAscending">Category - Ascending</option>
              <option value="categoryDescending">Category - Descending</option>
              <option value="quantityAscending">Quantity - Ascending</option>
              <option value="quantityDescending">Quantity - Descending</option>
            </select>
            <button
              className="manage-product-filter-btn"
              onClick={this.getProducts}
            >
              Get Products
            </button>
          </div>
        </div>
        <div>
          <div className="manage-product-item-outer">
            <div className="manage-product-item-left">
              <div className="manage-product-item-title">
                <label>
                  <b>Title</b>
                </label>
              </div>
              <div className="manage-product-item-category">
                <label>
                  <b>Category</b>
                </label>
              </div>
              <div className="manage-product-item-price">
                <label>
                  <b>Price</b>
                </label>
              </div>
              <div className="manage-product-item-quantity">
                <label>
                  <b>Quantity</b>
                </label>
              </div>
            </div>
            <div className="manage-product-item-right" />
          </div>

          {this.state.productsList.map(product => (
            <div key={product.productId}>
              <div className="manage-product-item-outer">
                <div className="manage-product-item-left">
                  <div className="manage-product-item-title">
                    <label>{product.title}</label>
                  </div>
                  <div className="manage-product-item-category">
                    <label>{product.categoryPath}</label>
                  </div>
                  <div className="manage-product-item-price">
                    <label>${product.price}</label>
                  </div>
                  <div className="manage-product-item-quantity">
                    <label>{product.quantity}</label>
                  </div>
                </div>

                <div className="manage-product-item-right">
                  <button
                    className="manage-product-edit-btn"
                    onClick={() => this.showElement(product)}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="manage-product-details" id={product.productId}>
                <div className="box">
                  <div className="inventory-input-group">
                    <label>Title</label>
                    <input
                      id={product.productId + "-titleInput"}
                      type="text"
                      name="title"
                      className="inventory-input"
                      placeholder="Title"
                      onChange={this.onInputChange}
                    />
                  </div>
                  <div className="inventory-input-group">
                    <label>Details</label>
                    <textarea
                      id={product.productId + "-detailsInput"}
                      type="text"
                      name="details"
                      className="inventory-input-textarea"
                      placeholder="Details"
                      onChange={this.onInputChange}
                    />
                  </div>
                  <div className="inventory-input-group">
                    <label>Category</label>
                    <select
                      id={product.productId + "-categorySelect"}
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
                      id={product.productId + "-imageURLsInput"}
                      type="text"
                      name="imageURLs"
                      className="inventory-input-textarea"
                      placeholder="Comma delimited: www.example.com,www.example2.com,www.example.com,www.example2.com"
                      onChange={this.onInputChange}
                    />
                  </div>
                  <div className="inventory-input-group">
                    <label>Price</label>
                    <input
                      id={product.productId + "-priceInput"}
                      type="text"
                      name="price"
                      className="inventory-input"
                      placeholder="Price"
                      onChange={this.onInputChange}
                    />
                  </div>
                  <div className="inventory-input-group">
                    <label>Quantity</label>
                    <input
                      id={product.productId + "-quantityInput"}
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
                    className="manage-product-edit-btn"
                    onClick={this.handleSaveProduct}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(GetFilteredProducts, {
    name: "GetFilteredProducts"
  }),
  graphql(UpdateProduct, {
    name: "UpdateProduct"
  }),
  graphql(GetAllCategories)
)(ManageProductsBox);
