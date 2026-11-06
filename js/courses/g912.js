course({
  id: 'hs-geometry', title: 'Geometry', color: '#06b6d4', subject: 'Math', band: '9-12', level: 'High school',
  tags: ['geometry', 'math', 'angles', 'triangles', 'proofs', 'pythagorean', 'trigonometry', 'circles', 'area', 'volume', 'congruence'],
  blurb: 'Angles, triangles, proof, right-triangle trigonometry, circles, area and volume.',
  channels: [{ name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' }, { name: 'Professor Leonard', url: 'https://www.youtube.com/@ProfessorLeonard' }, { name: 'The Organic Chemistry Tutor', url: 'https://www.youtube.com/@TheOrganicChemistryTutor' }],
  units: [
    U('Angles and triangles', [
      L('angles', 'Angle relationships and parallel lines', `<p>An <b>angle</b> is formed by two rays sharing an endpoint (the <b>vertex</b>). We measure it in degrees. A <b>right</b> angle is 90°, an <b>acute</b> angle is less than 90°, an <b>obtuse</b> angle is between 90° and 180°, and a <b>straight</b> angle is 180°.</p>
        <p><b>Special pairs.</b> Two angles are <b>complementary</b> if they sum to 90° and <b>supplementary</b> if they sum to 180°. Angles that form a <b>linear pair</b> (adjacent on a straight line) are supplementary. When two lines intersect, the <b>vertical angles</b> (opposite each other) are equal.</p>
        <p><b>Parallel lines and a transversal.</b> When a transversal crosses two parallel lines, eight angles form, and they fall into predictable groups: <b>corresponding angles</b> are equal, <b>alternate interior angles</b> are equal, <b>alternate exterior angles</b> are equal, and <b>same-side interior angles</b> are supplementary. The converses are also true, and that is how we <i>prove</i> two lines are parallel.</p>
        <p><b>Common mistake:</b> assuming lines are parallel because they look parallel. In geometry a fact must be given or proven, never read off the picture.</p>`,
        [G(() => { const a = rnd(20, 80); return { q: `Two angles are complementary. One measures ${a}°. What is the other, in degrees?`, accept: [String(90 - a)], explain: `90 − ${a} = ${90 - a}.` }; }),
         G(() => { const a = rnd(40, 140); return { q: `Two angles form a linear pair. One is ${a}°. What is the other, in degrees?`, accept: [String(180 - a)], explain: `Linear pairs are supplementary: 180 − ${a} = ${180 - a}.` }; }),
         G(() => { const x = rnd(10, 40); return { q: `Parallel lines are cut by a transversal. Alternate interior angles measure (2x + 10)° and ${2 * x + 10}°. Find x.`, accept: [String(x)], explain: 'Alternate interior angles are equal, so 2x + 10 = ' + (2 * x + 10) + '.' }; }),
         MC('Same-side interior angles formed by parallel lines and a transversal are…', ['Supplementary', 'Equal', 'Complementary', 'Vertical'], 0, 'They add to 180°.'),
         MC('Which statement may you assume from a diagram without being told?', ['Nothing about parallelism or equal lengths unless marked or given', 'Lines that look parallel are parallel', 'Segments that look equal are equal', 'Angles that look 90° are right angles'], 0, 'Diagrams are not drawn to scale; use given information.')],
        [['Complementary vs supplementary', 'Complementary add to 90°; supplementary add to 180°.'], ['Vertical angles', 'Opposite angles formed by intersecting lines; always equal.'], ['Alternate interior angles', 'Equal when the lines are parallel.'], ['Same-side interior angles', 'Supplementary when the lines are parallel.']],
        { minutes: 14, q: 'angle relationships parallel lines transversal', res: ['khan', 'youtube', 'ocw', 'quizlet'] }),
      L('congruence', 'Triangles and congruence', `<p>The three interior angles of any triangle add to <b>180°</b>. An <b>exterior angle</b> equals the sum of the two remote interior angles. Triangles are classified by sides (<b>scalene, isosceles, equilateral</b>) and by angles (<b>acute, right, obtuse</b>).</p>
        <p>Two triangles are <b>congruent</b> when all corresponding sides and angles match, but you don't need to check all six. These criteria are enough: <b>SSS</b> (three sides), <b>SAS</b> (two sides and the <i>included</i> angle), <b>ASA</b> and <b>AAS</b> (two angles and a side), and <b>HL</b> (hypotenuse and leg, right triangles only). <b>SSA</b> and <b>AAA</b> do <i>not</i> guarantee congruence.</p>
        <p>Once two triangles are congruent, <b>CPCTC</b> (corresponding parts of congruent triangles are congruent) lets you conclude that any remaining pair of corresponding parts is equal. The <b>isosceles triangle theorem</b> states that base angles of an isosceles triangle are equal.</p>`,
        [G(() => { const a = rnd(30, 80), b = rnd(30, 80); return { q: `A triangle has angles of ${a}° and ${b}°. What is the third angle, in degrees?`, accept: [String(180 - a - b)], explain: `180 − ${a} − ${b} = ${180 - a - b}.` }; }),
         G(() => { const v = rnd(20, 70); return { q: `An isosceles triangle has a vertex angle of ${2 * v}°. How many degrees is each base angle?`, accept: [String(90 - v)], explain: `(180 − ${2 * v}) ÷ 2 = ${90 - v}.` }; }),
         MC('Which is NOT a valid triangle congruence criterion?', ['SSA (for general triangles)', 'SAS', 'ASA', 'SSS'], 0, 'SSA can describe two different triangles.'),
         MC('In SAS, the angle must be…', ['Between the two given sides', 'Opposite the longer side', 'Any angle', 'The right angle'], 0, 'The included angle is the one between the sides.'),
         T('What does the "C" in CPCTC stand for in the first word? (one word)', ['corresponding'], 'Corresponding parts of congruent triangles are congruent.', 'It starts with c.')],
        [['Triangle angle sum', 'The interior angles add to 180°.'], ['Congruence criteria', 'SSS, SAS, ASA, AAS, and HL (right triangles).'], ['CPCTC', 'Corresponding parts of congruent triangles are congruent.']],
        { minutes: 14, q: 'triangle congruence SSS SAS ASA proofs', res: ['khan', 'youtube', 'ocw', 'quizlet'] }),
    ]),
    U('Right triangles and circles', [
      L('right-triangles', 'The Pythagorean theorem and trigonometric ratios', `<p>In a <b>right triangle</b> with legs <i>a</i>, <i>b</i> and hypotenuse <i>c</i> (the side opposite the right angle): <code>a² + b² = c²</code>. Example: legs 6 and 8 give c² = 36 + 64 = 100, so c = 10. Common <b>Pythagorean triples</b>: 3-4-5, 5-12-13, 8-15-17, 7-24-25.</p>
        <p><b>Special right triangles.</b> A 45-45-90 triangle has sides in the ratio <code>1 : 1 : √2</code>. A 30-60-90 triangle has sides <code>1 : √3 : 2</code> (short leg : long leg : hypotenuse).</p>
        <p><b>Trigonometric ratios</b> relate an acute angle θ to the sides: <code>sin θ = opposite / hypotenuse</code>, <code>cos θ = adjacent / hypotenuse</code>, <code>tan θ = opposite / adjacent</code> (SOH-CAH-TOA). To find a side, set up the ratio and solve; to find an angle, use the inverse function (sin⁻¹, cos⁻¹, tan⁻¹).</p>`,
        [G(() => { const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]); return { q: `A right triangle has legs ${t[0]} and ${t[1]}. What is the hypotenuse?`, accept: [String(t[2])], explain: `${t[0]}² + ${t[1]}² = ${t[2]}².` }; }),
         G(() => { const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]); return { q: `A right triangle has hypotenuse ${t[2]} and one leg ${t[0]}. What is the other leg?`, accept: [String(t[1])], explain: `${t[2]}² − ${t[0]}² = ${t[1]}².` }; }),
         MC('In a right triangle, sin θ equals…', ['opposite / hypotenuse', 'adjacent / hypotenuse', 'opposite / adjacent', 'hypotenuse / opposite'], 0, 'SOH: sine = opposite over hypotenuse.'),
         MC('In a 30-60-90 triangle the short leg is 5. The hypotenuse is…', ['10', '5√3', '5√2', '15'], 0, 'The hypotenuse is twice the short leg.'),
         T('tan 45° = ?', ['1'], 'In a 45-45-90 triangle the legs are equal, so opposite/adjacent = 1.', 'The two legs are equal.')],
        [['Pythagorean theorem', 'a² + b² = c² for a right triangle with hypotenuse c.'], ['SOH-CAH-TOA', 'sin = opp/hyp, cos = adj/hyp, tan = opp/adj.'], ['30-60-90 ratio', 'Short leg : long leg : hypotenuse = 1 : √3 : 2.'], ['45-45-90 ratio', 'Leg : leg : hypotenuse = 1 : 1 : √2.']],
        { minutes: 16, q: 'pythagorean theorem right triangle trigonometry sohcahtoa', res: ['khan', 'youtube', 'ocw', 'anki'] }),
      L('circles-area', 'Circles, area and volume', `<p>For a circle of radius <i>r</i>: <b>circumference</b> <code>C = 2πr</code> and <b>area</b> <code>A = πr²</code>. An <b>arc</b> of a central angle θ has length <code>(θ/360) · 2πr</code>, and the <b>sector</b> it cuts has area <code>(θ/360) · πr²</code>.</p>
        <p><b>Area formulas:</b> rectangle <code>bh</code>; triangle <code>½bh</code>; parallelogram <code>bh</code>; trapezoid <code>½(b₁ + b₂)h</code>.</p>
        <p><b>Volume</b> measures space inside a 3D solid. Prism or cylinder: <code>V = Bh</code> (area of the base times height). Cone or pyramid: <code>V = ⅓Bh</code>. Sphere: <code>V = (4/3)πr³</code>. Surface area adds up the areas of all faces.</p>
        <p>Units matter: lengths are in cm, areas in cm², volumes in cm³. Always include them.</p>`,
        [G(() => { const r = rnd(2, 9); return { q: `A circle has radius ${r}. What is its area in terms of π? (write like 25π)`, accept: [`${r * r}π`, `${r * r}pi`, `${r * r} π`], explain: `A = πr² = ${r * r}π.` }; }),
         G(() => { const r = rnd(2, 9); return { q: `A circle has radius ${r}. What is its circumference in terms of π? (write like 10π)`, accept: [`${2 * r}π`, `${2 * r}pi`, `${2 * r} π`], explain: `C = 2πr = ${2 * r}π.` }; }),
         G(() => { const l = rnd(2, 8), w = rnd(2, 8), h = rnd(2, 8); return { q: `What is the volume of a rectangular box ${l} by ${w} by ${h}?`, accept: [String(l * w * h)], explain: `${l} × ${w} × ${h}.` }; }),
         MC('A cone and a cylinder have the same base and height. The cone\'s volume is…', ['One third of the cylinder\'s', 'Half of the cylinder\'s', 'Equal to it', 'Twice it'], 0, 'V = ⅓Bh for a cone, Bh for a cylinder.'),
         MC('Area of a triangle with base 10 and height 6?', ['30', '60', '16', '15'], 0, '½ × 10 × 6 = 30.')],
        [['Circle area and circumference', 'A = πr², C = 2πr.'], ['Volume of a cone', '⅓ × base area × height.'], ['Volume of a sphere', '(4/3)πr³']],
        { minutes: 14, q: 'circles area volume surface area formulas', res: ['khan', 'youtube', 'openstax', 'quizlet'] }),
    ]),
  ],
});

