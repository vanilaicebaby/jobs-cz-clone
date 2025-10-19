const config = {
  development: {
    apiBaseUrl: 'https://api.workuj.cz/api/jobs'
  },
  production: {
    apiBaseUrl: 'https://api.workuj.cz/api/jobs'
  },
  staging: {
    apiBaseUrl: 'https://api.workuj.cz/api/jobs'
  }
};

const getConfig = () => {
  const env = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';
  return config[env];
};

export default getConfig();