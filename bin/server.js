const mkdirp = require("mkdirp");

const db = require("../config/db");
const app = require("../app");

require("dotenv").config();
const TMP_DIR = process.env.TMP_DIR;
const AVATARS_DIR = process.env.AVATARS_DIR;

const PORT = process.env.PORT || 3000;
db.then(() => {
  app.listen(PORT, async () => {
    await mkdirp(TMP_DIR);
    await mkdirp(AVATARS_DIR);

    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server is not running. Error: ${err.message}`);
});
