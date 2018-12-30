// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import StarNotaryArtifact from '../../build/contracts/StarNotary.json'

// StarNotary is our usable abstraction, which we'll use through the code below.
const StarNotary = contract(StarNotaryArtifact)

let accounts
let account

const createStar = async () => {
  const instance = await StarNotary.deployed();
  const name = document.getElementById("starName").value;
  const id = document.getElementById("starId").value;
  await instance.createStar(name, id, {from: account});
  App.setStatus("New Star Owner is " + account + ".");
}

const lookUptokenIdToStarInfo = async () => {
  App.setStatus("No star name found with provided id")
  const instance = await StarNotary.deployed();
  const id = document.getElementById("starIdLook").value; 
  let name = await instance.lookUptokenIdToStarInfo(id, {from: account});
  if(name !== "") App.setStatus("The name of the star with id "+id+" is: "+name);
  else App.setStatus("No star name found with provided id");
}

const transferStar = async () => {
  App.setStatus("");
  const instance = await StarNotary.deployed();
  const to = document.getElementById("starReceiverAddress").value; 
  const id = document.getElementById("starIdTransfer").value; 
  await instance.transferStar(to, id, {from: account});
  App.setStatus("Star sent");
}

const starOwner = async () => {
  App.setStatus("");
  const instance = await StarNotary.deployed();
  const id = document.getElementById("starIdOwner").value; 
  let owner = await instance.ownerOf(id, {from:account});
  App.setStatus("Star with ID "+id+" is owned by: "+owner);
}

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    StarNotary.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  createStar: function () {
    createStar();
  },

  lookUptokenIdToStarInfo: function () {
    lookUptokenIdToStarInfo();
  },

  transferStar: function () {
    transferStar();
  },

  starOwner:function () {
    starOwner();
  },
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})