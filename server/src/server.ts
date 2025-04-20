// server/src/server.ts
import app from './app';
import 'dotenv/config'; // Ensure env variables are loaded

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});