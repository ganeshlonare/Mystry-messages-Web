import mongoose from 'mongoose'

type ConnectionObject={
    isConnected? : number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log(`Already connected to database!`);
        return
    }
    try {
        const db=await mongoose.connect(process.env.MONGO_URI || '',{});
        console.log("dbObject :- " , db.connections[0].readyState)
        connection.isConnected = db.connections[0].readyState
        console.log(`DB connected successfully...`);
    } catch (error) {
        console.log(`Connection to DB is failed.`);
        console.log(error);
        process.exit(1);
    }
}

export default dbConnect;