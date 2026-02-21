import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.NEBULA_WEBHOOK_SECRET || 'super-secret-hmac-key';

export const verifyNebulaSignature = (req, res, next) => {
    const signature = req.header('X-Nebula-Signature');
    const timestamp = req.header('X-Nebula-Timestamp');

    if (!signature || !timestamp) {
        return res.status(401).json({ error: 'Missing signature or timestamp' });
    }

    // Prevent Replay Attacks (Reject requests older than 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - parseInt(timestamp) > 300) {
        return res.status(401).json({ error: 'Request expired' });
    }

    // Replay the exact stringified payload
    const payloadString = JSON.stringify(req.body);
    const message = `${timestamp}.${payloadString}`;

    // Calculate expected HMAC
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(message)
        .digest('hex');

    // Secure timing-safe comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return res.status(403).json({ error: 'Invalid HMAC signature' });
    }

    next();
};
