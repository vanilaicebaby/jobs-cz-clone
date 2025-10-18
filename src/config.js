const config = {
  development: {
    apiBaseUrl: 'https://0qzgdydz6b.execute-api.eu-central-1.amazonaws.com/prod/api/jobs'
  },
  production: {
    apiBaseUrl: 'https://0qzgdydz6b.execute-api.eu-central-1.amazonaws.com/prod/api/jobs'
  },
  staging: {
    apiBaseUrl: 'https://0qzgdydz6b.execute-api.eu-central-1.amazonaws.com/prod/api/jobs'
  }
};

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return config[env];
};

export default getConfig();