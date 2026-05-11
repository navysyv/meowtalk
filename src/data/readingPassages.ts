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
];
