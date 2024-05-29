export const BALANCE_QUERY = `query Balance($address: Address, $assetId: AssetId) {
    balance(owner: $address, assetId: $assetId) {
      owner
      amount
      assetId
    }
  }`;

export const BALANCE_ARGS = {
  address: '0xce9f8d9367fc4671c0ececce7ab603f6f75d1e66082a82ad12ecdc219b308820',
  assetId: '0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea',
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
    owner: '0xce9f8d9367fc4671c0ececce7ab603f6f75d1e66082a82ad12ecdc219b308820',
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
    '0xf5b08689ada97df7fd2fbd67bee7dea6d219f117c1dc9345245da16fe4e99111',
  asset: '0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea',
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
      '0xf5b08689ada97df7fd2fbd67bee7dea6d219f117c1dc9345245da16fe4e99111',
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
  address: '0xce9f8d9367fc4671c0ececce7ab603f6f75d1e66082a82ad12ecdc219b308820',
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
              contractId
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
              contract
              stateRoot
            }
          }
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
            contractId
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
            contract
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
          contractId
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
          contract
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
  address: '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
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
