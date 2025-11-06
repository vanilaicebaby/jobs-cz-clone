const TermsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">OBCHODNÍ PODMÍNKY</h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">1. Úvodní ustanovení</h2>
            <p>
              Tyto obchodní podmínky upravují vztahy mezi provozovatelem e-shopu BMW Carbon Parts
              (dále jen "prodávající") a zákazníkem (dále jen "kupující") při nákupu zboží prostřednictvím
              internetového obchodu.
            </p>
            <p className="text-sm">
              <strong>Prodávající:</strong> BMW Carbon Parts<br/>
              <strong>Sídlo:</strong> Praha, Česká republika<br/>
              <strong>IČO:</strong> 12345678<br/>
              <strong>DIČ:</strong> CZ12345678<br/>
              <strong>Email:</strong> info@carbon.parts<br/>
              <strong>Telefon:</strong> +420 123 456 789
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">2. Objednávka a uzavření smlouvy</h2>
            <p>
              2.1. Objednávka kupujícího je návrhem kupní smlouvy. Smlouva je uzavřena odesláním
              potvrzení objednávky prodávajícím na email kupujícího.
            </p>
            <p>
              2.2. Prodávající si vyhrazuje právo objednávku odmítnout, zejména pokud není zboží skladem
              nebo nelze ověřit údaje kupujícího.
            </p>
            <p>
              2.3. Všechny ceny jsou uvedeny včetně DPH. Ceny platné v době objednávky.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">3. Platební podmínky</h2>
            <p>
              3.1. Kupující může platit následujícími způsoby:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Platební kartou online (Visa, Mastercard, Apple Pay)</li>
              <li>Bankovním převodem předem</li>
              <li>Dobírkou při převzetí (poplatek +30 Kč)</li>
            </ul>
            <p>
              3.2. U platby předem je objednávka expedována po připsání platby na účet prodávajícího.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">4. Dodací podmínky</h2>
            <p>
              4.1. Zboží skladem expedujeme do 24 hodin od obdržení platby.
              U zboží na objednávku je dodací lhůta 7-14 pracovních dnů.
            </p>
            <p>
              4.2. Doprava zdarma při nákupu nad 5 000 Kč na území ČR.
            </p>
            <p>
              4.3. Vlastnické právo ke zboží přechází na kupujícího úplným zaplacením kupní ceny.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">5. Odstoupení od smlouvy</h2>
            <p>
              5.1. Kupující má právo odstoupit od smlouvy do 14 dnů od převzetí zboží bez udání důvodu.
            </p>
            <p>
              5.2. Zboží musí být vráceno nepoužité, nepoškozené a v původním obalu.
            </p>
            <p>
              5.3. Právo na odstoupení se nevztahuje na zboží vyrobené na míru podle požadavků kupujícího.
            </p>
            <p>
              5.4. Kupujícímu budou vráceny peníze do 14 dnů od odstoupení od smlouvy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">6. Záruka a reklamace</h2>
            <p>
              6.1. Na zboží je poskytována záruka 24 měsíců od převzetí.
            </p>
            <p>
              6.2. Reklamaci lze uplatnit na email info@carbon.parts s popisem závady a fotografiemi.
            </p>
            <p>
              6.3. Prodávající vyřídí reklamaci do 30 dnů od jejího uplatnění.
            </p>
            <p>
              6.4. Záruka se nevztahuje na poškození způsobené nesprávnou montáží, nehodou nebo běžným opotřebením.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">7. Ochrana osobních údajů</h2>
            <p>
              7.1. Prodávající zpracovává osobní údaje kupujícího v souladu s nařízením GDPR.
            </p>
            <p>
              7.2. Osobní údaje jsou zpracovávány pouze pro účely vyřízení objednávky a komunikace s kupujícím.
            </p>
            <p>
              7.3. Podrobné informace naleznete v našich <a href="/privacy" className="underline">Zásadách ochrany osobních údajů</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">8. Závěrečná ustanovení</h2>
            <p>
              8.1. Tyto obchodní podmínky platí ve znění uvedeném na webových stránkách v den odeslání objednávky.
            </p>
            <p>
              8.2. Prodávající si vyhrazuje právo změnit tyto obchodní podmínky. Změna je účinná zveřejněním na webových stránkách.
            </p>
            <p>
              8.3. V případě sporů se strany pokusí o smírné řešení. Nevyřešené spory rozhodují soudy České republiky.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Tyto obchodní podmínky nabývají účinnosti dnem 1. 1. 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
