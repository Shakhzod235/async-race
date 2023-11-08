import { listen, render, renderGarage } from "./ui";

async function renderGarageAwait() {
    await render();
    await renderGarage();
    listen();
}
renderGarageAwait();
