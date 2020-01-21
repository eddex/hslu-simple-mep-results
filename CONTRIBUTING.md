# Adding new features

We're open to new feature ideas. Please create an issue to describe your idea *before* you implement your idea so we can dicuss about it.

# Adding or changing modules

- Do not edit the files in `src/data/` by hand!
- All changes to the module files in `src/data/` have to be done in the `tools/parse_module_types.py` python script.
- Always run the script inside of the `tools/` folder. Otherwise the paths are not correct.
- To get started download the html file from
https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/einschreibung/modulbeschriebe/modulbeschriebe-studiengang-informatik/
and save it as 'tools/modulbeschriebe_i.html'.
- Install the required python libraries with `pip3 install -r requirements.txt`.
- Make your changes in the script and then run the script to update the files in `src/data/`.