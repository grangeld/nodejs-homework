const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for your contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
  }
);

contactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
