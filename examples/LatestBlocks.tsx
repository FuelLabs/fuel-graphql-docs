import { LATEST_BLOCKS_QUERY } from './queries';
import { Query } from './query';

export function LatestBlocks() {
  const args = {};
  return <Query query={LATEST_BLOCKS_QUERY} args={args} />;
}
