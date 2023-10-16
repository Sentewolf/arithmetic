import * as Addition from "./Addition.js";
import * as Subtraction from "./Subtraction.js";
import * as Multiplication from "./Multiplication.js";
import * as Division from "./Division.js";
import * as utils from "./utils.js";

const defaultProgress = {
  average_time: 3,
  average_result: 0.5,
  count: 0,
};

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
    selectedOperations[utils.randint(0, selectedOperations.length)];

  let tasks = [];
  if (pickedOperation === "addition") {
    tasks = additionTasks;
  } else if (pickedOperation === "subtraction") {
    tasks = subtractionTasks;
  } else if (pickedOperation === "multiplication") {
    tasks = multiplicationTasks;
  } else if (pickedOperation === "division") {
    tasks = divisionTasks;
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
  const subtractionScore = scoreForTaskList(subtractionTasks);
  const multiplicationScore = scoreForTaskList(multiplicationTasks);
  const divisionScore = scoreForTaskList(divisionTasks);

  return {
    addition: additionScore,
    subtraction: subtractionScore,
    multiplication: multiplicationScore,
    division: divisionScore,
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
      progressData = levelUpTaskList(subtractionTasks, progressData);
    } else if (operation === "multiplication") {
      progressData = levelUpTaskList(multiplicationTasks, progressData);
    } else if (operation === "division") {
      progressData = levelUpTaskList(divisionTasks, progressData);
    }
  }

  return progressData;
}

const additionTasks = [
  new Addition.AddNoCarryTask(1),
  new Addition.SumExactly10Task(),
  new Addition.AddSingleDigitTo10Task(),
  new Addition.AddTwoNumbersBelow10Task(),
  new Addition.AddNoCarryTask(1, 2),
  new Addition.AddSingleDigitToTwoDigitRoundTask(),
  new Addition.AddSingleDigitToTwoDigitTask(),
  new Addition.AddNoCarryTask(2),
  new Addition.AddTwoDigitToTwoDigitTask(),
  new Addition.AddDoubleDigitToHundredsTask(),
  new Addition.AddNoCarryTask(2, 3),
  new Addition.AddTwoDigitToThreeDigitTask(),
  new Addition.AddTwoDigitToThreeDigitTaskWithCarry(),
  new Addition.AddThreeDigitToThreeDigitTask(),
];

const subtractionTasks = [
  new Subtraction.SubtractNoCarryTask(1),
  new Subtraction.SubtractFrom10(),
  new Subtraction.SubtractSingleDigitFromTwoDigitRoundTask(),
  new Subtraction.SubtractNoCarryTask(1, 2),
  new Subtraction.SubtractSingleDigitFromTweenTask(),
  new Subtraction.SubtractSingleDigitFromTwoDigitTask(),
  new Subtraction.SubtractNoCarryTask(2),
  new Subtraction.SubtractTwoDigitFromTwoDigitTask(),
  new Subtraction.SubtractNoCarryTask(2, 3),
  new Subtraction.SubtractTwoDigitFromThreeDigitTask(),
  new Subtraction.SubtractTwoDigitFromThreeDigitTaskWithCarry(),
  new Subtraction.SubtractThreeDigitFromThreeDigitTask(),
];

const multiplicationTasks = [
  new Multiplication.MultiplicationTableN(2),
  new Multiplication.MultiplicationTableN(3),
  new Multiplication.MultiplicationTableN(4),
  new Multiplication.MultiplicationTableN(5),
  new Multiplication.MultiplicationTableN(6),
  new Multiplication.MultiplicationTableN(7),
  new Multiplication.MultiplicationTableN(8),
  new Multiplication.MultiplicationTableN(9),
  new Multiplication.MultiplicationTableN(10),
  new Multiplication.MultiplicationTableN(11),
  new Multiplication.MultiplicationTableN(12),
  new Multiplication.MultiplyNbyM(1, 2),
  new Multiplication.MultiplyNbyM(1, 3),
  new Multiplication.MultiplyNbyM(2, 2),
  new Multiplication.MultiplyNbyM(2, 3),
  new Multiplication.MultiplyNbyM(3, 3),
];

const divisionTasks = [
  new Division.DivisionTableN(2),
  new Division.DivisionTableN(3),
  new Division.DivisionTableN(4),
  new Division.DivisionTableN(5),
  new Division.DivisionTableN(6),
  new Division.DivisionTableN(7),
  new Division.DivisionTableN(8),
  new Division.DivisionTableN(9),
  new Division.DivisionTableN(10),
  new Division.DivisionTableN(11),
  new Division.DivisionTableN(12),
  new Division.DivideNbyM(1, 2),
  new Division.DivideNbyM(1, 3),
  new Division.DivideNbyM(2, 2),
  new Division.DivideNbyM(2, 3),
  new Division.DivideNbyM(3, 3),
];
