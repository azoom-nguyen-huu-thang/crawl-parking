import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import { getDataByParams } from './db.js'

const port = process.env.PORT || 3123

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Welcome!')
})
app.get('/search', getDataByParams)

app.listen(port, () => {
    console.log(`🚀Server listening at http://localhost:${port}`)
})