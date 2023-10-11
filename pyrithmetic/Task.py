import math


def normal_pdf(x, mean, std_dev):
    return (1 / (std_dev * math.sqrt(2 * math.pi))) * math.exp(
        -0.5 * ((x - mean) / std_dev) ** 2
    )


def sigmoid(x, shift, scale):
    return 1 / (1 + math.exp(-scale * (x - shift)))


class Task:
    def __init__(self, id, *, accuracy_target, solve_time_target, difficulty_level):
        self.accuracy_target = accuracy_target
        self.solve_time_target = solve_time_target
        self.difficulty_level = difficulty_level
        self.id = id

    def generate_assignment(self):
        raise NotImplementedError("Subclasses must implement generate_assignment()")

    def has_met_targets(self, measured_accuracy, measured_solve_time):
        return (
            measured_accuracy >= self.accuracy_target
            or measured_solve_time <= self.solve_time_target
        )

    def probability_of_selection(self, measured_accuracy, measured_solve_time):
        # Define parameters for normal distribution (mean and standard deviation)
        accuracy_scale = 10  # Adjust as needed
        solve_time_scale = 1  # Adjust as needed

        # difficulty_mean = self.difficulty_level
        # difficulty_std_dev = 1.0  # Adjust as needed

        # Calculate probability using normal distribution PDF
        accuracy_probability = 1 - sigmoid(
            measured_accuracy, shift=self.accuracy_target, scale=accuracy_scale
        )
        solve_time_probability = sigmoid(
            measured_solve_time, shift=self.solve_time_target, scale=solve_time_scale
        )
        # difficulty_probability = normal_pdf(
        #     self.difficulty_level, mean=difficulty_mean, std_dev=difficulty_std_dev
        # )

        # Combine probabilities
        probability = accuracy_probability * solve_time_probability
        return probability
