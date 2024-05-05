const Activity = require("../models/Activity");

const createActivity = async (req, res) => {
  const { title, description, address } = req.body;

  if (!title) {
    return res.status(400).send({ message: "Title is required" });
  }

  if (!description) {
    return res.status(400).send({ message: "Description is required" });
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
    });
    res.status(200).json(newActivity);
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const listActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate("author", "username");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await Activity.findById(id).populate("author", "username");

    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const likeActivity = async (req, res) => {
  const { id } = req.params;

  const activity_id = id;
  const user_id = req.user._id;

  try {
    const activity = await Activity.findById(activity_id);
    if (!activity) {
      return res.status(400).send({ message: "Activity not found" });
    }

    const index = activity.likes.indexOf(user_id);

    if (index === -1) {
      activity.likes.push(user_id);
    } else {
      activity.likes.splice(index, 1);
    }

    await activity.save();

    res.status(200).json({
      message: index === -1 ? "Already liked" : "Like removed",
      likesCount: activity.likes.length,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createActivity,
  listActivities,
  getActivity,
  likeActivity,
};
