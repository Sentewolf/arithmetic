import * as Backend from "./Backend.js";
import * as utils from "./utils.js";

let correctAnswer = null;
let taskType = "";
let startTime;
let goodCounter = 0;
let userInput = null;
let taskFailed = false;

document.addEventListener("DOMContentLoaded", function () {
  userInput = document.getElementById("user-answer");

  // Focus on the input field when the page loads
  // userInput.focus();
  userInput.blur();

  // Listen for key presses globally
  document.addEventListener("keydown", function (event) {
    let keyPressed = event.key;

    if (keyPressed === "Enter") {
      // Trigger action to go to the next question (e.g., fetch new task)
      wrongAnswer();
    } else {
      // If the input field is not focused, manually add the key press to the text element
      if (document.activeElement != userInput) {
        if (event.key >= "0" && event.key <= "9") {
          userInput.textContent += keyPressed;
          onInputChange();
        } else if (event.key === "Backspace") {
          userInput.textContent = userInput.textContent.slice(0, -1);
        } else if (event.key === "Delete") {
          userInput.textContent = ""; // Set the content to an empty string
          onInputChange();
        }
      }
    }
  });

  function toggleOperation(operation) {
    const operationElement = document.getElementById(operation);
    operationElement.classList.toggle("active");

    let progressData = getProgressDataFromCookie();
    progressData[operation] = operationElement.classList.contains("active");
    setProgressDataInCookie(progressData);
  }

  function initializeOperations() {
    let progressData = getProgressDataFromCookie();

    const operations = [
      "addition",
      "subtraction",
      "multiplication",
      "division",
    ];

    operations.forEach((operation) => {
      const operationElement = document.getElementById(operation);

      if (progressData.hasOwnProperty(operation)) {
        if (progressData[operation]) {
          operationElement.classList.add("active");
        } else {
          operationElement.classList.remove("active");
        }
      }
    });
  }

  function onInputChange() {
    let userAnswer = userInput.textContent;

    if (!isNaN(userAnswer)) {
      checkAnswer(userAnswer);
    }
  }

  userInput.addEventListener("input", onInputChange);

  document
    .getElementById("addition")
    .addEventListener("click", () => toggleOperation("addition"));
  document
    .getElementById("subtraction")
    .addEventListener("click", () => toggleOperation("subtraction"));
  document
    .getElementById("multiplication")
    .addEventListener("click", () => toggleOperation("multiplication"));
  document
    .getElementById("division")
    .addEventListener("click", () => toggleOperation("division"));

  // Initial setup
  initializeOperations();
  updateScores(getProgressDataFromCookie());
  getNewTask();
});

