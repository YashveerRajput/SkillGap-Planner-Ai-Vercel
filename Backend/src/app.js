const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")

//initiating the server
const app = express();


//middle ware
app.use(express.json());
app.use(cookieParser())

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

const normalizeOrigin = (origin) => origin.replace(/\/$/, "")

const exactAllowedOrigins = new Set(
    allowedOrigins
        .filter((origin) => !origin.includes("*"))
        .map(normalizeOrigin)
)

const wildcardAllowedOrigins = allowedOrigins
    .filter((origin) => origin.includes("*"))
    .map((pattern) => {
        const escaped = pattern
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\*/g, ".*")

        return new RegExp(`^${escaped.replace(/\/$/, "")}$`)
    })

function isOriginAllowed(origin) {
    const normalizedOrigin = normalizeOrigin(origin)

    if (exactAllowedOrigins.has(normalizedOrigin)) {
        return true
    }

    return wildcardAllowedOrigins.some((pattern) => pattern.test(normalizedOrigin))
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server calls and local tools that do not send Origin header.
        if (!origin) return callback(null, true)

        if (isOriginAllowed(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    },
    credentials:true
}))

// require router - required all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.route")

// using all the routes here
app.use("/api/auth", authRouter)
app.use("/api/interview",interviewRouter)
module.exports = app