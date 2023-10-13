let correctAnswer = null;
let taskType = "";
let startTime;
let goodCounter = 0;
let userInput = null;
let taskFailed = false;

document.addEventListener('DOMContentLoaded', function () {

    userInput = document.getElementById('user-answer');

    // Focus on the input field when the page loads
    // userInput.focus();
    userInput.blur();

    // Listen for key presses globally
    document.addEventListener('keydown', function (event) {
        let keyPressed = event.key;

        if (keyPressed === 'Enter') {
            // Trigger action to go to the next question (e.g., fetch new task)
            wrongAnswer();
        } else {
            // If the input field is not focused, manually add the key press to the text element
            if (document.activeElement != userInput) {
                if (event.key >= '0' && event.key <= '9') {
                    userInput.textContent += keyPressed;
                    onInputChange();
                } else if (event.key === 'Backspace') {
                    userInput.textContent = userInput.textContent.slice(0, -1);
                } else if (event.key === 'Delete') {
                    userInput.textContent = ''; // Set the content to an empty string
                    onInputChange();
                }
            }
        }
    });

    function toggleOperation(operation) {
        const operationElement = document.getElementById(operation);
        const isActive = operationElement.classList.toggle('active');

        if (isActive) {
            selectedOperation = operation;
        } else {
            selectedOperation = null;
        }
    }

    function onInputChange() {
        let userAnswer = userInput.textContent;

        if (!isNaN(userAnswer)) {
            checkAnswer(userAnswer);
        }
    }

    userInput.addEventListener('input', onInputChange);

    document.getElementById('addition').addEventListener('click', () => toggleOperation('addition'));
    document.getElementById('subtraction').addEventListener('click', () => toggleOperation('subtraction'));
    document.getElementById('multiplication').addEventListener('click', () => toggleOperation('multiplication'));
    document.getElementById('division').addEventListener('click', () => toggleOperation('division'));


    // Initial setup
    updateScores(getProgressDataFromCookie());
    getNewTask();
});

function toggleBox() {
    var box = document.getElementById("boxContainer");
    var openButton = document.getElementById("boxButton");
    if (box.style.display === "block") {
        box.style.display = "none";
        openButton.style.display = "block";
    } else {
        box.style.display = "block";
        openButton.style.display = "none"
    }
}

function confirmedLevelUp() {
    cancelConfirmationDialog();
    const selectedOperations = getSelectedOperations();
    let progressData = getProgressDataFromCookie();

    fetch('http://localhost:5000/level-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            selectedOperations: selectedOperations,
            progressData: progressData
        }),
    })
        .then(response => response.json())

        .then(data => {
            progressData = data.progressData
            // Update progress data with data received from the backend
            setProgressDataInCookie(progressData);
            updateScores(progressData);

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

// Function to get a cookie value
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

// Set the entire JSON object in a cookie
function setProgressDataInCookie(data) {
    setCookie('progress_data', JSON.stringify(data), 365);
}

// Get the entire JSON object from a cookie
function getProgressDataFromCookie() {
    const cookieValue = getCookie('progress_data');
    if (cookieValue !== "undefined") {
        return JSON.parse(cookieValue);
    }
    return null;
}

function levelUp() {
    const confirmationDialog = `
        <div class="confirmation-dialog">
            <h2>Are you sure you want to go up a level?</h2>
            <button class="yes-button" onclick="confirmedLevelUp()">Yes</button>
            <button onclick="cancelConfirmationDialog()">Cancel</button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmationDialog);
}

function resetScores() {
    const confirmationDialog = `
        <div class="confirmation-dialog">
            <h2>Are you sure you want to reset your progress?</h2>
            <button class="yes-button" onclick="confirmedReset()">Yes</button>
            <button onclick="cancelConfirmationDialog()">Cancel</button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmationDialog);
}

function confirmedReset() {
    cancelConfirmationDialog();
    setProgressDataInCookie(null);
    updateScores(getProgressDataFromCookie());
}

function cancelConfirmationDialog() {
    document.querySelector('.confirmation-dialog').remove();
}

function updateScores(progressData) {
    fetch('http://localhost:5000/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            progressData: progressData,
        }),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('addition-score').textContent = data.addition;
            document.getElementById('subtraction-score').textContent = data.subtraction;
            document.getElementById('multiplication-score').textContent = data.multiplication;
            document.getElementById('division-score').textContent = data.division;
        })
        .catch(error => console.error('Error:', error));
}

