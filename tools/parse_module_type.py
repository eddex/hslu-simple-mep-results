'''
This script parses the content of the 'Module descriptions' page
to create a json file that is used by the browser extension to determine
the type of a module.

It is done in a seperate script to increase the performance of the extension.

For further information please read: https://github.com/eddex/hslu-simple-mep-results/blob/master/CONTRIBUTING.md
'''
import json
from pathlib import Path

from lxml import etree, html


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

    modulbeschriebe_i = etree.tostring(html.parse('./modulbeschriebe_i.html'))
    modulbeschriebe_ics = etree.tostring(
        html.parse('./modulbeschriebe_ics.html'))
    modulbeschriebe_wi = etree.tostring(
        html.parse('./modulbeschriebe_wi.html'))
    modulbeschriebe_ai = etree.tostring(
        html.parse('./modulbeschriebe_ai.html'))

    doc = html.fromstring(modulbeschriebe_i)

    sections = doc.find_class(
        'download-content large-20 columns append-bottom')

    modules_with_type = {}
    ics_modules_with_type = {}
    wi_modules_with_type = {}
    ai_modules_with_type = {}

    for section in sections:
        for module_type_html_id in module_type_html_ids:
            module_type_title = section.get_element_by_id(
                module_type_html_id, None)

            if module_type_title is not None:
                modules = section.find_class(
                    'columns col-collapse small-12 print-12 download-text')
                for module in modules:
                    module_name = module.text
                    module_id = module_name.split('(')[1].split(')')[0]
                    print(module_name + ", ID: " + module_id)
                    modules_with_type[module_id] = id_to_type_mapping[module_type_html_id]

    # parse wi modules
    doc = html.fromstring(modulbeschriebe_wi)
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

    # parse ai modules
    doc = html.fromstring(modulbeschriebe_ai)
    sections = doc.find_class(
        'download-content large-20 columns append-bottom')

    for section in sections:
        for module_type_html_id in module_type_html_ids:
            module_type_title = section.get_element_by_id( module_type_html_id, None)
            if module_type_title is not None:
                modules = section.find_class(
                    'columns col-collapse small-12 print-12 download-text')
                for module in modules:
                    module_name = str(etree.tostring(module))
                    if '(' in module_name:
                        module_id = module_name.split('(')[1].split(')')[0]
                        # print(module_id)
                        ai_modules_with_type[module_id] = id_to_type_mapping[module_type_html_id]


    # Parse ics modules
    # ICS modules are not seperated on the page :(
    # Just add them to the list to categorize them manually
    module_type_placeholder = 'manually tag in parser'
    doc = html.fromstring(modulbeschriebe_ics)
    sections = doc.find_class(
        'download-content large-20 columns append-bottom')

    # ics only has "Modulbeschreibungen" --> no loop required for sections
    modules = sections[1].find_class(
        'columns col-collapse small-12 print-12 download-text')
    for module in modules:
        module_name = str(etree.tostring(module))
        try:
            module_id = module_name.rsplit('(',1)[1].rsplit(')')[0].replace('&amp;', '&')
        except:
            print("Something went wrong with extracting the module name: " + module_name)
            print("Please open a issue here: https://github.com/eddex/hslu-simple-mep-results/issues")

        if module_id not in modules_with_type:
            ics_modules_with_type[module_id] = module_type_placeholder


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
    modules_with_type['CG'] = majormodul

    modules_with_type['IPEUS'] = projektmodul
    modules_with_type['PIPE'] = projektmodul

    # ICS modules
    ics_modules_with_type['ADRM'] = kernmodul
    ics_modules_with_type['ADS'] = kernmodul
    ics_modules_with_type['ANLS'] = kernmodul
    ics_modules_with_type['CISO ISSUES'] = majormodul
    ics_modules_with_type['CRS'] = erweiterungsmodul
    ics_modules_with_type['DB&S'] = kernmodul
    ics_modules_with_type['DSO'] = kernmodul
    ics_modules_with_type['ENGPRA'] = zusatzmodul
    ics_modules_with_type['HOA'] = majormodul
    ics_modules_with_type['IAM'] = majormodul
    ics_modules_with_type['IL_LECT'] = erweiterungsmodul
    ics_modules_with_type['INTROL'] = kernmodul
    ics_modules_with_type['IRFORENSIC'] = erweiterungsmodul # as well as kernmodul
    ics_modules_with_type['IRSECPOL'] = erweiterungsmodul
    ics_modules_with_type['ISLAB_K'] = kernmodul
    ics_modules_with_type['ISM'] = kernmodul
    ics_modules_with_type['KRINF'] = majormodul
    ics_modules_with_type['KRINFLAB'] = majormodul
    ics_modules_with_type['KRYPTO'] = kernmodul
    ics_modules_with_type['NATCYSEC'] = kernmodul
    ics_modules_with_type['NETDA'] = kernmodul
    ics_modules_with_type['NETW1'] = kernmodul
    ics_modules_with_type['NETW2'] = kernmodul
    ics_modules_with_type['NETW3'] = erweiterungsmodul
    ics_modules_with_type['OSA'] = kernmodul
    ics_modules_with_type['OSSEC'] = majormodul
    ics_modules_with_type['PRIVACY'] = kernmodul
    ics_modules_with_type['PRIVACY1'] = kernmodul
    ics_modules_with_type['REVE1'] = majormodul
    ics_modules_with_type['REVE2'] = majormodul
    ics_modules_with_type['SECPROJ'] = projektmodul
    ics_modules_with_type['SGC'] = majormodul
    ics_modules_with_type['SIOT'] = majormodul
    ics_modules_with_type['SOC'] = majormodul
    ics_modules_with_type['SPREN1'] = projektmodul
    ics_modules_with_type['SPREN2'] = kernmodul
    ics_modules_with_type['SPTA'] = kernmodul
    ics_modules_with_type['SPTA'] = kernmodul
    ics_modules_with_type['SQAS'] = erweiterungsmodul
    ics_modules_with_type['STA1'] = kernmodul
    ics_modules_with_type['ABIZ'] = erweiterungsmodul
    ics_modules_with_type['SYSSEC'] = erweiterungsmodul
    ics_modules_with_type['CCNA'] = erweiterungsmodul
    ics_modules_with_type['CLOUDSEC'] = kernmodul
    ics_modules_with_type['HTCLAW'] = majormodul
    ics_modules_with_type['IIP1'] = projektmodul
    ics_modules_with_type['IOT'] = majormodul
    ics_modules_with_type['IPREN1'] = projektmodul
    ics_modules_with_type['IPREN2'] = projektmodul
    ics_modules_with_type['KRKO'] = erweiterungsmodul
    ics_modules_with_type['KRYPTOB'] = majormodul
    ics_modules_with_type['PROG'] = erweiterungsmodul
    ics_modules_with_type['ADPENTEST'] = majormodul
    ics_modules_with_type['ASACPH'] = zusatzmodul
    ics_modules_with_type['CYBER2'] = majormodul
    ics_modules_with_type['FORDIN'] = majormodul
    ics_modules_with_type['ITAU'] = erweiterungsmodul
    ics_modules_with_type['MALWLAB'] = majormodul
    ics_modules_with_type['PYTHON'] = erweiterungsmodul
    ics_modules_with_type['SYSECO'] = kernmodul
    ics_modules_with_type['UKOM'] = erweiterungsmodul

    # fixes for ICS modules
    ics_modules_with_type['ETHIK'] = kernmodul
    ics_modules_with_type['WEBTEC'] = kernmodul
    ics_modules_with_type['SPRG'] = kernmodul

    # fixes for WI modules
    wi_modules_with_type['ENWC'] = erweiterungsmodul
    wi_modules_with_type['STA1'] = kernmodul
    wi_modules_with_type['GPOR'] = kernmodul
    wi_modules_with_type['WEBT'] = kernmodul
    wi_modules_with_type['TUNE'] = zusatzmodul
    wi_modules_with_type['STO'] = zusatzmodul
    wi_modules_with_type['FV'] = zusatzmodul

    # ISA modules
    modules_with_type['RCCR'] = zusatzmodul  # Relax, Concentrate & Create
    modules_with_type['NA'] = zusatzmodul  # Blockwoche Nachhaltigkeit
    modules_with_type['ENICS1'] = zusatzmodul
    modules_with_type['TML'] = zusatzmodul
    # Blockwoche Bildnerisches Gestalten
    modules_with_type['GEST'] = zusatzmodul

    # fixes
    modules_with_type['STAT'] = kernmodul  # the website is not up to date

    filepath_i_modules = '../src/data/modules_i.json'
    filepath_ics_modules = '../src/data/modules_ics.json'
    filepath_wi_modules = '../src/data/modules_wi.json'
    filepath_ai_modules = '../src/data/modules_ai.json'

    writeModuleFiles(filepath_i_modules, modules_with_type)
    writeModuleFiles(filepath_ics_modules, ics_modules_with_type)
    writeModuleFiles(filepath_wi_modules, wi_modules_with_type)
    writeModuleFiles(filepath_ai_modules, ai_modules_with_type)


