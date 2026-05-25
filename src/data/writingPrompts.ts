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
  {
    id: "t1-bar-energy-use",
    task: 1,
    chart: "bar",
    prompt:
      "The bar chart below compares average household energy consumption (kWh) for heating, cooling and appliances in four cities in 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t1-line-population",
    task: 1,
    chart: "line",
    prompt:
      "The line graph below shows the population (in millions) of three Asian capital cities between 1970 and 2020. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t2-edu-creativity",
    task: 2,
    category: "education",
    prompt:
      "Some educators argue that schools should focus more on creativity and the arts, while others believe academic subjects deserve priority. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-soc-cities",
    task: 2,
    category: "society",
    prompt:
      "More and more people are moving from rural areas to large cities. What are the advantages and disadvantages of this trend?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-tech-remote",
    task: 2,
    category: "technology",
    prompt:
      "Remote working has become widespread thanks to digital technology. Do the benefits for employees and companies outweigh the drawbacks?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-env-meat",
    task: 2,
    category: "environment",
    prompt:
      "Some people believe reducing meat consumption is essential to fight climate change. Others argue that individual diet has little impact compared with industrial change. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-health-screen",
    task: 2,
    category: "health",
    prompt:
      "Children today spend many hours each day on screens. What are the effects of this on their physical and mental wellbeing, and what can parents do to manage it?",
    minWords: 250,
    minutes: 40,
  },
  // ===== Extended pool =====
  {
    id: "t1-line-population",
    task: 1,
    chart: "line",
    prompt:
      "The line graph below shows the population of three cities between 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t1-bar-transport",
    task: 1,
    chart: "bar",
    prompt:
      "The bar chart below compares the percentage of commuters using cars, public transport and bicycles in four European cities in 2022. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t1-pie-budget",
    task: 1,
    chart: "pie",
    prompt:
      "The pie chart below shows how a typical household in your country spends its monthly income. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t1-table-water",
    task: 1,
    chart: "table",
    prompt:
      "The table below shows the average daily water consumption per person (in litres) across five regions in 2000 and 2020. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t2-tech-remote",
    task: 2,
    category: "technology",
    prompt:
      "Remote work has become common in many industries. Do the benefits of working from home outweigh the disadvantages? Give reasons and examples from your own experience.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-env-plastic",
    task: 2,
    category: "environment",
    prompt:
      "Some people believe individual consumers are responsible for solving the plastic waste crisis, while others argue governments and corporations must lead. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-society-cashless",
    task: 2,
    category: "society",
    prompt:
      "Many countries are moving towards a cashless society. What are the advantages and disadvantages of this trend?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-edu-online",
    task: 2,
    category: "education",
    prompt:
      "Online learning has become increasingly popular at all levels of education. To what extent do you think it can replace traditional classroom learning?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-health-fastfood",
    task: 2,
    category: "health",
    prompt:
      "Some governments are considering placing higher taxes on fast food to discourage unhealthy eating. Do you think this is an effective approach? What other measures could be taken?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-general-travel",
    task: 2,
    category: "general",
    prompt:
      "International tourism has grown rapidly in recent decades. What are the positive and negative effects of mass tourism on local communities, and how can these be managed?",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-tech-ai-jobs",
    task: 2,
    category: "technology",
    prompt:
      "Some people fear that automation and artificial intelligence will eliminate many jobs. Others believe new types of work will emerge. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-society-aging",
    task: 2,
    category: "society",
    prompt:
      "In many countries the proportion of older people is steadily increasing. What problems does this trend cause, and what solutions can you suggest?",
    minWords: 250,
    minutes: 40,
  },
  // ===== Batch 2: +50 prompts =====
  { id: "t1-bar-graduates", task: 1, chart: "bar", prompt: "The bar chart below shows the percentage of university graduates in five subject areas in 2005 and 2022 in one European country. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.", minWords: 150, minutes: 20 },
  { id: "t1-line-internet", task: 1, chart: "line", prompt: "The line graph below shows the percentage of households with internet access in four countries between 2000 and 2022. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-pie-waste", task: 1, chart: "pie", prompt: "The pie charts below show how household waste was disposed of in a city in 2000 and 2020. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-table-income", task: 1, chart: "table", prompt: "The table below shows average monthly household income (in USD) across five regions of a country in 2010 and 2020. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-bar-sports-participation", task: 1, chart: "bar", prompt: "The bar chart below shows the percentage of adults who participated regularly in four sports in three age groups in 2022. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-line-co2", task: 1, chart: "line", prompt: "The line graph below shows CO2 emissions per capita (in tonnes) in four countries between 1990 and 2020. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-pie-transport-modes", task: 1, chart: "pie", prompt: "The pie chart below shows the share of trips taken by different modes of transport in a city in 2023. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-table-fruit-consumption", task: 1, chart: "table", prompt: "The table below shows annual per-person consumption of five fruits (in kilograms) in three countries in 2022. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-bar-spending-leisure", task: 1, chart: "bar", prompt: "The bar chart below compares average weekly household spending on leisure activities in four age groups in 2022. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t1-line-life-expectancy", task: 1, chart: "line", prompt: "The line graph below shows life expectancy at birth in three regions of the world between 1960 and 2020. Summarise the information by selecting and reporting the main features.", minWords: 150, minutes: 20 },
  { id: "t2-edu-homework", task: 2, category: "education", prompt: "Some people believe that children today are given too much homework, while others argue that homework is essential for learning. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-edu-uniforms", task: 2, category: "education", prompt: "In many schools, students are required to wear uniforms. Do the advantages of school uniforms outweigh the disadvantages?", minWords: 250, minutes: 40 },
  { id: "t2-edu-exams", task: 2, category: "education", prompt: "Some educators argue that frequent examinations are essential to measure student progress, while others believe they put too much pressure on learners. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-edu-gap-year", task: 2, category: "education", prompt: "An increasing number of students take a gap year between finishing school and starting university. Do the benefits of taking a gap year outweigh the drawbacks?", minWords: 250, minutes: 40 },
  { id: "t2-edu-coed", task: 2, category: "education", prompt: "Some people think boys and girls should attend separate schools, while others believe mixed-gender schools are better for children's development. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-edu-vocational", task: 2, category: "education", prompt: "Some people believe vocational training should be promoted as much as university education. To what extent do you agree or disagree?", minWords: 250, minutes: 40 },
  { id: "t2-env-deforestation", task: 2, category: "environment", prompt: "Deforestation continues at an alarming rate in many parts of the world. What are the causes, and what actions can governments and citizens take?", minWords: 250, minutes: 40 },
  { id: "t2-env-water", task: 2, category: "environment", prompt: "Many regions of the world are facing serious water shortages. What are the main causes, and how can the problem be addressed?", minWords: 250, minutes: 40 },
  { id: "t2-env-zoos", task: 2, category: "environment", prompt: "Some people think zoos are useful for conservation and education, while others believe wild animals should not be kept in captivity. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-env-recycling", task: 2, category: "environment", prompt: "Some argue that recycling should be mandatory by law, while others say it should remain a personal choice. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-env-air-pollution", task: 2, category: "environment", prompt: "Air pollution in large cities has become a serious health concern. What are the main causes, and what measures could improve air quality?", minWords: 250, minutes: 40 },
  { id: "t2-env-fast-fashion", task: 2, category: "environment", prompt: "Fast fashion has made clothing cheaper and more accessible, but it also creates large amounts of waste. Do the benefits of fast fashion outweigh the drawbacks?", minWords: 250, minutes: 40 },
  { id: "t2-tech-social-media", task: 2, category: "technology", prompt: "Some people think social media brings people closer together, while others believe it makes us more isolated. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-tech-cashless", task: 2, category: "technology", prompt: "Many countries are moving towards a cashless economy. Do the advantages outweigh the disadvantages?", minWords: 250, minutes: 40 },
  { id: "t2-tech-driverless", task: 2, category: "technology", prompt: "Driverless cars are expected to be common on roads within the next two decades. Is this a positive or negative development?", minWords: 250, minutes: 40 },
  { id: "t2-tech-screen-children", task: 2, category: "technology", prompt: "Some people argue that children under twelve should not have personal smartphones. To what extent do you agree or disagree?", minWords: 250, minutes: 40 },
  { id: "t2-tech-video-games", task: 2, category: "technology", prompt: "Video games are often blamed for problems in young people's lives, but some argue they have important benefits. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-tech-online-shopping", task: 2, category: "technology", prompt: "Online shopping is replacing traditional retail in many countries. What are the effects of this trend on consumers and high streets?", minWords: 250, minutes: 40 },
  { id: "t2-soc-volunteering", task: 2, category: "society", prompt: "Some people think young adults should be required to do a year of community service. To what extent do you agree or disagree?", minWords: 250, minutes: 40 },
  { id: "t2-soc-immigration", task: 2, category: "society", prompt: "Immigration has significant economic and cultural effects on a country. Do the benefits outweigh the challenges?", minWords: 250, minutes: 40 },
  { id: "t2-soc-marriage", task: 2, category: "society", prompt: "In many countries, people are getting married later in life or not at all. What are the causes, and what effects does this have on society?", minWords: 250, minutes: 40 },
  { id: "t2-soc-inequality", task: 2, category: "society", prompt: "The gap between the rich and the poor is widening in many countries. What are the main causes, and how can governments address it?", minWords: 250, minutes: 40 },
  { id: "t2-soc-museums", task: 2, category: "society", prompt: "Some people believe museums and art galleries should be free, while others argue visitors should pay an entrance fee. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-soc-public-transport", task: 2, category: "society", prompt: "Some governments are investing heavily in public transport rather than building more roads. Do the advantages of this approach outweigh the disadvantages?", minWords: 250, minutes: 40 },
  { id: "t2-soc-celebrities", task: 2, category: "society", prompt: "Celebrities often receive enormous attention from the media. Is this attention harmful to society or simply harmless entertainment?", minWords: 250, minutes: 40 },
  { id: "t2-health-vaccination", task: 2, category: "health", prompt: "Some people argue that childhood vaccinations should be compulsory. To what extent do you agree or disagree?", minWords: 250, minutes: 40 },
  { id: "t2-health-sleep", task: 2, category: "health", prompt: "Many adults today do not get enough sleep. What are the main causes, and what effects does this have on health and productivity?", minWords: 250, minutes: 40 },
  { id: "t2-health-workhours", task: 2, category: "health", prompt: "Some companies are introducing four-day work weeks for the same pay. Do the benefits of a shorter working week outweigh the drawbacks?", minWords: 250, minutes: 40 },
  { id: "t2-health-elderly-care", task: 2, category: "health", prompt: "Some people believe that elderly relatives should be cared for at home by their families, while others think professional care is better. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-health-junk-food-ads", task: 2, category: "health", prompt: "Advertising of unhealthy food to children should be banned, according to some health experts. To what extent do you agree or disagree?", minWords: 250, minutes: 40 },
  { id: "t2-general-reading", task: 2, category: "general", prompt: "Many people read less than in the past, preferring video and audio content. Is this a positive or negative development?", minWords: 250, minutes: 40 },
  { id: "t2-general-language-loss", task: 2, category: "general", prompt: "Many minority languages are disappearing around the world. Why is this happening, and should we try to prevent it?", minWords: 250, minutes: 40 },
  { id: "t2-general-space", task: 2, category: "general", prompt: "Some governments spend large amounts of money on space exploration. Is this a good use of public funds, or should the money be spent on more immediate problems on Earth?", minWords: 250, minutes: 40 },
  { id: "t2-general-museums-tech", task: 2, category: "general", prompt: "Some museums now use interactive technology to attract visitors. Do the advantages of using technology in museums outweigh the disadvantages?", minWords: 250, minutes: 40 },
  { id: "t2-general-charity", task: 2, category: "general", prompt: "Some people believe that giving to charity should always be anonymous, while others think public donations encourage more giving. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-general-handwriting", task: 2, category: "general", prompt: "With the rise of computers and smartphones, some say handwriting is no longer important. To what extent do you agree or disagree?", minWords: 250, minutes: 40 },
  { id: "t2-general-pets", task: 2, category: "general", prompt: "Some people argue that keeping pets has positive effects on children, while others believe it brings unnecessary responsibility. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
  { id: "t2-general-gift-giving", task: 2, category: "general", prompt: "In some cultures, giving expensive gifts on special occasions is expected. Is this tradition still appropriate today?", minWords: 250, minutes: 40 },
  { id: "t2-general-news", task: 2, category: "general", prompt: "Many people now get their news primarily from social media rather than traditional sources. What are the consequences of this shift?", minWords: 250, minutes: 40 },
  { id: "t2-general-second-language", task: 2, category: "general", prompt: "Some people believe everyone should learn at least one foreign language well, while others think it is unnecessary. Discuss both views and give your own opinion.", minWords: 250, minutes: 40 },
];
