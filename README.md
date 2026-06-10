# ip-info

A single-page, dark **IP geolocation dashboard**. It shows your public IP on
an interactive map with full location, network, and timezone details — and
lets you look up any other IPv4/IPv6 address. No build step, no framework,
no API key.

**Live demo:** https://dominikbubu.github.io/ip-info/

## Features

- **Interactive map** (Leaflet + dark CartoDB tiles) that flies to the IP's
  location with a marker.
- **Rich data** grouped into Location, Network, and Time panels: city,
  region, postal, country + flag, continent, coordinates, ASN, ISP, org,
  timezone, currency, and calling code.
- **Live local clock** for the looked-up location's timezone.
- **Look up any IP** inline — no page switching — or hit *My IP* to return
  to your own.
- **Resilient fetching**: a provider fallback chain ([ipwho.is](https://ipwho.is)
  → [ipapi.co](https://ipapi.co)) so a single outage or rate-limit doesn't
  break the app.
- One-click copy, loading skeletons, and graceful error toasts.
- Fully responsive and `prefers-reduced-motion` aware.

## Why no API key?

An earlier version shipped a hardcoded third-party API key in the client
bundle. That's a leaked credential anyone could scrape, so it was removed in
favor of keyless, CORS-friendly endpoints.

## Project structure

```
index.html        # the dashboard
css/main.css      # dark dashboard styling
js/providers.js   # keyless data layer + provider fallback + normalization
js/app.js         # UI controller: search, render, map, live clock
```

## Running locally

It's all static:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

The map tiles and Leaflet are loaded from a CDN, so an internet connection is
required at runtime.
