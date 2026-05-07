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
  res.json({ 
    message: "Paragon Peptides Backend API is running",
    version: "1.0.0"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Paragon Peptides Backend running on port ${PORT}`);
});