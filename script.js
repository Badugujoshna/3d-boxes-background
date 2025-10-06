// DOM Elements
const uploadPage = document.getElementById('upload-page');
const selectionPage = document.getElementById('selection-page');
const boxesPage = document.getElementById('boxes-page');
const puzzlePage = document.getElementById('puzzle-page');
const imageUpload = document.getElementById('image-upload');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const continueBtn = document.getElementById('continue-btn');
const backToUploadBtn = document.getElementById('back-to-upload');
const applyMagicBtn = document.getElementById('apply-magic');
const backBtn = document.getElementById('back-btn');
const magicBtn = document.getElementById('magic-btn');
const puzzleBtn = document.getElementById('puzzle-btn');
const boxesContainer = document.getElementById('boxes');
const puzzleBoard = document.getElementById('puzzle-board');
const hintImage = document.getElementById('hint-image');
const shuffleBtn = document.getElementById('shuffle-btn');
const resetPuzzleBtn = document.getElementById('reset-puzzle');
const backToMagicBtn = document.getElementById('back-to-magic');
const hintBtn = document.getElementById('hint-btn');
const solveBtn = document.getElementById('solve-btn');
const timer = document.getElementById('timer');
const puzzleTimer = document.getElementById('puzzle-timer');
const movesCounter = document.getElementById('moves-counter');
const resultModal = document.getElementById('result-modal');
const winContent = document.getElementById('win-content');
const loseContent = document.getElementById('lose-content');
const completionTime = document.getElementById('completion-time');
const finalMoves = document.getElementById('final-moves');
const statTime = document.getElementById('stat-time');
const statMoves = document.getElementById('stat-moves');
const statScore = document.getElementById('stat-score');
const playAgainBtn = document.getElementById('play-again');
const tryAgainBtn = document.getElementById('try-again');
const backToMenuBtn = document.getElementById('back-to-menu');
const shareResultBtn = document.getElementById('share-result');

// Magic selection elements
const magicOptions = document.querySelectorAll('.magic-option');
const shapeOptions = document.querySelectorAll('.shape-option');
const gameModeRadios = document.querySelectorAll('input[name="game-mode"]');

// Global variables
let uploadedImageUrl = '';
let selectedMagic = 'rotate';
let selectedShape = 'square';
let gameMode = 'magic';
let puzzlePieces = [];
let correctPositions = [];
let currentPositions = [];
let moves = 0;
let gameTimer;
let timeLeft = 300; // 5 minutes in seconds (changed from 600 to 300)
let isGameActive = false;

// Event Listeners
imageUpload.addEventListener('change', handleImageUpload);
continueBtn.addEventListener('click', goToSelectionPage);
backToUploadBtn.addEventListener('click', goToUploadPage);
applyMagicBtn.addEventListener('click', goToBoxesPage);
backBtn.addEventListener('click', goToSelectionPageFromBoxes);
magicBtn.addEventListener('click', toggleMagic);
puzzleBtn.addEventListener('click', startPuzzleGame);
shuffleBtn.addEventListener('click', shufflePuzzle);
resetPuzzleBtn.addEventListener('click', resetPuzzle);
backToMagicBtn.addEventListener('click', goToBoxesPageFromPuzzle);
hintBtn.addEventListener('click', showHint);
solveBtn.addEventListener('click', checkSolution);
playAgainBtn.addEventListener('click', playAgain);
tryAgainBtn.addEventListener('click', tryAgain);
backToMenuBtn.addEventListener('click', backToMenu);
shareResultBtn.addEventListener('click', shareResult);

// Game mode selection
gameModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        gameMode = e.target.value;
        puzzleBtn.style.display = gameMode === 'puzzle' ? 'block' : 'none';
    });
});

// Add event listeners to magic options
magicOptions.forEach(option => {
    option.addEventListener('click', () => {
        magicOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        selectedMagic = option.getAttribute('data-magic');
    });
});

// Add event listeners to shape options
shapeOptions.forEach(option => {
    option.addEventListener('click', () => {
        shapeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        selectedShape = option.getAttribute('data-shape');
    });
});

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Create a URL for the uploaded image
        uploadedImageUrl = URL.createObjectURL(file);
        
        // Show preview
        previewImage.src = uploadedImageUrl;
        hintImage.src = uploadedImageUrl;
        previewContainer.style.display = 'block';
        
        // Enable continue button
        continueBtn.disabled = false;
    }
}

// Navigate to selection page
function goToSelectionPage() {
    if (uploadedImageUrl) {
        uploadPage.classList.remove('active');
        selectionPage.classList.add('active');
    }
}

// Navigate back to upload page
function goToUploadPage() {
    selectionPage.classList.remove('active');
    uploadPage.classList.add('active');
}

