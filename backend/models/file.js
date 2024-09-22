import mongoose, { Schema } from "mongoose";

const supportedFormats = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/mpeg",
];

const fileSchema = new Schema({
  key: {
    type: String,
    trim: true,
    required: [true, "File key is required."],
  },
  orignalName: {
    type: String,
    trim: true,
    required: [true, "File orginal name is required."],
  },
  mimeType: {
    type: String,
    required: [true, "File mime type is required."],
    enum: {
      values: supportedFormats,
      message: `{VALUE} is not a valid MIME type for images or videos. Supported formats are: ${supportedFormats.join(
        ", "
      )}.`,
    },
  },
  url: {
    type: String,
    trim: true,
  },
  user: {
    type: ObjectId,
    required: [true, "The owner is required for the file."],
    ref: "User",
  },
});

const File = mongoose.model("File", fileSchema);

export default File;
