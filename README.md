<p align="center">
    <a href="https://github.com/eddex/hslu-simple-mep-results/blob/master/LICENSE" alt="License">
      <img src="https://img.shields.io/github/license/eddex/hslu-simple-mep-results">
    </a>
    <a href="https://github.com/eddex/hslu-simple-mep-results/releases" alt="Release">
      <img src="https://img.shields.io/github/v/release/eddex/hslu-simple-mep-results">
    </a>
    <a href="https://github.com/eddex/hslu-simple-mep-results/releases" alt="TotalDownloads">
      <img src="https://img.shields.io/github/downloads/eddex/hslu-simple-mep-results/total">
    </a>
    <a href="https://github.com/eddex/hslu-simple-mep-results/releases" alt="LatestReleaseDownloads">
      <img src="https://img.shields.io/github/downloads/eddex/hslu-simple-mep-results/latest/total">
    </a>
</p>

# HSLU simple MEP results
This browser add-on extends the page ['Meine Andmeldungen'](https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-anmeldungen/) on the HSLU MyCampus website.

Brought to you by [@Lextum](https://github.com/Lextum) and [@eddex](https://github.com/eddex)

Want to add some missing modules, fix a bug or add a new, awesome feature? That's great. But please read [CONTRIBUTING.md](CONTRIBUTING.md) first!

## Features

![screenshot](screenshot.png)

The browser add-on extends the page with the following features:
- A simple table with all your modules, credits and grades
- An overview of how many modules of each type have been done / are still needed.
- An overview of your grades including grade distribution and average.
- A chart to visualize your credit progress.

## Installation

You only have to install the extension once. After this you'll get automatic updates!

### Firefox

**Releases** (recommended)

- Download the `.xpi` file from the [latest release](https://github.com/eddex/hslu-simple-mep-results/releases)
- Firefox should prompt you to install the extension, if not..
  - Open Firefox and open the URL `about:addons`
  - Press the gear-button and select *Install Add-on from File...*
  - Select the downloaded `.xpi` file

**From  sources**
- Clone / download this repo (and unzip it)
- Open `about:debugging`
- On the Add-ons tab click `<Load Temporary Add-on..>`
- Select any file in the downloaded folder
- Open https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-anmeldungen/

### Chrome

**Releases**

Chrome does not support third party extensions anymore. Maybe we'll publish the extension in the official store at some point in the future. In the mean time, you can use the add-on in developer mode (from sources).

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
2. Add everthing from `src` to a `.zip` file:
  - `data/` directory
  - `icons/` directory
  - `lib/` directory
  - `templates/` directory
  - `LICENSE` file
  - `main.js` file
  - `manifest.json` file
3. Login to https://addons.mozilla.org/en-US/developers/
  - HSLU simple MEP results > Edit product page > Upload new version.
  - Download the generated `.xpi` file.
  - Change the end of the filename form `-fx.xpi` to `-firefox.xpi`.
4. Update `updates.json` with the new release.
  - To get the `update_hash` generate the sha256 hash of the file.
  - e.g. `Get-FileHash hslu_simple_mep_results-2.0.8-firefox.xpi` in PowerShell.
5. Push your changes!
6. Create a new release in this repo and attach the `.xpi` file.
