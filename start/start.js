export function startGame() {
    name = document.getElementById('playerName').value;
    localStorage.setItem("currentPlayerName", name);
    window.location.href = "../level1/level1.html"
    localStorage.setItem('level1Time', 0);
    localStorage.setItem('level2Time', 0);
}

window.startGame = startGame;