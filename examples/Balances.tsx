import { BALANCES_ARGS, BALANCES_QUERY } from './queries';
import { Query } from './query';

export function Balances() {
  return <Query query={BALANCES_QUERY} args={BALANCES_ARGS} />;
}
