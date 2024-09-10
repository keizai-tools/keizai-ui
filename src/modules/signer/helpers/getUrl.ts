import NETWORKS from '../constants/networks';

import { NETWORK } from '@/common/types/soroban.enum';

export default function getUrl(network: Partial<NETWORK>): string | null {
  return NETWORKS[network] ?? null;
}
