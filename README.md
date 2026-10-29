# Jeremy Anderson’s portfolio

A responsive, static portfolio built with HTML, CSS, and vanilla JavaScript. No build step or package installation is required. Game artwork and fonts are served locally; YouTube players load only when requested.

## Local preview

From this directory, run:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:4173). Project contributions and all experience entries are visible without JavaScript and in print. JavaScript adds the mobile menu, navigation highlighting, and video dialog, with direct YouTube links as the fallback.

## Deploy

The existing host is [jeremyrobertanderson.com](https://jeremyrobertanderson.com/). Deployment requires SSH/SCP access as `jbluepolarbear`.

```powershell
# Review the destination without uploading anything.
.\deploy.ps1 -WhatIf

# Upload and verify the website.
.\deploy.ps1
```

The script copies only `index.html`, `css/`, `src/`, `img/`, and `fonts/` into local staging. Each deployment uploads assets under a new `assets/<release-id>/` directory and rewrites the staged HTML to reference those paths. CSS-relative font paths remain inside the same release. Source files in the checkout stay suitable for local preview.

Before activation, the script sets directories to `755` and files to `644`, then verifies the HTTP status, content type, byte length, and SHA-256 hash of every asset and a pending homepage. A same-directory atomic rename activates that homepage only after verification passes. Failed transfers cannot overwrite the current homepage or its assets. If SSH disconnects during activation, the host can serve either complete release; verify the result before retrying.

Local staging is removed even on failure. Previous remote assets are retained for cached pages. Incomplete remote release directories or pending HTML can also remain after failures; they are never activated automatically. This script does not delete old releases.

The live site was returning **403 Forbidden** for CSS, JavaScript, and local images while the homepage returned 200. Directory traversal/read permissions are a likely cause; the deployment script repairs those permissions. If 403 responses persist, check the host’s access rules, file ownership, and `.htaccess` configuration.

`-SourceDir`, `-RemoteTarget`, `-RemoteDirectory`, and `-PublicUrl` can override the default checkout and destination. Nothing is uploaded by the local preview command.

Run the deployment regression checks with `.\tests\deploy.Tests.ps1`. They model remote files in memory and mock SSH, SCP, and HTTP, so they never contact the live host. They cover both legacy and versioned sites, partial transfers, permissions, HTTP errors, content types, truncation and same-size corruption, pending-page verification, activation failures, cached assets, safe destinations, and local staging cleanup.

## Content

The original portfolio is the copy baseline. Keep its professional introduction, factual project descriptions, contribution bullets, and full career history. A visual redesign does not authorize new slogans or personal claims. Owlchemy Labs uses **July 2024–Present** in both the project and Experience, as confirmed by Jeremy; project role titles otherwise retain their original wording.

## Assets

- Game screenshots are from the projects’ official sites and are used to illustrate Jeremy’s work.
- Mighty’s photo is the original portfolio image.
- Inter and Space Grotesk are licensed under the SIL Open Font License; their licenses are included in `fonts/`.
