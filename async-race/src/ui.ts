import { renderCarImage } from "./carImage";
import { carType, newCarType, winnerType } from "./types";
import { createCar, createWinner, getCar, getCars, getWinner, getWinners, deleteCar, deleteWinner, startEngine, stopEngine, updateCar, updateWinner } from "./api";
import { animateCar, returnCarToBase } from "./utility";

const MIN_ITEMS_PER_PAGE: number = 7;
let selectedId: number | null = null;
localStorage.setItem('page', '1');
let page: number = Number(localStorage.getItem('page'));
localStorage.setItem('times', JSON.stringify([]));
localStorage.setItem('tablePage', '1');
let tablePage: number = Number(localStorage.getItem('tablePage'));

export const renderHeader = () => `
    <header class="header">
        <div class="header__wrapper">
            <button class="header__btn garage-btn active" id="btnToGarage">Garage</button>
            <button class="header__btn winners-btn" id="btnToWinners">Winners</button>
        </div>
    </header>
`;

const renderCar = ({id, name, color}: carType) => `
    <div class="car-buttons">
        <button class="car-btn car-select-btn" id="select-car-${id}">Select</button>
        <button class="car-btn car-remove-btn" id="remove-car-${id}">Remove</button>
        <p class="car-title">${name}</p>
    </div>
    <div class="car-road">
        <div class="car-wrapper">
            <div class="car-control">
                <button class="car-control-btn car-start-btn" id="car-start-${id}">A</button>
                <button class="car-control-btn car-stop-btn" disabled id="car-stop-${id}">B</button>
            </div>
            <div class="car-full-road">
                <div class="car" id="car-${id}">
                    ${renderCarImage(color)}
                </div>
            </div>
            <div class="flag">
                <img src="./images/flag.png" class="flag-img" />
            </div>
            <div style="width: 100px"></div>
        </div>
    </div>
`;

export const renderGarage = async () => {
  page = Number(localStorage.getItem('page'));
  const cars: carType[] = (await getCars(page)).items;
  const count: number | null = (await getCars(page)).count;
  const pageCount: number = Math.ceil((count || 1) / MIN_ITEMS_PER_PAGE);
  
  return `
    ${cars.length ? `<h2 class="num-of-cars">Garage ${count}</h2>
    <h3 class="page">Page: ${page}</h3>
    <div class="pagination">
        <button class="pagination-btn prev-btn" ${(page === 1 || count === 0) ? "disabled" : ""} id="prev">prev</button>
        <button class="pagination-btn next-btn" ${pageCount === page ? "disabled" : ""} id="next">next</button>
    </div>
    <ul class="garage">
        ${cars.map((car: carType) => `
            <li class="car-item">${renderCar(car)}</li>
        `).join('')}
    </ul>` : '<p class ="empty-garage">No cars in the garage.</p>'}
  `
};

export const renderWinner = async () => {
  tablePage = Number(localStorage.getItem('tablePage'));
  const sort = localStorage.getItem('sort') || '';
  const order = localStorage.getItem('order') || 'ASC';
  const winnersList: winnerType[] = await (await getWinners(tablePage, sort, order).then(res => res)).items;
  const cars: carType[] = await Promise.all(winnersList.map(({id}) => getCar(id)));
  const count: number = (await getWinners(tablePage)).count;
  const pageCount: number = Math.ceil((count || 1) / 10);

  return (`
      <div class="winner-container">
          <h2 class="winner-title">Winners Table - ${count}</h2>
          <p>Page: #${tablePage}</p>
          <div class="table-buttons">
              <button class="table-buttons__button prev-table" ${(tablePage === 1 || count === 0) ? "disabled" : ""}>Prev</button>
              <button class="table-buttons__button next-table" ${pageCount === page ? "disabled" : ""}>Next</button>
          </div>

          ${winnersList.length ? `<table class="winner-table">
          <thead>
              <tr>
                  <th class="winner-table__th id-sort">№</th>
                  <th class="winner-table__th">Car</th>
                  <th class="winner-table__th">Name</th>
                  <th class="winner-table__th winner-sort">Wins</th>
                  <th class="winner-table__th time-sort">Best Time</th>
              </tr>
          </thead>
          <tbody>
          ${
              cars.map((car) => {
                  const findIndex: number = winnersList.findIndex(winner => winner.id === car.id);

                  return(`
                      <tr>
                          <td class="winner-table__td">${car.id}</td>
                          <td class="winner-table__td">${renderCarImage(car.color)}</td>
                          <td class="winner-table__td">${car.name}</td>
                          <td class="winner-table__td">${winnersList[findIndex].wins}</td>
                          <td class="winner-table__td">${winnersList[findIndex].time/1000}s</td>
                      </tr>
                  `);
              }).join('')
          }
          </tbody>
      </table>` : 'No winners. You can return to race page and define winner!'}
      </div>
  `);
}

export const renderFooter = () => `
    <footer class="footer">
      <div class="footer__container">
          <a href="//github.com/Shakhzod235">
              <img class="footer__github-logo" alt="github-logo" src="./images/github-mark.png"/>
          </a>
          <p>26.07.2023</p>
      </div>
    </footer>
`;

const startDriving = async (id: number) => {
    const startBtn = document.querySelector(`#car-start-${id}`) as HTMLButtonElement;
    startBtn.disabled = true;

    const { velocity, distance } = await startEngine(id);
    const time = Math.round(distance/velocity);

    animateCar(id, time);
} 

const returnCar = async (id: number) => {
    const stopBtn = document.querySelector(`#car-stop-${id}`) as HTMLButtonElement;
    stopBtn.disabled = true;

    returnCarToBase(id);
}

const updateGarage = async () => {
    const garageWrapper = document.querySelector('.garage-cars') as HTMLElement;
    garageWrapper.innerHTML = await renderGarage();
}

const updateWinnerPage = async () => {
    const winnersWrapper = document.querySelector('.winners') as HTMLElement;
    winnersWrapper.innerHTML = await renderWinner();
}

export const listen = () => {
    document.body.addEventListener('click', async (event: Event) => {
        if((event.target as HTMLElement).classList.contains('car-start-btn')) {
            const id: number = +(event.target as HTMLElement).id.split('car-start-')[1];
            const carStopBtn = document.querySelector(`#car-stop-${id}`) as HTMLButtonElement;
            carStopBtn.disabled = false;
            await startDriving(id);
        }

        if((event.target as HTMLElement).classList.contains('car-stop-btn')) {
            const id: number = +(event.target as HTMLElement).id.split('car-stop-')[1];
            const carStartBtn = document.querySelector(`#car-start-${id}`) as HTMLButtonElement;
            carStartBtn.disabled = false;
            const carStopBtn = document.querySelector(`#car-stop-${id}`) as HTMLButtonElement;
            carStopBtn.disabled = true;
            await returnCar(id);
        }
    });
}
