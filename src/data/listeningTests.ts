export interface ListeningQuestion {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
}

export interface ListeningTest {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  transcript: string;
  questions: ListeningQuestion[];
}

// Public-domain LibriVox / Wikimedia recordings used as IELTS-style listening practice.
export const listeningTests: ListeningTest[] = [
  {
    id: "section1-booking",
    title: "Section 1 – Hotel booking",
    description: "A short conversation about a hotel reservation.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/En-uk-listen.ogg",
    transcript:
      "Hello, my name is Sarah Wilson. I'd like to book a room for two nights starting on the fifteenth of June. We'll be three adults and one child. Could you also arrange airport pick-up at six in the evening?",
    questions: [
      { id: "q1", question: "Speaker's surname?", answer: "Wilson", explanation: "She introduces herself as 'Sarah Wilson'." },
      { id: "q2", question: "Number of nights?", answer: "2", explanation: "She books 'a room for two nights'." },
      { id: "q3", question: "Date of arrival?", answer: "15 June", explanation: "Starting on the fifteenth of June." },
      { id: "q4", question: "Number of adults?", answer: "3", explanation: "Three adults and one child." },
      { id: "q5", question: "Airport pick-up time?", answer: "6 pm", explanation: "Pick-up at six in the evening." },
    ],
  },
  {
    id: "section2-museum",
    title: "Section 2 – Museum tour info",
    description: "A short monologue about visiting a museum.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Wikipedia-en-Earth-article.ogg",
    transcript:
      "Welcome to the Natural History Museum. The dinosaur exhibition is on the second floor and is open from 10am to 5pm daily. Guided tours run every hour and last about 45 minutes. Tickets cost 12 pounds for adults and are free for children under 12.",
    questions: [
      { id: "q1", question: "Floor of dinosaur exhibition?", answer: "2", explanation: "It is on the second floor." },
      { id: "q2", question: "Tours run every ___?", answer: "hour", explanation: "Tours run every hour." },
      { id: "q3", question: "Tour length in minutes?", answer: "45", explanation: "Each tour lasts about 45 minutes." },
      { id: "q4", question: "Adult ticket price (£)?", answer: "12", explanation: "Twelve pounds for adults." },
      { id: "q5", question: "Free entry age limit?", answer: "12", explanation: "Free for children under 12." },
    ],
  },
  {
    id: "section3-tutorial",
    title: "Section 3 – Student tutorial",
    description: "A discussion between two students about a project.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/En-uk-test.ogg",
    transcript:
      "So for our research project we'll focus on renewable energy in coastal towns. We need to interview at least ten residents and submit the report by the thirtieth of November. The presentation will be twenty minutes long.",
    questions: [
      { id: "q1", question: "Project topic?", answer: "renewable energy", explanation: "They focus on renewable energy in coastal towns." },
      { id: "q2", question: "Minimum interviews?", answer: "10", explanation: "At least ten residents." },
      { id: "q3", question: "Report deadline?", answer: "30 November", explanation: "Submit by the thirtieth of November." },
      { id: "q4", question: "Presentation length (minutes)?", answer: "20", explanation: "The presentation will be twenty minutes." },
    ],
  },
  {
    id: "section4-lecture",
    title: "Section 4 – Academic lecture",
    description: "Excerpt from an academic lecture on geography.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Wikipedia-en-Earth-article.ogg",
    transcript:
      "Earth is the third planet from the Sun and the only known astronomical object to harbour life. About 71 percent of the surface is covered by water, mostly by oceans. The atmosphere consists primarily of nitrogen and oxygen.",
    questions: [
      { id: "q1", question: "Earth's position from the Sun?", answer: "3", explanation: "It is the third planet from the Sun." },
      { id: "q2", question: "Percentage covered by water?", answer: "71", explanation: "About 71 percent is water." },
      { id: "q3", question: "Main atmospheric gas?", answer: "nitrogen", explanation: "Atmosphere is primarily nitrogen and oxygen, nitrogen being dominant." },
      { id: "q4", question: "Second main atmospheric gas?", answer: "oxygen", explanation: "Nitrogen and oxygen are the two main gases." },
    ],
  },
];
