import 'dotenv/config'
import server from "./app.js";
import { DBconnect } from './DB/DBconnect.js';


const PORT = process.env.SERVER_PORT;
DBconnect().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is Running on PORT : ${PORT}`);
    })
}).catch((error) => {
    console.log('MongoDB Connection Failled');
    console.log("Server",error);
})