export function confirmedLevelUp() {
  cancelConfirmationDialog();
  const selectedOperations = getSelectedOperations();
  let progressData = getProgressDataFromCookie();

  progressData = Backend.level_up(selectedOperations, progressData);
  // Update progress data with data received from the backend
  setProgressDataInCookie(progressData);
  updateScores(progressData);
}

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/`;
}

// Function to get a cookie value
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

// Set the entire JSON object in a cookie
function setProgressDataInCookie(data) {
  setCookie("progress_data", JSON.stringify(data), 365);
}

// Get the entire JSON object from a cookie
function getProgressDataFromCookie() {
  const cookieValue = getCookie("progress_data");
  if (cookieValue !== "undefined") {
    return JSON.parse(cookieValue);
  }
  return null;
}

export function confirmedReset() {
  cancelConfirmationDialog();
  setProgressDataInCookie(null);
  updateScores(getProgressDataFromCookie());
}

function updateScores(progressData) {
  let data = Backend.get_scores(progressData);

  document.getElementById("addition-score").textContent = data.addition;
  document.getElementById("subtraction-score").textContent = data.subtraction;
  document.getElementById("multiplication-score").textContent =
    data.multiplication;
  document.getElementById("division-score").textContent = data.division;
}

function getSelectedOperations() {
  const selectedOperations = [];

  const additionIcon = document.getElementById("addition");
  const subtractionIcon = document.getElementById("subtraction");
  const multiplicationIcon = document.getElementById("multiplication");
  const divisionIcon = document.getElementById("division");

  if (additionIcon.classList.contains("active")) {
    selectedOperations.push("addition");
  }

  if (subtractionIcon.classList.contains("active")) {
    selectedOperations.push("subtraction");
  }

  if (multiplicationIcon.classList.contains("active")) {
    selectedOperations.push("multiplication");
  }

  if (divisionIcon.classList.contains("active")) {
    selectedOperations.push("division");
  }

  return selectedOperations;
}

function getNewTask() {
  const selectedOperations = getSelectedOperations();
  const progressData = getProgressDataFromCookie();
  let data = Backend.get_new_task(selectedOperations, progressData);
  let task = data.task;
  // Display the task and store the correct answer
  document.getElementById("math-problem").textContent = task;
  // Store correct answer for later validation
  correctAnswer = data.correctAnswer.toFixed(0);
  taskType = data.task_type;

  taskFailed = false;
  startTime = new Date(); // Record the start time
}

function wrongAnswer() {
  userInput.textContent = correctAnswer;
  // Trigger background animation and send results simultaneously
  Promise.all([animateBackground(false), sendResults(false)]).then(() => {
    // Once both animations and fetch are complete, clear input and get new task
    clearInput();
    getNewTask();
  });
}

function checkDifferentSubstrings(userAnswer, correctAnswer) {
  if (userAnswer.length === 0 || correctAnswer.length === 0) {
    return false;
  }

  let minLength = Math.min(userAnswer.length, correctAnswer.length);
  let userSubstring = userAnswer.slice(0, minLength);
  let correctSubstring = correctAnswer.slice(0, minLength);

  return userSubstring !== correctSubstring;
}

function checkAnswer(userAnswer) {
  if (userAnswer === correctAnswer) {
    goodCounter += 1;
    // Trigger background animation and send results simultaneously
    Promise.all([
      animateBackground(),
      sendResults(!taskFailed), // if task already failed, then silently send a failure message
      pop(),
    ]).then(() => {
      // Once both animations and fetch are complete, clear input and get new task
      clearInput();
      getNewTask();
    });
  } else if (checkDifferentSubstrings(userAnswer, correctAnswer)) {
    taskFailed = true;
  }
}

function sendResults(result) {
  let progressData = getProgressDataFromCookie();
  const endTime = new Date();
  const elapsedTime = (endTime - startTime) / 1000;

  progressData = Backend.complete_task(
    progressData,
    taskType,
    elapsedTime,
    result,
  );
  setProgressDataInCookie(progressData);
  updateScores(progressData);
  return progressData;
}

function animateBackground(good = true) {
  return new Promise((resolve) => {
    const gameContainer = document.querySelector(".game-container");
    if (good) {
      gameContainer.classList.add("correct-answer-animation");
      // Add a timeout to simulate the animation duration
      setTimeout(() => {
        gameContainer.classList.remove("correct-answer-animation");
        resolve(); // Resolve the promise after animation
      }, 500); // Animation duration in milliseconds
    } else {
      gameContainer.classList.add("incorrect-answer-animation");
      // Add a timeout to simulate the animation duration
      setTimeout(() => {
        gameContainer.classList.remove("incorrect-answer-animation");
        resolve(); // Resolve the promise after animation
      }, 500); // Animation duration in milliseconds
    }
  });
}
function clearInput() {
  userInput.textContent = "";
}

// The pop() function is called on every click
function pop() {
  if (goodCounter < 20) {
    return;
  }
  goodCounter = 0;
  var rect = userInput.getBoundingClientRect();
  let x = rect.left + rect.width / 2;
  let y = rect.top + rect.height / 2;
  // Loop to generate 30 particles at once
  for (let i = 0; i < 30; i++) {
    // We pass the mouse coordinates to the createParticle() function
    createParticle(x, y);
  }
}

function createParticle(x, y) {
  //https://css-tricks.com/playing-with-particles-using-the-web-animations-api/
  // Create a custom particle element
  const particle = document.createElement("particle");
  // Append the element into the body
  document.body.appendChild(particle);

  // Calculate a random size from 5px to 25px
  const size = utils.randint(5, 25);
  // Apply the size on each particle
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  // Generate a random color in a blue/purple palette
  particle.style.background = `hsl(${utils.randint(0, 255)}, 90%, 60%)`;

  // Generate a random x & y destination within a distance of 75px from the mouse
  const destinationX = x + utils.randint(-300, 300);
  const destinationY = y + utils.randint(-300, 300);

  // Store the animation in a variable because we will need it later
  const animation = particle.animate(
    [
      {
        // Set the origin position of the particle
        // We offset the particle with half its size to center it around the mouse
        transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
        opacity: 1,
      },
      {
        // We define the final coordinates as the second keyframe
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 0,
      },
    ],
    {
      duration: utils.randint(1500, 2500),
      easing: "cubic-bezier(0, .9, .57, 1)",
      // Delay every particle with a random value from 0ms to 200ms
      delay: Math.random() * 200,
    },
  );

  // When the animation is finished, remove the element from the DOM
  animation.onfinish = () => {
    particle.remove();
  };
}
