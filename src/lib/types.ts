export type BinType = 'plastic' | 'glass' | 'paper' | 'organic';

export type User = {
  id: string;
  username: string;
  password?: string;
  role: 'citizen' | 'collector' | 'admin';
  points?: number;
  approved?: boolean;
};

export type Bin = {
  id: string;
  type: BinType;
  location: {
    lat: number;
    lng: number;
  };
  fillLevel: number;
  status: 'ok' | 'full' | 'broken';
  notes?: { text: string; date: string }[];
};

export type Report = {
  id: string;
  binId: string;
  userId: string;
  type: 'full' | 'broken';
  status: 'pending' | 'resolved';
  date: string;
};
