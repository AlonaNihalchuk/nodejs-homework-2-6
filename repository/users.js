const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserByVerifiedToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

const create = async ({ email, password, subscription }) => {
  const user = new User({ email, password, subscription });
  return await user.save();
};

const updateAvatar = async (id, avatarUrl) => {
  return await User.updateOne({ _id: id }, { avatarURL: avatarUrl });
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateTokenVerify = async (id, verify, verifyToken) => {
  console.log(typeof verify);
  console.log(typeof verifyToken);
  // see
  const updateUser = await User.updateOne({ _id: id }, { verify, verifyToken });
  console.log(updateUser);
  return updateUser;
};

const updateSubscription = async (body, userId) => {
  const updateSubscription = await User.findByIdAndUpdate(
    { _id: userId },
    { ...body },
    { new: true }
  );
  return updateSubscription;
};

module.exports = {
  findById,
  findUserByEmail,
  create,
  findUserByVerifiedToken,
  updateAvatar,
  updateToken,
  updateTokenVerify,
  updateSubscription,
};
