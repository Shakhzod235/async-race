import { carImage } from "./car-image";
import { carType, newCarType, winnerType } from "./types";
import { createCar, createWinner, getCar, getCars, getWinner, getWinners, deleteCar, deleteWinner, startEngine, stopEngine, updateCar, updateWinner } from "./api";

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
                    ${carImage(color)}
                </div>
            </div>
            <div class="flag">
                <img src="./images/flag.png" class="flag-img" />
            </div>
            <div style="width: 100px"></div>
        </div>
    </div>
`;

const renderGarage = async () => {
  page = Number(localStorage.getItem('page'));
  const cars: carType[] = (await getCars(page)).items;
  const count: number | null = (await getCars(page)).count;
  const pageCount: number = Math.ceil((count || 1) / MIN_ITEMS_PER_PAGE);
  
  return `
    ${cars.length ? `<h2>Garage ${count}</h2>
    <h3>Page: ${page}</h3>
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