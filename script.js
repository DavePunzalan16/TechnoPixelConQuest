/* =========================================================
   TECHNOPIXEL CODEQUEST — SCRIPT.JS
   Complete application logic
   ========================================================= */

'use strict';

/* ─── SECTION 0: STORAGE HELPERS (must be first) ────────── */
// Storage MUST be declared before AudioManager so loadPrefs() can call Storage.get()
const Storage = {
  get(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch (e) { console.warn('[Storage] get failed:', key, e); return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('[Storage] set failed:', key, e); }
  },
  remove(key) {
    try { localStorage.removeItem(key); }
    catch (e) { console.warn('[Storage] remove failed:', key, e); }
  }
};

/* ─── SAFE LUCIDE INIT ───────────────────────────────────── */
function safeCreateIcons(context) {
  try {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      if (context) safeCreateIcons({ nodes: Array.isArray(context) ? context : [context] });
      else safeCreateIcons();
    }
  } catch (e) { /* Lucide CDN unavailable — icons degrade gracefully */ }
}

/* ─── SECTION 1: AUDIO MANAGER ─────────────────────────── */
const AudioManager = (() => {
  const tracks = {};
  let bgm = null;
  let sfxEnabled = true;
  let musicEnabled = true;
  let masterVolume = 0.7;
  let sfxVolume = 0.8;
  let musicVolume = 0.25;
  let interacted = false;

  const SFX_FILES = {
    click:      'assets/audio/sfx_click.mp3',
    correct:    'assets/audio/sfx_correct.mp3',
    wrong:      'assets/audio/sfx_wrong.mp3',
    complete:   'assets/audio/sfx_complete.mp3',
    xp:         'assets/audio/sfx_xp.mp3',
    unlock:     'assets/audio/sfx_unlock.mp3',
    transition: 'assets/audio/sfx_transition.mp3'
  };

  function loadPrefs() {
    const saved = Storage.get('codequest_audio');
    if (saved) {
      sfxEnabled   = saved.sfxEnabled   !== undefined ? saved.sfxEnabled   : true;
      musicEnabled = saved.musicEnabled !== undefined ? saved.musicEnabled : true;
      masterVolume = saved.masterVolume !== undefined ? saved.masterVolume : 0.7;
      sfxVolume    = saved.sfxVolume    !== undefined ? saved.sfxVolume    : 0.8;
      musicVolume  = saved.musicVolume  !== undefined ? saved.musicVolume  : 0.25;
    }
  }

  function savePrefs() {
    Storage.set('codequest_audio', { sfxEnabled, musicEnabled, masterVolume, sfxVolume, musicVolume });
  }

  function preloadSFX() {
    for (const [key, path] of Object.entries(SFX_FILES)) {
      try {
        const audio = new Audio();
        audio.src = path;
        audio.preload = 'auto';
        tracks[key] = audio;
      } catch (e) { /* graceful fail */ }
    }
  }

  function playSFX(name) {
    if (!sfxEnabled || !interacted) return;
    try {
      const src = tracks[name];
      if (!src) return;
      const clone = src.cloneNode();
      clone.volume = Math.min(1, sfxVolume * masterVolume);
      clone.play().catch(() => {});
    } catch (e) {}
  }

  function playBackgroundMusic() {
    if (!musicEnabled || !interacted) return;
    try {
      if (!bgm) {
        bgm = new Audio('assets/audio/bgm_codequest.mp3');
        bgm.loop = true;
        bgm.volume = Math.min(1, musicVolume * masterVolume);
      }
      bgm.play().catch(() => {});
    } catch (e) {}
  }

  function stopBackgroundMusic() {
    if (bgm) { bgm.pause(); bgm.currentTime = 0; }
  }

  function setMusicVolume(val) {
    musicVolume = parseFloat(val);
    if (bgm) bgm.volume = Math.min(1, musicVolume * masterVolume);
    savePrefs();
  }

  function setMasterVolume(val) {
    masterVolume = parseFloat(val);
    if (bgm) bgm.volume = Math.min(1, musicVolume * masterVolume);
    savePrefs();
  }

  function setSFXEnabled(val) {
    sfxEnabled = val;
    savePrefs();
  }

  function setMusicEnabled(val) {
    musicEnabled = val;
    if (val) playBackgroundMusic();
    else if (bgm) bgm.pause();
    savePrefs();
  }

  function markInteracted() {
    if (!interacted) {
      interacted = true;
      if (musicEnabled) playBackgroundMusic();
    }
  }

  function getState() {
    return { sfxEnabled, musicEnabled, masterVolume, sfxVolume, musicVolume };
  }

  loadPrefs();
  preloadSFX();

  return { playSFX, playBackgroundMusic, stopBackgroundMusic, setMusicVolume,
           setMasterVolume, setSFXEnabled, setMusicEnabled, markInteracted, getState };
})();

/* ─── SECTION 2: SCHEMA VERSION & STATE MIGRATION ──────── */
const SCHEMA_VERSION = 2;