function getSelectedOperations() {
    const selectedOperations = [];

    const additionIcon = document.getElementById('addition');
    const subtractionIcon = document.getElementById('subtraction');
    const multiplicationIcon = document.getElementById('multiplication');
    const divisionIcon = document.getElementById('division');

    if (additionIcon.classList.contains('active')) {
        selectedOperations.push('addition');
    }

    if (subtractionIcon.classList.contains('active')) {
        selectedOperations.push('subtraction');
    }

    if (multiplicationIcon.classList.contains('active')) {
        selectedOperations.push('multiplication');
    }

    if (divisionIcon.classList.contains('active')) {
        selectedOperations.push('division');
    }

    return selectedOperations;
}

function getNewTask() {
    const selectedOperations = getSelectedOperations();
    const progressData = getProgressDataFromCookie();

    fetch('http://localhost:5000/get-new-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            selectedOperations: selectedOperations,
            progressData: progressData
        }),
    })
        .then(response => response.json())
        .then(data => {
            let task = data.task;
            // Display the task and store the correct answer
            document.getElementById('math-problem').textContent = task;
            // Store correct answer for later validation
            correctAnswer = data.correct_answer.toFixed(0);
            taskType = data.task_type;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    taskFailed = false;
    startTime = new Date(); // Record the start time
}

function wrongAnswer() {
    counter = 0;
    userInput.textContent = correctAnswer;
    // Trigger background animation and send results simultaneously
    Promise.all([
        animateBackground(good = false),
        sendResults(result = false)
    ]).then(() => {
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
            sendResults(result = !taskFailed), // if task already failed, then silently send a failure message
            pop()
        ])
            .then(() => {
                // Once both animations and fetch are complete, clear input and get new task
                clearInput();
                getNewTask();
            });
    } else if (checkDifferentSubstrings(userAnswer, correctAnswer)) {
        console.log("task failed")
        taskFailed = true;
    }
}


function sendResults(result) {
    let progressData = getProgressDataFromCookie();
    const endTime = new Date();
    const elapsedTime = (endTime - startTime) / 1000;

    return fetch('http://localhost:5000/complete-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            elapsedTime: elapsedTime,
            progressData: progressData,
            result: result,
            type: taskType,
        }),
    })
        .then(response => response.json())
        .then(data => {
            progressData = data.progressData
            // Update progress data with data received from the backend
            setProgressDataInCookie(progressData);
            updateScores(progressData);
        })
        .catch(error => {
            // Handle errors here
            console.error('Error:', error);
        });
}

function animateBackground(good = true) {
    return new Promise(resolve => {
        const gameContainer = document.querySelector('.game-container');
        if (good) {
            gameContainer.classList.add('correct-answer-animation');
            // Add a timeout to simulate the animation duration
            setTimeout(() => {
                gameContainer.classList.remove('correct-answer-animation');
                resolve(); // Resolve the promise after animation
            }, 500); // Animation duration in milliseconds
        } else {
            gameContainer.classList.add('incorrect-answer-animation');
            // Add a timeout to simulate the animation duration
            setTimeout(() => {
                gameContainer.classList.remove('incorrect-answer-animation');
                resolve(); // Resolve the promise after animation
            }, 500); // Animation duration in milliseconds
        }
    });
}
function clearInput() {
    userInput.textContent = '';
}

// The pop() function is called on every click
function pop() {
    if (goodCounter < 25) {
        return
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
    // Create a custom particle element
    const particle = document.createElement('particle');
    // Append the element into the body
    document.body.appendChild(particle);

    // Calculate a random size from 5px to 25px
    const size = Math.floor(Math.random() * 20 + 5);
    // Apply the size on each particle
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    // Generate a random color in a blue/purple palette
    particle.style.background = `hsl(${Math.random() * 90 + 180}, 90%, 60%)`;

    // Generate a random x & y destination within a distance of 75px from the mouse
    const destinationX = x + (Math.random() - 0.5) * 2 * 475;
    const destinationY = y + (Math.random() - 0.5) * 2 * 475;

    // Store the animation in a variable because we will need it later
    const animation = particle.animate([
        {
            // Set the origin position of the particle
            // We offset the particle with half its size to center it around the mouse
            transform: `translate(${x - (size / 2)}px, ${y - (size / 2)}px)`,
            opacity: 1
        },
        {
            // We define the final coordinates as the second keyframe
            transform: `translate(${destinationX}px, ${destinationY}px)`,
            opacity: 0
        }
    ], {
        // Set a random duration from 500 to 1500ms
        duration: 1500 + Math.random() * 1000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        // Delay every particle with a random value from 0ms to 200ms
        delay: Math.random() * 200
    });

    // When the animation is finished, remove the element from the DOM
    animation.onfinish = () => {
        particle.remove();
    };
}
