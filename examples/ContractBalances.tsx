import { CONTRACT_BALANCES_ARGS, CONTRACT_BALANCES_QUERY } from './queries';
import { Query } from './query';

export function ContractBalances() {
  return <Query query={CONTRACT_BALANCES_QUERY} args={CONTRACT_BALANCES_ARGS} />;
}
