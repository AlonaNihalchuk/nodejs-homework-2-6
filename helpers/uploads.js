const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("./customError");
const { HttpCode } = require("../config/constants");

require("dotenv").config();

const TMP_DIR = process.env.TMP_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TMP_DIR);
  },
  filename: function (req, file, cb) {
    const [, extension] = file.originalname.split(".");
    cb(null, `${uuidv4()}.${extension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      return cb(null, true);
    }

    cb(new CustomError(HttpCode.BAD_REQUEST, "Wrong format for avatar"));
  },
});
module.exports = upload;
