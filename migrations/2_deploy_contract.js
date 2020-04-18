const ECNSRegistry = artifacts.require("./ECNSRegistry.sol");
const SimplePriceOracle = artifacts.require("./SimplePriceOracle.sol");
const BaseRegistrarImplementation = artifacts.require('./BaseRegistrarImplementation.sol');
const ETCRegistrarController = artifacts.require('./ETCRegistrarController.sol');
const PublicResolver = artifacts.require('./PublicResolver.sol');
const ReverseRegistrar = artifacts.require('./ReverseRegistrar.sol');

const web3 = new (require('web3'))();
const namehash = require('eth-ens-namehash');

/**
 * Calculate root node hashes given the top level domain(tld)
 *
 * @param {string} tld plain text tld, for example: 'eth'
 */
function getRootNodeFromTLD(tld) {
  return {
    namehash: namehash.hash(tld),
    sha3: web3.utils.sha3(tld)
  };
}

/**
 * Deploy Step
 * 
 * 1. SimplePriceOracle
 * 2. ECNSRegistry
 * 3. BaseRegistrarImplementation
 * 4. ECNSRegistrarController
 * 5. PublicResolver
 * 6. ReverseRegistrar
 * 
 */

module.exports = async function(deployer) {
  var tld = 'etc';
  var rootNode = getRootNodeFromTLD(tld);
  console.log('.etc', getRootNodeFromTLD('etc'));

  // Deploy SimplePriceOracle
  await deployer.deploy(SimplePriceOracle, 1);
  
  // Deploy ECNSRegistry
  await deployer.deploy(ECNSRegistry);
  
  // Deploy BaseRegistrarImplementation
  await deployer.deploy(
    BaseRegistrarImplementation, 
    ECNSRegistry.address, 
    rootNode.namehash
  );
  
  // Deploy ECNSRegistrarController
  await deployer.deploy(ETCRegistrarController, 
    BaseRegistrarImplementation.address, 
    SimplePriceOracle.address,
    600, 
    86400
  );

  // Deploy PublicResolver
  await deployer.deploy(PublicResolver, ECNSRegistry.address);

  await deployer.deploy(ReverseRegistrar, ECNSRegistry.address, PublicResolver.address);
  /*deployer.deploy(ECNS).then(() => {
    // Deploy the HashRegistrar and bind it with ENS
    // The last argument `0` specifies the auction start date to `now`
    // return deployer.deploy(Registrar, ECNS.address, rootNode.namehash, 0);
    console.log('# ECNS Address', ECNS.address);
    console.log('# ECNS Root Node', rootNode.namehash);
  });*/
}
