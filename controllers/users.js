const jwt = require("jsonwebtoken");
const path = require("path");
const mkdirp = require("mkdirp");

const Users = require("../repository/users");
const { HttpCode } = require("../config/constants");
const CustomError = require("../helpers/customError");
const UploadFileAvatar = require("../services/file-upload");
const EmailService = require("../services/email/service");
const {
  CreateSenderSendgrid,
  CreateSenderNodemailer,
} = require("../services/email/sender");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const userRegistration = async (req, res, next) => {
  const { email, password, subscription } = req.body;
  const user = await Users.findUserByEmail(email);
  if (user) {
    throw new CustomError(HttpCode.CONFLICT, "Email is already exist");
  }

  // sent email to verify user
  const newUser = await Users.create({ email, password, subscription });
  const emailService = new EmailService(
    process.env.NODE_ENV,
    new CreateSenderNodemailer()
  );
  const statusEmail = await emailService.sendVerifyEmail(
    newUser.email,
    newUser.verifyToken
  );
  return res.status(HttpCode.CREATED).json({
    status: "success",
    cod: HttpCode.CREATED,
    data: {
      id: newUser.id,
      email: newUser.email,
      subscription: newUser.subscription,
      avatar: newUser.avatarURL,
      successEmail: statusEmail,
    },
  });
};
const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findUserByEmail(email);
  console.log(user);
  const isValidPassword = await user.isValidPassword(password);
  if (!user || !isValidPassword || !user.verify) {
    throw new CustomError(HttpCode.UNAUTHORIZED, "Invalid credentials");
  }

  const id = user._id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await Users.updateToken(id, token);
  return res.status(HttpCode.OK).json({
    status: "success",
    cod: HttpCode.OK,
    data: {
      token: token,
      user: { email: user.email, subscription: user.subscription },
    },
  });
};

const updateUserSubscription = async (req, res, next) => {
  const { subscription } = req.body;
  // const user = req.user;

  const userId = req.user._id;
  const user = await Users.updateSubscription({ subscription }, userId);

  if (user) {
    return res.status(HttpCode.OK).json({
      status: "success",
      cod: HttpCode.OK,
      data: { user: { email: user.email, subscription: user.subscription } },
    });
  }
  throw new CustomError(HttpCode.NOT_FOUND, "Not Found");
};

const uploadAvatar = async (req, res, next) => {
  const id = String(req.user._id);
  const file = req.file;
  console.log(file);
  const AVATARS_DIR = process.env.AVATARS_DIR;
  const destination = path.join(AVATARS_DIR, id);
  await mkdirp(destination);
  const uploadFileAvatar = new UploadFileAvatar(destination);
  const avatarUrl = await uploadFileAvatar.save(file, id);
  console.log(avatarUrl);
  await Users.updateAvatar(id, avatarUrl);

  return res.status(HttpCode.OK).json({
    status: "success",
    cod: HttpCode.OK,
    data: {
      avatarURL: avatarUrl,
    },
  });
};

const userLogout = async (req, res, next) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  res.status(HttpCode.NO_CONTENT).json({});
};

const verifyUser = async (req, res, next) => {
  console.log(req.params);

  const user = await Users.findUserByVerifiedToken(
    req.params.verificationToken
  );
  console.log(user);
  if (user) {
    await Users.updateTokenVerify(user._id, true, null);
    return res.status(HttpCode.OK).json({
      status: "success",
      cod: HttpCode.OK,
      data: {
        message: "Verification successful",
      },
    });
  }
  return res.status(HttpCode.UNAUTHORIZED).json({
    status: "error",
    cod: HttpCode.UNAUTHORIZED,
    data: {
      message: "User not found",
    },
  });
};

const repeatEmailToVerifyUser = async (req, res, next) => {
  // const { email } = req.body;
  // const user = await Users.findUserByEmail(email);
  // if (user) {
  //   const { email, verifyToken } = user;
  //   const emailService = new EmailService(
  //     process.env.NODE_ENV,
  //     new CreateSenderNodemailer()
  //   );
  //   const statusEmail = await emailService.sendVerifyEmail(email, verifyToken);
  // }
  // return res.status(HttpCode.OK).json({
  //   status: "success",
  //   cod: HttpCode.OK,
  //   data: {
  //     message: "Verification successful",
  //     data: {
  //       successEmail: statusEmail,
  //     },
  //   },
  // });
  const { email } = req.body;
  const user = await Users.findUserByEmail(email);
  console.log(user);
  if (user) {
    const { email, verifyToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderSendgrid()
    );
    // tut
    console.log(email);
    console.log(verifyToken);
    const statusEmail = await emailService.sendVerifyEmail(email, verifyToken);
    return res.status(HttpCode.CREATED).json({
      status: "success",
      cod: HttpCode.CREATED,
      data: {
        // id: newUser.id,
        // email: newUser.email,
        // subscription: newUser.subscription,
        // avatar: newUser.avatarURL,
        successEmail: statusEmail,
      },
    });
  }
  return res.status(HttpCode.BAD_REQUEST).json({
    status: "success",
    code: HttpCode.BAD_REQUEST,
    data: {
      message: "BAD REQUEST",
    },
  });
};

module.exports = {
  userRegistration,
  userLogin,
  updateUserSubscription,
  uploadAvatar,
  userLogout,
  verifyUser,
  repeatEmailToVerifyUser,
};
