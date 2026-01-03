import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`)
});