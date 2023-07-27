import { carType, newCarType, winnerType } from './types';

const baseURL = 'http://localhost:3000';

const garage = `${baseURL}/garage`;
const engine = `${baseURL}/engine`;
const winners = `${baseURL}/winners`;

export const getCars = async (page?: number, _limit: number = 7) => {
  const res = await fetch(`${garage}?_page=${page}&_limit=${_limit}`);
  const obj: { items: carType[]; count: number | null } = {
    items: await res.json(),
    count: Number(res.headers.get('X-Total-Count')),
  };
  return obj;
};

export const getCar = async (id: number) => {
  const res: carType = await fetch(`${garage}/${id}`).then((res) => res.json());
  return res;
};

export const startEngine = async (id: number) => await fetch(`${engine}?id=${id}&status=started`, { method: 'PATCH' })
  .then((res) => res.json())
  .then((res) => res);
export const stopEngine = async (id: number) => await fetch(`${engine}?id=${id}&status=stopped`, { method: 'PATCH' })
  .then((res) => res.json())
  .then((res) => res);

export const drive = async (id: number) => {
  const res = await fetch(`${engine}?id=${id}&status=drive`, {
    method: 'PATCH',
  })
    .then((res) => res)
    .catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};

export const createCar = async (car: newCarType) => {
  await fetch(`${garage}`, {
    method: 'POST',
    body: JSON.stringify(car),
    headers: { 'Content-Type': 'application/json' },
  });
};

export const removeCar = async (id: number) => {
  await fetch(`${garage}/${id}`, { method: 'remove' });
};

export const updateCar = async (id: number, car: newCarType) => {
  await fetch(`${garage}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(car),
    headers: { 'Content-Type': 'application/json' },
  });
};

export const createWinner = async (winner: winnerType) => {
  await fetch(`${winners}`, {
    method: 'POST',
    body: JSON.stringify(winner),
    headers: { 'Content-Type': 'application/json' },
  });
};

export const getWinner = async (id: number) => await fetch(`${winners}/${id}`).then((res) => res.json());

export const updateWinner = async (id: number, winner: winnerType) => {
  await fetch(`${winners}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(winner),
    headers: { 'Content-Type': 'application/json' },
  });
};

export const removeWinner = async (id: number) => {
  await fetch(`${winners}/${id}`, { method: 'remove' });
};

export const getWinners = async (
  page?: number,
  _sort?: string,
  _order?: string,
  _limit: number = 10,
) => {
  const res = await fetch(
    `${winners}?_page=${page}&_limit=${_limit}&_order=${_order}&_sort=${_sort}`,
  );
  const obj = {
    items: await res.json(),
    count: Number(res.headers.get('X-Total-Count')),
  };
  return obj;
};
