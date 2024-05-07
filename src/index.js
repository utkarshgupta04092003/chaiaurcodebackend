import env from "dotenv";
env.config();

import { connectDB } from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`server is listening at ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("something went wrong in database");
    });