/* ─── SECTION 3: CURRICULUM DATA ───────────────────────── */
const CURRICULUM = {
  python: {
    name: 'Python', icon: 'devicon-python-plain colored', color: '#3776AB',
    chapters: [
      {
        id: 'py-ch1', title: 'THE BEGINNING', subtitle: 'Your first steps into Python',
        lessons: [
          {
            id: 'py-1-1', title: 'Welcome to Python', type: 'lesson', xp: 20,
            mascotMood: 'portrait',
            mascotText: "Python was created in 1991 and is loved for its clean, readable style.",
            explanation: "Python is a <strong>high-level programming language</strong> — designed to be read and written easily. Unlike some languages, Python doesn't need lots of setup code. You can start doing things right away!",
            codeExample: { lang: 'python', code: `# This is a Python comment\n# Comments are notes for programmers\n\nprint("Hello, World!")` },
            exercise: {
              type: 'multiple_choice',
              question: 'What is Python best described as?',
              options: ['A type of snake', 'A high-level programming language', 'A web browser', 'An operating system'],
              correct: 1,
              explanation: 'Python is a high-level programming language, designed to be readable and easy to learn!'
            }
          },
          {
            id: 'py-1-2', title: 'Your First print() Statement', type: 'lesson', xp: 20,
            mascotMood: 'thinking',
            mascotText: "The print() function is your best friend in Python. It shows text on screen.",
            explanation: "The <strong>print()</strong> function displays output to the screen. Put text inside quotes inside the parentheses.",
            codeExample: { lang: 'python', code: `print("Hello, World!")\nprint("I am learning Python!")\nprint("CodeQuest is awesome!")` },
            exercise: {
              type: 'fill_blank',
              question: 'Complete the code to print "Hello World":',
              code: `___("Hello World")`,
              blanks: [{ placeholder: 'function name', answer: 'print' }],
              explanation: 'The print() function displays output. Always write it in lowercase!'
            }
          },
          {
            id: 'py-1-3', title: 'Variables', type: 'lesson', xp: 20,
            mascotMood: 'thinking',
            mascotText: "Variables are like labeled boxes that hold information!",
            explanation: "A <strong>variable</strong> is a name that stores a value. In Python, create a variable with: <code>name = value</code>. No type declaration needed!",
            codeExample: { lang: 'python', code: `name = "Alex"\nage = 16\n\nprint(name)   # Output: Alex\nprint(age)    # Output: 16` },
            exercise: {
              type: 'multiple_choice',
              question: 'Which of the following correctly creates a variable in Python?',
              options: ['var name = "Alex"', 'string name = "Alex"', 'name = "Alex"', 'let name = "Alex"'],
              correct: 2,
              explanation: 'In Python, just write: name = "Alex". No special keyword needed!'
            }
          },
          {
            id: 'py-1-4', title: 'Data Types', type: 'lesson', xp: 20,
            mascotMood: 'thinking',
            mascotText: "Python has different types of data. The main ones are str, int, float, and bool.",
            explanation: "Python's main <strong>data types</strong>: <strong>str</strong> (text), <strong>int</strong> (whole numbers), <strong>float</strong> (decimals), <strong>bool</strong> (True/False).",
            codeExample: { lang: 'python', code: `name    = "Python"   # str\nversion = 3          # int\nrating  = 9.5        # float\nis_fun  = True       # bool\n\nprint(type(name))    # <class 'str'>` },
            exercise: {
              type: 'predict_output',
              question: 'What is the data type of the value 42?',
              options: ['str', 'int', 'float', 'bool'],
              correct: 1,
              explanation: '42 is a whole number with no decimal point, so it is an int.'
            }
          },
          {
            id: 'py-1-5', title: 'Chapter 1 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait',
            mascotText: "Time to show what you've learned! You've got this!",
            explanation: "Let's test your knowledge of Python basics!",
            exercise: {
              type: 'arrange',
              question: 'Arrange these lines to correctly define and print name and age:',
              blocks: ['print(name)', 'age = 16', 'name = "Alex"', 'print(age)'],
              correct: ['name = "Alex"', 'age = 16', 'print(name)', 'print(age)'],
              explanation: 'Variables must be defined before you use them. Then print() displays them!'
            }
          }
        ]
      },
      {
        id: 'py-ch2', title: 'LOGIC AND DECISIONS', subtitle: 'Making your code think',
        lessons: [
          {
            id: 'py-2-1', title: 'Arithmetic Operators', type: 'lesson', xp: 20,
            mascotMood: 'thinking',
            mascotText: "Operators let you do math in your code!",
            explanation: "Python <strong>arithmetic operators</strong>: + (add), - (subtract), * (multiply), / (divide), ** (power), % (remainder).",
            codeExample: { lang: 'python', code: `x = 10\ny = 3\n\nprint(x + y)   # 13\nprint(x - y)   # 7\nprint(x * y)   # 30\nprint(x / y)   # 3.333...` },
            exercise: {
              type: 'predict_output',
              question: 'What does this print?\n\nx = 5\ny = 2\nprint(x * y)',
              options: ['52', '7', '10', '3'],
              correct: 2,
              explanation: '5 * 2 = 10. The * operator multiplies.'
            }
          },
          {
            id: 'py-2-2', title: 'Comparison Operators', type: 'lesson', xp: 20,
            mascotMood: 'thinking',
            mascotText: "Comparison operators compare two values and return True or False.",
            explanation: "Comparison operators: <strong>==</strong> (equals), <strong>!=</strong> (not equal), <strong>&gt;</strong>, <strong>&lt;</strong>, <strong>&gt;=</strong>, <strong>&lt;=</strong>. They always return a bool.",
            codeExample: { lang: 'python', code: `age = 16\n\nprint(age == 16)   # True\nprint(age > 18)    # False\nprint(age != 20)   # True` },
            exercise: {
              type: 'multiple_choice',
              question: 'Which operator checks if two values are equal?',
              options: ['=', '==', '!=', '>='],
              correct: 1,
              explanation: '== checks equality. A single = assigns a value to a variable.'
            }
          },
          {
            id: 'py-2-3', title: 'if Statements', type: 'lesson', xp: 20,
            mascotMood: 'portrait',
            mascotText: "if statements run code only when a condition is True!",
            explanation: "An <strong>if statement</strong> checks a condition. If True, the indented code runs. Indentation (spaces) is critical in Python!",
            codeExample: { lang: 'python', code: `temperature = 32\n\nif temperature > 30:\n    print("It's hot outside!")` },
            exercise: {
              type: 'fill_blank',
              question: 'Complete the if statement:',
              code: `score = 85\n___ score >= 60:\n    print("You passed!")`,
              blanks: [{ placeholder: 'keyword', answer: 'if' }],
              explanation: 'The if keyword starts a conditional block. Remember the colon : at the end!'
            }
          },
          {
            id: 'py-2-4', title: 'if, elif, and else', type: 'lesson', xp: 20,
            mascotMood: 'thinking',
            mascotText: "elif means else if. It lets you check multiple conditions in order!",
            explanation: "Chain conditions: <strong>if</strong> checks first, <strong>elif</strong> checks another, <strong>else</strong> is the fallback.",
            codeExample: { lang: 'python', code: `grade = 75\n\nif grade >= 90:\n    print("Excellent!")\nelif grade >= 75:\n    print("Good job!")\nelse:\n    print("Keep practicing.")` },
            exercise: {
              type: 'predict_output',
              question: 'With grade = 75, what gets printed?',
              options: ['Excellent!', 'Good job!', 'Keep practicing.', 'Nothing'],
              correct: 1,
              explanation: 'grade=75 is not >= 90, but IS >= 75, so elif runs: "Good job!"'
            }
          },
          {
            id: 'py-2-5', title: 'Chapter 2 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait',
            mascotText: "Chapter 2 complete! Let's check what clicked.",
            exercise: {
              type: 'find_mistake',
              question: 'Find the mistake in this code:',
              code: `score = 80\nif score >= 60\n    print("Pass")`,
              options: ['score should be a string', 'Missing colon : after the if condition', 'print should be Print', 'The comparison should use =='],
              correct: 1,
              explanation: 'In Python, if statements must end with a colon: if score >= 60:'
            }
          }
        ]
      },
      {
        id: 'py-ch3', title: 'LOOPS AND REPETITION', subtitle: 'Automate the boring stuff',
        lessons: [
          {
            id: 'py-3-1', title: 'Introduction to Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Loops let you repeat code without writing it over and over!",
            explanation: "A <strong>loop</strong> runs the same block of code multiple times. Instead of writing print() ten times, write it once inside a loop!",
            codeExample: { lang: 'python', code: `# Without a loop:\nprint("Hello!")\nprint("Hello!")\nprint("Hello!")\n\n# With a loop:\nfor i in range(3):\n    print("Hello!")` },
            exercise: { type: 'multiple_choice', question: 'What is the main purpose of a loop?', options: ['Make code run faster', 'Repeat code multiple times', 'Compare two values', 'Store data'], correct: 1, explanation: 'Loops allow you to repeat code without writing it multiple times!' }
          },
          {
            id: 'py-3-2', title: 'For Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "for loops are perfect when you know exactly how many times to repeat!",
            explanation: "A <strong>for loop</strong> iterates over a sequence. <strong>range(n)</strong> creates numbers from 0 to n-1.",
            codeExample: { lang: 'python', code: `for i in range(5):\n    print(i)  # Prints 0, 1, 2, 3, 4\n\nfor i in range(1, 4):\n    print(i)  # Prints 1, 2, 3` },
            exercise: { type: 'predict_output', question: 'How many times does this loop run?\n\nfor i in range(4):\n    print("Go!")', options: ['3 times', '4 times', '5 times', '1 time'], correct: 1, explanation: 'range(4) generates 0, 1, 2, 3 — 4 numbers, so the loop runs 4 times.' }
          },
          {
            id: 'py-3-3', title: 'While Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "while loops keep running as long as a condition is True!",
            explanation: "A <strong>while loop</strong> runs while a condition remains True. Always update the variable or you get an infinite loop!",
            codeExample: { lang: 'python', code: `count = 0\n\nwhile count < 3:\n    print("count is", count)\n    count = count + 1\n\n# Output: count is 0, count is 1, count is 2` },
            exercise: { type: 'multiple_choice', question: 'What happens if a while loop condition never becomes False?', options: ['The loop runs once', 'The loop skips', 'An infinite loop occurs', 'Python prints an error immediately'], correct: 2, explanation: 'An infinite loop runs forever! Always ensure your while loop can stop.' }
          },
          {
            id: 'py-3-4', title: 'Break and Continue', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "break exits the loop. continue skips to the next iteration!",
            explanation: "<strong>break</strong> exits the loop completely. <strong>continue</strong> skips the rest of the current iteration.",
            codeExample: { lang: 'python', code: `for i in range(10):\n    if i == 5:\n        break    # stop at 5\n    print(i)   # prints 0,1,2,3,4` },
            exercise: { type: 'multiple_choice', question: 'Which keyword exits a loop immediately?', options: ['stop', 'exit', 'break', 'end'], correct: 2, explanation: 'break immediately exits the loop.' }
          },
          {
            id: 'py-3-5', title: 'Chapter 3 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "Loops mastered! Let's check your understanding.",
            exercise: { type: 'fill_blank', question: 'Complete the for loop to print numbers 1 to 5:', code: `for i in range(___, 6):\n    print(i)`, blanks: [{ placeholder: 'start value', answer: '1' }], explanation: 'range(1, 6) starts at 1 and goes up to (but not including) 6.' }
          }
        ]
      },
      {
        id: 'py-ch4', title: 'FUNCTIONS', subtitle: 'Reusable blocks of code',
        lessons: [
          {
            id: 'py-4-1', title: 'What Are Functions?', type: 'lesson', xp: 20,
            mascotMood: 'portrait', mascotText: "Functions let you write code once and use it many times. They're like recipes!",
            explanation: "A <strong>function</strong> is a named block of code that does a specific task. Define it with <strong>def</strong>, then call it whenever needed.",
            codeExample: { lang: 'python', code: `def say_hello():\n    print("Hello, CodeQuest!")\n\n# Call the function:\nsay_hello()  # Output: Hello, CodeQuest!\nsay_hello()  # Can call it again!` },
            exercise: { type: 'multiple_choice', question: 'Which keyword defines a function in Python?', options: ['function', 'func', 'def', 'define'], correct: 2, explanation: 'def is the keyword to define a function in Python.' }
          },
          {
            id: 'py-4-2', title: 'Defining Functions', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "The structure: def name(): followed by indented code.",
            explanation: "Function definition: <strong>def</strong> keyword + <strong>name</strong> + <strong>parentheses</strong> + <strong>colon</strong>. All code inside must be <strong>indented</strong>.",
            codeExample: { lang: 'python', code: `def greet():\n    print("Welcome to Python!")\n    print("Let's code together!")\n\ngreet()  # Calls the function` },
            exercise: { type: 'find_mistake', question: 'Find the mistake in this function:', code: `def greet()\n    print("Hello!")`, options: ['def should be Def', 'Missing colon : after greet()', 'print should be uppercase', 'Needs a return statement'], correct: 1, explanation: 'Function definitions need a colon: def greet():' }
          },
          {
            id: 'py-4-3', title: 'Parameters and Arguments', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Parameters let you pass information into a function!",
            explanation: "<strong>Parameters</strong> are variables in the definition. <strong>Arguments</strong> are the actual values passed when calling.",
            codeExample: { lang: 'python', code: `def greet(name):  # name is a parameter\n    print("Hello, " + name + "!")\n\ngreet("Alex")   # Output: Hello, Alex!\ngreet("Sam")    # Output: Hello, Sam!` },
            exercise: { type: 'predict_output', question: 'What is printed by greet("Jordan")?', options: ['Hello, name!', 'Hello, Jordan!', 'Hello, "Jordan"!', 'Error'], correct: 1, explanation: '"Jordan" replaces name, so it prints: Hello, Jordan!' }
          },
          {
            id: 'py-4-4', title: 'Return Values', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Functions can give back a result using the return keyword!",
            explanation: "The <strong>return</strong> statement sends a value back from a function.",
            codeExample: { lang: 'python', code: `def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)  # Output: 8` },
            exercise: { type: 'multiple_choice', question: 'What does the return keyword do?', options: ['Prints a value', 'Sends a value back to the caller', 'Ends the program', 'Creates a new variable'], correct: 1, explanation: 'return sends a value back so you can use it elsewhere.' }
          },
          {
            id: 'py-4-5', title: 'Chapter 4 Final Challenge', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "You've learned functions! Let's put it all together.",
            exercise: { type: 'arrange', question: 'Arrange to create and call a greeting function:', blocks: ['greet("Alex")', 'def greet(name):', '    print("Hello, " + name)', 'greet("Sam")'], correct: ['def greet(name):', '    print("Hello, " + name)', 'greet("Alex")', 'greet("Sam")'], explanation: 'Define the function first, then call it.' }
          }
        ]
      }
    ]
  },

  java: {
    name: 'Java', icon: 'devicon-java-plain colored', color: '#ED8B00',
    chapters: [
      {
        id: 'java-ch1', title: 'THE BEGINNING', subtitle: 'Getting started with Java',
        lessons: [
          {
            id: 'java-1-1', title: 'Welcome to Java', type: 'lesson', xp: 20,
            mascotMood: 'portrait', mascotText: "Java powers Android apps, enterprise systems, and much more!",
            explanation: "Java is a <strong>strongly typed, object-oriented language</strong>. Every Java program needs a class and a main method. 'Write once, run anywhere.'",
            codeExample: { lang: 'java', code: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}` },
            exercise: { type: 'multiple_choice', question: 'What is the entry point method in a Java program?', options: ['start()', 'run()', 'main()', 'init()'], correct: 2, explanation: 'Every Java program begins with: public static void main(String[] args)' }
          },
          {
            id: 'java-1-2', title: 'Printing Output', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "In Java, System.out.println() prints to the screen.",
            explanation: "<strong>System.out.println()</strong> prints text with a new line. <strong>System.out.print()</strong> prints without a new line. Don't forget the semicolon!",
            codeExample: { lang: 'java', code: `System.out.println("Hello, Java!");\nSystem.out.println("Learning is fun.");\nSystem.out.print("No newline here.");` },
            exercise: { type: 'fill_blank', question: 'Complete: System.___.println("Hello");', code: `System.___.println("Hello");`, blanks: [{ placeholder: 'keyword', answer: 'out' }], explanation: 'System.out.println() is the standard output method.' }
          },
          {
            id: 'java-1-3', title: 'Variables and Data Types', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "In Java, you must declare a variable's type before using it!",
            explanation: "Java is <strong>statically typed</strong> — declare the type of every variable. Common types: <strong>int</strong>, <strong>double</strong>, <strong>String</strong>, <strong>boolean</strong>.",
            codeExample: { lang: 'java', code: `int age = 16;\ndouble gpa = 3.75;\nString name = "Alex";\nboolean isStudent = true;\n\nSystem.out.println(name + " is " + age);` },
            exercise: { type: 'multiple_choice', question: 'Which data type stores whole numbers in Java?', options: ['double', 'String', 'int', 'char'], correct: 2, explanation: 'int stores whole numbers. double is for decimals.' }
          },
          {
            id: 'java-1-4', title: 'Comments in Java', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Comments help explain your code. Java ignores them when running.",
            explanation: "Java comment styles: <strong>//</strong> for single-line, <strong>/* ... */</strong> for multi-line block comments.",
            codeExample: { lang: 'java', code: `// This is a single-line comment\nint x = 5; // x is 5\n\n/*\n  This is a\n  multi-line comment\n*/\nSystem.out.println(x);` },
            exercise: { type: 'multiple_choice', question: 'How do you write a single-line comment in Java?', options: ['# comment', '// comment', '<!-- comment -->', '** comment'], correct: 1, explanation: 'In Java, single-line comments start with //.' }
          },
          {
            id: 'java-1-5', title: 'Chapter 1 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "Great work on Java basics!",
            exercise: { type: 'find_mistake', question: 'Find the mistake in this Java code:', code: `int age = 16\nSystem.out.println(age);`, options: ['int should be Integer', 'Missing semicolon ; after the declaration', 'println should be print', 'age should be in quotes'], correct: 1, explanation: 'Java statements must end with a semicolon: int age = 16;' }
          }
        ]
      },
      {
        id: 'java-ch2', title: 'LOGIC AND DECISIONS', subtitle: 'Conditional programming',
        lessons: [
          {
            id: 'java-2-1', title: 'Arithmetic Operators', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Java uses the same arithmetic operators as math!",
            explanation: "Java arithmetic: + (add), - (subtract), * (multiply), / (divide), % (modulo — remainder).",
            codeExample: { lang: 'java', code: `int a = 10;\nint b = 3;\n\nSystem.out.println(a + b);  // 13\nSystem.out.println(a % b);  // 1 (remainder)` },
            exercise: { type: 'predict_output', question: 'What is the value of 10 % 3?', options: ['3', '1', '0', '10'], correct: 1, explanation: '10 divided by 3 is 3 with remainder 1. % gives the remainder.' }
          },
          {
            id: 'java-2-2', title: 'if Statements', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "In Java, if statements use curly braces {} for code blocks.",
            explanation: "Java's <strong>if statement</strong> checks a condition in parentheses. The code block goes in curly braces.",
            codeExample: { lang: 'java', code: `int score = 85;\n\nif (score >= 60) {\n    System.out.println("You passed!");\n}` },
            exercise: { type: 'multiple_choice', question: 'In Java, what wraps the condition in an if statement?', options: ['Curly braces {}', 'Square brackets []', 'Parentheses ()', 'Quotes ""'], correct: 2, explanation: 'The condition goes in parentheses: if (condition) { ... }' }
          },
          {
            id: 'java-2-3', title: 'if-else and else-if', type: 'lesson', xp: 20,
            mascotMood: 'portrait', mascotText: "else if gives you multiple branches of logic!",
            explanation: "Chain conditions with <strong>else if</strong> and catch everything else with <strong>else</strong>.",
            codeExample: { lang: 'java', code: `int grade = 75;\n\nif (grade >= 90) {\n    System.out.println("A");\n} else if (grade >= 75) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}` },
            exercise: { type: 'predict_output', question: 'With grade = 75, what is printed?', options: ['A', 'B', 'C', 'Nothing'], correct: 1, explanation: '75 is not >= 90 but IS >= 75, so else if runs: B' }
          },
          {
            id: 'java-2-4', title: 'Logical Operators', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "&& means AND, || means OR in Java!",
            explanation: "Logical operators: <strong>&amp;&amp;</strong> (AND), <strong>||</strong> (OR), <strong>!</strong> (NOT).",
            codeExample: { lang: 'java', code: `int age = 17;\nboolean hasID = true;\n\nif (age >= 16 && hasID) {\n    System.out.println("Entry allowed");\n}` },
            exercise: { type: 'multiple_choice', question: 'What does && mean in Java?', options: ['OR', 'NOT', 'AND', 'EQUALS'], correct: 2, explanation: '&& is logical AND. Both conditions must be true.' }
          },
          {
            id: 'java-2-5', title: 'Chapter 2 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "Excellent work on Java decisions!",
            exercise: { type: 'find_mistake', question: 'Find the mistake:', code: `int x = 10;\nif x > 5 {\n    System.out.println("Big");\n}`, options: ['int should be Integer', 'Missing parentheses around the condition', 'println is wrong', 'Missing semicolon'], correct: 1, explanation: 'Java if conditions must be in parentheses: if (x > 5)' }
          }
        ]
      },
      {
        id: 'java-ch3', title: 'LOOPS AND REPETITION', subtitle: 'Repeating actions in Java',
        lessons: [
          {
            id: 'java-3-1', title: 'for Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Java for loops have three parts: init, condition, update.",
            explanation: "A Java <strong>for loop</strong>: <strong>int i = 0</strong> (start), <strong>i &lt; 5</strong> (condition), <strong>i++</strong> (update).",
            codeExample: { lang: 'java', code: `for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n// Prints 0, 1, 2, 3, 4` },
            exercise: { type: 'predict_output', question: 'How many times does this loop run?\nfor (int i = 1; i <= 3; i++)', options: ['2', '3', '4', '1'], correct: 1, explanation: 'i goes 1, 2, 3 — that is 3 iterations.' }
          },
          {
            id: 'java-3-2', title: 'while Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "while loops in Java work just like Python, but with parentheses!",
            explanation: "A <strong>while loop</strong> repeats while the condition is true. Always update the variable!",
            codeExample: { lang: 'java', code: `int count = 0;\n\nwhile (count < 3) {\n    System.out.println(count);\n    count++;\n}` },
            exercise: { type: 'multiple_choice', question: 'What does count++ do in Java?', options: ['Decreases count by 1', 'Increases count by 1', 'Resets count to 0', 'Prints count'], correct: 1, explanation: 'count++ is shorthand for count = count + 1.' }
          },
          {
            id: 'java-3-3', title: 'Break and Continue', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "break and continue work the same way in Java!",
            explanation: "<strong>break</strong> exits the loop. <strong>continue</strong> skips to the next iteration.",
            codeExample: { lang: 'java', code: `for (int i = 0; i < 10; i++) {\n    if (i == 5) break;\n    System.out.println(i);\n}` },
            exercise: { type: 'multiple_choice', question: 'Which keyword skips the current loop iteration?', options: ['break', 'skip', 'continue', 'next'], correct: 2, explanation: 'continue skips to the next iteration.' }
          },
          {
            id: 'java-3-4', title: 'Nested Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "You can put a loop inside another loop — nested loops!",
            explanation: "A <strong>nested loop</strong> is a loop inside another. The inner loop runs completely for every outer iteration.",
            codeExample: { lang: 'java', code: `for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.println(i + "," + j);\n    }\n}` },
            exercise: { type: 'predict_output', question: 'How many total prints for loops i=1..2, j=1..2?', options: ['2', '4', '6', '8'], correct: 1, explanation: '2 outer × 2 inner = 4 total.' }
          },
          {
            id: 'java-3-5', title: 'Chapter 3 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "Loops conquered in Java!",
            exercise: { type: 'arrange', question: 'Arrange to print 1 to 3:', blocks: ['for (int i = 1; i <= 3; i++) {', '    System.out.println(i);', '}'], correct: ['for (int i = 1; i <= 3; i++) {', '    System.out.println(i);', '}'], explanation: 'The for header comes first, then the body in braces.' }
          }
        ]
      },
      {
        id: 'java-ch4', title: 'METHODS', subtitle: 'Reusable code in Java',
        lessons: [
          {
            id: 'java-4-1', title: 'What Are Methods?', type: 'lesson', xp: 20,
            mascotMood: 'portrait', mascotText: "In Java, functions are called methods. They live inside classes!",
            explanation: "A <strong>method</strong> is a named code block in a Java class. Use <strong>void</strong> when it doesn't return anything.",
            codeExample: { lang: 'java', code: `public static void greet() {\n    System.out.println("Hello!");\n}\n\n// Call it:\ngreet();` },
            exercise: { type: 'multiple_choice', question: 'What return type means a method returns nothing?', options: ['null', 'nothing', 'void', 'empty'], correct: 2, explanation: 'void means no value is returned.' }
          },
          {
            id: 'java-4-2', title: 'Method Parameters', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Parameters let you pass data into a method.",
            explanation: "Declare parameters with their <strong>type</strong> and <strong>name</strong> in the parentheses.",
            codeExample: { lang: 'java', code: `public static void greet(String name) {\n    System.out.println("Hello, " + name);\n}\n\ngreet("Alex");  // Hello, Alex` },
            exercise: { type: 'predict_output', question: 'What does greet("Sam") print?', options: ['Hello, name', 'Hello, Sam', 'Hello, "Sam"', 'Error'], correct: 1, explanation: '"Sam" replaces name: Hello, Sam' }
          },
          {
            id: 'java-4-3', title: 'Return Values', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Methods can send a value back to the caller!",
            explanation: "Declare the <strong>return type</strong> (like int or String) and use <strong>return</strong> to send the value back.",
            codeExample: { lang: 'java', code: `public static int add(int a, int b) {\n    return a + b;\n}\n\nint result = add(5, 3);\nSystem.out.println(result);  // 8` },
            exercise: { type: 'multiple_choice', question: 'What keyword sends a value back from a method?', options: ['give', 'send', 'return', 'output'], correct: 2, explanation: 'return sends the value back to wherever the method was called.' }
          },
          {
            id: 'java-4-4', title: 'Method Overloading', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "You can have multiple methods with the same name but different parameters!",
            explanation: "<strong>Method overloading</strong> means multiple methods with the same name but different parameter types or counts. Java picks the right one automatically.",
            codeExample: { lang: 'java', code: `public static int add(int a, int b) {\n    return a + b;\n}\n\npublic static double add(double a, double b) {\n    return a + b;\n}\n\nSystem.out.println(add(5, 3));     // uses int version\nSystem.out.println(add(2.5, 1.5)); // uses double version` },
            exercise: { type: 'multiple_choice', question: 'What is method overloading?', options: ['Having too many methods', 'Same method name, different parameters', 'Calling a method twice', 'A method inside a method'], correct: 1, explanation: 'Overloading = same name, different parameter types or counts.' }
          },
          {
            id: 'java-4-5', title: 'Chapter 4 Final Challenge', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "Java methods mastered!",
            exercise: { type: 'arrange', question: 'Arrange to define and call an add method:', blocks: ['System.out.println(add(3, 4));', 'public static int add(int a, int b) {', '    return a + b;', '}'], correct: ['public static int add(int a, int b) {', '    return a + b;', '}', 'System.out.println(add(3, 4));'], explanation: 'Define the method first, then call it.' }
          }
        ]
      }
    ]
  },

  cpp: {
    name: 'C++', icon: 'devicon-cplusplus-plain colored', color: '#00599C',
    chapters: [
      {
        id: 'cpp-ch1', title: 'THE BEGINNING', subtitle: 'Getting started with C++',
        lessons: [
          {
            id: 'cpp-1-1', title: 'Welcome to C++', type: 'lesson', xp: 20,
            mascotMood: 'portrait', mascotText: "C++ is a powerful language used in games, operating systems, and high-performance applications!",
            explanation: "C++ is a <strong>compiled, statically typed language</strong>. It gives you direct control over your computer's memory. C++ is used in game engines (Unreal Engine), browsers, and more.",
            codeExample: { lang: 'cpp', code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}` },
            exercise: { type: 'multiple_choice', question: 'What does #include <iostream> do in C++?', options: ['Starts the program', 'Includes input/output functionality', 'Creates a variable', 'Defines a class'], correct: 1, explanation: '#include <iostream> gives you access to cout and cin for input/output.' }
          },
          {
            id: 'cpp-1-2', title: 'Printing Output', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "In C++, cout is used to print to the screen.",
            explanation: "<strong>cout</strong> (pronounced 'see-out') sends output to the console. Use <strong>&lt;&lt;</strong> to send values. <strong>endl</strong> or <strong>\\n</strong> adds a new line.",
            codeExample: { lang: 'cpp', code: `cout << "Hello, C++!" << endl;\ncout << "I am learning C++." << endl;\ncout << "Line 1\\nLine 2" << endl;` },
            exercise: { type: 'fill_blank', question: 'Complete to print "Hello": ___ << "Hello" << endl;', code: `___ << "Hello" << endl;`, blanks: [{ placeholder: 'output stream', answer: 'cout' }], explanation: 'cout is the standard output stream in C++.' }
          },
          {
            id: 'cpp-1-3', title: 'Variables and Data Types', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "C++ is strongly typed — you must declare the type of every variable!",
            explanation: "C++ data types: <strong>int</strong> (integers), <strong>double</strong> (decimals), <strong>string</strong> (text), <strong>bool</strong> (true/false), <strong>char</strong> (single character).",
            codeExample: { lang: 'cpp', code: `int age = 16;\ndouble gpa = 3.75;\nstring name = "Alex";\nbool isStudent = true;\n\ncout << name << " is " << age << endl;` },
            exercise: { type: 'multiple_choice', question: 'Which C++ type stores text?', options: ['int', 'double', 'string', 'char'], correct: 2, explanation: 'string stores text. Note: char stores a single character.' }
          },
          {
            id: 'cpp-1-4', title: 'User Input with cin', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "cin lets your program read input from the user!",
            explanation: "<strong>cin</strong> (pronounced 'see-in') reads input from the keyboard. Use <strong>&gt;&gt;</strong> to put the value into a variable.",
            codeExample: { lang: 'cpp', code: `string name;\ncout << "Enter your name: ";\ncin >> name;\ncout << "Hello, " << name << "!" << endl;` },
            exercise: { type: 'multiple_choice', question: 'Which C++ object reads input from the keyboard?', options: ['cout', 'input', 'cin', 'read'], correct: 2, explanation: 'cin reads input. cout outputs. Remember: cin >> variable, cout << value.' }
          },
          {
            id: 'cpp-1-5', title: 'Chapter 1 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "Excellent start with C++!",
            exercise: { type: 'find_mistake', question: 'Find the mistake in this C++ code:', code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout >> "Hello!" >> endl;\n    return 0;\n}`, options: ['#include is wrong', 'cout should use << not >>', 'main() needs parameters', 'return 0 is unnecessary'], correct: 1, explanation: 'cout uses the << (insertion) operator, not >>. cout << "Hello!" << endl;' }
          }
        ]
      },
      {
        id: 'cpp-ch2', title: 'LOGIC AND DECISIONS', subtitle: 'Conditional programming in C++',
        lessons: [
          {
            id: 'cpp-2-1', title: 'Arithmetic Operators', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "C++ arithmetic operators work exactly like regular math!",
            explanation: "C++ arithmetic: + (add), - (subtract), * (multiply), / (divide), % (modulo). Integer division truncates decimals!",
            codeExample: { lang: 'cpp', code: `int a = 10, b = 3;\n\ncout << a + b << endl;  // 13\ncout << a / b << endl;  // 3 (integer division!)\ncout << a % b << endl;  // 1` },
            exercise: { type: 'predict_output', question: 'What does 7 / 2 print in C++ with int variables?', options: ['3.5', '4', '3', '2'], correct: 2, explanation: 'Integer division truncates: 7 / 2 = 3 (the .5 is dropped with int).' }
          },
          {
            id: 'cpp-2-2', title: 'if Statements', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "C++ if statements work similarly to Java — parentheses and curly braces!",
            explanation: "C++ <strong>if statement</strong>: condition in parentheses, code block in curly braces.",
            codeExample: { lang: 'cpp', code: `int score = 85;\n\nif (score >= 60) {\n    cout << "You passed!" << endl;\n}` },
            exercise: { type: 'multiple_choice', question: 'In C++, where does the if condition go?', options: ['In curly braces {}', 'In square brackets []', 'In parentheses ()', 'In angle brackets <>'], correct: 2, explanation: 'The condition goes in parentheses: if (condition) { ... }' }
          },
          {
            id: 'cpp-2-3', title: 'if-else Statements', type: 'lesson', xp: 20,
            mascotMood: 'portrait', mascotText: "else provides an alternative when the if condition is false!",
            explanation: "<strong>else</strong> runs when the if condition is false. <strong>else if</strong> checks an additional condition.",
            codeExample: { lang: 'cpp', code: `int grade = 75;\n\nif (grade >= 90) {\n    cout << "A" << endl;\n} else if (grade >= 75) {\n    cout << "B" << endl;\n} else {\n    cout << "C" << endl;\n}` },
            exercise: { type: 'predict_output', question: 'With grade = 75, what is printed?', options: ['A', 'B', 'C', 'Nothing'], correct: 1, explanation: '75 is not >= 90 but IS >= 75, so B is printed.' }
          },
          {
            id: 'cpp-2-4', title: 'Logical Operators', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "C++ uses && for AND, || for OR, and ! for NOT.",
            explanation: "Same as Java: <strong>&amp;&amp;</strong> (AND), <strong>||</strong> (OR), <strong>!</strong> (NOT).",
            codeExample: { lang: 'cpp', code: `int age = 17;\nbool hasID = true;\n\nif (age >= 16 && hasID) {\n    cout << "Entry allowed" << endl;\n}` },
            exercise: { type: 'multiple_choice', question: 'What does || mean in C++?', options: ['AND', 'NOT', 'OR', 'EQUALS'], correct: 2, explanation: '|| is the logical OR operator. At least one condition must be true.' }
          },
          {
            id: 'cpp-2-5', title: 'Chapter 2 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "C++ decisions covered!",
            exercise: { type: 'fill_blank', question: 'Complete the if statement:', code: `int x = 10;\nif ___(x > 5)___ {\n    cout << "Big" << endl;\n}`, blanks: [{ placeholder: '(', answer: '(' }], explanation: 'C++ if conditions use parentheses: if (condition)' }
          }
        ]
      },
      {
        id: 'cpp-ch3', title: 'LOOPS AND REPETITION', subtitle: 'Repeating code in C++',
        lessons: [
          {
            id: 'cpp-3-1', title: 'for Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "C++ for loops: init; condition; update — same as Java!",
            explanation: "C++ <strong>for loop</strong> structure: <strong>int i = 0</strong>; <strong>i &lt; n</strong>; <strong>i++</strong>.",
            codeExample: { lang: 'cpp', code: `for (int i = 0; i < 5; i++) {\n    cout << i << endl;\n}\n// Prints 0, 1, 2, 3, 4` },
            exercise: { type: 'predict_output', question: 'How many iterations: for (int i = 0; i < 3; i++)?', options: ['2', '3', '4', '0'], correct: 1, explanation: 'i goes 0, 1, 2 — that is 3 iterations.' }
          },
          {
            id: 'cpp-3-2', title: 'while Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "C++ while loops keep running while a condition is true!",
            explanation: "<strong>while loop</strong> repeats while the condition is true. Update the variable to avoid an infinite loop.",
            codeExample: { lang: 'cpp', code: `int count = 0;\n\nwhile (count < 3) {\n    cout << count << endl;\n    count++;\n}` },
            exercise: { type: 'multiple_choice', question: 'What does count++ do in C++?', options: ['Decreases count', 'Increases count by 1', 'Resets count', 'Prints count'], correct: 1, explanation: 'count++ increments the value by 1 (same as in Java).' }
          },
          {
            id: 'cpp-3-3', title: 'Break and Continue', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "break and continue work the same way in C++!",
            explanation: "<strong>break</strong> exits the loop. <strong>continue</strong> skips to the next iteration.",
            codeExample: { lang: 'cpp', code: `for (int i = 0; i < 10; i++) {\n    if (i == 5) break;\n    cout << i << endl;\n}` },
            exercise: { type: 'multiple_choice', question: 'Which keyword exits a C++ loop immediately?', options: ['stop', 'exit', 'break', 'end'], correct: 2, explanation: 'break immediately exits the loop.' }
          },
          {
            id: 'cpp-3-4', title: 'do-while Loops', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "do-while always runs at least once — it checks the condition AFTER!",
            explanation: "A <strong>do-while loop</strong> runs the block once before checking the condition. Useful for menus and input validation.",
            codeExample: { lang: 'cpp', code: `int n = 0;\n\ndo {\n    cout << "n = " << n << endl;\n    n++;\n} while (n < 3);\n\n// Always prints at least once!` },
            exercise: { type: 'multiple_choice', question: 'A do-while loop checks its condition:', options: ['Before running', 'After running at least once', 'Never', 'Twice'], correct: 1, explanation: 'do-while runs the body first, then checks the condition.' }
          },
          {
            id: 'cpp-3-5', title: 'Chapter 3 Knowledge Check', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "C++ loops mastered!",
            exercise: { type: 'arrange', question: 'Arrange to print 1 to 3 in C++:', blocks: ['for (int i = 1; i <= 3; i++) {', '    cout << i << endl;', '}'], correct: ['for (int i = 1; i <= 3; i++) {', '    cout << i << endl;', '}'], explanation: 'The for header first, then the body in braces.' }
          }
        ]
      },
      {
        id: 'cpp-ch4', title: 'FUNCTIONS', subtitle: 'Reusable code in C++',
        lessons: [
          {
            id: 'cpp-4-1', title: 'What Are Functions?', type: 'lesson', xp: 20,
            mascotMood: 'portrait', mascotText: "Functions in C++ must be declared before they are called!",
            explanation: "A C++ <strong>function</strong> has a return type, name, parameters, and body. Use <strong>void</strong> for no return value.",
            codeExample: { lang: 'cpp', code: `void greet() {\n    cout << "Hello, C++!" << endl;\n}\n\nint main() {\n    greet();  // Call the function\n    return 0;\n}` },
            exercise: { type: 'multiple_choice', question: 'In C++, what return type means no value is returned?', options: ['null', 'nothing', 'void', 'empty'], correct: 2, explanation: 'void means the function does not return a value.' }
          },
          {
            id: 'cpp-4-2', title: 'Function Parameters', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Pass data into functions through parameters!",
            explanation: "Declare parameters with their type and name.",
            codeExample: { lang: 'cpp', code: `void greet(string name) {\n    cout << "Hello, " << name << "!" << endl;\n}\n\ngreet("Alex");  // Hello, Alex!` },
            exercise: { type: 'predict_output', question: 'What does greet("Sam") print?', options: ['Hello, name!', 'Hello, Sam!', 'Hello, "Sam"!', 'Error'], correct: 1, explanation: '"Sam" replaces name: Hello, Sam!' }
          },
          {
            id: 'cpp-4-3', title: 'Return Values', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "Functions can return a computed value back to the caller!",
            explanation: "Specify the <strong>return type</strong> instead of void and use <strong>return</strong> to send the value back.",
            codeExample: { lang: 'cpp', code: `int add(int a, int b) {\n    return a + b;\n}\n\nint result = add(5, 3);\ncout << result << endl;  // 8` },
            exercise: { type: 'multiple_choice', question: 'What keyword returns a value from a function?', options: ['give', 'send', 'return', 'output'], correct: 2, explanation: 'return sends the value back to the caller.' }
          },
          {
            id: 'cpp-4-4', title: 'Function Prototypes', type: 'lesson', xp: 20,
            mascotMood: 'thinking', mascotText: "In C++, you can declare a function signature before defining it!",
            explanation: "A <strong>function prototype</strong> tells the compiler about a function before its full definition. This lets you call functions defined later in the file.",
            codeExample: { lang: 'cpp', code: `// Prototype (declaration)\nvoid greet(string name);\n\nint main() {\n    greet("Alex");  // Works!\n    return 0;\n}\n\n// Full definition:\nvoid greet(string name) {\n    cout << "Hello, " << name << endl;\n}` },
            exercise: { type: 'multiple_choice', question: 'What is a function prototype in C++?', options: ['A function that never returns', 'A declaration of a function before its definition', 'A type of loop', 'A built-in function'], correct: 1, explanation: 'A prototype declares the function signature so it can be called before being fully defined.' }
          },
          {
            id: 'cpp-4-5', title: 'Chapter 4 Final Challenge', type: 'quiz', xp: 50,
            mascotMood: 'portrait', mascotText: "C++ functions mastered! Outstanding work!",
            exercise: { type: 'arrange', question: 'Arrange a C++ add function:', blocks: ['int add(int a, int b) {', '    return a + b;', '}', 'cout << add(3, 4) << endl;'], correct: ['int add(int a, int b) {', '    return a + b;', '}', 'cout << add(3, 4) << endl;'], explanation: 'Define the function first, then call it.' }
          }
        ]
      }
    ]
  }
}; // end CURRICULUM

