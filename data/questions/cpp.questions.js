/* =========================================================
   TECHNOPIXEL CODEQUEST — C++ QUESTION BANK
   File: data/questions/cpp.questions.js

   HOW TO ADD A NEW QUESTION — see python.questions.js header.
   Register under: window.CodeQuestQuestionBanks.cpp
   ========================================================= */

'use strict';

window.CodeQuestQuestionBanks = window.CodeQuestQuestionBanks || {};

window.CodeQuestQuestionBanks.cpp = [

  /* ── INTRODUCTION ───────────────────────────────────── */
  {
    id: 'cpp-q001',
    language: 'cpp',
    topic: 'introduction',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'C++ was created as an extension of which programming language?',
    options: ['Java', 'Python', 'C', 'Pascal'],
    correctAnswer: 'C',
    explanation: 'C++ was developed by Bjarne Stroustrup as an extension of C, adding object-oriented features.',
    hint: 'The name "C++" itself is a clue — ++ increments C.',
    xp: 5
  },
  {
    id: 'cpp-q002',
    language: 'cpp',
    topic: 'introduction',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'C++ programs are compiled directly to machine code.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Unlike Java, C++ compiles directly to native machine code, which is one reason it is fast.',
    hint: 'Think about why game engines use C++ for performance.',
    xp: 5
  },

  /* ── VARIABLES ──────────────────────────────────────── */
  {
    id: 'cpp-q003',
    language: 'cpp',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'How do you declare an integer variable named "count" in C++?',
    options: ['count = 0;', 'var count = 0;', 'int count = 0;', 'integer count = 0;'],
    correctAnswer: 'int count = 0;',
    explanation: 'C++ uses int for integer variables. The type must be declared before the variable name.',
    hint: 'C++ is statically typed — int, double, string, bool.',
    xp: 5
  },
  {
    id: 'cpp-q004',
    language: 'cpp',
    topic: 'variables',
    difficulty: 'beginner',
    type: 'fill_blank',
    question: 'Complete the constant declaration in C++:\n\n___ double PI = 3.14159;',
    codeTemplate: '___ double PI = 3.14159;',
    acceptedAnswers: ['const'],
    explanation: 'const declares a constant — a variable whose value cannot be changed after initialization.',
    hint: 'The keyword that makes a variable immutable in C++.',
    xp: 5
  },

  /* ── DATA TYPES ─────────────────────────────────────── */
  {
    id: 'cpp-q005',
    language: 'cpp',
    topic: 'data_types',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Which C++ type stores a single character?',
    options: ['string', 'char', 'letter', 'character'],
    correctAnswer: 'char',
    explanation: 'char stores a single character: char grade = \'A\'; Strings use the string class.',
    hint: 'Single character uses single quotes and the char type.',
    xp: 5
  },
  {
    id: 'cpp-q006',
    language: 'cpp',
    topic: 'data_types',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'In C++, the string type is a built-in primitive like int.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'string in C++ is a class from the Standard Library, not a primitive. You need #include <string>.',
    hint: 'int, char, double are primitives. string is a class.',
    xp: 5
  },

  /* ── INPUT AND OUTPUT ───────────────────────────────── */
  {
    id: 'cpp-q007',
    language: 'cpp',
    topic: 'input_output',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'Which object is used to read user input from the keyboard in C++?',
    options: ['cout', 'input', 'cin', 'read'],
    correctAnswer: 'cin',
    explanation: 'cin (console input) reads from the keyboard using the >> operator: cin >> name;',
    hint: 'cout outputs, cin inputs. Both need #include <iostream>.',
    xp: 5
  },
  {
    id: 'cpp-q008',
    language: 'cpp',
    topic: 'input_output',
    difficulty: 'beginner',
    type: 'find_mistake',
    question: 'Find the mistake:\n\ncout >> "Hello World" >> endl;',
    options: [
      'cout should be cin',
      'Should use << not >> with cout',
      'endl is not valid',
      'Missing semicolon'
    ],
    correctAnswer: 'Should use << not >> with cout',
    explanation: 'cout uses the << (insertion) operator to send output. >> is the extraction operator used with cin.',
    hint: 'cout << sends output. cin >> receives input.',
    xp: 5
  },

  /* ── OPERATORS ──────────────────────────────────────── */
  {
    id: 'cpp-q009',
    language: 'cpp',
    topic: 'operators',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this C++ code print?\n\nint a = 10;\nint b = 3;\ncout << a % b << endl;',
    options: ['3', '1', '0', '10'],
    correctAnswer: '1',
    explanation: '% is the modulo operator. 10 % 3 = 1 (remainder when 10 is divided by 3).',
    hint: 'Modulo gives the remainder after division.',
    xp: 5
  },
  {
    id: 'cpp-q010',
    language: 'cpp',
    topic: 'operators',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What does the ++ operator do in C++?',
    options: ['Multiplies by 2', 'Increments by 1', 'Adds 2', 'Compares values'],
    correctAnswer: 'Increments by 1',
    explanation: 'x++ is equivalent to x = x + 1. It increments the variable by exactly 1.',
    hint: 'x++ and x += 1 are equivalent.',
    xp: 5
  },

  /* ── CONDITIONS ─────────────────────────────────────── */
  {
    id: 'cpp-q011',
    language: 'cpp',
    topic: 'conditions',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What is printed?\n\nint age = 20;\nif (age >= 18) {\n    cout << "Adult" << endl;\n} else {\n    cout << "Minor" << endl;\n}',
    options: ['Adult', 'Minor', 'Nothing', 'Error'],
    correctAnswer: 'Adult',
    explanation: 'age is 20, which is >= 18, so the if block runs and prints "Adult".',
    hint: 'Is 20 >= 18?',
    xp: 5
  },
  {
    id: 'cpp-q012',
    language: 'cpp',
    topic: 'conditions',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What does the && operator mean in C++?',
    options: ['OR', 'NOT', 'AND', 'EQUALS'],
    correctAnswer: 'AND',
    explanation: '&& is logical AND. Both conditions must be true for the overall expression to be true.',
    hint: '|| is OR. && is AND. ! is NOT.',
    xp: 5
  },

  /* ── LOOPS ──────────────────────────────────────────── */
  {
    id: 'cpp-q013',
    language: 'cpp',
    topic: 'loops',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'How many times does this loop execute?\n\nfor (int i = 1; i <= 4; i++) {\n    cout << i << endl;\n}',
    options: ['3', '4', '5', '1'],
    correctAnswer: '4',
    explanation: 'i goes 1, 2, 3, 4 (i <= 4 stops AFTER printing 4). That is 4 executions.',
    hint: 'Count: i = 1, 2, 3, 4 — four values.',
    xp: 5
  },
  {
    id: 'cpp-q014',
    language: 'cpp',
    topic: 'loops',
    difficulty: 'beginner',
    type: 'true_false',
    question: 'A do-while loop in C++ always executes its body at least once.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'A do-while loop runs the body first, then checks the condition — so it always runs at least once.',
    hint: 'The condition is checked after the loop body runs.',
    xp: 5
  },

  /* ── FUNCTIONS ──────────────────────────────────────── */
  {
    id: 'cpp-q015',
    language: 'cpp',
    topic: 'functions',
    difficulty: 'beginner',
    type: 'multiple_choice',
    question: 'What return type do you use for a C++ function that returns nothing?',
    options: ['null', 'nothing', 'void', 'empty'],
    correctAnswer: 'void',
    explanation: 'void means the function performs an action but does not return a value.',
    hint: 'Same as Java — void for no return value.',
    xp: 5
  },
  {
    id: 'cpp-q016',
    language: 'cpp',
    topic: 'functions',
    difficulty: 'beginner',
    type: 'predict_output',
    question: 'What does this print?\n\nint add(int a, int b) {\n    return a + b;\n}\ncout << add(5, 6) << endl;',
    options: ['5', '6', '11', 'add(5,6)'],
    correctAnswer: '11',
    explanation: 'add(5, 6) returns 5 + 6 = 11. cout then prints 11.',
    hint: 'Substitute a=5, b=6 into the return statement.',
    xp: 5
  },
  {
    id: 'cpp-q017',
    language: 'cpp',
    topic: 'functions',
    difficulty: 'beginner',
    type: 'find_mistake',
    question: 'Find the mistake in this C++ function:\n\nvoid greet(string name)\n    cout << "Hello " << name << endl;\n}',
    options: [
      'void should be int',
      'Missing opening curly brace { after the parameter list',
      'cout should be cin',
      'Missing semicolon after the function name'
    ],
    correctAnswer: 'Missing opening curly brace { after the parameter list',
    explanation: 'C++ function bodies must be enclosed in curly braces. The opening { is missing after greet(string name).',
    hint: 'Every C++ function body needs { and }.',
    xp: 5
  }

]; // end cpp questions

