// "Your IP" page — detects and displays the visitor's own public IP.

const statusEl = document.getElementById('status');
const detailsEl = document.getElementById('details');
const retryEl = document.getElementById('retry');
const cardEl = document.getElementById('your-ip');

function showLoading() {
    detailsEl.hidden = true;
    retryEl.hidden = true;
    statusEl.hidden = false;
    statusEl.classList.remove('status--error');
    statusEl.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Detecting your IP…</span>';
    cardEl.setAttribute('aria-busy', 'true');
}

function showError(message) {
    statusEl.hidden = false;
    statusEl.classList.add('status--error');
    statusEl.textContent = message;
    retryEl.hidden = false;
    cardEl.setAttribute('aria-busy', 'false');
}

function render(info) {
    setText('ip', info.ip);
    setText('flag', info.flag);
    setText('country', info.country);
    setText('city', info.city);
    setText('continent', info.continent);
    setText('currency', info.currency);
    setText('timezone', info.timezone);
    setText('isp', info.isp);

    statusEl.hidden = true;
    detailsEl.hidden = false;
    cardEl.setAttribute('aria-busy', 'false');
}

async function load() {
    showLoading();
    try {
        const info = await fetchIpInfo();
        render(info);
    } catch (err) {
        showError(err.message || 'Something went wrong. Please try again.');
    }
}

retryEl.addEventListener('click', load);
wireCopyButton('copy-ip', 'ip');
window.addEventListener('load', load);
