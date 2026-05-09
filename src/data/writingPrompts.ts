export interface WritingPrompt {
  id: string;
  task: 1 | 2;
  prompt: string;
  minWords: number;
  minutes: number;
}

export const writingPrompts: WritingPrompt[] = [
  {
    id: "t1-chart",
    task: 1,
    prompt:
      "The chart below shows the percentage of households in three countries that owned different electronic devices (smartphone, laptop, smart TV) in 2010 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    minutes: 20,
  },
  {
    id: "t2-tech",
    task: 2,
    prompt:
      "Some people believe that technology has made our lives more complicated, while others think it has made them easier. Discuss both views and give your own opinion.",
    minWords: 250,
    minutes: 40,
  },
  {
    id: "t2-edu",
    task: 2,
    prompt:
      "In many countries, university education is becoming increasingly expensive. To what extent should governments fund higher education? Give reasons and examples.",
    minWords: 250,
    minutes: 40,
  },
];