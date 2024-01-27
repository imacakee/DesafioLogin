const express = require("express");
const handlebars = require("express-handlebars");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");

const sessionsRouter = require("./routes/sessions.router.js");
const usersViewRouter = require("./routes/users.views.router.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

const MONGO_URL =
  "mongodb://127.0.0.1:27017/clase19?retryWrites=true&w=majority";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10 * 60,
    }),

    secret: "coderS3cr3t",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);

const PORT = 9090;
app.listen(PORT, () => {
  console.log(`Server run on port: ${PORT}`);
});

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado con exito a la DB usando Mongoose!!");
  } catch (error) {
    console.error("No se pudo conectar a la BD usando Moongose: " + error);
    process.exit();
  }
};
connectMongoDB();
