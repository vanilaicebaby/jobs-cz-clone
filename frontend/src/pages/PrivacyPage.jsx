const PrivacyPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">OCHRANA OSOBNÍCH ÚDAJŮ (GDPR)</h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">1. Správce osobních údajů</h2>
            <p className="text-sm">
              <strong>Správce:</strong> BMW Carbon Parts<br/>
              <strong>Sídlo:</strong> Praha, Česká republika<br/>
              <strong>IČO:</strong> 12345678<br/>
              <strong>Email:</strong> info@carbon.parts<br/>
              <strong>Telefon:</strong> +420 123 456 789
            </p>
            <p>
              Správce odpovídá za zpracování vašich osobních údajů v souladu s nařízením GDPR (EU) 2016/679.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">2. Jaké údaje zpracováváme</h2>
            <p>Zpracováváme následující kategorie osobních údajů:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Identifikační údaje:</strong> jméno, příjmení</li>
              <li><strong>Kontaktní údaje:</strong> email, telefon, adresa doručení</li>
              <li><strong>Údaje o objednávce:</strong> číslo objednávky, obsah košíku, platební metoda</li>
              <li><strong>Technické údaje:</strong> IP adresa, cookies (se souhlasem)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">3. Účel a právní základ zpracování</h2>
            <p>Vaše osobní údaje zpracováváme pro následující účely:</p>

            <div className="space-y-3">
              <div>
                <strong>a) Vyřízení objednávky</strong>
                <p className="text-sm">Právní základ: Plnění smlouvy (čl. 6 odst. 1 písm. b GDPR)</p>
              </div>

              <div>
                <strong>b) Zasílání obchodních sdělení</strong>
                <p className="text-sm">Právní základ: Váš souhlas (čl. 6 odst. 1 písm. a GDPR)</p>
              </div>

              <div>
                <strong>c) Účetní a daňové účely</strong>
                <p className="text-sm">Právní základ: Právní povinnost (čl. 6 odst. 1 písm. c GDPR)</p>
              </div>

              <div>
                <strong>d) Ochrana práv správce</strong>
                <p className="text-sm">Právní základ: Oprávněný zájem (čl. 6 odst. 1 písm. f GDPR)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">4. Doba zpracování</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Objednávky:</strong> Po dobu nezbytnou k vyřízení objednávky + 5 let (zákonné archivace)</li>
              <li><strong>Marketingové účely:</strong> Do odvolání souhlasu</li>
              <li><strong>Cookies:</strong> Dle nastavení v prohlížeči (max. 2 roky)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">5. Předávání osobních údajů</h2>
            <p>Vaše osobní údaje předáváme pouze těmto kategoriím příjemců:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Dopravci:</strong> Zásilkovna, PPL (pro doručení objednávky)</li>
              <li><strong>Platební brána:</strong> Pro zpracování plateb kartou</li>
              <li><strong>Účetní:</strong> Pro zpracování účetnictví</li>
            </ul>
            <p>Osobní údaje nepředáváme do třetích zemí mimo EU.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">6. Vaše práva</h2>
            <p>Máte následující práva:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Právo na přístup:</strong> Získat informace o zpracovávaných údajích</li>
              <li><strong>Právo na opravu:</strong> Opravit nesprávné nebo neúplné údaje</li>
              <li><strong>Právo na výmaz:</strong> Požádat o smazání osobních údajů</li>
              <li><strong>Právo na omezení:</strong> Omezit zpracování v určitých případech</li>
              <li><strong>Právo na přenositelnost:</strong> Získat údaje ve strukturovaném formátu</li>
              <li><strong>Právo vznést námitku:</strong> Proti zpracování pro marketingové účely</li>
              <li><strong>Právo odvolat souhlas:</strong> Kdykoliv bez vlivu na předchozí zpracování</li>
            </ul>
            <p className="mt-3">
              Pro uplatnění práv nás kontaktujte na <strong>info@carbon.parts</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">7. Zabezpečení údajů</h2>
            <p>
              Vaše osobní údaje chráníme pomocí technických a organizačních opatření:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>SSL šifrování pro přenos dat</li>
              <li>Zabezpečené servery s pravidelným zálohováním</li>
              <li>Omezený přístup zaměstnanců pouze na nezbytné údaje</li>
              <li>Pravidelné bezpečnostní audity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">8. Právo podat stížnost</h2>
            <p>
              Pokud se domníváte, že zpracováváme vaše osobní údaje v rozporu s GDPR,
              máte právo podat stížnost u dozorového úřadu:
            </p>
            <p className="text-sm mt-2">
              <strong>Úřad pro ochranu osobních údajů</strong><br/>
              Pplk. Sochora 27, 170 00 Praha 7<br/>
              <a href="https://www.uoou.cz" className="underline" target="_blank" rel="noopener noreferrer">www.uoou.cz</a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Tyto zásady ochrany osobních údajů nabývají účinnosti dnem 1. 1. 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
