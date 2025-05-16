---
title: Semver.c ESP IDF Component
categories: Projects
tags: esp32 firmware
excerpt: Packaging libs For EspressIf IDF Components.
---

Packaging libs For EspressIf IDF Components.

While working with EspressIf IDF, I encountered a situation where I couldn't find the semver component I needed. To overcome this hurdle, I took the existing [semver.c](https://github.com/h2non/semver.c) and wrapped it specifically for EspressIf IDF components.

The solution was quite straightforward: I added the source project as a git submodule and included a manifest file called `idf_component.yml`. However, when I attempted to publish the component `compote component upload`, I encountered an error message stating:

> ERROR: Failed to get API Token from the config file

Turns out, the [EspressIf IDF Components Registry](https://components.espressif.com) we've been working with is a **private** ecosystem ⚠️. More info here https://github.com/espressif/idf-component-manager/issues/4.

## Workaround - Simply Use GitHub Directly!

For example, add **semver** dependency to **idf_component.yml**:

```yml
dependencies:
  espressif/led_strip: "*"
  idf:
    version: ">=5"
  semver:
    path: .
    git: ssh://git@github.com/stan-kondrat/semver-esp-component.git
```

After thar reconfigure project:

```yml
idf.py reconfigure
```

## What's next

I have a plan to share the work I do at my day job by publishing it as EspressIf IDF components.

Stay tuned for more updates and exciting developments on my ESP32 journey. I am eagerly looking forward to sharing more exciting discoveries, overcoming challenges. Until then, happy hacking! 👩‍💻🚀
