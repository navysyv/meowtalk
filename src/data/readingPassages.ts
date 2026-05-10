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
];
