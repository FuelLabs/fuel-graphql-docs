import { BALANCE_ARGS, BALANCE_QUERY } from './queries';
import { Query } from './query';

export function Balance() {
  return <Query query={BALANCE_QUERY} args={BALANCE_ARGS} />;
}
