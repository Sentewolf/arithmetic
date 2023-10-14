function normalPDF(x, mean, stdDev) {
  return (
    (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
  );
}

function sigmoid(x, shift, scale) {
  return 1 / (1 + Math.exp(-scale * (x - shift)));
}

export class Task {
  constructor(id, { accuracyTarget, solveTimeTarget }) {
    this.accuracyTarget = accuracyTarget;
    this.solveTimeTarget = solveTimeTarget;
    this.id = id;
  }

  generateAssignment() {
    throw new Error("Subclasses must implement generateAssignment()");
  }

  hasMetTargets(measuredAccuracy, measuredSolveTime) {
    return measuredAccuracy >= this.accuracyTarget;
  }

  probabilityOfSelection(measuredAccuracy, measuredSolveTime) {
    const accuracyScale = 10; // Adjust as needed
    const solveTimeScale = 1; // Adjust as needed

    const accuracyProbability =
      1 - sigmoid(measuredAccuracy, this.accuracyTarget, accuracyScale);
    const solveTimeProbability = sigmoid(
      measuredSolveTime,
      this.solveTimeTarget,
      solveTimeScale,
    );

    const probability = accuracyProbability * solveTimeProbability;
    return probability;
  }
}
