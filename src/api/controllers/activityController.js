const { default: axios } = require("axios");
const Activity = require("../models/Activity");
const Comment = require("../models/Comment");
const User = require("../models/User");

const createActivity = async (req, res) => {
  const { title, description, address } = req.body;

  console.log(req.body);

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
      title,
      description,
      address,
    });
    res.status(200).json(newActivity);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const listActivities = async (req, res) => {
  try {
    const { district } = req.query;

    const query = district ? { "address.district": district } : {};

    const activities = await Activity.find(query).populate(
      "author",
      "username"
    );

    res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await Activity.findById(id)
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .populate("author", "username");

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

const presenceActivity = async (req, res) => {
  const { id } = req.params;

  const activity_id = id;
  const user_id = req.user._id;

  try {
    const activity = await Activity.findById(activity_id);
    if (!activity) {
      return res.status(400).send({ message: "Activity not found" });
    }

    const index = activity.presence.indexOf(user_id);

    if (index === -1) {
      activity.presence.push(user_id);
    } else {
      activity.presence.splice(index, 1);
    }

    await activity.save();

    res.status(200).json({
      message: index === -1 ? "presence confirmed" : "presence removed",
      presenceCount: activity.presence.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const addCommentToActivity = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).send({ message: "Content is required" });
  }

  try {
    const activity = await Activity.findById(id);

    if (!activity)
      return res.status(404).send({ message: "Activity not found" });

    const comment = await Comment.create({
      content,
      parent: id,
      author: req.user._id,
    });
    activity.comments.push(comment);

    await activity.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const getTopActivitiesFromDistrict = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { cep } = user;

    const activities = await Activity.find({
      "address.district": await getDistrictFromCEP(cep),
    })
      .sort({ likes: -1 })
      .limit(3)
      .populate("author", "username");

    res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const getDistrictFromCEP = async (cep) => {
  const apiKey = process.env.HERE_MAPS_KEY;
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${cep}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200 && response.data.items.length > 0) {
      const district = response.data.items[0].address.district;
      return district;
    } else {
      throw new Error("District not found");
    }
  } catch (error) {
    console.error("Error getting district from CEP:", error);
    throw error;
  }
};

const listUserPresenceActivities = async (req, res) => {
  const user_id = req.user._id;

  try {
    const activities = await Activity.find({
      presence: { $in: [user_id] },
    }).populate("author", "username");

    console.log(activities);

    res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getActivity,
  likeActivity,
  createActivity,
  listActivities,
  presenceActivity,
  addCommentToActivity,
  listUserPresenceActivities,
  getTopActivitiesFromDistrict,
};
