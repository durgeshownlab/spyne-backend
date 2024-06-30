import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

const PORT = process.env.POST || 8000

dotenv.config({
    path: './.env'
});

connectDB()
.then(()=>{

    app.on('error', (error)=>{
        console.log('Error: ',error)
    });

    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}!`);
    });
})
.catch((error)=>{
    console.log("mongodb connection failed", error)
})