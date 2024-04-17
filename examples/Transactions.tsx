import { TRANSACTIONS_ARGS, TRANSACTIONS_QUERY } from './queries';
import { Query } from './query';

export function Transactions() {
  return <Query query={TRANSACTIONS_QUERY} args={TRANSACTIONS_ARGS} />;
}
