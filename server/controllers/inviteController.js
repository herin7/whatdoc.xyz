const crypto = require('crypto');
const { Resend } = require('resend');
const Invite = require('../models/Invite');

function generateCode() {
    return 'WD-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

function getInviteHtml(inviteCode) {
    return `
        <div style="font-family: monospace; background: #0a0a0a; color: #d4d4d8; padding: 40px; max-width: 500px;">
            <p style="color: #71717a; font-size: 11px; letter-spacing: 2px;">// WHATDOC ACCESS_GRANTED</p>
            <h1 style="color: #fff; font-size: 24px; margin: 16px 0;">You're in.</h1>
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                Your request has been approved. Use the invite code below to create your account.
            </p>
            <div style="background: #111; border: 1px solid #27272a; padding: 16px; margin: 24px 0; text-align: center;">
                <p style="color: #71717a; font-size: 10px; letter-spacing: 2px; margin: 0 0 8px 0;">INVITE CODE</p>
                <p style="color: #34d399; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 3px;">${inviteCode}</p>
            </div>
            <a href="https://whatdoc.xyz/signup" style="display: inline-block; background: #fff; color: #000; padding: 10px 24px; font-size: 13px; font-weight: bold; text-decoration: none; letter-spacing: 1px;">
                CREATE ACCOUNT →
            </a>
            <p style="color: #52525b; font-size: 11px; margin-top: 32px;">
                This code is single-use. Once you sign up, it's consumed.
            </p>
        </div>
    `;
}

async function sendInviteEmail(email, inviteCode) {
    console.log(`[invite] Attempting to send email to ${email}...`);

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
        console.log('[invite] Using Resend API...');
        try {
            const resend = new Resend(resendKey);
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_FROM || 'WhatDoc <onboarding@resend.dev>',
                to: email,
                subject: "You're in — WhatDoc Invite Code",
                html: getInviteHtml(inviteCode),
            });

            if (error) {
                console.error(`[invite] ❌ Resend error:`, error);
                throw new Error(error.message);
            }

            console.log(`[invite] ✓ Email sent via Resend — id: ${data.id}`);
            return;
        } catch (err) {
            console.error(`[invite] ❌ Resend failed: ${err.message}`);
            throw err;
        }
    }

    // Fallback: log to console if no email provider configured
    console.log(`[invite] ⚠ No email provider configured (set RESEND_API_KEY)`);
    console.log(`[invite] Code for ${email}: ${inviteCode}`);
}

async function requestInvite(req, res) {
    try {
        const { email } = req.body;
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Valid email required.' });
        }

        const existing = await Invite.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'This email is already on the waitlist.' });
        }

        const invite = await Invite.create({
            email: email.toLowerCase(),
            inviteCode: generateCode(),
        });

        return res.status(201).json({
            message: 'Request logged.',
            email: invite.email,
            status: invite.status,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'This email is already on the waitlist.' });
        }
        console.error('requestInvite error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
}

async function approveInvite(req, res) {
    try {
        const adminKey = req.headers['x-admin-key'];
        if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email required.' });
        }

        const invite = await Invite.findOne({ email: email.toLowerCase() });
        if (!invite) {
            return res.status(404).json({ message: 'No invite request found for this email.' });
        }

        if (invite.status === 'approved') {
            return res.json({ message: 'Already approved.', inviteCode: invite.inviteCode });
        }

        if (invite.status === 'used') {
            return res.json({ message: 'Invite already used.' });
        }

        invite.status = 'approved';
        await invite.save();

        let emailSent = false;
        let emailError = null;
        try {
            await sendInviteEmail(invite.email, invite.inviteCode);
            emailSent = true;
        } catch (mailErr) {
            emailError = mailErr.message;
            console.error('[invite] Email failed:', mailErr.message);
        }

        return res.json({
            message: emailSent ? 'Approved and email sent.' : `Approved but email failed: ${emailError}`,
            email: invite.email,
            inviteCode: invite.inviteCode,
            emailSent,
        });
    } catch (err) {
        console.error('approveInvite error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
}

async function verifyInvite(req, res) {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code required.' });
        }

        const invite = await Invite.findOne({
            email: email.toLowerCase(),
            inviteCode: code.toUpperCase(),
        });

        if (!invite || invite.status !== 'approved') {
            return res.json({ valid: false });
        }

        return res.json({ valid: true });
    } catch (err) {
        console.error('verifyInvite error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
}
async function listInvites(req, res) {
    try {
        const adminKey = req.headers['x-admin-key'];
        if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        const invites = await Invite.find().sort({ createdAt: -1 });
        return res.json({ invites });
    } catch (err) {
        console.error('listInvites error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
}

async function deleteInvite(req, res) {
    try {
        const adminKey = req.headers['x-admin-key'];
        if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        const { email } = req.body;
        await Invite.deleteOne({ email: email.toLowerCase() });
        return res.json({ message: 'Deleted.' });
    } catch (err) {
        console.error('deleteInvite error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
}

module.exports = { requestInvite, approveInvite, verifyInvite, listInvites, deleteInvite };
