This file is intended to provide requested information about the development of the DApp project for Udacity Blockchain Developer Nanodegree and a little feedback about it. Please see screenshots on folder "DApp Rinkeby Test Screenshots" to verify 'Metamask' rubric and more.

=== Rubric information ===

    Your ERC-721 Token Name: 
    "ASN"

    Your ERC-721 Token Symbol: 
    "AF Stars (for Udacity BlockDevNano)"

    Your “Token Address” on the rinkeby Network:
    0x6dB6235d4b82C8b796c5Ce9B0f7F37D53653287d

    The "Transaction Hash" of the transfer of tokens from one rinkeby address to another rinkeby address. (You can find this transaction hash using metamask or using the etherscan website):
    0xbac509a851e62f70104f449a624faf4791b8965663ad76ead04ebd6ea8eca74d

=== Difficulties encountered with boilerplate code while developing ===

1. Default truffle solc version is now 0.5, while files usually require 0.4.24. This required a change in truffle.js file.
2. In test file starNotary.js, web3.toWei functions are now under web3.utils. Also, the function required a string or BN to run without errores. These changes were applied in order to make tests run.
3. In test file starNotary.js: .add and .sub functions required BN (web3.utils.BN) objects to be run. Fix applied too.

=== Local tests run ===

sudo truffle develop
(develop)> compile
(develop)> migrate --reset
(develop)> test

 =Test Results =
```
truffle(develop)> test
Using network 'develop'.



  ✓ can Create a Star (600ms)
  ✓ lets user1 put up their star for sale (197ms)
  ✓ lets user1 get the funds after the sale (301ms)
  ✓ lets user2 buy a star, if it is put up for sale (328ms)
  ✓ lets user2 buy a star and decreases its balance in ether (315ms)
  ✓ token name is correctly added (55ms)
  ✓ token symbol is correctly added
  ✓ 2 user can exchange their stars (395ms)
  ✓ star tokens can be transfered from one address to another (223ms)
  ✓ look for the name of a star given its address (126ms)

  10 passing (3s)

truffle(develop)> 
´´´

