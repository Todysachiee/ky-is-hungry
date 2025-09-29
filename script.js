// --- Game Configuration ---
const MAX_CLICKS_BEFORE_POP = 30; // Max clicks to reach the 'pop' stage
const HEALING_DELAY_MS = 1500;   // Time (in milliseconds) to wait after a click to start healing

// --- DOM Elements ---
const picture = document.getElementById('friend-pic');
const countdownDisplay = document.getElementById('countdown-display');
const statusMessage = document.getElementById('status-message');

// --- Game State Variables ---
let clickCount = 0;
let lastClickTime = 0;
let healingTimeout = null;

// --- Main Game Logic ---

picture.addEventListener('click', handlePictureClick);

function handlePictureClick() {
    // Check if the game has just reset (to prevent immediate re-click)
    if (picture.classList.contains('popped')) {
        return;
    }

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;

    // Increment the click counter
    clickCount++;
    countdownDisplay.textContent = `Snack-o-Meter: ${clickCount}`;
    
    // Clear any previous healing timeout
    clearTimeout(healingTimeout);
    
    // Remove 'healing' class immediately on click
    picture.classList.remove('healing');

    // --- HEALING/HARM Logic ---
    
    // If clicked too fast (within 1 second, for example)
    if (timeSinceLastClick < 1000 && clickCount > 1) { 
        statusMessage.textContent = "WHOA! Too fast! Friend is getting really full!";
    } else {
        // If the friend 'healed' (enough time passed)
        statusMessage.textContent = "Yum! That was a good snack.";
    }


    // --- VISUAL EFFECT LOGIC (Getting Stuffed) ---

    // Remove old stuffed classes
    picture.classList.remove('stuffed-level-1', 'stuffed-level-2', 'stuffed-level-3');

    // Add new stuffed class based on click count progress
    if (clickCount >= MAX_CLICKS_BEFORE_POP * 0.7) {
        picture.classList.add('stuffed-level-3'); // 70% to 100% full
    } else if (clickCount >= MAX_CLICKS_BEFORE_POP * 0.4) {
        picture.classList.add('stuffed-level-2'); // 40% to 70% full
    } else if (clickCount >= MAX_CLICKS_BEFORE_POP * 0.1) {
        picture.classList.add('stuffed-level-1'); // 10% to 40% full
    }


    // --- GAME OVER (POP) LOGIC ---
    
    if (clickCount >= MAX_CLICKS_BEFORE_POP) {
        statusMessage.textContent = "POP! Too much food! Game Over! Resetting...";
        picture.classList.add('popped');
        
        // Wait a moment for the pop animation, then reset
        setTimeout(resetGame, 1500);
        return; // Stop execution here
    }

    // --- RE-ARM HEALING ---

    // Set a timeout to start the 'healing' process (decreasing the click count)
    healingTimeout = setTimeout(() => {
        // Only allow healing if the friend isn't completely 'popped'
        if (clickCount > 0 && !picture.classList.contains('popped')) {
            clickCount = Math.max(0, clickCount - 1); // Decrease count by 1 (heal)
            countdownDisplay.textContent = `Snack-o-Meter: ${clickCount}`;
            statusMessage.textContent = "Friend is digesting... you can click again soon!";
            picture.classList.add('healing'); // Add a visual glow for healing
            
            // Re-call the function to continuously heal if the user stops clicking
            // This creates the "healing" loop
            healingTimeout = setTimeout(arguments.callee, HEALING_DELAY_MS);
        }
    }, HEALING_DELAY_MS);
    
    // Update the last click time
    lastClickTime = now;
}

function resetGame() {
    // Clear all classes and reset variables
    clearTimeout(healingTimeout);
    clickCount = 0;
    lastClickTime = 0;
    
    // Visual reset
    picture.classList.remove('popped', 'healing', 'stuffed-level-1', 'stuffed-level-2', 'stuffed-level-3');
    countdownDisplay.textContent = `Snack-o-Meter: ${clickCount}`;
    statusMessage.textContent = "Game reset! Start feeding your friend!";
}
