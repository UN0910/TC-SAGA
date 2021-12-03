const { Contact } = require("../models/contactModel");

exports.getContacts = async (req, res) => {
  const contactList = await Contact.find();

  if (!contactList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(contactList);
};

exports.getContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res
      .status(500)
      .json({ message: "The Contact form with the given ID was not found." });
  }
  res.status(200).send(contact);
};

exports.addContact = async (req, res) => {
  let contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  });
  contact = await contact.save();

  if (!contact)
    return res.status(400).send("the contact form cannot be created!");

  res.send(contact);
};

exports.updateContact = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    },
    { new: true }
  );

  if (!contact)
    return res.status(400).send("the contact form cannot be updated!");

  res.send(contact);
};

exports.deleteContact = async (req, res) => {
  Contact.findByIdAndRemove(req.params.id)
    .then((contact) => {
      if (contact) {
        return res
          .status(200)
          .json({ success: true, message: "the Contact Form is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Contact Form not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};
