import 'babel-polyfill';
import 'web3';
const StarNotary = artifacts.require('./StarNotary.sol')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
    accounts = accs;
    instance = await StarNotary.deployed();
  });

  it('can Create a Star', async() => {
    let tokenId = 1;
    //Wait until instance is there. Weird because of Async, 
    //but it may be undefined at first and affect other tests too.
    for(let i = 0; i<100000000;i++){
        if(instance != undefined){
            await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
            assert.isTrue(await instance._exists(tokenId))
            break;
        }
    }
  });

  it('lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.utils.toWei(.01.toString(), "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('lets user1 get the funds after the sale', async() => {
    let user1 = accounts[2]
    let user2 = accounts[3]
    let starId = 3
    let starPrice = web3.utils.toWei(.01.toString(), "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1)
    assert.equal(new web3.utils.BN(balanceOfUser1BeforeTransaction).add(new web3.utils.BN(starPrice)).toString(), new web3.utils.BN(balanceOfUser1AfterTransaction).toString());
  });

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.utils.toWei(.01.toString(), "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('lets user2 buy a star and decreases its balance in ether', async() => {
    let user1 = accounts[4]
    let user2 = accounts[5]
    let starId = 5
    let starPrice = web3.utils.toWei(.01.toString(), "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)
    assert.equal((new web3.utils.BN(balanceOfUser2BeforeTransaction).sub(new web3.utils.BN(balanceAfterUser2BuysStar))).toString(), new web3.utils.BN(starPrice).toString());
  });

  it('token name is correctly added', async() => {
    assert.equal(await instance.name.call(), "AF Stars (for Udacity BlockDevNano)");
  });

  it('token symbol is correctly added', async() => {
    assert.equal(await instance.symbol.call(), "ASN");
  });

  it('2 user can exchange their stars', async() => {
    let user1 = accounts[4]
    let user2 = accounts[8]
    let star1Id = 15
    let star2Id = 16
    await instance.createStar('awesome star', star1Id, {from: user1})
    await instance.createStar('aweful star', star2Id, {from: user2})
    await instance.approve (user2, star1Id, {from: user1})
    await instance.exchangeStars(star1Id, star2Id, {from: user2})
    let newOwnerStar1 = await instance.ownerOf(star1Id, {from: user2})
    let newOwnerStar2 = await instance.ownerOf(star2Id, {from: user1})
    assert.equal(user1, newOwnerStar2);
    assert.equal(user2, newOwnerStar1);
  });

  it('star tokens can be transfered from one address to another', async () => {
    let user1 = accounts[5]
    let user2 = accounts[7]
    let star1Id = 23
    await instance.createStar('awesome star', star1Id, {from: user1})
    await instance.transferStar(user2, star1Id, {from: user1})
    let newOwnerStar1 = await instance.ownerOf(star1Id, {from: user2})
    assert.equal(user2, newOwnerStar1);
  });

  it('look for the name of a star given its address', async()=>{
    let user1 = accounts[6]
    let star1Id = 42
    await instance.createStar('awesome star', star1Id, {from: user1})
    assert.equal(await instance.lookUptokenIdToStarInfo(star1Id, {from:user1}), 'awesome star');
  });