/* ─── SECTION 4: ACHIEVEMENTS DATA ─────────────────────── */
const ACHIEVEMENTS_DEF = [
  { id: 'first_steps',    name: 'First Steps',      icon: '👣', desc: 'Complete your first lesson.',        check: s => s.completedLessons.length >= 1 },
  { id: 'hello_world',    name: 'Hello World',       icon: '🌍', desc: 'Complete your first coding exercise.', check: s => s.completedLessons.length >= 1 },
  { id: 'fast_learner',   name: 'Fast Learner',      icon: '⚡', desc: 'Complete 5 lessons.',                check: s => s.completedLessons.length >= 5 },
  { id: 'consistency',    name: 'Consistency',       icon: '🔥', desc: 'Maintain a 3-day learning streak.',  check: s => s.streak >= 3 },
  { id: 'ch_explorer',    name: 'Chapter Explorer',  icon: '📚', desc: 'Complete your first chapter.',       check: s => s.completedChapters.length >= 1 },
  { id: 'xp_100',         name: 'XP Collector',      icon: '⭐', desc: 'Earn 100 XP.',                       check: s => s.xp >= 100 },
  { id: 'xp_500',         name: 'XP Hoarder',        icon: '💎', desc: 'Earn 500 XP.',                       check: s => s.xp >= 500 },
  { id: 'ten_lessons',    name: 'Dedicated Student', icon: '🎓', desc: 'Complete 10 lessons.',               check: s => s.completedLessons.length >= 10 },
  { id: 'streak_7',       name: 'Week Warrior',      icon: '🗓️', desc: 'Maintain a 7-day streak.',           check: s => s.streak >= 7 },
  { id: 'all_chapters',   name: 'Completionist',     icon: '🏆', desc: 'Complete all chapters for a language.', check: s => s.completedChapters.length >= 4 }
];

/* ─── SECTION 5: LEVEL SYSTEM ───────────────────────────── */
const LEVELS = [
  { level: 1, name: 'Beginner',    minXP: 0,    maxXP: 100 },
  { level: 2, name: 'Apprentice',  minXP: 100,  maxXP: 300 },
  { level: 3, name: 'Explorer',    minXP: 300,  maxXP: 600 },
  { level: 4, name: 'Coder',       minXP: 600,  maxXP: 1000 },
  { level: 5, name: 'Developer',   minXP: 1000, maxXP: 9999 }
];

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

/* ─── SECTION 6: APP STATE ───────────────────────────────── */
let AppState = {
  user: {
    username: 'Developer',
    language: 'python',
    experience: 'beginner',
    motivation: 'explore',
    dailyGoal: 10
  },
  progress: {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    completedLessons: [],
    completedChapters: [],
    completedLessonXP: {},  // lessonId -> true, prevents re-farming
    dailyMinutes: 0,
    dailyGoalDate: null,
    achievements: []
  },
  settings: {
    language: 'python'
  }
};

function loadState() {
  const user     = Storage.get('codequest_user');
  const progress = Storage.get('codequest_progress');
  const settings = Storage.get('codequest_settings');
  if (user)     AppState.user     = { ...AppState.user,     ...user };
  if (progress) AppState.progress = { ...AppState.progress, ...progress };
  if (settings) AppState.settings = { ...AppState.settings, ...settings };
}

function saveState() {
  Storage.set('codequest_user',     AppState.user);
  Storage.set('codequest_progress', AppState.progress);
  Storage.set('codequest_settings', AppState.settings);
}

function isOnboardingDone() {
  return !!Storage.get('codequest_onboarding_done');
}

function markOnboardingDone() {
  Storage.set('codequest_onboarding_done', true);
}

function resetAllProgress() {
  Storage.remove('codequest_user');
  Storage.remove('codequest_progress');
  Storage.remove('codequest_settings');
  Storage.remove('codequest_onboarding_done');
  Storage.remove('codequest_audio');
  location.reload();
}

