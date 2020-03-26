require('babel-register')
require('babel-polyfill')
const PrivateKeyProvider = require('truffle-privatekey-provider');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    // truffle deploy --network etc
    etc: {
      provider: new PrivateKeyProvider(process.env.PRIVATE_KEY, 'https://www.ethercluster.com/etc'),
      network_id: '1',
      gas: 4000000
    },
    kotti: {
      provider: new PrivateKeyProvider(process.env.PRIVATE_KEY, 'https://www.ethercluster.com/kotti'),
      network_id: '*',
      gas: 4000000
    }
  },
  compilers: {
    solc: {
      version: '0.5.0'    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}
