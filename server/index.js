import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'

import connectDB from './mongodb/connect.js'
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res)=>{
    res.send('Hello AI')
})

const startServer = async()=> {

    try{
        connectDB(process.env.MONGODB_URL);
        app.listen(4000, () => console.log('Running on port http://localhost:4000'))
    }catch(error) {
        console.log(error)
    }
    
}

startServer();