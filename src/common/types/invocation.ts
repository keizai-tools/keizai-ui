import { EventResponse } from './contract-events';
import { Method } from './method';

export type Invocation = {
	id: string;
	name: string;
	contractId?: string;
	folder?: {
		id: string;
		name: string;
	};
	methods?: Method[];
	selectedMethod?: Method;
	parameters?: { key: string; value: string }[] | null;
	secretKey?: string;
	publicKey?: string;
	preInvocation?: string;
	postInvocation?: string;
};

export type InvocationResponse = {
	method: Method;
	response: string;
	status: string;
	events: EventResponse[];
};

export const SCSpecTypeMap = {
	SC_SPEC_TYPE_VAL: 'Val',
	SC_SPEC_TYPE_BOOL: 'Bool',
	SC_SPEC_TYPE_VOID: 'Void',
	SC_SPEC_TYPE_ERROR: 'Error',
	SC_SPEC_TYPE_U32: 'U32',
	SC_SPEC_TYPE_I32: 'I32',
	SC_SPEC_TYPE_U64: 'U64',
	SC_SPEC_TYPE_I64: 'I64',
	SC_SPEC_TYPE_TIMEPOINT: 'Timepoint',
	SC_SPEC_TYPE_DURATION: 'Duration',
	SC_SPEC_TYPE_U128: 'U128',
	SC_SPEC_TYPE_I128: 'I128',
	SC_SPEC_TYPE_U256: 'U256',
	SC_SPEC_TYPE_I256: 'I256',
	SC_SPEC_TYPE_BYTES: 'Bytes',
	SC_SPEC_TYPE_STRING: 'String',
	SC_SPEC_TYPE_SYMBOL: 'Symbol',
	SC_SPEC_TYPE_ADDRESS: 'Address',
	SC_SPEC_TYPE_OPTION: 'Option',
	SC_SPEC_TYPE_RESULT: 'Result',
	SC_SPEC_TYPE_VEC: 'Vec',
	SC_SPEC_TYPE_MAP: 'Map',
	SC_SPEC_TYPE_TUPLE: 'Tuple',
	SC_SPEC_TYPE_BYTES_N: 'Bytes N',
	SC_SPEC_TYPE_UDT: 'UDT',
};

export function isKeyOfSCSpecTypeMap(
	key: string,
): key is keyof typeof SCSpecTypeMap {
	return key in SCSpecTypeMap;
}
