const ShippingPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">DOPRAVA A PLATBA</h1>

        {/* Shipping Section */}
        <div className="mb-12">
          <h2 className="text-xl font-medium mb-6">Způsoby dopravy</h2>

          <div className="space-y-6">
            <div className="border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Zásilkovna</h3>
                <span className="text-gray-900 font-medium">89 Kč</span>
              </div>
              <p className="text-sm text-gray-600">Doručení na výdejní místo Zásilkovny do 2-3 pracovních dnů.</p>
            </div>

            <div className="border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">PPL na adresu</h3>
                <span className="text-gray-900 font-medium">129 Kč</span>
              </div>
              <p className="text-sm text-gray-600">Doručení kurýrem PPL na vaši adresu do 2-3 pracovních dnů.</p>
            </div>

            <div className="border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Osobní odběr</h3>
                <span className="text-green-600 font-medium">ZDARMA</span>
              </div>
              <p className="text-sm text-gray-600">Osobní odběr na naší pobočce v Praze po předchozí domluvě.</p>
            </div>

            <div className="border border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Doprava ZDARMA</h3>
                <span className="text-green-600 font-medium">0 Kč</span>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Doprava zdarma</strong> při nákupu nad 5 000 Kč na území České republiky.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <h2 className="text-xl font-medium mb-6">Způsoby platby</h2>

          <div className="space-y-6">
            <div className="border border-gray-200 p-6">
              <h3 className="font-medium mb-2">Platební karta online</h3>
              <p className="text-sm text-gray-600 mb-3">
                Bezpečná online platba kartou (Visa, Mastercard, Apple Pay, Google Pay).
              </p>
              <div className="flex gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">VISA</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Apple Pay</span>
              </div>
            </div>

            <div className="border border-gray-200 p-6">
              <h3 className="font-medium mb-2">Bankovní převod</h3>
              <p className="text-sm text-gray-600">
                Platba předem bankovním převodem. Zboží odesíláme po připsání platby na účet.
              </p>
            </div>

            <div className="border border-gray-200 p-6">
              <h3 className="font-medium mb-2">Na dobírku</h3>
              <p className="text-sm text-gray-600">
                Platba v hotovosti nebo kartou při převzetí zásilky. Poplatek +30 Kč.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 rounded">
          <h3 className="font-medium mb-2">ℹ️ Důležité informace</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Všechny ceny jsou uvedeny včetně DPH 21%</li>
            <li>• Expedice objednávek probíhá každý pracovní den</li>
            <li>• U položek skladem expedujeme do 24 hodin</li>
            <li>• U položek na objednávku je dodací lhůta 7-14 pracovních dnů</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
