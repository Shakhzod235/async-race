import {
  renderHeader, renderGarage, renderWinner, renderFooter,
} from './ui';

export const renderUI = async () => {
  const html = `
    ${renderHeader()}
    <div class="garage">
      <div class="garage-control">
        <div class="garage-container">
          <form class="form" id="create">
            <input class="input" id="create-name" name="name" type="text" placeholder="Car model" />
            <input class="color" id="create-color" name="color" type="color" value="#ffffff" />
            <button class="garage-btn create-btn" type="submit">Create</button>
          </form>
          <form class="form" id="update">
            <input class="input input-update" id="update-name" disabled name="name" type="text" placeholder="Car model" />
            <input class="color color-update" id="update-color" disabled name="color" type="color" value="#ffffff" />
            <button class="garage-btn update-btn" disabled type="submit">Update</button>
          </form>
        </div>
        <div class="control-panel">
          <button class="btn race-btn" id="race">Race</button>
          <button class="btn reset-btn" disabled id="reset">Reset</button>
          <button class="btn generate-btn" id="generate">Generate</button>
        </div>
      </div>
      <div class="garage-cars">
        ${await renderGarage()}
      </div>
      <div class="modal-message">
        <div class="modal-message-container">
          <p class="message"></p>
          <button class="winner-reset">Take reset</button>
        </div>
      </div>
    </div>
    <div class="winners">
      ${await renderWinner()}
    </div>
      ${renderFooter()}
    `;
  const root = document.createElement('div');
  root.innerHTML = html;
  document.appendChild(root);
};
