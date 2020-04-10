<p align="center">
    <a href="https://github.com/eddex/hslu-simple-mep-results/blob/master/LICENSE" alt="License">
      <img src="https://img.shields.io/github/license/eddex/hslu-simple-mep-results">
    </a>
  <a href="https://github.com/eddex/hslu-simple-mep-results/releases" alt="GithubTotalDownloads">
    <img src="https://img.shields.io/github/downloads/eddex/hslu-simple-mep-results/total?label=github%20downloads">
    </a>
  <a href="https://github.com/eddex/hslu-simple-mep-results/releases" alt="GithubLatestReleaseDownloads">
    <img src="https://img.shields.io/github/downloads/eddex/hslu-simple-mep-results/latest/total?label=firefox%20downloads@latest">
    </a>
  <a href="https://chrome.google.com/webstore/detail/hslu-simple-mep-results/bkcgbpgefenaapagldnnabfakilmfihp?authuser=0&hl=de" alt="ChromeActiveUsers">
    <img src="https://img.shields.io/chrome-web-store/users/bkcgbpgefenaapagldnnabfakilmfihp?label=chrome%20users">
  </a>
</p>
<p align="center">
  <a href="https://github.com/eddex/hslu-simple-mep-results/releases" alt="FirefoxVersion">
    <img src="https://img.shields.io/github/v/release/eddex/hslu-simple-mep-results?label=firefox%20version">
  </a>
  <a href="https://chrome.google.com/webstore/detail/hslu-simple-mep-results/bkcgbpgefenaapagldnnabfakilmfihp?authuser=0&hl=de" alt="FirefoxVersion">
    <img src="https://img.shields.io/chrome-web-store/v/bkcgbpgefenaapagldnnabfakilmfihp?label=chrome%20version">
    </a>
</p>

# HSLU simple MEP results
This browser add-on extends the page ['Meine Anmeldungen'](https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-anmeldungen/) on the HSLU MyCampus website.

# Contributors

This project is maintained by [@Lextum](https://github.com/Lextum) and [@eddex](https://github.com/eddex).

<a href="https://github.com/Lextum">
  <img src="https://avatars1.githubusercontent.com/u/5988613?s=40&v=4" />
</a>
<a href="https://github.com/eddex">
  <img src="https://avatars2.githubusercontent.com/u/5302085?s=40&v=4" />
</a>

Thanks to everyone who contributed to this project in the form of code or reporting issues!

<a href="https://github.com/dev-jan">
  <img src="https://avatars3.githubusercontent.com/u/5829661?s=40&v=4" />
</a>
<a href="https://github.com/fliiiix">
  <img src="https://avatars1.githubusercontent.com/u/1682954?s=40&v=4" />
</a>
<a href="https://github.com/timofurrer">
  <img src="https://avatars2.githubusercontent.com/u/1008252?s=40&v=4" />
</a>
<a href="https://github.com/Elmeche">
  <img src="https://avatars0.githubusercontent.com/u/49430274?s=40&v=4" height="40px" />
</a>
<a href="https://github.com/janedoekills">
  <img src="https://avatars0.githubusercontent.com/u/39761062?s=40&v=4" />
</a>
<a href="https://github.com/florianbaer">
  <img src="https://avatars0.githubusercontent.com/u/3041156?s=44&v=4" />
</a>
<a href="https://github.com/nerrehmit">
  <img src="https://avatars2.githubusercontent.com/u/15264624?s=40&v=4" />
</a>
<a href="https://github.com/retostadelmann">
  <img src="https://avatars3.githubusercontent.com/u/10433328?s=40&v=4" />
</a>
<a href="https://github.com/vigi86">
  <img src="https://avatars2.githubusercontent.com/u/8401847?s=40&v=4" />
</a>
<a href="https://github.com/TheHuebschi">
  <img src="https://avatars2.githubusercontent.com/u/33907022?s=40&v=4" />
</a>
<a href="https://github.com/wullli">
  <img src="https://avatars3.githubusercontent.com/u/29056346?s=40&v=4" />
</a>

Want to add some missing modules, fix a bug or add a new, awesome feature? That's great. But please read [CONTRIBUTING.md](CONTRIBUTING.md) first!

# Features

![screenshot](screenshot.png)

The browser add-on extends the page with the following features:
- A simple table with all your modules, credits and grades
- An overview of how many modules of each type have been done / are still needed.
- An overview of your grades including grade distribution and average.
- A chart to visualize your credit progress.

# Installation

You only have to install the extension once. After this you'll get automatic updates!

## Firefox

**Releases** (recommended)

- Download the `.xpi` file from the [latest release](https://github.com/eddex/hslu-simple-mep-results/releases)
- Firefox should prompt you to install the extension, if not..
  - Open Firefox and open the URL `about:addons`
  - Press the gear-button and select *Install Add-on from File...*
  - Select the downloaded `.xpi` file

**From sources**
- Clone / download this repo (and unzip it)
- Open `about:debugging`
- On the Add-ons tab click `<Load Temporary Add-on..>`
- Select any file in the downloaded folder
- Open https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-anmeldungen/

## Chrome

**Releases** (recommended)
- Install the extension from the [chrome web store
](https://chrome.google.com/webstore/detail/hslu-simple-mep-results/bkcgbpgefenaapagldnnabfakilmfihp)

Google might remove the extension from the store again, so stay tuned.

**From sources**

- Clone / download this repo (and unzip it)
- Open `chrome://extensions/`
- Enable developer mode
- Click `<Load unpacked>`
- Select the downloaded folder of this repo
- Open https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-anmeldungen/

# Development

## Create a new release

1. Update the version number in `src/manifest.json`.
2. Add everything from `src/` to a `.zip` file:
  - `_locales/` directory
  - `components/` directory
  - `data/` directory
  - `icons/` directory
  - `lib/` directory
  - `popup/` directory
  - `templates/` directory
  - `LICENSE` file
  - `main.js` file
  - `manifest.json` file
3. Update Firefox Release
  - Login to https://addons.mozilla.org/en-US/developers/
  - HSLU simple MEP results > Edit product page > Upload new version.
  - Download the generated `.xpi` file.
  - Change the end of the filename form `-fx.xpi` to `-firefox.xpi`.
  - Update `updates.json` with the new release.
    - To get the `update_hash` generate the sha256 hash of the file.
    - e.g. `Get-FileHash hslu_simple_mep_results-2.0.8-firefox.xpi` in PowerShell.
  - Create a branch (e.g. `release/2.0.15`), push your changes and create a pull request.
4. Update Chrome Release
- Login to https://chrome.google.com/webstore/devconsole
- Items > HSLU simple MEP results > Package > Upload new package
- Update anything that's need updating
- Save the changes and klick publish
5. AFTER(!) the pull request is merged, create a new release in this repo and attach the `.xpi` file.