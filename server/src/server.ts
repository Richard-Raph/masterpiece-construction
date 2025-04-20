import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.routes';
import vendorRoutes from './routes/vendor.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Role-based app running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
