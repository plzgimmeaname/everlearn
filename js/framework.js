// college board style framework per ap course: exam format, units, topic outline, lesson coverage, resources
// unit tuple: [title, weight or '', 'topic; topic; ...', [lesson ids that cover it]]
// weights are approximate ranges recalled from the published outlines; always confirm on ap central
const U_ = (t, w, topics, les = []) => ({ title: t, weight: w, topics: topics.split(';').map(s => s.trim()).filter(Boolean), lessons: les });

const FW = {
  'hand-ap-calc-ab': { slug: 'ap-calculus-ab', exam: '45 multiple-choice questions (105 min, 50%) and 6 free-response questions (90 min, 50%); graphing calculator allowed on part of each section.', units: [
    U_('Limits and Continuity', '10-12%', 'Average vs instantaneous change; limit notation; limits from graphs and tables; algebraic limit properties; factoring and rationalizing; squeeze theorem; types of discontinuity; continuity over an interval; removing discontinuities; infinite limits and vertical asymptotes; limits at infinity; Intermediate Value Theorem', ['limits', 'continuity']),
    U_('Differentiation: Definition and Fundamental Properties', '10-12%', 'Average rate of change; definition of the derivative; differentiability and continuity; power, constant, sum and difference rules; derivatives of sin, cos, eˣ and ln x; product rule; quotient rule; derivatives of other trig functions', ['deriv']),
    U_('Differentiation: Composite, Implicit and Inverse Functions', '9-13%', 'Chain rule; implicit differentiation; derivatives of inverse functions; derivatives of inverse trig functions; selecting procedures; higher-order derivatives', ['deriv', 'implicit']),
    U_('Contextual Applications of Differentiation', '10-15%', 'Interpreting the derivative in context; straight-line motion; rates of change; related rates; local linearity and linearization; L\'Hopital\'s rule', ['implicit', 'motion']),
    U_('Analytical Applications of Differentiation', '15-18%', 'Mean Value Theorem; Extreme Value Theorem and critical points; increasing and decreasing intervals; first derivative test; candidates test; concavity and the second derivative test; optimization; implicit relations and curve analysis', ['analysis']),
    U_('Integration and Accumulation of Change', '17-20%', 'Accumulation and area; Riemann sums; definite integral; Fundamental Theorem of Calculus; properties of integrals; antiderivatives; u-substitution; integration by substitution with definite integrals; accumulation functions', ['ftc', 'accum']),
    U_('Differential Equations', '6-12%', 'Differential equations and solutions; slope fields; separation of variables; particular solutions; exponential models', ['diffeq']),
    U_('Applications of Integration', '10-15%', 'Average value of a function; motion and accumulation; area between curves; volumes of solids with known cross sections; volumes by disks and washers', ['diffeq', 'ftc']),
  ] },
  'hand-ap-calcbc': { slug: 'ap-calculus-bc', exam: '45 multiple-choice questions (105 min, 50%) and 6 free-response questions (90 min, 50%); graphing calculator allowed on part of each section.', units: [
    U_('Limits and Continuity', '', 'Same core as AB: limits, continuity, asymptotes, Intermediate Value Theorem', []),
    U_('Differentiation', '', 'Rules, chain rule, implicit differentiation, inverse functions (see AB course)', []),
    U_('Applications of Differentiation', '', 'Related rates, linearization, L\'Hopital\'s rule, extrema, concavity, optimization', ['techniques']),
    U_('Integration and Accumulation', '', 'Riemann sums, Fundamental Theorem, integration by parts, partial fractions, improper integrals', ['techniques']),
    U_('Differential Equations', '', 'Slope fields, separation of variables, Euler\'s method, logistic growth', ['techniques']),
    U_('Applications of Integration', '', 'Area, volume, average value, arc length', []),
    U_('Parametric Equations, Polar Coordinates and Vector-Valued Functions', '', 'Parametric derivatives and arc length; polar curves and area; vector-valued position, velocity and acceleration', ['param']),
    U_('Infinite Sequences and Series', '', 'Convergence tests; geometric and p-series; alternating series and error bounds; Taylor and Maclaurin series; Lagrange error bound; radius and interval of convergence', ['series']),
  ] },
  'hand-ap-precalc': { slug: 'ap-precalculus', exam: '40 multiple-choice questions (80 min, 62.5%) and 4 free-response questions (60 min, 37.5%); graphing calculator required for part of each section.', units: [
    U_('Polynomial and Rational Functions', '', 'Rates of change; polynomial zeros, end behavior and complex zeros; rational function asymptotes and holes; transformations; inequalities and models', ['poly']),
    U_('Exponential and Logarithmic Functions', '', 'Geometric sequences; exponential models; logarithm properties; solving exponential and log equations; semi-log models; function composition and inverses', ['explog']),
    U_('Trigonometric and Polar Functions', '', 'Unit circle; sinusoidal functions and models; inverse trig; trig identities; polar coordinates and graphs', ['trig']),
    U_('Functions Involving Parameters, Vectors and Matrices', '', 'Parametric motion; implicitly defined curves; vectors; matrices as transformations; linear systems', []),
  ] },
  'hand-ap-stats': { slug: 'ap-statistics', exam: '40 multiple-choice questions (90 min, 50%) and 6 free-response questions (90 min, 50%) including an investigative task; calculator required.', units: [
    U_('Exploring One-Variable Data', '15-23%', 'Variables and distributions; graphs of categorical and quantitative data; center and spread; position (z-scores, percentiles); boxplots and outliers; effects of transformations; the normal distribution', ['describe']),
    U_('Exploring Two-Variable Data', '5-7%', 'Scatterplots; correlation; least-squares regression; residuals and residual plots; r²; departures from linearity', ['regress']),
    U_('Collecting Data', '12-15%', 'Sampling methods; bias; observational studies vs experiments; random assignment, blocking and confounding', ['probability']),
    U_('Probability, Random Variables and Probability Distributions', '10-20%', 'Probability rules; conditional probability and independence; random variables; combining random variables; binomial and geometric distributions', ['probability']),
    U_('Sampling Distributions', '7-12%', 'Sampling distribution of a proportion and a mean; Central Limit Theorem; sampling distributions of differences', ['probability']),
    U_('Inference for Categorical Data: Proportions', '12-15%', 'Confidence intervals and tests for one and two proportions; Type I and II errors and power', ['inference']),
    U_('Inference for Quantitative Data: Means', '10-18%', 'One-sample and two-sample t procedures; paired data; conditions and interpretation', ['inference', 'regress']),
    U_('Inference for Categorical Data: Chi-Square', '2-5%', 'Goodness of fit; homogeneity; independence', ['regress']),
    U_('Inference for Quantitative Data: Slopes', '2-5%', 'Confidence interval and test for the slope of a least-squares line', ['regress']),
  ] },
  'hand-ap-csa': { slug: 'ap-computer-science-a', exam: '42 multiple-choice questions (90 min, 55%) and 4 free-response questions (90 min, 45%) written in Java.', units: [
    U_('Using Objects and Methods', '', 'Primitive types; variables and expressions; casting; String methods; calling methods; Math class; objects and references', ['basics']),
    U_('Selection and Iteration', '', 'Boolean expressions; if statements; compound conditions; while and for loops; nested loops; string traversal and algorithms', ['basics']),
    U_('Class Creation', '', 'Writing classes; constructors; accessors and mutators; static; scope; this; inheritance; polymorphism; overriding', ['classes']),
    U_('Data Collections', '', 'Arrays; ArrayList; 2D arrays; searching and sorting; recursion; file input; ethical and social issues', ['collections', 'sort']),
  ] },
  'hand-ap-csp': { slug: 'ap-computer-science-principles', exam: 'Create performance task (30% of the score) plus 70 multiple-choice questions (120 min, 70%).', units: [
    U_('Creative Development', '', 'Collaboration; program function and purpose; program design; identifying and correcting errors', []),
    U_('Data', '', 'Binary numbers; data compression; extracting information from data; using programs with data', ['data']),
    U_('Algorithms and Programming', '', 'Variables; boolean logic; conditionals; iteration; lists; procedures; algorithms; simulations; algorithmic efficiency; undecidable problems', ['algos', 'prog']),
    U_('Computer Systems and Networks', '', 'The Internet; fault tolerance; parallel and distributed computing', ['data']),
    U_('Impact of Computing', '', 'Digital divide; computing bias; crowdsourcing; legal and ethical concerns; safe computing', ['algos']),
  ] },
  'hand-ap-bio': { slug: 'ap-biology', exam: '60 multiple-choice questions (90 min, 50%) and 6 free-response questions (90 min, 50%) including two long and four short; calculator allowed.', units: [
    U_('Chemistry of Life', '8-11%', 'Structure of water and hydrogen bonding; elements of life; macromolecule structure and function; nucleic acids', ['macromolecules']),
    U_('Cell Structure and Function', '10-13%', 'Subcellular components; cell size; plasma membranes; membrane permeability; transport; tonicity and osmoregulation; compartmentalization', ['membranes']),
    U_('Cellular Energetics', '12-16%', 'Enzyme structure and catalysis; environmental effects on enzymes; cellular energy; photosynthesis; cellular respiration; fitness', ['energetics']),
    U_('Cell Communication and Cell Cycle', '10-15%', 'Cell communication; signal transduction; changes in signal transduction; feedback; cell cycle; regulation of the cell cycle', ['signal']),
    U_('Heredity', '8-11%', 'Meiosis; genetic diversity; Mendelian genetics; non-Mendelian genetics; environmental effects on phenotype; chromosomal inheritance', ['heredity']),
    U_('Gene Expression and Regulation', '12-16%', 'DNA and RNA structure; replication; transcription and RNA processing; translation; regulation of gene expression; mutations; biotechnology', ['regulation']),
    U_('Natural Selection', '13-20%', 'Natural selection; artificial selection; population genetics and Hardy-Weinberg; evidence of evolution; common ancestry; continuing evolution; phylogeny; speciation; extinction; origin of life', ['evolution']),
    U_('Ecology', '10-15%', 'Responses to the environment; energy flow through ecosystems; population ecology; community ecology; biodiversity; disruptions to ecosystems', ['evolution']),
  ] },
  'hand-ap-chem': { slug: 'ap-chemistry', exam: '60 multiple-choice questions (90 min, 50%) and 7 free-response questions (105 min, 50%); calculator allowed on both sections.', units: [
    U_('Atomic Structure and Properties', '7-9%', 'Moles and molar mass; mass spectra; elemental composition; photoelectron spectroscopy; periodic trends; valence electrons and ionic compounds', ['structure']),
    U_('Molecular and Ionic Compound Structure and Properties', '7-9%', 'Types of chemical bonds; Lewis diagrams; resonance and formal charge; VSEPR and hybridization; structure of ionic solids and metals', ['structure']),
    U_('Intermolecular Forces and Properties', '18-22%', 'Intermolecular forces; properties of solids; solids, liquids and gases; ideal gas law; kinetic molecular theory; solutions and mixtures; Beer-Lambert law', ['structure']),
    U_('Chemical Reactions', '11-15%', 'Introduction to reactions; net ionic equations; representations of reactions; physical and chemical changes; stoichiometry; titrations; types of reactions; acid-base and redox reactions', []),
    U_('Kinetics', '7-9%', 'Reaction rates; introduction to rate law; concentration changes over time; elementary reactions; collision model; reaction energy profile; catalysis', ['kinetics']),
    U_('Thermodynamics', '7-9%', 'Endothermic and exothermic processes; energy diagrams; heat transfer and calorimetry; heating curves; enthalpy of reaction, formation and bond enthalpies; Hess\'s law', ['thermo']),
    U_('Equilibrium', '7-9%', 'Introduction to equilibrium; direction of reversible reactions; reaction quotient and equilibrium constant; calculating K; Le Chatelier\'s principle; solubility equilibria', ['equilibrium']),
    U_('Acids and Bases', '11-15%', 'pH and pOH; weak acid and base equilibria; acid-base reactions and buffers; acid-base titrations; molecular structure of acids and bases; Henderson-Hasselbalch', ['acidbase']),
    U_('Applications of Thermodynamics', '7-9%', 'Entropy; Gibbs free energy and thermodynamic favorability; thermodynamic and kinetic control; free energy and equilibrium; coupled reactions; galvanic and electrolytic cells; cell potential and free energy', ['thermo', 'electro']),
  ] },
  'hand-ap-physics1': { slug: 'ap-physics-1', exam: '40 multiple-choice questions (80 min, 50%) and 4 free-response questions (90 min, 50%); calculator allowed.', units: [
    U_('Kinematics', '', 'Scalars and vectors; displacement, velocity and acceleration; representations of motion; projectile motion', ['kin']),
    U_('Force and Translational Dynamics', '', 'Systems; free-body diagrams; Newton\'s laws; friction; circular motion; gravitation', ['dyn']),
    U_('Work, Energy and Power', '', 'Work-energy theorem; potential energy; conservation of energy; power', ['energy']),
    U_('Linear Momentum', '', 'Momentum and impulse; conservation of momentum; elastic and inelastic collisions', ['momentum']),
    U_('Torque and Rotational Dynamics', '', 'Torque; rotational inertia; Newton\'s second law for rotation; rotational equilibrium', ['rotation']),
    U_('Energy and Momentum of Rotating Systems', '', 'Rotational kinetic energy; angular momentum and its conservation; rolling', ['rotation']),
    U_('Oscillations', '', 'Simple harmonic motion; mass-spring and pendulum systems; energy in oscillators', ['rotation']),
    U_('Fluids', '', 'Density and pressure; buoyancy; continuity; Bernoulli\'s equation', ['fl']),
  ] },
  'hand-ap-phys2': { slug: 'ap-physics-2', exam: '40 multiple-choice questions (80 min, 50%) and 4 free-response questions (90 min, 50%); calculator allowed.', units: [
    U_('Thermodynamics', '', 'Ideal gases; kinetic theory; first and second laws; heat engines; PV diagrams', ['fluids']),
    U_('Electric Force, Field and Potential', '', 'Coulomb\'s law; electric fields; potential energy and potential; capacitors', ['circuits']),
    U_('Electric Circuits', '', 'Current, resistance and Ohm\'s law; series and parallel circuits; Kirchhoff\'s rules; RC circuits', ['circuits']),
    U_('Magnetism and Electromagnetic Induction', '', 'Magnetic fields and forces; Faraday\'s law; Lenz\'s law', ['circuits']),
    U_('Geometric Optics', '', 'Reflection, refraction and Snell\'s law; mirrors and lenses; image formation', ['optics']),
    U_('Waves, Sound and Physical Optics', '', 'Wave properties; interference and diffraction; standing waves; double-slit', ['optics']),
    U_('Modern Physics', '', 'Photoelectric effect; atomic energy levels; de Broglie waves; nuclear physics and decay', ['optics']),
    U_('Fluids', '', 'Pressure; buoyancy; continuity; Bernoulli\'s equation', ['fluids']),
  ] },
  'hand-ap-physc-mech': { slug: 'ap-physics-c-mechanics', exam: '35 multiple-choice questions (45 min, 50%) and 3 free-response questions (45 min, 50%); calculus-based.', units: [
    U_('Kinematics', '', 'Motion with calculus; vectors; projectile motion; relative motion', ['kincalc']),
    U_('Force and Translational Dynamics', '', 'Newton\'s laws; variable and drag forces; circular motion', ['kincalc']),
    U_('Work, Energy and Power', '', 'Work from variable forces; potential energy functions; conservation of energy', ['kincalc']),
    U_('Linear Momentum', '', 'Impulse; conservation of momentum; collisions; center of mass', []),
    U_('Torque and Rotational Dynamics', '', 'Rotational inertia by integration; torque; angular momentum; rolling', ['rotcalc']),
    U_('Oscillations and Gravitation', '', 'Simple harmonic motion; pendulums; Newton\'s law of gravitation; orbits', ['rotcalc']),
  ] },
  'hand-ap-physc-em': { slug: 'ap-physics-c-electricity-and-magnetism', exam: '35 multiple-choice questions (45 min, 50%) and 3 free-response questions (45 min, 50%); calculus-based.', units: [
    U_('Electrostatics', '', 'Coulomb\'s law; electric fields by integration; Gauss\'s law; electric potential', ['gauss']),
    U_('Conductors, Capacitors and Dielectrics', '', 'Conductors in equilibrium; capacitance; energy storage; dielectrics', ['gauss']),
    U_('Electric Circuits', '', 'Resistors; Kirchhoff\'s rules; RC circuits', ['induction']),
    U_('Magnetic Fields', '', 'Forces on charges and currents; Biot-Savart law; Ampere\'s law', ['induction']),
    U_('Electromagnetism', '', 'Faraday\'s law; Lenz\'s law; inductance and RL circuits; Maxwell\'s equations', ['induction']),
  ] },
  'hand-ap-apes': { slug: 'ap-environmental-science', exam: '80 multiple-choice questions (90 min, 60%) and 3 free-response questions (70 min, 40%); calculator allowed.', units: [
    U_('The Living World: Ecosystems', '', 'Ecosystem structure; terrestrial and aquatic biomes; carbon, nitrogen, phosphorus and water cycles; primary productivity; trophic levels; energy flow', ['eco']),
    U_('The Living World: Biodiversity', '', 'Biodiversity; ecosystem services; island biogeography; ecological succession; adaptations; keystone and invasive species', ['eco']),
    U_('Populations', '', 'Population ecology; r and K strategies; human population dynamics; the demographic transition; age structure diagrams', ['eco']),
    U_('Earth Systems and Resources', '', 'Plate tectonics; soil formation and erosion; atmosphere; weather and climate; water cycle', []),
    U_('Land and Water Use', '', 'Agriculture; irrigation; pest control; forestry; mining; fishing; urbanization; ecological footprint', ['land']),
    U_('Energy Resources and Consumption', '', 'Renewable and nonrenewable energy; fossil fuels; nuclear power; solar, wind, hydro and biomass; energy conservation', ['energy']),
    U_('Atmospheric Pollution', '', 'Air pollutants; smog; acid deposition; ozone depletion; indoor air pollution; noise pollution', ['energy']),
    U_('Aquatic and Terrestrial Pollution', '', 'Water pollution; eutrophication; solid and hazardous waste; bioaccumulation; wastewater treatment', ['energy']),
    U_('Global Change', '', 'Greenhouse effect; climate change and its effects; ocean acidification; invasive species; endangered species; extinction', ['energy']),
  ] },
  'hand-ap-ush': { slug: 'ap-united-states-history', exam: '55 multiple-choice questions (55 min, 40%); 3 short-answer questions (40 min, 20%); 1 document-based question (60 min, 25%); 1 long essay (40 min, 15%).', units: [
    U_('Period 1: 1491-1607', '', 'Native American societies; European exploration; the Columbian Exchange; Spanish colonization; the Atlantic world', ['colonial']),
    U_('Period 2: 1607-1754', '', 'Colonial regions; the Chesapeake and New England; Atlantic slave trade; mercantilism; the Great Awakening and the Enlightenment', ['colonial']),
    U_('Period 3: 1754-1800', '', 'French and Indian War; causes of the Revolution; Declaration of Independence; Articles of Confederation; the Constitution and the early republic', ['colonial']),
    U_('Period 4: 1800-1848', '', 'Jefferson and the Louisiana Purchase; the Market Revolution; Jacksonian democracy; Indian Removal; the Second Great Awakening and reform', ['antebellum']),
    U_('Period 5: 1844-1877', '', 'Manifest Destiny and the Mexican War; sectional crisis; the Civil War; Reconstruction', ['antebellum']),
    U_('Period 6: 1865-1898', '', 'Westward expansion; industrialization; labor and the Gilded Age; immigration and urbanization; Populism', ['gilded']),
    U_('Period 7: 1890-1945', '', 'Progressivism; imperialism and WWI; the 1920s; the Great Depression and the New Deal; World War II', ['gilded', 'modern']),
    U_('Period 8: 1945-1980', '', 'The Cold War; postwar economy and society; civil rights; the Great Society; Vietnam; the counterculture and the 1970s', ['postwar', 'modern']),
    U_('Period 9: 1980-Present', '', 'The conservative movement; the end of the Cold War; globalization; September 11 and its aftermath; recent developments; writing the DBQ, LEQ and short answers', ['postwar', 'writing']),
  ] },
  'hand-ap-world': { slug: 'ap-world-history-modern', exam: '55 multiple-choice questions (55 min, 40%); 3 short-answer questions (40 min, 20%); 1 document-based question (60 min, 25%); 1 long essay (40 min, 15%).', units: [
    U_('The Global Tapestry (c. 1200-1450)', '', 'Developments in East Asia, Dar al-Islam, South and Southeast Asia, the Americas, Africa and Europe; state-building and belief systems', ['networks']),
    U_('Networks of Exchange (c. 1200-1450)', '', 'Silk Roads, Mongol Empire, Indian Ocean, trans-Saharan and Black Death', ['networks']),
    U_('Land-Based Empires (c. 1450-1750)', '', 'Gunpowder empires; Ottoman, Safavid, Mughal, Qing and Russian expansion', ['networks']),
    U_('Transoceanic Interconnections (c. 1450-1750)', '', 'Maritime exploration; Columbian Exchange; Atlantic slave trade; mercantilism; the Scientific Revolution', ['networks']),
    U_('Revolutions (c. 1750-1900)', '', 'Enlightenment; American, French, Haitian and Latin American revolutions; industrialization; nationalism', ['revolutions']),
    U_('Consequences of Industrialization (c. 1750-1900)', '', 'Imperialism; Social Darwinism; resistance and reform; migration', ['revolutions']),
    U_('Global Conflict (c. 1900-present)', '', 'World War I; the interwar years; World War II; total war and genocide', ['global20']),
    U_('Cold War and Decolonization (c. 1900-present)', '', 'The Cold War; decolonization; nonaligned movement; new states', ['global20']),
    U_('Globalization (c. 1900-present)', '', 'Technology and economic integration; environmental, cultural and political effects; contemporary challenges', ['global20', 'skills']),
  ] },
  'hand-ap-euro': { slug: 'ap-european-history', exam: '55 multiple-choice questions (55 min, 40%); 3 short-answer questions (40 min, 20%); 1 document-based question (60 min, 25%); 1 long essay (40 min, 15%).', units: [
    U_('Renaissance and Exploration', '', 'Italian Renaissance; humanism; print revolution; European exploration and conquest', ['early']),
    U_('Age of Reformation', '', 'Protestant Reformation; Catholic Reformation; religious wars', ['early']),
    U_('Absolutism and Constitutionalism', '', 'Absolute monarchy; the English Civil War and Glorious Revolution; the Dutch Republic; Peace of Westphalia', ['early']),
    U_('Scientific, Philosophical and Political Developments', '', 'Scientific Revolution; Enlightenment; enlightened absolutism', ['early']),
    U_('Conflict, Crisis and Reaction in the Late 18th Century', '', 'French Revolution; Napoleon; the Congress of Vienna', ['modern']),
    U_('Industrialization and Its Effects', '', 'Industrial Revolution; urbanization; liberalism, socialism and reform', ['modern']),
    U_('19th-Century Perspectives and Political Developments', '', 'Nationalism; unification of Italy and Germany; imperialism; Romanticism', ['modern']),
    U_('20th-Century Global Conflicts', '', 'World War I; the Russian Revolution; fascism; World War II and the Holocaust', ['modern']),
    U_('Cold War and Contemporary Europe', '', 'Division of Europe; decolonization; the fall of communism; the European Union', ['modern']),
  ] },
  'hand-ap-gov': { slug: 'ap-united-states-government-and-politics', exam: '55 multiple-choice questions (80 min, 50%) and 4 free-response questions (100 min, 50%): concept application, quantitative analysis, SCOTUS comparison and argument essay.', units: [
    U_('Foundations of American Democracy', '', 'Ideals of democracy; the Constitution; federalism; separation of powers; Federalist and Anti-Federalist views', ['foundations']),
    U_('Interactions Among Branches of Government', '', 'Congress; the presidency; the judiciary; the bureaucracy; checks and balances', ['foundations', 'policy']),
    U_('Civil Liberties and Civil Rights', '', 'Bill of Rights; First Amendment cases; due process; equal protection; the civil rights movement', ['rights']),
    U_('American Political Ideologies and Beliefs', '', 'Political socialization; public opinion and polling; ideologies; party identification', ['policy']),
    U_('Political Participation', '', 'Voting behavior; political parties; interest groups; elections and campaign finance; the media', ['rights', 'policy']),
  ] },
  'hand-ap-compgov': { slug: 'ap-comparative-government-and-politics', exam: '55 multiple-choice questions (60 min, 50%) and 4 free-response questions (90 min, 50%); countries studied: UK, Russia, China, Mexico, Nigeria, Iran.', units: [
    U_('Political Systems, Regimes and Governments', '', 'Sovereignty; legitimacy; types of regimes; the six core countries', ['systems']),
    U_('Political Institutions', '', 'Executives; legislatures; judiciaries; electoral systems; party systems', ['systems']),
    U_('Political and Economic Change', '', 'Democratization; economic liberalization; the effects of globalization', ['compare']),
    U_('Citizens, Society and the State', '', 'Social cleavages; civil society; political culture; citizen participation', ['compare']),
    U_('Political and Economic Development', '', 'Development measures; economic policies; the role of the state', ['compare']),
  ] },
  'hand-ap-macro': { slug: 'ap-macroeconomics', exam: '60 multiple-choice questions (70 min, 66.7%) and 3 free-response questions (60 min, 33.3%).', units: [
    U_('Basic Economic Concepts', '', 'Scarcity; opportunity cost; production possibilities curve; comparative advantage; supply and demand', ['measure']),
    U_('Economic Indicators and the Business Cycle', '', 'GDP; unemployment; inflation; the business cycle', ['measure']),
    U_('National Income and Price Determination', '', 'Aggregate demand and supply; multipliers; fiscal policy; short-run and long-run equilibrium', ['adas']),
    U_('Financial Sector', '', 'Money and banking; the money market; monetary policy; loanable funds', ['money']),
    U_('Long-Run Consequences of Stabilization Policies', '', 'Phillips curve; crowding out; economic growth; public policy and growth', ['phillips']),
    U_('Open Economy: International Trade and Finance', '', 'Balance of payments; exchange rates; net exports; trade and capital flows', ['money']),
  ] },
  'hand-ap-micro': { slug: 'ap-microeconomics', exam: '60 multiple-choice questions (70 min, 66.7%) and 3 free-response questions (60 min, 33.3%).', units: [
    U_('Basic Economic Concepts', '', 'Scarcity; opportunity cost; production possibilities; comparative advantage', ['sd']),
    U_('Supply and Demand', '', 'Market equilibrium; elasticity; consumer and producer surplus; government intervention; international trade', ['sd']),
    U_('Production, Cost and the Perfect Competition Model', '', 'Production and costs; profit maximization; perfect competition in the short and long run', ['costs']),
    U_('Imperfect Competition', '', 'Monopoly; price discrimination; monopolistic competition; oligopoly and game theory', ['monopoly']),
    U_('Factor Markets', '', 'Labor demand and supply; monopsony; marginal revenue product; wages', ['factor']),
    U_('Market Failure and the Role of Government', '', 'Externalities; public goods; income distribution; taxation', ['monopoly']),
  ] },
  'hand-ap-psych': { slug: 'ap-psychology', exam: '100 multiple-choice questions (70 min, 66.7%) and 2 free-response questions (50 min, 33.3%).', units: [
    U_('Scientific Foundations of Psychology', '', 'Perspectives; research methods; statistics; ethics', ['methods']),
    U_('Biological Bases of Behavior', '', 'The nervous system; the brain; neurotransmitters; genetics and behavior; sleep and consciousness', ['methods', 'sens']),
    U_('Sensation and Perception', '', 'Thresholds; vision and hearing; perceptual organization; perception and attention', ['sens']),
    U_('Learning', '', 'Classical and operant conditioning; observational learning', ['learning']),
    U_('Cognitive Psychology', '', 'Memory; thinking and problem solving; intelligence; language', ['learning']),
    U_('Developmental Psychology', '', 'Prenatal and infant development; cognitive and moral development; adolescence and adulthood', ['dev']),
    U_('Motivation, Emotion and Personality', '', 'Motivation theories; emotion theories; stress; personality theories', ['dev']),
    U_('Clinical Psychology', '', 'Psychological disorders; treatments', ['clinical']),
    U_('Social Psychology', '', 'Attribution; conformity and obedience; group behavior; attitudes; prejudice', ['clinical']),
  ] },
  'hand-ap-hug': { slug: 'ap-human-geography', exam: '60 multiple-choice questions (60 min, 50%) and 3 free-response questions (75 min, 50%).', units: [
    U_('Thinking Geographically', '', 'Maps and spatial concepts; regions; scale; geographic data', ['pop']),
    U_('Population and Migration Patterns and Processes', '', 'Population distribution and growth; the demographic transition; migration', ['pop']),
    U_('Cultural Patterns and Processes', '', 'Culture; diffusion; language and religion; cultural landscapes', ['pop']),
    U_('Political Patterns and Processes', '', 'The state system; boundaries; devolution; geopolitics; electoral geography', ['political']),
    U_('Agriculture and Rural Land-Use Patterns and Processes', '', 'Agricultural revolutions; land use models; modern agriculture', ['cities']),
    U_('Cities and Urban Land-Use Patterns and Processes', '', 'Urbanization; urban models; urban issues', ['cities']),
    U_('Industrial and Economic Development Patterns and Processes', '', 'Industrialization; economic and social development; globalization', ['cities']),
  ] },
  'hand-ap-lang': { slug: 'ap-english-language-and-composition', exam: '45 multiple-choice questions (60 min, 45%) and 3 free-response essays (2 h 15 min, 55%): synthesis, rhetorical analysis and argument.', units: [
    U_('Rhetorical Situation and Claims', '', 'Rhetorical situation; claims and evidence; reasoning; thesis statements', ['rhetoric']),
    U_('Evidence, Reasoning and Line of Reasoning', '', 'Evidence and commentary; organizing an argument; sources', ['argument']),
    U_('Style and Rhetorical Choices', '', 'Diction, syntax and tone; rhetorical devices; style and purpose', ['style']),
    U_('Synthesis Essay', '', 'Reading sources; using evidence from multiple sources; building an argument', ['argument']),
    U_('Argument Essay', '', 'Position, qualification, concession and refutation; fallacies', ['argument']),
    U_('Rhetorical Analysis Essay', '', 'Analyzing choices and effects; thesis; commentary', ['rhetoric']),
  ] },
  'hand-ap-lit': { slug: 'ap-english-literature-and-composition', exam: '55 multiple-choice questions (60 min, 45%) and 3 free-response essays (2 h, 55%): poetry analysis, prose analysis and literary argument.', units: [
    U_('Short Fiction', '', 'Characters; setting; structure; narration; figurative language', ['close']),
    U_('Poetry', '', 'Form and structure; imagery; sound; figurative language; tone and shifts', ['close']),
    U_('Longer Fiction and Drama', '', 'Character development; plot structure; symbolism; theme', ['close']),
    U_('Literary Analysis Essay', '', 'Thesis; evidence; commentary', ['litessay']),
    U_('Poetry Analysis Essay', '', 'Reading the poem; arguing about how choices create meaning', ['litessay']),
    U_('Prose Analysis Essay', '', 'Narrative choices; tone; development', ['litessay']),
  ] },
  'hand-ap-business': { slug: 'ap-business-with-personal-finance', exam: 'New course: check AP Central for the current exam format.', units: [
    U_('Business Foundations', '', 'Forms of business; entrepreneurship; the economic environment', ['biz']),
    U_('Managing Business Operations', '', 'Operations; human resources; management and leadership', ['biz']),
    U_('Marketing and Finance', '', 'Marketing mix; accounting; break-even analysis', ['biz']),
    U_('Personal Finance Fundamentals', '', 'Budgeting; credit; saving and investing; taxes; insurance', ['finance']),
  ] },
  'hand-ap-music': { slug: 'ap-music-theory', exam: 'Multiple-choice and free-response sections, plus sight-singing; check AP Central for the current format.', units: [
    U_('Music Fundamentals', '', 'Pitch and notation; major and minor scales; key signatures; intervals; rhythm and meter', ['fund']),
    U_('Harmony and Voice Leading', '', 'Triads and seventh chords; Roman numerals; cadences; voice leading', ['harmony']),
    U_('Form and Analysis', '', 'Phrase and period; musical form; analysis', []),
    U_('Aural Skills', '', 'Melodic and harmonic dictation; sight-singing', []),
  ] },
};

