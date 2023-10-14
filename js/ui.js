import { confirmedLevelUp } from "./script.js";
import { confirmedReset } from "./script.js";

function toggleBox() {
  var box = document.getElementById("boxContainer");
  var openButton = document.getElementById("boxButton");
  if (box.style.display === "block") {
    box.style.display = "none";
    openButton.style.display = "block";
  } else {
    box.style.display = "block";
    openButton.style.display = "none";
  }
}

function levelUp() {
  const confirmationDialog = `
          <div class="confirmation-dialog">
              <h2>Are you sure you want to go up a level?</h2>
              <button class="yes-button" onclick="confirmedLevelUp()">Yes</button>
              <button onclick="cancelConfirmationDialog()">Cancel</button>
          </div>
      `;

  document.body.insertAdjacentHTML("beforeend", confirmationDialog);
}

function resetScores() {
  const confirmationDialog = `
          <div class="confirmation-dialog">
              <h2>Are you sure you want to reset your progress?</h2>
              <button class="yes-button" onclick="confirmedReset()">Yes</button>
              <button onclick="cancelConfirmationDialog()">Cancel</button>
          </div>
      `;

  document.body.insertAdjacentHTML("beforeend", confirmationDialog);
}

function cancelConfirmationDialog() {
  document.querySelector(".confirmation-dialog").remove();
}

window.toggleBox = toggleBox;
window.levelUp = levelUp;
window.resetScores = resetScores;
window.cancelConfirmationDialog = cancelConfirmationDialog;
window.confirmedReset = confirmedReset;
window.confirmedLevelUp = confirmedLevelUp;
