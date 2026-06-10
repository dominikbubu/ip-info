# ip-info

A tiny, dependency-free web app that shows your public IP address and
geolocation details — and lets you look up any other IP.

**Live demo:** https://dominikbubu.github.io/ip-info/

## Features

- **Your IP** — detects and displays your public IP, country, city,
  continent, currency, timezone, and ISP on load.
- **Look up an IP** — enter any IPv4/IPv6 address to inspect its
  geolocation and network details (ASN, ISP, org).
- One-click **copy** for IP addresses.
- Modern, responsive UI with loading, error, and retry states.
- No build step, no framework, no API key — just static files.

## How it works

Data comes from the free, keyless [ipwho.is](https://ipwho.is) API over
HTTPS. The previous version shipped a hardcoded third-party API key in the
client bundle; that has been removed in favor of a keyless endpoint.

## Project structure

```
index.html      # "Your IP" page
other-ip.html   # "Look up an IP" page
css/main.css    # styles
js/api.js       # shared fetch + DOM helpers
js/index.js     # "Your IP" page logic
js/other.js     # "Look up an IP" page logic
```

## Running locally

It's all static, so any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` also works, since the API
supports CORS.
