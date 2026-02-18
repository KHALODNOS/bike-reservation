const mongoose = require("mongoose");

const connecfFn = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("conencted to db");
  } catch (error) {
    console.error("mongoDB connection failed");
  }
};

module.exports = connecfFn;
