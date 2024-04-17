import { BLOCK_BY_HEIGHT_QUERY, BLOCK_BY_HEIGHT_ARGS } from './queries';
import { Query } from './query';

export function BlockByHeight() {
  return <Query query={BLOCK_BY_HEIGHT_QUERY} args={BLOCK_BY_HEIGHT_ARGS} />;
}
