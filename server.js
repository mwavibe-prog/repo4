const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// --- Game State ---

const { PROBLEM_SETS } = require('./src/data/problems.cjs');
const { CONFIG } = require('./src/data/constants.cjs');

let gameState = createFreshState();
let timerInterval = null;
let players = new Map(); // ws -> { role, playerId }
let takenRoles = new Set();
let shuffledProblems = [];

function createFreshState() {
  return {
    phase: 'lobby', // lobby | playing | between_rounds | ended
    round: 0,
    score: 0,
    health: 100,
    timerSec: CONFIG.ROUND_DURATION_SEC,
    roundActive: false,
    currentProblem: null,
    actionsThisRound: [],
    processedActionCount: 0,
    plots: Array.from({ length: CONFIG.PLOTS_COUNT }, () => ({
      plant: '🌿',
      healthy: true,
    })),
    takenRoles: [],
    playerCount: 0,
  };
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Broadcasting ---

function broadcast(msg) {
  const data = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(data);
  }
}

function sendTo(ws, msg) {
  if (ws.readyState === 1) ws.send(JSON.stringify(msg));
}

function broadcastState() {
  broadcast({
    type: 'STATE_SYNC',
    payload: {
      ...gameState,
      takenRoles: Array.from(takenRoles),
      playerCount: players.size,
    },
  });
}

// --- Game Logic ---

function startGame() {
  gameState = createFreshState();
  shuffledProblems = shuffleArray(PROBLEM_SETS);
  gameState.phase = 'playing';
  startRound();
}

function startRound() {
  gameState.round++;
  if (gameState.round > CONFIG.ROUNDS_TOTAL) {
    endGame();
    return;
  }

  const problemIndex = (gameState.round - 1) % shuffledProblems.length;
  gameState.currentProblem = shuffledProblems[problemIndex];
  gameState.timerSec = CONFIG.ROUND_DURATION_SEC;
  gameState.roundActive = true;
  gameState.actionsThisRound = [];
  gameState.processedActionCount = 0;
  gameState.phase = 'playing';

  broadcastState();

  // Send role-specific clues to each player
  for (const [ws, player] of players) {
    if (player.role && gameState.currentProblem.clues[player.role]) {
      sendTo(ws, {
        type: 'CLUE',
        payload: { clue: gameState.currentProblem.clues[player.role] },
      });
    }
  }

  // Start timer
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    gameState.timerSec--;
    broadcast({ type: 'TIMER', payload: { timerSec: gameState.timerSec } });

    if (gameState.timerSec <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      handleTimeout();
    }
  }, 1000);
}

function applyAction(action) {
  if (!gameState.roundActive) return;

  const isCorrect = action.effect === gameState.currentProblem.solution;

  gameState.actionsThisRound.push({
    effect: action.effect,
    label: action.label,
    role: action.role,
    correct: isCorrect,
  });

  if (isCorrect) {
    gameState.score += CONFIG.SCORE_CORRECT;
    gameState.health = Math.min(100, gameState.health + CONFIG.HEALTH_CORRECT);

    // Heal a random withered plot
    const withered = gameState.plots.findIndex((p) => !p.healthy);
    if (withered !== -1) {
      gameState.plots[withered].healthy = true;
      gameState.plots[withered].plant = '🌿';
    }

    broadcast({
      type: 'ACTION_RESULT',
      payload: { correct: true, action, health: gameState.health, score: gameState.score },
    });

    // End round after short delay to let players see the result
    gameState.roundActive = false;
    clearInterval(timerInterval);
    timerInterval = null;

    setTimeout(() => {
      goToNextRoundOrEnd();
    }, 2000);
  } else {
    gameState.score += CONFIG.SCORE_WRONG;
    gameState.health = Math.max(0, gameState.health + CONFIG.HEALTH_WRONG);

    // Wither a random healthy plot
    const healthy = gameState.plots.findIndex((p) => p.healthy);
    if (healthy !== -1) {
      gameState.plots[healthy].healthy = false;
      gameState.plots[healthy].plant = '🥀';
    }

    broadcast({
      type: 'ACTION_RESULT',
      payload: { correct: false, action, health: gameState.health, score: gameState.score },
    });

    if (gameState.health <= 0) {
      gameState.roundActive = false;
      clearInterval(timerInterval);
      timerInterval = null;
      endGame();
    }
  }
}

function handleTimeout() {
  gameState.roundActive = false;
  gameState.health = Math.max(0, gameState.health + CONFIG.HEALTH_TIMEOUT);

  // Wither a plot on timeout
  const healthy = gameState.plots.findIndex((p) => p.healthy);
  if (healthy !== -1) {
    gameState.plots[healthy].healthy = false;
    gameState.plots[healthy].plant = '🥀';
  }

  broadcast({
    type: 'ROUND_END',
    payload: { success: false, timeout: true, health: gameState.health, score: gameState.score },
  });

  if (gameState.health <= 0) {
    endGame();
  } else {
    gameState.phase = 'between_rounds';
    broadcastState();
  }
}

