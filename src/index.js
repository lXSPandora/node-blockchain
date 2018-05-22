// @flow
import SHA256 from 'crypto-js/sha256';

type NewBlock = {
  index: number,
  timestamp: string,
  data: any,
  previousHash: string,
  hash: string,
  nonce: number,
  calculateHash: () => string,
  mineBlocks: (difficulty: number) => void,
}

class Block {
  index: number;
  timestamp: string;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(index: number, timestamp: string, data: any, previousHash: string = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash = () => SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();

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

  constructor() {
    this.chain = [this.craeteGenesisBlock()];
    this.difficulty = 4;
  }

  craeteGenesisBlock = () => new Block(0, '01/01/2017', 'Genesis', '0');

  getLatestBlock = () => this.chain[this.chain.length - 1];

  addNewBlock = (newBlock: NewBlock) => {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlocks(this.difficulty);
    this.chain.push(newBlock);
  };

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
// calling our blockchain
const luizCoin = new Blockchain();

let actualDateTime = new Date().toString();

// adding some amounts to it
console.log('Mining block 1...');
luizCoin.addNewBlock(new Block(1, actualDateTime, { amount: 4 }));

actualDateTime = new Date().toString();

console.log('Mining block 2...');
luizCoin.addNewBlock(new Block(2, actualDateTime, { amount: 10 }));

actualDateTime = new Date().toString();

console.log('Mining block 3...');
luizCoin.addNewBlock(new Block(3, actualDateTime, { amount: 3 }));

actualDateTime = new Date().toString();

console.log('Mining block 4...');
luizCoin.addNewBlock(new Block(4, actualDateTime, { amount: 2 }));

actualDateTime = new Date().toString();

console.log('Mining block 5...');
luizCoin.addNewBlock(new Block(5, actualDateTime, { amount: 1 }));

const isValid = luizCoin.isChainValid();

console.log(`Is My Chain Valid? ${isValid ? 'Yes' : 'No'}`);

console.log('Here`s your chain: ', JSON.stringify(luizCoin, null, 2));

