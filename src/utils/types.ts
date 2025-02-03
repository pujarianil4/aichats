// NOTE: Please create all interfaces in alphabatic order

export interface AgentData {
  id: string;
  name: string;
  pic: string;
  token: Token;
  telegram: string | null;
  discord: string | null;
  x: string | null;
  desc: string;
  typ: string;
  vibility: string | null;
  uid?: string;
  instructions?: string[];
  personality?: string;
}

export interface Token {
  tkr: string;
  tCAddress: string;
}
