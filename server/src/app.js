import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { errorHandler } from './middleware/errorMiddleware.js';
import routes from './routes/index.js';

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 3. Body Parser
app.use(express.json({ limit: '10mb' }));

// 4. Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 5. Rate Limiting on authentication endpoints[cite: 1]
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});
app.use('/api/auth', authLimiter);

// 6. General API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', apiLimiter);

// Mount Routes
app.use('/api', routes);

// 7. Centralized Error Handling[cite: 1]
app.use(errorHandler);

export default app;