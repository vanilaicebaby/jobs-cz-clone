#!/usr/bin/env python3
"""
Script pro nahrání BMW carbon produktů do DynamoDB
Stahuje obrázky z Made-in-China a nahrává do DynamoDB
"""

import boto3
import uuid
import requests
from decimal import Decimal

# DynamoDB konfigurace
REGION = 'eu-central-1'
TABLE_NAME = 'carbon-parts-products'

dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE_NAME)

# Produkty z Made-in-China
products = [
    {
        "name": "Karbonový Přední Splitter Vorsteiner pro BMW M3 M4 F80/F82",
        "category": "BMW M3 F80 | Exteriér",
        "price": Decimal("34900"),
        "image": "https://image.made-in-china.com/3f2j00LyIVHFPsMdpv/for-BMW-F80-F82-F83-M3-M4-Vorsteiner-Type-Carbon-Fiber-2PC-Front-Bumper-Lip-Body-Kit.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00LyIVHFPsMdpv/for-BMW-F80-F82-F83-M3-M4-Vorsteiner-Type-Carbon-Fiber-2PC-Front-Bumper-Lip-Body-Kit.jpg",
        ],
        "isNew": True,
        "description": "Prémiový karbonový přední splitter ve stylu Vorsteiner pro BMW M3/M4 F80/F82/F83. 2-dílná sada vyrobená z dry carbon fiber s perfektním OEM fitmentem. TUV/GS certifikace, 1 rok záruky.",
        "specifications": [
            {"label": "Materiál", "value": "Dry Carbon Fiber (Autokláv)"},
            {"label": "Povrchová úprava", "value": "2x2 Twill Weave"},
            {"label": "Fitment", "value": "Vorsteiner Style"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 F80/F82/F83"},
            {"label": "Montáž", "value": "2-dílná sada, bolt-on"},
            {"label": "Certifikace", "value": "TUV/GS"},
        ],
        "features": [
            "Vorsteiner inspirovaný design",
            "2-dílná konstrukce pro snadnou instalaci",
            "TUV/GS certifikace",
            "Dry carbon fiber (autokláv)",
            "UV ochranná vrstva",
            "Záruka 1 rok",
        ],
    },
    {
        "name": "Karbonový Přední Lip pro BMW M3 M4 G80/G82",
        "category": "BMW M4 G82 | Exteriér",
        "price": Decimal("28900"),
        "image": "https://image.made-in-china.com/3f2j00jKWbfmPBksqU/Factory-Quality-Professional-Manufacture-Dry-Carbon-Fiber-Front-Lip-for-BMW-M3-M4-G80-G82-S58.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00jKWbfmPBksqU/Factory-Quality-Professional-Manufacture-Dry-Carbon-Fiber-Front-Lip-for-BMW-M3-M4-G80-G82-S58.jpg",
        ],
        "isNew": True,
        "description": "Profesionálně vyráběný přední lip z dry carbon fiber pro nejnovější BMW M3/M4 G80/G82. Perfektní přesnost, ISO9001/TS16949 certifikace. Dramaticky zlepšuje agresivní vzhled vozu.",
        "specifications": [
            {"label": "Materiál", "value": "Dry Carbon Fiber"},
            {"label": "Povrchová úprava", "value": "2x2 Twill Weave"},
            {"label": "Fitment", "value": "100% OEM"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 G80/G82 S58 (2021+)"},
            {"label": "Montáž", "value": "Bolt-on, kompletní kit"},
            {"label": "Certifikace", "value": "ISO9001, TS16949, CE"},
        ],
        "features": [
            "Tovární kvalita výroby",
            "Dry carbon konstrukce",
            "ISO certifikace",
            "Perfect OEM fit",
            "UV ochrana",
            "Montážní kit v balení",
        ],
    },
    {
        "name": "Jagrow Motorsport Karbonový Front Lip BMW M3/M4 G80/G82",
        "category": "BMW M4 G82 | Exteriér",
        "price": Decimal("29900"),
        "image": "https://image.made-in-china.com/3f2j00ajToEAQDgZbB/Jagrow-Motorsport-Dry-Carbon-Fiber-Front-Lip-for-BMW-M3-M4-G80-G82-S58.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00ajToEAQDgZbB/Jagrow-Motorsport-Dry-Carbon-Fiber-Front-Lip-for-BMW-M3-M4-G80-G82-S58.jpg",
        ],
        "isNew": True,
        "description": "Jagrow Motorsport prémiový karbonový front lip pro BMW M3/M4 G80/G82. Závodní kvalita s 1 rokem záruky. Ideální pro show a track použití.",
        "specifications": [
            {"label": "Materiál", "value": "Dry Carbon Fiber"},
            {"label": "Povrchová úprava", "value": "Gloss finish"},
            {"label": "Fitment", "value": "Motorsport style"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 G80/G82 S58"},
            {"label": "Montáž", "value": "Bolt-on"},
            {"label": "Záruka", "value": "1 rok"},
        ],
        "features": [
            "Jagrow Motorsport kvalita",
            "Závodní vzhled",
            "Carbon fiber konstrukce",
            "1 rok záruka",
            "Snadno instalovatelné",
            "UV stabilní",
        ],
    },
    {
        "name": "Karbonový Front Splitter BMW M3/M4 F80/F82",
        "category": "BMW M3 F80 | Exteriér",
        "price": Decimal("15900"),
        "image": "https://image.made-in-china.com/3f2j00dOClRStsEvUY/Factory-Direct-Automotive-Components-Genuine-Carbon-Fibre-Front-Spoiler-Lip-for-BMW-M4-M3-F80-F82-F83-Front-Bumper-.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00dOClRStsEvUY/Factory-Direct-Automotive-Components-Genuine-Carbon-Fibre-Front-Spoiler-Lip-for-BMW-M4-M3-F80-F82-F83-Front-Bumper-.jpg",
        ],
        "isNew": False,
        "description": "Tovární přední spoiler lip z pravého carbon fiber pro BMW M3/M4 F80/F82/F83. Přímý nákup od výrobce = nejlepší cena. 1 rok záruka.",
        "specifications": [
            {"label": "Materiál", "value": "Carbon Fiber"},
            {"label": "Povrchová úprava", "value": "Glossy black"},
            {"label": "Fitment", "value": "OEM"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 F80/F82/F83"},
            {"label": "Montáž", "value": "Front bumper lip"},
            {"label": "Záruka", "value": "1 rok"},
        ],
        "features": [
            "Tovární přímý prodej",
            "Nejlepší cena/výkon",
            "Pravý carbon fiber",
            "1 rok záruka",
            "Snadná instalace",
            "OEM fit",
        ],
    },
    {
        "name": "Vorsteiner Karbonový Zadní Difuzor BMW M3 E92/E93",
        "category": "BMW M3 E92 | Exteriér",
        "price": Decimal("24900"),
        "image": "https://image.made-in-china.com/3f2j00veGMfCBzgRcg/Vorsteiner-Style-Carbon-Fiber-Rear-Diffuser-Rear-Lip-for-2009-2013-BMW-3-Series-E92-E93-M3.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00veGMfCBzgRcg/Vorsteiner-Style-Carbon-Fiber-Rear-Diffuser-Rear-Lip-for-2009-2013-BMW-3-Series-E92-E93-M3.jpg",
        ],
        "isNew": False,
        "description": "Zadní difuzor ve stylu Vorsteiner pro BMW M3 E92/E93 (2009-2013). Carbon fiber, černá lesklá povrchová úprava. CE certifikace, 12 měsíců záruky.",
        "specifications": [
            {"label": "Materiál", "value": "Carbon Fiber"},
            {"label": "Barva", "value": "Černá lesklá"},
            {"label": "Fitment", "value": "Vorsteiner Style"},
            {"label": "Kompatibilita", "value": "BMW M3 E92/E93 (2009-2013)"},
            {"label": "Montáž", "value": "Zadní difuzor"},
            {"label": "Certifikace", "value": "CE"},
        ],
        "features": [
            "Vorsteiner inspirovaný design",
            "Klasický E92 M3",
            "CE certifikace",
            "12 měsíců záruka",
            "Carbon fiber",
            "Lesklý černý finish",
        ],
    },
    {
        "name": "CS-Style Karbonový Front Splitter BMW M3/M4 F8X",
        "category": "BMW M3 F80 | Exteriér",
        "price": Decimal("12900"),
        "image": "https://image.made-in-china.com/3f2j00jyMiZsElkCYo/CS-Style-Front-Spoiler-with-Carbon-Fibre-Front-Bumper-Lip-for-BMW-F80-F82-F83-F8X-M3-and-M4.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00jyMiZsElkCYo/CS-Style-Front-Spoiler-with-Carbon-Fibre-Front-Bumper-Lip-for-BMW-F80-F82-F83-F8X-M3-and-M4.jpg",
        ],
        "isNew": False,
        "description": "Přední spoiler ve stylu CS s karbonovým lip pro BMW M3/M4 F8X. Cenově dostupné řešení pro upgradem vzhledu. 1 rok záruka.",
        "specifications": [
            {"label": "Materiál", "value": "Carbon Fiber"},
            {"label": "Povrchová úprava", "value": "Matte black"},
            {"label": "Fitment", "value": "CS Style"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 F80/F82/F83/F8X"},
            {"label": "Montáž", "value": "Front bumper lip"},
            {"label": "Záruka", "value": "1 rok"},
        ],
        "features": [
            "CS inspirovaný design",
            "Cenově výhodné",
            "Carbon fiber materiál",
            "Jednoduché montování",
            "1 rok záruka",
            "Univerzální F8X fit",
        ],
    },
    {
        "name": "3-Dílný Front Lip Splitter BMW M3/M4 G80/G82",
        "category": "BMW M4 G82 | Exteriér",
        "price": Decimal("8900"),
        "image": "https://image.made-in-china.com/3f2j00uPoBmgvnEzqp/Factory-Wholesale-3-Parts-Front-Lip-Splitter-for-BMW-M3-G80-M4-G82-2020-.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00uPoBmgvnEzqp/Factory-Wholesale-3-Parts-Front-Lip-Splitter-for-BMW-M3-G80-M4-G82-2020-.jpg",
        ],
        "isNew": True,
        "description": "Tovární wholesale 3-dílný přední lip splitter pro BMW M3 G80 / M4 G82 (2020+). Dostupné v různých barvách. CE/ISO/BV certifikace.",
        "specifications": [
            {"label": "Materiál", "value": "ABS + Carbon pattern"},
            {"label": "Barvy", "value": "Černá, carbon, custom"},
            {"label": "Fitment", "value": "OEM"},
            {"label": "Kompatibilita", "value": "BMW M3 G80 / M4 G82 (2020+)"},
            {"label": "Montáž", "value": "3-dílná sada"},
            {"label": "Certifikace", "value": "CE, ISO, BV"},
        ],
        "features": [
            "3-dílná konstrukce",
            "Více barev dostupných",
            "Tovární wholesale cena",
            "CE/ISO certifikace",
            "Snadná instalace",
            "Pro nejnovější G80/G82",
        ],
    },
    {
        "name": "Performance V-Style Karbonový Front Lip BMW M3/M4 G80/G82",
        "category": "BMW M4 G82 | Exteriér",
        "price": Decimal("31900"),
        "image": "https://image.made-in-china.com/3f2j00pZmbkJdGiCcB/Performance-Dry-Carbon-Fiber-V-Style-Front-Bumper-Lip-3PC-for-BMW-M3-M4-G80-G82-S58.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00pZmbkJdGiCcB/Performance-Dry-Carbon-Fiber-V-Style-Front-Bumper-Lip-3PC-for-BMW-M3-M4-G80-G82-S58.jpg",
        ],
        "isNew": True,
        "description": "Performance dry carbon fiber V-style přední bumper lip (3PC) pro BMW M3/M4 G80/G82 S58. Nerezová ocel tělo, 1 rok záruky. Agresivní závodní vzhled.",
        "specifications": [
            {"label": "Materiál", "value": "Dry Carbon + Stainless Steel"},
            {"label": "Povrchová úprava", "value": "V-Style design"},
            {"label": "Fitment", "value": "Performance"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 G80/G82 S58"},
            {"label": "Montáž", "value": "3-dílná sada"},
            {"label": "Záruka", "value": "1 rok"},
        ],
        "features": [
            "V-Style agresivní design",
            "3-dílná performance sada",
            "Dry carbon + nerez ocel",
            "1 rok záruka",
            "Závodní kvalita",
            "Pro S58 motor",
        ],
    },
    {
        "name": "V-Style Karbonový Front Lip BMW M3/M4 G82",
        "category": "BMW M4 G82 | Exteriér",
        "price": Decimal("29900"),
        "image": "https://image.made-in-china.com/3f2j00DNfbrUHEqoqz/V-Style-Carbon-Fiber-Front-Lip-for-BMW-G82-M3-M4.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00DNfbrUHEqoqz/V-Style-Carbon-Fiber-Front-Lip-for-BMW-G82-M3-M4.jpg",
        ],
        "isNew": True,
        "description": "V-style karbonový přední lip pro BMW M3/M4 G82. Customizovatelné logo, ODM services. Premium kvalita s možností personalizace.",
        "specifications": [
            {"label": "Materiál", "value": "Carbon Fiber"},
            {"label": "Povrchová úprava", "value": "V-Style"},
            {"label": "Fitment", "value": "OEM+"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 G82"},
            {"label": "Personalizace", "value": "Custom logo možné"},
            {"label": "Service", "value": "ODM dostupné"},
        ],
        "features": [
            "V-Style design",
            "Možnost custom loga",
            "ODM service",
            "Carbon fiber",
            "Premium finish",
            "G82 specific",
        ],
    },
    {
        "name": "Karbonový Front Bumper Lip BMW M3/M4 G80/G82",
        "category": "BMW M4 G82 | Exteriér",
        "price": Decimal("39900"),
        "image": "https://image.made-in-china.com/3f2j00ZGeoBniMLrqI/Carbon-Fiber-Front-Bumper-Lip-for-BMW-M3-M4-G80-G82-S58.jpg",
        "images": [
            "https://image.made-in-china.com/3f2j00ZGeoBniMLrqI/Carbon-Fiber-Front-Bumper-Lip-for-BMW-M3-M4-G80-G82-S58.jpg",
        ],
        "isNew": True,
        "description": "Prémiový karbonový front bumper lip pro BMW M3/M4 G80/G82 S58. 18 měsíců záruky, ocelové tělo, Euro V compliant. Top kvalita.",
        "specifications": [
            {"label": "Materiál", "value": "Carbon Fiber + Steel"},
            {"label": "Povrchová úprava", "value": "Premium gloss"},
            {"label": "Fitment", "value": "100% OEM"},
            {"label": "Kompatibilita", "value": "BMW M3/M4 G80/G82 S58"},
            {"label": "Záruka", "value": "18 měsíců"},
            {"label": "Certifikace", "value": "Euro V"},
        ],
        "features": [
            "18 měsíců záruka (nejdelší)",
            "Euro V compliant",
            "Ocelové tělo + carbon",
            "Premium gloss finish",
            "Top kvalita",
            "Perfect OEM fit",
        ],
    },
]

