const Game = require("../models/Game.model")
const mongoose = require("mongoose")

const game = [
    {name: "Snake", 
    jsFile: "/js/snake/index.js", 
    cssFile: "/stylesheets/stylesnake.css", 
    logo: "/images/Logo.png",
    img1: "/images/phone3310.webp",
    img2: "/images/phone3310.webp",
}
]

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/CRUDProject";

mongoose
.connect(MONGO_URI)
.then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    Game.create(game)
        .then(data => {

            console.log(`${data.length} games inserted.`)
            mongoose.connection.close()

        }).catch((err) => {
            console.error("Error creating games: ", err);
        });

})
.catch((err) => {
    console.error("Error connecting to mongo: ", err);
});