function goToNextRoundOrEnd() {
  if (gameState.round >= CONFIG.ROUNDS_TOTAL) {
    endGame();
  } else {
    broadcast({
      type: 'ROUND_END',
      payload: { success: true, health: gameState.health, score: gameState.score },
    });
    gameState.phase = 'between_rounds';
    broadcastState();
  }
}

function endGame() {
  gameState.phase = 'ended';
  gameState.roundActive = false;
  clearInterval(timerInterval);
  timerInterval = null;

  const won = gameState.health >= CONFIG.HEALTH_WIN_THRESHOLD;
  let tier = 'Seedling';
  if (gameState.score >= CONFIG.SCORE_TIERS.MASTER) tier = 'Master Gardener';
  else if (gameState.score >= CONFIG.SCORE_TIERS.SKILLED) tier = 'Skilled Keeper';
  else if (gameState.score >= CONFIG.SCORE_TIERS.APPRENTICE) tier = 'Apprentice';

  broadcast({
    type: 'GAME_END',
    payload: {
      won,
      score: gameState.score,
      health: gameState.health,
      round: gameState.round,
      tier,
    },
  });
}

function resetGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  gameState = createFreshState();
  takenRoles.clear();
  for (const [, player] of players) {
    player.role = null;
  }
  broadcastState();
}

// --- WebSocket Handling ---

wss.on('connection', (ws) => {
  const playerId = Math.random().toString(36).substring(2, 10);
  players.set(ws, { role: null, playerId });

  // Send current state to new connection
  sendTo(ws, {
    type: 'WELCOME',
    payload: {
      playerId,
      takenRoles: Array.from(takenRoles),
      phase: gameState.phase,
    },
  });
  sendTo(ws, {
    type: 'STATE_SYNC',
    payload: {
      ...gameState,
      takenRoles: Array.from(takenRoles),
      playerCount: players.size,
    },
  });

  // If game is in progress and player has a role, send their clue
  const player = players.get(ws);
  if (gameState.roundActive && player.role && gameState.currentProblem) {
    sendTo(ws, {
      type: 'CLUE',
      payload: { clue: gameState.currentProblem.clues[player.role] },
    });
  }

  broadcast({
    type: 'PLAYER_COUNT',
    payload: { count: players.size },
  });

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    const pl = players.get(ws);

    switch (msg.type) {
      case 'SELECT_ROLE': {
        const role = msg.payload.role;
        if (takenRoles.has(role)) {
          sendTo(ws, { type: 'ERROR', payload: { message: 'Role already taken' } });
          return;
        }
        // Release previous role if switching
        if (pl.role) takenRoles.delete(pl.role);
        pl.role = role;
        takenRoles.add(role);
        broadcast({
          type: 'ROLES_UPDATE',
          payload: { takenRoles: Array.from(takenRoles) },
        });
        break;
      }

      case 'START_GAME': {
        if (gameState.phase !== 'lobby') return;
        if (takenRoles.size < 2) {
          sendTo(ws, { type: 'ERROR', payload: { message: 'Need at least 2 players' } });
          return;
        }
        startGame();
        break;
      }

      case 'ACTION': {
        if (!gameState.roundActive) {
          sendTo(ws, { type: 'ERROR', payload: { message: 'No active round' } });
          return;
        }
        applyAction({
          effect: msg.payload.effect,
          label: msg.payload.label,
          role: pl.role,
        });
        break;
      }

      case 'NEXT_ROUND': {
        if (gameState.phase === 'between_rounds') {
          startRound();
        }
        break;
      }

      case 'RESET_GAME': {
        resetGame();
        break;
      }

      case 'JOIN_TV': {
        pl.role = '_tv';
        // Send full state
        sendTo(ws, {
          type: 'STATE_SYNC',
          payload: {
            ...gameState,
            takenRoles: Array.from(takenRoles),
            playerCount: players.size,
          },
        });
        break;
      }
    }
  });

  ws.on('close', () => {
    const pl = players.get(ws);
    if (pl && pl.role && pl.role !== '_tv') {
      takenRoles.delete(pl.role);
      broadcast({
        type: 'ROLES_UPDATE',
        payload: { takenRoles: Array.from(takenRoles) },
      });
    }
    players.delete(ws);
    broadcast({
      type: 'PLAYER_COUNT',
      payload: { count: players.size },
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Garden Keepers server running on http://localhost:${PORT}`);
});
