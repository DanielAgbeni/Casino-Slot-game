'use strict';

// DOM Elements
const elements = {
	cash: document.querySelector('.cash'),
	stake: document.querySelector('.stake'),
	bet: document.querySelector('.bet'),
	money: document.querySelector('.money'),
	btn: document.querySelector('.btn'),
	roll: document.querySelector('.roll'),
	overlay: document.querySelector('.overlay'),
	fruit0: document.querySelector('.fruit0'),
	fruit1: document.querySelector('.fruit1'),
	fruit2: document.querySelector('.fruit2'),
	replay: document.querySelector('.again'),
	retry: document.querySelector('.retry'),
	msg: document.querySelector('.msg'),
	win: document.querySelector('.win'),
	winText: document.querySelector('.text'),
};

// Game state
const gameState = {
	actualMoney: 1000,
	deposit: 0,
	minBet: 10,
	maxBet: 100,
	symbols: ['🍓', '🍇', '🍩'],
	isRolling: false,
};

// Initialize the game
function initGame() {
	loadGameState();
	elements.cash.textContent = `$${gameState.actualMoney}`;
	elements.msg.textContent = `Stake between $${gameState.minBet} and $${gameState.maxBet}`;
	addEventListeners();
}

// Load game state from local storage
function loadGameState() {
	const savedState = localStorage.getItem('slotMachineGameState');
	if (savedState) {
		try {
			const parsedState = JSON.parse(savedState);
			gameState.actualMoney = parsedState.actualMoney || gameState.actualMoney;
			gameState.deposit = parsedState.deposit || gameState.deposit;
			gameState.minBet = parsedState.minBet || gameState.minBet;
			gameState.maxBet = parsedState.maxBet || gameState.maxBet;

			// Update UI to reflect loaded state
			elements.cash.textContent = `$${gameState.actualMoney}`;
			if (gameState.deposit > 0) {
				elements.stake.textContent = `$${gameState.deposit}`;
			}
		} catch (e) {
			console.error('Failed to load game state:', e);
		}
	}
}

// Save game state to local storage
function saveGameState() {
	const stateToSave = {
		actualMoney: gameState.actualMoney,
		deposit: gameState.deposit,
		minBet: gameState.minBet,
		maxBet: gameState.maxBet,
	};
	localStorage.setItem('slotMachineGameState', JSON.stringify(stateToSave));
}

// Add all event listeners
function addEventListeners() {
	// Betting button click
	elements.btn.addEventListener('click', handleBet);

	// Enter key for betting
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Enter' && !elements.bet.classList.contains('hidden')) {
			handleBet();
		}
	});

	// Roll button click
	elements.roll.addEventListener('click', handleRoll);

	// Replay button click
	elements.replay.addEventListener('click', function () {
		elements.bet.classList.remove('hidden');
		elements.overlay.classList.remove('hidden');
		elements.win.classList.add('hidden');
		saveGameState();
	});

	// Retry button click (when bet is invalid)
	if (elements.retry) {
		elements.retry.addEventListener('click', function () {
			resetBetUI();
			saveGameState();
		});
	}

	// Save game state when window is about to close
	window.addEventListener('beforeunload', saveGameState);
}

// Handle betting submission
function handleBet() {
	const betAmount = Number(elements.money.value);
	gameState.deposit = betAmount;

	if (isValidBet(betAmount)) {
		startGame(betAmount);
		saveGameState();
	} else {
		showInvalidBetMessage();
	}
}

// Check if bet is valid
function isValidBet(amount) {
	return (
		amount >= gameState.minBet &&
		amount <= gameState.maxBet &&
		gameState.actualMoney >= amount
	);
}

// Start the game with valid bet
function startGame(amount) {
	gameState.actualMoney -= amount;
	elements.cash.textContent = `$${gameState.actualMoney}`;
	elements.stake.textContent = `$${amount}`;
	elements.bet.classList.add('hidden');
	elements.overlay.classList.add('hidden');
	elements.roll.classList.remove('hidden');
	saveGameState();
}

// Show message for invalid bet
function showInvalidBetMessage() {
	elements.money.classList.add('hidden');
	elements.bet.style.backgroundColor = 'red';
	elements.btn.classList.add('hidden');

	if (elements.retry) {
		elements.retry.classList.remove('hidden');
	}

	elements.msg.textContent =
		gameState.actualMoney < gameState.minBet
			? 'You do not have enough money to play!'
			: 'Your stake must be between $10 and $100';
	elements.msg.style.fontSize = '1.2rem';
	elements.msg.style.color = '#fff';
	saveGameState();
}

// Reset bet UI after invalid bet
function resetBetUI() {
	elements.bet.style.backgroundColor = 'rgb(3, 161, 24)';
	elements.money.classList.remove('hidden');
	elements.btn.classList.remove('hidden');

	if (elements.retry) {
		elements.retry.classList.add('hidden');
	}

	elements.msg.textContent = `Stake between $${gameState.minBet} and $${gameState.maxBet}`;
	elements.msg.style.fontSize = '';
	elements.msg.style.color = '';
	saveGameState();
}

