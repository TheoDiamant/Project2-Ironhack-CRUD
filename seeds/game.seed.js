const Game = require("../models/Game.model")
const mongoose = require("mongoose")

const Snake = [
    {
    name: "Snake", 
    template: "snake.hbs",
    logo: "/images/Logo.png",
}
]

const Naruto = [
    {
    name: "Naruto", 
    template: "naruto.hbs",
    }
]

const JetPackMan = [
    {
    name: "JetPackMan", 
    template: "jetpackman.hbs",
    logo: "/images/game_background_1.png",
}
]

const Pongtennis = [
    {
    name: "Pong-Tennis", 
    template: "pongtennis.hbs",
    logo: "/images/Logo.png",
    }
]

const ShootingMaster = [
    {
    name: "Shootin-master", 
    template: "shootingmaster.hbs",
    logo: "/images/Logo.png",
    }
]


const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/CRUDProject";

mongoose
.connect(MONGO_URI)
.then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    Game.create(ShootingMaster)
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