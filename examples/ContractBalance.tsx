import { CONTRACT_BALANCE_QUERY, CONTRACT_BALANCE_ARGS } from './queries';
import { Query } from './query';

export function ContractBalance() {
  return <Query query={CONTRACT_BALANCE_QUERY} args={CONTRACT_BALANCE_ARGS} />;
}
