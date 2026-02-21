import express from 'express';
import { verifyNebulaSignature } from '../middleware/hmacAuth.js';

export const createNebulaRouter = (pool) => {
    const router = express.Router();

    // --- 1. The Token Sync Service (Webhook) ---
    router.patch('/sync-rewards', verifyNebulaSignature, async (req, res) => {
        const { tx_id, wallet_address, stardust_earned, action_type } = req.body;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check for idempotency (has this tx_id already been processed?)
            const txCheck = await client.query('SELECT 1 FROM transaction_logs WHERE tx_id = $1', [tx_id]);
            if (txCheck.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(200).json({ message: 'Transaction already processed (Idempotent)' });
            }

            // Apply Points
            const updateResult = await client.query(
                `UPDATE wallet_rewards 
                 SET stardust_balance = stardust_balance + $1, last_sync = CURRENT_TIMESTAMP 
                 WHERE wallet_address = $2 RETURNING stardust_balance`,
                [stardust_earned, wallet_address]
            );

            if (updateResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: "Wallet not found. Has the user linked their identity?" });
            }

            // Record Transaction
            await client.query(
                `INSERT INTO transaction_logs (tx_id, wallet_address, amount, action_type) VALUES ($1, $2, $3, $4)`,
                [tx_id, wallet_address, stardust_earned, action_type]
            );

            await client.query('COMMIT');
            res.status(200).json({ success: true, new_balance: updateResult.rows[0].stardust_balance });

        } catch (error) {
            await client.query('ROLLBACK');
            res.status(500).json({ error: error.message });
        } finally {
            client.release();
        }
    });

    // --- 2. Fetch Products for Nebula conversational API ---
    router.post('/search', verifyNebulaSignature, async (req, res) => {
        const { query } = req.body;
        try {
            const result = await pool.query(
                `SELECT id, name, price, description, images FROM products 
                 WHERE name ILIKE $1 OR description ILIKE $1 LIMIT 5`,
                [`%${query}%`]
            );
            res.json({ products: result.rows });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
