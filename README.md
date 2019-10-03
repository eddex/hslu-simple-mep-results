# HSLU simple MEP results
A browser extension to simplify viewing your MEP results. Shows all modules and the most important data about them in a simple list. It also provides an overview about your overall progress.

Brought to you by [@Lextum](https://github.com/Lextum) and [@eddex](https://github.com/eddex)

![screenshot](screenshot.png)

## installation

### firefox

**Firefox Add-ons** (recommended)

Easy installation and automatic updates!

Install here: https://addons.mozilla.org/en-US/firefox/addon/hslu-simple-mep-results/

**Releases**

- Download the `.xpi` file from the [latest release](https://github.com/eddex/hslu-simple-mep-results/releases)
- Firefox should prompt you to install the extension, if not..
  - open Firefox and open the URL `about:addons`
  - press the gear-button and select *Install Add-on from File...*
  - select the downloaded `.xpi` file

**From  sources**
- clone / download this repo (and unzip it)
- open `about:debugging`
- on the Add-ons tab click `<Load Temporary Add-on..>`
- select any file in the downloaded folder
- open https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-anmeldungen/

### chrome

**Releases**

Chrome does not support third party extensions anymore. Maybe we'll publish the extension in the official store at some point in the future. In the mean time, you can use the add-on in developer mode (from sources).

**From sources**

- clone / download this repo (and unzip it)
- open `chrome://extensions/`
- enable developer mode
- click `<Load unpacked>`
- select the downloaded folder of this repo
- open https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-anmeldungen/

## create a new release

1. add the following to a `.zip` file:
  - `data/` directory
  - `icons/` directory
  - `templates/` directory
  - `LICENSE` file
  - `main.js` file
  - `manifest.json` file
2. login to https://addons.mozilla.org/en-US/developers/
  - HSLU simple MEP results > Edit product page > Upload new version
  - Download the generated `.xpi` file
3. Create a new release in this repo and upload the `.xpi` file
