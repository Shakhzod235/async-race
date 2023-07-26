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

export const generateRandomCars = (count: number = 100) => new Array(count).fill(1).map(_ => ({name: getRandomName(), color: getRandomColor()}));
