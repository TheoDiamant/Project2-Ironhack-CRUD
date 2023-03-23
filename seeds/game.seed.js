const Game = require("../models/Game.model");
const mongoose = require("mongoose");

const Snake = [
  {
    name: "Snake",
    template: "snake.hbs",
    logo: "/images/snake-images/Logo.png",
  },
];

const Naruto = [
  {
    name: "Naruto",
    template: "naruto.hbs",
    logo: "/images/naruto-images/naruto-logo.jpg",
  },
];

const JetPackMan = [
  {
    name: "JetPackMan",
    template: "jetpackman.hbs",
    logo: "/images/jetpackman-images/jet_fly/tile000.png",
  },
];

const Pongtennis = [
  {
    name: "Pong-Tennis",
    template: "pongtennis.hbs",
    logo: "/images/pongTennis-images/pongtennis-Logo.jpg",
  },
];

const ShootingMaster = [
  {
    name: "Shootin-master",
    template: "shootingmaster.hbs",
    logo: "/images/Logo.png",
  },
];

const Pacman = [
  {
    name: "Pacman",
    template: "pacman.hbs",
    logo: "/images/Logo.png",
  },
];

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://TheoRaphael:zsbKtyOqyByN63th@project2crud.hqphxaq.mongodb.net/CRUDProject";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );

    Game.create(Pongtennis)
      .then((data) => {
        console.log(`${data.length} games inserted.`);
        mongoose.connection.close();
      })
      .catch((err) => {
        console.error("Error creating games: ", err);
      });
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