/* ─── SECTION 7: STREAK LOGIC ───────────────────────────── */
function checkAndUpdateStreak() {
  const today = new Date().toDateString();
  const last  = AppState.progress.lastActiveDate;

  if (!last) {
    AppState.progress.streak = 1;
    AppState.progress.lastActiveDate = today;
    saveState();
    return;
  }
  if (last === today) return; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toDateString();

  if (last === yStr) {
    AppState.progress.streak += 1;
  } else {
    AppState.progress.streak = 1; // streak broken
  }
  AppState.progress.lastActiveDate = today;
  saveState();
}

function logDailyMinutes(minutes) {
  const today = new Date().toDateString();
  if (AppState.progress.dailyGoalDate !== today) {
    AppState.progress.dailyMinutes  = 0;
    AppState.progress.dailyGoalDate = today;
  }
  AppState.progress.dailyMinutes = Math.min(
    AppState.progress.dailyMinutes + minutes,
    AppState.user.dailyGoal * 2
  );
  saveState();
}

/* ─── SECTION 8: XP & LEVEL ─────────────────────────────── */
function awardXP(amount, lessonId) {
  // Prevent farming: only award completion XP once per lesson
  if (lessonId && AppState.progress.completedLessonXP[lessonId]) {
    // Still show popup but with lower value for practice
    amount = Math.floor(amount * 0.2);
    if (amount < 1) return;
  }

  AppState.progress.xp += amount;

  const newLevel = getLevelInfo(AppState.progress.xp);
  const oldLevel = AppState.progress.level;
  AppState.progress.level = newLevel.level;

  saveState();
  showXPPopup(amount);
  AudioManager.playSFX('xp');

  if (newLevel.level > oldLevel) {
    showAchievementPopup('Level Up!', `You reached Level ${newLevel.level}: ${newLevel.name}!`);
  }

  updateTopbarStats();
  updateSidebarStats();
}

function markLessonComplete(lessonId) {
  if (!AppState.progress.completedLessons.includes(lessonId)) {
    AppState.progress.completedLessons.push(lessonId);
  }
  AppState.progress.completedLessonXP[lessonId] = true;
  checkAndUpdateStreak();
  logDailyMinutes(5);
  checkAchievements();
  saveState();
}

function markChapterComplete(chapterId) {
  if (!AppState.progress.completedChapters.includes(chapterId)) {
    AppState.progress.completedChapters.push(chapterId);
  }
  saveState();
}

function isLessonCompleted(lessonId) {
  return AppState.progress.completedLessons.includes(lessonId);
}

function isLessonUnlocked(lang, chapterIdx, lessonIdx) {
  if (chapterIdx === 0 && lessonIdx === 0) return true;
  const chapter = CURRICULUM[lang].chapters[chapterIdx];
  const prevLesson = lessonIdx > 0
    ? chapter.lessons[lessonIdx - 1]
    : CURRICULUM[lang].chapters[chapterIdx - 1]?.lessons.at(-1);
  return prevLesson ? isLessonCompleted(prevLesson.id) : false;
}

/* ─── SECTION 9: ACHIEVEMENTS ───────────────────────────── */
function checkAchievements() {
  ACHIEVEMENTS_DEF.forEach(ach => {
    if (!AppState.progress.achievements.includes(ach.id)) {
      if (ach.check(AppState.progress)) {
        AppState.progress.achievements.push(ach.id);
        saveState();
        showAchievementPopup(ach.name, ach.desc);
        AudioManager.playSFX('unlock');
      }
    }
  });
}

/* ─── SECTION 10: UI POPUPS ─────────────────────────────── */
let xpPopupTimer = null;
function showXPPopup(amount) {
  const el = document.getElementById('xp-popup');
  document.getElementById('xp-popup-amount').textContent = `+${amount} XP`;
  el.classList.remove('hidden');
  if (xpPopupTimer) clearTimeout(xpPopupTimer);
  xpPopupTimer = setTimeout(() => el.classList.add('hidden'), 2000);
}

let achPopupTimer = null;
function showAchievementPopup(name, desc) {
  const el = document.getElementById('achievement-popup');
  document.getElementById('achievement-popup-name').textContent = name;
  el.classList.remove('hidden');
  if (achPopupTimer) clearTimeout(achPopupTimer);
  achPopupTimer = setTimeout(() => el.classList.add('hidden'), 3500);
}

function showConfirm(title, message, onConfirm) {
  const dlg = document.getElementById('confirm-dialog');
  document.getElementById('confirm-title').textContent   = title;
  document.getElementById('confirm-message').textContent = message;
  dlg.classList.remove('hidden');
  const okBtn     = document.getElementById('confirm-ok-btn');
  const cancelBtn = document.getElementById('confirm-cancel-btn');
  const cleanup = () => {
    dlg.classList.add('hidden');
    okBtn.onclick     = null;
    cancelBtn.onclick = null;
  };
  okBtn.onclick = () => { cleanup(); onConfirm(); };
  cancelBtn.onclick = cleanup;
}

/* ─── SECTION 11: TOP BAR / SIDEBAR UPDATES ─────────────── */
function updateTopbarStats() {
  const el = id => document.getElementById(id);
  el('topbar-xp').textContent     = AppState.progress.xp;
  el('topbar-streak').textContent = AppState.progress.streak;
  const audioIcon = document.getElementById('audio-icon');
  if (audioIcon) {
    const s = AudioManager.getState();
    audioIcon.setAttribute('data-lucide', s.sfxEnabled || s.musicEnabled ? 'volume-2' : 'volume-x');
    safeCreateIcons({ nodes: [audioIcon] });
  }
}

function updateSidebarStats() {
  const el = id => document.getElementById(id);
  el('sidebar-xp').textContent     = AppState.progress.xp + ' XP';
  el('sidebar-streak').textContent = AppState.progress.streak + ' day streak';
  el('sidebar-username').textContent = AppState.user.username;
  const lang = AppState.user.language;
  const langData = CURRICULUM[lang];
  el('sidebar-lang').innerHTML = `<i class="${langData.icon}"></i> ${langData.name}`;
}

function toggleMasterAudio() {
  const s = AudioManager.getState();
  const allOff = !s.sfxEnabled && !s.musicEnabled;
  AudioManager.setSFXEnabled(allOff);
  AudioManager.setMusicEnabled(allOff);
  updateTopbarStats();
  if (allOff) AudioManager.playBackgroundMusic();
}

/* ─── SECTION 12: ONBOARDING ────────────────────────────── */
let currentObStep = 1;
const obSelections = {};

function obNext() {
  AudioManager.markInteracted();
  AudioManager.playSFX('click');

  // Validate current step
  if (currentObStep === 2 && !obSelections.experience) return;
  if (currentObStep === 3 && !obSelections.language) return;
  if (currentObStep === 4 && !obSelections.motivation) return;
  if (currentObStep === 5 && !obSelections.dailyGoal) return;

  if (currentObStep === 5) {
    buildObSummary();
  }

  const prev = document.getElementById(`ob-step-${currentObStep}`);
  if (prev) prev.classList.remove('active');
  const prevDot = document.querySelector(`.ob-dot[data-step="${currentObStep}"]`);
  if (prevDot) { prevDot.classList.remove('active'); prevDot.classList.add('completed'); }

  currentObStep++;

  const next = document.getElementById(`ob-step-${currentObStep}`);
  if (next) next.classList.add('active');
  const nextDot = document.querySelector(`.ob-dot[data-step="${currentObStep}"]`);
  if (nextDot) nextDot.classList.add('active');

  safeCreateIcons();
}

function obBack() {
  AudioManager.playSFX('click');
  if (currentObStep <= 1) return;

  const curr = document.getElementById(`ob-step-${currentObStep}`);
  if (curr) curr.classList.remove('active');
  const currDot = document.querySelector(`.ob-dot[data-step="${currentObStep}"]`);
  if (currDot) { currDot.classList.remove('active'); currDot.classList.remove('completed'); }

  currentObStep--;

  const prev = document.getElementById(`ob-step-${currentObStep}`);
  if (prev) prev.classList.add('active');
  const prevDot = document.querySelector(`.ob-dot[data-step="${currentObStep}"]`);
  if (prevDot) { prevDot.classList.add('active'); prevDot.classList.remove('completed'); }

  safeCreateIcons();
}

function selectChoice(field, value, btn) {
  AudioManager.playSFX('click');
  obSelections[field] = value;

  // Remove selected from siblings
  btn.closest('.ob-choices, .time-choices')
     .querySelectorAll('.ob-choice-btn')
     .forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // Enable the continue button
  const stepMap = { experience: 2, language: 3, motivation: 4, dailyGoal: 5 };
  const nextBtn = document.getElementById(`ob-next-${stepMap[field]}`);
  if (nextBtn) nextBtn.disabled = false;
}

function selectLanguage(lang, btn) {
  AudioManager.playSFX('click');
  obSelections.language = lang;

  document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');

  const nextBtn = document.getElementById('ob-next-3');
  if (nextBtn) nextBtn.disabled = false;

  // Update welcome title preview
  const langData = CURRICULUM[lang];
  const titleEl = document.getElementById('ob-welcome-title');
  if (titleEl) titleEl.textContent = `Your ${langData.name} Adventure Starts Here!`;

  safeCreateIcons();
}

function buildObSummary() {
  const langName = CURRICULUM[obSelections.language]?.name || obSelections.language;
  const expMap   = { beginner: 'Complete Beginner', some: 'Some Experience', 'some-coding': 'Written Code Before' };
  const motMap   = { school: 'School & Academic', projects: 'Build Projects', career: 'Career Prep', explore: 'Explore & Discover' };

  document.getElementById('ob-summary').innerHTML = `
    <div class="ob-summary-pill"><strong>Language:</strong> ${langName}</div>
    <div class="ob-summary-pill"><strong>Level:</strong> ${expMap[obSelections.experience] || ''}</div>
    <div class="ob-summary-pill"><strong>Goal:</strong> ${obSelections.dailyGoal} min/day</div>
  `;

  const langData = CURRICULUM[obSelections.language];
  document.getElementById('ob-welcome-title').textContent = `Your ${langData.name} Adventure Starts Here!`;
  safeCreateIcons();
}

function finishOnboarding() {
  AudioManager.playSFX('complete');
  AudioManager.markInteracted();

  // Save user prefs
  AppState.user.language   = obSelections.language || 'python';
  AppState.user.experience = obSelections.experience || 'beginner';
  AppState.user.motivation = obSelections.motivation || 'explore';
  AppState.user.dailyGoal  = parseInt(obSelections.dailyGoal) || 10;
  AppState.settings.language = AppState.user.language;
  checkAndUpdateStreak();
  saveState();
  markOnboardingDone();

  // Transition to app
  document.getElementById('onboarding-overlay').classList.add('hidden');
  initMainApp();
}

/* ─── SECTION 13: MAIN APP INIT ─────────────────────────── */
function initMainApp() {
  const app = document.getElementById('main-app');
  app.classList.remove('hidden');

  updateTopbarStats();
  updateSidebarStats();
  updateDashboard();
  renderLearningPath(AppState.user.language);
  renderPractice();
  renderAchievements();
  renderProfile();
  renderSettings();
  buildLangSwitcher();

  navigateTo('dashboard');
  safeCreateIcons();
}

/* ─── SECTION 14: NAVIGATION ────────────────────────────── */
function navigateTo(view) {
  AudioManager.playSFX('click');

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const viewEl = document.getElementById(`view-${view}`);
  if (viewEl) viewEl.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (navItem) navItem.classList.add('active');

  // Refresh view-specific content
  if (view === 'dashboard')    updateDashboard();
  if (view === 'learn')        renderLearningPath(AppState.user.language);
  if (view === 'practice')     renderPractice();
  if (view === 'achievements') renderAchievements();
  if (view === 'profile')      renderProfile();
  if (view === 'settings')     renderSettings();

  closeSidebar();
  safeCreateIcons();
  AudioManager.playSFX('transition');
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('visible');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('visible');
}

/* ─── SECTION 15: DASHBOARD ─────────────────────────────── */
function updateDashboard() {
  const p    = AppState.progress;
  const u    = AppState.user;
  const lang = CURRICULUM[u.language];
  const lvl  = getLevelInfo(p.xp);
  const nextLvl = LEVELS[Math.min(lvl.level, LEVELS.length - 1)];

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('dashboard-greeting').textContent = `${greeting}, ${u.username}! 👋`;

  // Stats
  document.getElementById('stat-level').textContent      = lvl.level;
  document.getElementById('stat-level-name').textContent = lvl.name;
  document.getElementById('stat-xp').textContent         = p.xp;
  document.getElementById('stat-streak').textContent     = p.streak;
  document.getElementById('stat-lessons').textContent    = p.completedLessons.length;
  document.getElementById('stat-lang-label').textContent = lang.name;

  const xpForNext = nextLvl ? nextLvl.maxXP : lvl.maxXP;
  const xpRange   = xpForNext - lvl.minXP;
  const xpCurr    = p.xp - lvl.minXP;
  const xpPct     = Math.min(100, Math.round((xpCurr / xpRange) * 100));
  document.getElementById('stat-xp-next').textContent      = `${xpForNext - p.xp} to next level`;
  document.getElementById('xp-progress-label').textContent = `${p.xp} / ${xpForNext} XP`;
  document.getElementById('xp-progress-bar').style.width   = xpPct + '%';

  // Daily goal
  const today = new Date().toDateString();
  const mins  = p.dailyGoalDate === today ? p.dailyMinutes : 0;
  const pct   = Math.min(100, Math.round((mins / u.dailyGoal) * 100));
  document.getElementById('daily-goal-label').textContent    = `${mins} / ${u.dailyGoal} min`;
  document.getElementById('daily-progress-bar').style.width  = pct + '%';
  document.getElementById('daily-goal-hint').textContent     = pct >= 100 ? '🎉 Daily goal complete!' : 'Complete a lesson to log progress!';

  // Continue learning
  updateContinueCard();

  // Achievements mini
  updateAchievementsMini();

  // XP sidebar
  document.getElementById('sidebar-xp').textContent     = p.xp + ' XP';
  document.getElementById('sidebar-streak').textContent = p.streak + ' day streak';
}

function updateContinueCard() {
  const lang   = AppState.user.language;
  const curriculum = CURRICULUM[lang];
  let nextLesson = null, chapterTitle = '';

  outer:
  for (const ch of curriculum.chapters) {
    for (const ls of ch.lessons) {
      if (!isLessonCompleted(ls.id)) {
        nextLesson   = ls;
        chapterTitle = ch.title;
        break outer;
      }
    }
  }

  const iconEl = document.getElementById('continue-lang-icon');
  iconEl.className = curriculum.icon;

  if (nextLesson) {
    document.getElementById('continue-track').textContent        = `${curriculum.name} Fundamentals`;
    document.getElementById('continue-lesson-title').textContent = nextLesson.title;
    document.getElementById('continue-chapter').textContent      = chapterTitle;
    document.getElementById('continue-btn').disabled = false;
    document.getElementById('continue-btn').dataset.lessonId = nextLesson.id;
  } else {
    document.getElementById('continue-lesson-title').textContent = 'All lessons complete! Great work!';
    document.getElementById('continue-btn').disabled = true;
  }
  safeCreateIcons();
}

function continueLesson() {
  AudioManager.playSFX('click');
  const btn = document.getElementById('continue-btn');
  const lessonId = btn.dataset.lessonId;
  if (!lessonId) return;
  openLessonById(AppState.user.language, lessonId);
}

function updateAchievementsMini() {
  const unlocked = AppState.progress.achievements;
  const list     = document.getElementById('achievements-mini-list');
  if (unlocked.length === 0) {
    list.innerHTML = '<div class="achievement-empty">Complete lessons to earn achievements!</div>';
    return;
  }
  const recent = unlocked.slice(-3).reverse();
  list.innerHTML = recent.map(id => {
    const ach = ACHIEVEMENTS_DEF.find(a => a.id === id);
    if (!ach) return '';
    return `<div class="achievement-mini-item">
      <span class="achievement-mini-icon">${ach.icon}</span>
      <div class="achievement-mini-info">
        <div class="achievement-mini-name">${ach.name}</div>
        <div class="achievement-mini-desc">${ach.desc}</div>
      </div>
    </div>`;
  }).join('');
}

/* ─── SECTION 16: LEARNING PATH ─────────────────────────── */
function buildLangSwitcher() {
  const container = document.getElementById('lang-switcher-btns');
  container.innerHTML = '';
  ['python', 'java', 'cpp'].forEach(lang => {
    const d = CURRICULUM[lang];
    const btn = document.createElement('button');
    btn.className = 'lang-sw-btn' + (lang === AppState.user.language ? ' active' : '');
    btn.innerHTML = `<i class="${d.icon}"></i>${d.name}`;
    btn.onclick = () => switchPathLanguage(lang);
    container.appendChild(btn);
  });
}

