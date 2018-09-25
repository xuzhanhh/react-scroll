if (process.env.NODE_ENV === "production") {
    module.exports = require("./dist/react-scroll.min.js");
  } else {
    module.exports = require("./dist/react-scroll.js");
  }
  