def prequisitesCheck():
    modulbeschriebe_i_url = 'https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/modulbeschriebe-studiengang-informatik/'
    modulbeschriebe_ics_url = 'https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/bachelor-in-information-and-cyber-security/'
    modulbeschriebe_wi_url = 'https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/modulbeschriebe-wirtschaftsinformatik-neues-curriculum/'
    modulbeschriebe_ai_url = 'https://mycampus.hslu.ch/de-ch/info-i/dokumente-fuers-studium/bachelor/moduleinschreibung/modulbeschriebe/bachelor-artificial-intelligence-machine-learning/'

    checkFile = True
    f = Path('./modulbeschriebe_i.html')
    if not f.is_file():
        print('ERROR: file \'./modulbeschriebe_i.html\' does not exist.')
        print('To get started download the html file from', modulbeschriebe_i_url,
              'and save it as \'tools/modulbeschriebe_i.html\'.')
        checkFile = False

    f = Path('./modulbeschriebe_wi.html')
    if not f.is_file():
        print('ERROR: file \'./modulbeschriebe_wi.html\' does not exist.')
        print('To get started download the html file from', modulbeschriebe_wi_url,
              'and save it as \'tools/modulbeschriebe_wi.html\'.')
        checkFile = False

    f = Path('./modulbeschriebe_ai.html')
    if not f.is_file():
        print('ERROR: file \'./modulbeschriebe_ai.html\' does not exist.')
        print('To get started download the html file from', modulbeschriebe_ai_url,
              'and save it as \'tools/modulbeschriebe_ai.html\'.')
        checkFile = False

    f = Path('./modulbeschriebe_ics.html')
    if not f.is_file():
        print('ERROR: file \'./modulbeschriebe_ics.html\' does not exist.')
        print('To get started download the html file from', modulbeschriebe_ics_url,
              'and save it as \'tools/modulbeschriebe_ai.html\'.')
        checkFile = False
    return checkFile


if __name__ == "__main__":
    if prequisitesCheck():
        parseWebsite()
