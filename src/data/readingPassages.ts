export interface ReadingQuestion {
  id: string;
  type: "tfng" | "mcq" | "completion" | "heading";
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  body: string;
  questions: ReadingQuestion[];
}

// 3 passages × ~13 questions = 40 total (full IELTS Reading format).
export const readingPassages: ReadingPassage[] = [
  {
    id: "honeybees",
    title: "Passage 1 – The Decline of Honeybees",
    body:
      "Honeybees play a critical role in global agriculture, pollinating roughly one third of the food crops humans consume. Yet over the past two decades, beekeepers across Europe and North America have reported alarming declines in colony numbers, a phenomenon often referred to as Colony Collapse Disorder (CCD). Researchers have identified a combination of factors behind these losses, including the widespread use of neonicotinoid pesticides, habitat loss caused by industrial farming, and the spread of the parasitic Varroa mite.\n\nDespite the seriousness of the problem, recent initiatives offer cautious optimism. Several European countries have banned the most harmful pesticides outright, and urban beekeeping movements have helped re-establish pollinator populations in unexpected places, from rooftop gardens in Paris to community parks in Toronto. Scientists at the University of Reading also report that bees raised in diverse floral environments show stronger immune responses than those kept near monoculture farms.\n\nCommercial beekeepers have begun rotating hives across multiple crop types throughout the season, mimicking the natural variety of pollen sources that wild bees would encounter. This practice, known as managed migration, has reportedly halved colony losses on participating farms in California. At the same time, public awareness campaigns have driven a sharp rise in amateur beekeeping: membership in the British Beekeepers Association has tripled since 2008.\n\nStill, experts caution that without sustained policy intervention and farmer cooperation, honeybee populations will remain under threat. The challenge, as one researcher notes, is not merely to save the bees, but to redesign the agricultural systems that depend on them.",
    questions: [
      { id: "q1", type: "tfng", question: "Honeybees pollinate around one third of human food crops.", answer: "True", explanation: "Para 1: 'pollinating roughly one third of the food crops'." },
      { id: "q2", type: "tfng", question: "Colony Collapse Disorder is caused by a single factor.", answer: "False", explanation: "Para 1 lists multiple factors." },
      { id: "q3", type: "tfng", question: "All European countries have banned neonicotinoid pesticides.", answer: "Not Given", explanation: "Only 'several' countries are mentioned." },
      { id: "q4", type: "mcq", question: "Bees in diverse floral environments tend to have:", options: ["Weaker colonies", "Stronger immune responses", "Higher mite infestation", "Smaller hives"], answer: "Stronger immune responses", explanation: "Para 2." },
      { id: "q5", type: "completion", question: "Urban beekeeping has thrived in places like rooftop gardens in ____.", answer: "Paris", explanation: "Para 2: 'rooftop gardens in Paris'." },
      { id: "q6", type: "tfng", question: "Managed migration has been reported to halve colony losses in California.", answer: "True", explanation: "Para 3 states this." },
      { id: "q7", type: "completion", question: "Rotating hives across crop types is known as managed ____.", answer: "migration", explanation: "Para 3 names the practice." },
      { id: "q8", type: "mcq", question: "Membership in the British Beekeepers Association has:", options: ["Doubled", "Tripled", "Halved", "Stayed the same"], answer: "Tripled", explanation: "Para 3: 'tripled since 2008'." },
      { id: "q9", type: "tfng", question: "The Varroa mite is mentioned as one cause of bee losses.", answer: "True", explanation: "Para 1." },
      { id: "q10", type: "tfng", question: "Bees kept near monoculture farms perform better than diverse-fed bees.", answer: "False", explanation: "Para 2: opposite is true." },
      { id: "q11", type: "mcq", question: "The researcher's main message is that we should:", options: ["Ban all pesticides", "Encourage urban beekeeping only", "Redesign agricultural systems", "Import wild bees"], answer: "Redesign agricultural systems", explanation: "Final paragraph." },
      { id: "q12", type: "completion", question: "Habitat loss is caused by industrial ____.", answer: "farming", explanation: "Para 1." },
      { id: "q13", type: "tfng", question: "Toronto has community parks involved in urban beekeeping.", answer: "True", explanation: "Para 2." },
    ],
  },
  {
    id: "sleep",
    title: "Passage 2 – Why We Sleep",
    body:
      "For decades, sleep was considered a passive state in which the brain simply rested. Modern neuroscience has overturned that view. Sleep is now understood as an active period during which the brain consolidates memory, clears metabolic waste, and regulates emotional processing. The discovery of the glymphatic system in 2013, a network of channels that flush toxins from neural tissue during deep sleep, has reshaped how researchers think about chronic sleep deprivation.\n\nAdults who consistently sleep fewer than six hours per night show measurable declines in attention, decision-making, and immune function. Long-term studies link insufficient sleep to higher risk of cardiovascular disease and Alzheimer's. However, the optimal duration is not identical for every person; genetic variation accounts for some of the differences in sleep need.\n\nNon-REM and REM stages alternate roughly every ninety minutes throughout the night. Most memory consolidation appears to occur in deep non-REM sleep, while emotional integration and creative problem-solving are linked to REM. Disrupting either stage – through alcohol, late screen use, or shift work – can blunt the next day's cognitive performance even when total sleep time seems adequate.\n\nEducators have begun to act on this evidence. Several school districts in the United States have shifted high school start times later, citing improved attendance and academic performance. The cultural assumption that less sleep equals greater productivity, researchers argue, is finally beginning to fade.",
    questions: [
      { id: "q1", type: "tfng", question: "The brain is inactive during sleep.", answer: "False", explanation: "Modern neuroscience overturned that view." },
      { id: "q2", type: "tfng", question: "The glymphatic system was discovered before 2010.", answer: "False", explanation: "It was discovered in 2013." },
      { id: "q3", type: "tfng", question: "Everyone needs exactly the same amount of sleep.", answer: "False", explanation: "Optimal duration varies by genetics." },
      { id: "q4", type: "mcq", question: "Sleeping fewer than six hours is linked to:", options: ["Better focus", "Stronger immunity", "Cardiovascular disease risk", "Increased lifespan"], answer: "Cardiovascular disease risk", explanation: "Para 2." },
      { id: "q5", type: "completion", question: "Some US school districts moved high school start times ____.", answer: "later", explanation: "Para 4." },
      { id: "q6", type: "completion", question: "REM and non-REM cycles alternate every ____ minutes.", answer: "90", explanation: "Para 3: 'roughly every ninety minutes'." },
      { id: "q7", type: "mcq", question: "Memory consolidation is most linked to:", options: ["Light sleep", "Deep non-REM sleep", "REM sleep", "Wakefulness"], answer: "Deep non-REM sleep", explanation: "Para 3." },
      { id: "q8", type: "mcq", question: "REM sleep is linked to:", options: ["Bone repair", "Memory only", "Emotional integration and creativity", "Digestion"], answer: "Emotional integration and creativity", explanation: "Para 3." },
      { id: "q9", type: "tfng", question: "Insufficient sleep raises Alzheimer's risk.", answer: "True", explanation: "Para 2." },
      { id: "q10", type: "tfng", question: "Shift work has no impact on cognitive performance.", answer: "False", explanation: "Para 3 lists shift work as a disruptor." },
      { id: "q11", type: "completion", question: "The glymphatic system flushes ____ from neural tissue.", answer: "toxins", explanation: "Para 1." },
      { id: "q12", type: "mcq", question: "The phrase 'finally beginning to fade' refers to:", options: ["Sleep cycles", "The myth that less sleep = more productivity", "Caffeine effects", "School curricula"], answer: "The myth that less sleep = more productivity", explanation: "Final paragraph." },
      { id: "q13", type: "tfng", question: "Late screen use is mentioned as harmful to sleep stages.", answer: "True", explanation: "Para 3." },
    ],
  },
  {
    id: "amazon",
    title: "Passage 3 – The Amazon Rainforest",
    body:
      "Covering more than 5.5 million square kilometres across nine countries, the Amazon is the largest tropical rainforest on the planet. It produces around 6 percent of the world's oxygen and stores vast amounts of carbon in its trees and soils. Scientists estimate that one in ten of all known species lives within its borders, including thousands not yet formally described.\n\nDeforestation, however, has accelerated alarmingly. Between 2000 and 2020, an area roughly the size of France was lost, mainly to cattle ranching, soy farming and illegal logging. Studies suggest that if forest loss exceeds about 20 to 25 percent of the original area, parts of the Amazon could shift permanently from rainforest to dry savanna – a process known as a tipping point.\n\nIndigenous communities, who manage roughly a third of the remaining forest, have proven remarkably effective stewards: deforestation rates inside indigenous territories are far lower than in surrounding regions. International funding mechanisms increasingly recognise their role, with payments for ecosystem services emerging as one promising approach.\n\nClimate scientists also warn that the rainforest's water cycle is changing. The Amazon generates much of its own rainfall through evapotranspiration, and large-scale clearance reduces this self-watering effect, leading to longer dry seasons. Recent satellite analysis suggests parts of the south-eastern Amazon now release more carbon than they absorb.\n\nDespite these warnings, several governments have pledged to halt and reverse deforestation by 2030. Whether the political will and funding will materialise remains uncertain, but conservationists point to brief drops in deforestation rates during periods of strong enforcement as evidence that rapid change is still possible.",
    questions: [
      { id: "q1", type: "mcq", question: "Roughly what fraction of known species lives in the Amazon?", options: ["1 in 4", "1 in 10", "1 in 20", "1 in 50"], answer: "1 in 10", explanation: "One in ten of all known species." },
      { id: "q2", type: "tfng", question: "An area the size of France was lost between 2000 and 2020.", answer: "True", explanation: "Para 2." },
      { id: "q3", type: "tfng", question: "Soy farming is one of the main drivers of deforestation.", answer: "True", explanation: "Para 2." },
      { id: "q4", type: "completion", question: "A permanent shift from rainforest to dry savanna is called a ____ point.", answer: "tipping", explanation: "Para 2." },
      { id: "q5", type: "tfng", question: "Deforestation rates are higher inside indigenous territories.", answer: "False", explanation: "They are 'far lower'." },
      { id: "q6", type: "mcq", question: "The Amazon produces approximately what percentage of world oxygen?", options: ["2%", "6%", "12%", "20%"], answer: "6%", explanation: "Para 1." },
      { id: "q7", type: "completion", question: "The Amazon generates much of its own rainfall through ____.", answer: "evapotranspiration", explanation: "Para 4." },
      { id: "q8", type: "tfng", question: "Parts of the south-eastern Amazon now emit more carbon than they absorb.", answer: "True", explanation: "Para 4." },
      { id: "q9", type: "mcq", question: "Indigenous communities manage approximately how much of the remaining forest?", options: ["10%", "20%", "33%", "50%"], answer: "33%", explanation: "Roughly a third = 33%." },
      { id: "q10", type: "completion", question: "Several governments have pledged to halt deforestation by ____.", answer: "2030", explanation: "Para 5." },
      { id: "q11", type: "tfng", question: "The Amazon spans nine countries.", answer: "True", explanation: "Para 1." },
      { id: "q12", type: "mcq", question: "Which is NOT listed as a deforestation driver?", options: ["Cattle ranching", "Soy farming", "Mining", "Illegal logging"], answer: "Mining", explanation: "Para 2 lists ranching, soy, illegal logging — not mining." },
      { id: "q13", type: "tfng", question: "The forest's water cycle is unaffected by clearance.", answer: "False", explanation: "Para 4: clearance reduces self-watering." },
      { id: "q14", type: "completion", question: "One promising approach is payments for ecosystem ____.", answer: "services", explanation: "Para 3." },
    ],
  },
  {
    id: "antarctica",
    title: "Passage 4 – Life Beneath Antarctic Ice",
    body:
      "For most of the twentieth century, biologists assumed that the waters under Antarctic ice shelves were essentially lifeless. The shelves can be hundreds of metres thick, blocking sunlight and locking off the seabed from the open ocean. Recent boreholes drilled through the Filchner-Ronne Ice Shelf have overturned that picture entirely. Cameras lowered into the dark cavities revealed sponges, anemones and other filter-feeding animals clinging to the underside of boulders, sometimes more than 250 kilometres from the nearest open water.\n\nHow such ecosystems sustain themselves remains debated. Without sunlight, photosynthesis is impossible, so the resident species depend on organic particles drifting in from far away. Ocean currents appear to deliver just enough food, but only at trickle rates. The animals' growth must therefore be slow, and individual sponges may be hundreds of years old.\n\nThe discoveries matter beyond simple curiosity. As warmer ocean water reaches deeper under the shelves, parts of the ice are thinning rapidly. If shelves collapse, the cavities below will be exposed to sunlight and competition from open-ocean species, almost certainly displacing the slow-growing communities. Some researchers argue that these habitats should receive formal protection before they are lost.",
    questions: [
      { id: "q1", type: "tfng", question: "Scientists once thought sub-shelf waters held no life.", answer: "True", explanation: "Para 1." },
      { id: "q2", type: "tfng", question: "Light easily passes through Antarctic ice shelves.", answer: "False", explanation: "Shelves can be hundreds of metres thick, blocking sunlight." },
      { id: "q3", type: "completion", question: "Animals were found over ___ km from open water.", answer: "250", explanation: "Para 1." },
      { id: "q4", type: "mcq", question: "What sustains life under the ice?", options: ["Photosynthesis", "Hydrothermal vents", "Drifting organic particles", "Plankton blooms"], answer: "Drifting organic particles", explanation: "Para 2." },
      { id: "q5", type: "tfng", question: "The sponges grow quickly.", answer: "False", explanation: "Growth must be slow." },
      { id: "q6", type: "completion", question: "The boreholes were drilled through the ___ Ice Shelf.", answer: "Filchner-Ronne", explanation: "Para 1." },
      { id: "q7", type: "mcq", question: "If shelves collapse, the existing communities will likely:", options: ["Thrive", "Be displaced", "Migrate", "Adapt quickly"], answer: "Be displaced", explanation: "Para 3." },
      { id: "q8", type: "tfng", question: "Some researchers want formal protection for these habitats.", answer: "True", explanation: "Final paragraph." },
      { id: "q9", type: "tfng", question: "All sub-shelf species photosynthesise.", answer: "False", explanation: "Photosynthesis is impossible without light." },
      { id: "q10", type: "mcq", question: "Cameras revealed mainly which type of feeders?", options: ["Predators", "Filter-feeders", "Grazers", "Scavengers only"], answer: "Filter-feeders", explanation: "Para 1: sponges, anemones." },
      { id: "q11", type: "tfng", question: "Sponges may live for centuries.", answer: "True", explanation: "'Hundreds of years old.'" },
      { id: "q12", type: "completion", question: "Warmer ocean water is causing parts of the ice to ___.", answer: "thin", explanation: "Para 3." },
      { id: "q13", type: "tfng", question: "All scientists agree on how the ecosystems are sustained.", answer: "False", explanation: "It 'remains debated'." },
    ],
  },
  {
    id: "urban-forests",
    title: "Passage 5 – Cities of Trees",
    body:
      "Urban forests – the network of trees that line streets, fill parks and grow in private gardens – have become a serious area of municipal policy. A decade ago, planting trees was largely an aesthetic decision. Today, city planners treat tree canopy as critical infrastructure, on par with drainage or public lighting.\n\nThe shift is driven by evidence. Mature trees reduce local air temperatures by up to four degrees Celsius through shade and evapotranspiration. They intercept rainfall, easing pressure on stormwater systems, and absorb particulate matter that would otherwise reach human lungs. Singapore's long-running Garden City programme is often cited as a model: dense planting along expressways has measurably reduced heat-island intensity in the central business district.\n\nNot every city has achieved the same results. Audits in Los Angeles and Phoenix found that low-income neighbourhoods consistently had less than half the canopy cover of wealthier districts, exposing residents to greater heat stress during summer. In response, several US municipalities have introduced equity-weighted planting targets that direct new trees toward underserved blocks first.\n\nMaintenance, however, is the unglamorous half of the story. A young tree needs reliable watering for at least three years before it can survive on rainfall alone, and trees planted without sufficient soil volume rarely reach maturity. Experts now argue that funding canopy expansion without funding stewardship simply wastes money.",
    questions: [
      { id: "q1", type: "tfng", question: "City planners now view tree canopy as essential urban infrastructure.", answer: "True", explanation: "Para 1." },
      { id: "q2", type: "tfng", question: "Mature trees can lower local temperatures by as much as 4°C.", answer: "True", explanation: "Para 2." },
      { id: "q3", type: "completion", question: "Singapore's flagship greening initiative is the ____ City programme.", answer: "Garden", explanation: "Para 2." },
      { id: "q4", type: "mcq", question: "Audits in Los Angeles and Phoenix found that:", options: ["Wealthier areas had less canopy", "Canopy was distributed equally", "Low-income areas had under half the canopy of wealthy ones", "Canopy did not affect temperature"], answer: "Low-income areas had under half the canopy of wealthy ones", explanation: "Para 3." },
      { id: "q5", type: "tfng", question: "Equity-weighted planting prioritises wealthy districts.", answer: "False", explanation: "Para 3 – underserved blocks first." },
      { id: "q6", type: "completion", question: "Young trees need reliable watering for at least ____ years.", answer: "3", explanation: "Para 4." },
      { id: "q7", type: "tfng", question: "Trees absorb particulate matter that would reach human lungs.", answer: "True", explanation: "Para 2." },
      { id: "q8", type: "mcq", question: "The author calls maintenance the unglamorous half of the story because:", options: ["It is illegal", "Funding planting without stewardship wastes money", "Maintenance is cheap", "Trees do not need water"], answer: "Funding planting without stewardship wastes money", explanation: "Para 4." },
      { id: "q9", type: "tfng", question: "Singapore is given as an example of failed urban greening.", answer: "False", explanation: "It is cited as a model." },
      { id: "q10", type: "completion", question: "Trees intercept rainfall, easing pressure on ____ systems.", answer: "stormwater", explanation: "Para 2." },
      { id: "q11", type: "mcq", question: "Insufficient soil volume mainly causes trees to:", options: ["Grow faster", "Fail to reach maturity", "Produce more leaves", "Need less water"], answer: "Fail to reach maturity", explanation: "Para 4." },
      { id: "q12", type: "tfng", question: "A decade ago tree planting was mainly an aesthetic choice.", answer: "True", explanation: "Para 1." },
      { id: "q13", type: "tfng", question: "Heat stress falls disproportionately on wealthy neighbourhoods.", answer: "False", explanation: "Para 3." },
    ],
  },
  {
    id: "sourdough-science",
    title: "Passage 6 – The Science of Sourdough",
    body:
      "Sourdough is one of humanity's oldest fermented foods, predating commercial yeast by thousands of years. Unlike bread leavened with a single industrial strain, a sourdough starter is a self-sustaining ecosystem of wild yeasts and lactic acid bacteria. The combination produces both the lift of conventional bread and the tang that gives sourdough its character.\n\nThe revival of home baking during the pandemic put renewed scientific attention on these microbial cultures. Researchers at North Carolina State University analysed more than five hundred starters sent in by bakers across forty countries. To their surprise, geography had only a modest effect on which microbes dominated; the baker's own hands, the flour, and the temperature of the kitchen mattered far more. Cooler kitchens favoured slower-acting yeasts and produced more complex flavours.\n\nFor commercial bakers, the appeal extends beyond taste. The long fermentation that sourdough requires breaks down a portion of the gluten and phytic acid in the flour, making the bread easier to digest and increasing the bioavailability of minerals such as iron and zinc. Several recent clinical trials have suggested that some people who report sensitivity to wheat tolerate true sourdough better than fast-fermented loaves, although coeliac patients still need to avoid it entirely.\n\nThere remains no industry-wide definition of what counts as sourdough. In countries without a legal standard, supermarkets sometimes market loaves containing commercial yeast and a small amount of starter as the genuine article. Bakers' associations in France, Germany and Australia are now lobbying for stricter labelling rules.",
    questions: [
      { id: "q1", type: "tfng", question: "Sourdough is older than commercially produced yeast.", answer: "True", explanation: "Para 1." },
      { id: "q2", type: "mcq", question: "A sourdough starter contains:", options: ["A single yeast strain", "Wild yeasts and lactic acid bacteria", "Only bacteria", "Only mould"], answer: "Wild yeasts and lactic acid bacteria", explanation: "Para 1." },
      { id: "q3", type: "completion", question: "The North Carolina study analysed more than ____ starters.", answer: "500", explanation: "Para 2 – 'more than five hundred'." },
      { id: "q4", type: "tfng", question: "Geography was the single most important factor in starter composition.", answer: "False", explanation: "Para 2 – modest effect only." },
      { id: "q5", type: "mcq", question: "Cooler kitchens tended to produce:", options: ["Faster yeasts and milder flavour", "Slower yeasts and more complex flavour", "No fermentation", "Identical results to warm kitchens"], answer: "Slower yeasts and more complex flavour", explanation: "Para 2." },
      { id: "q6", type: "tfng", question: "Long fermentation can make minerals in flour more available to the body.", answer: "True", explanation: "Para 3." },
      { id: "q7", type: "tfng", question: "People with coeliac disease can safely eat true sourdough.", answer: "False", explanation: "Para 3 – must avoid entirely." },
      { id: "q8", type: "completion", question: "Fermentation breaks down a portion of the gluten and ____ acid in flour.", answer: "phytic", explanation: "Para 3." },
      { id: "q9", type: "mcq", question: "Why are bakers' associations lobbying for stricter labelling?", options: ["To raise prices", "Because there is no industry-wide definition of sourdough", "To ban commercial yeast", "To export more bread"], answer: "Because there is no industry-wide definition of sourdough", explanation: "Para 4." },
      { id: "q10", type: "tfng", question: "Some supermarkets label loaves containing commercial yeast as sourdough.", answer: "True", explanation: "Para 4." },
      { id: "q11", type: "tfng", question: "Sourdough lacks the lift of conventional bread.", answer: "False", explanation: "Para 1 – it provides both lift and tang." },
      { id: "q12", type: "completion", question: "Researchers found that the baker's own ____ influenced microbial makeup.", answer: "hands", explanation: "Para 2." },
      { id: "q13", type: "mcq", question: "Which countries are pushing for stricter sourdough labelling?", options: ["UK, USA, Canada", "France, Germany, Australia", "Italy, Spain, Greece", "Japan, China, Korea"], answer: "France, Germany, Australia", explanation: "Para 4." },
    ],
  },
  {
    id: "ai-classroom",
    title: "Passage 7 – AI Enters the Classroom",
    body:
      "When generative AI tools became widely available, schools reacted in starkly different ways. Several large districts in the United States and Australia issued blanket bans, citing fears of plagiarism. Within eighteen months most of those bans had quietly been reversed, replaced by policies that try to integrate the technology rather than exclude it.\n\nThe pivot reflects a growing body of classroom research. A controlled study across twelve secondary schools in the United Kingdom assigned half of the students an AI writing assistant for essay drafting and gave the other half conventional teacher feedback only. The AI-assisted group produced essays that were judged more coherent on average, but they also showed weaker recall of source material a month later, suggesting that learning had been outsourced as much as supported.\n\nTeachers who use AI most effectively, the researchers found, do not let students generate full answers. Instead, they ask the model to play roles – a sceptical reader, a Victorian novelist, a maths tutor that refuses to give direct answers. Used this way, the tool becomes a conversational partner rather than a shortcut, and students retain ownership of their reasoning.\n\nQuestions of access remain unresolved. Premium versions of the most capable models cost more than many school budgets allow, and home access varies dramatically by household income. Without deliberate policy, AI risks widening the very gaps in educational opportunity that proponents hope it will close.",
    questions: [
      { id: "q1", type: "tfng", question: "Most early school bans on generative AI have been reversed.", answer: "True", explanation: "Para 1." },
      { id: "q2", type: "completion", question: "The UK study covered ____ secondary schools.", answer: "12", explanation: "Para 2 – twelve." },
      { id: "q3", type: "mcq", question: "Essays from the AI-assisted group were judged:", options: ["Less coherent", "More coherent on average", "Identical in quality", "Always plagiarised"], answer: "More coherent on average", explanation: "Para 2." },
      { id: "q4", type: "tfng", question: "AI-assisted students remembered the source material better a month later.", answer: "False", explanation: "Para 2 – weaker recall." },
      { id: "q5", type: "mcq", question: "Effective teachers use AI to:", options: ["Generate full student answers", "Replace teacher feedback", "Play roles such as a sceptical reader", "Mark exams"], answer: "Play roles such as a sceptical reader", explanation: "Para 3." },
      { id: "q6", type: "tfng", question: "Used as a conversational partner, AI helps students keep ownership of their reasoning.", answer: "True", explanation: "Para 3." },
      { id: "q7", type: "completion", question: "Premium models often cost more than many school ____ allow.", answer: "budgets", explanation: "Para 4." },
      { id: "q8", type: "tfng", question: "Access to AI at home is similar across income levels.", answer: "False", explanation: "Para 4 – varies dramatically." },
      { id: "q9", type: "mcq", question: "Without deliberate policy, AI may:", options: ["Eliminate all inequality", "Widen educational opportunity gaps", "Replace teachers", "Lower test scores universally"], answer: "Widen educational opportunity gaps", explanation: "Para 4." },
      { id: "q10", type: "tfng", question: "Blanket bans were originally justified by plagiarism concerns.", answer: "True", explanation: "Para 1." },
      { id: "q11", type: "completion", question: "Researchers say learning was partly ____ rather than supported.", answer: "outsourced", explanation: "Para 2." },
      { id: "q12", type: "tfng", question: "The article concludes AI has no place in education.", answer: "False", explanation: "It supports thoughtful integration." },
      { id: "q13", type: "mcq", question: "The shift in school policy has happened over roughly:", options: ["6 months", "18 months", "5 years", "A decade"], answer: "18 months", explanation: "Para 1." },
    ],
  },
];
