---
title: "GeoIP SQLite: download once, bundle freely, query offline"
categories: Projects
tags: bash
excerpt: "A pre-built SQLite IP-to-country database, auto-updated from IPverse via GitHub Actions. CC0 licensed - bundle it in your app, ship it anywhere, no attribution required."
---

Most GeoIP solutions either require an API call, a paid subscription, or come with licensing strings attached. This one doesn't.

[**geoip-sqlite-ipverse**](https://github.com/stan-kondrat/geoip-sqlite-ipverse) is a pre-built SQLite database of IP-to-country mappings. It's **CC0 licensed** - you can bundle it in your app, ship it to customers, redistribute it, whatever. No attribution, no license notices, no claims.

---

## Just download it

```sh
curl -L -O https://github.com/stan-kondrat/geoip-sqlite-ipverse/releases/latest/download/ip_to_country.db

export IP=8.8.8.8 && sqlite3 ip_to_country.db "SELECT country_code FROM ip_blocks_v4 WHERE $(python3 -c "import ipaddress,os; print(int(ipaddress.ip_address(os.environ['IP'])))" ) BETWEEN ip_start AND ip_end LIMIT 1;"

# → 'US'
```

That's a ready-to-query SQLite file. Drop it in your project.

---

## Query it

**IPv4:**

```sql
-- 8.8.8.8 = 134744072
SELECT country_code FROM ip_blocks_v4
WHERE 134744072 BETWEEN ip_start AND ip_end
LIMIT 1;
-- → US
```

**IPv6:**

```sql
SELECT country_code FROM ip_blocks_v6
WHERE '20014860486000000000000000008888' BETWEEN ip_start AND ip_end
LIMIT 1;
-- → US
```

Converting an address to the right key:

```python
import ipaddress

# IPv4 → integer
int(ipaddress.ip_address("8.8.8.8"))  # → 134744072

# IPv6 → zero-padded 32-char hex
f"{int(ipaddress.ip_address('2001:4860:4860::8888')):032x}"
# → '20014860486000000000000000008888'
```

---

## How it stays fresh

A GitHub Actions workflow polls [IPverse/country-ip-blocks](https://github.com/ipverse/country-ip-blocks). When a new release is detected, it downloads the CSV files, rebuilds the SQLite database, and commits the updated `ip_to_country.db` back to the repo. The latest build is always available at the releases URL above.

No infrastructure to run, no webhooks - just a cron job watching upstream.

---

No API keys. No rate limits. No licensing headaches. Just a file.
