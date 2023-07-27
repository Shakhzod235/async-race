import { renderCarImage } from "./carImage";
import { carType, newCarType, winnerType } from "./types";
import { createCar, createWinner, getCar, getCars, getWinner, getWinners, removeCar, removeWinner, startEngine, stopEngine, updateCar, updateWinner } from "./api";
import { animateCar, returnCarToBase, startRace, generateRandomCars } from "./utility";

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
        if((event.target as HTMLElement).classList.contains('race-btn')) {
            await startRace(startDriving);
            let id: number = 0;
            let ids: number[] = JSON.parse(localStorage.getItem('times')!);
            const resetBtn = document.querySelector('.reset-btn') as HTMLButtonElement;

            const timeInt = setInterval(async () => {
                ids = JSON.parse(localStorage.getItem('times')!);
                if(ids.length) {
                    ids = JSON.parse(localStorage.getItem('times')!);
                    const carTime = JSON.parse(localStorage.getItem('carTime')!);
                    clearInterval(timeInt);
                    id = ids[0];
                    const winner = await getCar(id);
                    const message = (document.querySelector('.modal-message') as HTMLElement);
                    const messageText = (document.querySelector('.message') as HTMLElement);
                    document.body.style.overflow = 'hidden';
                    message.style.display = 'flex';
                    messageText.innerHTML = `${winner.name} was first. Time: ${carTime/1000}s`;
                    let {wins} = await getWinner(id);
                    if(wins) {
                        await updateWinner(id, {id: id, wins: wins + 1, time: carTime});
                    } else {
                        await createWinner({id: id, wins: 1, time: carTime});
                    }
                    updateWinnerPage();
                    resetBtn.disabled = false;

                }
            }, 100);

            const raceBtn = document.querySelector('.race-btn') as HTMLButtonElement;
            const carStopBtns = Array.from(document.querySelectorAll('.car-stop-btn')) as HTMLButtonElement[];
            carStopBtns.forEach((btn: HTMLButtonElement)  => {btn.disabled = false});
            raceBtn.disabled = true;
            (document.querySelector('#create-name') as HTMLInputElement).disabled = true;
            (document.querySelector('#create-color') as HTMLInputElement).disabled = true;
            (document.querySelector('.create-btn') as HTMLInputElement).disabled = true;
            (document.querySelector('.generate-btn') as HTMLButtonElement).disabled = true;
        }
        if((event.target as HTMLElement).classList.contains('winner-reset')) {
            document.body.style.overflow = '';
            (document.querySelector('.modal-message') as HTMLElement).style.display = 'none';
            localStorage.setItem('times', JSON.stringify([]));
        }

        if((event.target as HTMLElement).classList.contains('reset-btn')) {
            page = Number(localStorage.getItem('page'));
            const ids: number[] = (await getCars(page)).items.map(car => car.id);
            (document.querySelector('#create-name') as HTMLInputElement).disabled = false;
            (document.querySelector('#create-color') as HTMLInputElement).disabled = false;
            (document.querySelector('.create-btn') as HTMLInputElement).disabled = false;
            (document.querySelector('.generate-btn') as HTMLButtonElement).disabled = false;
            (document.querySelector('.race-btn') as HTMLButtonElement).disabled = false;
            

            ids.forEach(async (id) => {
                returnCarToBase(id);
                const carStartBtn = document.querySelector(`#car-start-${id}`) as HTMLButtonElement;
                carStartBtn.disabled = false;
                const carStopBtn = document.querySelector(`#car-stop-${id}`) as HTMLButtonElement;
                carStopBtn.disabled = true;
                const raceBtn = document.querySelector('.race-btn') as HTMLButtonElement;
                raceBtn.disabled = false;
                const resetBtn = document.querySelector('.reset-btn') as HTMLButtonElement;
                resetBtn.disabled = true;
            })
        }

        if((event.target as HTMLElement).classList.contains('winners-btn')) {
            const winners = document.querySelector('.winners');
            winners?.classList.add('active');
            (document.querySelector('.winners-btn') as HTMLElement).classList.add('active');
            (document.querySelector('.garage-btn') as HTMLElement).classList.remove('active');
            (document.querySelector('body') as HTMLElement).style.overflow = 'hidden';
        }

        if((event.target as HTMLElement).classList.contains('garage-btn')) {
            const winners = document.querySelector('.winners');
            winners?.classList.remove('active');
            (document.querySelector('.winners-btn') as HTMLElement).classList.remove('active');
            (document.querySelector('.garage-btn') as HTMLElement).classList.add('active');
            (document.querySelector('body') as HTMLElement).style.overflow = '';
        }
        if((event.target as HTMLElement).classList.contains('create-btn')) {
            event.preventDefault();
            const createNameValue = (document.querySelector('#create-name') as HTMLInputElement).value;
            const createColorValue = (document.querySelector('#create-color') as HTMLInputElement).value;
            const newCar: newCarType = {name: createNameValue, color: createColorValue};
            page = Number(localStorage.getItem('page'));
            if(page === 0) {
                localStorage.setItem('page', '1');
            }
            await createCar(newCar);
            (document.querySelector('#create-name') as HTMLInputElement).value = '';
            (document.querySelector('#create-color') as HTMLInputElement).value = '#ffffff';
            await getCars();
            await updateGarage();
        }

        if((event.target as HTMLElement).classList.contains('car-remove-btn')) {
            event.preventDefault();
            page = Number(localStorage.getItem('page'));
            const cars = document.querySelectorAll('.car-item');
            if(cars.length - 1 === 0) {
                localStorage.setItem('page', `${page - 1}`);
            }
            const id: number = +(event.target as HTMLElement).id.split('remove-car-')[1];
            await removeWinner(id);
            updateWinnerPage();
            await removeCar(id);
            await getCars();
            await updateGarage();
        }
        if(!((event.target as HTMLElement).classList.contains('car-select-btn') || 
                (event.target as HTMLElement).classList.contains('update-btn') ||
                (event.target as HTMLElement).classList.contains('input-update') ||
                (event.target as HTMLElement).classList.contains('color-update'))
            ) {
            selectedId = null;
            (document.querySelector('.update-btn') as HTMLButtonElement).disabled = true;
            (document.querySelector('#update-name') as HTMLInputElement).disabled = true;
            (document.querySelector('#update-color') as HTMLInputElement).disabled = true;
            (document.querySelector('#update-name') as HTMLInputElement).value = '';
            (document.querySelector('#update-color') as HTMLInputElement).value = '#ffffff';
        }

        if((event.target as HTMLElement).classList.contains('update-btn')) {
            event.preventDefault();
            if(selectedId !== null) {
                const updateNameValue = (document.querySelector('#update-name') as HTMLInputElement).value;
                const updateColorValue = (document.querySelector('#update-color') as HTMLInputElement).value;
                const newCar: newCarType = {name: updateNameValue, color: updateColorValue};
                await updateCar(selectedId, newCar);
                await getCars();
                await updateGarage();
                selectedId = null;
                (document.querySelector('.update-btn') as HTMLButtonElement).disabled = true;
                (document.querySelector('#update-name') as HTMLInputElement).disabled = true;
                (document.querySelector('#update-color') as HTMLInputElement).disabled = true;
                (document.querySelector('#update-name') as HTMLInputElement).value = '';
                (document.querySelector('#update-color') as HTMLInputElement).value = '#ffffff';
            }
        }
        if((event.target as HTMLButtonElement).classList.contains('next-btn')) {
            event.preventDefault();
            const prevBtn = document.querySelector('#prev') as HTMLButtonElement;
            const nextBtn = document.querySelector('#next') as HTMLButtonElement;
            page = Number(localStorage.getItem('page'));
            const count: number | null = (await getCars(page)).count || 0;
            const cars: carType[] = (await getCars(page)).items;
            localStorage.setItem('page', `${page + 1}`);

            page = Number(localStorage.getItem('page'));
            if(page > 0) {
                prevBtn.disabled = false;
            }
            if(count <= page * MIN_ITEMS_PER_PAGE || cars.length < MIN_ITEMS_PER_PAGE) {
                nextBtn.disabled = true;
            }
            await updateGarage();
        }

        if((event.target as HTMLButtonElement).classList.contains('prev-btn')) {
            event.preventDefault();
            const prevBtn = document.querySelector('#prev') as HTMLButtonElement;
            const nextBtn = document.querySelector('#next') as HTMLButtonElement;
            nextBtn.disabled = false;
            page = Number(localStorage.getItem('page'));
            const count: number | null = (await getCars(page)).count;
            localStorage.setItem('page', `${page - 1}`);
            page = Number(localStorage.getItem('page'));
            if(page === 1) {
                prevBtn.disabled = true;
            }
            await updateGarage();
        }

        if((event.target as HTMLButtonElement).classList.contains('generate-btn')) {
            (event.target as HTMLButtonElement).disabled = true;
            const cars = generateRandomCars();
            await Promise.all(cars.map(async c => await createCar(c)));
            await updateGarage();
            (event.target as HTMLButtonElement).disabled = false;
        }

        if((event.target as HTMLButtonElement).classList.contains('next-table')) {
            event.preventDefault();
            const prevBtn = document.querySelector('.prev-table') as HTMLButtonElement;
            const nextBtn = document.querySelector('.next-table') as HTMLButtonElement;
            tablePage = Number(localStorage.getItem('tablePage'));
            const count: number | null = (await getWinners(tablePage)).count || 0;
            const winnersList: winnerType[] = (await getWinners(tablePage)).items;
            localStorage.setItem('tablePage', `${tablePage + 1}`);

            tablePage = Number(localStorage.getItem('tablePage'));
            if(tablePage > 0) {
                prevBtn.disabled = false;
            }
            if(count <= tablePage * 10 || winnersList.length < 10) {
                nextBtn.disabled = true;
            }
            await updateWinnerPage();
        }

        if((event.target as HTMLButtonElement).classList.contains('prev-table')) {
            event.preventDefault();
            const prevBtn = document.querySelector('.prev-table') as HTMLButtonElement;
            const nextBtn = document.querySelector('.next-table') as HTMLButtonElement;
            nextBtn.disabled = false;
            tablePage = Number(localStorage.getItem('tablePage'));
            const count: number | null = (await getWinners(tablePage)).count;
            localStorage.setItem('tablePage', `${tablePage - 1}`);
            tablePage = Number(localStorage.getItem('tablePage'));
            if(tablePage === 1) {
                prevBtn.disabled = true;
            }
            await updateWinnerPage();
        }
        
        if((event.target as HTMLElement).classList.contains('winner-sort')) {
            event.target?.addEventListener('click', () => {
                localStorage.setItem('sort', 'wins');
                let order = localStorage.getItem('order');
                localStorage.setItem('order', order === 'ASC' ? 'DESC' : 'ASC');
                updateWinnerPage();
            });
        }

        if((event.target as HTMLElement).classList.contains('id-sort')) {
            event.target?.addEventListener('click', () => {
                localStorage.setItem('sort', 'id');
                let order = localStorage.getItem('order');
                localStorage.setItem('order', order === 'ASC' ? 'DESC' : 'ASC');
                updateWinnerPage();
            });
        }

        if((event.target as HTMLElement).classList.contains('time-sort')) {
            event.target?.addEventListener('click', () => {
                localStorage.setItem('sort', 'time');
                let order = localStorage.getItem('order');
                localStorage.setItem('order', order === 'ASC' ? 'DESC' : 'ASC');
                updateWinnerPage();
            });
        }
    });
}
