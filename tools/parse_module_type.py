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

    tree = html.parse('./modulbeschriebe_i.html')
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
                    module_name = str(etree.tostring(module))
                    if '(Angewandte)' in module_name:
                        # this is needed due to the module "(Angewandte) Mathematik 2 (MAT2) C12/C16"
                        module_name = module_name.split('(Angewandte)')[1]
                    module_id = module_name.split('(')[1].split(')')[0]
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
    modules_with_type['ISA_TML'] = zusatzmodul
    modules_with_type['BA_GEST'] = zusatzmodul
    

    # Other modules (that don't appear on the website)
    # Sometimes they just rename modules but the names don't change on 'Meine Anmeldungen'
    # --> Example: WEBTEC is now called WEBT
    modules_with_type['XML'] = erweiterungsmodul
    modules_with_type['BPRAXIS'] = erweiterungsmodul
    modules_with_type['ANRECHINDIVID'] = erweiterungsmodul
    modules_with_type['WEBTEC'] = erweiterungsmodul
    modules_with_type['MC'] = erweiterungsmodul
    modules_with_type['BSCI'] = '-'
    modules_with_type['EINFTA'] = '-'

    # ICS modules
    ics_modules_with_type['DB&S'] = kernmodul
    ics_modules_with_type['NETW1'] = kernmodul
    ics_modules_with_type['NETW2'] = kernmodul
    ics_modules_with_type['ADS'] = kernmodul
    ics_modules_with_type['INTROL'] = kernmodul
    ics_modules_with_type['SPTA'] = kernmodul
    ics_modules_with_type['SPREN1'] = kernmodul
    ics_modules_with_type['ISLAB_K'] = kernmodul
    ics_modules_with_type['ANLS'] = kernmodul
    ics_modules_with_type['SPTA'] = kernmodul
    ics_modules_with_type['CRS'] = erweiterungsmodul
    ics_modules_with_type['DSO'] = kernmodul
    ics_modules_with_type['PRIVACY1'] = kernmodul
    ics_modules_with_type['OSA'] = kernmodul
    ics_modules_with_type['ISM'] = kernmodul

    # Corrections for ICS Students
    ics_modules_with_type['ETHIK'] = kernmodul

    # ISA modules
    modules_with_type['RCCR'] = zusatzmodul  # Relax, Concentrate & Create
    modules_with_type['NA'] = zusatzmodul  # Blockwoche Nachhaltigkeit
    modules_with_type['ENICS1'] = zusatzmodul
    modules_with_type['ISA_TML'] = zusatzmodul
    modules_with_type['BA_GEST'] = zusatzmodul

    # fixes
    modules_with_type['STAT'] = kernmodul  # the website is not up to date


    for m in modules_with_type:
        print (m, modules_with_type[m])

    j = json.dumps(modules_with_type, indent=2, sort_keys=True)
    f = open('../src/data/modules_i.json', 'w')
    f.write(j)
    f.close()

    j = json.dumps(ics_modules_with_type, indent=2, sort_keys=True)
    f = open('../src/data/modules_ics.json', 'w')
    f.write(j)
    f.close()

    j = json.dumps(wi_modules_with_type, indent=2, sort_keys=True)
    f = open('../src/data/modules_wi.json', 'w')
    f.write(j)
    f.close()

def prequisitesCheck():
    f = Path('./modulbeschriebe_i.html')
    if not f.is_file():
        print('ERROR: file \'tools/modulbeschriebe_i.html\' does not exist.')
        print('To get started download the html file from \
https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/einschreibung/modulbeschriebe/modulbeschriebe-studiengang-informatik/ \
and save it as \'tools/modulbeschriebe_i.html\'.')
        return False
    return True



if __name__ == "__main__":
    if prequisitesCheck():
        parseWebsite()
