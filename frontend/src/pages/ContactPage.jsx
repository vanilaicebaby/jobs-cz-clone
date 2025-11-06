const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">KONTAKT</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">BMW Carbon Parts</h2>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-start">
                  <span className="mr-3">📍</span>
                  <span>Praha, Česká republika</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-3">📞</span>
                  <span>+420 123 456 789</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-3">✉️</span>
                  <span>info@carbon.parts</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium mb-3">Provozní doba</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Po - Pá: 9:00 - 18:00</p>
                <p>So: 10:00 - 14:00</p>
                <p>Ne: Zavřeno</p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium mb-3">Sledujte nás</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-6 rounded">
            <h2 className="text-lg font-medium mb-4">Napište nám</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Jméno</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900"
                  placeholder="Vaše jméno"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900"
                  placeholder="vas@email.cz"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Zpráva</label>
                <textarea
                  rows="5"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900"
                  placeholder="Vaše zpráva..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                ODESLAT ZPRÁVU
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
