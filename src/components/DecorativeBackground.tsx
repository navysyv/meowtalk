const DecorativeBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    {/* Lavender gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-lavender-soft/40 via-background to-lavender-soft/20" />

    {/* Subtle stars */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
      {[
        { x: "8%", y: "12%" }, { x: "25%", y: "8%" }, { x: "42%", y: "18%" },
        { x: "65%", y: "6%" }, { x: "80%", y: "15%" }, { x: "92%", y: "10%" },
        { x: "15%", y: "35%" }, { x: "50%", y: "42%" }, { x: "75%", y: "38%" },
        { x: "5%", y: "60%" }, { x: "35%", y: "65%" }, { x: "60%", y: "55%" },
        { x: "88%", y: "62%" }, { x: "20%", y: "80%" }, { x: "45%", y: "85%" },
        { x: "70%", y: "78%" }, { x: "95%", y: "88%" },
      ].map((pos, i) => (
        <text
          key={`star-${i}`}
          x={pos.x}
          y={pos.y}
          fontSize={i % 3 === 0 ? "14" : "10"}
          fill="hsl(265, 70%, 70%)"
        >
          ✦
        </text>
      ))}
    </svg>

    {/* Subtle paw prints */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      {[
        { x: 120, y: 250, r: 0 }, { x: 550, y: 300, r: 25 },
        { x: 820, y: 450, r: -15 }, { x: 300, y: 720, r: 10 },
        { x: 680, y: 850, r: -20 }, { x: 900, y: 220, r: 30 },
      ].map((pos, i) => (
        <g key={`paw-${i}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.r}) scale(0.8)`}>
          <ellipse cx="15" cy="22" rx="8" ry="10" fill="hsl(265, 70%, 60%)" />
          <circle cx="5" cy="8" r="4" fill="hsl(265, 70%, 60%)" />
          <circle cx="15" cy="4" r="4" fill="hsl(265, 70%, 60%)" />
          <circle cx="25" cy="8" r="4" fill="hsl(265, 70%, 60%)" />
        </g>
      ))}
    </svg>
  </div>
);

export default DecorativeBackground;
