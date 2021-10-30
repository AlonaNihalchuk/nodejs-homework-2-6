const Contacts = require("../repository/index");

const getContacts = async (_req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    res.json({ status: "success", cod: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    // console.log(req.params);
    const contact = await Contacts.getContactById(req.params.contactId);
    console.log(contact);
    console.log(contact.id);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", cod: 200, data: { contact } });
    }
    // бесполезно!! тут 404 не срабатывает если цыфру в айди заменить на др. проваливается в app.js status(500),
    // если цифру в айди удалить или добавить то validationErr,
    // и 404 в app.js если изменить раут

    return res
      .status(404)
      .json({ status: "error", cod: 404, message: "getContact Not found" });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    res.status(201).json({ status: "success", cod: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: "success",
        cod: 200,
        message: "contact deleted",
        data: { contact },
      });
    }
    // 404 срабатывает если цыфру в айди заменить на др.
    // если цифру в айди удалить или добавить то validationErr,
    // и 404 в app.js если изменить раут
    return res
      .status(404)
      .json({ status: "error", cod: 404, message: "deleteContact Not found" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", cod: 200, data: { contact } });
    }
    // 404 срабатывает если цыфру в айди заменить на др.
    // если цифру в айди удалить или добавить то validationErr,
    // и 404 в app.js если изменить раут
    return res
      .status(404)
      .json({ status: "error", cod: 404, message: "missing fields" });
  } catch (error) {
    next(error);
  }
};

const updateStatusFavoriteContact = async (req, res, next) => {
  try {
    const { favorite } = req.body;
    const contact = await Contacts.updateContact(req.params.contactId, {
      favorite,
    });
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", cod: 200, data: { contact } });
    }
    // 404 срабатывает если цыфру в айди заменить на др.
    // если цифру в айди удалить или добавить то validationErr,
    // и 404 в app.js если изменить раут
    return res.status(404).json({
      status: "error",
      cod: 404,
      message: "updateStatusFavoriteContact Not Found",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusFavoriteContact,
};
