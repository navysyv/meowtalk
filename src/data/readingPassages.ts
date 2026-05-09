export interface ReadingQuestion {
  id: string;
  type: "tfng" | "mcq" | "completion";
  question: string;
  options?: string[];
  answer: string;
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
      { id: "q1", type: "tfng", question: "Honeybees pollinate around one third of human food crops.", answer: "True" },
      { id: "q2", type: "tfng", question: "Colony Collapse Disorder is caused by a single factor.", answer: "False" },
      { id: "q3", type: "tfng", question: "All European countries have banned neonicotinoid pesticides.", answer: "Not Given" },
      { id: "q4", type: "mcq", question: "Bees in diverse floral environments tend to have:", options: ["Weaker colonies", "Stronger immune responses", "Higher mite infestation", "Smaller hives"], answer: "Stronger immune responses" },
      { id: "q5", type: "completion", question: "Urban beekeeping has thrived in places like rooftop gardens in ____.", answer: "Paris" },
    ],
  },
  {
    id: "sleep",
    title: "Why We Sleep",
    body:
      "For decades, sleep was considered a passive state in which the brain simply rested. Modern neuroscience has overturned that view. Sleep is now understood as an active period during which the brain consolidates memory, clears metabolic waste, and regulates emotional processing. The discovery of the glymphatic system in 2013, a network of channels that flush toxins from neural tissue during deep sleep, has reshaped how researchers think about chronic sleep deprivation.\n\nAdults who consistently sleep fewer than six hours per night show measurable declines in attention, decision-making, and immune function. Long-term studies link insufficient sleep to higher risk of cardiovascular disease and Alzheimer's. However, the optimal duration is not identical for every person; genetic variation accounts for some of the differences in sleep need.\n\nEducators have begun to act on this evidence. Several school districts in the United States have shifted high school start times later, citing improved attendance and academic performance. The cultural assumption that less sleep equals greater productivity, researchers argue, is finally beginning to fade.",
    questions: [
      { id: "q1", type: "tfng", question: "The brain is inactive during sleep.", answer: "False" },
      { id: "q2", type: "tfng", question: "The glymphatic system was discovered before 2010.", answer: "False" },
      { id: "q3", type: "tfng", question: "Everyone needs exactly the same amount of sleep.", answer: "False" },
      { id: "q4", type: "mcq", question: "Sleeping fewer than six hours is linked to:", options: ["Better focus", "Stronger immunity", "Cardiovascular disease risk", "Increased lifespan"], answer: "Cardiovascular disease risk" },
      { id: "q5", type: "completion", question: "Some US school districts moved high school start times ____.", answer: "later" },
    ],
  },
];