function switchPathLanguage(lang) {
  AudioManager.playSFX('click');
  AppState.user.language = lang;
  AppState.settings.language = lang;
  saveState();
  renderLearningPath(lang);
  buildLangSwitcher();
  updateSidebarStats();
  updateDashboard();
  safeCreateIcons();
}

function renderLearningPath(lang) {
  const curriculum = CURRICULUM[lang];
  document.getElementById('learn-subtitle').textContent = `${curriculum.name} Fundamentals`;
  const container = document.getElementById('learning-path-container');
  container.innerHTML = '';

  const div = document.createElement('div');
  div.className = 'learning-path';

  curriculum.chapters.forEach((chapter, ci) => {
    const completed = chapter.lessons.filter(l => isLessonCompleted(l.id)).length;
    const total     = chapter.lessons.length;
    const pct       = Math.round((completed / total) * 100);

    const chBlock = document.createElement('div');
    chBlock.className = 'chapter-block';
    chBlock.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-title-wrap">
          <div class="chapter-num">${ci + 1}</div>
          <div>
            <div class="chapter-title">${chapter.title}</div>
            <div class="chapter-subtitle">${chapter.subtitle}</div>
          </div>
        </div>
        <div class="chapter-progress-info">
          <div>${completed}/${total} lessons</div>
          <div class="progress-bar-wrap chapter-progress-wrap">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
        </div>
      </div>
      <div class="lessons-list" id="lessons-${chapter.id}"></div>
    `;
    div.appendChild(chBlock);

    const lessonsList = chBlock.querySelector(`#lessons-${chapter.id}`);
    chapter.lessons.forEach((lesson, li) => {
      const done     = isLessonCompleted(lesson.id);
      const unlocked = isLessonUnlocked(lang, ci, li);
      const isCurr   = !done && unlocked;

      let state = 'locked';
      if (done)    state = 'completed';
      else if (isCurr) state = 'current';

      const iconMap = { completed: 'check-circle', current: 'play-circle', locked: 'lock', in_progress: 'clock' };
      const badgeMap = { completed: 'badge-done Done', current: 'badge-start Start', locked: 'badge-locked Locked' };
      const [badgeClass, badgeText] = (badgeMap[state] || 'badge-locked Locked').split(' ');
      const typeLabel = lesson.type === 'quiz' ? '📝 Knowledge Check' : '📖 Lesson';

      const node = document.createElement('div');
      node.className = `lesson-node ${state}`;
      node.dataset.lessonId = lesson.id;
      node.innerHTML = `
        <div class="lesson-node-icon"><i data-lucide="${iconMap[state]}"></i></div>
        <div class="lesson-node-info">
          <div class="lesson-node-num">Lesson ${li + 1}</div>
          <div class="lesson-node-title">${lesson.title}</div>
          <div class="lesson-node-type">${typeLabel}</div>
        </div>
        <span class="lesson-node-badge ${badgeClass}">${badgeText}</span>
      `;

      if (state !== 'locked') {
        node.onclick = () => openLesson(lang, ci, li);
      }
      lessonsList.appendChild(node);
    });
  });

  container.appendChild(div);
  safeCreateIcons();
}

/* ─── SECTION 17: LESSON ENGINE ─────────────────────────── */
let currentLesson      = null;
let currentLessonSteps = [];
let currentStepIdx     = 0;
let selectedAnswer     = null;
let arrangedBlocks     = [];
let bankState          = [];

function openLesson(lang, chapterIdx, lessonIdx) {
  const lesson = CURRICULUM[lang].chapters[chapterIdx].lessons[lessonIdx];
  currentLesson = { lesson, lang, chapterIdx, lessonIdx };
  openLessonData(lesson);
}

function openLessonById(lang, lessonId) {
  for (let ci = 0; ci < CURRICULUM[lang].chapters.length; ci++) {
    const ch = CURRICULUM[lang].chapters[ci];
    for (let li = 0; li < ch.lessons.length; li++) {
      if (ch.lessons[li].id === lessonId) {
        openLesson(lang, ci, li);
        return;
      }
    }
  }
}

function openLessonData(lesson) {
  AudioManager.playSFX('transition');
  currentStepIdx = 0;
  selectedAnswer = null;
  arrangedBlocks = [];

  // Build steps: intro -> explanation -> code example (if any) -> exercise -> completion
  currentLessonSteps = ['intro', 'exercise', 'complete'];

  document.getElementById('lesson-modal').classList.remove('hidden');
  renderLessonStep();
  safeCreateIcons();
}

function closeLesson() {
  AudioManager.playSFX('click');
  document.getElementById('lesson-modal').classList.add('hidden');
  currentLesson = null;
  navigateTo('learn');
}

function renderLessonStep() {
  const lesson = currentLesson.lesson;
  const total  = currentLessonSteps.length;
  const step   = currentLessonSteps[currentStepIdx];
  const pct    = Math.round((currentStepIdx / total) * 100);

  document.getElementById('lesson-progress-bar').style.width = pct + '%';
  document.getElementById('lesson-step-label').textContent   = `Step ${currentStepIdx + 1} of ${total}`;

  const body     = document.getElementById('lesson-body');
  const feedback = document.getElementById('lesson-feedback');
  const checkBtn = document.getElementById('lesson-check-btn');
  const contBtn  = document.getElementById('lesson-continue-btn');

  feedback.className = 'lesson-feedback';
  feedback.innerHTML = '';
  checkBtn.classList.add('hidden');
  contBtn.classList.add('hidden');

  selectedAnswer = null;
  arrangedBlocks = [];

  if (step === 'intro') {
    body.innerHTML = buildIntroHTML(lesson);
    contBtn.classList.remove('hidden');
    contBtn.textContent = 'Start Exercise';
    contBtn.innerHTML = 'Start Exercise <i data-lucide="arrow-right"></i>';

  } else if (step === 'exercise') {
    body.innerHTML = buildExerciseHTML(lesson);
    wireExerciseInteractions(lesson.exercise);
    checkBtn.classList.remove('hidden');
    checkBtn.disabled = true;

  } else if (step === 'complete') {
    body.innerHTML = buildCompleteHTML(lesson);
    contBtn.classList.remove('hidden');
    contBtn.innerHTML = '<i data-lucide="check"></i> Finish Lesson';
  }

  safeCreateIcons();
}

function buildIntroHTML(lesson) {
  const mascotMap = {
    portrait:    'assets/character/technopixie_portrait.png',
    thinking:    'assets/character/technopixie_thinking.png',
    happy:       'assets/character/technopixie_happy.png',
    celebrating: 'assets/character/technopixie_celebrating.png',
    confused:    'assets/character/technopixie_confused.png'
  };
  const mascotSrc = mascotMap[lesson.mascotMood] || mascotMap.portrait;
  const codeHTML  = lesson.codeExample ? `
    <div class="code-block">
      <span class="code-lang">${lesson.codeExample.lang}</span>
      <pre>${lesson.codeExample.code}</pre>
    </div>` : '';

  return `
    <div class="lesson-mascot-row">
      <img src="${mascotSrc}" alt="Technopixie" class="lesson-mascot"
           onerror="this.src='assets/character/technopixie_portrait.png'" />
      <div class="lesson-dialogue">${lesson.mascotText}</div>
    </div>
    <div class="lesson-subtitle">${lesson.type === 'quiz' ? '📝 Knowledge Check' : '📖 Lesson'}</div>
    <h2 class="lesson-title">${lesson.title}</h2>
    <div class="lesson-content-text">${lesson.explanation || ''}</div>
    ${codeHTML}
  `;
}

function buildExerciseHTML(lesson) {
  const ex = lesson.exercise;
  const typeLabel = { multiple_choice: 'Multiple Choice', fill_blank: 'Fill in the Blank',
                      arrange: 'Arrange the Code', predict_output: 'Predict the Output',
                      find_mistake: 'Find the Mistake' };
  let content = '';

  if (ex.type === 'multiple_choice' || ex.type === 'predict_output' || ex.type === 'find_mistake') {
    const codeSnippet = ex.code ? `<div class="code-block"><pre>${ex.code}</pre></div>` : '';
    const options = ex.options.map((opt, i) => `
      <button class="choice-option" data-index="${i}" onclick="selectMCOption(this, ${i})">
        <span class="choice-option-letter">${String.fromCharCode(65 + i)}</span>
        <span>${opt}</span>
      </button>`).join('');
    content = `${codeSnippet}<div class="choice-options">${options}</div>`;

  } else if (ex.type === 'fill_blank') {
    const codeWithInput = ex.code.replace(/___/g,
      `<input type="text" class="fitb-input" id="fitb-input-0"
        placeholder="${ex.blanks[0].placeholder}"
        oninput="onFitbInput(this)" autocomplete="off" spellcheck="false" />`);
    content = `<div class="fitb-code">${codeWithInput}</div>`;

  } else if (ex.type === 'arrange') {
    const shuffled = [...ex.blocks].sort(() => Math.random() - 0.5);
    bankState = shuffled.map((b, i) => ({ text: b, used: false, id: i }));
    arrangedBlocks = [];
    const bankHTML = shuffled.map((b, i) =>
      `<button class="bank-block" data-idx="${i}" onclick="bankBlockClick(this, ${i})">${b}</button>`
    ).join('');
    content = `
      <div class="arrange-zone" id="arrange-zone">
        <div class="arrange-zone-label">Drop code blocks here in the correct order</div>
      </div>
      <div class="blocks-bank" id="blocks-bank">${bankHTML}</div>
    `;
  }

  return `
    <div class="exercise-section">
      <div class="exercise-label">${typeLabel[ex.type] || 'Exercise'}</div>
      <div class="exercise-question">${ex.question.replace(/\n/g, '<br/>')}</div>
      ${content}
    </div>
  `;
}

function buildCompleteHTML(lesson) {
  const lang = CURRICULUM[currentLesson.lang];
  return `
    <div class="lesson-complete">
      <img src="assets/character/technopixie_celebrating.png" alt="Technopixie celebrating"
           class="lesson-complete-mascot"
           onerror="this.src='assets/character/technopixie_happy.png'" />
      <h2 class="lesson-complete-title">Lesson Complete!</h2>
      <p class="lesson-complete-subtitle">${lesson.title}</p>
      <div class="lesson-xp-award">
        <i data-lucide="star"></i>
        +${lesson.xp} XP Earned
      </div>
      <p class="lesson-content-text">
        Great work on <strong>${lesson.title}</strong>!
        Keep it up — your next lesson is unlocked!
      </p>
    </div>
  `;
}

/* ─── SECTION 18: EXERCISE INTERACTIONS ─────────────────── */
function wireExerciseInteractions(ex) {
  if (ex.type === 'fill_blank') {
    // Input listener already set via oninput attribute
  }
}

