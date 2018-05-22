// @flow
import SHA256 from 'crypto-js/sha256';

type Transactions = {
  fromAddress?: string,
  toAddress: string,
  amount: number,
};

class Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;
  constructor(fromAddress?: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

type NewBlock = {
  timestamp: string,
  transactions: Transactions,
  previousHash: string,
  hash: string,
  nonce: number,
  calculateHash: () => string,
  mineBlocks: (difficulty: number) => void,
};

class Block {
  timestamp: string;
  transactions: Transactions;
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(timestamp: string, transactions: Transactions, previousHash: string = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash = () =>
    SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();

  mineBlocks = (difficulty: number) => {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Mined Block', this.hash);
  };
}

class Blockchain {
  chain: Array<NewBlock>;
  difficulty: number;
  pendingTransactions: Array<Transaction>;
  miningReward: number;

  constructor() {
    this.chain = [this.craeteGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  craeteGenesisBlock = () => new Block(0, '01/01/2017', 'Genesis', '0');

  getLatestBlock = () => this.chain[this.chain.length - 1];

  minePendingTransactions = (miningAddress: string) => {
    const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlocks(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [new Transaction(null, miningAddress, this.miningReward)];
  };

  createTransaction = (transaction: Transactions) => {
    this.pendingTransactions.push(transaction);
  };

  getAddressBalance = (address: string) => {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  };
  // addNewBlock = (newBlock: NewBlock) => {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.mineBlocks(this.difficulty);
  //   this.chain.push(newBlock);
  // };

  isChainValid = () => {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  };
}
const luizCoin = new Blockchain();
luizCoin.createTransaction(new Transaction('address1', 'address2', 100));
luizCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
luizCoin.minePendingTransactions('luiz-address');

console.log('\nBalance of xavier is', luizCoin.getAddressBalance('luiz-address'));

console.log('\n Starting the miner again...');
luizCoin.minePendingTransactions('luiz-address');

console.log('\nBalance of xavier is', luizCoin.getAddressBalance('luiz-address'));
// console.log('Here`s your chain: ', JSON.stringify(luizCoin, null, 2));
