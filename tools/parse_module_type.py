'''
This script parses the content of the 'Module descriptions' page
to create a json file that is used by the browser extension to determine
the type of a module.

It is done in a seperate script to increase the performance of the extension.

For further information please read: https://github.com/eddex/hslu-simple-mep-results/blob/master/CONTRIBUTING.md
'''
from lxml import etree, html
import json
from pathlib import Path


def readFileAsJSON(fileName):
    file_read = open(fileName, 'r')
    json_modules = json.loads(file_read.read())
    file_read.close()
    return json_modules


def writeFile(fileName, content):
    file_write = open(fileName, 'w')
    file_write.write(content)
    file_write.close()


def mergeJSON(oldJSON, newJSON):
    oldJSON.update(newJSON)
    return json.dumps(oldJSON, indent=2, sort_keys=True)


def writeModuleFiles(fileName, modules):
    json_modules = readFileAsJSON(fileName)
    mergedModules = mergeJSON(json_modules, modules)
    writeFile(fileName, mergedModules)


def parseWebsite():

    # wahlkernmodulec12 ignored, just duplicates / obsolete modules
    module_type_html_ids = [
        'kernmodulestudienganginformatik',
        'projektmodulestudienganginformatik',
        'erweiterungsmodulestudienganginformatik',
        'majormoduleerweiterungsmodule',
        'zusatzmodulestudienganginformatik',
        'zusatzmodulestudienganginformatikangebotta',
        'kernmodule',
        'projektmodules',
        'projektmodule',
        'erweiterungsmodule',
        'zusatzmodule',
    ]

    kernmodul = 'Kernmodul'
    projektmodul = 'Projektmodul'
    erweiterungsmodul = 'Erweiterungsmodul'
    majormodul = 'Majormodul'
    zusatzmodul = 'Zusatzmodul'
    repetitoriummodul = 'Repetitorium'

    # parse module types from HTML
    id_to_type_mapping = {
        'kernmodulestudienganginformatik': kernmodul,
        'projektmodulestudienganginformatik': projektmodul,
        'erweiterungsmodulestudienganginformatik': erweiterungsmodul,
        'majormoduleerweiterungsmodule': majormodul,
        'zusatzmodulestudienganginformatik': zusatzmodul,
        'zusatzmodulestudienganginformatikangebotta': zusatzmodul,
        'kernmodule': kernmodul,
        'projektmodules':  projektmodul,
        'projektmodule': projektmodul,
        'erweiterungsmodule': erweiterungsmodul,
        'zusatzmodule': zusatzmodul
    }

    tree = html.parse('./modulbeschriebe_i.html')
    doc = html.fromstring(etree.tostring(tree))
    sections = doc.find_class(
        'download-content large-20 columns append-bottom')

    modules_with_type = {}
    ics_modules_with_type = {}
    wi_modules_with_type = {}

    for section in sections:
        for module_type_html_id in module_type_html_ids:
            module_type_title = section.get_element_by_id(
                module_type_html_id, None)
            if module_type_title is not None:
                modules = section.find_class(
                    'columns col-collapse small-12 print-12 download-text')
                for module in modules:
                    module_name = str(etree.tostring(module))
                    if '(Angewandte)' in module_name:
                        # this is needed due to the module "(Angewandte) Mathematik 2 (MAT2) C12/C16"
                        module_name = module_name.split('(Angewandte)')[1]
                    # print(module_name)
                    module_id = module_name.split('(')[1].split(')')[0]
                    modules_with_type[module_id] = id_to_type_mapping[module_type_html_id]

    # parse wi modules
    tree = html.parse('./modulbeschriebe_wi.html')
    doc = html.fromstring(etree.tostring(tree))
    sections = doc.find_class(
        'download-content large-20 columns append-bottom')

    for section in sections:
        for module_type_html_id in module_type_html_ids:
            module_type_title = section.get_element_by_id(
                module_type_html_id, None)
            if module_type_title is not None:
                modules = section.find_class(
                    'columns col-collapse small-12 print-12 download-text')
                for module in modules:
                    module_name = str(etree.tostring(module))
                    if '(Angewandte)' in module_name:
                        # this is needed due to the module "(Angewandte) Mathematik 2 (MAT2) C12/C16"
                        module_name = module_name.split('(Angewandte)')[1]
                    if '(' in module_name:
                        module_id = module_name.split('(')[1].split(')')[0]
                        # print(module_id)
                        wi_modules_with_type[module_id] = id_to_type_mapping[module_type_html_id]

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
    modules_with_type['MAREP'] = repetitoriummodul

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
    modules_with_type['PRG'] = kernmodul

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
    ics_modules_with_type['SPREN2'] = kernmodul
    ics_modules_with_type['KRYPTO'] = kernmodul
    ics_modules_with_type['NETDA'] = kernmodul

    # fixes for ICS modules
    ics_modules_with_type['ETHIK'] = kernmodul
    ics_modules_with_type['WEBTEC'] = kernmodul
    ics_modules_with_type['SPRG'] = kernmodul

    # fixes for WI modules
    wi_modules_with_type['ENWC'] = erweiterungsmodul

    # ISA modules
    modules_with_type['RCCR'] = zusatzmodul  # Relax, Concentrate & Create
    modules_with_type['NA'] = zusatzmodul  # Blockwoche Nachhaltigkeit
    modules_with_type['ENICS1'] = zusatzmodul
    modules_with_type['TML'] = zusatzmodul 
    modules_with_type['GEST'] = zusatzmodul # Blockwoche Bildnerisches Gestalten

    # fixes
    modules_with_type['STAT'] = kernmodul  # the website is not up to date

    filepath_i_modules = '../src/data/modules_i.json'
    filepath_ics_modules = '../src/data/modules_ics.json'
    filepath_wi_modules = '../src/data/modules_wi.json'

    writeModuleFiles(filepath_i_modules, modules_with_type)
    writeModuleFiles(filepath_ics_modules, ics_modules_with_type)
    writeModuleFiles(filepath_wi_modules, wi_modules_with_type)


def prequisitesCheck():
    f = Path('./modulbeschriebe_i.html')
    if not f.is_file():
        print('ERROR: file \'./modulbeschriebe_i.html\' does not exist.')
        print('To get started download the html file from \
https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/einschreibung/modulbeschriebe/modulbeschriebe-studiengang-informatik/ \
and save it as \'tools/modulbeschriebe_i.html\'.')
        return False

    f = Path('./modulbeschriebe_wi.html')
    if not f.is_file():
        print('ERROR: file \'./modulbeschriebe_wi.html\' does not exist.')
        print('To get started download the html file from \
https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/einschreibung/modulbeschriebe/modulbeschriebe-wirtschaftsinformatik-neues-curriculum/ \
and save it as \'tools/modulbeschriebe_wi.html\'.')
        return False
    return True


if __name__ == "__main__":
    if prequisitesCheck():
        parseWebsite()