// Navigate to boxes page from selection
function goToBoxesPage() {
    selectionPage.classList.remove('active');
    boxesPage.classList.add('active');
    
    // Clear existing boxes
    boxesContainer.innerHTML = '';
    
    // Apply selected magic and shape
    boxesContainer.className = 'boxes';
    boxesContainer.classList.add(`${selectedMagic}-magic`);
    
    // Create boxes with the uploaded image
    createBoxes();
    
    // Show/hide puzzle button based on game mode
    puzzleBtn.style.display = gameMode === 'puzzle' ? 'block' : 'none';
}

// Navigate back to selection page from boxes
function goToSelectionPageFromBoxes() {
    boxesPage.classList.remove('active');
    selectionPage.classList.add('active');
}

// Navigate to boxes page from puzzle
function goToBoxesPageFromPuzzle() {
    stopGameTimer();
    puzzlePage.classList.remove('active');
    boxesPage.classList.add('active');
}

// Toggle magic effect
function toggleMagic() {
    boxesContainer.classList.toggle('big');
}

// Create boxes
function createBoxes() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.classList.add(selectedShape);
            
            // Set the uploaded image as background
            box.style.backgroundImage = `url('${uploadedImageUrl}')`;
            box.style.backgroundPosition = `${-j * 125}px ${-i * 125}px`;
            
            boxesContainer.appendChild(box);
        }
    }
    
    // Apply specific magic effects based on selection
    applyMagicEffect();
}

// Apply specific magic effects
function applyMagicEffect() {
    const boxes = document.querySelectorAll('.box');
    
    // Reset any previous animations
    boxes.forEach(box => {
        box.style.animation = '';
    });
    
    // Apply effects based on selected magic
    switch(selectedMagic) {
        case 'wave':
            // For wave magic, we'll apply staggered animations
            boxes.forEach((box, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                const delay = (row + col) * 0.1;
                box.style.animationDelay = `${delay}s`;
            });
            break;
        case 'color':
            // For color magic, we'll apply different hue rotations
            boxes.forEach((box, index) => {
                const hue = (index * 15) % 360;
                box.style.filter = `hue-rotate(${hue}deg)`;
            });
            break;
    }
}

// Start puzzle game
function startPuzzleGame() {
    boxesPage.classList.remove('active');
    puzzlePage.classList.add('active');
    
    // Initialize puzzle
    initializePuzzle();
    startGameTimer();
}

// Initialize puzzle
function initializePuzzle() {
    puzzleBoard.innerHTML = '';
    puzzlePieces = [];
    correctPositions = [];
    currentPositions = [];
    moves = 0;
    movesCounter.textContent = 'Moves: 0';
    
    // Create puzzle pieces
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.dataset.correctRow = i;
            piece.dataset.correctCol = j;
            piece.dataset.currentRow = i;
            piece.dataset.currentCol = j;
            
            // Set the uploaded image as background
            piece.style.backgroundImage = `url('${uploadedImageUrl}')`;
            piece.style.backgroundPosition = `${-j * 125}px ${-i * 125}px`;
            piece.style.gridRow = i + 1;
            piece.style.gridColumn = j + 1;
            
            // Add drag and drop functionality
            piece.setAttribute('draggable', true);
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragover', handleDragOver);
            piece.addEventListener('drop', handleDrop);
            piece.addEventListener('dragend', handleDragEnd);
            
            puzzleBoard.appendChild(piece);
            puzzlePieces.push(piece);
            correctPositions.push({row: i, col: j});
            currentPositions.push({row: i, col: j});
        }
    }
    
    // Shuffle the puzzle
    shufflePuzzle();
}

// Shuffle puzzle pieces
function shufflePuzzle() {
    const positions = [...Array(16).keys()];
    
    // Fisher-Yates shuffle
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Apply shuffled positions
    puzzlePieces.forEach((piece, index) => {
        const newRow = Math.floor(positions[index] / 4);
        const newCol = positions[index] % 4;
        
        piece.dataset.currentRow = newRow;
        piece.dataset.currentCol = newCol;
        piece.style.gridRow = newRow + 1;
        piece.style.gridColumn = newCol + 1;
        
        currentPositions[index] = {row: newRow, col: newCol};
    });
    
    moves = 0;
    movesCounter.textContent = 'Moves: 0';
}

// Reset puzzle to correct positions
function resetPuzzle() {
    puzzlePieces.forEach((piece, index) => {
        const correctRow = correctPositions[index].row;
        const correctCol = correctPositions[index].col;
        
        piece.dataset.currentRow = correctRow;
        piece.dataset.currentCol = correctCol;
        piece.style.gridRow = correctRow + 1;
        piece.style.gridColumn = correctCol + 1;
        
        currentPositions[index] = {row: correctRow, col: correctCol};
        piece.classList.remove('correct');
    });
    
    moves = 0;
    movesCounter.textContent = 'Moves: 0';
}

