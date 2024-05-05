const Activity = require("../models/Activity");

const createActivity = async (req, res) => {
  const { description, address, title } = req.body;

  if (!description) {
    return res.status(400).send({ message: "Description is required" });
  }

  if (!title) {
    return res.status(400).send({ message: "Title is required" });
  }

  if (!address) {
    return res.status(400).send({ message: "Address is required" });
  }

  if (
    !address.street ||
    !address.district ||
    !address.city ||
    !address.state ||
    !address.country
  ) {
    return res.status(400).send({ message: "Address fields missing" });
  }

  try {
    const newActivity = await Activity.create({
      author: req.user._id,
      description,
      address,
      title,
    });
    res.status(200).json(newActivity);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createActivity,
};
