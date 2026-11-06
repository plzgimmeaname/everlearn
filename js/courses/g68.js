course({
  id: 'g68-prealgebra', title: 'Pre-Algebra', color: '#3b82f6', subject: 'Math', band: '6-8', level: 'Grades 6-8',
  tags: ['math', 'pre-algebra', 'prealgebra', 'ratios', 'percent', 'integers', 'negative numbers', 'proportions', 'middle school', 'expressions'],
  blurb: 'Integers, ratios, percents and the first steps into equations.',
  channels: [{ name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' }, { name: 'Math Antics', url: 'https://www.youtube.com/@mathantics' }],
  units: [
    U('Numbers and operations', [
      L('integers', 'Negative numbers and integers', `<p><b>Integers</b> are whole numbers and their opposites: …, −3, −2, −1, 0, 1, 2, 3, …. On a number line, numbers to the right are greater. <b>Absolute value</b> |x| is the distance from 0, so |−5| = 5.</p>
        <p><b>Adding</b>: same signs, add and keep the sign (−3 + −4 = −7). Different signs, subtract and keep the sign of the bigger absolute value (−8 + 3 = −5). <b>Subtracting</b> is adding the opposite: 5 − (−2) = 5 + 2 = 7. <b>Multiplying/dividing</b>: same signs → positive, different signs → negative.</p>`,
        [G(() => { const a = rnd(-12, 12), b = rnd(-12, 12); return { q: `${a} + (${b}) = ?`, accept: [String(a + b)], explain: 'Same signs add; different signs subtract and keep the larger absolute value\'s sign.' }; }),
         G(() => { const a = rnd(-9, 9), b = rnd(2, 9); return { q: `${a} − (${-b}) = ?`, accept: [String(a + b)], explain: 'Subtracting a negative means adding the positive.' }; }),
         G(() => { const a = rnd(-9, -2), b = rnd(2, 9); return { q: `${a} × ${b} = ?`, accept: [String(a * b)], explain: 'Different signs give a negative product.' }; }),
         MC('What is |−8|?', ['8', '−8', '0', '16'], 0, 'Absolute value is distance from 0.')],
        [['Subtracting a negative', 'Is the same as adding the positive: 5 − (−2) = 7.'], ['Sign rule for multiplying', 'Same signs: positive. Different signs: negative.'], ['Absolute value', 'Distance from zero; always non-negative.']], { minutes: 12, q: 'integers negative numbers operations' }),
      L('order-ops', 'Order of operations', `<p>Follow <b>PEMDAS</b>: <b>P</b>arentheses, <b>E</b>xponents, <b>M</b>ultiplication and <b>D</b>ivision (left to right), <b>A</b>ddition and <b>S</b>ubtraction (left to right).</p>
        <p>Example: <code>3 + 4 × 2² − 1</code>. Exponent: 2² = 4. Multiply: 4 × 4 = 16. Then left to right: 3 + 16 − 1 = <b>18</b>.</p>`,
        [G(() => { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 5); return { q: `${a} + ${b} × ${c} = ?`, accept: [String(a + b * c)], explain: 'Multiply first, then add.' }; }),
         G(() => { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 5); return { q: `(${a} + ${b}) × ${c} = ?`, accept: [String((a + b) * c)], explain: 'Parentheses first.' }; }),
         MC('What does the "E" in PEMDAS stand for?', ['Exponents', 'Equals', 'Evaluate', 'Even'], 0, 'Exponents come after parentheses.')],
        [['PEMDAS', 'Parentheses, Exponents, Multiplication/Division, Addition/Subtraction.'], ['Multiplication and division order', 'Do them left to right, as they come, with equal priority.']], { minutes: 8, q: 'order of operations pemdas' }),
    ]),
    U('Ratios, percents and equations', [
      L('ratios', 'Ratios, rates and proportions', `<p>A <b>ratio</b> compares two quantities: 3 boys to 5 girls is 3:5 or 3/5. A <b>rate</b> compares different units (60 miles per 2 hours = 30 mph). A <b>unit rate</b> has 1 in the denominator.</p>
        <p>A <b>proportion</b> says two ratios are equal. Solve with cross-multiplication: <code>2/3 = x/12</code> → 3x = 24 → x = 8.</p>`,
        [G(() => { const r = rnd(2, 9), h = rnd(2, 8); return { q: `A car travels ${r * h} miles in ${h} hours. What is its speed in miles per hour?`, accept: [String(r)], explain: 'Divide distance by time.' }; }),
         G(() => { const a = rnd(2, 5), b = rnd(2, 6), k = rnd(2, 6); return { q: `${a}/${b} = x/${b * k}. x = ?`, accept: [String(a * k)], explain: `Multiply the top by ${k} too.` }; }),
         MC('A recipe uses 2 cups flour for 3 cups milk. What is the ratio of flour to milk?', ['2:3', '3:2', '5:2', '2:5'], 0, 'Flour first, then milk.')],
        [['Unit rate', 'A rate with 1 unit in the denominator (e.g. 30 miles per hour).'], ['Solving a proportion', 'Cross-multiply and divide.']], { minutes: 10, q: 'ratios rates proportions' }),
      L('percents', 'Percents', `<p>A <b>percent</b> means "per hundred": 25% = 25/100 = 0.25. To find a percent of a number, convert to a decimal and multiply: 20% of 60 = 0.20 × 60 = 12.</p>
        <p><b>Percent change</b> = (new − old) / old × 100. A price rising from $40 to $50 is (10/40) × 100 = 25% increase. For discounts, multiply by (1 − rate): 30% off $80 → 0.70 × 80 = $56.</p>`,
        [G(() => { const p = pick([10, 20, 25, 50, 15]), n = pick([40, 60, 80, 120, 200]); return { q: `What is ${p}% of ${n}?`, accept: [String(p * n / 100)], explain: `${p / 100} × ${n}.` }; }),
         G(() => { const o = pick([50, 80, 100, 200]), p = pick([10, 20, 25]); return { q: `A $${o} item is ${p}% off. What is the sale price in dollars?`, accept: [String(o * (100 - p) / 100)], explain: `Multiply by ${(100 - p) / 100}.` }; }),
         MC('Which equals 0.35?', ['35%', '3.5%', '0.35%', '350%'], 0, 'Percent means per hundred.')],
        [['Percent of a number', 'Convert to a decimal and multiply.'], ['Percent change formula', '(new − old) / old × 100']], { minutes: 10, q: 'percents percent change discount' }),
    ]),
  ],
});

