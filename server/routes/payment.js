const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authmware = require('../middlewares/authmware');
const { UserModel } = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'TEST_KEY',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'TEST_SECRET'
});

router.post('/create-order', authmware, async (req, res) => {
    try {
        const { planTier } = req.body; // '499' or '999'
        let amount = 0;
        if (planTier === '499') amount = 49900;
        else if (planTier === '999') amount = 99900;
        else return res.status(400).json({ error: 'Invalid plan tier' });

        const options = {
            amount,
            currency: 'INR',
            receipt: `rcpt_${req.userId.slice(-6)}_${Date.now()}`.slice(0, 40)
        };

        const order = await razorpay.orders.create(options);

        res.json({
            ...order,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error('Razorpay create order error:', err);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

router.post('/verify', authmware, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planTier } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'TEST_SECRET')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment successful
            const user = await UserModel.findById(req.userId);
            user.isPro = true;
            user.planTier = planTier;
            // 30 days expiry
            user.proExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await user.save();

            res.json({ success: true, message: 'Payment verified and upgraded successfully.', user });
        } else {
            res.status(400).json({ success: false, error: 'Invalid Payment Signature' });
        }
    } catch (err) {
        console.error('Razorpay verification error:', err);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

module.exports = router;
