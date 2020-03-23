const SimplePriceOracle = artifacts.require('SimplePriceOracle.sol');

contract('SimplePriceOracle', function (accounts) {
  let simplePriceOracle;
  const RENT_PRICE = 100;

  before(async () => {
    simplePriceOracle = await SimplePriceOracle.new(RENT_PRICE);
  });

  it('Should get price', async function() {
    try {
      const duration = 1000;
      const price = await simplePriceOracle.price('a', 0, duration);
      // console.log(price.toNumber());
      assert.equal(RENT_PRICE * duration, price.toNumber());
    } catch (error) {
      console.log(error);
    }
  });

  it('should set price', async function() {
    try {
      const duration = 1000;
      const rentPrice = 1000;
      await simplePriceOracle.setPrice(rentPrice);
      const price = await simplePriceOracle.price('a', 0, duration);
      // console.log(price.toNumber());
      assert.equal(rentPrice * duration, price.toNumber());
    } catch (error) {
      console.log(error);
    }
  });
});
