// "Look up an IP" page — fetches details for a user-supplied address.

const form = document.getElementById('search-form');
const input = document.getElementById('other-input-ip');
const statusEl = document.getElementById('status');
const detailsEl = document.getElementById('details');

function showStatus(message, isError = false) {
    detailsEl.hidden = true;
    statusEl.hidden = false;
    statusEl.classList.toggle('status--error', isError);
    if (isError) {
        statusEl.textContent = message;
    } else {
        statusEl.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>${message}</span>`;
    }
}

function render(info) {
    setText('other-ip', info.ip);
    setText('other-flag', info.flag);
    setText('other-country', info.country);
    setText('other-city', info.city);
    setText('other-continent', info.continent);
    setText('other-currency', info.currency);
    setText('other-timezone', info.timezone);
    setText('other-asn', info.asn);
    setText('other-isp', info.isp);
    setText('other-org', info.org);

    statusEl.hidden = true;
    detailsEl.hidden = false;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ip = input.value.trim();
    if (!ip) {
        showStatus('Please enter an IP address.', true);
        return;
    }

    showStatus('Looking up…');
    try {
        const info = await fetchIpInfo(ip);
        render(info);
    } catch (err) {
        showStatus(err.message || 'Could not look up that IP.', true);
    }
});

wireCopyButton('copy-ip', 'other-ip');
