# Adding new features

We're open to new feature ideas. Please create an issue to describe your idea *before* you implement your idea so we can dicuss about it.

# Creating a new release

Only the maintainers of this repository allowed to change the version number
and create a new release. Please don't do this yourself.

# Adding or changing modules

- Do not edit the files in `src/data/` by hand!
- All changes to the module files in `src/data/` have to be done in the `tools/parse_module_types.py` python script.
- Always run the script inside of the `tools/` folder. Otherwise the paths are not correct.
- To get started download the html files from
  - [here](https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/bachelor-artificial-intelligence-machine-learning/) and save it as `tools/modulbeschriebe_ai.html`
  - [here](https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/modulbeschriebe-studiengang-informatik/) and save it as `tools/modulbeschriebe_i.html`
  - [here](https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/modulbeschriebe-wirtschaftsinformatik-neues-curriculum/) and save it as `tools/modulbeschriebe_wi.html`.
  - [here](https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/bachelor-in-information-and-cyber-security/) and save it as `tools/modulbeschriebe_ics.html`

- Install the required python libraries with `pip3 install -r requirements.txt`.
- Make your changes in the script and then run the script to update the files in `src/data/`.
  - add missing modules like this (they apply to all studies):
  ```python
  modules_with_type['MAREP'] = repetitoriummodul
  ```
  - add fixes for ICS and WI modules like this
  ```python
  # fixes for WI modules
  wi_modules_with_type['ENWC'] = erweiterungsmodul

  #fixes for ics modules
  ics_modules_with_type['db&s'] = kernmodul
  ```

  Note: Since ICS modules are not categorized on the page, one has to do it
  manually :see_no_evil:. The `./tools/parse_module_type.py` script will add a
  placeholder text (`manually tag in parser`) in the `src/data/modules_ics.json`
  file, to easily spot the ones which are missing.
