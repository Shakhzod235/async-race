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