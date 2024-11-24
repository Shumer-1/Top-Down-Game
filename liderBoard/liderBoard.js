const level1Time = localStorage.getItem("level1Time");
const level2Time = localStorage.getItem("level2Time");

const time = (level1Time && level2Time) ? parseFloat(level1Time) + parseFloat(level2Time) : -10;

if (localStorage.getItem('table') === null) {
    localStorage.setItem("table", JSON.stringify([]));
}

let table = JSON.parse(localStorage.getItem("table"));

table.push({time: time, name: name});
table.sort((a, b) => a.time - b.time);

localStorage.setItem("table", JSON.stringify(table));


function loadLeaderboard() {
    let table = JSON.parse(localStorage.getItem("table")) || [];

    if (table.length === 0) {
        document.getElementById("leaderboard").innerHTML = "<li>No results yet</li>";
        return;
    }

    let leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = "";

    table.forEach((entry, index) => {
        let li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.name} - ${entry.time/1000}s`;
        leaderboardElement.appendChild(li);
    });
}

window.onload = loadLeaderboard;
