course({
  id: 'k2-math', title: 'Early Math: Counting and Adding', color: '#f97316', subject: 'Math', band: 'K-2', level: 'Grades K-2',
  tags: ['math', 'counting', 'addition', 'subtraction', 'numbers', 'kindergarten', 'first grade', 'second grade', 'place value'],
  blurb: 'Count, compare, add, subtract and understand tens and ones.',
  channels: [{ name: 'Khan Academy Kids', url: 'https://www.youtube.com/@khanacademykids' }, { name: 'Numberblocks', url: 'https://www.youtube.com/@Numberblocks' }],
  units: [
    U('Numbers to 20', [
      L('counting', 'Counting and comparing', `<p>Counting tells us <b>how many</b>. Say the numbers in order, touching each object once: 1, 2, 3, 4, 5. The <b>last number you say</b> tells how many there are in all.</p>
        <p>To <b>compare</b>, use <b>more</b>, <b>fewer</b> or <b>the same</b>. The symbol <code>&gt;</code> is a hungry mouth that opens toward the bigger number: 7 &gt; 4. The symbol <code>&lt;</code> opens toward the bigger number too: 4 &lt; 7. And <code>=</code> means the same.</p>`,
        [MC('Which number is bigger: 9 or 6?', ['9', '6', 'They are the same'], 0, '9 comes after 6 when we count.'),
         MC('Which symbol goes in 5 __ 8?', ['<', '>', '='], 0, '5 is less than 8, so 5 < 8.'),
         G(() => { const a = rnd(1, 19); return { q: `What number comes right after ${a}?`, accept: [String(a + 1)], explain: 'Count up by one.' }; })],
        [['What does the last number you count tell you?', 'How many there are in all.'], ['Which symbol means "the same"?', '=']], { minutes: 6, q: 'kindergarten counting comparing numbers' }),
      L('add-within-10', 'Adding within 10', `<p><b>Adding</b> means putting groups together. 3 apples and 2 apples make 5 apples: <code>3 + 2 = 5</code>. The <b>+</b> sign says "plus" and <b>=</b> says "is the same as".</p>
        <p>Tricks: you can add in any order (<code>2 + 3 = 3 + 2</code>), adding 0 changes nothing, and you can <b>count on</b> from the bigger number: for 2 + 5, start at 5 and count 6, 7.</p>`,
        [G(() => { const a = rnd(1, 6), b = rnd(1, 4); return { q: `${a} + ${b} = ?`, accept: [String(a + b)], explain: `Count on from ${Math.max(a, b)}.` }; }),
         G(() => { const a = rnd(2, 8), b = rnd(0, 2); return { q: `${a} + ${b} = ?`, accept: [String(a + b)], explain: `${a} plus ${b} is ${a + b}.` }; }),
         MC('Which is the same as 4 + 3?', ['3 + 4', '4 + 4', '3 + 3'], 0, 'You can add in any order.')],
        [['What does + mean?', 'Put together (plus).'], ['What is 6 + 0?', '6. Adding zero changes nothing.']], { minutes: 7, q: 'addition within 10 first grade' }),
    ]),
    U('Tens and ones', [
      L('place-value', 'Tens and ones', `<p>Our number system is built on groups of <b>ten</b>. The number <b>34</b> means <b>3 tens</b> and <b>4 ones</b>: 30 + 4.</p>
        <p>The digit on the left shows the tens and the digit on the right shows the ones. In 56, the <b>5</b> is in the tens place (it is worth 50) and the <b>6</b> is in the ones place.</p>`,
        [G(() => { const t = rnd(1, 9), o = rnd(0, 9); return { q: `How many tens are in ${t * 10 + o}?`, accept: [String(t)], explain: `The tens digit of ${t * 10 + o} is ${t}.` }; }),
         G(() => { const t = rnd(1, 9), o = rnd(1, 9); return { q: `${t} tens and ${o} ones = ?`, accept: [String(t * 10 + o)], explain: `${t * 10} + ${o} = ${t * 10 + o}.` }; }),
         MC('In the number 47, what is the 4 worth?', ['40', '4', '47', '7'], 0, 'It is in the tens place, so it is 4 tens = 40.')],
        [['What does 52 mean in tens and ones?', '5 tens and 2 ones (50 + 2).'], ['How many ones make one ten?', '10']], { minutes: 8, q: 'place value tens and ones' }),
      L('add-within-100', 'Adding and subtracting within 100', `<p>To add two-digit numbers, add the <b>ones</b>, then the <b>tens</b>. For 23 + 14: ones 3 + 4 = 7, tens 20 + 10 = 30, so 37.</p>
        <p>If the ones make 10 or more, <b>regroup</b>: 28 + 15 → ones 8 + 5 = 13, which is 1 ten and 3 ones. Tens: 20 + 10 + 10 = 40. Answer 43.</p>
        <p>Subtraction is the opposite: 37 − 14 → ones 7 − 4 = 3, tens 30 − 10 = 20, answer 23.</p>`,
        [G(() => { const a = rnd(11, 40), b = rnd(11, 40); return { q: `${a} + ${b} = ?`, accept: [String(a + b)], explain: 'Add the ones, then the tens, and regroup if needed.' }; }),
         G(() => { const a = rnd(50, 90), b = rnd(11, 40); return { q: `${a} − ${b} = ?`, accept: [String(a - b)], explain: 'Subtract the ones, then the tens.' }; }),
         MC('When ones add up to 10 or more, we…', ['Regroup into a new ten', 'Ignore them', 'Subtract them', 'Skip the tens'], 0, 'Ten ones become one ten.')],
        [['What does it mean to regroup?', 'Trade 10 ones for 1 ten (or 10 tens for 1 hundred).'], ['How do you add two-digit numbers?', 'Add the ones, then the tens, and regroup if the ones make 10 or more.']], { minutes: 9, q: 'add subtract within 100 regrouping' }),
    ]),
  ],
});

