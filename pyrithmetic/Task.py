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


class AdditionTask(Task):
    def __init__(
        self, id, *, difficulty_level, accuracy_target=0.80, solve_time_target=3
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


class SumExactly10Task(AdditionTask):
    def __init__(self, difficulty_level=20):
        super().__init__("5+5", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = 10 - num1
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddSingleDigitTo10Task(AdditionTask):
    def __init__(self, difficulty_level=30):
        super().__init__("10+5", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = 10
        num2 = random.randint(0, 9)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddTwoNumbersBelow10Task(AdditionTask):
    def __init__(self, difficulty_level=40):
        super().__init__("7+5", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = random.randint(1, 9)
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddSingleDigitToTwoDigitRoundTask(AdditionTask):
    def __init__(self, difficulty_level=60):
        super().__init__("17+3", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = random.choice([20, 30, 40, 50, 60, 70, 80, 90])
        num2 = num2 - num1
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddSingleDigitToTwoDigitTask(AdditionTask):
    def __init__(self, difficulty_level=70):
        super().__init__("18+5", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(1, 9)
        num2 = random.randint(10, 99 - num1)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddNoCarryTask(AdditionTask):
    def __init__(self, difficulty_level, num_digits=1, second_digits=None):
        if second_digits is None:
            second_digits = num_digits
        if second_digits < num_digits:
            num_digits, second_digits = second_digits, num_digits
        self.first_digits = num_digits
        self.second_digits = second_digits
        id = f"{'5'*self.first_digits}+{'2'*self.second_digits}"
        super().__init__(id, difficulty_level=difficulty_level)

    def generate_number_pair(self, include_zeros=False):
        if include_zeros:
            num1 = random.randint(0, 9)
            num2 = random.randint(0, 10 - num1 - 1)
        else:
            num1 = random.randint(1, 8)
            num2 = random.randint(1, 10 - num1 - 1)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        return num1, num2

    def generate_assignment(self):
        num1 = 0
        num2 = 0
        for i in range(self.first_digits):
            include_zeros = not (i == 0 or i == self.first_digits - 1)
            a, b = self.generate_number_pair(include_zeros=include_zeros)
            num1 += a * 10**i
            num2 += b * 10**i
        for i in range(self.first_digits, self.second_digits):
            num1 += random.randint(1, 9) * 10**i
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddDoubleDigitToHundredsTask(AdditionTask):
    def __init__(self, difficulty_level=100):
        super().__init__("300+34", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(10, 99)
        num2 = random.choice([100, 200, 300, 400, 500, 600, 700, 800, 900])
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddTwoDigitToTwoDigitTask(AdditionTask):
    def __init__(self, difficulty_level=90):
        super().__init__("38+54", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(11, 88)
        num2 = random.randint(11, 99 - num1)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddTwoDigitToThreeDigitTask(AdditionTask):
    def __init__(self, difficulty_level=120):
        super().__init__("38+254", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(10, 98)
        num2 = random.randint(1, 99 - num1) + random.choice(
            [100, 200, 300, 400, 500, 600, 700, 800, 900]
        )
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddTwoDigitToThreeDigitTaskWithCarry(AdditionTask):
    def __init__(self, difficulty_level=130):
        super().__init__("68+254", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(10, 99)
        num2 = random.randint(101, 999 - num1)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer


class AddThreeDigitToThreeDigitTask(AdditionTask):
    def __init__(self, difficulty_level=140):
        super().__init__("168+254", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(101, 898)
        num2 = random.randint(101, 999 - num1)
        if random.choice([True, False]):
            num1, num2 = num2, num1  # Randomize the order
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 + num2
        return task, correct_answer
