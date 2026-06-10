// Data layer: fetch IP geolocation from keyless providers with a fallback
// chain, normalizing every response into one shared shape. No API keys.

const CONTINENTS = {
    AF: 'Africa', AN: 'Antarctica', AS: 'Asia', EU: 'Europe',
    NA: 'North America', OC: 'Oceania', SA: 'South America',
};

/** Turn a 2-letter ISO country code into a flag emoji. */
function flagEmoji(code) {
    if (!code || code.length !== 2) return '';
    return code.toUpperCase().replace(/./g, (c) =>
        String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));
}

async function getJSON(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// --- Provider: ipwho.is -----------------------------------------------------
async function fromIpwhois(ip) {
    const data = await getJSON(`https://ipwho.is/${encodeURIComponent(ip)}`);
    if (data.success === false) throw new Error(data.message || 'Lookup failed');
    return {
        ip: data.ip,
        type: data.type,
        countryCode: data.country_code,
        flag: flagEmoji(data.country_code),
        country: data.country,
        region: data.region,
        city: data.city,
        postal: data.postal,
        continent: data.continent,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone && data.timezone.id,
        utcOffset: data.timezone && data.timezone.utc,
        currency: data.currency &&
            [data.currency.code, data.currency.symbol].filter(Boolean).join(' '),
        callingCode: data.calling_code && `+${data.calling_code}`,
        asn: data.connection && data.connection.asn,
        isp: data.connection && data.connection.isp,
        org: data.connection && data.connection.org,
        source: 'ipwho.is',
    };
}

// --- Provider: ipapi.co (fallback) ------------------------------------------
async function fromIpapi(ip) {
    const url = ip
        ? `https://ipapi.co/${encodeURIComponent(ip)}/json/`
        : 'https://ipapi.co/json/';
    const data = await getJSON(url);
    if (data.error) throw new Error(data.reason || 'Lookup failed');
    return {
        ip: data.ip,
        type: (data.ip || '').includes(':') ? 'IPv6' : 'IPv4',
        countryCode: data.country_code,
        flag: flagEmoji(data.country_code),
        country: data.country_name,
        region: data.region,
        city: data.city,
        postal: data.postal,
        continent: CONTINENTS[data.continent_code] || '',
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        utcOffset: data.utc_offset,
        currency: data.currency,
        callingCode: data.country_calling_code,
        asn: data.asn,
        isp: data.org,
        org: data.org,
        source: 'ipapi.co',
    };
}

const PROVIDERS = [fromIpwhois, fromIpapi];

/**
 * Look up an IP (or your own when `ip` is empty), trying each provider in
 * turn so a single outage or rate-limit doesn't break the app.
 * @param {string} [ip]
 * @returns {Promise<object>} normalized info
 */
async function lookupIp(ip = '') {
    const errors = [];
    for (const provider of PROVIDERS) {
        try {
            return await provider(ip.trim());
        } catch (err) {
            errors.push(`${err.message}`);
        }
    }
    throw new Error(`All providers failed (${errors.join('; ')})`);
}