course({
  id: 'k2-reading', title: 'Phonics and Early Reading', color: '#ec4899', subject: 'English', band: 'K-2', level: 'Grades K-2',
  tags: ['reading', 'phonics', 'letters', 'sight words', 'english', 'ela', 'language arts', 'kindergarten', 'literacy', 'vowels'],
  blurb: 'Letters and sounds, blending words, sight words and reading simple sentences.',
  channels: [{ name: 'Khan Academy Kids', url: 'https://www.youtube.com/@khanacademykids' }, { name: 'Storyline Online', url: 'https://www.youtube.com/@storylineonline' }],
  units: [
    U('Letters and sounds', [
      L('letters', 'Letters, sounds and vowels', `<p>The alphabet has <b>26 letters</b>. Five are <b>vowels</b>: <b>a, e, i, o, u</b>. All the others are <b>consonants</b>.</p>
        <p>Each letter has a name and a sound. <b>B</b> says /b/ as in <i>ball</i>. <b>M</b> says /m/ as in <i>moon</i>. Vowels have <b>short</b> sounds (cat, bed, sit, hot, cup) and <b>long</b> sounds that say their names (cake, bee, kite, boat, mule).</p>`,
        [MC('Which of these is a vowel?', ['e', 'b', 't', 'm'], 0, 'The vowels are a, e, i, o, u.'), MC('What sound does the first letter of "moon" make?', ['/m/', '/b/', '/s/', '/n/'], 0, 'Moon starts with /m/.'), T('How many letters are in the alphabet?', ['26'], 'There are 26 letters.', 'Five vowels plus 21 consonants.')],
        [['Name the 5 vowels.', 'a, e, i, o, u'], ['What is a consonant?', 'Any letter that is not a vowel.']], { minutes: 6, q: 'alphabet letters sounds phonics' }),
      L('blending', 'Blending sounds into words', `<p>To <b>blend</b>, say each sound slowly, then push them together: <b>/c/ /a/ /t/ → cat</b>.</p>
        <p>Short words like <b>CVC</b> words (consonant, vowel, consonant) are a great start: <i>sun, pig, mop, bed, bag</i>. Word families rhyme: <i>cat, hat, mat, sat</i> all end in <b>-at</b>.</p>`,
        [MC('Blend /d/ /o/ /g/. What word is it?', ['dog', 'dig', 'dot', 'god'], 0, 'd-o-g says dog.'), MC('Which word rhymes with "hat"?', ['cat', 'hit', 'hop', 'hug'], 0, 'Hat and cat both end in -at.'), T('Which vowel is in the word "pig"?', ['i'], 'p-i-g has a short i.', 'It is the middle letter.')],
        [['What is a CVC word?', 'A word with consonant, vowel, consonant, like "sun".'], ['What does blending mean?', 'Pushing sounds together to say a whole word.']], { minutes: 8, q: 'blending cvc words phonics' }),
    ]),
    U('Reading sentences', [
      L('sight-words', 'Sight words', `<p><b>Sight words</b> show up in almost every sentence, and many don't follow the usual sound rules, so we learn them by heart: <i>the, a, is, you, was, said, are, to, of</i>.</p>
        <p>Read this sentence: <b>The dog is big.</b> It starts with a capital letter and ends with a period (<b>.</b>).</p>`,
        [MC('Which is a sentence?', ['The cat sat.', 'cat the', 'sat on'], 0, 'A sentence is a complete thought.'), MC('What goes at the end of a telling sentence?', ['A period', 'A comma', 'A capital letter'], 0, 'Telling sentences end with a period.'), T('Fill in: The dog ___ big. (is / at)', ['is'], 'The dog is big.', 'Try both words in the sentence.')],
        [['What is a sight word?', 'A common word we learn to recognize on sight, like "the" or "was".'], ['How does a sentence begin?', 'With a capital letter.']], { minutes: 7, q: 'sight words simple sentences' }),
    ]),
  ],
});

