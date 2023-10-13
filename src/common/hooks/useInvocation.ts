import React from 'react';

import { InvocationContext } from '@/providers/InvocationProvider';

export const useInvocation = () => React.useContext(InvocationContext);
