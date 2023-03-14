const Game = require("../models/Game.model")
const mongoose = require("mongoose")

const game = [
    {
    name: "Snake", 
    jsFile: "/js/snake/index.js", 
    cssFile: "/stylesheets/stylesnake.css", 
    template: "snake.hbs",
    action1: "Start your 3310!",
    action2: "Reload the game",
    action3: "Use arrows to control the Snake!",
    logo: "/images/Logo.png",
    img1: "/images/phone3310.webp",
    img2: "/images/phone3310.webp",
}
]

const pacman = [
    {
    name: "Naruto", 
    template: "naruto.hbs",
}
]




const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/CRUDProject";

mongoose
.connect(MONGO_URI)
.then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    Game.create(pacman)
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