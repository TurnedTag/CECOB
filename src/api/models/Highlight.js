const axios = require("axios");
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s-]{2,}$/, "Invalid city name"],
  },
  state: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s-]{2,}$/, "Invalid country name"],
  },
  country: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s-]{2,}$/, "Invalid country name"],
  },
});

addressSchema.pre("save", async function (next) {
  const apiKey = process.env.HERE_MAPS_KEY;
  const formattedAddress = `${this.street}, ${this.district}, ${this.city}, ${this.state}, ${this.country}`;
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
    formattedAddress
  )}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (!response?.data?.items)
      throw new Error("Address validation failed with HERE Maps");

    for (const index in response.data.items) {
      if (
        response.data.items[index].address.countryName === this.country &&
        response.data.items[index].address.state === this.state &&
        response.data.items[index].address.district === this.district
      ) {
        return true;
      }
    }

    throw new Error("Address not found");
  } catch (error) {
    next(error);
  }
});

const highlightSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    message: {
      type: String,
      required: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const Highlight = mongoose.model("Highlight", highlightSchema);
module.exports = Highlight;
