import mongoose from "mongoose";
import 'dotenv/config'

export const DBconnect = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB Connectioned To :', mongoose.connection.name);

        response.connection.on('disconnected', (e) => {
            console.log('MongoDB Disconnected');
        });
    } catch (error) {
        console.log('MongoDB Connection Failled');
    }
}