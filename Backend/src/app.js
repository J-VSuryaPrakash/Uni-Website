import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

// if there are any assets like file or images we keep them in the public folder
app.use(express.static("public"))

app.use(cookieParser())


export {app}