const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
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
  updateAvatar,
  updateToken,
  updateSubscription,
};
