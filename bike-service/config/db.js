const mongoose = require("mongoose");

const connecfFn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("conencted");
  } catch (error) {
    console.error("mongoDB connection failed");
  }
};

module.exports = connecfFn;
