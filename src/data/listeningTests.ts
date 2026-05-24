export interface ListeningQuestion {
  id: string;
  type?: "fill" | "mcq";
  question: string;
  options?: string[];
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

// Public-domain Wikimedia recordings used as IELTS-style listening practice.
// 4 sections × 10 questions = 40 total (full IELTS format).
export const listeningTests: ListeningTest[] = [
  {
    id: "section1-booking",
    title: "Section 1 – Hotel booking",
    description: "A conversation between a customer and a hotel receptionist.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/En-uk-listen.ogg",
    transcript:
      "Hello, my name is Sarah Wilson. I'd like to book a room for two nights starting on the fifteenth of June. We'll be three adults and one child. Could you also arrange airport pick-up at six in the evening? My phone number is 0207 555 8842 and I'd prefer a non-smoking double room with a sea view. Breakfast should be included and we'll pay by credit card on arrival.",
    questions: [
      { id: "q1", type: "fill", question: "Speaker's surname?", answer: "Wilson", explanation: "She introduces herself as 'Sarah Wilson'." },
      { id: "q2", type: "fill", question: "Number of nights?", answer: "2", explanation: "She books 'a room for two nights'." },
      { id: "q3", type: "fill", question: "Date of arrival?", answer: "15 June", explanation: "Starting on the fifteenth of June." },
      { id: "q4", type: "fill", question: "Number of adults?", answer: "3", explanation: "Three adults and one child." },
      { id: "q5", type: "fill", question: "Airport pick-up time?", answer: "6 pm", explanation: "Pick-up at six in the evening." },
      { id: "q6", type: "fill", question: "Phone number ends with?", answer: "8842", explanation: "0207 555 8842." },
      { id: "q7", type: "mcq", question: "Room type requested:", options: ["Single", "Double", "Twin", "Suite"], answer: "Double", explanation: "She asks for a 'non-smoking double room'." },
      { id: "q8", type: "mcq", question: "Room view preference:", options: ["City", "Garden", "Sea", "Pool"], answer: "Sea", explanation: "She wants a sea view." },
      { id: "q9", type: "mcq", question: "Is breakfast included?", options: ["Yes", "No", "Optional", "Extra fee"], answer: "Yes", explanation: "Breakfast should be included." },
      { id: "q10", type: "mcq", question: "Payment method:", options: ["Cash", "Bank transfer", "Credit card", "Debit card"], answer: "Credit card", explanation: "Pay by credit card on arrival." },
    ],
  },
  {
    id: "section2-museum",
    title: "Section 2 – Museum tour info",
    description: "A short monologue welcoming visitors to a museum.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Wikipedia-en-Earth-article.ogg",
    transcript:
      "Welcome to the Natural History Museum. The dinosaur exhibition is on the second floor and is open from 10am to 5pm daily. Guided tours run every hour and last about 45 minutes. Tickets cost 12 pounds for adults and are free for children under 12. The cafeteria is on the ground floor next to the gift shop, and the temporary art exhibition closes on Sunday. Please note that photography without flash is allowed throughout the building.",
    questions: [
      { id: "q1", type: "fill", question: "Floor of dinosaur exhibition?", answer: "2", explanation: "It is on the second floor." },
      { id: "q2", type: "fill", question: "Tours run every ___?", answer: "hour", explanation: "Tours run every hour." },
      { id: "q3", type: "fill", question: "Tour length in minutes?", answer: "45", explanation: "Each tour lasts about 45 minutes." },
      { id: "q4", type: "fill", question: "Adult ticket price (£)?", answer: "12", explanation: "Twelve pounds for adults." },
      { id: "q5", type: "fill", question: "Free entry age limit?", answer: "12", explanation: "Free for children under 12." },
      { id: "q6", type: "mcq", question: "Opening time:", options: ["9am", "10am", "11am", "12pm"], answer: "10am", explanation: "Open from 10am to 5pm." },
      { id: "q7", type: "mcq", question: "Cafeteria is on the:", options: ["Ground floor", "First floor", "Second floor", "Basement"], answer: "Ground floor", explanation: "Cafeteria is on the ground floor." },
      { id: "q8", type: "mcq", question: "Temporary art exhibition closes on:", options: ["Friday", "Saturday", "Sunday", "Monday"], answer: "Sunday", explanation: "Closes on Sunday." },
      { id: "q9", type: "mcq", question: "Photography rule:", options: ["Forbidden", "Flash only", "No flash", "Permit required"], answer: "No flash", explanation: "Photography without flash is allowed." },
      { id: "q10", type: "fill", question: "What is next to the gift shop?", answer: "cafeteria", explanation: "Cafeteria is next to the gift shop." },
    ],
  },
  {
    id: "section3-tutorial",
    title: "Section 3 – Student tutorial",
    description: "Two students discuss a research project with their tutor.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/En-uk-test.ogg",
    transcript:
      "So for our research project we'll focus on renewable energy in coastal towns. We need to interview at least ten residents and submit the report by the thirtieth of November. The presentation will be twenty minutes long. We've decided to compare wind and solar approaches, with a particular focus on community-owned schemes. Our tutor recommended the textbook by Anderson and we'll use a survey of fifty households as our main data source. Each section of the report should be around 800 words.",
    questions: [
      { id: "q1", type: "fill", question: "Project topic?", answer: "renewable energy", explanation: "They focus on renewable energy in coastal towns." },
      { id: "q2", type: "fill", question: "Minimum interviews?", answer: "10", explanation: "At least ten residents." },
      { id: "q3", type: "fill", question: "Report deadline?", answer: "30 November", explanation: "Submit by the thirtieth of November." },
      { id: "q4", type: "fill", question: "Presentation length (minutes)?", answer: "20", explanation: "The presentation will be twenty minutes." },
      { id: "q5", type: "mcq", question: "Energy types compared:", options: ["Wind & solar", "Solar & hydro", "Wind & tidal", "Solar & nuclear"], answer: "Wind & solar", explanation: "Compare wind and solar approaches." },
      { id: "q6", type: "fill", question: "Recommended textbook author?", answer: "Anderson", explanation: "Tutor recommended the textbook by Anderson." },
      { id: "q7", type: "fill", question: "Number of households surveyed?", answer: "50", explanation: "Survey of fifty households." },
      { id: "q8", type: "fill", question: "Words per section?", answer: "800", explanation: "Each section around 800 words." },
      { id: "q9", type: "mcq", question: "Type of schemes focused on:", options: ["Government-owned", "Community-owned", "Privately owned", "Foreign-owned"], answer: "Community-owned", explanation: "Particular focus on community-owned schemes." },
      { id: "q10", type: "mcq", question: "Main data source:", options: ["Government records", "Online survey", "Household survey", "Industry interviews"], answer: "Household survey", explanation: "Survey of fifty households is the main data source." },
    ],
  },
  {
    id: "section4-lecture",
    title: "Section 4 – Academic lecture",
    description: "Excerpt from a university lecture on planetary geography.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Wikipedia-en-Earth-article.ogg",
    transcript:
      "Earth is the third planet from the Sun and the only known astronomical object to harbour life. About 71 percent of the surface is covered by water, mostly by oceans. The atmosphere consists primarily of nitrogen and oxygen. The planet's age is estimated at 4.5 billion years. Earth's only natural satellite is the Moon, which influences ocean tides. The inner core is solid iron, while the outer core is molten. The planet's magnetic field protects life from harmful solar radiation, and average surface temperature is about 15 degrees Celsius.",
    questions: [
      { id: "q1", type: "fill", question: "Earth's position from the Sun?", answer: "3", explanation: "It is the third planet from the Sun." },
      { id: "q2", type: "fill", question: "Percentage covered by water?", answer: "71", explanation: "About 71 percent is water." },
      { id: "q3", type: "fill", question: "Main atmospheric gas?", answer: "nitrogen", explanation: "Atmosphere is primarily nitrogen and oxygen." },
      { id: "q4", type: "fill", question: "Second main atmospheric gas?", answer: "oxygen", explanation: "Nitrogen and oxygen are the two main gases." },
      { id: "q5", type: "fill", question: "Earth's age (billion years)?", answer: "4.5", explanation: "About 4.5 billion years old." },
      { id: "q6", type: "fill", question: "Earth's natural satellite?", answer: "Moon", explanation: "The Moon is its only natural satellite." },
      { id: "q7", type: "mcq", question: "Inner core material:", options: ["Liquid water", "Molten rock", "Solid iron", "Gas"], answer: "Solid iron", explanation: "Inner core is solid iron." },
      { id: "q8", type: "mcq", question: "Outer core state:", options: ["Solid", "Molten", "Gas", "Plasma"], answer: "Molten", explanation: "Outer core is molten." },
      { id: "q9", type: "mcq", question: "Magnetic field protects from:", options: ["Wind", "Solar radiation", "Asteroids", "Cosmic dust"], answer: "Solar radiation", explanation: "It protects life from harmful solar radiation." },
      { id: "q10", type: "fill", question: "Average surface temperature (°C)?", answer: "15", explanation: "About 15 degrees Celsius." },
    ],
  },
  {
    id: "section5-library",
    title: "Section 5 – Library registration",
    description: "A new member registers at a public library.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/En-uk-listen.ogg",
    transcript:
      "Good afternoon, I'd like to register for a library card. My name is David Thompson. I live at 42 Maple Street, postcode SW9 4BX. My date of birth is the seventh of March 1994. The maximum number of books I can borrow is eight at a time and the loan period is three weeks. There is no fee for a standard card, but a printed replacement card costs five pounds. The library closes at 8pm on weekdays and 4pm on Saturdays. Please note that the children's section reopens after refurbishment on the first of October.",
    questions: [
      { id: "q1", type: "fill", question: "Member's surname?", answer: "Thompson", explanation: "He says 'David Thompson'." },
      { id: "q2", type: "fill", question: "Street number?", answer: "42", explanation: "42 Maple Street." },
      { id: "q3", type: "fill", question: "Postcode?", answer: "SW9 4BX", explanation: "Stated postcode." },
      { id: "q4", type: "fill", question: "Year of birth?", answer: "1994", explanation: "Seventh of March 1994." },
      { id: "q5", type: "fill", question: "Max books borrowed?", answer: "8", explanation: "Eight at a time." },
      { id: "q6", type: "fill", question: "Loan period (weeks)?", answer: "3", explanation: "Three weeks." },
      { id: "q7", type: "mcq", question: "Fee for a standard card:", options: ["£0", "£5", "£10", "£20"], answer: "£0", explanation: "No fee for a standard card." },
      { id: "q8", type: "fill", question: "Replacement card cost (£)?", answer: "5", explanation: "Printed replacement costs five pounds." },
      { id: "q9", type: "mcq", question: "Saturday closing time:", options: ["2pm", "4pm", "6pm", "8pm"], answer: "4pm", explanation: "4pm on Saturdays." },
      { id: "q10", type: "fill", question: "Children's section reopens on the first of which month?", answer: "October", explanation: "First of October." },
    ],
  },
  {
    id: "section6-climate",
    title: "Section 6 – Climate research talk",
    description: "A short academic talk about climate monitoring.",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Wikipedia-en-Earth-article.ogg",
    transcript:
      "Climate scientists rely on a global network of more than ten thousand weather stations. Satellites provide additional data and have been in continuous operation since 1979. The current rate of sea level rise is approximately 3.4 millimetres per year. Ocean temperatures have increased the most in the upper 700 metres of water. Atmospheric carbon dioxide passed 420 parts per million in 2022. Climate models are calibrated against records going back to 1880. Renewable energy now supplies around 30 percent of global electricity, and the Paris Agreement targets limiting warming to 1.5 degrees.",
    questions: [
      { id: "q1", type: "fill", question: "Number of weather stations (thousand)?", answer: "10", explanation: "More than ten thousand." },
      { id: "q2", type: "fill", question: "Satellites operating since which year?", answer: "1979", explanation: "Since 1979." },
      { id: "q3", type: "fill", question: "Sea level rise (mm/year)?", answer: "3.4", explanation: "Approximately 3.4 mm per year." },
      { id: "q4", type: "fill", question: "Upper ocean warming depth (metres)?", answer: "700", explanation: "Upper 700 metres." },
      { id: "q5", type: "fill", question: "CO2 level (ppm)?", answer: "420", explanation: "Passed 420 ppm in 2022." },
      { id: "q6", type: "fill", question: "CO2 milestone year?", answer: "2022", explanation: "Passed in 2022." },
      { id: "q7", type: "fill", question: "Climate records calibrated from?", answer: "1880", explanation: "Records back to 1880." },
      { id: "q8", type: "mcq", question: "Renewables share of global electricity:", options: ["10%", "20%", "30%", "50%"], answer: "30%", explanation: "Around 30 percent." },
      { id: "q9", type: "mcq", question: "Paris Agreement warming target (°C):", options: ["1.0", "1.5", "2.0", "3.0"], answer: "1.5", explanation: "Limit warming to 1.5°C." },
      { id: "q10", type: "mcq", question: "Main data source besides stations:", options: ["Submarines", "Satellites", "Aircraft", "Buoys only"], answer: "Satellites", explanation: "Satellites provide additional data." },
    ],
  },
];
