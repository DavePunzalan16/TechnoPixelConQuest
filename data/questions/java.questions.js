/* =========================================================
   TECHNOPIXEL CODEQUEST — JAVA QUESTION BANK
   File: data/questions/java.questions.js

   HOW TO ADD A NEW QUESTION — see python.questions.js header.
   Register under: window.CodeQuestQuestionBanks.java
   ========================================================= */

'use strict';

window.CodeQuestQuestionBanks = window.CodeQuestQuestionBanks || {};

window.CodeQuestQuestionBanks.java = [

  /* ── INTRODUCTION ───────────────────────────────────── */
  {
    id: 'java-q001',
    language: 'java',
    topic: 'introduction',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What does JVM stand for?',
    options: ['Java Virtual Machine', 'Java Verified Model', 'Just Verified Module', 'Java Variable Manager'],
    correctAnswer: 'Java Virtual Machine',
    explanation: 'JVM stands for Java Virtual Machine. It runs Java bytecode and enables "write once, run anywhere".',
    hint: 'It\'s the component that runs Java programs on any platform.',
    xp: 5
  },
  {
    id: 'java-q002',
    language: 'java',
    topic: 'introduction',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'Java source code is compiled directly to machine code like C++.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Java compiles to bytecode (.class files), which the JVM then interprets or JIT-compiles to machine code.',
    hint: 'Java has a two-step process: javac then JVM.',
    xp: 5
  },

  /* ── VARIABLES ──────────────────────────────────────── */
  {
    id: 'java-q003',
    language: 'java',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'How do you declare an integer variable named "age" with value 18 in Java?',
    options: ['age = 18;', 'var age = 18;', 'int age = 18;', 'integer age = 18;'],
    correctAnswer: 'int age = 18;',
    explanation: 'Java requires an explicit type declaration. int is the keyword for integer variables.',
    hint: 'Java is statically typed — you must specify int, double, String, etc.',
    xp: 5
  },
  {
    id: 'java-q004',
    language: 'java',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'fill_blank',
    question: 'Complete the Java variable declaration for a decimal number:\n\n___ price = 9.99;',
    codeTemplate: '___ price = 9.99;',
    acceptedAnswers: ['double'],
    explanation: 'double is the Java type for decimal (floating-point) numbers.',
    hint: 'In Java, decimal variables use the double keyword.',
    xp: 5
  },
  {
    id: 'java-q005',
    language: 'java',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'find_mistake',
    question: 'Find the mistake:\n\nString name = "Alex"\nSystem.out.println(name);',
    options: [
      'String should be lowercase',
      'Missing semicolon after "Alex"',
      'println should be print',
      'name should be in quotes in println'
    ],
    correctAnswer: 'Missing semicolon after "Alex"',
    explanation: 'Every Java statement must end with a semicolon. The declaration should be: String name = "Alex";',
    hint: 'Java requires a semicolon at the end of every statement.',
    xp: 5
  },

  /* ── PRIMITIVE DATA TYPES ───────────────────────────── */
  {
    id: 'java-q006',
    language: 'java',
    topic: 'primitive_types',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Which Java type stores a single character, like \'A\'?',
    options: ['String', 'char', 'letter', 'character'],
    correctAnswer: 'char',
    explanation: 'char stores a single character using single quotes: char grade = \'A\';',
    hint: 'A char uses single quotes. String uses double quotes.',
    xp: 5
  },
  {
    id: 'java-q007',
    language: 'java',
    topic: 'primitive_types',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'In Java, String is a primitive data type.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'String is a class in Java, not a primitive. The eight primitives are: byte, short, int, long, float, double, char, boolean.',
    hint: 'Notice that String starts with a capital letter — primitives are all lowercase.',
    xp: 5
  },

  /* ── OPERATORS ──────────────────────────────────────── */
  {
    id: 'java-q008',
    language: 'java',
    topic: 'operators',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this Java code print?\n\nint x = 7;\nint y = 2;\nSystem.out.println(x / y);',
    options: ['3.5', '3', '4', '2'],
    correctAnswer: '3',
    explanation: 'Integer division in Java truncates the decimal. 7 / 2 = 3 (not 3.5) when both are int.',
    hint: 'Both x and y are int, so the result is also an int.',
    xp: 5
  },
  {
    id: 'java-q009',
    language: 'java',
    topic: 'operators',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What does the ++ operator do in Java?',
    options: ['Adds 2 to a variable', 'Increments a variable by 1', 'Concatenates two strings', 'Compares two values'],
    correctAnswer: 'Increments a variable by 1',
    explanation: 'count++ is shorthand for count = count + 1. It increments the variable by exactly 1.',
    hint: 'x++ and x = x + 1 are equivalent.',
    xp: 5
  },

  /* ── CONDITIONS ─────────────────────────────────────── */
  {
    id: 'java-q010',
    language: 'java',
    topic: 'conditions',
    difficulty: 'beginner',
    type: 'find_mistake',
    question: 'Find the mistake:\n\nint score = 80;\nif score >= 60 {\n    System.out.println("Pass");\n}',
    options: [
      'int should be Integer',
      'Missing parentheses around the condition',
      'Should use > not >=',
      'Missing semicolon after the closing brace'
    ],
    correctAnswer: 'Missing parentheses around the condition',
    explanation: 'Java if conditions must be wrapped in parentheses: if (score >= 60) { ... }',
    hint: 'Java if syntax: if (condition) { }',
    xp: 5
  },
  {
    id: 'java-q011',
    language: 'java',
    topic: 'conditions',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What is printed?\n\nint n = 15;\nif (n > 20) {\n    System.out.println("A");\n} else if (n > 10) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}',
    options: ['A', 'B', 'C', 'Nothing'],
    correctAnswer: 'B',
    explanation: 'n=15 is not > 20, but IS > 10, so the else if runs and prints B.',
    hint: 'Check each condition from top to bottom.',
    xp: 5
  },

  /* ── LOOPS ──────────────────────────────────────────── */
  {
    id: 'java-q012',
    language: 'java',
    topic: 'loops',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'How many times does this loop execute?\n\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}',
    options: ['4', '5', '6', '0'],
    correctAnswer: '5',
    explanation: 'i starts at 0 and runs while i < 5, so i takes values 0,1,2,3,4 — five executions.',
    hint: 'Count values: 0, 1, 2, 3, 4.',
    xp: 5
  },
  {
    id: 'java-q013',
    language: 'java',
    topic: 'loops',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Which loop in Java always executes its body at least once?',
    options: ['for loop', 'while loop', 'do-while loop', 'foreach loop'],
    correctAnswer: 'do-while loop',
    explanation: 'A do-while loop executes the body first, then checks the condition — guaranteeing at least one execution.',
    hint: 'The do block runs before the while condition is checked.',
    xp: 5
  },

  /* ── METHODS ────────────────────────────────────────── */
  {
    id: 'java-q014',
    language: 'java',
    topic: 'methods',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What return type should a Java method have if it does not return any value?',
    options: ['null', 'none', 'void', 'empty'],
    correctAnswer: 'void',
    explanation: 'void means the method performs an action but returns nothing. Example: public static void greet() { }',
    hint: 'Think of void as "empty" or "nothing".',
    xp: 5
  },
  {
    id: 'java-q015',
    language: 'java',
    topic: 'methods',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this print?\n\npublic static int square(int n) {\n    return n * n;\n}\nSystem.out.println(square(4));',
    options: ['4', '8', '16', 'square(4)'],
    correctAnswer: '16',
    explanation: 'square(4) returns 4 * 4 = 16. println then displays 16.',
    hint: 'Substitute n=4 into the return expression.',
    xp: 5
  },

  /* ── CLASSES AND OBJECTS ────────────────────────────── */
  {
    id: 'java-q016',
    language: 'java',
    topic: 'classes_objects',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'In Java, a class is a blueprint for creating objects.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'A class defines the structure and behavior. Objects are instances created from that class using the new keyword.',
    hint: 'Think of a class like a cookie cutter, and objects as the cookies.',
    xp: 5
  },
  {
    id: 'java-q017',
    language: 'java',
    topic: 'classes_objects',
    difficulty: 'beginner',
    type: 'fill_blank',
    question: 'Complete the code to create a new Scanner object:\n\nScanner sc = ___ Scanner(System.in);',
    codeTemplate: 'Scanner sc = ___ Scanner(System.in);',
    acceptedAnswers: ['new'],
    explanation: 'Objects are created with the new keyword: new ClassName(arguments).',
    hint: 'In Java, you create objects with a 3-letter keyword.',
    xp: 5
  }

]; // end java questions