course({
  id: 'hs-chemistry', title: 'Chemistry', color: '#a855f7', subject: 'Science', band: '9-12', level: 'High school',
  tags: ['chemistry', 'science', 'moles', 'stoichiometry', 'gas laws', 'acids', 'bases', 'ph', 'periodic table', 'reactions', 'chem'],
  blurb: 'The mole, balancing and stoichiometry, gas laws, and acids and bases.',
  channels: [{ name: 'Crash Course Chemistry', url: 'https://www.youtube.com/@crashcourse' }, { name: 'The Organic Chemistry Tutor', url: 'https://www.youtube.com/@TheOrganicChemistryTutor' }, { name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' }],
  units: [
    U('Quantities in chemistry', [
      L('moles', 'The mole and molar mass', `<p>Atoms are far too small to count one at a time, so chemists count in a unit called the <b>mole</b>: <code>1 mol = 6.022 × 10²³</code> particles (<b>Avogadro's number</b>). A mole of any substance has a mass in grams equal to its <b>molar mass</b>, found by adding the atomic masses (from the periodic table) of every atom in the formula.</p>
        <p><b>Example: water, H₂O.</b> 2 × 1.008 (H) + 16.00 (O) = 18.02 g/mol. So 36.04 g of water is 36.04 / 18.02 = <b>2.00 mol</b>.</p>
        <p>The core conversions: <code>moles = mass ÷ molar mass</code>, and <code>particles = moles × 6.022 × 10²³</code>. Dimensional analysis (multiplying by conversion factors so units cancel) keeps the arithmetic organized.</p>
        <p><b>Common mistakes:</b> forgetting subscripts (CO₂ has <i>two</i> oxygens), or dividing when you should multiply. Check that your units cancel to the unit you want.</p>`,
        [G(() => { const n = rnd(2, 6); return { q: `Molar mass of carbon is 12 g/mol. How many grams are in ${n} mol of carbon?`, accept: [String(12 * n)], explain: `${n} × 12 = ${12 * n} g.` }; }),
         G(() => { const n = rnd(2, 5); return { q: `The molar mass of CO₂ is 44 g/mol. How many moles are in ${44 * n} g of CO₂?`, accept: [String(n)], explain: `${44 * n} ÷ 44 = ${n} mol.` }; }),
         T('What is the molar mass of water (H₂O) to the nearest whole number, in g/mol?', ['18'], '2(1) + 16 = 18.', 'Two hydrogens and one oxygen.'),
         MC('One mole contains…', ['6.022 × 10²³ particles', '6.022 × 10²³ grams', '1 gram of particles', '100 particles'], 0, "That is Avogadro's number."),
         MC('To convert grams to moles you…', ['Divide by the molar mass', 'Multiply by the molar mass', 'Divide by 6.022 × 10²³', 'Add the atomic numbers'], 0, 'moles = mass ÷ molar mass.')],
        [['Avogadro\'s number', '6.022 × 10²³ particles per mole.'], ['Molar mass', 'The mass of one mole of a substance (g/mol), the sum of its atomic masses.'], ['Grams to moles', 'moles = mass ÷ molar mass.']],
        { minutes: 14, q: 'the mole molar mass avogadro chemistry', res: ['khan', 'youtube', 'openstax', 'libretexts'] }),
      L('stoich', 'Balancing equations and stoichiometry', `<p>A <b>balanced chemical equation</b> has the same number of each kind of atom on both sides, because atoms are never created or destroyed. Balance by changing <b>coefficients</b> (the big numbers in front), never the <b>subscripts</b>.</p>
        <p>Example: <code>H₂ + O₂ → H₂O</code> is unbalanced. Balanced: <code>2H₂ + O₂ → 2H₂O</code> (4 H and 2 O on each side).</p>
        <p><b>Stoichiometry</b> uses the coefficients as <b>mole ratios</b>. In 2H₂ + O₂ → 2H₂O, 2 mol H₂ makes 2 mol H₂O, and 1 mol O₂ needs 2 mol H₂. To go from grams of A to grams of B: grams A → moles A (÷ molar mass) → moles B (× mole ratio) → grams B (× molar mass).</p>
        <p>The <b>limiting reactant</b> is the one that runs out first and caps the amount of product. <b>Percent yield</b> = actual ÷ theoretical × 100.</p>`,
        [G(() => { const n = rnd(2, 8); return { q: `In 2H₂ + O₂ → 2H₂O, how many moles of H₂O form from ${n} mol of O₂?`, accept: [String(2 * n)], explain: 'The mole ratio O₂ : H₂O is 1 : 2.' }; }),
         G(() => { const n = rnd(2, 9); return { q: `In N₂ + 3H₂ → 2NH₃, how many moles of H₂ are needed to react completely with ${n} mol of N₂?`, accept: [String(3 * n)], explain: 'The ratio N₂ : H₂ is 1 : 3.' }; }),
         MC('Which is the balanced form of Na + Cl₂ → NaCl?', ['2Na + Cl₂ → 2NaCl', 'Na + Cl₂ → NaCl₂', 'Na + Cl → NaCl', '2Na + 2Cl₂ → 2NaCl'], 0, '2 Na and 2 Cl on each side.'),
         MC('When balancing an equation you may change…', ['Coefficients only', 'Subscripts only', 'Both', 'Neither'], 0, 'Changing subscripts changes the substance.'),
         MC('The limiting reactant is the one that…', ['Is used up first', 'Is present in the greatest mass', 'Has the largest coefficient', 'Is a gas'], 0, 'It determines how much product can form.')],
        [['Balancing', 'Adjust coefficients so each element has the same atom count on both sides.'], ['Mole ratio', 'The ratio of coefficients in a balanced equation.'], ['Percent yield', 'actual yield ÷ theoretical yield × 100']],
        { minutes: 16, q: 'balancing chemical equations stoichiometry limiting reactant', res: ['khan', 'youtube', 'openstax', 'libretexts'] }),
    ]),
    U('Gases, acids and bases', [
      L('gases', 'The gas laws', `<p>Gas behavior depends on four variables: <b>pressure</b> (P), <b>volume</b> (V), <b>temperature</b> (T, always in <b>kelvin</b>: K = °C + 273) and amount (n, moles).</p>
        <p><b>Boyle's law</b>: at constant T, <code>P₁V₁ = P₂V₂</code> (squeeze a gas into half the volume and the pressure doubles). <b>Charles's law</b>: at constant P, <code>V₁/T₁ = V₂/T₂</code>. <b>Gay-Lussac's law</b>: at constant V, <code>P₁/T₁ = P₂/T₂</code>. Together they give the <b>combined gas law</b>.</p>
        <p>The <b>ideal gas law</b> ties it all together: <code>PV = nRT</code>, with R = 0.0821 L·atm/(mol·K). At <b>STP</b> (0 °C, 1 atm) one mole of an ideal gas occupies 22.4 L.</p>
        <p>Gases behave most ideally at high temperature and low pressure.</p>`,
        [G(() => { const p1 = rnd(1, 4), v1 = rnd(4, 12) * 2; return { q: `A gas at ${p1} atm occupies ${v1} L. The volume is cut in half at constant temperature. What is the new pressure in atm?`, accept: [String(p1 * 2)], explain: 'P₁V₁ = P₂V₂, so halving V doubles P.' }; }),
         G(() => { const t = rnd(20, 90); return { q: `Convert ${t} °C to kelvin.`, accept: [String(t + 273)], explain: `K = °C + 273 = ${t + 273}.` }; }),
         G(() => { const n = rnd(1, 5); return { q: `What volume in liters do ${n} mol of an ideal gas occupy at STP? (use 22.4 L/mol; round to the nearest tenth)`, accept: [(n * 22.4).toFixed(1)], explain: `${n} × 22.4 = ${(n * 22.4).toFixed(1)} L.` }; }),
         MC('Temperatures in gas law calculations must be in…', ['Kelvin', 'Celsius', 'Fahrenheit', 'Any unit'], 0, 'Kelvin starts at absolute zero, so ratios work.'),
         MC('At constant temperature, if the volume of a gas increases, its pressure…', ['Decreases', 'Increases', 'Stays the same', 'Becomes zero'], 0, "Boyle's law: P and V are inversely related.")],
        [["Boyle's law", 'P₁V₁ = P₂V₂ at constant temperature.'], ['Ideal gas law', 'PV = nRT'], ['STP molar volume', '22.4 L per mole at 0 °C and 1 atm.']],
        { minutes: 15, q: 'gas laws boyle charles ideal gas law', res: ['khan', 'youtube', 'openstax', 'libretexts'] }),
      L('acids', 'Acids, bases and pH', `<p>By the <b>Brønsted–Lowry</b> definition, an <b>acid</b> donates a proton (H⁺) and a <b>base</b> accepts one. In water, acids raise the concentration of <b>hydronium</b> ions (H₃O⁺, often written H⁺) and bases raise the concentration of <b>hydroxide</b> ions (OH⁻).</p>
        <p><b>pH</b> measures acidity on a logarithmic scale: <code>pH = −log[H⁺]</code>. pH 7 is neutral, below 7 is acidic, above 7 is basic. Because the scale is logarithmic, each whole pH unit is a <b>tenfold</b> change in [H⁺]: pH 3 is ten times more acidic than pH 4. Also <code>pH + pOH = 14</code> at 25 °C.</p>
        <p><b>Strong</b> acids (HCl, HNO₃, H₂SO₄) ionize completely; <b>weak</b> acids (acetic acid) only partially. A <b>neutralization</b> reaction combines an acid and a base to form a salt and water: <code>HCl + NaOH → NaCl + H₂O</code>. In a <b>titration</b>, the equivalence point is where moles of acid equal moles of base (for 1:1 reactions).</p>`,
        [G(() => { const e = rnd(1, 12); return { q: `A solution has [H⁺] = 1 × 10⁻${e} M. What is its pH?`, accept: [String(e)], explain: `pH = −log(10⁻${e}) = ${e}.` }; }),
         G(() => { const p = rnd(1, 13); return { q: `A solution has pH ${p}. What is its pOH?`, accept: [String(14 - p)], explain: `pH + pOH = 14, so pOH = ${14 - p}.` }; }),
         MC('A solution with pH 2 compared with pH 4 has how much more H⁺?', ['100 times', '2 times', '10 times', '4 times'], 0, 'Two pH units is 10² = 100-fold.'),
         MC('Which is a strong acid?', ['HCl', 'CH₃COOH', 'NH₃', 'NaOH'], 0, 'HCl ionizes completely in water.'),
         MC('The products of an acid-base neutralization are typically…', ['A salt and water', 'Two gases', 'A metal and an acid', 'Only water'], 0, 'For example HCl + NaOH → NaCl + H₂O.')],
        [['pH formula', 'pH = −log[H⁺]'], ['pH scale', 'Below 7 acidic, 7 neutral, above 7 basic.'], ['Neutralization', 'Acid + base → salt + water.']],
        { minutes: 15, q: 'acids bases ph scale neutralization titration', res: ['khan', 'youtube', 'openstax', 'libretexts'] }),
    ]),
  ],
});

course({
  id: 'col-calculus1', title: 'Calculus I', color: '#ef4444', subject: 'Math', band: 'College', level: 'Intro college',
  tags: ['calculus', 'math', 'derivatives', 'limits', 'integrals', 'differentiation', 'calc', 'chain rule', 'optimization', 'college math'],
  blurb: 'Limits, derivatives and their applications, and an introduction to integrals.',
  channels: [{ name: '3Blue1Brown: Essence of Calculus', url: 'https://www.youtube.com/@3blue1brown' }, { name: 'Professor Leonard', url: 'https://www.youtube.com/@ProfessorLeonard' }, { name: 'MIT OpenCourseWare', url: 'https://www.youtube.com/@mitocw' }],
  units: [
    U('Limits', [
      L('limits', 'Limits and continuity', `<p>The <b>limit</b> <code>lim<sub>x→a</sub> f(x) = L</code> says that f(x) gets arbitrarily close to L as x gets arbitrarily close to <i>a</i> (from either side), whether or not f(a) is defined or equals L. A limit exists only if the left-hand and right-hand limits agree.</p>
        <p><b>Limit laws</b> let you take limits of sums, differences, products and quotients (denominator limit ≠ 0) piece by piece. For polynomials, just substitute: lim<sub>x→2</sub> (x² + 3x) = 4 + 6 = 10.</p>
        <p><b>Indeterminate form 0/0.</b> If substitution gives 0/0, simplify first. Example: <code>(x² − 9)/(x − 3)</code> as x→3: factor to <code>(x − 3)(x + 3)/(x − 3) = x + 3</code>, so the limit is 6. Other tools: rationalize a square root, or use the special limit <code>lim sin x / x = 1</code>.</p>
        <p>A function is <b>continuous</b> at <i>a</i> if f(a) is defined, the limit exists, and the limit equals f(a). Discontinuities can be <b>removable</b> (a hole), <b>jump</b>, or <b>infinite</b> (vertical asymptote). Limits at infinity describe end behavior: lim<sub>x→∞</sub> 1/x = 0.</p>`,
        [G(() => { const a = rnd(2, 8); return { q: `Find lim x→${a} of (x² − ${a * a})/(x − ${a}).`, accept: [String(2 * a)], explain: `Factor: (x − ${a})(x + ${a})/(x − ${a}) = x + ${a} → ${2 * a}.` }; }),
         G(() => { const a = rnd(1, 4), b = rnd(1, 9), c = rnd(1, 5); return { q: `Find lim x→${c} of (${a}x + ${b}).`, accept: [String(a * c + b)], explain: `Substitute x = ${c}: ${a * c + b}.` }; }),
         MC('If substituting x = a gives 0/0, the limit…', ['Might still exist; simplify and try again', 'Is 0', 'Does not exist', 'Is 1'], 0, '0/0 is indeterminate, not a conclusion.'),
         MC('A function is continuous at a when…', ['f(a) exists, the limit exists, and they are equal', 'f(a) exists', 'The limit exists', 'It has no holes in the graph near a only'], 0, 'All three conditions are required.'),
         T('lim x→0 of sin(x)/x = ?', ['1'], 'This is a standard special limit.', 'A famous special limit; the answer is not 0.')],
        [['Definition of a limit', 'f(x) approaches L as x approaches a, from both sides.'], ['0/0 indeterminate form', 'Simplify (factor, rationalize) before taking the limit.'], ['Continuity at a point', 'f(a) defined, lim exists, and lim = f(a).']],
        { minutes: 18, q: 'limits and continuity calculus', res: ['ocw', 'khan', 'youtube', 'libretexts'] }),
    ]),
    U('Derivatives', [
      L('derivative', 'The derivative and the power rule', `<p>The <b>derivative</b> measures instantaneous rate of change and the slope of the tangent line. It is defined as a limit: <code>f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] / h</code>. Notations: f′(x), dy/dx, d/dx[f].</p>
        <p>From the definition you can derive shortcut rules: <b>constant</b> <code>d/dx[c] = 0</code>; <b>power rule</b> <code>d/dx[xⁿ] = n·xⁿ⁻¹</code>; <b>constant multiple</b> <code>d/dx[c·f] = c·f′</code>; <b>sum/difference</b> rules apply term by term. Also <code>d/dx[eˣ] = eˣ</code>, <code>d/dx[ln x] = 1/x</code>, <code>d/dx[sin x] = cos x</code>, <code>d/dx[cos x] = −sin x</code>.</p>
        <p><b>Example.</b> f(x) = 4x³ − 5x² + 7x − 2. Then f′(x) = 12x² − 10x + 7. The slope at x = 1 is 12 − 10 + 7 = 9, and since f(1) = 4 − 5 + 7 − 2 = 4, the tangent line there is y − 4 = 9(x − 1).</p>
        <p>Interpretation: if s(t) is position, s′(t) is velocity and s″(t) is acceleration.</p>`,
        [G(() => { const a = rnd(2, 9), n = rnd(2, 6); return { q: `Differentiate f(x) = ${a}x^${n}. What is f′(x)? (write like 12x^3)`, accept: [`${a * n}x^${n - 1}`, n === 2 ? `${a * n}x` : `${a * n}x^${n - 1}`], explain: `Power rule: ${a}·${n} = ${a * n}, exponent ${n - 1}.` }; }),
         G(() => { const a = rnd(2, 7), b = rnd(1, 9), x = rnd(1, 4); return { q: `If f(x) = ${a}x² + ${b}x, what is f′(${x})?`, accept: [String(2 * a * x + b)], explain: `f′(x) = ${2 * a}x + ${b}; at x = ${x} it is ${2 * a * x + b}.` }; }),
         MC('d/dx of a constant is…', ['0', '1', 'The constant', 'Undefined'], 0, 'Constants do not change.'),
         MC('The derivative at a point gives…', ['The slope of the tangent line', 'The area under the curve', 'The y-intercept', 'The average value'], 0, 'It is the instantaneous rate of change.'),
         T('d/dx of e^x = ?', ['e^x', 'e^x.', 'ex'], 'e^x is its own derivative.', 'The exponential function is special.')],
        [['Power rule', 'd/dx[xⁿ] = n·xⁿ⁻¹'], ['Limit definition of the derivative', "f′(x) = lim h→0 [f(x+h) − f(x)] / h"], ['Derivative of position', 'Velocity; the second derivative is acceleration.']],
        { minutes: 18, q: 'derivative definition power rule calculus', res: ['ocw', 'khan', 'youtube', 'libretexts'] }),
      L('rules', 'Product, quotient and chain rules', `<p><b>Product rule</b>: <code>(fg)′ = f′g + fg′</code>. Example: d/dx[x²·sin x] = 2x sin x + x² cos x.</p>
        <p><b>Quotient rule</b>: <code>(f/g)′ = (f′g − fg′) / g²</code>. Remember "low d-high minus high d-low over low squared."</p>
        <p><b>Chain rule</b> (for composite functions): <code>d/dx[f(g(x))] = f′(g(x)) · g′(x)</code>: differentiate the outside function (leaving the inside alone), then multiply by the derivative of the inside. Example: d/dx[(3x + 1)⁵] = 5(3x + 1)⁴ · 3 = 15(3x + 1)⁴. Example: d/dx[sin(x²)] = cos(x²) · 2x.</p>
        <p><b>Strategy:</b> identify the outermost operation first. A function like <code>x²·e^(3x)</code> is a product (product rule) whose second factor needs the chain rule. Most errors come from forgetting the inner derivative.</p>`,
        [G(() => { const a = rnd(2, 5), b = rnd(1, 6), n = rnd(2, 4); return { q: `Differentiate f(x) = (${a}x + ${b})^${n}. What is f′(0)? `, accept: [String(n * a * Math.pow(b, n - 1))], explain: `f′(x) = ${n}(${a}x + ${b})^${n - 1}·${a}. At x = 0: ${n}·${b}^${n - 1}·${a}.` }; }),
         G(() => { const a = rnd(2, 6); return { q: `If f(x) = x·e^x, what is f′(0)? (product rule)`, accept: ['1'], explain: "f′ = e^x + x e^x; at 0 it's 1." }; }),
         MC('The chain rule says d/dx f(g(x)) =', ["f′(g(x)) · g′(x)", "f′(x) · g′(x)", "f′(g′(x))", "f(g′(x))"], 0, 'Outside derivative at the inside, times the inside derivative.'),
         MC('Which rule applies first to (x² + 1) / sin x?', ['Quotient rule', 'Chain rule only', 'Power rule only', 'Product rule only'], 0, 'It is a ratio of two functions.'),
         T('d/dx[sin(2x)] = 2·cos(?). Fill in the "?"', ['2x'], 'Chain rule: cos(2x)·2.', 'It is the same inside as the original.')],
        [['Product rule', "(fg)′ = f′g + fg′"], ['Quotient rule', "(f/g)′ = (f′g − fg′) / g²"], ['Chain rule', 'Derivative of the outside at the inside, times the derivative of the inside.']],
        { minutes: 20, q: 'product rule quotient rule chain rule', res: ['ocw', 'khan', 'youtube', 'libretexts'] }),
    ]),
    U('Applications and integrals', [
      L('optimization', 'Critical points and optimization', `<p>The <b>first derivative</b> tells you where a function increases (f′ &gt; 0) or decreases (f′ &lt; 0). A <b>critical point</b> occurs where f′(x) = 0 or f′ is undefined. At a critical point, the <b>first derivative test</b> says: if f′ changes from + to −, it's a local maximum; from − to +, a local minimum. The <b>second derivative test</b>: if f″ &gt; 0 it's a local min (concave up); if f″ &lt; 0, a local max (concave down).</p>
        <p><b>Optimization steps</b>: (1) draw and define variables, (2) write the quantity to optimize, (3) use a constraint to reduce it to one variable, (4) find critical points, (5) check endpoints or the second derivative, (6) answer the question with units.</p>
        <p><b>Example.</b> A farmer has 100 m of fence for a rectangle. Maximize area. Let width x, length 50 − x, so A = x(50 − x) = 50x − x². A′ = 50 − 2x = 0 gives x = 25. A″ = −2 &lt; 0 confirms a maximum: a 25 × 25 square with area 625 m².</p>`,
        [G(() => { const a = rnd(1, 6), b = 2 * a * rnd(1, 5); return { q: `Find the x-value of the minimum of f(x) = ${a}x² − ${b}x + 3.`, accept: [String(b / (2 * a))], explain: `f′ = ${2 * a}x − ${b} = 0 → x = ${b / (2 * a)}.` }; }),
         G(() => { const p = 2 * rnd(10, 40); return { q: `A rectangle has perimeter ${p}. What is the largest possible area?`, accept: [String((p / 4) * (p / 4))], explain: `The best rectangle is a square with side ${p / 4}.` }; }),
         MC('If f″(c) < 0 at a critical point c, then f has a…', ['Local maximum', 'Local minimum', 'Inflection point', 'Nothing can be concluded'], 0, 'Concave down at a critical point is a peak.'),
         MC('Critical points occur where f′ is…', ['Zero or undefined', 'Positive', 'Negative', 'Equal to f'], 0, 'Those are the only places the slope can change sign.'),
         MC('Which is the first step in an optimization problem?', ['Draw a picture and define variables', 'Take the derivative', 'Plug in numbers', 'Find f″'], 0, 'Set up the model before calculus.')],
        [['Critical point', 'A point where f′ = 0 or f′ is undefined.'], ['Second derivative test', 'f″ > 0 → local min; f″ < 0 → local max.'], ['Optimization recipe', 'Define variables, build a one-variable function, find critical points, verify, answer with units.']],
        { minutes: 20, q: 'critical points optimization first derivative test', res: ['ocw', 'khan', 'youtube', 'libretexts'] }),
      L('integrals', 'Integrals and the Fundamental Theorem', `<p>The <b>definite integral</b> <code>∫<sub>a</sub><sup>b</sup> f(x) dx</code> gives the <b>net signed area</b> between f and the x-axis from a to b. It is defined as the limit of <b>Riemann sums</b>: split [a, b] into n thin rectangles, add up f(xᵢ)·Δx, and let n → ∞.</p>
        <p>An <b>antiderivative</b> of f is a function F with F′ = f. The <b>indefinite integral</b> is the family of all antiderivatives: <code>∫ f(x) dx = F(x) + C</code>. Key rules: <code>∫ xⁿ dx = xⁿ⁺¹/(n+1) + C</code> (n ≠ −1), <code>∫ eˣ dx = eˣ + C</code>, <code>∫ 1/x dx = ln|x| + C</code>, <code>∫ cos x dx = sin x + C</code>.</p>
        <p>The <b>Fundamental Theorem of Calculus</b> connects the two big ideas: <code>∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)</code>, where F is any antiderivative of f. And <code>d/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x)</code>: differentiation and integration undo each other.</p>
        <p><b>Example.</b> ∫<sub>1</sub><sup>3</sup> 2x dx = [x²]<sub>1</sub><sup>3</sup> = 9 − 1 = 8.</p>`,
        [G(() => { const a = rnd(2, 5), b = rnd(1, 3); return { q: `Evaluate the integral from ${b} to ${b + a} of 2x dx.`, accept: [String((b + a) ** 2 - b ** 2)], explain: `[x²] from ${b} to ${b + a} = ${(b + a) ** 2} − ${b ** 2}.` }; }),
         G(() => { const n = rnd(1, 4); return { q: `Evaluate the integral from 0 to 2 of ${n + 1}x^${n} dx.`, accept: [String(2 ** (n + 1))], explain: `Antiderivative x^${n + 1}; at 2 it is ${2 ** (n + 1)}.` }; }),
         MC('The Fundamental Theorem of Calculus says ∫ₐᵇ f(x)dx equals…', ['F(b) − F(a) for an antiderivative F', 'f(b) − f(a)', 'F(a) − F(b)', 'f′(b)'], 0, 'Evaluate the antiderivative at the endpoints.'),
         MC('What does "+ C" represent in an indefinite integral?', ['An arbitrary constant: the family of antiderivatives', 'The coefficient', 'The curve', 'The limit'], 0, 'Derivatives of constants vanish, so antiderivatives are only defined up to a constant.'),
         MC('A definite integral gives…', ['Net signed area', 'The slope', 'The maximum value', 'The antiderivative function'], 0, 'Area above the axis counts positive, below negative.')],
        [['Fundamental Theorem of Calculus', '∫ₐᵇ f dx = F(b) − F(a) where F′ = f.'], ['∫ xⁿ dx', 'xⁿ⁺¹/(n+1) + C, for n ≠ −1.'], ['Riemann sum', 'A sum of rectangle areas that approximates an integral.']],
        { minutes: 20, q: 'definite integral fundamental theorem of calculus antiderivative', res: ['ocw', 'khan', 'youtube', 'libretexts'] }),
    ]),
  ],
});
