import { renderHeader, renderFooter } from "./ui";

const renderUI = async () => {
  const html = `
    ${renderHeader()}
    ${renderFooter()}
  `;
  const root = document.createElement('div');
  root.innerHTML = html;
  document.appendChild(root);
}
