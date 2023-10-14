// const random = require("random");

import * as Addition from "./Addition.js";

const defaultProgress = {
  average_time: 3,
  average_result: 0.5,
  count: 0,
};

function random_int(max) {
  return Math.floor(Math.random() * max);
}

function weighted_random(items, weights) {
  var i;

  for (i = 1; i < weights.length; i++) weights[i] += weights[i - 1];

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return items[i];
}

export function complete_task(progressData, taskType, elapsedTime, result) {
  const timeLimit = 10;
  elapsedTime = Math.min(timeLimit, elapsedTime);
  if (!progressData) progressData = {};

  if (!progressData[taskType]) progressData[taskType] = { ...defaultProgress };

  const stats = progressData[taskType];
  stats.count += 1;
  stats.average_time = 0.95 * stats.average_time + 0.05 * elapsedTime;
  if (elapsedTime < timeLimit) {
    stats.average_result = 0.95 * stats.average_result + 0.05 * result;
  }

  progressData[taskType] = stats;

  return progressData;
}

export function get_new_task(selectedOperations, progressData) {
  const pickedOperation =
    selectedOperations[random_int(selectedOperations.length - 1)];

  let tasks = [];
  if (pickedOperation === "addition") {
    tasks = additionTasks;
    //   } else if (pickedOperation === "subtraction") {
    //     tasks = subtractionTasks;
  } else {
    tasks = additionTasks;
  }

  const probabilities = [];
  let activated = [];
  let previousActivated = true;

  for (const task of tasks) {
    if (!progressData) progressData = {};

    let progress = progressData[task.id] || { ...defaultProgress };

    if (previousActivated) {
      activated.push(true);
      previousActivated = task.hasMetTargets(
        progress.average_result,
        progress.average_time,
      );
    } else {
      activated.push(false);
      probabilities.push(0.2 * probabilities[probabilities.length - 1]);
      continue;
    }

    const probability = task.probabilityOfSelection(
      progress.average_result,
      progress.average_time,
    );
    probabilities.push(probability);
  }

  //   const totalProbability = probabilities.reduce((acc, val) => acc + val, 0);
  //   const weights = probabilities.map(
  //     (probability) => probability / totalProbability
  //   );

  const chosenTask = weighted_random(tasks, probabilities);
  let result = chosenTask.generateAssignment();
  result["task_type"] = chosenTask.id;
  return result;
}

export function get_scores(progressData) {
  if (!progressData || Object.keys(progressData).length === 0) {
    let scores = {
      addition: 0,
      subtraction: 0,
      multiplication: 0,
      division: 0,
    };
    return scores;
  }

  const scoreForTaskList = (tasks) => {
    const maxScore = tasks.length;
    const taskKeys = tasks.map((task) => task.id);
    let yourScore = 0;
    for (let key in progressData) {
      if (taskKeys.includes(key)) {
        yourScore += progressData[key].average_result;
      }
    }
    return Math.floor((yourScore / maxScore) * 1000);
  };

  const additionScore = scoreForTaskList(additionTasks);
  //   const subtractionScore = scoreForTaskList(subtractionTasks);

  return {
    addition: additionScore,
    subtraction: 0,
    // subtraction: subtractionScore,
    multiplication: 0,
    division: 0,
  };
}

export function level_up(selectedOperations, progressData) {
  const levelUpTaskList = (tasks, progressData) => {
    let previousActivated = true;
    let stats = null;
    let selectedTask = null;
    for (const task of tasks) {
      if (!progressData) progressData = {};

      stats = progressData[task.id] || { ...defaultProgress };

      if (previousActivated) {
        selectedTask = task;
        previousActivated = task.hasMetTargets(
          stats.average_result,
          stats.average_time,
        );
      } else {
        break;
      }
    }

    for (let i = 0; i < 100; i++) {
      stats.count += 1;
      stats.average_time =
        0.95 * stats.average_time + 0.05 * (selectedTask.solve_time_target / 2);
      stats.average_result = 0.95 * stats.average_result + 0.05 * 1;
    }

    progressData[selectedTask.id] = stats;
    return progressData;
  };

  for (const operation of selectedOperations) {
    if (operation === "addition") {
      progressData = levelUpTaskList(additionTasks, progressData);
    } else if (operation === "subtraction") {
      continue;
      progressData = levelUpTaskList(subtractionTasks, progressData);
    }
  }

  return progressData;
}

const additionTasks = [
  // new Addition.AddNoCarryTask({ difficulty_level: 10, num_digits: 1 }),
  new Addition.SumExactly10Task({ difficulty_level: 20 }),
  new Addition.AddSingleDigitTo10Task({ difficulty_level: 30 }),
  // new Addition.AddTwoNumbersBelow10Task({ difficulty_level: 40 }),
  // new Addition.AddNoCarryTask({ difficulty_level: 50, num_digits: 1, second_digits: 2 }),
  // new Addition.AddSingleDigitToTwoDigitRoundTask({ difficulty_level: 60 }),
  // new Addition.AddSingleDigitToTwoDigitTask({ difficulty_level: 70 }),
  // new Addition.AddNoCarryTask({ difficulty_level: 80, num_digits: 2 }),
  // new Addition.AddTwoDigitToTwoDigitTask({ difficulty_level: 90 }),
  // new Addition.AddDoubleDigitToHundredsTask({ difficulty_level: 100 }),
  // new Addition.AddNoCarryTask({ difficulty_level: 110, num_digits: 2, second_digits: 3 }),
  // new Addition.AddTwoDigitToThreeDigitTask({ difficulty_level: 120 }),
  // new Addition.AddTwoDigitToThreeDigitTaskWithCarry({ difficulty_level: 130 }),
  // new Addition.AddThreeDigitToThreeDigitTask({ difficulty_level: 140 }),
];

// const subtractionTasks = [
//     new Subtraction.SubtractNoCarryTask({ difficulty_level: 10, num_digits: 1 }),
//     new Subtraction.SubtractFrom10({ difficulty_level: 20 }),
//     new Subtraction.SubtractSingleDigitFromTwoDigitRoundTask({ difficulty_level: 30 }),
//     new Subtraction.SubtractNoCarryTask({ difficulty_level: 40, num_digits: 1, second_digits: 2 }),
//     new Subtraction.SubtractSingleDigitFromTweenTask({ difficulty_level: 50 }),
//     new Subtraction.SubtractSingleDigitFromTwoDigitTask({ difficulty_level: 60 }),
//     new Subtraction.SubtractNoCarryTask({ difficulty_level: 70, num_digits: 2 }),
//     new Subtraction.SubtractTwoDigitFromTwoDigitTask({ difficulty_level: 80 }),
//     new Subtraction.SubtractNoCarryTask({ difficulty_level: 90, num_digits: 2, second_digits: 3 }),
//     new Subtraction.SubtractTwoDigitFromThreeDigitTask({ difficulty_level: 100 }),
//     new Subtraction.SubtractTwoDigitFromThreeDigitTaskWithCarry({ difficulty_level: 110 }),
//     new Subtraction.SubtractThreeDigitFromThreeDigitTask({ difficulty_level: 120 }),
// ];

additionTasks.sort(
  (task1, task2) => task1.difficulty_level - task2.difficulty_level,
);
// subtractionTasks.sort((task1, task2) => task1.difficulty_level - task2.difficulty_level);
