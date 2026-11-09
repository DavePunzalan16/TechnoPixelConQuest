/* =========================================================
   TECHNOPIXEL CODEQUEST — PYTHON QUESTION BANK
   File: data/questions/python.questions.js

   HOW TO ADD A NEW QUESTION:
   1. Copy an existing question object.
   2. Give it a unique id (e.g. "py-q016").
   3. Set language: "python".
   4. Choose a topic from the existing list or add a new one.
   5. Set difficulty: "beginner" | "intermediate" | "advanced".
   6. Set type: "multiple_choice" | "fill_blank" | "predict_output" |
                "arrange" | "find_mistake" | "true_false".
   7. For multiple_choice / predict_output / find_mistake / true_false:
      - options: array of strings
      - correctAnswer: must exactly match one option string
   8. For fill_blank:
      - codeTemplate: string with ___ where the blank is
      - acceptedAnswers: array of valid answers (trimmed, case rules apply)
   9. For arrange:
      - blocks: shuffled array of strings
      - correctOrder: correct array of strings
   10. Save. The bank loads automatically in Practice.
   ========================================================= */

'use strict';

window.CodeQuestQuestionBanks = window.CodeQuestQuestionBanks || {};

window.CodeQuestQuestionBanks.python = [

  /* ── INTRODUCTION ───────────────────────────────────── */
  {
    id: 'py-q001',
    language: 'python',
    topic: 'introduction',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Python was created by which person?',
    options: ['James Gosling', 'Guido van Rossum', 'Bjarne Stroustrup', 'Dennis Ritchie'],
    correctAnswer: 'Guido van Rossum',
    explanation: 'Python was created by Guido van Rossum and first released in 1991.',
    hint: 'Think about the Dutch programmer who named it after a comedy show.',
    xp: 5
  },
  {
    id: 'py-q002',
    language: 'python',
    topic: 'introduction',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'Python is a compiled language that requires explicit compilation before running.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Python is an interpreted language. You run Python scripts directly without a separate compile step.',
    hint: 'Think about how you run a .py file.',
    xp: 5
  },

  /* ── VARIABLES ──────────────────────────────────────── */
  {
    id: 'py-q003',
    language: 'python',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Which of the following is a valid Python variable name?',
    options: ['2score', 'my-score', 'my_score', 'my score'],
    correctAnswer: 'my_score',
    explanation: 'Variable names cannot start with a number, contain hyphens, or have spaces. Underscores are allowed.',
    hint: 'Python variable names follow identifier rules: letters, digits (not first), underscores.',
    xp: 5
  },
  {
    id: 'py-q004',
    language: 'python',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'fill_blank',
    question: 'Complete the code to store the number 10 in a variable called score:',
    codeTemplate: '___ = 10',
    acceptedAnswers: ['score'],
    explanation: 'In Python, variables are created by assignment: variable_name = value.',
    hint: 'The variable name goes on the left side of =.',
    xp: 5
  },
  {
    id: 'py-q005',
    language: 'python',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'In Python, you must declare a variable\'s type before assigning a value.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Python uses dynamic typing. You just write: x = 5. No type declaration is needed.',
    hint: 'Compare Python to Java or C++ which require int x = 5.',
    xp: 5
  },

  /* ── DATA TYPES ─────────────────────────────────────── */
  {
    id: 'py-q006',
    language: 'python',
    topic: 'data_types',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this code print?\n\nx = 3.14\nprint(type(x))',
    options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'double\'>'],
    correctAnswer: '<class \'float\'>',
    explanation: '3.14 is a decimal number, so Python stores it as a float. Python has no double type.',
    hint: 'Decimal numbers in Python are float, not double.',
    xp: 5
  },
  {
    id: 'py-q007',
    language: 'python',
    topic: 'data_types',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Which Python data type stores True or False values?',
    options: ['int', 'str', 'bool', 'bit'],
    correctAnswer: 'bool',
    explanation: 'The bool type stores either True or False. Note the capital T and F in Python.',
    hint: 'Boolean values in Python are capitalized: True, False.',
    xp: 5
  },

  /* ── OPERATORS ──────────────────────────────────────── */
  {
    id: 'py-q008',
    language: 'python',
    topic: 'operators',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this code print?\n\nprint(10 % 3)',
    options: ['3', '1', '0.33', '10'],
    correctAnswer: '1',
    explanation: '% is the modulo operator. 10 divided by 3 is 3 with remainder 1, so 10 % 3 = 1.',
    hint: '% gives the remainder after division.',
    xp: 5
  },
  {
    id: 'py-q009',
    language: 'python',
    topic: 'operators',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What does ** do in Python?',
    options: ['Multiply', 'Integer divide', 'Exponentiation (power)', 'Bitwise AND'],
    correctAnswer: 'Exponentiation (power)',
    explanation: '** is the power operator. 2 ** 3 = 8 (2 to the power of 3).',
    hint: '2 ** 3 means 2 raised to the 3rd power.',
    xp: 5
  },

  /* ── CONDITIONS ─────────────────────────────────────── */
  {
    id: 'py-q010',
    language: 'python',
    topic: 'conditions',
    difficulty: 'beginner',
    type: 'find_mistake',
    question: 'Find the mistake in this Python code:\n\nif x = 10:\n    print("Ten")',
    options: [
      'print should be uppercase',
      'Should use == not = in the if condition',
      'Missing parentheses around condition',
      'The colon is unnecessary'
    ],
    correctAnswer: 'Should use == not = in the if condition',
    explanation: '= is assignment; == is comparison. The if condition must use == to check equality.',
    hint: 'One = assigns. Two == compares.',
    xp: 5
  },
  {
    id: 'py-q011',
    language: 'python',
    topic: 'conditions',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this code print?\n\nx = 5\nif x > 3:\n    print("Big")\nelse:\n    print("Small")',
    options: ['Big', 'Small', 'Nothing', 'Error'],
    correctAnswer: 'Big',
    explanation: 'x is 5, which is greater than 3, so the if block runs and prints "Big".',
    hint: 'Check whether 5 > 3 is True or False.',
    xp: 5
  },

  /* ── LOOPS ──────────────────────────────────────────── */
  {
    id: 'py-q012',
    language: 'python',
    topic: 'loops',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'How many times does this loop print "Hello"?\n\nfor i in range(3):\n    print("Hello")',
    options: ['2', '3', '4', '0'],
    correctAnswer: '3',
    explanation: 'range(3) generates 0, 1, 2 — three values — so the loop body runs three times.',
    hint: 'Count how many numbers range(3) produces.',
    xp: 5
  },
  {
    id: 'py-q013',
    language: 'python',
    topic: 'loops',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Which keyword immediately stops a loop in Python?',
    options: ['stop', 'exit', 'break', 'end'],
    correctAnswer: 'break',
    explanation: 'break immediately exits the loop. continue skips to the next iteration instead.',
    hint: 'Think of "breaking out" of the loop.',
    xp: 5
  },

  /* ── FUNCTIONS ──────────────────────────────────────── */
  {
    id: 'py-q014',
    language: 'python',
    topic: 'functions',
    difficulty: 'beginner',
    type: 'fill_blank',
    question: 'Complete the function definition:\n\n___ greet():\n    print("Hello!")',
    codeTemplate: '___ greet():\n    print("Hello!")',
    acceptedAnswers: ['def'],
    explanation: 'def is the keyword that defines a function in Python.',
    hint: 'Python uses a 3-letter keyword to define functions.',
    xp: 5
  },
  {
    id: 'py-q015',
    language: 'python',
    topic: 'functions',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this print?\n\ndef add(a, b):\n    return a + b\n\nprint(add(3, 4))',
    options: ['3', '4', '7', 'add(3, 4)'],
    correctAnswer: '7',
    explanation: 'add(3, 4) returns 3 + 4 = 7. print() then displays 7.',
    hint: 'Trace the function: a=3, b=4, return 3+4.',
    xp: 5
  },

  /* ── LISTS ──────────────────────────────────────────── */
  {
    id: 'py-q016',
    language: 'python',
    topic: 'lists',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What index does the first element of a Python list have?',
    options: ['1', '0', '-1', 'first'],
    correctAnswer: '0',
    explanation: 'Python lists are zero-indexed. The first element is at index 0, the second at 1, and so on.',
    hint: 'Most programming languages start counting from 0.',
    xp: 5
  },
  {
    id: 'py-q017',
    language: 'python',
    topic: 'lists',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this code print?\n\nfruits = ["apple", "banana", "cherry"]\nprint(fruits[1])',
    options: ['apple', 'banana', 'cherry', 'Error'],
    correctAnswer: 'banana',
    explanation: 'fruits[1] accesses index 1. Index 0 is "apple", index 1 is "banana".',
    hint: 'Remember: index 0 = first item, index 1 = second item.',
    xp: 5
  },
  {
    id: 'py-q018',
    language: 'python',
    topic: 'lists',
    difficulty: 'beginner',
    type: 'arrange',
    question: 'Arrange these lines to create a list and print its length:',
    blocks: ['print(len(numbers))', 'numbers = [1, 2, 3, 4, 5]'],
    correctOrder: ['numbers = [1, 2, 3, 4, 5]', 'print(len(numbers))'],
    explanation: 'You must create the list first, then use len() to get its length.',
    hint: 'You cannot call len() on a variable that does not exist yet.',
    xp: 5
  }

]; // end python questions
