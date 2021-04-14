
// NOTE: 6 decimala!!!

const App = {
  coinbase: null,
  web3: null,
  web3Provider: null,
  artifacts: [],
  promisify (fn, ...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  initWeb3: async function () {
    console.log(window);
    if (typeof window.ethereum !== 'undefined') {
      console.log('Injected Ethereum');

      this.web3Provider = window.ethereum;

      this.web3 = new Web3(window.ethereum);

      await this.web3Provider.request({ method: 'eth_requestAccounts' });
      
      this.coinbase = await this.promisify(this.web3.eth.getCoinbase);
    } else {
      console.log('No MetaMask found');
    }
  },
  sendTransaction: async function()
  {

    var oneEther = this.web3.utils.toWei('1', 'ether')
    

    for (var i = 0.0; i < 0.9; i+= 0.1)
    {
      var testingFor = (1 + i).toFixed(3)
      console.log("Testing for plus: " + testingFor + " ||| " + this.web3.utils.toWei(testingFor, 'ether'))  
    }
    
    for (var i = 0.0; i < 0.9; i+= 0.1)
    {
      var testingFor = (1 - i).toFixed(3)
      console.log("Testing for minus: " + testingFor + " ||| " + this.web3.utils.toWei(testingFor, 'ether'))  
    }

    var neededEther = this.web3.utils.toWei('0.000025', 'ether')
    // var oneEther
    // this.web3.utils.toWei("0.5", "ether")
    var decimalValue = '0.000001'
    console.log("nula jhedan:" + this.web3.utils.toWei(decimalValue, 'ether'))
    console.log(neededEther)
    //value: this.web3.utils.toHex(new this.web3.utils.BN(0.00001))
    // console.log(new BN("0.00001"))
    // console.log(this.web3.utils.toHex(new BN(0.00001)))

    const transactionParameters = {
      // nonce: '0x00', // ignored by MetaMask
      // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
      // gas: '0x2710', // customizable by user during MetaMask confirmation.
      to: '0xe0c2dEa0F73FEe0E422D181B058951bfd679265d', // Required except during contract publications.
      from: this.web3Provider.selectedAddress, // must match user's active address.
      value: this.web3.utils.toHex(this.web3.utils.toWei(decimalValue, 'ether'))
      // data:'0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
      // chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    
    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await this.web3Provider.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
  },
  initContract: function (contractName) {
    fetch(`${contractName}.json`)
      .then((response) => response.json())
      .then((contract) => {
        this.artifacts[contractName] = contract;
      })
      .catch(error => console.log(error));
  },
  getContract: function (contractName, address) {
    return new this.web3.eth.Contract(
      this.artifacts[contractName].abi,
      address,
    );
  },
  deployContract: function (contractName, args, opts) {
    const contract = new this.web3.eth.Contract(this.artifacts[contractName].abi);

    contract.deploy({
      data: this.artifacts[contractName].bytecode,
      arguments: args,
    })
      .send(opts || { from: this.coinbase })
      .on('error', (error) => {
        console.log(error.message);
      })
      .on('transactionHash', (transactionHash) => {
        console.log(transactionHash);
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
      });
  },
};

App.initWeb3();
