import math
import random


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
        accuracy_scale = 0.1  # Adjust as needed
        solve_time_scale = 1  # Adjust as needed

        # difficulty_mean = self.difficulty_level
        # difficulty_std_dev = 1.0  # Adjust as needed

        # Calculate probability using normal distribution PDF
        accuracy_probability = sigmoid(
            measured_accuracy, shift=self.accuracy_target, scale=accuracy_scale
        )
        solve_time_probability = 1 - sigmoid(
            measured_solve_time, shift=self.solve_time_target, scale=solve_time_scale
        )
        # difficulty_probability = normal_pdf(
        #     self.difficulty_level, mean=difficulty_mean, std_dev=difficulty_std_dev
        # )

        # Combine probabilities
        probability = accuracy_probability * solve_time_probability

        return probability


class AdditionTask(Task):
    def __init__(
        self, id, *, difficulty_level, accuracy_target=0.90, solve_time_target=3
    ):
        super().__init__(
            id,
            accuracy_target=accuracy_target,
            solve_time_target=solve_time_target,
            difficulty_level=difficulty_level,
        )
        self.operator = "+"

    def generate_assignment(self):
        raise NotImplementedError("Subclasses must implement generate_assignment()")


class SumLessThan10Task(AdditionTask):
    def __init__(self):
        super().__init__("5+2", difficulty_level=10)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = random.randint(1, 10 - num1 - 1)
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class SumExactly10Task(AdditionTask):
    def __init__(self):
        super().__init__("5+5", difficulty_level=15)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = 10 - num1
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddSingleDigitTo10Task(AdditionTask):
    def __init__(self):
        super().__init__("10+5", difficulty_level=20)

    def generate_assignment(self):
        num1 = 10
        num2 = random.randint(0, 9)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddTwoNumbersBelow10Task(AdditionTask):
    def __init__(self):
        super().__init__("7+5", difficulty_level=30)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = random.randint(1, 9)
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddSingleDigitToTwoDigitRoundTask(AdditionTask):
    def __init__(self):
        super().__init__("17+3", difficulty_level=40)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = random.choice([10, 20, 30, 40, 50, 60, 70, 80, 90])
        num2 = num2 - num1
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddSingleDigitToTwoDigitTask(AdditionTask):
    def __init__(self):
        super().__init__("18+5", difficulty_level=50)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = random.randint(10, 99 - num1)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


# class AddNoCarryTask(AdditionTask):
#     def __init__(
#         self, accuracy_threshold, speed_threshold, difficulty_level, num_digits=1
#     ):
#         super().__init__(accuracy_threshold, speed_threshold, difficulty_level)
#         self.operator = "+"
#         self.num_digits = num_digits
# `
