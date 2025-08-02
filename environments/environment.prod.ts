export const environment = {
  production: true,
  useLocalDb: false,
  apiBaseUrl: 'https://bybank-back-end.onrender.com',
  apiVersion: '/v1',
  apiNamespace: '/bytebank',
  shell: {
    remoteEntry: 'https://shell-projeto-bytebank-gp-30.vercel.app/remoteEntry.js',
    remoteName: 'shell-projeto-bytebank-gp-30'
  },
  apiConfig: {
    timeout: 30000,
    retryAttempts: 3
  }
};
