import { drive } from "./api";
import { carType } from "./types";

const marks = ['BMW', 'Chevrolet', 'Toyota', 'Lada', 'Mercedes', 'Porsche'];
const names = ['Gentra', 'Malibu', 'Matiz', 'X6', 'Vesta', '911', 'Camry'];

const getRandomName = () => {
  const mark = marks[Math.floor(Math.random() * marks.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  return `${mark} ${name}`;
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for(let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const animateCar = async (id: number, time: number) => {
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  car.style.animationDuration = `${time}ms`;
  car.style.animationFillMode = 'forwards'
  car.style.animationTimingFunction = 'linear';
  car.style.animationPlayState = 'running';
  car.style.animationIterationCount = '1';
  car.style.animationName = 'drive';

  car.onanimationend = function animationEndCar() {
      const times: number[] = JSON.parse(localStorage.getItem('times')!);
      if(!times.length) {
          times.push(id);
          localStorage.setItem('times', JSON.stringify(times));
          localStorage.setItem('carTime', JSON.stringify(time));
      }
  };

  const {success} = await drive(id);

  if(!success) {
      car.style.animationPlayState = 'paused';
  }
  
}

export const generateRandomCars = (count: number = 100) => new Array(count).fill(1).map(_ => ({name: getRandomName(), color: getRandomColor()}));
