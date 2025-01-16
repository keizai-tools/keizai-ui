import NETWORKS from '../constants/networks';

import { NETWORK } from '@/common/types/soroban.enum';

export default function getUrl(network: Partial<NETWORK>): string | null {
  let url = NETWORKS[network] ?? null;
  if (url && url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
}
