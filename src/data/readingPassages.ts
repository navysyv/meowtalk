export interface ReadingQuestion {
  id: string;
  type: "tfng" | "mcq" | "completion";
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

export const readingPassages: ReadingPassage[] = [
  {
    id: "honeybees",
    title: "The Decline of Honeybees",
    body:
      "Honeybees play a critical role in global agriculture, pollinating roughly one third of the food crops humans consume. Yet over the past two decades, beekeepers across Europe and North America have reported alarming declines in colony numbers, a phenomenon often referred to as Colony Collapse Disorder (CCD). Researchers have identified a combination of factors behind these losses, including the widespread use of neonicotinoid pesticides, habitat loss caused by industrial farming, and the spread of the parasitic Varroa mite.\n\nDespite the seriousness of the problem, recent initiatives offer cautious optimism. Several European countries have banned the most harmful pesticides outright, and urban beekeeping movements have helped re-establish pollinator populations in unexpected places, from rooftop gardens in Paris to community parks in Toronto. Scientists at the University of Reading also report that bees raised in diverse floral environments show stronger immune responses than those kept near monoculture farms.\n\nStill, experts caution that without sustained policy intervention and farmer cooperation, honeybee populations will remain under threat. The challenge, as one researcher notes, is not merely to save the bees, but to redesign the agricultural systems that depend on them.",
    questions: [
      { id: "q1", type: "tfng", question: "Honeybees pollinate around one third of human food crops.", answer: "True", explanation: "Para 1: 'pollinating roughly one third of the food crops'." },
      { id: "q2", type: "tfng", question: "Colony Collapse Disorder is caused by a single factor.", answer: "False", explanation: "Para 1 lists multiple factors: pesticides, habitat loss, Varroa mite." },
      { id: "q3", type: "tfng", question: "All European countries have banned neonicotinoid pesticides.", answer: "Not Given", explanation: "Only 'several' countries are mentioned, not all." },
      { id: "q4", type: "mcq", question: "Bees in diverse floral environments tend to have:", options: ["Weaker colonies", "Stronger immune responses", "Higher mite infestation", "Smaller hives"], answer: "Stronger immune responses", explanation: "Para 2: 'stronger immune responses than those kept near monoculture farms'." },
      { id: "q5", type: "completion", question: "Urban beekeeping has thrived in places like rooftop gardens in ____.", answer: "Paris", explanation: "Para 2 cites 'rooftop gardens in Paris'." },
    ],
  },
  {
    id: "sleep",
    title: "Why We Sleep",
    body:
      "For decades, sleep was considered a passive state in which the brain simply rested. Modern neuroscience has overturned that view. Sleep is now understood as an active period during which the brain consolidates memory, clears metabolic waste, and regulates emotional processing. The discovery of the glymphatic system in 2013, a network of channels that flush toxins from neural tissue during deep sleep, has reshaped how researchers think about chronic sleep deprivation.\n\nAdults who consistently sleep fewer than six hours per night show measurable declines in attention, decision-making, and immune function. Long-term studies link insufficient sleep to higher risk of cardiovascular disease and Alzheimer's. However, the optimal duration is not identical for every person; genetic variation accounts for some of the differences in sleep need.\n\nEducators have begun to act on this evidence. Several school districts in the United States have shifted high school start times later, citing improved attendance and academic performance. The cultural assumption that less sleep equals greater productivity, researchers argue, is finally beginning to fade.",
    questions: [
      { id: "q1", type: "tfng", question: "The brain is inactive during sleep.", answer: "False", explanation: "Modern neuroscience overturned that view." },
      { id: "q2", type: "tfng", question: "The glymphatic system was discovered before 2010.", answer: "False", explanation: "It was discovered in 2013." },
      { id: "q3", type: "tfng", question: "Everyone needs exactly the same amount of sleep.", answer: "False", explanation: "Optimal duration varies by genetics." },
      { id: "q4", type: "mcq", question: "Sleeping fewer than six hours is linked to:", options: ["Better focus", "Stronger immunity", "Cardiovascular disease risk", "Increased lifespan"], answer: "Cardiovascular disease risk", explanation: "Para 2: 'higher risk of cardiovascular disease'." },
      { id: "q5", type: "completion", question: "Some US school districts moved high school start times ____.", answer: "later", explanation: "Para 3: 'shifted high school start times later'." },
    ],
  },
  {
    id: "great-wall",
    title: "Building the Great Wall",
    body:
      "Contrary to popular belief, the Great Wall of China is not a single continuous structure but a series of fortifications built across more than two thousand years. The earliest sections were constructed in the 7th century BC by warring states. The wall reached its largest extent under the Ming dynasty (1368–1644), when most of the surviving stone and brick sections were built. Estimates of its total length, including all branches, exceed 21,000 kilometres.\n\nWhile the wall was effective at slowing nomadic raids, historians argue that its symbolic power often outweighed its military utility. Many sections were abandoned shortly after construction. Today, only about 30 percent of the Ming-era wall remains in good condition; the rest has eroded or been dismantled for building materials.",
    questions: [
      { id: "q1", type: "tfng", question: "The Great Wall is one continuous structure.", answer: "False", explanation: "It is 'a series of fortifications', not continuous." },
      { id: "q2", type: "tfng", question: "Most surviving stone sections date to the Ming dynasty.", answer: "True", explanation: "Most surviving sections were built under the Ming." },
      { id: "q3", type: "mcq", question: "Total length including branches exceeds:", options: ["10,000 km", "15,000 km", "21,000 km", "30,000 km"], answer: "21,000 km", explanation: "Estimates exceed 21,000 km." },
      { id: "q4", type: "completion", question: "Around ____ percent of the Ming-era wall remains in good condition.", answer: "30", explanation: "About 30 percent remains in good condition." },
    ],
  },
  {
    id: "coffee",
    title: "The Global Journey of Coffee",
    body:
      "Coffee originated in the highlands of Ethiopia, where legend holds that a goat herder noticed his animals becoming energetic after eating bright red berries. By the 15th century, coffee was being cultivated in Yemen and consumed in Sufi monasteries to help worshippers stay awake during long prayers. From there it spread through the Ottoman Empire and reached Europe in the 17th century, sparking the rise of coffeehouses in cities such as Vienna, Paris and London.\n\nToday, coffee is the second most traded commodity in the world after oil. Brazil is the largest producer, growing roughly a third of global supply, while Finland leads in per-capita consumption. The industry, however, faces serious challenges from climate change, with rising temperatures threatening the narrow band of tropical regions in which Arabica thrives.",
    questions: [
      { id: "q1", type: "tfng", question: "Coffee originated in Yemen.", answer: "False", explanation: "It originated in Ethiopia." },
      { id: "q2", type: "tfng", question: "Coffeehouses appeared in Europe in the 17th century.", answer: "True", explanation: "Reached Europe in the 17th century." },
      { id: "q3", type: "mcq", question: "The world's largest producer of coffee is:", options: ["Ethiopia", "Vietnam", "Brazil", "Colombia"], answer: "Brazil", explanation: "Brazil grows roughly a third of supply." },
      { id: "q4", type: "mcq", question: "Country with highest per-capita consumption:", options: ["Italy", "USA", "Finland", "Brazil"], answer: "Finland", explanation: "Finland leads per-capita consumption." },
      { id: "q5", type: "completion", question: "Arabica is threatened by ____ change.", answer: "climate", explanation: "Climate change threatens Arabica." },
    ],
  },
  {
    id: "venice",
    title: "Saving Venice",
    body:
      "The Italian city of Venice, built across more than a hundred small islands in a shallow lagoon, has fascinated travellers for centuries. Yet rising sea levels and the gradual sinking of its wooden foundations now threaten its survival. Acqua alta, or \"high water\", once a rare event, today floods St Mark's Square dozens of times each winter.\n\nIn 2020, the long-delayed MOSE project finally entered service. The system uses a series of mobile barriers at the lagoon's three entrances, which can be raised within thirty minutes when an exceptional tide is forecast. Engineers credit MOSE with preventing several catastrophic floods, although critics point to its enormous cost and the maintenance challenges of operating moving steel gates in salt water.\n\nVenice's troubles, however, are not only environmental. Mass tourism has emptied many neighbourhoods of permanent residents, and the local population has fallen below 50,000 for the first time in modern history. Authorities have begun charging day-trippers a small entry fee in an attempt to manage crowds and fund preservation.",
    questions: [
      { id: "q1", type: "tfng", question: "Acqua alta floods St Mark's Square many times each winter.", answer: "True", explanation: "Para 1: 'floods St Mark's Square dozens of times each winter'." },
      { id: "q2", type: "tfng", question: "The MOSE project began operating in 2010.", answer: "False", explanation: "It entered service in 2020." },
      { id: "q3", type: "mcq", question: "MOSE barriers can be raised in:", options: ["10 minutes", "30 minutes", "1 hour", "2 hours"], answer: "30 minutes", explanation: "Para 2: 'raised within thirty minutes'." },
      { id: "q4", type: "tfng", question: "Venice's permanent population has grown in recent years.", answer: "False", explanation: "It fell below 50,000 for the first time in modern history." },
      { id: "q5", type: "completion", question: "Day-trippers are now charged a small entry ____.", answer: "fee", explanation: "Para 3: 'charging day-trippers a small entry fee'." },
    ],
  },
  {
    id: "ai-jobs",
    title: "Artificial Intelligence and the Future of Work",
    body:
      "Few topics provoke as much debate as the impact of artificial intelligence on employment. Some economists predict that automation will displace millions of jobs in transport, manufacturing and routine office work within the next two decades. Others argue that, like previous waves of technology, AI will ultimately create more roles than it eliminates, particularly in fields that require creativity, empathy or complex judgement.\n\nA 2023 OECD report concluded that around 27 percent of jobs in member countries are at high risk of automation, with eastern European economies most exposed. However, the same report stressed that risk does not equal inevitability: the speed of change depends heavily on regulation, retraining programmes and the cost of adopting AI tools.\n\nWorkers in healthcare, education and skilled trades appear comparatively safe, while jobs that involve repetitive language tasks – customer support scripts, basic translation, simple legal drafting – are already being reshaped by large language models. Most experts agree that lifelong learning will become essential rather than optional.",
    questions: [
      { id: "q1", type: "mcq", question: "According to the OECD report, what percentage of jobs face high automation risk?", options: ["10%", "27%", "45%", "60%"], answer: "27%", explanation: "Around 27 percent of jobs in member countries." },
      { id: "q2", type: "tfng", question: "Eastern European economies are the least exposed to automation.", answer: "False", explanation: "They are 'most exposed', not least." },
      { id: "q3", type: "tfng", question: "Healthcare jobs are seen as relatively safe from automation.", answer: "True", explanation: "Para 3 lists healthcare as comparatively safe." },
      { id: "q4", type: "tfng", question: "All economists agree AI will destroy more jobs than it creates.", answer: "False", explanation: "Some argue AI will create more roles than it eliminates." },
      { id: "q5", type: "completion", question: "The report says ____ learning will become essential.", answer: "lifelong", explanation: "Para 3: 'lifelong learning will become essential'." },
    ],
  },
  {
    id: "amazon",
    title: "The Amazon Rainforest",
    body:
      "Covering more than 5.5 million square kilometres across nine countries, the Amazon is the largest tropical rainforest on the planet. It produces around 6 percent of the world's oxygen and stores vast amounts of carbon in its trees and soils. Scientists estimate that one in ten of all known species lives within its borders, including thousands not yet formally described.\n\nDeforestation, however, has accelerated alarmingly. Between 2000 and 2020, an area roughly the size of France was lost, mainly to cattle ranching, soy farming and illegal logging. Studies suggest that if forest loss exceeds about 20 to 25 percent of the original area, parts of the Amazon could shift permanently from rainforest to dry savanna – a process known as a tipping point.\n\nIndigenous communities, who manage roughly a third of the remaining forest, have proven remarkably effective stewards: deforestation rates inside indigenous territories are far lower than in surrounding regions. International funding mechanisms increasingly recognise their role.",
    questions: [
      { id: "q1", type: "mcq", question: "Roughly what fraction of known species lives in the Amazon?", options: ["1 in 4", "1 in 10", "1 in 20", "1 in 50"], answer: "1 in 10", explanation: "One in ten of all known species." },
      { id: "q2", type: "tfng", question: "An area the size of France was lost between 2000 and 2020.", answer: "True", explanation: "Para 2 states this directly." },
      { id: "q3", type: "tfng", question: "Soy farming is one of the main drivers of deforestation.", answer: "True", explanation: "Listed alongside cattle ranching and illegal logging." },
      { id: "q4", type: "completion", question: "A permanent shift from rainforest to dry savanna is called a ____ point.", answer: "tipping", explanation: "Para 2 names it the 'tipping point'." },
      { id: "q5", type: "tfng", question: "Deforestation rates are higher inside indigenous territories.", answer: "False", explanation: "They are 'far lower'." },
    ],
  },
  {
    id: "antibiotics",
    title: "The Discovery of Antibiotics",
    body:
      "Before the 20th century, even minor wounds could prove fatal. The accidental discovery of penicillin by Alexander Fleming in 1928 transformed medicine, although it took more than a decade and the work of researchers Howard Florey and Ernst Chain in Oxford to turn the mould into a usable drug. By the end of the Second World War, mass production of penicillin in the United States had saved tens of thousands of soldiers' lives.\n\nIn the decades that followed, dozens of new classes of antibiotics were developed, dramatically reducing deaths from infectious disease. Yet over-prescription in human medicine and intensive use in livestock farming have created a serious problem: bacteria resistant to multiple drugs. The World Health Organization now considers antimicrobial resistance one of the top ten global health threats.\n\nDeveloping new antibiotics is slow and unprofitable, so several governments have begun offering financial incentives to pharmaceutical companies. Researchers are also exploring alternatives such as bacteriophage therapy, which uses viruses that attack specific bacteria.",
    questions: [
      { id: "q1", type: "completion", question: "Penicillin was discovered by ____ in 1928.", answer: "Fleming", explanation: "Alexander Fleming discovered it in 1928." },
      { id: "q2", type: "mcq", question: "Who turned the mould into a usable drug?", options: ["Pasteur and Koch", "Florey and Chain", "Watson and Crick", "Salk and Sabin"], answer: "Florey and Chain", explanation: "Para 1: Howard Florey and Ernst Chain." },
      { id: "q3", type: "tfng", question: "Antimicrobial resistance is in the WHO's top ten global health threats.", answer: "True", explanation: "Para 2 states this." },
      { id: "q4", type: "tfng", question: "Developing new antibiotics is highly profitable.", answer: "False", explanation: "Para 3: 'slow and unprofitable'." },
      { id: "q5", type: "completion", question: "An alternative therapy uses viruses called ____.", answer: "bacteriophage", explanation: "Bacteriophage therapy uses viruses that attack bacteria." },
    ],
  },
];
