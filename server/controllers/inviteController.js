const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Invite = require('../models/Invite');

function generateCode() {
    return 'WD-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

function getMailTransport() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

async function sendInviteEmail(email, inviteCode) {
    const transporter = getMailTransport();
    if (!transporter) {
        console.log(`[invite] SMTP not configured. Code for ${email}: ${inviteCode}`);
        return;
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "You're in — WhatDoc Invite Code",
        html: `
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
        `,
    });
    console.log(`[invite] Email sent to ${email}`);
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

        try {
            await sendInviteEmail(invite.email, invite.inviteCode);
        } catch (mailErr) {
            console.error('[invite] Email failed:', mailErr.message);
        }

        return res.json({
            message: 'Approved and email sent.',
            email: invite.email,
            inviteCode: invite.inviteCode,
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
