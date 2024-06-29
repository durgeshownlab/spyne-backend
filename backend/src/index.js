import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';


dotenv.config({
    path: './.env'
});

connectDB()
.then(()=>{

    app.on('error', (error)=>{
        console.log('Error: ',error)
    });

    app.listen(process.env.POST || 8000, () => {
        console.log('App listening on port 3000!');
    });
})
.catch((error)=>{
    console.log("mongodb connection failed", error)
})