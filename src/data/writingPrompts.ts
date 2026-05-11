export type WritingCategory = "education" | "environment" | "technology" | "society" | "health" | "general";
export type ChartKind = "bar" | "pie" | "line" | "table";

export interface WritingPrompt {
  id: string;
  task: 1 | 2;
  prompt: string;
  minWords: number;
  minutes: number;
  category?: WritingCategory;
  chart?: ChartKind;
}

export const writingPrompts: WritingPrompt[] = [
  // ===== Task 1 (with charts) =====
  {
    id: "t1-bar-devices",
    task: 1,
    chart: "bar",
    prompt:
      "The bar chart below shows the percentage of households in three countries that owned smartphones, laptops and smart TVs in 2010 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t1-pie-energy",
    task: 1,
    chart: "pie",
    prompt:
      "The pie chart below shows the breakdown of electricity generation by source in a European country in 2023. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t1-line-temperature",
    task: 1,
    chart: "line",
    prompt:
      "The line graph below shows the average annual temperature in a major city between 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t1-table-tourism",
    task: 1,
    chart: "table",
    prompt:
      "The table below shows the number of international tourists (in millions) visiting four countries in 2000, 2010 and 2020. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    minutes: 20,
  },

  // ===== Task 2 by category =====
  {
    id: "t2-edu-funding",
    task: 2,
    category: "education",
    prompt:
      "In many countries, university education is becoming increasingly expensive. To what extent should governments fund higher education? Give reasons and examples.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-edu-online",
    task: 2,
    category: "education",
    prompt:
      "Some people believe online learning will eventually replace traditional classrooms. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-env-plastic",
    task: 2,
    category: "environment",
    prompt:
      "Plastic waste is a major environmental problem. What are the most effective ways governments and individuals can reduce plastic pollution?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-env-cars",
    task: 2,
    category: "environment",
    prompt:
      "Some people argue that private car use should be heavily restricted in city centres to reduce pollution. Do you agree or disagree?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-tech-life",
    task: 2,
    category: "technology",
    prompt:
      "Some people believe that technology has made our lives more complicated, while others think it has made them easier. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-tech-ai",
    task: 2,
    category: "technology",
    prompt:
      "Artificial intelligence is increasingly used in workplaces. Do the benefits outweigh the drawbacks?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-soc-family",
    task: 2,
    category: "society",
    prompt:
      "In many countries, the traditional extended family is being replaced by smaller, nuclear families. What are the causes and effects of this change?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-soc-crime",
    task: 2,
    category: "society",
    prompt:
      "Some people think harsher punishments are the best way to reduce crime. Others believe education and social programmes are more effective. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-health-sugar",
    task: 2,
    category: "health",
    prompt:
      "Governments in some countries impose taxes on sugary drinks to improve public health. Is this an effective approach? Give reasons and examples.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-health-exercise",
    task: 2,
    category: "health",
    prompt:
      "Many people lead increasingly sedentary lifestyles. What are the main causes, and how can individuals and societies encourage more physical activity?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-edu-language",
    task: 2,
    category: "education",
    prompt:
      "Some experts believe that children should start learning a foreign language at primary school rather than secondary school. Do the advantages outweigh the disadvantages?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-tech-privacy",
    task: 2,
    category: "technology",
    prompt:
      "Modern technology allows governments and companies to monitor individuals more closely than ever before. Is this a positive or negative development?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-env-renewable",
    task: 2,
    category: "environment",
    prompt:
      "Some people argue that investing in renewable energy is the most effective way to fight climate change, while others believe that reducing consumption matters more. Discuss both views and give your opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-soc-work",
    task: 2,
    category: "society",
    prompt:
      "In some countries, the average working week is becoming longer. What are the effects of this trend on individuals and society?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-health-mental",
    task: 2,
    category: "health",
    prompt:
      "Mental health problems among young people have risen sharply in recent years. What do you think are the main causes, and what can be done to address them?",
    minWords: 250,
    minutes: 40,
  },
];
