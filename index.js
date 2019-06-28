const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const express = require("express");
const path = require("path");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/addys_admin"
);

const Product = mongoose.model("Product", {
  productId: String,
  title: String,
  details: String,
  categoryId: String,
  categoryName: String,
  categoryPath: String,
  imageURLs: [String],
  quantity: { type: Number, min: 0 }
});

const User = mongoose.model("User", {
  username: String,
  password: String,
  email: String,
  approved: Boolean
});

const Category = mongoose.model("Category", {
  categoryId: String,
  categoryName: String,
  categoryPath: String
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    getAllProducts: [Product]
    getUsers: [User]
    getUser(username: String, password: String): User
    getCategories: [Category]
  }
  type Product {
    productId: String
    title: String!
    details: String!
    categoryId: String!
    categoryName: String!
    categoryPath: String!
    imageURLs: [String!]!
    quantity: Int
    id: ID!
  }
  type User {
    username: String!
    password: String!
    email: String!
    approved: Boolean!
  }
  type Category {
    categoryId: String!
    categoryName: String!
    categoryPath: String!
  }
  type Mutation {
      createProduct(title: String!, details: String!, categoryId: String!, categoryName: String!, categoryPath: String!, quantity: Int!, imageURLs: [String!]!): Product
      updateProduct(productId: String!, title: String!, details: String!, categoryId: String!, categoryName: String!, categoryPath: String!, quantity: Int!, imageURLs: [String!]!): Boolean
      removeProduct(productId: String!): Boolean
      getFilteredProducts(categoryId: String!, sortField: String!, sortDirection: Int!): [Product]
      createUser(username: String!, password: String!, email: String!, approved: Boolean!): User
      approveUser(username: String!): Boolean
      disapproveUser(username: String!): Boolean
      deleteUser(username: String!): Boolean
      getApprovedUser(username: String!, password: String!): User
      createCategory(categoryId: String!, categoryName: String!, categoryPath: String!): Category
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    getAllProducts: () => Product.find(),
    getUsers: () => User.find(),
    getUser: (_, { username, password }) =>
      User.findOne({ username: username, password: password, approved: true }),
    getCategories: () => Category.find()
  },
  Mutation: {
    createProduct: async (
      _,
      {
        title,
        details,
        categoryId,
        categoryName,
        categoryPath,
        quantity,
        imageURLs
      }
    ) => {
      const newId = uuidv1();
      const product = new Product({
        productId: newId,
        title: title,
        details: details,
        categoryId: categoryId,
        categoryName: categoryName,
        categoryPath: categoryPath,
        quantity: quantity,
        imageURLs: imageURLs
      });
      await product.save();
      return product;
    },
    updateProduct: async (
      _,
      {
        productId,
        title,
        details,
        categoryId,
        categoryName,
        categoryPath,
        quantity,
        imageURLs
      }
    ) => {
      await Product.findOneAndUpdate(
        { productId: productId },
        {
          title: title,
          details: details,
          categoryId: categoryId,
          categoryName: categoryName,
          categoryPath: categoryPath,
          quantity: quantity,
          imageURLs: imageURLs
        }
      );
      return true;
    },
    removeProduct: async (_, { productId }) => {
      await Product.findOneAndRemove({ productId: productId });
      return true;
    },
    getFilteredProducts: async (
      _,
      { categoryId, sortField, sortDirection }
    ) => {
      var res;

      if (categoryId === "" && sortField === "") {
        res = await Product.find();
      } else if (categoryId === "") {
        res = await Product.find().sort({
          [sortField]: sortDirection
        });
      } else if (sortField === "") {
        res = await Product.find({ categoryId: categoryId });
      } else {
        res = await Product.find({ categoryId: categoryId }).sort({
          [sortField]: sortDirection
        });
      }

      return res;
    },
    createUser: async (_, { username, password, email, approved }) => {
      const user = new User({
        username: username,
        password: password,
        email: email,
        approved: approved
      });
      await user.save();
      return user;
    },
    approveUser: async (_, { username }) => {
      await User.findOneAndUpdate({ username: username }, { approved: true });
      return true;
    },
    disapproveUser: async (_, { username }) => {
      await User.findOneAndUpdate({ username: username }, { approved: false });
      return true;
    },
    deleteUser: async (_, { username }) => {
      await User.findOneAndDelete({ username: username });
      return true;
    },
    getApprovedUser: async (_, { username, password }) => {
      const user = await User.findOne({
        username: username,
        password: password,
        approved: true
      });
      return user;
    },
    createCategory: async (_, { categoryId, categoryName, categoryPath }) => {
      const category = new Category({
        categoryId: categoryId,
        categoryName: categoryName,
        categoryPath: categoryPath
      });
      await category.save();
      return category;
    }
  }
};

const options = { port: process.env.PORT || 4000, endpoint: "/graphql" };

const server = new GraphQLServer({ typeDefs, resolvers });
const app = server.express;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

mongoose.connection.once("open", function() {
  server.start(options, () =>
    console.log("Server is running on localhost:4000")
  );
});
