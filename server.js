import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import inventoryRoutes from './routes/inventory.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', inventoryRoutes);
app.use('/api', orderRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Paragon Peptides Backend is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});