// Handle roll button click
function handleRoll() {
	// Prevent multiple clicks while animation is running
	if (gameState.isRolling) return;

	gameState.isRolling = true;

	if (gameState.actualMoney < gameState.deposit) {
		showInsufficientFundsMessage();
		gameState.isRolling = false;
		return;
	}

	// Get random symbols
	const results = getRandomSymbols();

	// Start animation sequence
	startRollAnimation()
		.then(() => showResults(results))
		.then(() => checkWinCondition(results))
		.finally(() => {
			gameState.isRolling = false;
			saveGameState();
		});
}

// Show message for insufficient funds
function showInsufficientFundsMessage() {
	elements.msg.textContent = 'You do not have enough money to continue!';
	elements.msg.style.fontSize = '1.5rem';
	elements.msg.style.color = '#fff';
	elements.bet.classList.remove('hidden');
	elements.bet.style.backgroundColor = '#a01130';
	elements.money.classList.add('hidden');
	elements.btn.classList.add('hidden');
	elements.overlay.classList.remove('hidden');
	saveGameState();
}

// Get random symbols for each slot
function getRandomSymbols() {
	return [
		gameState.symbols[Math.floor(Math.random() * gameState.symbols.length)],
		gameState.symbols[Math.floor(Math.random() * gameState.symbols.length)],
		gameState.symbols[Math.floor(Math.random() * gameState.symbols.length)],
	];
}

// Start the roll animation
function startRollAnimation() {
	elements.fruit0.classList.add('hidden');
	elements.fruit1.classList.add('hidden');
	elements.fruit2.classList.add('hidden');

	return new Promise((resolve) => {
		setTimeout(() => {
			elements.fruit0.classList.remove('hidden');
			elements.fruit1.classList.remove('hidden');
			elements.fruit2.classList.remove('hidden');
			resolve();
		}, 800);
	});
}

// Display the slot results
function showResults(symbols) {
	elements.fruit0.textContent = symbols[0];
	elements.fruit1.textContent = symbols[1];
	elements.fruit2.textContent = symbols[2];

	// Deduct bet amount after showing results
	gameState.actualMoney -= gameState.deposit;
	elements.cash.textContent = `$${gameState.actualMoney}`;

	// Return a promise to sequence the next step
	return new Promise((resolve) => {
		// Give time for the results to be visible before checking win
		setTimeout(() => resolve(symbols), 1000);
	});
}

// Check if user won
function checkWinCondition(symbols) {
	const isWin = symbols[0] === symbols[1] && symbols[1] === symbols[2];

	if (isWin) {
		handleWin();
	}
	saveGameState();
}

// Handle win scenario
function handleWin() {
	const winAmount = gameState.deposit * 10;

	// Add winnings to balance (bet amount was already deducted)
	gameState.actualMoney += winAmount + gameState.deposit; // Add back the bet plus winnings
	elements.cash.textContent = `$${gameState.actualMoney}`;

	// Show winning message
	elements.roll.classList.add('hidden');
	elements.winText.textContent = `YOU WON: $${winAmount}`;
	elements.win.classList.remove('hidden');
	elements.overlay.classList.remove('hidden');
	saveGameState();
}

// Add reset button functionality
function addResetButton() {
	const resetBtn = document.createElement('button');
	resetBtn.textContent = 'Reset Game';
	resetBtn.classList.add('reset-btn');
	resetBtn.style.position = 'absolute';
	resetBtn.style.bottom = '1rem';
	resetBtn.style.left = '50%';
	resetBtn.style.transform = 'translateX(-50%)';
	resetBtn.style.padding = '0.5rem 1rem';
	resetBtn.style.borderRadius = 'var(--border-radius-medium)';
	resetBtn.style.backgroundColor = '#ff4444';
	resetBtn.style.color = 'white';
	resetBtn.style.border = 'none';
	resetBtn.style.cursor = 'pointer';
	resetBtn.style.zIndex = '100';

	resetBtn.addEventListener('click', function () {
		if (
			confirm(
				'Are you sure you want to reset the game? This will clear all your progress.',
			)
		) {
			localStorage.removeItem('slotMachineGameState');
			gameState.actualMoney = 1000;
			gameState.deposit = 0;
			elements.cash.textContent = `$${gameState.actualMoney}`;
			elements.stake.textContent = '';
			elements.bet.classList.remove('hidden');
			elements.overlay.classList.remove('hidden');
			elements.win.classList.add('hidden');
			elements.roll.classList.add('hidden');
			resetBetUI();
		}
	});

	document.body.appendChild(resetBtn);
}

// Initialize the game
initGame();
addResetButton();
