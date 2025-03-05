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

export interface ICharacter {
  id: string;
  name: string;
  persona: string;
}

export interface IMessage {
  role: string;
  content: string;
}

export interface IMessageData {
  characterId: string;
  messages: IMessage[];
}

export interface IModel {
  id: string;
  name: string;
  is_internet: boolean;
}
export interface ISearchEngine {
  id: string;
  name: string;
  function: string;
}
