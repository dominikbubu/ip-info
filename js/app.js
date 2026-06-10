// UI controller: wires the search, renders results, drives the Leaflet map
// and a live local clock for the looked-up location.

const els = {
    form: document.getElementById('search-form'),
    input: document.getElementById('ip-input'),
    meBtn: document.getElementById('me-btn'),
    badge: document.getElementById('ip-badge'),
    heroIp: document.getElementById('hero-ip'),
    heroFlag: document.getElementById('hero-flag'),
    heroPlace: document.getElementById('hero-place'),
    heroType: document.getElementById('hero-type'),
    heroSource: document.getElementById('hero-source'),
    copyIp: document.getElementById('copy-ip'),
    mapEmpty: document.getElementById('map-empty'),
    error: document.getElementById('error'),
};

let map, marker, clockTimer, current;

// --- Map --------------------------------------------------------------------
function initMap() {
    map = L.map('map', { zoomControl: true, attributionControl: false })
        .setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
    }).addTo(map);
}

function moveMap(lat, lon, label) {
    if (lat == null || lon == null) return;
    const pos = [lat, lon];
    map.flyTo(pos, 11, { duration: 0.8 });
    if (marker) {
        marker.setLatLng(pos);
    } else {
        marker = L.circleMarker(pos, {
            radius: 9, color: '#5b8cff', weight: 3,
            fillColor: '#5b8cff', fillOpacity: 0.35,
        }).addTo(map);
    }
    if (label) marker.bindPopup(label);
    els.mapEmpty.hidden = true;
}

// --- Live clock -------------------------------------------------------------
function startClock(timezone) {
    clearInterval(clockTimer);
    const target = document.getElementById('s-time');
    if (!timezone) { target.textContent = '—'; return; }

    const fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone, hour: '2-digit', minute: '2-digit',
        second: '2-digit', hour12: false,
    });
    const tick = () => {
        try { target.textContent = fmt.format(new Date()); }
        catch { target.textContent = '—'; clearInterval(clockTimer); }
    };
    tick();
    clockTimer = setInterval(tick, 1000);
}

// --- Render -----------------------------------------------------------------
function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = (value === 0 || value) ? value : '—';
}

function showError(message) {
    els.error.textContent = message;
    els.error.hidden = false;
    setTimeout(() => { els.error.hidden = true; }, 5000);
}

function setLoading(on) {
    els.heroIp.classList.toggle('skeleton', on);
    if (on) {
        els.heroIp.textContent = ' ';
        els.mapEmpty.hidden = false;
        els.mapEmpty.textContent = 'Locating…';
    }
}

function render(info, isSelf) {
    current = info;
    els.badge.textContent = isSelf ? 'Your IP' : 'Looked-up IP';

    els.heroIp.classList.remove('skeleton');
    els.heroIp.textContent = info.ip || '—';
    els.heroFlag.textContent = info.flag || '';
    els.heroPlace.textContent =
        [info.city, info.region, info.country].filter(Boolean).join(', ') || '—';
    els.heroType.textContent = info.type || '';
    els.heroType.hidden = !info.type;
    els.heroSource.textContent = info.source ? `via ${info.source}` : '';
    els.heroSource.hidden = !info.source;

    set('s-city', info.city);
    set('s-region', info.region);
    set('s-postal', info.postal);
    set('s-country', [info.flag, info.country].filter(Boolean).join(' '));
    set('s-continent', info.continent);
    set('s-coords', (info.latitude != null && info.longitude != null)
        ? `${(+info.latitude).toFixed(4)}, ${(+info.longitude).toFixed(4)}` : null);

    set('s-asn', info.asn ? `AS${String(info.asn).replace(/^AS/i, '')}` : null);
    set('s-isp', info.isp);
    set('s-org', info.org);

    set('s-tz', info.timezone);
    set('s-utc', info.utcOffset);
    set('s-currency', info.currency);
    set('s-calling', info.callingCode);
    startClock(info.timezone);

    moveMap(info.latitude, info.longitude,
        `${info.flag} ${[info.city, info.country].filter(Boolean).join(', ')}`);
}

// --- Flow -------------------------------------------------------------------
async function lookup(ip = '') {
    setLoading(true);
    try {
        const info = await lookupIp(ip);
        render(info, !ip.trim());
    } catch (err) {
        setLoading(false);
        els.heroIp.textContent = 'Lookup failed';
        showError(err.message || 'Could not look up that IP.');
    }
}

// --- Events -----------------------------------------------------------------
els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    lookup(els.input.value);
});

els.meBtn.addEventListener('click', () => {
    els.input.value = '';
    lookup('');
});

els.copyIp.addEventListener('click', async () => {
    if (!current || !current.ip) return;
    try {
        await navigator.clipboard.writeText(current.ip);
        const prev = els.copyIp.textContent;
        els.copyIp.textContent = 'Copied!';
        setTimeout(() => { els.copyIp.textContent = prev; }, 1200);
    } catch { /* clipboard blocked — ignore */ }
});

initMap();
lookup('');
