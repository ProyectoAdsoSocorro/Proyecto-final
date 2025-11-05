import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Tuition from "./routes/tuition.js";

const app = express();

app.use(express.json())
app.use("/api/tuitions", Tuition)

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    mongoose.connect(`${process.env.MONGO_URL}`).then(() => console.log(`Base de datos conectada`));
});
