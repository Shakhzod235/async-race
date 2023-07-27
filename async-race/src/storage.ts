import { getCars } from "./api";
import { carType } from "./types";

async function getCarsArray() {
    const cars: carType[] = (await getCars()).items;
    return cars;
}
getCarsArray();

export default {
    cars: getCarsArray(),
}