course({
  id: 'g35-fractions', title: 'Multiplication, Division and Fractions', color: '#14b8a6', subject: 'Math', band: '3-5', level: 'Grades 3-5',
  tags: ['math', 'multiplication', 'division', 'fractions', 'decimals', 'times tables', 'elementary', 'third grade', 'fourth grade', 'fifth grade'],
  blurb: 'Times tables, long division ideas, fractions and decimals.',
  channels: [{ name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' }, { name: 'Math Antics', url: 'https://www.youtube.com/@mathantics' }],
  units: [
    U('Multiplication and division', [
      L('mult', 'Multiplication as equal groups', `<p><b>Multiplication</b> is repeated addition of equal groups. 4 groups of 3 is <code>3 + 3 + 3 + 3 = 12</code>, written <code>4 × 3 = 12</code>. The numbers multiplied are <b>factors</b>; the result is the <b>product</b>.</p>
        <p>Useful facts: order doesn't matter (4 × 3 = 3 × 4), anything × 1 is itself, and anything × 0 is 0. For 9s, the digits of the product add to 9 (9 × 4 = 36 → 3 + 6 = 9).</p>`,
        [G(() => { const a = rnd(2, 9), b = rnd(2, 9); return { q: `${a} × ${b} = ?`, accept: [String(a * b)], explain: `${a} groups of ${b} is ${a * b}.` }; }),
         G(() => { const a = rnd(3, 9), b = rnd(3, 9); return { q: `${a} × ${b} = ?`, accept: [String(a * b)], explain: `${a * b}.` }; }),
         MC('In 6 × 7 = 42, the number 42 is the…', ['product', 'factor', 'sum', 'difference'], 0, 'The result of multiplying is the product.')],
        [['What is multiplication?', 'Repeated addition of equal groups.'], ['What is a factor?', 'A number you multiply, like 6 and 7 in 6 × 7.'], ['What is any number × 0?', '0']], { minutes: 8, q: 'multiplication equal groups times tables' }),
      L('div', 'Division and fact families', `<p><b>Division</b> splits a total into equal groups. 12 ÷ 3 = 4 means 12 split into 3 equal groups gives 4 in each group (or 12 split into groups of 3 gives 4 groups).</p>
        <p>Multiplication and division are <b>inverse</b> operations, shown by a fact family: 3 × 4 = 12, 4 × 3 = 12, 12 ÷ 3 = 4, 12 ÷ 4 = 3. To solve 42 ÷ 6, ask "6 times what is 42?"</p>`,
        [G(() => { const a = rnd(2, 9), b = rnd(2, 9); return { q: `${a * b} ÷ ${a} = ?`, accept: [String(b)], explain: `${a} × ${b} = ${a * b}.` }; }),
         G(() => { const a = rnd(3, 9), b = rnd(3, 9); return { q: `${a * b} ÷ ${b} = ?`, accept: [String(a)], explain: `Think: ${b} × ? = ${a * b}.` }; }),
         MC('Which fact belongs to the family 5, 6, 30?', ['30 ÷ 5 = 6', '30 ÷ 5 = 5', '5 + 6 = 30', '6 ÷ 30 = 5'], 0, '5 × 6 = 30, so 30 ÷ 5 = 6.')],
        [['Division is the inverse of…', 'Multiplication.'], ['How do you solve 42 ÷ 6?', 'Ask: 6 times what number is 42?']], { minutes: 8, q: 'division fact families' }),
    ]),
    U('Fractions and decimals', [
      L('fractions', 'Understanding fractions', `<p>A <b>fraction</b> names equal parts of a whole. In <code>3/4</code> the <b>denominator</b> (4) says how many equal parts the whole is cut into, and the <b>numerator</b> (3) says how many parts we have.</p>
        <p><b>Equivalent fractions</b> name the same amount: 1/2 = 2/4 = 4/8. Multiply (or divide) the top and bottom by the same number. To compare fractions with the same denominator, compare numerators. With the same numerator, the bigger denominator means smaller pieces: 1/8 &lt; 1/4.</p>`,
        [MC('In 3/5, what is the denominator?', ['5', '3', '8', '2'], 0, 'The bottom number is the denominator.'), T('1/2 = ?/8. What is the missing number?', ['4'], 'Multiply top and bottom by 4: 4/8.', 'What did 2 get multiplied by to become 8?'), MC('Which is larger?', ['1/2', '1/4', 'They are equal'], 0, 'Halves are bigger pieces than quarters.')],
        [['Numerator vs denominator', 'Numerator: parts you have (top). Denominator: equal parts in the whole (bottom).'], ['What are equivalent fractions?', 'Fractions that name the same amount, like 1/2 and 2/4.']], { minutes: 10, q: 'fractions equivalent fractions comparing' }),
      L('add-fractions', 'Adding fractions and decimals', `<p>To add fractions with the <b>same denominator</b>, add the numerators and keep the denominator: <code>2/7 + 3/7 = 5/7</code>. With different denominators, first rewrite as equivalent fractions: <code>1/2 + 1/4 = 2/4 + 1/4 = 3/4</code>.</p>
        <p><b>Decimals</b> are fractions with denominators of 10, 100, …: 0.5 = 5/10 = 1/2 and 0.25 = 25/100 = 1/4. Line up decimal points when adding: 1.5 + 2.25 = 3.75.</p>`,
        [G(() => { const d = rnd(5, 12), a = rnd(1, 3), b = rnd(1, 3); return { q: `${a}/${d} + ${b}/${d} = ?/${d}. What is the missing numerator?`, accept: [String(a + b)], explain: 'Add the numerators, keep the denominator.' }; }),
         MC('What is 1/2 + 1/4?', ['3/4', '2/6', '1/6', '2/4'], 0, '1/2 = 2/4, and 2/4 + 1/4 = 3/4.'), T('Write 1/2 as a decimal.', ['0.5', '.5'], '1/2 = 5/10 = 0.5.', 'Think of 10ths.')],
        [['Adding fractions with the same denominator', 'Add numerators, keep the denominator.'], ['0.25 as a fraction', '25/100 = 1/4']], { minutes: 10, q: 'adding fractions decimals' }),
    ]),
  ],
});

course({
  id: 'g35-writing', title: 'Grammar, Writing and Reading Skills', color: '#8b5cf6', subject: 'English', band: '3-5', level: 'Grades 3-5',
  tags: ['grammar', 'writing', 'english', 'ela', 'nouns', 'verbs', 'paragraph', 'sentences', 'elementary', 'reading comprehension', 'punctuation'],
  blurb: 'Parts of speech, strong sentences and paragraphs, and understanding what you read.',
  channels: [{ name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' }, { name: 'Grammaropolis', url: 'https://www.youtube.com/@grammaropolis' }],
  units: [
    U('Grammar', [
      L('parts-of-speech', 'Parts of speech', `<p>Every word has a job. A <b>noun</b> names a person, place or thing (<i>teacher, park, book</i>). A <b>verb</b> shows action or being (<i>run, is</i>). An <b>adjective</b> describes a noun (<i>big, red</i>). An <b>adverb</b> describes a verb, often ending in -ly (<i>quickly</i>). A <b>pronoun</b> replaces a noun (<i>she, they, it</i>).</p>`,
        [MC('Which word is a verb? "The tired dog slept."', ['slept', 'tired', 'dog', 'The'], 0, 'Slept is the action.'), MC('In "She ran quickly," what is "quickly"?', ['adverb', 'adjective', 'noun', 'pronoun'], 0, 'It tells how she ran.'), T('What part of speech is "happy"? (one word)', ['adjective'], 'Happy describes a noun.', 'It describes someone or something.')],
        [['Noun', 'A person, place or thing.'], ['Adverb', 'A word that describes a verb, adjective or another adverb (often ends in -ly).'], ['Pronoun', 'A word that takes the place of a noun.']], { minutes: 9, q: 'parts of speech nouns verbs adjectives' }),
      L('punctuation', 'Capitals and punctuation', `<p>Start every sentence and every <b>proper noun</b> (names like <i>Maria, Texas, Monday</i>) with a capital letter. End sentences with a <b>period</b> (statement), <b>question mark</b> (question) or <b>exclamation point</b> (strong feeling).</p>
        <p>Use a <b>comma</b> to separate items in a list (<i>apples, pears, and plums</i>) and before a conjunction joining two full sentences (<i>I wanted to play, but it rained.</i>). An <b>apostrophe</b> shows possession (<i>Sam's hat</i>) or a contraction (<i>don't</i> = do not).</p>`,
        [MC('Which sentence is correct?', ['We visited Paris in July.', 'we visited paris in july.', 'We visited paris in July.', 'We visited Paris in july.'], 0, 'Capitalize the first word and the proper nouns Paris and July.'), MC('"Dont" needs…', ["an apostrophe: don't", 'a comma', 'a capital D', 'a period'], 0, "Don't is a contraction of do not."), MC('Which ends with the right mark? "Where is my backpack"', ['?', '.', '!', ','], 0, 'It is a question.')],
        [['When do you use an apostrophe?', "For possession (Sam's hat) and contractions (don't)."], ['What gets a capital letter?', 'The first word of a sentence and proper nouns.']], { minutes: 8, q: 'capitalization punctuation commas apostrophes' }),
    ]),
    U('Writing and reading', [
      L('paragraph', 'Writing a paragraph', `<p>A strong <b>paragraph</b> has: (1) a <b>topic sentence</b> that states the main idea, (2) <b>supporting details</b> (facts, examples, reasons), and (3) a <b>concluding sentence</b>.</p>
        <p>Example topic sentence: <i>Dogs make wonderful pets.</i> Details: they are loyal, they need exercise that keeps you active, they greet you happily. Conclusion: <i>That is why so many families choose a dog.</i> Use transition words like <b>first, next, because, for example</b>.</p>`,
        [MC('A topic sentence…', ['States the main idea of the paragraph', 'Ends the paragraph', 'Lists every detail', 'Is always a question'], 0, 'It tells the reader what the paragraph is about.'), MC('Which is a transition word?', ['however', 'banana', 'quickly', 'blue'], 0, 'Transitions connect ideas.'), MC('Which sentence is a supporting detail for "Recycling helps the planet"?', ['It keeps trash out of landfills.', 'I like pizza.', 'The end.', 'Planets are round.'], 0, 'It gives a reason that supports the idea.')],
        [['Three parts of a paragraph', 'Topic sentence, supporting details, concluding sentence.'], ['Name 3 transition words', 'First, next, because, for example, however…']], { minutes: 9, q: 'writing a paragraph topic sentence' }),
      L('main-idea', 'Main idea and details', `<p>The <b>main idea</b> is what a text is mostly about. <b>Key details</b> are the facts and examples that support it. To find the main idea, ask "What is the one big thing the author wants me to know?" The title, first sentences and repeated words are clues.</p>
        <p>To <b>summarize</b>, retell the main idea and the most important details in your own words, in a few sentences.</p>`,
        [MC('A paragraph is about how bees make honey, how they dance, and how they build hives. The main idea is…', ['How bees live and work', 'Honey is sweet', 'Hives are made of wax', 'Bees are insects'], 0, 'It covers the big idea; others are single details.'), MC('A summary should be…', ['Short and in your own words', 'Longer than the text', 'Copied word for word', 'Only your opinion'], 0, 'Summaries are brief and original.'), T('What do we call the facts that support the main idea? (two words)', ['key details', 'supporting details', 'details'], 'Details back up the main idea.', 'They support it.')],
        [['Main idea', 'What a text is mostly about.'], ['How do you summarize?', 'Retell the main idea and key details briefly in your own words.']], { minutes: 8, q: 'main idea key details summarizing' }),
    ]),
  ],
});

course({
  id: 'g35-science', title: 'Earth, Space and Life Science', color: '#22c55e', subject: 'Science', band: '3-5', level: 'Grades 3-5',
  tags: ['science', 'earth science', 'space', 'solar system', 'weather', 'life cycles', 'plants', 'ecosystems', 'elementary', 'planets', 'water cycle'],
  blurb: 'Weather, the water cycle, the solar system, plants, animals and ecosystems.',
  channels: [{ name: 'SciShow Kids', url: 'https://www.youtube.com/@scishowkids' }, { name: 'National Geographic Kids', url: 'https://www.youtube.com/@natgeokids' }],
  units: [
    U('Earth and space', [
      L('water-cycle', 'The water cycle and weather', `<p>Water moves in a never-ending loop called the <b>water cycle</b>. The Sun heats oceans and lakes, so water <b>evaporates</b> into water vapor. High in the cold air the vapor <b>condenses</b> into tiny droplets that make clouds. When droplets get heavy they fall as <b>precipitation</b> (rain, snow, sleet, hail). Water <b>collects</b> in rivers, lakes, oceans and underground, and the cycle repeats.</p>
        <p><b>Weather</b> is what the air is doing today (temperature, wind, rain). <b>Climate</b> is the pattern of weather in a place over many years.</p>`,
        [MC('What causes water to evaporate?', ['Heat from the Sun', 'Wind only', 'The Moon', 'Gravity'], 0, 'The Sun adds energy that turns liquid into vapor.'), MC('Clouds form when water vapor…', ['condenses', 'evaporates', 'freezes into rock', 'sinks'], 0, 'Vapor cools and condenses into droplets.'), MC('The difference between weather and climate is…', ['Weather is short-term; climate is the long-term pattern', 'They are the same', 'Climate changes hourly', 'Weather is only rain'], 0, 'Climate is the average over years.')],
        [['Evaporation', 'Liquid water turning into water vapor (a gas).'], ['Condensation', 'Water vapor cooling into liquid droplets (clouds).'], ['Precipitation', 'Water falling from clouds as rain, snow, sleet or hail.']], { minutes: 8, q: 'water cycle weather climate' }),
      L('solar-system', 'The solar system', `<p>Our <b>solar system</b> has one star, the <b>Sun</b>, and everything that orbits it. The eight planets in order from the Sun: <b>Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</b>. The four inner planets are small and rocky; Jupiter and Saturn are gas giants; Uranus and Neptune are ice giants.</p>
        <p>Earth <b>rotates</b> (spins) once a day, giving day and night, and <b>revolves</b> (orbits) around the Sun once a year. Earth's tilt causes the seasons. The Moon orbits Earth about every 27 days.</p>`,
        [MC('Which planet is third from the Sun?', ['Earth', 'Mars', 'Venus', 'Jupiter'], 0, 'Mercury, Venus, Earth.'), MC('What causes day and night?', ['Earth rotating', 'Earth revolving around the Sun', 'The Moon blocking the Sun', 'Clouds'], 0, 'Earth spins once every 24 hours.'), T('How many planets are in our solar system?', ['8', 'eight'], 'Mercury through Neptune.', 'Count the names in the lesson.')],
        [['Rotation vs revolution', 'Rotation: spinning on an axis (a day). Revolution: orbiting the Sun (a year).'], ['What causes seasons?', "Earth's tilted axis as it orbits the Sun."]], { minutes: 9, q: 'solar system planets rotation revolution' }),
    ]),
    U('Living things', [
      L('ecosystems', 'Food chains and ecosystems', `<p>An <b>ecosystem</b> is all the living things and nonliving things (sunlight, water, soil) in an area interacting. A <b>food chain</b> shows how energy moves: <b>Sun → grass → rabbit → fox</b>.</p>
        <p><b>Producers</b> (plants) make their own food through photosynthesis. <b>Consumers</b> eat other organisms: <b>herbivores</b> eat plants, <b>carnivores</b> eat animals, <b>omnivores</b> eat both. <b>Decomposers</b> (fungi, bacteria) break down dead material and return nutrients to the soil.</p>`,
        [MC('In grass → rabbit → fox, the rabbit is a…', ['Consumer (herbivore)', 'Producer', 'Decomposer', 'Carnivore'], 0, 'Rabbits eat plants.'), MC('Which are decomposers?', ['Fungi and bacteria', 'Lions', 'Grass', 'Eagles'], 0, 'They break down dead matter.'), T('What do we call an animal that eats both plants and animals? (one word)', ['omnivore'], 'Omni means all.', 'It starts with "o".')],
        [['Producer', 'An organism that makes its own food (like plants).'], ['Decomposer', 'Breaks down dead material and returns nutrients to the soil.']], { minutes: 8, q: 'food chain ecosystem producers consumers' }),
    ]),
  ],
});
