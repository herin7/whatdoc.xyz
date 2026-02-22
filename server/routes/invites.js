const { Router } = require('express');
const { requestInvite, approveInvite, verifyInvite, listInvites, deleteInvite } = require('../controllers/inviteController');

const router = Router();

router.post('/request', requestInvite);
router.post('/approve', approveInvite);
router.post('/verify', verifyInvite);
router.get('/list', listInvites);
router.post('/delete', deleteInvite);
router.get('/status', (req, res) => {
    res.json({ waitlistEnabled: process.env.WAITLIST_ENABLED === 'true' });
});

module.exports = router;
