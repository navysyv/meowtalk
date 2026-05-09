export interface ListeningQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface ListeningTest {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  transcript: string;
  questions: ListeningQuestion[];
}

// Public-domain English speech samples used as IELTS-style listening practice.
// Audio quality and accent will not match official IELTS recordings.
export const listeningTests: ListeningTest[] = [
  {
    id: "intro-conversation",
    title: "Section 1 – Everyday conversation",
    description: "A short conversation in a social context. Listen and answer the questions.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/En-uk-listen.ogg",
    transcript:
      "Hello, my name is Sarah Wilson. I'd like to book a room for two nights starting on the fifteenth of June. We'll be three adults and one child.",
    questions: [
      { id: "q1", question: "What is the speaker's surname?", answer: "Wilson" },
      { id: "q2", question: "How many nights is the booking for?", answer: "2" },
      { id: "q3", question: "How many adults are in the group?", answer: "3" },
    ],
  },
  {
    id: "lecture",
    title: "Section 4 – Academic lecture excerpt",
    description: "A short academic talk. Listen carefully for key facts.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/En-uk-test.ogg",
    transcript: "This is a short test recording used as an IELTS-style listening sample.",
    questions: [
      { id: "q1", question: "What word does the speaker use to describe the recording?", answer: "test" },
      { id: "q2", question: "Is the recording described as long or short?", answer: "short" },
    ],
  },
];