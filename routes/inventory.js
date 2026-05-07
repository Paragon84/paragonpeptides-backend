import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// Get all products with stock
router.get('/inventory', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, stock, category, doses');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product by ID
router.get('/product/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Product not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;