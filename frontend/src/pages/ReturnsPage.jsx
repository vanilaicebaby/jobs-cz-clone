const ReturnsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">REKLAMACE A VRÁCENÍ ZBOŽÍ</h1>

        {/* Returns */}
        <div className="mb-12">
          <h2 className="text-xl font-medium mb-6">Vrácení zboží do 14 dnů</h2>
          <div className="prose text-gray-600 space-y-4">
            <p>
              V souladu se zákonem máte právo odstoupit od kupní smlouvy bez udání důvodu do <strong>14 dnů</strong> od převzetí zboží.
            </p>
            <p>
              Pro vrácení zboží nás kontaktujte na <strong>info@carbon.parts</strong> s číslem objednávky.
              Zboží musí být nepoužité, nepoškozené a v původním obalu.
            </p>
            <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm">
              <strong>Upozornění:</strong> Zboží vyrobené na míru podle požadavků zákazníka nelze vrátit.
            </p>

            <h3 className="font-medium mt-6">Postup při vrácení:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Kontaktujte nás emailem s číslem objednávky</li>
              <li>Obdržíte instrukce a adresu pro vrácení</li>
              <li>Zašlete zboží doporučeně na uvedenou adresu</li>
              <li>Po kontrole vráceného zboží vrátíme platbu do 14 dnů</li>
            </ol>

            <p className="text-sm">
              Náklady na vrácení zboží hradí kupující, pokud není dohodnuto jinak.
            </p>
          </div>
        </div>

        {/* Warranty Claims */}
        <div>
          <h2 className="text-xl font-medium mb-6">Reklamace vadného zboží</h2>
          <div className="prose text-gray-600 space-y-4">
            <p>
              Na všechny výrobky poskytujeme <strong>záruku 24 měsíců</strong> od data převzetí.
            </p>

            <h3 className="font-medium mt-6">Jak postupovat při reklamaci:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Kontaktujte nás na info@carbon.parts s popisem závady</li>
              <li>Připojte fotografie nebo video dokumentující závadu</li>
              <li>Uveďte číslo objednávky a datum nákupu</li>
              <li>Obdržíte instrukce k dalšímu postupu</li>
            </ol>

            <div className="bg-gray-50 p-6 rounded mt-6">
              <h3 className="font-medium mb-3">Vyloučení záruky</h3>
              <p className="text-sm">Záruka se nevztahuje na:</p>
              <ul className="text-sm space-y-1 mt-2">
                <li>• Poškození vzniklé nesprávnou montáží nebo používáním</li>
                <li>• Mechanické poškození způsobené nehodou</li>
                <li>• Běžné opotřebení materiálu</li>
                <li>• Úpravy provedené třetí stranou</li>
                <li>• Poškození UV zářením při nedostatečné ochraně</li>
              </ul>
            </div>

            <p className="mt-6 text-sm">
              <strong>Doba vyřízení reklamace:</strong> Reklamaci vyřídíme do 30 dnů od jejího uplatnění.
              O výsledku vás budeme neprodleně informovat.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 rounded">
          <h3 className="font-medium mb-2">📞 Kontaktujte nás</h3>
          <p className="text-sm text-gray-700">
            Pro jakékoliv dotazy ohledně reklamace nebo vrácení zboží nás kontaktujte:
          </p>
          <div className="mt-3 text-sm space-y-1">
            <p>Email: <strong>info@carbon.parts</strong></p>
            <p>Telefon: <strong>+420 123 456 789</strong></p>
            <p>Po-Pá: 9:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
