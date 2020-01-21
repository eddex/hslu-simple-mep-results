# HSLU simple MEP results
A browser extension to simplify viewing your MEP results. Shows all modules and the most important data about them in a simple list. It also provides an overview about your overall progress.

Brought to you by [@Lextum](https://github.com/Lextum) and [@eddex](https://github.com/eddex)

Want to add some missing modules, fix a bug or add a new, awesome feature? That's great. But please read [CONTRIBUTING.md](CONTRIBUTING.md) first!

![screenshot](screenshot.png)

## Installation

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

1. add the following to a `.zip` file:
  - `data/` directory
  - `icons/` directory
  - `components/` directory
  - `LICENSE` file
  - `main.js` file
  - `manifest.json` file
2. login to https://addons.mozilla.org/en-US/developers/
  - HSLU simple MEP results > Edit product page > Upload new version
  - Download the generated `.xpi` file
3. Create a new release in this repo and upload the `.xpi` file
