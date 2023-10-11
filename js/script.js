document.addEventListener('DOMContentLoaded', function () {
    let correctAnswer = null;

    const userInput = document.getElementById('user-answer');

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
                }
            }
        }
    });

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

        fetch('http://localhost:5000/get-new-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedOperations: selectedOperations }),
        })
            .then(response => response.json())
            .then(data => {
                let task = data.task;
                // Display the task and store the correct answer
                document.getElementById('math-problem').textContent = task;
                // Store correct answer for later validation
                correctAnswer = data.correct_answer;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }



    function wrongAnswer() {
        userInput.textContent = correctAnswer;
        // Trigger background animation and send results simultaneously
        Promise.all([
            animateBackground(good = false),
            sendResults()
        ]).then(() => {
            // Once both animations and fetch are complete, clear input and get new task
            clearInput();
            getNewTask();
        });

    }

    function checkAnswer(userAnswer) {
        if (userAnswer === correctAnswer) {
            // Trigger background animation and send results simultaneously
            Promise.all([
                animateBackground(),
                sendResults()
            ]).then(() => {
                // Once both animations and fetch are complete, clear input and get new task
                clearInput();
                getNewTask();
            });
        }
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

    function sendResults() {
        return fetch('http://localhost:5000/complete-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                elaspedTime: 1,
            }),
        });
    }

    function clearInput() {
        userInput.textContent = '';
    }

    function toggleOperation(operation) {
        const operationElement = document.getElementById(operation);
        const isActive = operationElement.classList.toggle('active');

        if (isActive) {
            selectedOperation = operation;
        } else {
            selectedOperation = null;
        }
        console.log('Selected Operation:', selectedOperation);
    }

    function onInputChange() {
        let userAnswer = parseInt(userInput.textContent, 10);

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
    getNewTask();
});
