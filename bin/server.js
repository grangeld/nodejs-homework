const app = require("../app");
const createFolderIsNotExist = require("../helpers/create-dir");
require("dotenv").config();
const db = require("../model/db");

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOAD_DIR);
    await createFolderIsNotExist(AVATARS_OF_USERS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log("Server not run. Error ", err);
  process.exit(1);
});
