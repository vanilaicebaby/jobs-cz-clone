import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'Česká republika',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-normal text-gray-900 mb-2">MŮJ PROFIL</h1>
          <p className="text-sm text-gray-600">
            Spravujte své osobní údaje a nastavení účtu
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded animate-fade-in">
            Profil byl úspěšně aktualizován!
          </div>
        )}

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 animate-fade-in-up stagger-1 opacity-0">
            <div className="bg-gray-50 p-6 rounded">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm bg-white text-gray-900 rounded">
                  Osobní údaje
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-white rounded transition-colors">
                  Moje objednávky
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-white rounded transition-colors">
                  Oblíbené produkty
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-white rounded transition-colors"
                >
                  Odhlásit se
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 animate-fade-in-up stagger-2 opacity-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Osobní údaje
                  </h2>
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="text-sm text-gray-900 hover:underline"
                    >
                      Upravit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Jméno
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Příjmení
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="+420 123 456 789"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 p-6 rounded">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Dodací adresa
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Ulice a číslo popisné
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Např. Václavské náměstí 1"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Město
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="Praha"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        PSČ
                      </label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="110 00"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Země
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-black text-white py-3 px-4 text-sm font-medium hover:bg-gray-800 transition-all duration-300 btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'UKLÁDÁNÍ...' : 'ULOŽIT ZMĚNY'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone || '',
                        address: user.address || {
                          street: '',
                          city: '',
                          postalCode: '',
                          country: 'Česká republika',
                        },
                      });
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    ZRUŠIT
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
