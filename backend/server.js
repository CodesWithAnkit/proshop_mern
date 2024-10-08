import path from 'path'
import express from 'express'
import connectDB from './config/db.js'
import productRoutes from './routes/products.route.js'
import userRoutes from './routes/users.route.js'
import orderRoutes from './routes/orders.route.js'
import uploadRoutes from './routes/upload.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
dotenv.config()
const dbUrl = process.env.MONGO_URI
connectDB(dbUrl)
const port = process.env.PORT || 5000

const app = express()
// Body paser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser middleware
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// Paypal Accoount
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// set __dirname to resolve the path of the uploads folder
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running...')
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))
