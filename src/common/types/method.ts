export type Parameter = {
  name: string;
  value: string;
};

export type Method = {
  id: string;
  name: string;
  docs: string;
  inputs: { name: string; type: string }[];
  outputs: { type: string }[];
  params: Parameter[];
};
