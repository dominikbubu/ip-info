// Shared helpers for talking to the keyless ipwho.is API.
// No API key required — safe to ship to the browser.

const API_BASE = 'https://ipwho.is';

/**
 * Fetch IP details. Pass an IP string to look one up, or nothing for
 * the caller's own public IP.
 * @param {string} [ip]
 * @returns {Promise<object>} normalized fields used by the UI
 */
async function fetchIpInfo(ip = '') {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(ip)}`);
    if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
    }

    const data = await res.json();
    // ipwho.is returns { success: false, message } for invalid input.
    if (data.success === false) {
        throw new Error(data.message || 'Could not look up that IP.');
    }

    return {
        ip: data.ip,
        flag: data.flag && data.flag.emoji,
        country: data.country,
        city: data.city,
        continent: data.continent,
        currency: data.currency && data.currency.code,
        timezone: data.timezone && data.timezone.id,
        asn: data.connection && data.connection.asn,
        isp: data.connection && data.connection.isp,
        org: data.connection && data.connection.org,
    };
}

/** Write a value into an element by id, with a graceful fallback. */
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '—';
}

/** Wire a copy-to-clipboard button to a source element. */
function wireCopyButton(buttonId, sourceId) {
    const btn = document.getElementById(buttonId);
    const source = document.getElementById(sourceId);
    if (!btn || !source) return;

    btn.addEventListener('click', async () => {
        const text = source.textContent.trim();
        if (!text || text === '—') return;
        try {
            await navigator.clipboard.writeText(text);
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 1200);
        } catch {
            /* clipboard unavailable — ignore */
        }
    });
}