function selectMCOption(btn, index) {
  AudioManager.playSFX('click');
  document.querySelectorAll('.choice-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedAnswer = index;
  document.getElementById('lesson-check-btn').disabled = false;
}

function onFitbInput(input) {
  const checkBtn = document.getElementById('lesson-check-btn');
  checkBtn.disabled = input.value.trim().length === 0;
}

function bankBlockClick(btn, idx) {
  AudioManager.playSFX('click');
  if (bankState[idx].used) return;
  bankState[idx].used = true;
  btn.classList.add('used');
  btn.disabled = true;

  arrangedBlocks.push({ text: bankState[idx].text, idx });
  const zone = document.getElementById('arrange-zone');
  const item = document.createElement('div');
  item.className = 'code-block-item';
  item.dataset.idx = arrangedBlocks.length - 1;
  item.innerHTML = `
    <span class="drag-handle"><i data-lucide="grip-vertical"></i></span>
    <span>${bankState[idx].text}</span>
    <button onclick="removeArrangeBlock(this, ${idx})" style="margin-left:auto;color:var(--error);font-size:0.8rem">✕</button>
  `;
  zone.appendChild(item);

  const checkBtn = document.getElementById('lesson-check-btn');
  checkBtn.disabled = arrangedBlocks.length !== currentLesson.lesson.exercise.blocks.length;
  safeCreateIcons();
}

function removeArrangeBlock(btn, originalIdx) {
  AudioManager.playSFX('click');
  const item = btn.closest('.code-block-item');
  item.remove();

  bankState[originalIdx].used = false;
  const bankBtn = document.querySelector(`.bank-block[data-idx="${originalIdx}"]`);
  if (bankBtn) { bankBtn.classList.remove('used'); bankBtn.disabled = false; }

  // Rebuild arrangedBlocks from remaining items
  const zone = document.getElementById('arrange-zone');
  arrangedBlocks = [];
  zone.querySelectorAll('.code-block-item').forEach(el => {
    const idx = parseInt(el.dataset.idx);
    // Find corresponding bankState text
    const spanText = el.querySelector('span:nth-child(2)').textContent;
    arrangedBlocks.push({ text: spanText, idx });
  });

  const checkBtn = document.getElementById('lesson-check-btn');
  checkBtn.disabled = arrangedBlocks.length !== currentLesson.lesson.exercise.blocks.length;
}

/* ─── SECTION 19: CHECK ANSWER ──────────────────────────── */
function checkAnswer() {
  AudioManager.playSFX('click');
  const lesson   = currentLesson.lesson;
  const ex       = lesson.exercise;
  const feedback = document.getElementById('lesson-feedback');
  const checkBtn = document.getElementById('lesson-check-btn');
  const contBtn  = document.getElementById('lesson-continue-btn');
  let correct    = false;

  if (ex.type === 'multiple_choice' || ex.type === 'predict_output' || ex.type === 'find_mistake') {
    correct = selectedAnswer === ex.correct;
    document.querySelectorAll('.choice-option').forEach((btn, i) => {
      if (i === ex.correct) btn.classList.add('correct');
      else if (i === selectedAnswer && !correct) btn.classList.add('incorrect');
      btn.onclick = null; btn.style.pointerEvents = 'none';
    });

  } else if (ex.type === 'fill_blank') {
    const input = document.getElementById('fitb-input-0');
    const userVal = input ? input.value.trim().toLowerCase() : '';
    const expected = ex.blanks[0].answer.toLowerCase();
    correct = userVal === expected;
    if (input) { input.classList.add(correct ? 'correct' : 'incorrect'); input.disabled = true; }

  } else if (ex.type === 'arrange') {
    const userOrder = arrangedBlocks.map(b => b.text);
    correct = JSON.stringify(userOrder) === JSON.stringify(ex.correct);
    // Visual: highlight zone
    const zone = document.getElementById('arrange-zone');
    zone.style.borderColor = correct ? 'var(--success)' : 'var(--error)';
    zone.style.background  = correct ? 'var(--success-bg)' : 'var(--error-bg)';
  }

  checkBtn.classList.add('hidden');
  contBtn.classList.remove('hidden');
  contBtn.innerHTML = 'Continue <i data-lucide="arrow-right"></i>';

  if (correct) {
    AudioManager.playSFX('correct');
    feedback.className = 'lesson-feedback success';
    feedback.innerHTML = `<i data-lucide="check-circle"></i> <span>Correct! ${ex.explanation}</span>`;
    awardXP(5, null); // small XP for correct answer
  } else {
    AudioManager.playSFX('wrong');
    feedback.className = 'lesson-feedback error';
    feedback.innerHTML = `<i data-lucide="x-circle"></i> <span>Almost! ${ex.explanation}</span>`;
  }

  safeCreateIcons();
}

/* ─── SECTION 20: LESSON CONTINUE / COMPLETE ────────────── */
function lessonContinue() {
  AudioManager.playSFX('click');
  const step = currentLessonSteps[currentStepIdx];

  if (step === 'complete') {
    // Fix: award full XP FIRST (before markLessonComplete sets completedLessonXP),
    // then mark the lesson done so replays get the reduced rate.
    const lesson = currentLesson.lesson;
    awardXP(lesson.xp, lesson.id);   // full XP on first completion
    markLessonComplete(lesson.id);    // now lock it against re-farming
    AudioManager.playSFX('complete');

    // Check chapter completion
    checkChapterCompletion();

    // Close modal and refresh
    setTimeout(() => {
      document.getElementById('lesson-modal').classList.add('hidden');
      navigateTo('learn');
      updateDashboard();
    }, 800);
    return;
  }

  currentStepIdx++;
  if (currentStepIdx >= currentLessonSteps.length) {
    currentStepIdx = currentLessonSteps.length - 1; // guard
  }

  // Clear feedback when moving between steps
  document.getElementById('lesson-feedback').className = 'lesson-feedback';
  document.getElementById('lesson-feedback').innerHTML = '';

  renderLessonStep();
}

function checkChapterCompletion() {
  const { lang, chapterIdx } = currentLesson;
  const chapter = CURRICULUM[lang].chapters[chapterIdx];
  const allDone = chapter.lessons.every(l => isLessonCompleted(l.id));
  if (allDone && !AppState.progress.completedChapters.includes(chapter.id)) {
    markChapterComplete(chapter.id);
    awardXP(50, `chapter_${chapter.id}`);
    AudioManager.playSFX('unlock');
    checkAchievements();
  }
}

/* ─── SECTION 21: PRACTICE VIEW ─────────────────────────── */
function renderPractice() {
  const lang = AppState.user.language;
  const curriculum = CURRICULUM[lang];
  const container  = document.getElementById('practice-container');

  // Find lessons that have been completed (available for practice)
  const available = [];
  curriculum.chapters.forEach(ch => {
    ch.lessons.forEach(ls => {
      if (isLessonCompleted(ls.id)) available.push({ lesson: ls, chapter: ch });
    });
  });

  if (available.length === 0) {
    container.innerHTML = `
      <div class="practice-no-lessons">
        <div class="big-icon">🎓</div>
        <h3>No lessons to practice yet!</h3>
        <p>Complete lessons in the Learn section first.</p>
        <button class="btn btn-primary" onclick="navigateTo('learn')" style="margin-top:16px">
          Go to Learn <i data-lucide="arrow-right"></i>
        </button>
      </div>`;
    safeCreateIcons();
    return;
  }

  container.innerHTML = `
    <p style="color:var(--text-secondary);margin-bottom:20px;">
      Review ${available.length} completed lesson${available.length > 1 ? 's' : ''}. Practice earns reduced XP.
    </p>
    <div class="practice-grid">
      ${available.map(({ lesson, chapter }) => `
        <div class="practice-topic-card" onclick="openLessonById('${lang}', '${lesson.id}')">
          <div class="practice-topic-icon">${lesson.type === 'quiz' ? '📝' : '📖'}</div>
          <div class="practice-topic-name">${lesson.title}</div>
          <div class="practice-topic-count">${chapter.title}</div>
          <div class="badge-xp" style="width:fit-content"><i data-lucide="star"></i> +${Math.floor(lesson.xp * 0.2)} XP review</div>
        </div>
      `).join('')}
    </div>`;
  safeCreateIcons();
}

/* ─── SECTION 22: ACHIEVEMENTS VIEW ─────────────────────── */
function renderAchievements() {
  const unlocked  = AppState.progress.achievements;
  const container = document.getElementById('achievements-container');

  const html = `
    <div class="achievements-grid">
      ${ACHIEVEMENTS_DEF.map(ach => {
        const done = unlocked.includes(ach.id);
        return `
          <div class="achievement-card ${done ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
              <div class="achievement-name">${ach.name}</div>
              <div class="achievement-desc">${ach.desc}</div>
              <div class="achievement-status">${done ? '✓ UNLOCKED' : '🔒 LOCKED'}</div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
  container.innerHTML = html;
}

/* ─── SECTION 23: PROFILE VIEW ──────────────────────────── */
function renderProfile() {
  const p    = AppState.progress;
  const u    = AppState.user;
  const lang = CURRICULUM[u.language];
  const lvl  = getLevelInfo(p.xp);
  const container = document.getElementById('profile-container');

  container.innerHTML = `
    <div class="profile-hero">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar">
          <img src="assets/branding/character_logo.png" alt="Avatar"
               onerror="this.style.display='none'" />
        </div>
      </div>
      <div class="profile-hero-info">
        <div class="profile-hero-name">
          <h2 id="profile-display-name">${u.username}</h2>
          <span class="profile-level-badge">Level ${lvl.level}: ${lvl.name}</span>
        </div>
        <div class="profile-stats-row">
          <div class="profile-stat">
            <span class="profile-stat-value">${p.xp}</span>
            <span class="profile-stat-label">Total XP</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value">${p.completedLessons.length}</span>
            <span class="profile-stat-label">Lessons</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value">${p.streak}</span>
            <span class="profile-stat-label">Streak</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value">${p.achievements.length}</span>
            <span class="profile-stat-label">Achievements</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-edit-form card">
      <h3><i data-lucide="edit-2"></i> Edit Display Name</h3>
      <div class="form-row">
        <label for="profile-name-input">Display Name</label>
        <input type="text" id="profile-name-input" class="form-input"
               value="${u.username}" maxlength="30" placeholder="Enter display name" />
      </div>
      <button class="btn btn-primary" onclick="saveProfileName()">
        <i data-lucide="save"></i> Save Name
      </button>
    </div>

    <div class="card">
      <div class="card-header"><h3><i data-lucide="book-open"></i> Current Language</h3></div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
        <i class="${lang.icon}" style="font-size:2rem"></i>
        <div>
          <div style="font-weight:700;font-size:1rem">${lang.name}</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">${p.completedLessons.filter(id => id.startsWith(u.language.slice(0,3))).length} lessons completed</div>
        </div>
        <button class="btn btn-ghost" onclick="navigateTo('settings')" style="margin-left:auto">Change</button>
      </div>
    </div>
  `;
  safeCreateIcons();
}

function saveProfileName() {
  AudioManager.playSFX('click');
  const input = document.getElementById('profile-name-input');
  const val   = input ? input.value.trim() : '';
  if (!val) return;
  AppState.user.username = val;
  saveState();
  updateSidebarStats();
  document.getElementById('profile-display-name').textContent = val;
  document.getElementById('sidebar-username').textContent     = val;
  showXPPopup(0);
}

/* ─── SECTION 24: SETTINGS VIEW ─────────────────────────── */
function renderSettings() {
  const s   = AudioManager.getState();
  const u   = AppState.user;
  const container = document.getElementById('settings-container');

  container.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">Learning</div>
      <div class="settings-card">
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="code-2"></i>
            <div>
              <div class="settings-row-label">Programming Language</div>
              <div class="settings-row-sub">Currently: ${CURRICULUM[u.language].name}</div>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${['python','java','cpp'].map(l => `
              <button class="lang-sw-btn${l === u.language ? ' active' : ''}"
                      onclick="changeSettingsLanguage('${l}')">
                <i class="${CURRICULUM[l].icon}"></i>${CURRICULUM[l].name}
              </button>`).join('')}
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="target"></i>
            <div>
              <div class="settings-row-label">Daily Learning Goal</div>
              <div class="settings-row-sub">Current: ${u.dailyGoal} minutes</div>
            </div>
          </div>
          <select class="form-input" id="daily-goal-select"
                  onchange="changeDailyGoal(this.value)"
                  style="width:auto;padding:6px 10px;border-radius:var(--radius-full)">
            <option value="5"  ${u.dailyGoal==5?'selected':''}>5 min</option>
            <option value="10" ${u.dailyGoal==10?'selected':''}>10 min</option>
            <option value="15" ${u.dailyGoal==15?'selected':''}>15 min</option>
          </select>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Audio</div>
      <div class="settings-card">
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="music"></i>
            <div>
              <div class="settings-row-label">Background Music</div>
              <div class="settings-row-sub">Ambient adventure music</div>
            </div>
          </div>
          <label class="toggle-wrap" aria-label="Toggle background music">
            <input type="checkbox" id="music-toggle" ${s.musicEnabled?'checked':''}
                   onchange="AudioManager.setMusicEnabled(this.checked); updateTopbarStats();" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="volume-2"></i>
            <div>
              <div class="settings-row-label">Sound Effects</div>
              <div class="settings-row-sub">Click and feedback sounds</div>
            </div>
          </div>
          <label class="toggle-wrap" aria-label="Toggle sound effects">
            <input type="checkbox" id="sfx-toggle" ${s.sfxEnabled?'checked':''}
                   onchange="AudioManager.setSFXEnabled(this.checked);" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="sliders"></i>
            <div>
              <div class="settings-row-label">Music Volume</div>
            </div>
          </div>
          <input type="range" class="volume-slider" min="0" max="1" step="0.05"
                 value="${s.musicVolume}"
                 oninput="AudioManager.setMusicVolume(this.value)" />
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Account</div>
      <div class="settings-card">
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="refresh-cw"></i>
            <div>
              <div class="settings-row-label">Restart Onboarding</div>
              <div class="settings-row-sub">Go through the welcome process again</div>
            </div>
          </div>
          <button class="btn btn-ghost"
                  onclick="showConfirm('Restart Onboarding?','This will show the welcome screens again (your progress is saved).',restartOnboarding)">
            Restart
          </button>
        </div>
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="trash-2"></i>
            <div>
              <div class="settings-row-label">Reset All Progress</div>
              <div class="settings-row-sub">⚠️ Permanently deletes all progress and XP</div>
            </div>
          </div>
          <button class="btn btn-danger"
                  onclick="showConfirm('Reset All Progress?','This permanently deletes all your progress, XP, and achievements. This cannot be undone.',resetAllProgress)">
            Reset
          </button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">About</div>
      <div class="settings-card">
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="info"></i>
            <div>
              <div class="settings-row-label">Technopixel CodeQuest</div>
              <div class="settings-row-sub">The Knowledge Adventure — v1.0</div>
            </div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row-left">
            <i data-lucide="music-2"></i>
            <div>
              <div class="settings-row-label">Background Music</div>
              <div class="settings-row-sub">bgm_codequest.mp3 — Technopixel original audio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  safeCreateIcons();
}

function changeSettingsLanguage(lang) {
  AudioManager.playSFX('click');
  AppState.user.language = lang;
  AppState.settings.language = lang;
  saveState();
  renderSettings();
  buildLangSwitcher();
  updateSidebarStats();
  updateDashboard();
  safeCreateIcons();
}

function changeDailyGoal(val) {
  AppState.user.dailyGoal = parseInt(val);
  saveState();
  updateDashboard();
}

function restartOnboarding() {
  Storage.remove('codequest_onboarding_done');
  location.reload();
}

/* ─── SECTION 25: BOOT / INIT ───────────────────────────── */
function showStartupError(msg) {
  const ls = document.getElementById('loading-screen');
  if (ls) {
    ls.innerHTML = `
      <div style="text-align:center;padding:40px;max-width:480px;margin:auto">
        <div style="font-size:3rem;margin-bottom:16px">⚠️</div>
        <h2 style="color:#F7F2FF;margin-bottom:12px">Something went wrong</h2>
        <p style="color:#B9B0CC;margin-bottom:24px;line-height:1.6">${msg}</p>
        <button type="button" onclick="location.reload()"
          style="background:#7951DB;color:#fff;border:none;padding:12px 28px;
                 border-radius:999px;font-size:1rem;cursor:pointer;font-weight:600">
          🔄 Retry
        </button>
        <p style="margin-top:16px;font-size:0.78rem;color:#6A6480">
          Check the browser console for diagnostic details.
        </p>
      </div>`;
    ls.style.display = 'flex';
    ls.style.alignItems = 'center';
    ls.style.justifyContent = 'center';
    ls.classList.remove('fade-out');
  }
}

function bootApp() {
  // Failsafe: never trap the user — force past loading screen after 8 s
  const BOOT_TIMEOUT = 8000;
  const failsafeTimer = setTimeout(() => {
    console.error('[CodeQuest] Boot timeout — forcing past loading screen');
    const ls = document.getElementById('loading-screen');
    if (ls && !ls.classList.contains('fade-out')) {
      ls.classList.add('fade-out');
      setTimeout(() => { if (ls) ls.style.display = 'none'; }, 500);
      if (isOnboardingDone()) initMainApp();
      else {
        const ob = document.getElementById('onboarding-overlay');
        if (ob) ob.classList.remove('hidden');
        safeCreateIcons();
      }
    }
  }, BOOT_TIMEOUT);

  try {
    loadState();
  } catch (e) {
    console.error('[CodeQuest] loadState failed:', e);
  }

  const loadingScreen = document.getElementById('loading-screen');
  const onboarding    = document.getElementById('onboarding-overlay');

  setTimeout(() => {
    clearTimeout(failsafeTimer);
    try {
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => { if (loadingScreen) loadingScreen.style.display = 'none'; }, 500);
      }
      if (isOnboardingDone()) {
        if (onboarding) onboarding.classList.add('hidden');
        initMainApp();
      } else {
        if (onboarding) onboarding.classList.remove('hidden');
        safeCreateIcons();
      }
    } catch (e) {
      clearTimeout(failsafeTimer);
      console.error('[CodeQuest] Boot error:', e);
      showStartupError('The application failed to start. ' + (e.message || e));
    }
  }, 2200);
}

/* ─── SECTION 26: EVENT LISTENERS ───────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar close button
  const closeBtn = document.getElementById('sidebar-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

  // Boot the app
  bootApp();
});

/* =========================================================
   SECTION 27: QUESTION BANK LOADER
   Lazy-loads language question banks on demand and caches them.
   ========================================================= */
window.CodeQuestQuestionBanks = window.CodeQuestQuestionBanks || {};
const _qbCache = {};   // lang -> true once loaded
const _qbLoading = {}; // lang -> Promise (prevent double-load)

const QB_FILES = {
  python: 'data/questions/python.questions.js',
  java:   'data/questions/java.questions.js',
  cpp:    'data/questions/cpp.questions.js'
};

const QB_MAX = 500;

function loadQuestionBank(lang) {
  if (_qbCache[lang]) return Promise.resolve(window.CodeQuestQuestionBanks[lang] || []);
  if (_qbLoading[lang]) return _qbLoading[lang];

  const src = QB_FILES[lang];
  if (!src) return Promise.reject(new Error(`No question bank for language: ${lang}`));

  _qbLoading[lang] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      _qbCache[lang] = true;
      delete _qbLoading[lang];
      const bank = window.CodeQuestQuestionBanks[lang] || [];
      const validated = validateQuestionBank(lang, bank);
      window.CodeQuestQuestionBanks[lang] = validated;
      console.info(`[QB] Loaded ${validated.length} questions for ${lang}`);
      resolve(validated);
    };
    script.onerror = () => {
      delete _qbLoading[lang];
      console.error(`[QB] Failed to load question bank: ${src}`);
      reject(new Error(`Could not load ${lang} question bank.`));
    };
    document.head.appendChild(script);
  });

  return _qbLoading[lang];
}

function validateQuestionBank(lang, questions) {
  if (!Array.isArray(questions)) {
    console.error(`[QB] ${lang}: bank is not an array`);
    return [];
  }
  const ids = new Set();
  const valid = [];
  const VALID_TYPES = ['multiple_choice','fill_blank','predict_output','arrange','find_mistake','true_false'];
  const VALID_DIFF  = ['beginner','intermediate','advanced'];

  for (const q of questions) {
    let err = null;
    if (!q.id)                              err = 'missing id';
    else if (ids.has(q.id))                 err = `duplicate id: ${q.id}`;
    else if (q.language !== lang)           err = `wrong language (got ${q.language})`;
    else if (!VALID_TYPES.includes(q.type)) err = `invalid type: ${q.type}`;
    else if (!VALID_DIFF.includes(q.difficulty)) err = `invalid difficulty: ${q.difficulty}`;
    else if (!q.topic)                      err = 'missing topic';
    else if (!q.question)                   err = 'missing question text';
    else if (!q.correctAnswer && !q.correctOrder) err = 'missing correct answer';

    if (err) { console.warn(`[QB] Skipping question ${q.id || '?'}: ${err}`); continue; }
    if (valid.length >= QB_MAX) { console.warn(`[QB] ${lang}: hit ${QB_MAX} question limit`); break; }
    ids.add(q.id);
    valid.push(q);
  }
  return valid;
}

function getFilteredQuestions(lang, { topic, difficulty, count } = {}) {
  let questions = window.CodeQuestQuestionBanks[lang] || [];
  if (topic)      questions = questions.filter(q => q.topic === topic);
  if (difficulty) questions = questions.filter(q => q.difficulty === difficulty);
  // Fisher-Yates shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  if (count && count < questions.length) questions = questions.slice(0, count);
  return questions;
}

/* =========================================================
   SECTION 28: PRACTICE SESSION ENGINE
   ========================================================= */
let practiceSession = null; // active session state

function startPracticeSession(lang, options = {}) {
  const questions = getFilteredQuestions(lang, options);
  if (!questions.length) {
    alert('No questions available for the selected filters.');
    return;
  }
  practiceSession = {
    lang,
    questions,
    currentIdx: 0,
    answers: [],       // { questionId, correct, selectedAnswer }
    sessionXP: 0
  };
  renderPracticeSession();
}

