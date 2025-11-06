import { useState } from 'react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Jak dlouho trvá dodání?',
      answer: 'Zboží skladem expedujeme do 24 hodin. Doprava přes Zásilkovnu nebo PPL trvá 2-3 pracovní dny. U zboží na objednávku je dodací lhůta 7-14 pracovních dnů.',
    },
    {
      question: 'Jsou díly kompatibilní s mým BMW?',
      answer: 'U každého produktu uvádíme přesnou kompatibilitu s modely BMW. Pokud si nejste jisti, kontaktujte nás s VIN číslem vašeho vozu a ověříme kompatibilitu.',
    },
    {
      question: 'Poskytujete záruku na carbonové díly?',
      answer: 'Ano, na všechny výrobky poskytujeme záruku 24 měsíců od data převzetí. Záruka pokrývá výrobní vady, ne však běžné opotřebení nebo poškození nesprávnou montáží.',
    },
    {
      question: 'Mohu si díly nainstalovat sám?',
      answer: 'Mnoho dílů lze nainstalovat svépomocí s běžným nářadím. U složitějších instalací doporučujeme odborný servis. K některým produktům dodáváme montážní návody.',
    },
    {
      question: 'Je možné vrátit zboží?',
      answer: 'Ano, máte právo vrátit zboží do 14 dnů od převzetí. Zboží musí být nepoužité v původním obalu. Výjimkou jsou díly vyrobené na míru podle požadavků zákazníka.',
    },
    {
      question: 'Jakou kvalitu carbonu používáte?',
      answer: 'Používáme výhradně prémiový dry carbon fiber vytvrzený v autoklávu (2x2 Twill Weave). Každý díl má UV ochrannou vrstvu proti vyblednutí a je vyroben s přesností OEM.',
    },
    {
      question: 'Mohu si díly vyzvednout osobně?',
      answer: 'Ano, nabízíme osobní odběr zdarma na naší pobočce v Praze. Prosíme o předchozí dohodu termínu odběru na telefonu nebo emailu.',
    },
    {
      question: 'Nabízíte montáž dílů?',
      answer: 'Momentálně neprovádíme montáž, ale můžeme vám doporučit ověřené BMW servisy v Praze, které s našimi díly mají zkušenosti.',
    },
    {
      question: 'Jak probíhá platba a je bezpečná?',
      answer: 'Nabízíme platbu kartou online (šifrované spojení), bankovní převod nebo dobírku. Platby kartou probíhají přes zabezpečený platební gateway a jsou 100% bezpečné.',
    },
    {
      question: 'Posíláte i do zahraničí?',
      answer: 'Ano, posíláme do celé EU. Cena dopravy se liší podle země a váhy zásilky. Pro cenovou nabídku nás kontaktujte s adresou doručení.',
    },
    {
      question: 'Co když mi díl nepasuje?',
      answer: 'Všechny naše díly mají OEM fitment a dokonale pasují. Pokud by přesto došlo k problému, kontaktujte nás a vyřešíme to – buď výměnou nebo vrácením peněz.',
    },
    {
      question: 'Jak se o carbon starat?',
      answer: 'Carbon čistěte jemným čisticím prostředkem a mikrovlákennou utěrkou. Nedoporučujeme používat agresivní chemikálie nebo vysokotlaký myč přímo na carbon. 1-2x ročně aplikujte carbon protector.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-normal text-gray-900 mb-4">ČASTO KLADENÉ OTÁZKY (FAQ)</h1>
        <p className="text-gray-600 mb-12">
          Najděte odpovědi na nejčastější otázky ohledně našich produktů a služeb.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gray-50 p-8 rounded text-center">
          <h2 className="text-lg font-medium mb-2">Nenašli jste odpověď?</h2>
          <p className="text-gray-600 text-sm mb-4">
            Kontaktujte nás a rádi vám pomůžeme s jakýmkoliv dotazem.
          </p>
          <a
            href="/contact"
            className="inline-block bg-black text-white py-3 px-8 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            KONTAKTOVAT NÁS
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
