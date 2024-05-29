import { MESSAGE_INFO_ARGS, MESSAGE_INFO_QUERY } from './queries';
import { Query } from './query';

export function MessageInfo() {
  return <Query query={MESSAGE_INFO_QUERY} args={MESSAGE_INFO_ARGS} />;
}
