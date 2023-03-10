const { Schema, model } = require("mongoose")

const imageSchema = (
    {
        url: {
          type: String,
          required: true
        },
    }
)

const Image = model("Image", imageSchema)

module.exports = Image

