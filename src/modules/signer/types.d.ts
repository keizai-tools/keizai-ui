import { MessageEventType, WalletType } from './constants/enums';

export interface ISignMessage {
	signedXDR: string;
}

export interface IConnectMessage {
	publicKey: string;
	wallet: WalletType;
}

export interface SignerResponse<
	T extends ISignMessage | IConnectMessage,
> {
	type: MessageEventType;
	page: string;
	message: T;
}

export interface IOperationGroup {
	from: number;
	to: number;
	title: string;
	description: string;
}

export interface IBaseConfig {
	url: string;
	origin: string;
}

export interface ISignConfig extends IBaseConfig {
	xdr: string;
	description?: string;
	operationGroups?: IOperationGroup[];
}

export interface IConnectConfig extends IBaseConfig {
	wallets?: WalletType[];
}

export type ConfigType<T> = T extends ISignMessage
	? ISignConfig
	: IConnectConfig;
