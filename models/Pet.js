const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  adoptionStatus: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  hypoallergenic: {
    type: Boolean,
    required: true
  },
  dietaryRestrictions: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Pet', PetSchema);
