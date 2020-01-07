'''
This script parses the content of the 'Module descriptions' page
to create a json file that is used by the browser extension to determine
the type of a module.

It is done in a seperate script to increase the performance of the extension.

To get started download the html file from
https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/einschreibung/modulbeschriebe/modulbeschriebe-studiengang-informatik/
and save it as 'tools/modulbeschriebe_i.html'.

The lxml.html.parse method would also be able to parse a website by url,
but for this we would need to figure out how to login to mycampus by API call.
'''
from lxml import etree, html
import json
from pathlib import Path

def parseWebsite():

    # wahlkernmodulec12 ignored, just duplicates / obsolete modules
    module_type_html_ids = [
        'kernmodulestudienganginformatik',
        'projektmodulestudienganginformatik',
        'erweiterungsmodulestudienganginformatik',
        'majormoduleerweiterungsmodule',
        'zusatzmodulestudienganginformatik',
        'zusatzmodulestudienganginformatikangebotta'
    ]

    kernmodul = 'Kernmodul'
    projektmodul = 'Projektmodul'
    erweiterungsmodul = 'Erweiterungsmodul'
    majormodul = 'Majormodul'
    zusatzmodul = 'Zusatzmodul'

    # parse module types from HTML
    id_to_type_mapping = {
        'kernmodulestudienganginformatik': kernmodul,
        'projektmodulestudienganginformatik': projektmodul,
        'erweiterungsmodulestudienganginformatik': erweiterungsmodul,
        'majormoduleerweiterungsmodule': majormodul,
        'zusatzmodulestudienganginformatik': zusatzmodul,
        'zusatzmodulestudienganginformatikangebotta': zusatzmodul
    }

    tree = html.parse('tools/modulbeschriebe_i.html')
    doc = html.fromstring(etree.tostring(tree))
    sections = doc.find_class('download-content large-20 columns append-bottom')

    modules_with_type = {}
    ics_modules_with_type = {}
    wi_modules_with_type = {}

    for section in sections:
        for module_type_html_id in module_type_html_ids:
            module_type_title = section.get_element_by_id(module_type_html_id, None)
            if module_type_title is not None:
                #print(id_to_type_mapping[module_type_html_id])
                modules = section.find_class('columns col-collapse small-12 print-12 download-text')
                for module in modules:
                    module_id = str(etree.tostring(module)).split('(')[1].split(')')[0]
                    #print(module_id)
                    modules_with_type[module_id] = id_to_type_mapping[module_type_html_id]

    # block-weeks are of different types. have to be hardcoded.
    modules_with_type['IOTHACK'] = erweiterungsmodul
    modules_with_type['IAVR'] = majormodul
    modules_with_type['MTOP'] = erweiterungsmodul
    modules_with_type['GDF'] = zusatzmodul
    modules_with_type['OEK'] = zusatzmodul
    modules_with_type['OEK_PWG'] = zusatzmodul
    modules_with_type['ME+TE'] = zusatzmodul
    modules_with_type['WEBLAB'] = majormodul
    modules_with_type['KOHEB'] = zusatzmodul

    # Other modules (that don't appear on the website)
    modules_with_type['XML'] = erweiterungsmodul
    modules_with_type['BPRAXIS'] = erweiterungsmodul
    modules_with_type['ANRECHINDIVID'] = erweiterungsmodul  # most likely..

    # ICS modules
    modules_with_type['DB&S'] = kernmodul
    modules_with_type['NETW1'] = kernmodul
    modules_with_type['NETW2'] = kernmodul
    modules_with_type['ADS'] = kernmodul
    modules_with_type['INTROL'] = kernmodul
    modules_with_type['SPTA'] = kernmodul
    modules_with_type['SPREN1'] = kernmodul
    modules_with_type['ISLAB_K'] = kernmodul
    modules_with_type['ANLS'] = kernmodul
    modules_with_type['SPTA'] = kernmodul
    modules_with_type['CRS'] = erweiterungsmodul
    modules_with_type['DSO'] = kernmodul
    modules_with_type['PRIVACY1'] = kernmodul
    modules_with_type['OSA'] = kernmodul
    modules_with_type['ISM'] = kernmodul

    # Corrections for ICS Students
    ics_modules_with_type['ETHIK'] = kernmodul

    # ISA modules
    modules_with_type['RCCR'] = zusatzmodul  # Relax, Concentrate & Create
    modules_with_type['NA'] = zusatzmodul  # Blockwoche Nachhaltigkeit
    modules_with_type['ENICS1'] = zusatzmodul

    # fixes
    modules_with_type['STAT'] = kernmodul  # the website is not up to date


    for m in modules_with_type:
        print (m, modules_with_type[m])

    j = json.dumps(modules_with_type, sort_keys=True)
    f = open('data/modules_i.json', 'w')
    f.write(j)
    f.close()

    j = json.dumps(ics_modules_with_type, sort_keys=True)
    f = open('data/modules_ics.json', 'w')
    f.write(j)
    f.close()

    j = json.dumps(wi_modules_with_type, sort_keys=True)
    f = open('data/modules_wi.json', 'w')
    f.write(j)
    f.close()

def prequisitesCheck():
    f = Path('tools/modulbeschriebe_i.html')
    if not f.is_file():
        print('ERROR: file \'tools/modulbeschriebe_i.html\' does not exist')
        print('To get started download the html file from \
https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/einschreibung/modulbeschriebe/modulbeschriebe-studiengang-informatik/ \
and save it as \'tools/modulbeschriebe_i.html\'.')
        return False
    return True



if __name__ == "__main__":
    if prequisitesCheck():
        parseWebsite()