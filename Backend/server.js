const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const host = "localhost";
const mongoose = require("mongoose");
const router = require("./router");

app.use(cors());
app.use(express.json());

/* app.use((req,res) => {
    console.log(req.body);
}) */

app.use(
  cors({
    origin: ["https://deploy-mern-frontend.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use(express.json());

const uri =
  "mongodb+srv://gaming:gaming1234@cluster0.cpigsp9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};

connect();

const server = app.listen(port, host, () =>
  console.log(`Node server is listening to ${server.address().port}`)
);

app.use("/api", router);
