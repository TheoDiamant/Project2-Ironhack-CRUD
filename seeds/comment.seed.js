const Game = require("../models/Game.model")
const User = require("../models/User.model")
const Comment = require("../models/Comment.model")
const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/CRUDProject";

// const comment = [
//     {
//     content: "this is my super comment",

//     }
// ]

mongoose
.connect(MONGO_URI)
.then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    // Trouver un utilisateur et un jeu existants dans la base de données
    // const user = User.findOne({ username: "example_user" });
    // const game = Game.findOne({ name: "example_game" });
    Comment.create(comment)
        .then(data => {

            console.log(`${data.length} comments inserted.`)
            mongoose.connection.close()

        }).catch((err) => {
            console.error("Error creating games: ", err);
        });

})
.catch((err) => {
    console.error("Error connecting to mongo: ", err);
});