// C++ trace questions practice integer expressions, branches, loops, array
// indexing, and function returns with short compilable-style snippets.
window.CodeQuestQuestionBanks.cpp.push(...Array.from({ length: 55 }, (_, i) => {
  const n=i+2;
  const templates=[
    {topic:'operators',code:`int value = ${n};\ncout << value * value - value;`,answer:String(n*n-n),explain:'Multiplication is evaluated before subtraction.'},
    {topic:'conditions',code:`int number = ${n};\nif (number % 2 == 0) cout << "even";\nelse cout << "odd";`,answer:n%2===0?'even':'odd',explain:'The remainder selects the even or odd branch.'},
    {topic:'loops',code:`int total = 0;\nfor (int k = 1; k < ${n%5+3}; ++k) total += k;\ncout << total;`,answer:String(Array.from({length:n%5+2},(_,j)=>j+1).reduce((a,b)=>a+b,0)),explain:'The loop stops before the strict upper bound.'},
    {topic:'arrays',code:`int values[] = {${n}, ${n+1}, ${n+2}};\ncout << values[2] - values[0];`,answer:'2',explain:'Array indexing starts at zero; subtract the first element from the third.'},
    {topic:'functions',code:`int adjust(int x) { return x * 3 - 1; }\ncout << adjust(${n});`,answer:String(n*3-1),explain:'The function returns three times its argument minus one.'},
    {topic:'references',code:`int count = ${n};\nint& alias = count;\nalias += 2;\ncout << count;`,answer:String(n+2),explain:'alias is a reference to count, so updating it changes count.'},
    {topic:'pointers',code:`int value = ${n};\nint* ptr = &value;\n*ptr += 1;\ncout << value;`,answer:String(n+1),explain:'Dereferencing ptr updates the value stored at its address.'}
  ];
  const t=templates[i%templates.length], value=Number(t.answer);
  const options=Number.isFinite(value)
    ? [...new Set([t.answer,String(value+1),String(value-1),String(value+2)])]
    : [...new Set([t.answer,'even','odd','unknown'])];
  while(options.length<4) options.push(`result-${options.length}`);
  return {id:`cpp-q${String(i+18).padStart(3,'0')}`,language:'cpp',
    chapterId:['cpp-ch1','cpp-ch2','cpp-ch3','cpp-ch4'][i%4],topic:t.topic,
    difficulty:i%5===0?'intermediate':'beginner',type:'predict_output',
    question:`Predict the output (trace ${i+1}):\n\n${t.code}`,options,
    correctAnswer:t.answer,explanation:t.explain,
    hint:'Trace each statement and consider how indexing, references, or loop bounds work.',xp:5};
}));
