const Highlight = require("../models/Highlight");

const createHighlight = async (req, res) => {
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
    const newHighlight = await Highlight.create({
      message,
      address,
      likes: [],
      author: req.user._id,
    });
    res.status(200).json(newHighlight);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const listHighlights = async (req, res) => {
  try {
    const { district } = req.query;

    const query = district ? { "address.district": district } : {};

    const highlights = await Highlight.find(query).populate(
      "likes",
      "username"
    );
    res.status(200).json(highlights);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getHighlight = async (req, res) => {
  const { id } = req.params;

  try {
    const highlight = await Highlight.findById(id).populate(
      "likes",
      "username"
    );

    if (!highlight) {
      return res.status(404).send({ message: "Highlight not found" });
    }

    res.status(200).json(highlight);
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const likeHighlight = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  try {
    const highlight = await Highlight.findById(id);
    if (!highlight) {
      return res.status(400).send({ message: "Highlight not found" });
    }

    const index = highlight.likes.indexOf(user_id);

    if (index === -1) {
      highlight.likes.push(user_id);
    } else {
      highlight.likes.splice(index, 1);
    }

    await highlight.save();

    res.status(200).json({
      message: index === -1 ? "Liked" : "Like removed",
      likesCount: highlight.likes.length,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  getHighlight,
  likeHighlight,
  listHighlights,
  createHighlight,
};
