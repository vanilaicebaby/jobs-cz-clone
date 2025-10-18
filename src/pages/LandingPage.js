import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  UserPlus, 
  ChromeIcon, 
  Apple, 
  Mail, 
  Linkedin 
} from 'lucide-react';

const SocialLoginButton = ({ icon: Icon, text, provider }) => (
  <button 
    className="flex items-center justify-center w-full py-2 px-4 border border-neutral-200 
    rounded-lg hover:bg-neutral-100 transition-colors mb-3"
  >
    <Icon className="mr-2" size={20} />
    {text}
  </button>
);

function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const socialProviders = [
    { icon: ChromeIcon, text: 'Pokračovat s Google', provider: 'google' },
    { icon: Apple, text: 'Pokračovat s Apple', provider: 'apple' },
    { icon: Linkedin, text: 'Pokračovat s LinkedIn', provider: 'linkedin' },
    { icon: Mail, text: 'Pokračovat s Outlookem', provider: 'outlook' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-card">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-300 mb-4">Jobs.cz Clone</h1>
          <p className="text-neutral-600 mb-6">Najděte svou vysněnou práci</p>

          <div className="flex mb-6">
            <button 
              onClick={() => setActiveTab('login')}
              className={`w-1/2 py-2 ${activeTab === 'login' 
                ? 'bg-primary-300 text-white' 
                : 'bg-neutral-100 text-neutral-600'}`}
            >
              Přihlášení
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`w-1/2 py-2 ${activeTab === 'register' 
                ? 'bg-primary-300 text-white' 
                : 'bg-neutral-100 text-neutral-600'}`}
            >
              Registrace
            </button>
          </div>

          {socialProviders.map((provider, index) => (
            <SocialLoginButton 
              key={index} 
              icon={provider.icon} 
              text={provider.text} 
              provider={provider.provider} 
            />
          ))}

          <div className="flex items-center my-4">
            <hr className="flex-grow border-neutral-200" />
            <span className="mx-4 text-neutral-500">nebo</span>
            <hr className="flex-grow border-neutral-200" />
          </div>

          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-primary-300 text-white rounded-lg 
            hover:bg-primary-400 transition-colors flex items-center justify-center"
          >
            {activeTab === 'login' ? (
              <>
                <LogIn className="mr-2" size={20} /> Přihlásit se
              </>
            ) : (
              <>
                <UserPlus className="mr-2" size={20} /> Zaregistrovat se
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;