const FW_RES = {
  stem: ['khan', 'ocw', 'openstax', 'libretexts', 'youtube', 'quizlet', 'anki'],
  humanities: ['khan', 'jstor', 'scholar', 'openlibrary', 'youtube', 'quizlet', 'gutenberg'],
  cs: ['ocw', 'khan', 'youtube', 'quizlet'],
  english: ['gutenberg', 'jstor', 'scholar', 'khan', 'grammarly', 'quizlet'],
};
const fwResIds = c => (c.subject === 'English' ? FW_RES.english : c.subject === 'Computer science' ? FW_RES.cs : ['Math', 'Science'].includes(c.subject) ? FW_RES.stem : FW_RES.humanities);

const Framework = (() => {
  const state = () => { const S = Store.get(); return (S.fw = S.fw || {}); };
  const key = (c, u, t) => `${c.id}|${u}|${t}`;
  const has = c => !!FW[c.id];

  function html(c) {
    const fw = FW[c.id], st = state();
    const lessonsById = Object.fromEntries(allLessons(c).map(l => [l.id, l]));
    const covered = fw.units.filter(u => u.lessons.some(id => lessonsById[id])).length;
    return `<section class="panel fw"><div class="sec-head"><h2>Course framework</h2><a class="btn small" href="https://apcentral.collegeboard.org/courses/${fw.slug}" target="_blank" rel="noopener noreferrer">Official AP Central page</a></div>
      <p class="muted"><b>Exam format:</b> ${esc(fw.exam)} Confirm current details on AP Central.</p>
      <p class="muted"><small>${fw.units.length} units. ${covered} of ${fw.units.length} units have lessons here. Tick off topics as you learn them, use the lessons and resources under each unit, and use the practice exam to test yourself. Weights are approximate.</small></p>
      ${fw.units.map((u, ui) => {
        const done = u.topics.filter((t, ti) => st[key(c, ui, ti)]).length, ls = u.lessons.map(id => lessonsById[id]).filter(Boolean);
        return `<details class="fwunit"><summary><b>Unit ${ui + 1}: ${esc(u.title)}</b>${u.weight ? ` <span class="tag-tier">${esc(u.weight)} of exam</span>` : ''}<span class="muted fwprog" data-prog="${ui}"> ${done}/${u.topics.length} topics</span>${ls.length ? '' : ' <span class="badge m0">No lesson yet</span>'}</summary>
          <div class="fwbody"><h4>Topics</h4><ul class="checks">${u.topics.map((t, ti) => `<li><label><input type="checkbox" data-fw="${ui}|${ti}" ${st[key(c, ui, ti)] ? 'checked' : ''}> ${esc(t)}</label></li>`).join('')}</ul>
          <h4>Lessons in this course</h4>${ls.length ? ls.map(l => `<a class="lrow" href="#/lesson/${c.id}/${l.id}"><span class="lt">${esc(l.title)}</span><span class="muted">${l.minutes} min</span></a>`).join('') : '<p class="muted">No lesson yet for this unit. Use the resources below or add it in the course builder.</p>'}
          <h4>Resources for this unit</h4><div class="rgrid">${fwResIds(c).slice(0, 6).map(id => resourceCard(id, `${c.title.replace(/^AP /, 'AP ')} ${u.title}`)).join('')}</div></div></details>`;
      }).join('')}
      <div class="row-actions"><button class="btn" id="fwadd">Add units without lessons to my course builder</button></div></section>`;
  }

  function bind(c) {
    const fw = FW[c.id], st = state(), root = $('.fw');
    if (!root) return;
    root.addEventListener('change', e => {
      const cb = e.target.closest('[data-fw]'); if (!cb) return;
      const [ui, ti] = cb.dataset.fw.split('|').map(Number);
      st[key(c, ui, ti)] = cb.checked || undefined;
      Store.save();
      const done = fw.units[ui].topics.filter((t, i) => st[key(c, ui, i)]).length;
      $(`[data-prog="${ui}"]`, root).textContent = ` ${done}/${fw.units[ui].topics.length} topics`;
    });
    $('#fwadd', root).onclick = () => {
      const lessonIds = new Set(allLessons(c).map(l => l.id));
      const missing = fw.units.map((u, i) => ({ u, i })).filter(x => !x.u.lessons.some(id => lessonIds.has(id)));
      if (!missing.length) { alert('Every unit already has at least one lesson.'); return; }
      const raw = { id: `my-${slugify(c.title)}-extra-${Math.random().toString(36).slice(2, 6)}`, title: `${c.title}: additional units`, subject: c.subject, band: c.band, tier: c.tier, level: 'Advanced Placement', blurb: 'Units from the course framework that still need lessons.', tags: [], created: Date.now(), built: true,
        units: missing.map(({ u, i }) => ({ title: `Unit ${i + 1}: ${u.title}`, lessons: u.topics.reduce((a, t, k) => { if (k % 3 === 0) a.push([]); a[a.length - 1].push(t); return a; }, []).map(g => ({ title: g.slice(0, 2).join(' and '), minutes: 15, explanation: [], keyTerms: [], quiz: [], flashcards: [] })) })) };
      Store.get().aiCourses.push(raw); Store.save(); location.hash = '#/build/' + raw.id;
    };
  }

  return { has, html, bind };
})();
