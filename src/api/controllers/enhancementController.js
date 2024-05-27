const Enhancement = require("../models/Enhancement");

const createEnhancement = async (req, res) => {
  const { message, address } = req.body;

  if (!message) {
    return res.status(400).send({ message: "Message is required" });
  }

  if (!address) {
    return res.status(400).send({ message: "Address is required" });
  }

  if (
    !address.district ||
    !address.city ||
    !address.state ||
    !address.country
  ) {
    return res.status(400).send({ message: "Address fields missing" });
  }

  try {
    const newEnhancement = await Enhancement.create({
      message,
      address,
      likes: [],
      author: req.user._id,
    });
    res.status(200).json(newEnhancement);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const listEnhancements = async (req, res) => {
  try {
    const { district } = req.query;

    const query = district ? { "address.district": district } : {};

    const enhancements = await Enhancement.find(query).populate(
      "likes",
      "username"
    );
    res.status(200).json(enhancements);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getEnhancement = async (req, res) => {
  const { id } = req.params;

  try {
    const enhancement = await Enhancement.findById(id).populate(
      "likes",
      "username"
    );

    if (!enhancement) {
      return res.status(404).send({ message: "Enhancement not found" });
    }

    res.status(200).json(enhancement);
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const likeEnhancement = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  try {
    const enhancement = await Enhancement.findById(id);
    if (!enhancement) {
      return res.status(400).send({ message: "Enhancement not found" });
    }

    const index = enhancement.likes.indexOf(user_id);

    if (index === -1) {
      enhancement.likes.push(user_id);
    } else {
      enhancement.likes.splice(index, 1);
    }

    await enhancement.save();

    res.status(200).json({
      message: index === -1 ? "Liked" : "Like removed",
      likesCount: enhancement.likes.length,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  getEnhancement,
  likeEnhancement,
  listEnhancements,
  createEnhancement,
};
