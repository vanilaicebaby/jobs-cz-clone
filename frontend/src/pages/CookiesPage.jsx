const CookiesPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">ZÁSADY POUŽÍVÁNÍ COOKIES</h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Co jsou cookies?</h2>
            <p>
              Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení (počítač, tablet, telefon)
              při návštěvě webových stránek. Slouží k zapamatování vašich preferencí a zlepšení uživatelské zkušenosti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Jaké cookies používáme</h2>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium mb-2">1. Nezbytné cookies (vždy aktivní)</h3>
                <p className="text-sm">
                  Tyto cookies jsou nutné pro základní funkčnost webu a nelze je vypnout.
                  Umožňují například přihlášení, nákupní košík a zabezpečené procházení.
                </p>
                <p className="text-sm mt-2"><strong>Doba platnosti:</strong> Relace nebo až 1 rok</p>
                <p className="text-sm"><strong>Příklady:</strong> authToken, sessionID, cartItems</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium mb-2">2. Funkční cookies</h3>
                <p className="text-sm">
                  Zapamatují si vaše preference (jazyk, měna) a zlepšují personalizaci webu.
                </p>
                <p className="text-sm mt-2"><strong>Doba platnosti:</strong> Až 2 roky</p>
                <p className="text-sm"><strong>Příklady:</strong> preferredLanguage, currency</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium mb-2">3. Analytické cookies</h3>
                <p className="text-sm">
                  Pomáhají nám pochopit, jak návštěvníci používají web (počet návštěv, nejnavštěvovanější stránky).
                  Data jsou anonymní a používáme je ke zlepšení webu.
                </p>
                <p className="text-sm mt-2"><strong>Doba platnosti:</strong> Až 2 roky</p>
                <p className="text-sm"><strong>Poskytovatel:</strong> Google Analytics (pokud je aktivní)</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-medium mb-2">4. Marketingové cookies</h3>
                <p className="text-sm">
                  Používají se pro zobrazení relevantních reklam a měření účinnosti reklamních kampaní.
                  Sledují vaši aktivitu napříč weby.
                </p>
                <p className="text-sm mt-2"><strong>Doba platnosti:</strong> Až 2 roky</p>
                <p className="text-sm"><strong>Poskytovatelé:</strong> Facebook Pixel, Google Ads (pokud jsou aktivní)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Jak spravovat cookies</h2>
            <p>Cookies můžete spravovat několika způsoby:</p>

            <div className="space-y-3 mt-3">
              <div>
                <strong>1. Nastavení prohlížeče</strong>
                <p className="text-sm">
                  Ve svém prohlížeči můžete cookies blokovat, mazat nebo nastavit upozornění před jejich uložením.
                  Návody pro jednotlivé prohlížeče:
                </p>
                <ul className="text-sm list-disc list-inside ml-4 mt-1">
                  <li><a href="https://support.google.com/chrome/answer/95647" className="underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/cs/kb/povoleni-zakazani-cookies" className="underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/cs-cz/guide/safari/sfri11471/mac" className="underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                  <li><a href="https://support.microsoft.com/cs-cz/microsoft-edge/odstran%C4%9Bn%C3%AD-soubor%C5%AF-cookie-v-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                </ul>
              </div>

              <div>
                <strong>2. Náš cookie banner</strong>
                <p className="text-sm">
                  Při první návštěvě webu se zobrazí cookie banner, kde můžete vybrat, které kategorie cookies chcete povolit.
                </p>
              </div>

              <div>
                <strong>3. Odhlášení z marketingových cookies</strong>
                <p className="text-sm">
                  Můžete se odhlásit z některých marketingových cookies zde:
                </p>
                <ul className="text-sm list-disc list-inside ml-4 mt-1">
                  <li><a href="https://www.youronlinechoices.com/cz/" className="underline" target="_blank" rel="noopener noreferrer">YourOnlineChoices.com</a></li>
                  <li><a href="https://optout.aboutads.info/" className="underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Co se stane, když zakážete cookies?</h2>
            <p>
              Pokud zakážete všechny cookies, některé funkce webu nemusí správně fungovat:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Nebudete moci zůstat přihlášeni</li>
              <li>Nákupní košík se nevymaže mezi relacemi</li>
              <li>Nebudeme si pamatovat vaše preference (jazyk, měna)</li>
              <li>Některé funkce webu mohou být omezené</li>
            </ul>
            <p className="mt-3">
              <strong>Doporučujeme ponechat alespoň nezbytné cookies povolené.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Aktualizace zásad</h2>
            <p>
              Tyto zásady o cookies můžeme čas od času aktualizovat. Poslední aktualizace proběhla 1. 1. 2025.
              O významných změnách vás budeme informovat prostřednictvím cookie banneru nebo emailem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Kontakt</h2>
            <p>
              Máte-li jakékoliv dotazy ohledně našich zásad používání cookies, kontaktujte nás na:
            </p>
            <p className="text-sm mt-2">
              <strong>Email:</strong> info@carbon.parts<br/>
              <strong>Telefon:</strong> +420 123 456 789
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
