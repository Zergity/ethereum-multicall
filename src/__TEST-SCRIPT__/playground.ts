import { providers } from 'ethers';
import { ContractCallContext, ContractCallResults, Multicall } from '../';

const execute = async () => {
  const provider = new providers.JsonRpcProvider('https://bsc-dataseed.binance.org', 56);

  // you can use any ethers provider context here this example is
  // just shows passing in a default provider, ethers hold providers in
  // other context like wallet, signer etc all can be passed in as well.
  const multicall = new Multicall({
    ethersProvider: provider,
    tryAggregate: true,
  });

  const contractCallContext: ContractCallContext = {
    reference: "DataStorage",
    contractAddress: '0xB18f76607C00a817Ce5Fcd6842888ed152523c7C',
    abi: [
      {
        name: "userInfo",
        type: "function",
        inputs: [
          { name: "user", type: "address" },
        ],
        outputs: [
          { name: "totalVote", type: "uint64" },
          { name: "totalClaim", type: "uint64" },
        ],
        stateMutability: "view",
      },
      {
        name: "e5d1b386",
        type: "function",
        inputs: [
          { name: "user", type: "address" },
        ],
        outputs: [
          { name: "oldClaimed", type: "uint256" },
        ],
        stateMutability: "view",
      },
    ],
    calls: [{
      reference: "userInfo",
      methodName: "userInfo",
      methodParameters: ['0xd7E6E0E0499547003459E57578b7A8400F0055C4'],
    }, {
      reference: "e5d1b386",
      methodName: "e5d1b386",
      methodParameters: ['0xd7E6E0E0499547003459E57578b7A8400F0055C4'],
    }],
  };

  const context: ContractCallResults = await multicall.call(
    contractCallContext
  );
  context.results[contractCallContext.reference].callsReturnContext.map(a => console.log(a))
  const latestBlock = await provider.getBlockNumber();
  const blockNumber = `${latestBlock - 15}`;
  const contextOnBlock: ContractCallResults = await multicall.call(
    contractCallContext,
    { blockNumber }
  );
  console.log({
    latestBlock,
    blockNumber,
    resultBlock: contextOnBlock.blockNumber,
  });
};

execute();