function renderPracticeSession() {
  const sess = practiceSession;
  if (!sess) return;

  const total   = sess.questions.length;
  const idx     = sess.currentIdx;
  const q       = sess.questions[idx];
  const pct     = Math.round((idx / total) * 100);

  // Take over the practice view container
  const container = document.getElementById('practice-container');
  container.innerHTML = `
    <div class="practice-session-wrap">
      <div class="practice-session-header">
        <button type="button" class="btn btn-ghost" onclick="exitPracticeSession()">
          <i data-lucide="x"></i> Exit
        </button>
        <div class="practice-progress-info">
          <span>Question ${idx + 1} of ${total}</span>
        </div>
        <div class="practice-session-xp">
          <i data-lucide="star"></i> ${sess.sessionXP} XP
        </div>
      </div>
      <div class="progress-bar-wrap" style="margin-bottom:24px">
        <div class="progress-bar" id="prac-progress-bar" style="width:${pct}%"></div>
      </div>

      <div class="practice-question-card card" id="prac-question-area">
        <div class="exercise-label">${formatQType(q.type)}</div>
        <div class="exercise-question">${escHtml(q.question).replace(/\n/g,'<br>')}</div>
        ${renderQuestionInput(q)}
      </div>

      <div class="lesson-feedback" id="prac-feedback"></div>

      <div class="practice-session-actions">
        <button type="button" class="btn btn-ghost" id="prac-hint-btn" onclick="showPracticeHint()">
          <i data-lucide="lightbulb"></i> Hint
        </button>
        <button type="button" class="btn btn-primary" id="prac-check-btn" onclick="checkPracticeAnswer()" disabled>
          Check Answer
        </button>
      </div>
    </div>`;
  safeCreateIcons();
}

