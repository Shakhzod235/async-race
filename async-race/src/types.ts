export type carType = {
  id: number;
  name: string;
  color: string;
  isEngineActive?: boolean;
};

export type newCarType = {
  name: string;
  color: string;
};

export type winnerType = {
  id: number;
  wins: number;
  time: number;
};

export interface IStartDriving {
  (id: number): void;
}
