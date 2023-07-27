import { listen, renderGarage } from './ui';
import { renderUI } from './main';

async function renderGarageAwait() {
  await renderUI();
  await renderGarage();
  listen();
}
renderGarageAwait();
