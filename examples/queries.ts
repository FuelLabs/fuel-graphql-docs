export const BALANCE_QUERY = `query Balance($address: Address, $assetId: AssetId) {
    balance(owner: $address, assetId: $assetId) {
      owner
      amount
      assetId
    }
  }`;

export const BALANCE_ARGS = {
    address: 
    '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    assetId:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
};

export const BALANCES_QUERY = `query Balances($filter: BalanceFilterInput) {
    balances(filter: $filter, first: 5) {
      nodes {
        amount
        assetId
      }
    }
  }`;

export const BALANCES_ARGS = {
    filter: {
      owner:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    },
  };

export const BLOCK_BY_HEIGHT_QUERY = `query Block($height: U64) {
    block(height: $height) {
      id
    }
  }`;

  export const BLOCK_BY_HEIGHT_ARGS = {
    height: '3412',
  };

  export const CONTRACT_BALANCE_QUERY = `query ContractBalance($contract: ContractId, $asset: AssetId) {
    contractBalance(contract: $contract, asset: $asset) {
      contract
      amount
      assetId
    }
  }`;


export const CONTRACT_BALANCE_ARGS = {
    contract:
      '0xc9a5366c269438d294ef942bc962dd2e6c86121e3bca00192723eb7eb58fa87d',
    asset: '0x0000000000000000000000000000000000000000000000000000000000000000',
};

export const CONTRACT_BALANCES_QUERY = `query ContractBalances($filter: ContractBalanceFilterInput!) {
    contractBalances(filter: $filter, first: 5) {
    nodes {
        amount
        assetId
    }
    }
}`;

export const CONTRACT_BALANCES_ARGS = {
    filter: {
        contract:
        '0x0a98320d39c03337401a4e46263972a9af6ce69ec2f35a5420b1bd35784c74b1',
    },
};

export const MESSAGE_INFO_QUERY = `query MessageInfo($address: Address) {
    messages(owner: $address, first: 5) {
      nodes {
        amount
        sender
        recipient
        nonce
        data
        daHeight
      }
    }
  }`;


export const MESSAGE_INFO_ARGS = {
    address:
      '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
};
  
export const LATEST_BLOCKS_QUERY = `query LatestBlocks {
    blocks(last: 5) {
      nodes {
        id
        transactions {
          id
          inputAssetIds
          inputs {
            __typename
            ... on InputCoin {
              owner
              utxoId
              amount
              assetId
            }
            ... on InputContract {
              utxoId
              contract {
                id
              }
            }
            ... on InputMessage {
              sender
              recipient
              amount
              data
            }
          }
          outputs {
            __typename
            ... on CoinOutput {
              to
              amount
              assetId
            }
            ... on ContractOutput {
              inputIndex
              balanceRoot
              stateRoot
            }
            ... on ChangeOutput {
              to
              amount
              assetId
            }
            ... on VariableOutput {
              to
              amount
              assetId
            }
            ... on ContractCreated {
              contract {
                id
              }
              stateRoot
            }
          }
          gasPrice
        }
      }
    }
  }`;

  export const LATEST_TRANSACTIONS_QUERY = `query LatestTransactions {
    transactions(last: 5) {
      nodes {
        id
        inputs {
          __typename
          ... on InputCoin {
            owner
            utxoId
            amount
            assetId
          }
          ... on InputContract {
            utxoId
            contract {
              id
            }
          }
          ... on InputMessage {
            sender
            recipient
            amount
            data
          }
        }
        outputs {
          __typename
          ... on CoinOutput {
            to
            amount
            assetId
          }
          ... on ContractOutput {
            inputIndex
            balanceRoot
            stateRoot
          }
          ... on ChangeOutput {
            to
            amount
            assetId
          }
          ... on VariableOutput {
            to
            amount
            assetId
          }
          ... on ContractCreated {
            contract {
              id
            }
            stateRoot
          }
        }
        status {
          __typename
          ... on FailureStatus {
            reason
            programState {
              returnType
            }
          }
        }
      }
    }
  }`;

export const TRANSACTIONS_QUERY = `query Transactions($address: Address) {
    transactionsByOwner(owner: $address, first: 5) {
      nodes {
        id
        inputs {
          __typename
          ... on InputCoin {
            owner
            utxoId
            amount
            assetId
          }
          ... on InputContract {
            utxoId
            contract {
              id
            }
          }
          ... on InputMessage {
            sender
            recipient
            amount
            data
          }
        }
        outputs {
          __typename
          ... on CoinOutput {
            to
            amount
            assetId
          }
          ... on ContractOutput {
            inputIndex
            balanceRoot
            stateRoot
          }
          ... on ChangeOutput {
            to
            amount
            assetId
          }
          ... on VariableOutput {
            to
            amount
            assetId
          }
          ... on ContractCreated {
            contract {
              id
            }
            stateRoot
          }
        }
        status {
          __typename
          ... on FailureStatus {
            reason
            programState {
              returnType
            }
          }
        }
      }
    }
  }`;

export const TRANSACTIONS_ARGS = {
    address:
    '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
};

export const ALL_QUERY_CONSTANTS = {
  BALANCE_QUERY,
  BALANCE_ARGS,
  BALANCES_QUERY,
  BALANCES_ARGS,
  BLOCK_BY_HEIGHT_QUERY,
  BLOCK_BY_HEIGHT_ARGS,
  CONTRACT_BALANCE_QUERY,
  CONTRACT_BALANCE_ARGS,
  CONTRACT_BALANCES_QUERY,
  CONTRACT_BALANCES_ARGS,
  MESSAGE_INFO_QUERY,
  MESSAGE_INFO_ARGS,
  LATEST_BLOCKS_QUERY,
  LATEST_TRANSACTIONS_QUERY,
  TRANSACTIONS_QUERY,
  TRANSACTIONS_ARGS,
};