# UniPoolToken as a Gift🎁

***
## 【Introduction of UniPoolToken as a Gift 🎁】
- This is a dApp that user can create UniPoolToken or add liquidity to UniPoolToken freely and send their UniPoolToken as a gift to someone whoever user want. 
  - UniPoolToken is created by Uniswap-v2 contract.
  - Use `Pair (ERC-20) / UniswapV2ERC20.sol` below for sending UniPoolToken.  
    https://uniswap.org/docs/v2/smart-contracts/pair-erc-20/

&nbsp;

## 【User Flow】
- ① User create UniPoolToken or add liquidity to UniPoolToken
- ② User specify "toAddress" which is wallet address of someone whoever user want.
- ③ User send UniPoolToken to specified wallet address. 

&nbsp;

***

## 【Setup】
### Setup wallet by using Metamask
1. Add MetaMask to browser (Chrome or FireFox or Opera or Brave)    
https://metamask.io/  


2. Adjust appropriate newwork below 
```
Kovan Test Network
```

&nbsp;


### Setup backend
1. Deploy contracts to Kovan Test Network
```
(root directory)

$ npm run migrate:ropsten
```

&nbsp;


### Setup frontend
1. Move to `./client`
```
$ cd client
```

2. Add an `.env` file under the directory of `./client`.
```
$ cp .env.example .env
```

3. Execute command below in root directory.
```
$ npm run client
```

4. Access to browser by using link 
```
http://127.0.0.1:3000/unipooltoken-as-a-gift
```

&nbsp;


***

## 【References】
- [Uniswap-v2]：  
  - Bounty of Uniswap-v2 at NYBW Hackathon / Gitcoin
    - https://gitcoin.co/issue/aave/aave-gitcoin-hackaton-2019/8/4326  
    - https://gitcoin.co/issue/Uniswap/uniswap-v2-core/76/4324  

  - Repos
    - uniswap-v2-core  
      https://github.com/Uniswap/uniswap-v2-core
    - uniswap-v2-periphery  
      https://github.com/Uniswap/uniswap-v2-periphery
    - uniswap-lib  
      https://github.com/Uniswap/uniswap-lib 

  - Doc  
    - Factory / UniswapV2Factory.sol  
      https://uniswap.org/docs/v2/smart-contracts/factory/
    - Pair / UniswapV2Pair.sol  
      https://uniswap.org/docs/v2/smart-contracts/pair/
    - Pair (ERC-20) / UniswapV2ERC20.sol  
      https://uniswap.org/docs/v2/smart-contracts/pair-erc-20/
    - Router / UniswapV2Router01.sol  
      https://uniswap.org/docs/v2/smart-contracts/router/


  - Article
    - Uniswap V2 Mainnet Launch
      https://uniswap.org/blog/launch-uniswap-v2/