function formatQType(type) {
  const map = { multiple_choice:'Multiple Choice', fill_blank:'Fill in the Blank',
    predict_output:'Predict the Output', arrange:'Arrange the Code',
    find_mistake:'Find the Mistake', true_false:'True or False' };
  return map[type] || type;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function renderQuestionInput(q) {
  if (q.type === 'multiple_choice' || q.type === 'predict_output' ||
      q.type === 'find_mistake'    || q.type === 'true_false') {
    return `<div class="choice-options" id="prac-options">
      ${q.options.map((opt,i) => `
        <button type="button" class="choice-option" data-value="${escHtml(opt)}"
                onclick="selectPracOption(this)">
          <span class="choice-option-letter">${String.fromCharCode(65+i)}</span>
          <span>${escHtml(opt)}</span>
        </button>`).join('')}
    </div>`;
  }
  if (q.type === 'fill_blank') {
    const code = escHtml(q.codeTemplate || '___').replace(/___/, `<input type="text" id="prac-fitb"
      class="fitb-input" placeholder="your answer" autocomplete="off" spellcheck="false"
      oninput="document.getElementById('prac-check-btn').disabled=this.value.trim().length===0">`);
    return `<div class="fitb-code">${code}</div>`;
  }
  if (q.type === 'arrange') {
    const shuffled = [...q.blocks].sort(() => Math.random() - 0.5);
    return `
      <div class="arrange-zone" id="prac-arrange-zone">
        <div class="arrange-zone-label">Click blocks to add them in the correct order</div>
      </div>
      <div class="blocks-bank" id="prac-bank">
        ${shuffled.map((b,i)=>`<button type="button" class="bank-block" data-idx="${i}"
          data-text="${escHtml(b)}" onclick="pracBankClick(this)">${escHtml(b)}</button>`).join('')}
      </div>`;
  }
  return '';
}

let _pracArranged = [];

function selectPracOption(btn) {
  AudioManager.playSFX('click');
  document.querySelectorAll('#prac-options .choice-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('prac-check-btn').disabled = false;
}

function pracBankClick(btn) {
  AudioManager.playSFX('click');
  if (btn.classList.contains('used')) return;
  btn.classList.add('used');
  btn.disabled = true;
  _pracArranged.push(btn.dataset.text);
  const zone = document.getElementById('prac-arrange-zone');
  if (zone) {
    const item = document.createElement('div');
    item.className = 'code-block-item';
    item.dataset.text = btn.dataset.text;
    item.innerHTML = `<span>${escHtml(btn.dataset.text)}</span>
      <button type="button" onclick="pracRemoveArrange(this,'${escHtml(btn.dataset.idx)}')"
        style="margin-left:auto;color:var(--error)">✕</button>`;
    zone.appendChild(item);
  }
  const q = practiceSession.questions[practiceSession.currentIdx];
  document.getElementById('prac-check-btn').disabled = _pracArranged.length !== q.blocks.length;
}

function pracRemoveArrange(btn, origIdx) {
  const item = btn.closest('.code-block-item');
  const text = item.dataset.text;
  _pracArranged = _pracArranged.filter((_, i) => {
    // Remove first occurrence
    if (i === _pracArranged.indexOf(text)) { return false; }
    return true;
  });
  item.remove();
  const bankBtn = document.querySelector(`#prac-bank .bank-block[data-idx="${origIdx}"]`);
  if (bankBtn) { bankBtn.classList.remove('used'); bankBtn.disabled = false; }
  const q = practiceSession.questions[practiceSession.currentIdx];
  document.getElementById('prac-check-btn').disabled = _pracArranged.length !== q.blocks.length;
}

function showPracticeHint() {
  AudioManager.playSFX('click');
  const q = practiceSession.questions[practiceSession.currentIdx];
  const fb = document.getElementById('prac-feedback');
  if (fb) {
    fb.className = 'lesson-feedback';
    fb.style.background = 'rgba(245,215,125,0.1)';
    fb.style.border = '1px solid rgba(245,215,125,0.3)';
    fb.style.color = 'var(--xp-color)';
    fb.innerHTML = `💡 Hint: ${escHtml(q.hint || 'No hint available.')}`;
  }
}

function checkPracticeAnswer() {
  AudioManager.playSFX('click');
  const sess = practiceSession;
  const q    = sess.questions[sess.currentIdx];
  let userAnswer = null;
  let correct    = false;

  if (q.type === 'multiple_choice' || q.type === 'predict_output' ||
      q.type === 'find_mistake'    || q.type === 'true_false') {
    const sel = document.querySelector('#prac-options .choice-option.selected');
    if (!sel) return;
    userAnswer = sel.dataset.value;
    correct = userAnswer === q.correctAnswer;
    document.querySelectorAll('#prac-options .choice-option').forEach(btn => {
      btn.style.pointerEvents = 'none';
      if (btn.dataset.value === q.correctAnswer) btn.classList.add('correct');
      else if (btn.dataset.value === userAnswer && !correct) btn.classList.add('incorrect');
    });
  } else if (q.type === 'fill_blank') {
    const input = document.getElementById('prac-fitb');
    userAnswer = input ? input.value.trim() : '';
    const accepted = q.acceptedAnswers || [q.correctAnswer];
    correct = accepted.some(a => a.toLowerCase() === userAnswer.toLowerCase());
    if (input) { input.disabled = true; input.classList.add(correct ? 'correct' : 'incorrect'); }
  } else if (q.type === 'arrange') {
    correct = JSON.stringify(_pracArranged) === JSON.stringify(q.correctOrder);
    const zone = document.getElementById('prac-arrange-zone');
    if (zone) {
      zone.style.borderColor = correct ? 'var(--success)' : 'var(--error)';
      zone.style.background  = correct ? 'var(--success-bg)' : 'var(--error-bg)';
    }
    userAnswer = _pracArranged.join(' | ');
  }

  // Track already-answered questions to prevent repeat XP
  const alreadyAnswered = AppState.progress.answeredQuestions &&
                          AppState.progress.answeredQuestions.includes(q.id);
  if (correct && !alreadyAnswered) {
    sess.sessionXP += (q.xp || 5);
    if (!AppState.progress.answeredQuestions) AppState.progress.answeredQuestions = [];
    AppState.progress.answeredQuestions.push(q.id);
    saveState();
  }

  sess.answers.push({ questionId: q.id, correct, userAnswer });

  // Feedback
  AudioManager.playSFX(correct ? 'correct' : 'wrong');
  const fb = document.getElementById('prac-feedback');
  if (fb) {
    fb.style = '';
    fb.className = `lesson-feedback ${correct ? 'success' : 'error'}`;
    fb.innerHTML = `<i data-lucide="${correct ? 'check-circle' : 'x-circle'}"></i>
      <span>${correct ? '✓ Correct! ' : '✗ Not quite. '}${escHtml(q.explanation || '')}</span>`;
  }

  // Swap Check → Next
  const checkBtn = document.getElementById('prac-check-btn');
  if (checkBtn) {
    checkBtn.textContent = sess.currentIdx < sess.questions.length - 1 ? 'Next Question →' : 'See Results';
    checkBtn.onclick = nextPracticeQuestion;
    checkBtn.disabled = false;
  }
  const hintBtn = document.getElementById('prac-hint-btn');
  if (hintBtn) hintBtn.disabled = true;

  safeCreateIcons();
}

function nextPracticeQuestion() {
  AudioManager.playSFX('click');
  _pracArranged = [];
  practiceSession.currentIdx++;
  if (practiceSession.currentIdx >= practiceSession.questions.length) {
    renderPracticeResults();
  } else {
    renderPracticeSession();
  }
}

function renderPracticeResults() {
  const sess    = practiceSession;
  const correct = sess.answers.filter(a => a.correct).length;
  const total   = sess.answers.length;
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Award session XP
  if (sess.sessionXP > 0) {
    awardXP(sess.sessionXP, null);
    AudioManager.playSFX('complete');
  }

  // Achievement
  checkAchievements();

  const container = document.getElementById('practice-container');
  container.innerHTML = `
    <div class="lesson-complete" style="padding:32px 0">
      <img src="assets/character/technopixie_${pct>=70?'celebrating':'portrait'}.png"
           alt="Technopixie" class="lesson-complete-mascot"
           onerror="this.src='assets/character/technopixie_portrait.png'">
      <h2 class="lesson-complete-title">Practice Complete!</h2>
      <p class="lesson-complete-subtitle">${correct} / ${total} correct (${pct}%)</p>
      <div class="lesson-xp-award"><i data-lucide="star"></i> +${sess.sessionXP} XP earned</div>
      <div class="stats-grid" style="margin-top:16px">
        <div class="stat-card"><div class="stat-icon lessons-icon"><i data-lucide="check-circle"></i></div>
          <div class="stat-info"><span class="stat-value">${correct}</span><span class="stat-label">Correct</span></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:rgba(242,120,145,0.15);color:var(--error)"><i data-lucide="x-circle"></i></div>
          <div class="stat-info"><span class="stat-value">${total - correct}</span><span class="stat-label">Incorrect</span></div></div>
        <div class="stat-card"><div class="stat-icon xp-icon"><i data-lucide="percent"></i></div>
          <div class="stat-info"><span class="stat-value">${pct}%</span><span class="stat-label">Score</span></div></div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:16px">
        <button type="button" class="btn btn-primary" onclick="exitPracticeSession()">
          <i data-lucide="arrow-left"></i> Back to Practice
        </button>
        <button type="button" class="btn btn-ghost"
          onclick="startPracticeSession('${sess.lang}',{count:${total}})">
          <i data-lucide="refresh-cw"></i> Try Again
        </button>
      </div>
    </div>`;
  practiceSession = null;
  safeCreateIcons();
}

function exitPracticeSession() {
  practiceSession = null;
  _pracArranged   = [];
  renderPractice();
}

/* =========================================================
   SECTION 29: UPGRADED PRACTICE VIEW
   ========================================================= */
// Override renderPractice to include question bank cards
function renderPractice() {
  const lang = AppState.user.language;
  const curriculum = CURRICULUM[lang];
  const container  = document.getElementById('practice-container');

  const completed = AppState.progress.completedLessons;
  const availableLessons = [];
  curriculum.chapters.forEach(ch => {
    ch.lessons.forEach(ls => {
      if (isLessonCompleted(ls.id)) availableLessons.push({ lesson: ls, chapter: ch });
    });
  });

  const answeredQs = AppState.progress.answeredQuestions || [];

  container.innerHTML = `
    <div class="view-header" style="margin-bottom:20px">
      <div>
        <h3 style="font-size:1.1rem;font-weight:700">Lesson Review</h3>
        <p style="font-size:0.85rem;color:var(--text-muted)">Replay completed lessons</p>
      </div>
    </div>

    ${availableLessons.length === 0 ? `
      <div class="practice-no-lessons">
        <div class="big-icon">🎓</div>
        <h3>No lessons to review yet</h3>
        <p>Complete lessons in the Learn section first.</p>
        <button type="button" class="btn btn-primary" onclick="navigateTo('learn')" style="margin-top:16px">
          <i data-lucide="book-open"></i> Go to Learn
        </button>
      </div>` : `
      <div class="practice-grid" style="margin-bottom:32px">
        ${availableLessons.slice(0,6).map(({ lesson, chapter }) => `
          <div class="practice-topic-card" onclick="openLessonById('${lang}', '${lesson.id}')">
            <div class="practice-topic-icon">${lesson.type === 'quiz' ? '📝' : '📖'}</div>
            <div class="practice-topic-name">${lesson.title}</div>
            <div class="practice-topic-count">${chapter.title}</div>
          </div>`).join('')}
      </div>`}

    <div class="view-header" style="margin-bottom:20px;margin-top:8px">
      <div>
        <h3 style="font-size:1.1rem;font-weight:700">Question Banks</h3>
        <p style="font-size:0.85rem;color:var(--text-muted)">Practice with our curated question collections</p>
      </div>
    </div>

    <div class="practice-grid" id="qb-cards-area">
      ${['python','java','cpp'].map(l => {
        const d = CURRICULUM[l];
        const isLoaded = !!_qbCache[l];
        const qCount   = isLoaded ? (window.CodeQuestQuestionBanks[l] || []).length : '—';
        return `
          <div class="practice-topic-card" id="qb-card-${l}" onclick="openQBCard('${l}')">
            <div class="practice-topic-icon"><i class="${d.icon}" style="font-size:2rem"></i></div>
            <div class="practice-topic-name">${d.name} Question Bank</div>
            <div class="practice-topic-count" id="qb-count-${l}">${isLoaded ? qCount + ' questions' : 'Tap to load'}</div>
            <button type="button" class="btn btn-primary" style="margin-top:8px;width:100%;justify-content:center">
              Start Practice
            </button>
          </div>`;
      }).join('')}
    </div>

    <!-- QB options panel (hidden until a language is chosen) -->
    <div id="qb-options-panel" class="card hidden" style="margin-top:24px"></div>
  `;
  safeCreateIcons();
}

function openQBCard(lang) {
  AudioManager.playSFX('click');
  const panel = document.getElementById('qb-options-panel');
  if (!panel) return;
  panel.innerHTML = `<p style="color:var(--text-muted);padding:16px">Loading ${CURRICULUM[lang].name} questions…</p>`;
  panel.classList.remove('hidden');

  loadQuestionBank(lang).then(questions => {
    const countEl = document.getElementById(`qb-count-${lang}`);
    if (countEl) countEl.textContent = `${questions.length} questions`;
    panel.innerHTML = `
      <div class="card-header">
        <h3><i class="${CURRICULUM[lang].icon}"></i> ${CURRICULUM[lang].name} Practice Options</h3>
        <button type="button" class="btn-link" onclick="document.getElementById('qb-options-panel').classList.add('hidden')">✕ Close</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:12px">
        <div class="form-row" style="flex:1;min-width:160px">
          <label for="qb-difficulty">Difficulty</label>
          <select id="qb-difficulty" class="form-input">
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div class="form-row" style="flex:1;min-width:160px">
          <label for="qb-count">Questions</label>
          <select id="qb-count" class="form-input">
            ${[5,10,15,20].filter(n => n <= questions.length)
               .map(n => `<option value="${n}">${n} questions</option>`).join('')}
          </select>
        </div>
      </div>
      <button type="button" class="btn btn-primary" style="margin-top:16px"
        onclick="launchQBSession('${lang}')">
        <i data-lucide="play"></i> Start Session
      </button>
    `;
    safeCreateIcons();
  }).catch(err => {
    panel.innerHTML = `
      <div style="padding:16px;color:var(--error)">
        ⚠️ Could not load question bank. ${err.message}
        <button type="button" class="btn btn-ghost" style="margin-top:12px" onclick="openQBCard('${lang}')">Retry</button>
      </div>`;
  });
}

function launchQBSession(lang) {
  AudioManager.playSFX('click');
  const difficulty = document.getElementById('qb-difficulty')?.value || '';
  const count      = parseInt(document.getElementById('qb-count')?.value) || 5;
  startPracticeSession(lang, { difficulty: difficulty || undefined, count });
}

/* =========================================================
   SECTION 30: CERTIFICATE SYSTEM
   ========================================================= */
const CERT_TIERS = [
  { id: 'gold',   label: 'GOLD — MASTERY',      minPct: 90, color: '#F5D77D' },
  { id: 'silver', label: 'SILVER — PRACTITIONER', minPct: 80, color: '#B0BEC5' },
  { id: 'bronze', label: 'BRONZE — FOUNDATIONS',  minPct: 70, color: '#CD7F32' }
];

function getCertTier(pct) {
  for (const t of CERT_TIERS) { if (pct >= t.minPct) return t; }
  return null;
}

function generateCertId() {
  try {
    return 'CQ-' + crypto.randomUUID().split('-')[0].toUpperCase();
  } catch {
    return 'CQ-' + Math.random().toString(36).substr(2,8).toUpperCase();
  }
}

function isCourseComplete(lang) {
  const curriculum = CURRICULUM[lang];
  return curriculum.chapters.every(ch =>
    ch.lessons.every(l => isLessonCompleted(l.id))
  );
}

// Final assessment: pick 10 random questions from the question bank
async function startFinalAssessment(lang) {
  AudioManager.playSFX('click');
  try {
    const questions = await loadQuestionBank(lang);
    if (questions.length < 5) {
      alert('Not enough questions available for a final assessment. Please check back later.');
      return;
    }
    const selected = getFilteredQuestions(lang, { count: Math.min(10, questions.length) });
    practiceSession = {
      lang,
      questions: selected,
      currentIdx: 0,
      answers: [],
      sessionXP: 0,
      isFinalAssessment: true
    };
    renderPracticeSession();
    navigateTo('practice');
  } catch (e) {
    alert('Could not load the final assessment: ' + e.message);
  }
}

function issueCertificate(lang, pct) {
  const tier = getCertTier(pct);
  if (!tier) return null;

  const cert = {
    id:        generateCertId(),
    lang,
    langName:  CURRICULUM[lang].name,
    tier:      tier.id,
    tierLabel: tier.label,
    score:     pct,
    student:   AppState.user.username,
    date:      new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
    xp:        AppState.progress.xp
  };

  if (!AppState.progress.certificates) AppState.progress.certificates = [];
  // Only one cert per lang (keep best tier)
  const existing = AppState.progress.certificates.findIndex(c => c.lang === lang);
  if (existing >= 0) {
    if (pct > AppState.progress.certificates[existing].score) {
      AppState.progress.certificates[existing] = cert;
    }
  } else {
    AppState.progress.certificates.push(cert);
  }
  saveState();
  return cert;
}

function showCertificate(certOrLang) {
  let cert = typeof certOrLang === 'string'
    ? (AppState.progress.certificates || []).find(c => c.lang === certOrLang)
    : certOrLang;
  if (!cert) { alert('No certificate found.'); return; }

  const win = window.open('', '_blank');
  if (!win) { alert('Please allow pop-ups to view your certificate.'); return; }

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate – ${cert.langName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Inter',sans-serif; background:#171326; color:#F7F2FF;
         display:flex; align-items:center; justify-content:center;
         min-height:100vh; padding:20px; }
  .cert-page { background:linear-gradient(135deg,#221C38,#2B2345);
               border:2px solid #7951DB; border-radius:20px;
               padding:48px 56px; max-width:780px; width:100%;
               box-shadow:0 0 60px rgba(121,81,219,0.3); text-align:center; }
  .cert-header-logos { display:flex; justify-content:center; align-items:center; gap:24px; margin-bottom:32px; }
  .cert-header-logos img { height:48px; object-fit:contain; }
  .cert-border { border:1px solid rgba(191,164,255,0.2); border-radius:12px;
                 padding:32px 40px; margin:0 0 28px; }
  .cert-title { font-size:0.78rem; font-weight:700; letter-spacing:0.12em;
                text-transform:uppercase; color:#BFA4FF; margin-bottom:12px; }
  .cert-award-text { font-size:0.95rem; color:#B9B0CC; margin-bottom:8px; }
  .cert-name { font-size:2.4rem; font-weight:800; color:#F7F2FF; margin:12px 0; }
  .cert-for { font-size:0.9rem; color:#B9B0CC; margin-bottom:8px; }
  .cert-course { font-size:1.4rem; font-weight:700; color:#C3B1FF; margin-bottom:20px; }
  .cert-tier-badge { display:inline-block; padding:8px 28px;
                     border-radius:999px; font-weight:800; font-size:1rem;
                     margin-bottom:20px; }
  .cert-score { font-size:1rem; color:#B9B0CC; margin-bottom:8px; }
  .cert-score strong { color:#F5D77D; font-size:1.2rem; }
  .cert-meta { display:flex; justify-content:center; gap:40px; margin-top:24px;
               font-size:0.78rem; color:#7A6E8A; }
  .cert-meta span strong { display:block; color:#B9B0CC; font-size:0.85rem; margin-bottom:2px; }
  .cert-footer { font-size:0.75rem; color:#6A6480; margin-top:24px; }
  .cert-actions { margin-top:28px; display:flex; gap:12px; justify-content:center; }
  .btn-print { background:#7951DB; color:#fff; border:none; padding:12px 28px;
               border-radius:999px; font-size:0.92rem; cursor:pointer; font-weight:600; }
  .btn-close { background:transparent; color:#B9B0CC; border:1px solid rgba(191,164,255,0.2);
               padding:12px 28px; border-radius:999px; font-size:0.92rem; cursor:pointer; }
  @media print {
    body { background:#fff; padding:0; }
    .cert-page { background:#fff; border:2px solid #7951DB; color:#19152D;
                 box-shadow:none; max-width:100%; border-radius:0; page-break-inside:avoid; }
    .cert-name,.cert-course { color:#19152D; }
    .cert-award-text,.cert-for,.cert-score,.cert-footer { color:#444; }
    .cert-title { color:#7951DB; }
    .cert-actions { display:none; }
    @page { size:A4 landscape; margin:10mm; }
  }
</style>
</head>
<body>
<div class="cert-page">
  <div class="cert-header-logos">
    <img src="${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/,'/')}/assets/branding/codequest_logo.png"
         alt="CodeQuest" onerror="this.style.display='none'">
  </div>
  <div class="cert-border">
    <div class="cert-title">Certificate of Completion</div>
    <div class="cert-award-text">This certificate is proudly awarded to</div>
    <div class="cert-name">${cert.student}</div>
    <div class="cert-for">for successfully completing</div>
    <div class="cert-course">${cert.langName.toUpperCase()} PROGRAMMING FOUNDATIONS</div>
    <div class="cert-tier-badge" style="background:rgba(121,81,219,0.15);color:${getCertTier(cert.score)?.color||'#BFA4FF'};border:2px solid ${getCertTier(cert.score)?.color||'#7951DB'}">
      ${cert.tierLabel}
    </div>
    <div class="cert-score">Final Assessment Score: <strong>${cert.score}%</strong></div>
    <div class="cert-score">XP Earned: <strong style="color:#BFA4FF">${cert.xp} XP</strong></div>
    <div class="cert-meta">
      <span><strong>Certificate ID</strong>${cert.id}</span>
      <span><strong>Issue Date</strong>${cert.date}</span>
    </div>
  </div>
  <div class="cert-footer">
    Issued by Technopixel CodeQuest · This is a locally-issued educational completion certificate.
  </div>
  <div class="cert-actions">
    <button class="btn-print" onclick="window.print()">🖨 Print / Save as PDF</button>
    <button class="btn-close" onclick="window.close()">Close</button>
  </div>
</div>
</body>
</html>`);
  win.document.close();
}

/* ─── HOOK FINAL ASSESSMENT RESULTS INTO PRACTICE SESSION ─ */
// Patch renderPracticeResults to detect final assessment
const _origRenderPracticeResults = renderPracticeResults;
function renderPracticeResults() {
  const sess = practiceSession;
  if (sess && sess.isFinalAssessment) {
    const correct = sess.answers.filter(a => a.correct).length;
    const total   = sess.answers.length;
    const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
    const tier    = getCertTier(pct);

    if (sess.sessionXP > 0) awardXP(sess.sessionXP, null);

    let cert = null;
    if (tier && isCourseComplete(sess.lang)) {
      cert = issueCertificate(sess.lang, pct);
      checkAchievements();
      AudioManager.playSFX('unlock');
    }

    const container = document.getElementById('practice-container');
    container.innerHTML = `
      <div class="lesson-complete" style="padding:32px 0">
        <img src="assets/character/technopixie_${tier?'celebrating':'thinking'}.png"
             alt="Technopixie" class="lesson-complete-mascot"
             onerror="this.src='assets/character/technopixie_portrait.png'">
        <h2 class="lesson-complete-title">${tier ? 'Assessment Passed! 🎉' : 'Keep Studying!'}</h2>
        <p class="lesson-complete-subtitle">${correct}/${total} correct — ${pct}%</p>
        ${tier ? `<div class="lesson-xp-award" style="background:rgba(245,215,125,0.12);border-color:rgba(245,215,125,0.4);color:#F5D77D">
            🏆 ${tier.label}
          </div>` : `<p style="color:var(--text-secondary);margin-top:8px">You need 70% to pass. You scored ${pct}%. Try again!</p>`}
        ${cert ? `<div style="margin-top:12px;padding:16px;background:var(--bg-elevated);border:1px solid var(--border-color);border-radius:var(--radius-lg);text-align:center">
            <div style="font-size:0.75rem;color:var(--accent-lavender);font-weight:700;margin-bottom:4px">CERTIFICATE ISSUED</div>
            <div style="font-weight:700">${cert.id}</div>
          </div>` : ''}
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:20px">
          ${cert ? `<button type="button" class="btn btn-primary" onclick="showCertificate('${sess.lang}')">
              <i data-lucide="award"></i> View Certificate
            </button>` : ''}
          <button type="button" class="btn btn-ghost" onclick="exitPracticeSession()">
            <i data-lucide="arrow-left"></i> Back to Practice
          </button>
          ${!tier ? `<button type="button" class="btn btn-ghost"
              onclick="startFinalAssessment('${sess.lang}')">
              <i data-lucide="refresh-cw"></i> Try Again
            </button>` : ''}
        </div>
      </div>`;
    practiceSession = null;
    safeCreateIcons();
    return;
  }
  _origRenderPracticeResults();
}

/* =========================================================
   SECTION 31: EXTENDED ACHIEVEMENTS
   ========================================================= */
// Merge new achievements into the existing ACHIEVEMENTS_DEF array
const NEW_ACHIEVEMENTS = [
  { id: 'first_chapter',   name: 'Chapter Complete',     icon: '📚', desc: 'Complete your first chapter.', check: s => s.completedChapters.length >= 1 },
  { id: 'py_complete',     name: 'Python Foundations',   icon: '🐍', desc: 'Complete all Python chapters.', check: s => ['py-ch1','py-ch2','py-ch3','py-ch4'].every(id => s.completedChapters.includes(id)) },
  { id: 'java_complete',   name: 'Java Foundations',     icon: '☕', desc: 'Complete all Java chapters.', check: s => ['java-ch1','java-ch2','java-ch3','java-ch4'].every(id => s.completedChapters.includes(id)) },
  { id: 'cpp_complete',    name: 'C++ Foundations',      icon: '⚙️', desc: 'Complete all C++ chapters.', check: s => ['cpp-ch1','cpp-ch2','cpp-ch3','cpp-ch4'].every(id => s.completedChapters.includes(id)) },
  { id: 'bronze_grad',     name: 'Bronze Graduate',      icon: '🥉', desc: 'Earn a Bronze certificate.', check: s => (s.certificates||[]).some(c=>c.tier==='bronze'||c.tier==='silver'||c.tier==='gold') },
  { id: 'silver_grad',     name: 'Silver Graduate',      icon: '🥈', desc: 'Earn a Silver certificate.', check: s => (s.certificates||[]).some(c=>c.tier==='silver'||c.tier==='gold') },
  { id: 'gold_grad',       name: 'Gold Graduate',        icon: '🥇', desc: 'Earn a Gold certificate.', check: s => (s.certificates||[]).some(c=>c.tier==='gold') },
  { id: 'qb_explorer',     name: 'Question Bank Explorer', icon: '🔬', desc: 'Answer 10+ bank questions.', check: s => (s.answeredQuestions||[]).length >= 10 },
  { id: 'triple_grad',     name: 'Three Course Graduate', icon: '🎓', desc: 'Complete Python, Java, and C++.', check: s => ['py-ch1','py-ch2','py-ch3','py-ch4','java-ch1','java-ch2','java-ch3','java-ch4','cpp-ch1','cpp-ch2','cpp-ch3','cpp-ch4'].every(id=>s.completedChapters.includes(id)) }
];

// Add to ACHIEVEMENTS_DEF only if not already present
NEW_ACHIEVEMENTS.forEach(a => {
  if (!ACHIEVEMENTS_DEF.find(x => x.id === a.id)) ACHIEVEMENTS_DEF.push(a);
});

// Fix the all_chapters check to be language-aware
const allChaptersAch = ACHIEVEMENTS_DEF.find(a => a.id === 'all_chapters');
if (allChaptersAch) {
  allChaptersAch.check = s => s.completedChapters.length >= 4;
}

/* =========================================================
   SECTION 32: PROFILE UPGRADE — show certificates
   ========================================================= */
// Patch renderProfile to append certificate history
const _origRenderProfile = renderProfile;
function renderProfile() {
  _origRenderProfile();
  const certs = AppState.progress.certificates || [];
  if (certs.length === 0) return;

  const container = document.getElementById('profile-container');
  const certHtml = `
    <div class="card" style="margin-top:20px">
      <div class="card-header"><h3><i data-lucide="award"></i> My Certificates</h3></div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
        ${certs.map(cert => {
          const tier = getCertTier(cert.score);
          return `<div style="display:flex;align-items:center;gap:14px;padding:12px;
              background:var(--bg-elevated);border-radius:var(--radius-md)">
            <div style="font-size:1.8rem">${cert.tier==='gold'?'🥇':cert.tier==='silver'?'🥈':'🥉'}</div>
            <div style="flex:1">
              <div style="font-weight:700;color:var(--text-primary)">${cert.langName} Foundations</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">${cert.tierLabel} · ${cert.score}% · ${cert.date}</div>
              <div style="font-size:0.72rem;color:var(--text-muted)">ID: ${cert.id}</div>
            </div>
            <button type="button" class="btn btn-ghost" onclick="showCertificate('${cert.lang}')">
              <i data-lucide="eye"></i> View
            </button>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', certHtml);
  safeCreateIcons();
}

/* =========================================================
   SECTION 33: SETTINGS — add course completion + final assessment
   ========================================================= */
// Patch renderSettings to add "Take Final Assessment" rows
const _origRenderSettings = renderSettings;
function renderSettings() {
  _origRenderSettings();
  const container = document.getElementById('settings-container');
  const rows = ['python','java','cpp'].map(lang => {
    const done    = isCourseComplete(lang);
    const certs   = AppState.progress.certificates || [];
    const hasCert = certs.some(c => c.lang === lang);
    const d       = CURRICULUM[lang];
    return `<div class="settings-row">
      <div class="settings-row-left">
        <i class="${d.icon}"></i>
        <div>
          <div class="settings-row-label">${d.name} Final Assessment</div>
          <div class="settings-row-sub">${done ? (hasCert ? '✓ Certificate issued' : 'Course complete — ready to assess') : 'Complete all lessons first'}</div>
        </div>
      </div>
      ${done
        ? `<button type="button" class="btn ${hasCert?'btn-ghost':'btn-primary'}" onclick="startFinalAssessment('${lang}');navigateTo('practice')">
            ${hasCert ? 'Retake' : 'Start Assessment'}
          </button>`
        : `<span style="font-size:0.8rem;color:var(--text-muted)">🔒 Locked</span>`}
    </div>`;
  });

  container.insertAdjacentHTML('beforeend', `
    <div class="settings-section">
      <div class="settings-section-title">Course Certificates</div>
      <div class="settings-card">${rows.join('')}</div>
    </div>`);
  safeCreateIcons();
}

/* =========================================================
   SECTION 34: STATE MIGRATION (schema v2)
   ========================================================= */
function migrateState() {
  const version = Storage.get('codequest_schema_version') || 1;
  if (version >= SCHEMA_VERSION) return;

  console.info(`[CodeQuest] Migrating state from v${version} to v${SCHEMA_VERSION}`);
  const progress = AppState.progress;

  // v1 → v2: add new fields with safe defaults
  if (!Array.isArray(progress.answeredQuestions))  progress.answeredQuestions  = [];
  if (!Array.isArray(progress.certificates))        progress.certificates        = [];
  if (!progress.completedLessonXP)                 progress.completedLessonXP   = {};
  if (!Array.isArray(progress.completedChapters))  progress.completedChapters   = [];

  saveState();
  Storage.set('codequest_schema_version', SCHEMA_VERSION);
  console.info('[CodeQuest] Migration complete.');
}

// Run migration in loadState
const _origLoadState = loadState;
function loadState() {
  _origLoadState();
  migrateState();
}
