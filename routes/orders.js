import express from 'express';
import { supabase } from '../utils/supabase.js';
import { generateOrderCode } from '../utils/generateCode.js';
import { verifyX402Payment } from '../utils/x402.js';

const router = express.Router();

router.post('/create-order', async (req, res) => {
  const { productId, dose, quantity, customerEmail } = req.body;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (!product || product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  const order = {
    product_id: productId,
    dose,
    quantity,
    customer_email: customerEmail,
    status: 'pending',
    total: product.price * quantity,
    created_at: new Date()
  };

  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ orderId: data.id, total: data.total });
});

router.post('/process-payment', async (req, res) => {
  const { orderId, paymentProof } = req.body;

  const isValid = await verifyX402Payment(paymentProof);
  if (!isValid) return res.status(400).json({ error: 'Payment verification failed' });

  const code = generateOrderCode();

  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status: 'paid', 
      digital_code: code,
      paid_at: new Date()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await supabase.rpc('decrement_stock', { 
    product_id: data.product_id, 
    qty: data.quantity 
  });

  res.json({
    success: true,
    digitalCode: code,
    message: "Payment successful. Your order code is ready."
  });
});

router.post('/redeem-code', async (req, res) => {
  const { code } = req.body;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('digital_code', code)
    .single();

  if (!data || data.status !== 'paid') {
    return res.status(404).json({ error: 'Invalid or already redeemed code' });
  }

  res.json({
    success: true,
    order: data,
    message: "Code redeemed successfully"
  });
});

export default router;