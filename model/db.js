const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.URI_DB;

// Соединение с бд

// useCreateIndex: true,
//
const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 15,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connected error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Закрытие соединение с бд
process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Disconnect MongoDB");
    process.exit();
  });
});

module.exports = db;