course({
  id: 'g68-science', title: 'Middle School Physical Science', color: '#f59e0b', subject: 'Science', band: '6-8', level: 'Grades 6-8',
  tags: ['science', 'physical science', 'physics', 'chemistry', 'matter', 'atoms', 'force', 'motion', 'energy', 'newton', 'middle school'],
  blurb: 'Atoms and matter, chemical reactions, forces, motion and energy.',
  channels: [{ name: 'CrashCourse Kids', url: 'https://www.youtube.com/@crashcoursekids' }, { name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' }],
  units: [
    U('Matter', [
      L('atoms', 'Atoms and the periodic table', `<p>Everything is made of <b>atoms</b>. An atom has a nucleus with positive <b>protons</b> and neutral <b>neutrons</b>, surrounded by negative <b>electrons</b>. The number of protons is the <b>atomic number</b> and identifies the element: hydrogen has 1, carbon 6, oxygen 8.</p>
        <p>The <b>periodic table</b> orders elements by atomic number. Columns (groups) share properties; metals are on the left, nonmetals on the right. A <b>molecule</b> is atoms bonded together (H₂O: two hydrogen, one oxygen). A <b>compound</b> has atoms of different elements.</p>`,
        [MC('What particle has a negative charge?', ['Electron', 'Proton', 'Neutron', 'Nucleus'], 0, 'Electrons are negative.'), MC('The atomic number tells you the number of…', ['Protons', 'Neutrons', 'Electrons only', 'Molecules'], 0, 'It defines the element.'), T('How many protons does carbon have?', ['6'], 'Carbon\'s atomic number is 6.', 'Look at its atomic number.')],
        [['Three parts of an atom', 'Protons (+), neutrons (neutral), electrons (−).'], ['Atomic number', 'The number of protons in an atom; identifies the element.']], { minutes: 9, q: 'atoms periodic table protons neutrons electrons' }),
      L('states-reactions', 'States of matter and chemical reactions', `<p>Matter exists mainly as <b>solid</b> (fixed shape and volume), <b>liquid</b> (fixed volume, takes container's shape) and <b>gas</b> (fills any container). Adding heat makes particles move faster: melting, boiling; removing heat reverses it. These are <b>physical changes</b>: the substance stays the same.</p>
        <p>In a <b>chemical reaction</b> atoms rearrange to form new substances (rusting, burning, baking). Signs: gas bubbles, color change, temperature change, new precipitate. Mass is conserved: the atoms before equal the atoms after (<b>law of conservation of mass</b>).</p>`,
        [MC('Which is a chemical change?', ['Iron rusting', 'Ice melting', 'Water boiling', 'Cutting paper'], 0, 'Rust is a new substance.'), MC('Particles move fastest in a…', ['Gas', 'Solid', 'Liquid', 'All the same'], 0, 'Gas particles have the most energy.'), MC('The law of conservation of mass says…', ['Atoms are rearranged, not created or destroyed', 'Mass doubles in reactions', 'Gases weigh nothing', 'Mass is lost as heat'], 0, 'Total mass stays the same.')],
        [['Physical vs chemical change', 'Physical: same substance, new form. Chemical: new substances formed.'], ['Conservation of mass', 'Matter is not created or destroyed in a reaction.']], { minutes: 10, q: 'states of matter chemical reactions' }),
    ]),
    U('Forces and energy', [
      L('newton', "Newton's laws of motion", `<p><b>1st law (inertia)</b>: an object stays at rest or in constant motion unless a net force acts on it. <b>2nd law</b>: <code>F = m × a</code>, force equals mass times acceleration (in newtons when mass is in kg and a in m/s²). <b>3rd law</b>: for every action there is an equal and opposite reaction.</p>
        <p><b>Speed</b> = distance / time. <b>Velocity</b> is speed with direction. <b>Acceleration</b> is how fast velocity changes.</p>`,
        [G(() => { const m = rnd(2, 10), a = rnd(2, 9); return { q: `A ${m} kg cart accelerates at ${a} m/s². What net force acts on it, in newtons?`, accept: [String(m * a)], explain: 'F = m × a.' }; }),
         G(() => { const s = rnd(2, 9), t = rnd(2, 9); return { q: `A cyclist rides ${s * t} m in ${t} s. What is the speed in m/s?`, accept: [String(s)], explain: 'Speed = distance ÷ time.' }; }),
         MC("When you push on a wall, the wall pushes back. That is Newton's…", ['3rd law', '1st law', '2nd law', 'Law of gravity'], 0, 'Action and reaction.')],
        [["Newton's 2nd law", 'F = m × a'], ['Inertia', 'The tendency of objects to keep their current motion unless acted on by a net force.']], { minutes: 10, q: 'newtons laws force motion acceleration' }),
      L('energy', 'Energy and its forms', `<p><b>Energy</b> is the ability to cause change. <b>Kinetic energy</b> is energy of motion (<code>KE = ½mv²</code>); <b>potential energy</b> is stored (a book on a shelf: <code>PE = mgh</code>). Other forms: thermal, chemical, electrical, light, sound.</p>
        <p>The <b>law of conservation of energy</b>: energy cannot be created or destroyed, only transformed. A roller coaster at the top has high PE; at the bottom that PE has become KE.</p>`,
        [MC('A ball at the top of a hill has mostly…', ['Potential energy', 'Kinetic energy', 'No energy', 'Sound energy'], 0, 'Stored due to height.'), MC('When a falling object speeds up, potential energy is transformed into…', ['Kinetic energy', 'Mass', 'Force', 'Nothing'], 0, 'Energy is conserved.'), T('What is the unit of energy? (one word)', ['joule', 'joules'], 'Energy is measured in joules.', 'Named after James Joule.')],
        [['Kinetic energy', 'Energy of motion, ½mv².'], ['Law of conservation of energy', 'Energy is transformed, never created or destroyed.']], { minutes: 9, q: 'kinetic potential energy conservation' }),
    ]),
  ],
});

course({
  id: 'g68-history', title: 'US History: Founding to Civil War', color: '#dc2626', subject: 'Social studies', band: '6-8', level: 'Grades 6-8',
  tags: ['history', 'us history', 'american history', 'revolution', 'constitution', 'civil war', 'slavery', 'independence', 'middle school', 'social studies'],
  blurb: 'From colonial America through the Revolution, the Constitution and the Civil War.',
  channels: [{ name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' }, { name: 'CrashCourse US History', url: 'https://www.youtube.com/@crashcourse' }],
  units: [
    U('Revolution and a new nation', [
      L('revolution', 'Causes of the American Revolution', `<p>By the 1760s, Britain had 13 colonies in North America. After the costly <b>French and Indian War</b> (1754–63), Britain taxed the colonists: the <b>Stamp Act</b> (1765), <b>Townshend Acts</b> (1767) and <b>Tea Act</b> (1773). Colonists objected to "<b>taxation without representation</b>": they had no voice in Parliament.</p>
        <p>Protests grew: the <b>Boston Massacre</b> (1770), the <b>Boston Tea Party</b> (1773) and Britain's punitive <b>Intolerable Acts</b> (1774). Colonial leaders met at the <b>Continental Congress</b>, fighting began at <b>Lexington and Concord</b> (April 1775), and the <b>Declaration of Independence</b>, mostly written by <b>Thomas Jefferson</b>, was adopted on <b>July 4, 1776</b>.</p>`,
        [MC('What did "no taxation without representation" mean?', ['Colonists should not be taxed by a Parliament where they had no representatives', 'Taxes should be abolished', 'Only the king can tax', 'Colonists refused all laws'], 0, 'It was a protest about not having a say in Parliament.'), T('In what year was the Declaration of Independence adopted?', ['1776'], 'July 4, 1776.', 'It is the year of the Fourth of July.'), MC('Who was the main author of the Declaration of Independence?', ['Thomas Jefferson', 'George Washington', 'Benjamin Franklin', 'John Adams'], 0, 'Jefferson drafted it.')],
        [['Why did colonists protest British taxes?', 'They had no representation in Parliament ("no taxation without representation").'], ['When was the Declaration of Independence adopted?', 'July 4, 1776.']], { minutes: 10, q: 'american revolution causes declaration of independence' }),
      L('constitution', 'The Constitution and Bill of Rights', `<p>The first government, the <b>Articles of Confederation</b>, was too weak: it couldn't tax or regulate trade. In 1787 delegates met in Philadelphia and wrote the <b>Constitution</b>. It created three branches with <b>checks and balances</b>: <b>legislative</b> (Congress makes laws), <b>executive</b> (President enforces them), and <b>judicial</b> (courts interpret them). Power is shared between national and state governments (<b>federalism</b>).</p>
        <p>To win ratification, the first 10 amendments, the <b>Bill of Rights</b> (1791), protect freedoms like speech, religion, press, assembly and a fair trial.</p>`,
        [MC('Which branch makes laws?', ['Legislative', 'Executive', 'Judicial', 'Federal'], 0, 'Congress is the legislative branch.'), MC('The Bill of Rights is…', ['The first 10 amendments', 'The Declaration of Independence', 'The Articles of Confederation', 'A state constitution'], 0, 'Ratified in 1791.'), MC('Checks and balances prevent…', ['Any one branch from becoming too powerful', 'States from voting', 'Elections', 'Taxes'], 0, 'Each branch limits the others.')],
        [['Three branches of government', 'Legislative (makes laws), executive (enforces), judicial (interprets).'], ['Why was the Bill of Rights added?', 'To protect individual freedoms and win ratification of the Constitution.']], { minutes: 10, q: 'us constitution bill of rights three branches' }),
    ]),
    U('A divided nation', [
      L('civil-war', 'Slavery, secession and the Civil War', `<p>Slavery was central to the Southern economy, especially cotton, and a growing conflict as new states joined the Union. Compromises (Missouri 1820, 1850) delayed the break. The <b>Dred Scott</b> decision (1857) and the raid at <b>Harpers Ferry</b> (1859) heightened tension. After <b>Abraham Lincoln</b>, who opposed expanding slavery, won the 1860 election, Southern states <b>seceded</b> and formed the Confederacy. War began at <b>Fort Sumter</b> in April 1861.</p>
        <p>Key events: the <b>Emancipation Proclamation</b> (1863), the Union victories at <b>Gettysburg</b> and <b>Vicksburg</b> (1863), and Lee's surrender at <b>Appomattox</b> (1865). The <b>13th Amendment</b> abolished slavery.</p>`,
        [MC('What event began the Civil War in 1861?', ['Attack on Fort Sumter', 'Battle of Gettysburg', 'Emancipation Proclamation', 'Boston Tea Party'], 0, 'Confederate forces fired on Fort Sumter.'), MC('Which amendment abolished slavery?', ['13th', '1st', '19th', '10th'], 0, 'Ratified in 1865.'), T('Who was President of the United States during the Civil War? (last name)', ['lincoln'], 'Abraham Lincoln.', 'He gave the Gettysburg Address.')],
        [['What was the Emancipation Proclamation?', "Lincoln's 1863 order declaring enslaved people in Confederate states free."], ['Which amendment ended slavery?', 'The 13th Amendment (1865).']], { minutes: 11, q: 'civil war slavery emancipation proclamation' }),
    ]),
  ],
});
