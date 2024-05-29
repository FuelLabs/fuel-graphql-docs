import { LATEST_TRANSACTIONS_QUERY } from './queries';
import { Query } from './query';

export function LatestTransactions() {
  const args = {};
  return <Query query={LATEST_TRANSACTIONS_QUERY} args={args} />;
}
