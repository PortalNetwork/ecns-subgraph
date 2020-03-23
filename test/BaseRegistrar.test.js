const ECNSRegistry = artifacts.require('./ECNSRegistry.sol');
const BaseRegistrar = artifacts.require('./BaseRegistrarImplementation.sol');
const Promise = require('bluebird');
const namehash = require('eth-ens-namehash');
const sha3 = require('web3-utils').sha3;

const DAYS = 24 * 60 * 60;

async function expectFailure(call) {
	let tx;
	try {
		tx = await call;
	} catch (error) {
		// Assert ganache revert exception
		assert.equal(
			error.message,
			'Returned error: VM Exception while processing transaction: revert'
		);
	}
	if(tx !== undefined) {
		assert.equal(parseInt(tx.receipt.status), 0);
	}
}

contract('BaseRegistrar', function (accounts) {

});

const advanceTime = Promise.promisify(function(delay, done) {
	web3.currentProvider.send({
		jsonrpc: "2.0",
		"method": "evm_increaseTime",
		params: [delay]}, done)
	}
);
