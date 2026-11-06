// more hand-written deep dives, keyed by courseId/lessonId
const R_ = (resource, note) => ({ resource, note });
window.DEEP = Object.assign(window.DEEP || {}, {
  'hand-ap-calc-ab/deriv': {
    sections: [
      { heading: 'What a derivative measures', paragraphs: ['The derivative is the slope of the tangent line and the instantaneous rate of change. To see why, take the slope of a secant line through (a, f(a)) and (a + h, f(a + h)); as h shrinks, the secant rotates toward the tangent. That limit, **f′(a) = lim h→0 [f(a + h) − f(a)]/h**, is the derivative. On the exam, the units of f′ are always "units of f per unit of x": if f is dollars and x is days, f′ is dollars per day.'] },
      { heading: 'The rules and why they work', paragraphs: ['The power rule d/dx xⁿ = nxⁿ⁻¹ comes from expanding (x + h)ⁿ and noticing that every term after the first two vanishes in the limit. The product rule, (fg)′ = f′g + fg′, says the rate of change of a product has two sources: f changing while g is held, and g changing while f is held. The chain rule handles composition by multiplying rates: if y changes 3 times as fast as u, and u changes 2 times as fast as x, then y changes 6 times as fast as x.', 'Memorize the transcendental derivatives (sin, cos, tan, eˣ, ln x, aˣ, arcsin, arctan). The exam gives no formula sheet, and most points on derivative questions come from applying these correctly rather than from clever ideas.'] },
      { heading: 'Differentiability and what breaks it', paragraphs: ['If f is differentiable at a, it is continuous at a, but the reverse fails. A function is not differentiable at a corner (|x| at 0, because the one-sided slopes differ), a cusp, a vertical tangent, or a discontinuity. For piecewise functions, matching values gives continuity; matching one-sided derivatives as well gives differentiability. A frequent free-response task is to choose constants so both hold, which gives you two equations.'] },
    ],
    examples: [
      { problem: 'Find the equation of the tangent line to f(x) = x² sin x at x = π.', steps: ['f′(x) = 2x sin x + x² cos x by the product rule.', 'f(π) = π² · 0 = 0 and f′(π) = 2π · 0 + π² · (−1) = −π².', 'Point-slope form: y − 0 = −π²(x − π).'], answer: 'y = −π²(x − π)' },
      { problem: 'Choose a and b so that f(x) = x² for x ≤ 1 and ax + b for x > 1 is differentiable at x = 1.', steps: ['Continuity: 1 = a + b.', 'Derivative match: left derivative 2x = 2, right derivative a, so a = 2.', 'Then b = −1.'], answer: 'a = 2, b = −1' },
    ],
    mistakes: ['Applying the power rule to eˣ (it is its own derivative, not x·e^(x−1)).', 'Forgetting the inner derivative in the chain rule, for example d/dx sin(3x) = cos(3x), missing the factor 3.', 'Using the quotient rule with the numerator and denominator terms in the wrong order.', 'Claiming a continuous function is differentiable.'],
    tips: ['Write the rule you are using before applying it; graders can then award the method point even if arithmetic slips.', 'Include units whenever the problem describes a real quantity.'],
    reading: [R_('Khan Academy', 'AP Calculus AB, Unit 2: Differentiation fundamentals'), R_('OpenStax', 'Calculus Volume 1, Chapter 3: Derivatives')],
  },
  'hand-ap-calc-ab/implicit': {
    sections: [
      { heading: 'Implicit differentiation', paragraphs: ['Some relations, like x² + y² = 25, define y only implicitly. The key idea is that y is a function of x, so whenever you differentiate a y-term, the chain rule contributes a factor dy/dx. Differentiate both sides with respect to x, collect every dy/dx term on one side, factor it out, and solve. For x² + y² = 25 you get 2x + 2y·dy/dx = 0, so dy/dx = −x/y. Notice the answer may depend on both x and y; to find a slope you need a point on the curve.'] },
      { heading: 'Related rates, step by step', paragraphs: ['Related rates problems have a fixed procedure that the exam rewards. First draw and label the picture with variables for the quantities that change. Second, write an equation true at **all times** relating them (Pythagorean theorem, volume formula, similar triangles). Third, differentiate with respect to t. Only then substitute the instantaneous values. Substituting numbers before differentiating treats a changing quantity as a constant and is the most common mistake.', 'Interpret the sign: a negative dy/dt means y is decreasing. Always finish with units and a sentence in context, because the answer point depends on it.'] },
    ],
    examples: [
      { problem: 'A 13-ft ladder leans on a wall. The bottom slides away at 2 ft/s. How fast is the top sliding down when the bottom is 5 ft from the wall?', steps: ['x² + y² = 169, so when x = 5, y = 12.', 'Differentiate: 2x·dx/dt + 2y·dy/dt = 0.', 'Substitute: 2(5)(2) + 2(12)·dy/dt = 0, so dy/dt = −20/24 = −5/6.'], answer: 'The top slides down at 5/6 ft/s.' },
      { problem: 'Find the slope of x³ + y³ = 6xy at (3, 3).', steps: ['Differentiate: 3x² + 3y²·y′ = 6y + 6x·y′.', 'At (3, 3): 27 + 27y′ = 18 + 18y′.', 'So 9y′ = −9 and y′ = −1.'], answer: 'The slope is −1.' },
    ],
    mistakes: ['Dropping the dy/dx after differentiating a y-term.', 'Substituting the instantaneous values before differentiating in a related rates problem.', 'Using the product rule incorrectly on terms like xy (it needs both x′ and y′).', 'Forgetting to state the units and meaning of the rate.'],
    tips: ['Label every variable with units in your diagram; it prevents mismatched rates.', 'If a quantity is not changing (a fixed length), do not give it a variable.'],
    reading: [R_('Khan Academy', 'AP Calculus AB: implicit differentiation and related rates'), R_('OpenStax', 'Calculus Volume 1: implicit differentiation; related rates')],
  },
  'hand-ap-calc-ab/analysis': {
    sections: [
      { heading: 'Reading a function from its derivatives', paragraphs: ['The sign of f′ tells you where f increases or decreases, and the sign of f″ tells you the concavity. A **critical point** is where f′ = 0 or is undefined. A sign change of f′ from positive to negative marks a local maximum; negative to positive marks a local minimum. A sign change of f″ marks an inflection point. The second derivative test is a shortcut: at a critical point, f″ > 0 means a minimum and f″ < 0 a maximum, but it says nothing when f″ = 0.'] },
      { heading: 'Absolute extrema and the Mean Value Theorem', paragraphs: ['On a closed interval a continuous function always attains an absolute maximum and minimum (Extreme Value Theorem). Find them with the **candidates test**: evaluate f at the endpoints and at every critical point inside, then compare. The Mean Value Theorem guarantees a point where the instantaneous rate equals the average rate over the interval, but only if f is continuous on [a, b] and differentiable on (a, b). State those hypotheses.', 'Optimization problems combine these tools: model the quantity, use a constraint to reduce to one variable, find critical points, and verify with the candidates test or a derivative test before answering.'] },
    ],
    examples: [
      { problem: 'A farmer has 200 m of fence and wants a rectangular pen against a long barn wall (no fence needed on that side). Maximize the area.', steps: ['Let the two sides perpendicular to the barn be x and the side parallel be 200 − 2x.', 'A(x) = x(200 − 2x) = 200x − 2x², with 0 ≤ x ≤ 100.', 'A′(x) = 200 − 4x = 0 at x = 50; A″ = −4 < 0.', 'A(50) = 5000; endpoints give 0.'], answer: 'The maximum area is 5,000 m² with x = 50 m and the parallel side 100 m.' },
      { problem: 'f(x) = x³ − 3x on [−2, 2]. Find the absolute maximum and minimum.', steps: ['f′(x) = 3x² − 3 = 0 at x = ±1.', 'Candidates: f(−2) = −2, f(−1) = 2, f(1) = −2, f(2) = 2.'], answer: 'Absolute maximum 2 (at x = −1 and x = 2), absolute minimum −2 (at x = −2 and x = 1).' },
    ],
    mistakes: ['Justifying a local max with only f′(c) = 0, without a sign change.', 'Forgetting to test the endpoints for absolute extrema.', 'Applying the Mean Value Theorem without checking continuity and differentiability.', 'Confusing a critical point with an inflection point.'],
    tips: ['A sign chart for f′ (and f″) makes every justification quick.', 'Always answer the actual question: give the value of x and the maximum value if both are asked.'],
    reading: [R_('Khan Academy', 'AP Calculus AB, Unit 5: Analytical applications of differentiation'), R_('OpenStax', 'Calculus Volume 1, Chapter 4: Applications of derivatives')],
  },
  'hand-ap-calc-ab/ftc': {
    sections: [
      { heading: 'Accumulation and the definite integral', paragraphs: ['A definite integral adds up infinitely many infinitesimal contributions. As a Riemann sum, Σ f(xᵢ)Δx, it approximates area under a curve (or, in context, the net change of a quantity whose rate is f). Left sums underestimate for increasing functions and overestimate for decreasing functions; right sums do the opposite; the trapezoid rule averages them and is often more accurate. Area above the x-axis counts positive and below counts negative, so the integral gives net signed area.'] },
      { heading: 'The Fundamental Theorem of Calculus', paragraphs: ['The two halves of the theorem link derivatives and integrals. **Part 1**: if F(x) = ∫ₐˣ f(t)dt then F′(x) = f(x), so accumulation functions can be differentiated directly, and if the upper limit is g(x) you multiply by g′(x). **Part 2**: ∫ₐᵇ f(x)dx = G(b) − G(a) for any antiderivative G of f, which lets you evaluate integrals without limits of sums.', 'In context, if r(t) is a rate, the amount at time b equals the amount at time a plus ∫ₐᵇ r(t)dt. Free-response questions will say exactly that and ask you to interpret the integral with units.'] },
      { heading: 'u-substitution', paragraphs: ['Substitution reverses the chain rule. Spot an inside function whose derivative (up to a constant) also appears: in ∫ 2x cos(x²) dx, let u = x², so du = 2x dx and the integral becomes ∫ cos u du = sin(x²) + C. With definite integrals, change the limits to u-values and never go back to x.'] },
    ],
    examples: [
      { problem: 'Evaluate ∫₀² x e^(x²) dx.', steps: ['Let u = x², du = 2x dx, so x dx = du/2.', 'Limits: x = 0 gives u = 0; x = 2 gives u = 4.', '∫₀⁴ (1/2)eᵘ du = (1/2)(e⁴ − 1).'], answer: '(e⁴ − 1)/2' },
      { problem: 'If G(x) = ∫₁^(x²) √(1 + t³) dt, find G′(2).', steps: ['Apply FTC Part 1 with the chain rule: G′(x) = √(1 + (x²)³) · 2x.', 'At x = 2: √(1 + 64) · 4 = 4√65.'], answer: '4√65' },
    ],
    mistakes: ['Forgetting the + C on indefinite integrals.', 'Changing variables but leaving the old limits in a definite integral.', 'Omitting the chain-rule factor g′(x) when the upper limit is a function.', 'Reporting area when the question asks for net change (or vice versa).'],
    tips: ['Write the integral setup before computing; setup points are separate from the answer point.', 'Check reasonableness: a positive integrand cannot give a negative integral.'],
    reading: [R_('Khan Academy', 'AP Calculus AB, Unit 6: Integration and accumulation of change'), R_('MIT OpenCourseWare', 'Single Variable Calculus: the Fundamental Theorem')],
  },
  'hand-ap-stats/describe': {
    sections: [
      { heading: 'Describing a distribution', paragraphs: ['Every description of a quantitative variable should address **shape, outliers, center and spread, in context**. Shape: symmetric, skewed left or right, unimodal or bimodal. For center and spread, use the mean and standard deviation for roughly symmetric data without outliers, and the median and IQR when the distribution is skewed or has outliers, since those are resistant to extreme values. The mean is pulled toward the tail, so a mean greater than the median hints at right skew.'] },
      { heading: 'Position, outliers and transformations', paragraphs: ['A **z-score** (value minus mean, divided by standard deviation) lets you compare values from different distributions. The 1.5 × IQR rule flags outliers: anything below Q1 − 1.5·IQR or above Q3 + 1.5·IQR. Adding a constant to every value shifts the center but leaves the spread unchanged; multiplying by a constant scales both the center and the spread by that constant (the spread by its absolute value).'] },
      { heading: 'The normal model', paragraphs: ['Many distributions are approximately normal: symmetric, bell-shaped, described entirely by the mean and standard deviation. The empirical rule gives roughly 68%, 95%, and 99.7% of values within 1, 2 and 3 standard deviations. For other areas, standardize and use a table or calculator (normalcdf, invNorm). Always sketch and shade the region first; it prevents most errors and earns communication points.'] },
    ],
    examples: [
      { problem: 'Test scores are approximately normal with mean 70 and standard deviation 8. What proportion of students score above 82?', steps: ['z = (82 − 70)/8 = 1.5.', 'Area above z = 1.5 is about 0.0668.'], answer: 'About 6.7% of students score above 82.' },
      { problem: 'Q1 = 20 and Q3 = 36. Is a value of 65 an outlier?', steps: ['IQR = 16, so the upper fence is 36 + 1.5(16) = 60.', '65 > 60.'], answer: 'Yes, 65 is an outlier by the 1.5 × IQR rule.' },
    ],
    mistakes: ['Describing only center and spread without mentioning shape and outliers.', 'Using the mean and standard deviation for clearly skewed data.', 'Forgetting context (say "the median commute time is 25 minutes", not just "the median is 25").', 'Confusing a percentile with a percent.'],
    tips: ['Use comparative language ("is higher than", "has more variability") when comparing two distributions.', 'Label axes and shade regions in normal calculations.'],
    reading: [R_('Khan Academy', 'AP Statistics, Unit 1: Exploring one-variable data'), R_('OpenStax', 'Introductory Statistics 2e: descriptive statistics and the normal distribution')],
  },
  'hand-ap-stats/probability': {
    sections: [
      { heading: 'Probability rules and conditioning', paragraphs: ['The addition rule is P(A or B) = P(A) + P(B) − P(A and B), and P(A and B) = P(A)·P(B | A). Events are independent when knowing one occurred does not change the probability of the other. Mutually exclusive events cannot both occur, and they are *not* independent (if one occurs, the other has probability zero). Two-way tables and tree diagrams make conditional probability concrete.'] },
      { heading: 'Random variables and the binomial model', paragraphs: ['The mean of a discrete random variable is E(X) = Σ x·P(x). Means add for sums of variables; variances add for sums of **independent** variables, so standard deviations do not simply add. A setting is **binomial** when there is a fixed number of trials n, each trial is a success or failure, trials are independent, and the probability of success p is constant; then μ = np and σ = √(np(1 − p)). A geometric setting counts trials until the first success.'] },
      { heading: 'Sampling distributions and the Central Limit Theorem', paragraphs: ['A sampling distribution describes how a statistic varies from sample to sample. For the sample proportion, the mean is p and the standard deviation is √(p(1 − p)/n); for the sample mean, the mean is μ and the standard deviation is σ/√n. The Central Limit Theorem says the distribution of x̄ is approximately normal for large samples regardless of the population shape. Larger samples reduce variability but do nothing about bias, which comes from bad sampling or measurement.'] },
    ],
    examples: [
      { problem: 'A basketball player makes 70% of free throws. Find the probability of exactly 2 makes in 3 independent attempts.', steps: ['Binomial with n = 3, p = 0.7.', 'P(X = 2) = C(3,2)(0.7)²(0.3) = 3(0.49)(0.3) = 0.441.'], answer: '0.441' },
      { problem: 'Population standard deviation is 12. Find the standard deviation of x̄ for n = 36.', steps: ['σ/√n = 12/6 = 2.'], answer: '2' },
    ],
    mistakes: ['Treating mutually exclusive as independent.', 'Adding standard deviations instead of variances.', 'Applying the binomial model when trials are not independent (sampling without replacement from a small population).', 'Claiming that a larger sample removes bias.'],
    tips: ['State the BINS checks before using binomial formulas.', 'Draw a tree or two-way table for any conditional probability.'],
    reading: [R_('Khan Academy', 'AP Statistics, Units 4 and 5: probability and sampling distributions'), R_('OpenStax', 'Introductory Statistics 2e: probability, discrete distributions and the Central Limit Theorem')],
  },
  'hand-ap-bio/membranes': {
    sections: [
      { heading: 'Structure explains function', paragraphs: ['The plasma membrane is a phospholipid bilayer with hydrophilic heads facing water and hydrophobic tails facing each other. Embedded proteins act as channels, carriers, receptors and enzymes; cholesterol buffers fluidity; carbohydrates on the outer surface support recognition. Small, nonpolar molecules such as O₂ and CO₂ cross freely, but ions and large polar molecules need transport proteins because the hydrophobic core repels them. Selective permeability follows directly from this structure.'] },
      { heading: 'Passive and active transport', paragraphs: ['**Passive transport** moves substances down their concentration gradient without energy: simple diffusion, facilitated diffusion through channels and carriers, and osmosis (the diffusion of water). **Active transport** moves substances against the gradient using ATP, as the Na⁺/K⁺ pump does, or uses an existing gradient, as in cotransport. Large particles move in vesicles by endocytosis and exocytosis.', 'Water moves from higher to lower **water potential**. In a hypotonic environment an animal cell gains water and may lyse, while a plant cell becomes turgid; in a hypertonic environment cells lose water and plant cells undergo plasmolysis.'] },
      { heading: 'Water potential and the math', paragraphs: ['Ψ = Ψs + Ψp. Pure water at atmospheric pressure has Ψ = 0; dissolved solute lowers Ψs by Ψs = −iCRT. A plant cell reaches equilibrium when its pressure potential offsets the solute potential. The surface-area-to-volume ratio limits cell size: as a cell grows its volume increases faster than its surface area, so exchange becomes inefficient. That is why cells are small and why organs such as intestines and lungs are folded.'] },
    ],
    examples: [
      { problem: 'A 0.3 M sucrose solution (i = 1) at 25 °C (298 K). Calculate Ψs with R = 0.0831 L·bar/(mol·K).', steps: ['Ψs = −iCRT = −(1)(0.3)(0.0831)(298).', '= −7.43 bar.'], answer: 'Ψs ≈ −7.4 bar' },
      { problem: 'A cell with Ψ = −0.5 MPa is placed in a solution with Ψ = −0.2 MPa. Which way does water move?', steps: ['Water moves toward lower (more negative) water potential.', 'The cell has the lower potential.'], answer: 'Water moves into the cell.' },
    ],
    mistakes: ['Saying water moves toward higher solute concentration without linking it to water potential.', 'Calling facilitated diffusion active transport.', 'Forgetting that solute potential is always zero or negative.', 'Confusing hypertonic with hypotonic (compare solute concentration outside to inside).'],
    tips: ['Draw the membrane and label the gradient when explaining transport.', 'In experiments with potatoes or dialysis tubing, predict mass changes using water potential.'],
    reading: [R_('Khan Academy', 'AP Biology, Unit 2: Cell structure and function'), R_('OpenStax', 'Biology 2e, Chapter 5: Structure and function of plasma membranes')],
  },
  'hand-ap-bio/energetics': {
    sections: [
      { heading: 'Enzymes', paragraphs: ['Enzymes lower activation energy by stabilizing the transition state, without changing the overall free-energy change of the reaction. The substrate binds the active site and the enzyme adjusts shape (induced fit). Rate depends on temperature, pH, enzyme concentration and substrate concentration; it plateaus when all enzyme molecules are saturated. Competitive inhibitors compete for the active site and are overcome by more substrate, while noncompetitive and allosteric inhibitors bind elsewhere and change the enzyme shape.'] },
      { heading: 'Cellular respiration', paragraphs: ['Respiration extracts energy from glucose in stages. **Glycolysis** (cytosol) splits glucose into two pyruvate, with a net gain of 2 ATP and 2 NADH. In the mitochondrion, pyruvate oxidation and the **Krebs cycle** (matrix) release CO₂ and load electron carriers. The **electron transport chain** (inner membrane) passes electrons down a series of carriers, pumping protons across the membrane; the resulting gradient drives **ATP synthase** (chemiosmosis), and oxygen is the final electron acceptor. Without oxygen, fermentation regenerates NAD⁺ so glycolysis can continue.'] },
      { heading: 'Photosynthesis', paragraphs: ['Light reactions in the thylakoid membranes split water, release O₂, build a proton gradient used by ATP synthase, and produce ATP and NADPH. The **Calvin cycle** in the stroma uses that ATP and NADPH to fix CO₂ with rubisco and build sugars. Photosynthesis and respiration are connected: the products of one are the reactants of the other. Both rely on chemiosmosis and electron transport.'] },
    ],
    examples: [
      { problem: 'Predict and explain the effect on the rate of an enzyme-catalyzed reaction of raising the temperature from 20 °C to 80 °C.', steps: ['At first, higher temperature increases collision frequency and rate.', 'Beyond the optimum, hydrogen and ionic bonds break and the active site changes shape (denaturation).'], answer: 'The rate rises to an optimum and then drops sharply as the enzyme denatures.' },
      { problem: 'Where in a mitochondrion does ATP synthase operate, and what powers it?', steps: ['It sits in the inner mitochondrial membrane.', 'Protons flow down their gradient from the intermembrane space into the matrix through it.'], answer: 'The proton gradient (chemiosmosis) powers it.' },
    ],
    mistakes: ['Saying enzymes are "used up" or that they supply energy.', 'Saying plants only photosynthesize and do not respire.', 'Claiming that O₂ released in photosynthesis comes from CO₂ (it comes from water).', 'Confusing where each stage occurs.'],
    tips: ['Use the terms "electron transport chain" and "proton gradient" in explanations; vague answers lose credit.', 'In experimental design, list controlled variables explicitly.'],
    reading: [R_('Khan Academy', 'AP Biology, Unit 3: Cellular energetics'), R_('OpenStax', 'Biology 2e: metabolism, cellular respiration and photosynthesis chapters')],
  },
  'hand-ap-bio/heredity': {
    sections: [
      { heading: 'Meiosis creates variation', paragraphs: ['Meiosis halves the chromosome number and produces four genetically distinct haploid cells. Variation comes from **crossing over** in prophase I, **independent assortment** of homologous pairs in metaphase I, and random fertilization. Nondisjunction, the failure of chromosomes to separate, produces aneuploidy such as trisomy 21. Mitosis, by contrast, produces two identical diploid cells.'] },
      { heading: 'Mendelian and non-Mendelian inheritance', paragraphs: ['Mendel\'s law of segregation says alleles separate in gamete formation; independent assortment says genes on different chromosomes sort independently. An Aa × Aa cross gives a 3:1 phenotype ratio and a 1:2:1 genotype ratio; a dihybrid cross gives 9:3:3:1. Non-Mendelian patterns include incomplete dominance (blended phenotype), codominance (both expressed), sex linkage (more males affected by recessive X-linked traits), polygenic traits, and linked genes that show fewer recombinants than predicted.', 'Use the multiplication rule for independent events: the probability of a specific genotype across two genes is the product of the individual probabilities.'] },
      { heading: 'Chi-square for genetics data', paragraphs: ['To test whether observed offspring counts fit an expected ratio, compute χ² = Σ(O − E)²/E and compare to a critical value with degrees of freedom equal to categories minus one. If χ² is less than the critical value at p = 0.05, you fail to reject the null hypothesis that the data fit the expected ratio. State this carefully: failing to reject does not prove the ratio is right.'] },
    ],
    examples: [
      { problem: 'In pea plants, round (R) is dominant over wrinkled (r). A heterozygous round plant is crossed with a wrinkled plant. Predict offspring ratios.', steps: ['Rr × rr gives gametes R, r and r, r.', 'Offspring: 1/2 Rr (round) and 1/2 rr (wrinkled).'], answer: '1:1 round to wrinkled' },
      { problem: 'Expected 3:1 in 80 offspring (60:20). Observed 52 dominant and 28 recessive. Compute χ² (df = 1, critical value 3.84).', steps: ['(52 − 60)²/60 + (28 − 20)²/20 = 1.07 + 3.2 = 4.27.', 'Compare 4.27 with 3.84.'], answer: 'χ² = 4.27 > 3.84, so reject the null: the data differ significantly from a 3:1 ratio.' },
    ],
    mistakes: ['Confusing crossing over with independent assortment.', 'Using the wrong degrees of freedom (use categories − 1).', 'Saying "accept the null" instead of "fail to reject".', 'Forgetting that X-linked recessive traits show up more often in males.'],
    tips: ['Always draw a Punnett square or branch diagram before giving ratios.', 'Define allele symbols at the start of every genetics answer.'],
    reading: [R_('Khan Academy', 'AP Biology, Unit 5: Heredity'), R_('OpenStax', 'Biology 2e: meiosis and sexual reproduction; Mendel\'s experiments')],
  },
  'hand-ap-chem/equilibrium': {
    sections: [
      { heading: 'What equilibrium is', paragraphs: ['At equilibrium the forward and reverse rates are equal, so concentrations stop changing, but they are generally not equal to each other and the reactions have not stopped. The equilibrium constant K = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ uses concentrations (or partial pressures) of gases and aqueous species and leaves out pure solids and liquids. K depends only on temperature. A large K favors products; a small K favors reactants.'] },
      { heading: 'Q, K and shifting', paragraphs: ['Compare the reaction quotient Q (same expression, current concentrations) with K. If Q < K the system shifts right; if Q > K it shifts left. **Le Chatelier** gives qualitative predictions: adding reactant shifts right, compressing a gas shifts toward fewer moles of gas, and raising the temperature shifts in the endothermic direction, which changes K. A catalyst speeds both directions equally and does not change K or the position of equilibrium.'] },
      { heading: 'ICE tables and Ksp', paragraphs: ['Set up Initial, Change, Equilibrium rows, use stoichiometry for the change (in terms of x), and substitute into K. When K is small compared with the initial concentration, assume x is negligible and check that it is under 5% of the starting value. For sparingly soluble salts, the solubility product Ksp is the product of ion concentrations; for CaF₂ with molar solubility s, Ksp = (s)(2s)² = 4s³. A common ion lowers solubility.'] },
    ],
    examples: [
      { problem: 'For N₂O₄ ⇌ 2NO₂, K = 0.20. At some moment [N₂O₄] = 0.50 M and [NO₂] = 0.40 M. Which way does the reaction proceed?', steps: ['Q = (0.40)²/0.50 = 0.32.', 'Q > K = 0.20.'], answer: 'Q exceeds K, so the reaction shifts left toward N₂O₄.' },
      { problem: 'The Ksp of AgCl is 1.8 × 10⁻¹⁰. Find the molar solubility in pure water.', steps: ['AgCl ⇌ Ag⁺ + Cl⁻ with both ions equal to s.', 'Ksp = s², so s = √(1.8 × 10⁻¹⁰) = 1.3 × 10⁻⁵ M.'], answer: '1.3 × 10⁻⁵ mol/L' },
    ],
    mistakes: ['Including solids or pure liquids in the K expression.', 'Thinking equilibrium means equal concentrations.', 'Claiming that a catalyst changes K.', 'Using the wrong exponent for coefficients in K or Ksp.'],
    tips: ['Write Q = K comparisons explicitly in justification questions.', 'State the stress and the direction of shift using Le Chatelier\'s principle.'],
    reading: [R_('Khan Academy', 'AP Chemistry, Unit 7: Equilibrium'), R_('OpenStax', 'Chemistry 2e, Chapter 13: Fundamental equilibrium concepts')],
  },
  'hand-ap-chem/thermo': {
    sections: [
      { heading: 'Heat, enthalpy and calorimetry', paragraphs: ['Heat transferred is q = mcΔT. In a calorimeter, heat lost by the reaction equals heat gained by the surroundings, so q_rxn = −q_surr. Enthalpy change ΔH is the heat at constant pressure; a negative value means exothermic. Hess\'s law lets you add reaction steps to find ΔH, flipping the sign when you reverse a step and scaling when you multiply. ΔH° = Σ ΔH°f(products) − Σ ΔH°f(reactants).'] },
      { heading: 'Entropy and spontaneity', paragraphs: ['Entropy measures how dispersed energy and matter are. It increases when gas is produced, when moles of gas increase, when a solid melts or dissolves, and when temperature rises. A reaction is thermodynamically favorable when **ΔG = ΔH − TΔS < 0** (T in kelvin). If ΔH is negative and ΔS positive, it is favorable at all temperatures; if ΔH is positive and ΔS negative, never; otherwise temperature decides.'] },
      { heading: 'Free energy and equilibrium', paragraphs: ['ΔG° = −RT ln K connects thermodynamics and equilibrium: negative ΔG° means K > 1. Favorable does not mean fast, because the activation energy controls the rate. Coupled reactions let an unfavorable reaction proceed when linked to a favorable one, as ATP hydrolysis drives many cellular reactions.'] },
    ],
    examples: [
      { problem: 'A reaction has ΔH = +40 kJ/mol and ΔS = +130 J/mol·K. Above what temperature is it spontaneous?', steps: ['ΔG = 0 when T = ΔH/ΔS = 40000/130 = 308 K.', 'For ΔH > 0 and ΔS > 0 the reaction is favorable at higher temperature.'], answer: 'It is spontaneous above about 308 K.' },
      { problem: '50.0 g of water absorbs 2,090 J. Find the temperature change (c = 4.18 J/g·°C).', steps: ['ΔT = q/(mc) = 2090/(50.0 × 4.18).'], answer: 'ΔT = 10.0 °C' },
    ],
    mistakes: ['Using Celsius in ΔG = ΔH − TΔS.', 'Mixing units (ΔH in kJ, ΔS in J).', 'Treating spontaneous as meaning fast.', 'Forgetting to flip the sign of ΔH when reversing a reaction in Hess\'s law.'],
    tips: ['Convert ΔS to kJ/mol·K before substituting.', 'Justify ΔS sign by comparing moles of gas or states of matter.'],
    reading: [R_('Khan Academy', 'AP Chemistry, Unit 6: Thermodynamics, and Unit 9'), R_('OpenStax', 'Chemistry 2e: thermochemistry; thermodynamics')],
  },
  'hand-ap-chem/acidbase': {
    sections: [
      { heading: 'pH and strength', paragraphs: ['pH = −log[H₃O⁺] and pH + pOH = 14 at 25 °C. Strong acids ionize completely, so [H⁺] equals the acid concentration; weak acids establish an equilibrium described by Ka, and for a weak acid HA a quick estimate is [H⁺] ≈ √(Ka·C). Conjugate pairs obey Ka × Kb = Kw. A stronger acid has a larger Ka and a smaller pKa. Strength is not concentration: a dilute strong acid and a concentrated weak acid can have the same pH.'] },
      { heading: 'Buffers', paragraphs: ['A buffer is a weak acid and its conjugate base in comparable amounts. Added acid reacts with the base component and added base reacts with the acid component, so pH barely changes. Use Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]). The best buffer has a pH near its pKa. Capacity depends on the amounts of both components.'] },
      { heading: 'Titrations', paragraphs: ['At the equivalence point moles of acid equal moles of base (for 1:1 reactions). For a strong acid and strong base the pH is 7; for a weak acid with a strong base it is above 7 because the conjugate base hydrolyzes. At the half-equivalence point of a weak acid, [HA] = [A⁻] and pH = pKa, which lets you read pKa from a titration curve. Pick an indicator whose color-change range includes the equivalence-point pH.'] },
    ],
    examples: [
      { problem: 'Find the pH of a buffer containing 0.20 M acetic acid (pKa = 4.74) and 0.10 M acetate.', steps: ['pH = 4.74 + log(0.10/0.20).', 'log(0.5) = −0.30.'], answer: 'pH = 4.44' },
      { problem: '25.0 mL of 0.100 M HCl is titrated with 0.100 M NaOH. What is the pH after 30.0 mL of NaOH?', steps: ['Moles OH⁻ excess = 0.100(0.0300) − 0.100(0.0250) = 5.0 × 10⁻⁴ mol.', 'Volume = 55.0 mL, so [OH⁻] = 9.1 × 10⁻³ M, pOH = 2.04.'], answer: 'pH = 11.96' },
    ],
    mistakes: ['Using the Henderson-Hasselbalch ratio inverted.', 'Confusing concentration with strength.', 'Assuming every equivalence point has pH 7.', 'Ignoring dilution when adding titrant.'],
    tips: ['Check whether the problem is a buffer, a strong-strong reaction, or an equivalence point before choosing a formula.', 'Show the mole table for titration questions.'],
    reading: [R_('Khan Academy', 'AP Chemistry, Unit 8: Acids and bases'), R_('OpenStax', 'Chemistry 2e, Chapters 14 and 15: Acid-base equilibria and equilibria of other reaction classes')],
  },
  'hand-ap-physics1/kin': {
    sections: [
      { heading: 'Describing motion', paragraphs: ['Position, velocity and acceleration are related: velocity is the rate of change of position and acceleration is the rate of change of velocity. Choose a coordinate direction and keep signs consistent. The slope of an x-t graph is velocity, the slope of a v-t graph is acceleration, and the area under a v-t graph is displacement. Distance and speed are scalars; displacement and velocity are vectors.'] },
      { heading: 'Constant acceleration', paragraphs: ['Four equations cover constant acceleration: v = v₀ + at, Δx = v₀t + ½at², v² = v₀² + 2aΔx, and Δx = ½(v₀ + v)t. Choose the equation that omits the unknown you do not need. In free fall near Earth, a = −g = −9.8 m/s² (often 10 on exams) regardless of whether the object moves up or down; at the top of a vertical throw the velocity is zero but the acceleration is still −g.'] },
      { heading: 'Projectiles', paragraphs: ['Projectile motion separates into independent horizontal and vertical parts. Horizontally the velocity is constant (no acceleration, ignoring air resistance); vertically the motion is free fall. Resolve the initial velocity into components: v₀ₓ = v₀cos θ and v₀ᵧ = v₀sin θ. Time of flight depends only on the vertical motion. The same time connects the two directions.'] },
    ],
    examples: [
      { problem: 'A ball is kicked at 20 m/s at 30° above horizontal from level ground (g = 10 m/s²). Find the range.', steps: ['v₀ₓ = 20 cos 30° ≈ 17.3 m/s; v₀ᵧ = 10 m/s.', 'Time of flight = 2v₀ᵧ/g = 2 s.', 'Range = 17.3 × 2.'], answer: '≈ 34.6 m' },
      { problem: 'A car accelerates from rest at 3 m/s² for 8 s. How far does it travel?', steps: ['Δx = ½at² = ½(3)(64).'], answer: '96 m' },
    ],
    mistakes: ['Using the constant-acceleration equations when acceleration is not constant.', 'Assuming a = 0 at the top of a projectile path.', 'Mixing the signs of g and v.', 'Treating horizontal and vertical motion as dependent.'],
    tips: ['Write a list of knowns and unknowns before choosing an equation.', 'Sketch the motion diagram and label the positive direction.'],
    reading: [R_('Khan Academy', 'AP Physics 1, Unit 1: Kinematics'), R_('OpenStax', 'College Physics for AP Courses: Kinematics')],
  },
  'hand-ap-physics1/dyn': {
    sections: [
      { heading: 'Free-body diagrams and Newton\'s laws', paragraphs: ['A free-body diagram shows only the forces **on** the chosen object: weight (down), normal force (perpendicular to the surface), tension, friction and applied forces. Newton\'s second law, ΣF = ma, applies to each axis separately. First law: with ΣF = 0 the velocity is constant (including zero). Third law: forces come in equal and opposite pairs acting on **different** objects, so they never cancel on a single object.'] },
      { heading: 'Friction, inclines and circular motion', paragraphs: ['Kinetic friction is f = μₖN; static friction adjusts up to μₛN. On an incline, tilt the axes: the component of weight along the slope is mg sin θ and perpendicular is mg cos θ, so N = mg cos θ. In uniform circular motion the net force points toward the center with magnitude mv²/r. "Centripetal force" is not a separate force; it is the net of tension, gravity, friction or the normal force.'] },
    ],
    examples: [
      { problem: 'A 5 kg block on a 30° frictionless incline. Find its acceleration (g = 10 m/s²).', steps: ['Along the slope: ma = mg sin 30°.', 'a = 10(0.5).'], answer: 'a = 5 m/s² down the slope' },
      { problem: 'A 2 kg mass swings in a horizontal circle of radius 0.5 m at 3 m/s. What is the net inward force?', steps: ['F = mv²/r = 2(9)/0.5.'], answer: '36 N toward the center' },
    ],
    mistakes: ['Including forces that the object exerts on others in its own free-body diagram.', 'Drawing a "centripetal force" in addition to the real forces.', 'Forgetting that normal force is not always equal to mg.', 'Using the wrong coefficient (static vs kinetic).'],
    tips: ['Label each force with the object applying it ("tension by rope").', 'Choose axes along the acceleration direction when possible.'],
    reading: [R_('Khan Academy', 'AP Physics 1, Unit 2: Force and translational dynamics'), R_('OpenStax', 'College Physics for AP Courses: Dynamics')],
  },
  'hand-ap-physics1/energy': {
    sections: [
      { heading: 'Work and kinetic energy', paragraphs: ['Work is W = Fd cos θ, where θ is the angle between the force and the displacement. A force perpendicular to the motion does no work, which is why the centripetal force never changes the speed of a circling object. The work-energy theorem says the net work equals the change in kinetic energy: W_net = ΔK = ½mv² − ½mv₀².'] },
      { heading: 'Conservation of energy', paragraphs: ['When only conservative forces act, mechanical energy K + U is constant. With friction or other non-conservative forces, K₁ + U₁ + W_nc = K₂ + U₂, where W_nc is the work done on the system by those forces (negative for friction). Gravitational potential energy is mgh and spring energy is ½kx². Energy methods ignore the path and time, which makes them ideal for roller coasters, pendulums and springs.', 'Power is the rate of doing work: P = W/t = Fv, in watts.'] },
    ],
    examples: [
      { problem: 'A 2 kg ball is released from rest at 5 m. Find its speed at the ground (g = 10 m/s², no friction).', steps: ['mgh = ½mv².', 'v = √(2gh) = √100.'], answer: '10 m/s' },
      { problem: 'A 1.5 kg block slides 2 m down a rough incline from height 1 m and reaches the bottom at 3 m/s. How much energy was lost to friction (g = 10 m/s²)?', steps: ['Initial energy = mgh = 15 J; final kinetic energy = ½(1.5)(9) = 6.75 J.', 'Energy lost = 15 − 6.75.'], answer: '8.25 J' },
    ],
    mistakes: ['Applying conservation of mechanical energy when friction acts.', 'Forgetting that work by friction is negative.', 'Using the wrong height (measure from the chosen zero level).', 'Confusing power and energy units.'],
    tips: ['Define the system and the zero of potential energy in your answer.', 'Use bar charts (energy diagrams) to organize multi-step problems.'],
    reading: [R_('Khan Academy', 'AP Physics 1, Unit 3: Work, energy and power'), R_('OpenStax', 'College Physics for AP Courses: Work, energy and power')],
  },
  'hand-ap-macro/adas': {
    sections: [
      { heading: 'The model', paragraphs: ['The aggregate demand curve slopes down because a higher price level reduces wealth, raises interest rates and makes domestic goods more expensive abroad. It shifts when consumption, investment, government spending or net exports change. Short-run aggregate supply slopes up because wages and some prices are sticky; it shifts with input costs, productivity and expectations. Long-run aggregate supply is vertical at potential output, determined by resources and technology.'] },
      { heading: 'Gaps and adjustment', paragraphs: ['If AD and SRAS cross to the left of LRAS, the economy has a **recessionary gap** with high unemployment; to the right, an **inflationary gap**. Without policy, a recessionary gap eventually closes as nominal wages fall and SRAS shifts right, returning output to potential at a lower price level. A negative supply shock moves SRAS left and causes stagflation, a difficult trade-off for policymakers.'] },
      { heading: 'Fiscal policy and multipliers', paragraphs: ['Expansionary fiscal policy (more spending or lower taxes) shifts AD right. The spending multiplier 1/(1 − MPC) shows that initial spending is re-spent in later rounds; the tax multiplier −MPC/(1 − MPC) is smaller in magnitude because part of a tax change is saved. Deficit spending can crowd out private investment by raising interest rates, and automatic stabilizers like unemployment insurance act without new legislation.'] },
    ],
    examples: [
      { problem: 'The MPC is 0.8 and the government increases spending by $50 billion. What is the maximum change in GDP?', steps: ['Multiplier = 1/(1 − 0.8) = 5.', 'ΔGDP = 5 × 50.'], answer: '$250 billion' },
      { problem: 'Explain the short-run effects of a decrease in consumer confidence on output, prices and unemployment.', steps: ['Consumption falls, so AD shifts left.', 'Real GDP and the price level fall; unemployment rises.'], answer: 'Output and the price level fall and unemployment rises.' },
    ],
    mistakes: ['Shifting the wrong curve (a change in consumption shifts AD, not SRAS).', 'Forgetting to label the axes and equilibrium points.', 'Using the spending multiplier for a tax change.', 'Saying inflation rises in a recession without the supply-side context.'],
    tips: ['Always draw and label the graph; it carries most free-response points.', 'State the direction of each shift and the resulting change in price and output.'],
    reading: [R_('Khan Academy', 'AP Macroeconomics, Unit 3: National income and price determination'), R_('OpenStax', 'Principles of Macroeconomics: aggregate demand and aggregate supply')],
  },
  'hand-ap-micro/sd': {
    sections: [
      { heading: 'Markets and equilibrium', paragraphs: ['The demand curve shows the quantity buyers will purchase at each price, and the supply curve shows the quantity sellers will produce. Equilibrium occurs where they intersect. Distinguish a movement **along** a curve (caused by a change in price) from a **shift** of the curve (caused by something else: income, tastes, input costs, technology, expectations, the number of firms). Draw both curves and the new equilibrium for any shock.'] },
      { heading: 'Elasticity and revenue', paragraphs: ['Price elasticity of demand is the percentage change in quantity divided by the percentage change in price. If |E| > 1 demand is elastic and a price increase reduces total revenue; if |E| < 1 it is inelastic and revenue rises. Determinants: available substitutes, whether the good is a necessity, the time horizon and its share of income. Cross-price and income elasticities have analogous interpretations: positive cross-price elasticity means substitutes, and positive income elasticity means a normal good.'] },
      { heading: 'Surplus and government intervention', paragraphs: ['Consumer surplus is the area between demand and price; producer surplus is the area between price and supply. A binding price ceiling creates a shortage and a binding price floor a surplus, and both create deadweight loss. A per-unit tax shifts supply up by the amount of the tax; the burden falls more on the side of the market that is less elastic.'] },
    ],
    examples: [
      { problem: 'Price rises from $10 to $12 and quantity demanded falls from 100 to 80. Find the price elasticity (percentage method, using the starting values).', steps: ['%ΔQ = −20%; %ΔP = +20%.', '|E| = 20/20 = 1, unit elastic.'], answer: 'Unit elastic: total revenue stays about the same.' },
      { problem: 'A tax is placed on a good with inelastic demand and elastic supply. Who bears more of the burden?', steps: ['The less elastic side (buyers) cannot easily avoid the tax.'], answer: 'Consumers bear most of the burden.' },
    ],
    mistakes: ['Confusing a change in quantity demanded with a change in demand.', 'Saying inelastic means "no response" (it means a less than proportional response).', 'Drawing a shift of the wrong curve for a given event.', 'Forgetting that a binding price control must be on the correct side of equilibrium.'],
    tips: ['List what shifts each curve before you draw.', 'Label the equilibrium before and after the shock.'],
    reading: [R_('Khan Academy', 'AP Microeconomics, Unit 2: Supply and demand'), R_('OpenStax', 'Principles of Microeconomics: demand and supply; elasticity')],
  },
  'hand-ap-ush/antebellum': {
    sections: [
      { heading: 'Expansion and the Market Revolution', paragraphs: ['After the Louisiana Purchase (1803) the nation expanded westward, and the **Market Revolution** (canals such as the Erie Canal, railroads, steamboats, the cotton gin and early factories) tied regions into a national economy. The North industrialized, the West supplied grain and settlers, and the South became a slave-based cotton empire, deepening sectional differences. **Jacksonian democracy** expanded suffrage for white men, while policies such as the Indian Removal Act (1830) and the Trail of Tears cost Native Americans their lands.'] },
      { heading: 'Reform and resistance', paragraphs: ['The Second Great Awakening inspired reform movements: temperance, education, women\'s rights (Seneca Falls, 1848), prison reform and abolitionism. Abolitionists ranged from Garrison\'s call for immediate emancipation to Douglass\'s powerful testimony; enslaved people resisted through everyday acts, escape (the Underground Railroad) and occasional revolt.'] },
      { heading: 'The road to war', paragraphs: ['Conflict centered on whether slavery would expand. The Missouri Compromise (1820), the Wilmot Proviso, the Compromise of 1850 (with its Fugitive Slave Act), the Kansas-Nebraska Act (1854), Bleeding Kansas, Dred Scott (1857) and John Brown\'s raid showed the failure of compromise. Lincoln\'s 1860 election led Southern states to secede. The war saw the Emancipation Proclamation (1863); Reconstruction followed with the 13th, 14th and 15th Amendments and then a violent backlash that ended with the Compromise of 1877.'] },
    ],
    examples: [
      { problem: 'Explain ONE way the Market Revolution contributed to sectional tensions.', steps: ['Identify the development: the North industrialized and built canals and railroads, while the South\'s economy deepened its reliance on cotton and enslaved labor.', 'Explain the link: the regions developed different economic interests, including over tariffs, internal improvements and the expansion of slavery.'], answer: 'Different economic systems created competing interests that surfaced in disputes over tariffs and slavery\'s expansion.' },
    ],
    mistakes: ['Writing that the Civil War had only one cause without discussing the role of slavery\'s expansion.', 'Confusing the Missouri Compromise, Compromise of 1850 and Kansas-Nebraska Act.', 'Treating reform movements as unconnected to religious revivalism.', 'Forgetting enslaved people\'s resistance and agency.'],
    tips: ['Use the periodization themes (politics and power, work and exchange, identity) to group evidence.', 'Practice dating events in order; many multiple-choice items test sequence.'],
    reading: [R_('Khan Academy', 'AP U.S. History, Periods 4 and 5'), R_('OpenStax', 'U.S. History: the Market Revolution; the Civil War era')],
  },
  'hand-ap-psych/learning': {
    sections: [
      { heading: 'Classical conditioning', paragraphs: ['In classical conditioning a neutral stimulus is paired with an unconditioned stimulus (UCS) that naturally triggers an unconditioned response (UCR). After repeated pairings the neutral stimulus becomes a conditioned stimulus (CS) that triggers a conditioned response (CR). Pavlov\'s dogs salivated to a bell. Acquisition, extinction (CS without UCS), spontaneous recovery, generalization and discrimination describe how the association changes. Conditioned emotional responses explain phobias and some taste aversions.'] },
      { heading: 'Operant conditioning', paragraphs: ['Operant conditioning shapes behavior by its consequences. **Reinforcement** increases a behavior: positive reinforcement adds a pleasant stimulus; negative reinforcement removes an aversive one. **Punishment** decreases a behavior: positive punishment adds an aversive stimulus; negative punishment removes a pleasant one. Schedules matter: ratio schedules depend on the number of responses; interval schedules on time; **variable** ratio produces high, steady responding and resistance to extinction (slot machines).'] },
      { heading: 'Observational and cognitive learning', paragraphs: ['Bandura\'s Bobo doll studies showed that people learn by watching models, especially when the model is rewarded. Cognitive explanations include latent learning (Tolman), insight learning (Köhler) and cognitive maps. These show that learning is not only stimulus-response; mental representations matter.'] },
    ],
    examples: [
      { problem: 'A child gets a cookie every time they clean their room, so they clean more. Identify the process.', steps: ['A pleasant stimulus is added after the behavior.', 'The behavior increases.'], answer: 'Positive reinforcement.' },
      { problem: 'A smell that once made someone sick now makes them nauseous. Identify UCS, UCR, CS and CR.', steps: ['UCS: the food poisoning agent; UCR: nausea; CS: the smell; CR: nausea at the smell.'], answer: 'Classical conditioning (a conditioned taste or smell aversion).' },
    ],
    mistakes: ['Confusing negative reinforcement with punishment.', 'Mixing up the UCS and the CS.', 'Treating "positive" and "negative" as "good" and "bad" instead of add and remove.', 'Forgetting that extinction is not unlearning in the sense of forgetting (spontaneous recovery can occur).'],
    tips: ['Label each element with its term when analyzing a scenario; graders look for each term.', 'Use consistent examples when you study to avoid mixing up the four operant cases.'],
    reading: [R_('Khan Academy', 'AP Psychology, Unit 4: Learning'), R_('OpenStax', 'Psychology 2e, Chapter 6: Learning')],
  },
  'hand-ap-csa/classes': {
    sections: [
      { heading: 'Anatomy of a class', paragraphs: ['A class defines a new type. It has private instance variables that hold each object\'s state, one or more constructors that initialize them, and methods that define behavior. Public accessors (getters) and mutators (setters) control access, which is **encapsulation**. A static variable or method belongs to the class itself, not to any one object. The keyword `this` refers to the current object, which resolves name conflicts between parameters and fields.'] },
      { heading: 'Inheritance and polymorphism', paragraphs: ['A subclass uses `extends` to inherit the public members of its superclass, can override methods, and calls the superclass constructor with `super(...)` as its first statement. Polymorphism lets a superclass reference hold a subclass object; the method that runs is determined by the actual object at runtime. An abstract class or an interface specifies methods subclasses must implement. Know the difference between overriding (same signature in a subclass) and overloading (same name, different parameters).'] },
      { heading: 'Exam strategy for class-writing questions', paragraphs: ['The free-response question asks you to write a complete class from a description. Declare private fields, write constructors that initialize every field, implement each required method with the exact signature, and return the correct type. Use the provided methods rather than rewriting them, and do not change the header. A partial but well-structured attempt still earns most points.'] },
    ],
    examples: [
      { problem: 'Write a class Counter with a private int count, a constructor setting it to 0, increment(), and getCount().', steps: ['Declare the private field.', 'Write the constructor to set count = 0.', 'increment() does count++; getCount() returns count.'], answer: 'public class Counter { private int count; public Counter() { count = 0; } public void increment() { count++; } public int getCount() { return count; } }' },
      { problem: 'Given class Animal with speak() and class Dog extends Animal overriding speak(). Which runs for Animal a = new Dog(); a.speak();?', steps: ['The variable type is Animal, but the object is a Dog.', 'Java uses dynamic dispatch on the actual object.'], answer: 'Dog\'s speak() runs.' },
    ],
    mistakes: ['Making instance variables public.', 'Forgetting to initialize a field in the constructor.', 'Confusing overloading and overriding.', 'Calling a method that exists only in the subclass through a superclass reference.'],
    tips: ['Match the method headers in the problem exactly.', 'Trace object diagrams on paper for tricky polymorphism questions.'],
    reading: [R_('Khan Academy', 'AP Computer Science A: classes and objects, inheritance'), R_('MIT OpenCourseWare', 'Introduction to object-oriented programming')],
  },
  'hand-ap-gov/foundations': {
    sections: [
      { heading: 'Enlightenment roots and the founding debate', paragraphs: ['The Declaration of Independence rests on Enlightenment ideas of natural rights and the social contract (Locke). The Articles of Confederation created a weak national government that could not tax or regulate commerce. The Constitution (1787) addressed these weaknesses through compromise: the Great Compromise created a bicameral Congress, and the Three-Fifths Compromise counted enslaved people for representation. Federalists such as Madison defended ratification in the Federalist Papers; Anti-Federalists such as Brutus feared a distant, powerful national government and demanded a Bill of Rights.'] },
      { heading: 'Required documents', paragraphs: ['Know the arguments of **Federalist No. 10** (a large republic controls the effects of faction), **No. 51** (separation of powers and checks and balances protect liberty by setting ambition against ambition), and **Brutus No. 1** (a large republic cannot represent diverse interests and would be dominated by the national government). The Declaration, the Constitution, the Articles of Confederation and Letter from Birmingham Jail are among the required foundational documents that appear in free-response questions.'] },
      { heading: 'Federalism and separation of powers', paragraphs: ['Federalism divides power between the national and state governments. Enumerated powers belong to Congress, reserved powers belong to the states (10th Amendment), and concurrent powers are shared. McCulloch v. Maryland (1819) established implied powers and national supremacy; United States v. Lopez (1995) limited the commerce power. The Constitution separates power among three branches, each with checks on the others: veto, override, judicial review, advice and consent, impeachment.'] },
    ],
    examples: [
      { problem: 'Explain how Federalist No. 51 supports checks and balances.', steps: ['Madison argues that ambition must counteract ambition.', 'Each branch has the means and motive to resist encroachments by the others, protecting liberty.'], answer: 'Separation of powers and checks and balances prevent any one branch from dominating.' },
    ],
    mistakes: ['Mixing up Federalist No. 10 and No. 51.', 'Calling federalism "states\' rights only".', 'Forgetting to connect a case to the constitutional clause it interprets.', 'Confusing enumerated and reserved powers.'],
    tips: ['Memorize each required case with its constitutional clause and holding.', 'In argument essays, use foundational documents as evidence with specific reasoning.'],
    reading: [R_('Khan Academy', 'AP U.S. Government, Unit 1: Foundations of American democracy'), R_('OpenStax', 'American Government 3e, Chapters 2 and 3: The Constitution; federalism')],
  },
  'hand-ap-world/revolutions': {
    sections: [
      { heading: 'Revolutions and their ideas', paragraphs: ['The American, French, Haitian and Latin American revolutions drew on Enlightenment ideas of natural rights, popular sovereignty and reason, and they influenced one another. The French Revolution moved from reform to radical violence and then to Napoleon; the Haitian Revolution (1791-1804) was the only successful large-scale slave revolt creating a new state. Latin American independence leaders such as Bolívar and San Martín overthrew Spanish rule but left social hierarchies largely intact.'] },
      { heading: 'Industrialization', paragraphs: ['Industrialization began in Britain, which had coal, iron, capital, colonial markets and political stability. The factory system, steam power, railroads and the telegraph transformed production, transportation and communication. It caused urbanization, new class structures, child labor and reform movements, and it spread to the United States, Germany and Japan, producing a global economy with new inequalities.'] },
      { heading: 'Imperialism and responses', paragraphs: ['Industrial powers sought raw materials and markets, and technology such as steamships, quinine and the Maxim gun made conquest easier. The Berlin Conference (1884-85) partitioned Africa, and Britain expanded in India and China (the Opium Wars). Justifications included Social Darwinism and a "civilizing mission". Colonized peoples responded with resistance (the Indian Rebellion of 1857, the Boxer Rebellion), reform (Meiji Japan) and nationalism.'] },
    ],
    examples: [
      { problem: 'Compare the causes of the French and Haitian Revolutions.', steps: ['Similarity: both were influenced by Enlightenment ideas of liberty and equality and by resentment of an unequal social order.', 'Difference: the French Revolution began with a fiscal crisis and a challenge to monarchy, while the Haitian Revolution was an uprising of enslaved people against slavery and colonial rule.'], answer: 'Both drew on Enlightenment ideas; the Haitian Revolution also challenged slavery and colonialism directly.' },
    ],
    mistakes: ['Treating the revolutions in isolation from one another.', 'Giving only one cause of industrialization.', 'Describing imperialism without the economic and technological drivers.', 'Ignoring colonized peoples\' responses.'],
    tips: ['Practice comparison essays: state a similarity or difference AND explain why.', 'Keep a timeline linking political change to economic change.'],
    reading: [R_('Khan Academy', 'AP World History, Units 5 and 6'), R_('OpenStax', 'World history chapters on revolutions and industrialization')],
  },
});
