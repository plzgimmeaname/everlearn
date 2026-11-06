(window.COURSES = window.COURSES || []).push(...[
  {
    id: 'algebra', title: 'Algebra Foundations', color: '#6366f1',
    subject: 'Math', band: '9-12', level: 'Algebra 1',
    tags: ['algebra', 'math', 'mathematics', 'equations', 'linear', 'slope', 'variables', 'pre-algebra'],
    blurb: 'Variables, equations and lines: the language of math.',
    channels: [
      { name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' },
      { name: 'Professor Leonard', url: 'https://www.youtube.com/@ProfessorLeonard' },
      { name: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown' },
    ],
    units: [
      { title: 'Expressions and equations', lessons: [
        {
          id: 'variables', title: 'Variables and expressions', minutes: 8, q: 'algebra variables and expressions',
          res: ['khan', 'youtube', 'openstax', 'quizlet'],
          body: `<p>A <b>variable</b> is a letter that stands for a number we don't know yet, or one that can change. An <b>expression</b> combines numbers, variables and operations, like <code>3x + 2</code>.</p>
<p>In <code>3x + 2</code>, the number <b>3</b> is the <b>coefficient</b> (it multiplies the variable), <b>2</b> is a <b>constant</b>, and each piece separated by + or − is a <b>term</b>.</p>
<p><b>Like terms</b> have the same variable part, so they can be combined: <code>2x + 3x = 5x</code>. But <code>2x + 3</code> can't be simplified further because <i>x</i> and 3 aren't like terms.</p>`,
          example: `<b>Evaluate</b> <code>5a − 4</code> when <code>a = 3</code>.<br>Substitute: 5(3) − 4 = 15 − 4 = <b>11</b>.`,
          quiz: [
            { type: 'text', q: 'Evaluate 3x + 2 when x = 4.', accept: ['14'], explain: '3(4) + 2 = 12 + 2 = 14.' },
            { type: 'mc', q: 'Simplify: 2x + 3x', options: ['5x', '6x', '5x²', '2x + 3x cannot be simplified'], answer: 0, explain: 'Like terms: add the coefficients, 2 + 3 = 5, so 5x.' },
            { type: 'mc', q: 'What is the coefficient in 7y − 2?', options: ['7', 'y', '−2', '5'], answer: 0, explain: 'The coefficient is the number multiplying the variable: 7.' },
          ],
          cards: [['What is a variable?', 'A letter that represents a number that is unknown or can change.'], ['What are like terms?', 'Terms with the same variable part (e.g. 2x and 3x); they can be combined.'], ['Coefficient', 'The number that multiplies a variable (the 3 in 3x).']],
        },
        {
          id: 'equations', title: 'Solving linear equations', minutes: 10, q: 'solving linear equations algebra',
          res: ['khan', 'youtube', 'libretexts', 'quizlet'],
          body: `<p>An <b>equation</b> says two expressions are equal. To <b>solve</b> it, find the value of the variable that makes it true.</p>
<p>The golden rule: <b>whatever you do to one side, do to the other</b>. Use inverse operations to isolate the variable: undo addition with subtraction, multiplication with division.</p>
<p>For multi-step equations: (1) distribute, (2) combine like terms, (3) move variable terms to one side, (4) undo addition/subtraction, (5) undo multiplication/division. Always <b>check</b> by substituting your answer back in.</p>`,
          example: `<b>Solve</b> <code>2x + 5 = 17</code>.<br>Subtract 5: 2x = 12<br>Divide by 2: <b>x = 6</b><br>Check: 2(6) + 5 = 17`,
          quiz: [
            { type: 'text', q: 'Solve: 2x + 5 = 17. x = ?', accept: ['6', 'x=6', 'x = 6'], explain: '2x = 12, so x = 6.' },
            { type: 'text', q: 'Solve: 3(x − 2) = 12. x = ?', accept: ['6', 'x=6', 'x = 6'], explain: 'Divide by 3: x − 2 = 4, so x = 6.' },
            { type: 'mc', q: 'To solve x/4 − 1 = 3, what is the first step?', options: ['Add 1 to both sides', 'Multiply both sides by 4', 'Subtract 3 from both sides', 'Divide both sides by 4'], answer: 0, explain: 'Undo the −1 first: x/4 = 4. Then multiply by 4 to get x = 16.' },
          ],
          cards: [['Golden rule of solving equations', 'Whatever you do to one side, do to the other.'], ['How do you undo addition?', 'Subtract the same number from both sides.'], ['How can you check a solution?', 'Substitute it back into the original equation and see if both sides are equal.']],
        },
      ] },
      { title: 'Lines', lessons: [
        {
          id: 'slope', title: 'Slope and graphing lines', minutes: 10, q: 'slope intercept form graphing lines',
          res: ['khan', 'youtube', 'ocw', 'anki'],
          body: `<p><b>Slope</b> measures steepness: <code>m = (y₂ − y₁) / (x₂ − x₁)</code>, "rise over run." Positive slopes go up left-to-right, negative slopes go down, horizontal lines have slope 0, and vertical lines have undefined slope.</p>
<p><b>Slope-intercept form</b> is <code>y = mx + b</code>, where <b>m</b> is the slope and <b>b</b> is the y-intercept (where the line crosses the y-axis).</p>
<p>To graph: plot the point (0, b), then use the slope to step to another point (up <i>rise</i>, right <i>run</i>), and draw the line.</p>`,
          example: `<b>Slope</b> between (1, 2) and (3, 8): (8 − 2)/(3 − 1) = 6/2 = <b>3</b>.`,
          quiz: [
            { type: 'text', q: 'Find the slope of the line through (1, 2) and (3, 8).', accept: ['3'], explain: '(8 − 2)/(3 − 1) = 3.' },
            { type: 'mc', q: 'What is the y-intercept of y = −2x + 5?', options: ['5', '−2', '2', '−5'], answer: 0, explain: 'In y = mx + b, b = 5.' },
            { type: 'mc', q: 'What is the slope of a horizontal line?', options: ['0', '1', 'Undefined', '−1'], answer: 0, explain: 'No rise, so the slope is 0.' },
          ],
          cards: [['Slope formula', 'm = (y₂ − y₁) / (x₂ − x₁)'], ['Slope-intercept form', 'y = mx + b (m = slope, b = y-intercept)'], ['Slope of a vertical line', 'Undefined']],
        },
      ] },
    ],
  },

  {
    id: 'javascript', title: 'Programming with JavaScript', color: '#f59e0b',
    subject: 'Computer science', band: '9-12', level: 'Intro',
    tags: ['programming', 'coding', 'code', 'javascript', 'js', 'computer science', 'web development', 'software'],
    blurb: 'Write real code in your browser: variables, logic, loops and functions.',
    channels: [
      { name: 'freeCodeCamp', url: 'https://www.youtube.com/@freecodecamp' },
      { name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' },
      { name: 'CrashCourse', url: 'https://www.youtube.com/@crashcourse' },
    ],
    units: [
      { title: 'The basics', lessons: [
        {
          id: 'variables', title: 'Variables and data types', minutes: 10, q: 'javascript variables data types',
          res: ['youtube', 'khan', 'ocw', 'anki'],
          body: `<p>A <b>variable</b> is a named container for a value. Declare one with <code>let</code> (can change) or <code>const</code> (can't be reassigned).</p>
<p>Common <b>types</b>: <code>number</code> (42), <code>string</code> ("hello"), <code>boolean</code> (true/false), plus <code>undefined</code> and <code>null</code>. Use <code>typeof</code> to check.</p>
<p>Strings can be joined with <code>+</code> or template literals: <code>\`Hi, \${name}!\`</code>. Use <code>console.log()</code> to print output.</p>`,
          code: `let name = "Ada";\nconst year = 2026;\nconsole.log("Hello, " + name);\nconsole.log(typeof year);\nconsole.log(year + 1);`,
          quiz: [
            { type: 'mc', q: 'Which keyword declares a variable that cannot be reassigned?', options: ['const', 'let', 'var', 'static'], answer: 0, explain: '`const` creates a binding that cannot be reassigned.' },
            { type: 'text', q: 'What does typeof "hello" return? (one word)', accept: ['string', '"string"', "'string'"], explain: 'Text values are of type string.' },
            { type: 'mc', q: 'What does console.log("5" + 3) print?', options: ['53', '8', 'NaN', 'Error'], answer: 0, explain: 'With a string on one side, + joins text: "5" + 3 = "53".' },
          ],
          cards: [['let vs const', 'let can be reassigned; const cannot.'], ['Name 4 basic JS types', 'number, string, boolean, undefined (also null, object, bigint, symbol).'], ['How do you print to the console?', 'console.log(value)']],
        },
        {
          id: 'conditionals', title: 'Making decisions with if/else', minutes: 10, q: 'javascript if else conditionals',
          res: ['youtube', 'khan', 'quizlet'],
          body: `<p><b>Conditionals</b> run code only when a condition is true:</p>
<pre><code>if (score &gt;= 90) { grade = "A"; }
else if (score &gt;= 80) { grade = "B"; }
else { grade = "C or below"; }</code></pre>
<p>Comparison operators: <code>===</code> (equal), <code>!==</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Combine conditions with <code>&amp;&amp;</code> (and), <code>||</code> (or), <code>!</code> (not).</p>
<p>Prefer <code>===</code> over <code>==</code>; the latter converts types and causes surprises.</p>`,
          code: `const age = 17;\nif (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}`,
          quiz: [
            { type: 'mc', q: 'What does (5 > 3 && 2 > 4) evaluate to?', options: ['false', 'true', '5', 'undefined'], answer: 0, explain: '&& needs both sides true; 2 > 4 is false.' },
            { type: 'mc', q: 'Which operator should you generally use to compare equality?', options: ['===', '=', '==', '=>'], answer: 0, explain: '=== compares value and type without coercion.' },
            { type: 'text', q: 'What does (true || false) evaluate to? (true/false)', accept: ['true'], explain: '|| is true if at least one side is true.' },
          ],
          cards: [['&& vs ||', '&& is true if both are true; || is true if at least one is true.'], ['Why use === instead of ==?', '=== does not convert types, avoiding surprising results.']],
        },
      ] },
      { title: 'Repeating and reusing code', lessons: [
        {
          id: 'loops', title: 'Loops and functions', minutes: 12, q: 'javascript loops functions',
          res: ['youtube', 'khan', 'ocw', 'anki'],
          body: `<p>A <b>loop</b> repeats code. A <code>for</code> loop has an initializer, a condition and an update:</p>
<pre><code>for (let i = 0; i &lt; 3; i++) { console.log(i); }
<p>A <b>function</b> packages code for reuse. It takes <b>parameters</b> and can <b>return</b> a value:</p>
<pre><code>function square(n) { return n * n; }
square(4);
<p>Arrays hold lists: <code>[10, 20, 30]</code>. Loop over them with <code>for...of</code>.</p>`,
          code: `function square(n) {\n  return n * n;\n}\nlet total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total += square(i);\n}\nconsole.log("Sum of squares 1..5 =", total);`,
          quiz: [
            { type: 'text', q: 'How many times does this run? for (let i = 0; i < 3; i++) { }', accept: ['3', 'three'], explain: 'i takes the values 0, 1, 2 and then stops: 3 times.' },
            { type: 'mc', q: 'What does a return statement do?', options: ['Sends a value back and ends the function', 'Prints a value', 'Restarts the function', 'Declares a variable'], answer: 0, explain: 'return gives the result to the caller and exits the function.' },
            { type: 'text', q: 'What is square(4) if square(n) returns n * n?', accept: ['16'], explain: '4 × 4 = 16.' },
          ],
          cards: [['Three parts of a for loop', 'Initializer, condition, update: for (let i = 0; i < n; i++).'], ['What is a parameter?', 'A named input a function receives.'], ['What does return do?', 'Sends a value back to the caller and ends the function.']],
        },
      ] },
    ],
  },

  {
    id: 'biology', title: 'Biology: Cells and Energy', color: '#10b981',
    subject: 'Science', band: '9-12', level: 'Intro',
    tags: ['biology', 'bio', 'science', 'cells', 'dna', 'genetics', 'photosynthesis', 'life science'],
    blurb: 'From cell structure to DNA to how living things get energy.',
    channels: [
      { name: 'Amoeba Sisters', url: 'https://www.youtube.com/@AmoebaSisters' },
      { name: 'CrashCourse', url: 'https://www.youtube.com/@crashcourse' },
      { name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' },
    ],
    units: [
      { title: 'Cells', lessons: [
        {
          id: 'cells', title: 'Cell theory and organelles', minutes: 9, q: 'cell biology organelles',
          res: ['openstax', 'khan', 'youtube', 'libretexts'],
          body: `<p><b>Cell theory</b>: all living things are made of cells; the cell is the basic unit of life; all cells come from existing cells.</p>
<p><b>Prokaryotes</b> (bacteria) have no nucleus. <b>Eukaryotes</b> (animals, plants, fungi) have a nucleus and membrane-bound organelles.</p>
<ul><li><b>Nucleus</b>: holds DNA</li><li><b>Mitochondria</b>: make ATP (energy)</li><li><b>Ribosomes</b>: build proteins</li><li><b>Endoplasmic reticulum / Golgi</b>: process and ship proteins</li><li><b>Cell membrane</b>: controls what enters/leaves</li><li><b>Chloroplasts</b> (plants): photosynthesis; <b>cell wall</b> (plants): support</li></ul>`,
          quiz: [
            { type: 'mc', q: 'Which organelle produces most of the cell\'s ATP?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'], answer: 0, explain: 'Mitochondria carry out cellular respiration.' },
            { type: 'mc', q: 'Which cells lack a nucleus?', options: ['Prokaryotic', 'Eukaryotic', 'Plant', 'Animal'], answer: 0, explain: 'Prokaryotes like bacteria have no membrane-bound nucleus.' },
            { type: 'text', q: 'Which organelle in plant cells performs photosynthesis? (one word)', accept: ['chloroplast', 'chloroplasts'], explain: 'Chloroplasts contain chlorophyll.' },
          ],
          cards: [['Cell theory', 'All living things are made of cells; the cell is the basic unit of life; cells come from existing cells.'], ['Function of mitochondria', 'Make ATP through cellular respiration.'], ['Prokaryote vs eukaryote', 'Prokaryotes have no nucleus; eukaryotes do.']],
        },
        {
          id: 'dna', title: 'DNA and protein synthesis', minutes: 11, q: 'DNA transcription translation',
          res: ['openstax', 'khan', 'youtube', 'scholar'],
          body: `<p><b>DNA</b> is a double helix of nucleotides with four bases: <b>A</b>, <b>T</b>, <b>G</b>, <b>C</b>. A pairs with T; G pairs with C.</p>
<p>The <b>central dogma</b>: DNA → RNA → protein.</p>
<ol><li><b>Transcription</b> (in the nucleus): DNA is copied into messenger RNA (mRNA). RNA uses <b>U</b> instead of T.</li><li><b>Translation</b> (at the ribosome): the mRNA is read in groups of three bases (<b>codons</b>), and each codon specifies an amino acid. The chain of amino acids folds into a protein.</li></ol>`,
          quiz: [
            { type: 'text', q: 'What base pairs with adenine (A) in DNA? (one letter)', accept: ['t', 'thymine'], explain: 'A–T and G–C.' },
            { type: 'mc', q: 'Where does translation take place?', options: ['Ribosome', 'Nucleus', 'Cell wall', 'Vacuole'], answer: 0, explain: 'Ribosomes read mRNA and assemble proteins.' },
            { type: 'mc', q: 'How many bases make up a codon?', options: ['3', '2', '4', '1'], answer: 0, explain: 'Each codon is three bases and codes for one amino acid.' },
          ],
          cards: [['Central dogma', 'DNA → RNA → protein.'], ['Transcription', 'Copying DNA into mRNA (in the nucleus).'], ['Translation', 'Ribosome reads mRNA codons to build a protein.'], ['Codon', 'Three mRNA bases that specify one amino acid.']],
        },
      ] },
      { title: 'Energy', lessons: [
        {
          id: 'energy', title: 'Photosynthesis and respiration', minutes: 10, q: 'photosynthesis cellular respiration',
          res: ['openstax', 'khan', 'youtube', 'libretexts'],
          body: `<p><b>Photosynthesis</b> (chloroplasts) captures light energy to build sugar:</p>
<p><code>6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂</code></p>
<p><b>Cellular respiration</b> (mitochondria) breaks sugar down to make ATP:</p>
<p><code>C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP</code></p>
<p>The two processes are nearly mirror images: the products of one are the reactants of the other. Plants do both; animals only do respiration.</p>`,
          quiz: [
            { type: 'mc', q: 'Which gas is released during photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], answer: 0, explain: 'Water is split and O₂ is released.' },
            { type: 'mc', q: 'What is the main purpose of cellular respiration?', options: ['Make ATP', 'Make glucose from light', 'Copy DNA', 'Build cell walls'], answer: 0, explain: 'Respiration converts glucose energy into ATP.' },
            { type: 'text', q: 'Which molecule is the main energy currency of the cell? (3 letters)', accept: ['atp'], explain: 'Adenosine triphosphate.' },
          ],
          cards: [['Photosynthesis equation', '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂'], ['Cellular respiration equation', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP'], ['Where does photosynthesis happen?', 'Chloroplasts.']],
        },
      ] },
    ],
  },

  {
    id: 'economics', title: 'Intro to Economics', color: '#ec4899',
    subject: 'Social studies', band: 'College', level: 'Intro',
    tags: ['economics', 'econ', 'microeconomics', 'macroeconomics', 'supply and demand', 'inflation', 'gdp', 'business', 'finance'],
    blurb: 'Scarcity, markets and the big picture of the economy.',
    channels: [
      { name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' },
      { name: 'CrashCourse', url: 'https://www.youtube.com/@crashcourse' },
    ],
    units: [
      { title: 'Microeconomics', lessons: [
        {
          id: 'scarcity', title: 'Scarcity and opportunity cost', minutes: 7, q: 'scarcity opportunity cost economics',
          res: ['khan', 'openstax', 'youtube', 'quizlet'],
          body: `<p>Economics is the study of how people make choices when <b>resources are scarce</b>: wants are unlimited, but time, money and materials are not.</p>
<p>Because of scarcity, every choice has an <b>opportunity cost</b>: the value of the <i>next best alternative</i> you give up.</p>
<p>Example: an hour spent studying could have been spent working for $15. If working is your next best use of time, the opportunity cost of studying is $15 (not the sum of everything you didn't do).</p>`,
          quiz: [
            { type: 'mc', q: 'Opportunity cost is…', options: ['The value of the next best alternative given up', 'The money price of an item', 'The sum of all alternatives', 'Always zero for free things'], answer: 0, explain: 'It is the next best option you forgo.' },
            { type: 'mc', q: 'Scarcity exists because…', options: ['Wants are unlimited but resources are limited', 'Prices are too high', 'Governments restrict trade', 'People are lazy'], answer: 0, explain: 'Limited resources vs. unlimited wants.' },
          ],
          cards: [['Scarcity', 'Unlimited wants but limited resources.'], ['Opportunity cost', 'The value of the next best alternative you give up.']],
        },
        {
          id: 'supply-demand', title: 'Supply and demand', minutes: 11, q: 'supply and demand equilibrium',
          res: ['khan', 'openstax', 'youtube', 'ocw'],
          body: `<p><b>Demand</b>: as price rises, quantity demanded falls (the law of demand). <b>Supply</b>: as price rises, quantity supplied rises (the law of supply).</p>
<p>The <b>equilibrium</b> is the price where quantity demanded equals quantity supplied. Above it there's a <b>surplus</b> (prices fall); below it a <b>shortage</b> (prices rise).</p>
<p>Factors other than price shift the curves. A cold snap that destroys orange crops <b>decreases supply</b> → equilibrium price rises, quantity falls. A viral trend increasing interest <b>increases demand</b> → price and quantity both rise.</p>`,
          quiz: [
            { type: 'mc', q: 'If price is above equilibrium, there is a…', options: ['Surplus', 'Shortage', 'Balance', 'Subsidy'], answer: 0, explain: 'Quantity supplied exceeds quantity demanded.' },
            { type: 'mc', q: 'A crop failure (supply decreases). What happens to the equilibrium price?', options: ['It rises', 'It falls', 'No change', 'Cannot tell'], answer: 0, explain: 'Less supply with the same demand pushes the price up.' },
            { type: 'mc', q: 'The law of demand says that when price rises…', options: ['Quantity demanded falls', 'Quantity demanded rises', 'Supply falls', 'Demand shifts right'], answer: 0, explain: 'Price and quantity demanded move in opposite directions.' },
          ],
          cards: [['Equilibrium', 'The price where quantity demanded equals quantity supplied.'], ['Surplus vs shortage', 'Surplus: price above equilibrium (supply > demand). Shortage: price below (demand > supply).'], ['Law of demand', 'As price rises, quantity demanded falls.']],
        },
      ] },
      { title: 'Macroeconomics', lessons: [
        {
          id: 'gdp-inflation', title: 'GDP and inflation', minutes: 9, q: 'GDP inflation macroeconomics',
          res: ['khan', 'openstax', 'youtube', 'scholar'],
          body: `<p><b>GDP</b> (gross domestic product) is the total market value of final goods and services produced in a country in a year. Expenditure approach: <code>GDP = C + I + G + (X − M)</code>: consumption, investment, government spending and net exports.</p>
<p><b>Real GDP</b> adjusts for price changes; <b>nominal GDP</b> doesn't.</p>
<p><b>Inflation</b> is a sustained rise in the general price level, often measured by the Consumer Price Index (CPI). It reduces purchasing power: if prices rise 5% and your pay rises 2%, your real income falls.</p>`,
          quiz: [
            { type: 'mc', q: 'Which is NOT a component of GDP = C + I + G + (X − M)?', options: ['Wages paid to workers', 'Consumption', 'Government spending', 'Net exports'], answer: 0, explain: 'Wages are income; the formula sums spending categories.' },
            { type: 'mc', q: 'Prices rise 5% while your pay rises 2%. Your purchasing power…', options: ['Falls', 'Rises', 'Stays the same', 'Doubles'], answer: 0, explain: 'Your real income declined by about 3%.' },
            { type: 'text', q: 'What does CPI stand for? (first word)', accept: ['consumer'], explain: 'Consumer Price Index.' },
          ],
          cards: [['GDP', 'Total market value of final goods and services produced in a country in a period.'], ['Expenditure formula for GDP', 'GDP = C + I + G + (X − M)'], ['Inflation', 'A sustained increase in the general price level.']],
        },
      ] },
    ],
  },
]);
