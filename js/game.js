let score = 0;
let timeLeft = 30;
let gameInterval;
let mode = "trash"; // Default mode: "trash"
let distractorInterval;

function startGame() {
  // Start the timer
  gameInterval = setInterval(updateTimer, 1000);

  // Start generating trash items
  setInterval(createTrash, 1000); // Creates a new trash item every second

  // Start distractor creation in the second mode
  if (mode === "dodge") {
    distractorInterval = setInterval(createDistractor, 1500); // Creates a new distractor every 1.5 seconds
  }
}

function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(gameInterval);
    clearInterval(distractorInterval); // Stop creating distractors
    alert("Game Over! Your final score is: " + score);
    resetGame();
  } else {
    timeLeft--;
    document.getElementById("timer").textContent = "Time Left: " + timeLeft + "s";
  }
}

function createTrash() {
  const trash = document.createElement("div");
  trash.classList.add("trash");
  trash.style.left = Math.random() * (document.getElementById("gameArea").offsetWidth - 40) + "px";
  trash.style.top = Math.random() * (document.getElementById("gameArea").offsetHeight - 40) + "px";
  trash.addEventListener("click", () => {
    score += 10;
    document.getElementById("score").textContent = "Score: " + score;
    trash.remove();
  });
  document.getElementById("gameArea").appendChild(trash);
}

function createDistractor() {
  if (mode === "dodge") {
    const distractor = document.createElement("div");
    distractor.classList.add("distractor");
    distractor.style.left = Math.random() * (document.getElementById("gameArea").offsetWidth - 40) + "px";
    distractor.style.top = Math.random() * (document.getElementById("gameArea").offsetHeight - 40) + "px";
    distractor.addEventListener("click", () => {
      score -= 5; // Decrease score if distractor is clicked
      document.getElementById("score").textContent = "Score: " + score;
      distractor.remove();
    });
    document.getElementById("gameArea").appendChild(distractor);
  }
}

function toggleMode() {
  // Switch between modes
  if (mode === "trash") {
    mode = "dodge";
    document.getElementById("mode").textContent = "Mode: Dodge the Danger";
    clearInterval(distractorInterval); // Stop current distractor creation
    distractorInterval = setInterval(createDistractor, 1500); // Start creating distractors in "dodge" mode
  } else {
    mode = "trash";
    document.getElementById("mode").textContent = "Mode: Trash Collector";
    clearInterval(distractorInterval); // Stop creating distractors in "trash" mode
  }
}

function resetGame() {
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("timer").textContent = "Time Left: " + timeLeft + "s";
  document.getElementById("mode").textContent = "Mode: Trash Collector";
  clearInterval(gameInterval);
  clearInterval(distractorInterval);
}

startGame(); // Start the game as soon as the page loads
