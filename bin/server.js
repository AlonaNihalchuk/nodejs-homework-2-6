const db = require("../config/db");
const app = require("../app");

require("dotenv").config();
// const UPLOAD_DIR = process.env.UPLOAD_DIR;
// const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

const mkdirp = require("mkdirp");

const TMP_DIR = process.env.TMP_DIR;
// const PUBLIC_DIR = process.env.PUBLIC_DIR;
const AVATARS_DIR = process.env.AVATARS_DIR;

const PORT = process.env.PORT || 3000;
db.then(() => {
  app.listen(PORT, async () => {
    await mkdirp(TMP_DIR);
    // await mkdirp(`${PUBLIC_DIR} / ${AVATARS_DIR}`);
    await mkdirp(AVATARS_DIR);
    // await mkdirp(UPLOAD_DIR);

    // await mkdirp(AVATAR_OF_USERS);

    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server is not running. Error: ${err.message}`);
});
//