// Drag and drop handlers
let draggedPiece = null;

function handleDragStart(e) {
    draggedPiece = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedPiece !== this) {
        // Swap positions
        const tempRow = draggedPiece.dataset.currentRow;
        const tempCol = draggedPiece.dataset.currentCol;
        
        draggedPiece.dataset.currentRow = this.dataset.currentRow;
        draggedPiece.dataset.currentCol = this.dataset.currentCol;
        draggedPiece.style.gridRow = parseInt(this.dataset.currentRow) + 1;
        draggedPiece.style.gridColumn = parseInt(this.dataset.currentCol) + 1;
        
        this.dataset.currentRow = tempRow;
        this.dataset.currentCol = tempCol;
        this.style.gridRow = parseInt(tempRow) + 1;
        this.style.gridColumn = parseInt(tempCol) + 1;
        
        // Update current positions
        updateCurrentPositions();
        
        // Increment moves
        moves++;
        movesCounter.textContent = `Moves: ${moves}`;
        
        // Check if puzzle is solved
        checkPuzzleSolved();
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedPiece = null;
}

// Update current positions array
function updateCurrentPositions() {
    puzzlePieces.forEach((piece, index) => {
        currentPositions[index] = {
            row: parseInt(piece.dataset.currentRow),
            col: parseInt(piece.dataset.currentCol)
        };
    });
}

// Check if puzzle is solved
function checkPuzzleSolved() {
    let solved = true;
    
    puzzlePieces.forEach((piece, index) => {
        const correctRow = parseInt(piece.dataset.correctRow);
        const correctCol = parseInt(piece.dataset.correctCol);
        const currentRow = parseInt(piece.dataset.currentRow);
        const currentCol = parseInt(piece.dataset.currentCol);
        
        if (correctRow === currentRow && correctCol === currentCol) {
            piece.classList.add('correct');
        } else {
            piece.classList.remove('correct');
            solved = false;
        }
    });
    
    if (solved) {
        stopGameTimer();
        showWinScreen();
    }
    
    return solved;
}

// Check solution (for solve button)
function checkSolution() {
    if (checkPuzzleSolved()) {
        showWinScreen();
    } else {
        alert('Puzzle is not yet solved! Keep trying!');
    }
}

// Show hint
function showHint() {
    alert('Try to match the pieces with the original image shown on the right. The green border indicates correct pieces.');
}

// Game timer functions
function startGameTimer() {
    isGameActive = true;
    timeLeft = 300; // 5 minutes (changed from 600 to 300)
    
    gameTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timer.textContent = timeString;
        puzzleTimer.textContent = timeString;
        
        // Add warning when time is running out
        if (timeLeft <= 60) {
            timer.classList.add('warning');
            puzzleTimer.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            stopGameTimer();
            showLoseScreen();
        }
    }, 1000);
}

function stopGameTimer() {
    isGameActive = false;
    clearInterval(gameTimer);
    timer.classList.remove('warning');
    puzzleTimer.classList.remove('warning');
}

// Show win screen
function showWinScreen() {
    const minutes = Math.floor((300 - timeLeft) / 60); // Changed from 600 to 300
    const seconds = (300 - timeLeft) % 60; // Changed from 600 to 300
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    completionTime.textContent = timeString;
    finalMoves.textContent = moves;
    statTime.textContent = timeString;
    statMoves.textContent = moves;
    
    // Calculate score (higher score for faster completion with fewer moves)
    const timeScore = Math.max(0, 300 - (300 - timeLeft)) * 2; // Changed from 600 to 300
    const movesScore = Math.max(0, 100 - moves) * 10;
    const totalScore = timeScore + movesScore;
    
    statScore.textContent = totalScore;
    
    winContent.classList.add('active');
    loseContent.classList.remove('active');
    resultModal.style.display = 'block';
}

// Show lose screen
function showLoseScreen() {
    winContent.classList.remove('active');
    loseContent.classList.add('active');
    resultModal.style.display = 'block';
}

// Play again
function playAgain() {
    resultModal.style.display = 'none';
    initializePuzzle();
    startGameTimer();
}

// Try again
function tryAgain() {
    resultModal.style.display = 'none';
    initializePuzzle();
    startGameTimer();
}

// Back to menu
function backToMenu() {
    resultModal.style.display = 'none';
    puzzlePage.classList.remove('active');
    uploadPage.classList.add('active');
}

// Share result
function shareResult() {
    const time = statTime.textContent;
    const moves = statMoves.textContent;
    const score = statScore.textContent;
    
    const shareText = `I solved the Magic Boxes Puzzle in ${time} with ${moves} moves and scored ${score} points! Can you beat my score?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Magic Boxes Puzzle Game',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Result copied to clipboard!');
        });
    }
}
