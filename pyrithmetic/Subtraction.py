import random

from .Task import Task


class SubtractionTask(Task):
    def __init__(
        self, id, *, difficulty_level, accuracy_target=0.80, solve_time_target=3
    ):
        super().__init__(
            id,
            accuracy_target=accuracy_target,
            solve_time_target=solve_time_target,
            difficulty_level=difficulty_level,
        )
        self.operator = "-"

    def generate_assignment(self):
        raise NotImplementedError("Subclasses must implement generate_assignment()")


class SubtractFrom10(SubtractionTask):
    def __init__(self, difficulty_level=20):
        super().__init__("10-5", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = 10
        num2 = random.randint(1, 9)
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractSingleDigitFromTwoDigitRoundTask(SubtractionTask):
    def __init__(self, difficulty_level=30):
        super().__init__("37-7", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num2 = random.randint(1, 9)
        num1 = num2 + random.choice([20, 30, 40, 50, 60, 70, 80, 90])
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractSingleDigitFromTweenTask(SubtractionTask):
    def __init__(self, difficulty_level=50):
        super().__init__("15-8", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num2 = random.randint(1, 9)
        num1 = random.randint(0, num2 - 1)
        num1 += 10
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractSingleDigitFromTwoDigitTask(SubtractionTask):
    def __init__(self, difficulty_level=60):
        super().__init__("25-8", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num2 = random.randint(1, 9)
        num1 = random.randint(0, num2 - 1)
        num1 += random.choice([10, 20, 30, 40, 50, 60, 70, 80, 90])
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractNoCarryTask(SubtractionTask):
    def __init__(self, difficulty_level, num_digits=1, second_digits=None):
        if second_digits is None:
            second_digits = num_digits
        if second_digits < num_digits:
            num_digits, second_digits = second_digits, num_digits
        self.first_digits = num_digits
        self.second_digits = second_digits
        id = f"{'5'*self.second_digits}-{'2'*self.first_digits}"
        super().__init__(id, difficulty_level=difficulty_level)

    def generate_number_pair(self, include_zeros=False):
        if include_zeros:
            num1 = random.randint(0, 9)
            num2 = random.randint(0, num1)
        else:
            num1 = random.randint(1, 9)
            num2 = random.randint(1, num1)
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
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractTwoDigitFromTwoDigitTask(SubtractionTask):
    def __init__(self, difficulty_level=80):
        super().__init__("54-38", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(11, 99)
        num2 = random.randint(11, num1)
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractTwoDigitFromThreeDigitTask(SubtractionTask):
    def __init__(self, difficulty_level=100):
        super().__init__("254-38", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(11, 99)
        num2 = random.randint(1, num1)
        num1 += random.choice([100, 200, 300, 400, 500, 600, 700, 800, 900])
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractTwoDigitFromThreeDigitTaskWithCarry(SubtractionTask):
    def __init__(self, difficulty_level=110):
        super().__init__("254-68", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(101, 999)
        num2 = random.randint(1, 99)
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer


class SubtractThreeDigitFromThreeDigitTask(SubtractionTask):
    def __init__(self, difficulty_level=120):
        super().__init__("254-168", difficulty_level=difficulty_level)

    def generate_assignment(self):
        num1 = random.randint(101, 999)
        num2 = random.randint(101, num1)
        task = f"{num1} {self.operator} {num2}"
        correct_answer = num1 - num2
        return task, correct_answer
