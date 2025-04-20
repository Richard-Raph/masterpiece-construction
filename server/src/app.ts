// server/src/app.ts
import 'dotenv/config';
import cors from 'cors';
import router from './routes';
import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router); // All routes now prefixed with /api
// Health check route
app.get('/health', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: 'UP' });
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;