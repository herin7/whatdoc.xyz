const axios = require('axios');

// You get these from your Cloudflare Dashboard
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

/**
 * Registers a user's custom domain with Cloudflare to generate an SSL cert.
 * Call this inside your handleSaveCustomDomain Express route.
 */
const provisionCustomDomainSSL = async (userCustomDomain) => {
    try {
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/custom_hostnames`,
            {
                hostname: userCustomDomain,
                ssl: {
                    method: "http",
                    type: "dv", // Domain Validated
                    settings: {
                        http2: "on",
                        min_tls_version: "1.2",
                        tls_1_3: "on"
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${CF_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`[SSL PROVISIONED] Success for ${userCustomDomain}`);
        return response.data;

    } catch (error) {
        console.error('[CLOUDFLARE ERROR]', error.response?.data || error.message);
        throw new Error('Failed to provision SSL certificate.');
    }
};

module.exports = { provisionCustomDomainSSL };