def upload_products():
    """Nahraje produkty do DynamoDB"""
    print(f"🚀 Nahrávání {len(products)} produktů do DynamoDB...")
    print(f"📦 Tabulka: {TABLE_NAME}")
    print(f"🌍 Region: {REGION}\n")

    success_count = 0
    error_count = 0

    for idx, product in enumerate(products, 1):
        try:
            # Přidání ID
            product['id'] = str(uuid.uuid4())

            # Upload do DynamoDB
            table.put_item(Item=product)

            print(f"✅ [{idx}/{len(products)}] {product['name'][:50]}...")
            success_count += 1

        except Exception as e:
            print(f"❌ [{idx}/{len(products)}] Chyba: {e}")
            error_count += 1

    print(f"\n{'='*60}")
    print(f"✅ Úspěšně nahráno: {success_count}")
    print(f"❌ Chyby: {error_count}")
    print(f"📊 Celkem: {len(products)}")
    print(f"{'='*60}\n")

    if success_count > 0:
        print("✨ Produkty jsou nyní dostupné na webu!")
        print("🔗 https://workuj.cz")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("  BMW CARBON PARTS - DynamoDB Upload Script")
    print("="*60 + "\n")

    confirmation = input("Chceš nahrát produkty do DynamoDB? (ano/ne): ")

    if confirmation.lower() in ['ano', 'yes', 'a', 'y']:
        upload_products()
    else:
        print("❌ Upload zrušen.")
