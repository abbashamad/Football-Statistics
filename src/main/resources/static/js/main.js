// 1. HTML-elementer.
const message = document.getElementById("message");
const teamList = document.getElementById("teams");
const playerMessage = document.getElementById("players-message");
const playersList = document.getElementById("players");
const askSection = document.getElementById("ask-section");
const selectedPlayerName = document.getElementById("selected-player-name");
const leagueSelect = document.getElementById("league");
const questionInput = document.getElementById("question");
const askButton = document.getElementById("ask-button");
const answer = document.getElementById("answer");
const loadMoreButtons = document.getElementById("load-more-button");


//Start uden en valgt liga
leagueSelect.value = "";

// 2. Data, der kan ændre sig.
let selectedPlayer = null; //Her gemmer vi den valgte spiller.
let selectedTeamId = null;
let currentPage = 1;
let totalPage = 1;
let teamsRequestsNumber = 0;

//De husker det valgte hold, den senest hentede side og antallet af sider.

// 3. Event listeners
leagueSelect.addEventListener("change", getTeams);
askButton.addEventListener("click", askQuestion);
loadMoreButtons.addEventListener("click", function (){
    getPlayers(selectedTeamId, currentPage + 1);
});

// 4. Hjælpe funktioner
function resetPlayerSelection() {
    selectedPlayer = null;
    askSection.hidden = true;
    answer.textContent = "";
}

// 5. Hent hold

//Her så henter vi selve beskeden, men efter at vi har fetchet.
async function getTeams() {
    teamsRequestsNumber = teamsRequestsNumber + 1;
    const requestNumber = teamsRequestsNumber;

    resetPlayerSelection();

    selectedTeamId = null;
    loadMoreButtons.hidden = true;

    playersList.textContent = "";
    playerMessage.textContent = "";

    message.textContent = "Loading teams...";
    teamList.textContent = "";

    try {
        const response = await fetch("/api/v1/football?league=" + leagueSelect.value);//leagueSelect.value læser ID'et fra den valgte option.

        if (!response.ok) {
            throw new Error("Could not load teams")
        }

        const data = await response.json(); //Laver response om til JavaScript object.

        if (requestNumber !== teamsRequestsNumber){
            return;
        }

        if (Object.keys(data.errors).length > 0){
            throw new Error(
                "Football API: " + Object.values(data.errors).join(", ")
            );
        }

        for (const item of data.response) { //Er arrayet der indeholder teamsne
            const listTeam = document.createElement("li");//Laver en liste.
            const teamButton = document.createElement("button");
            teamButton.textContent = item.team.name;

            teamButton.addEventListener("click", function () {
                message.textContent = "You selected " + item.team.name + " (ID: " + item.team.id + ")";

                getPlayers(item.team.id);
            });

            listTeam.appendChild(teamButton);
            teamList.appendChild(listTeam)//Adder det til siden.
        }

        message.textContent = data.response.length + " teams found";
    } catch (error) {
       if (requestNumber == teamsRequestsNumber){
           message.textContent = error.message;
       }
    }
}


// 6. Hent spillere
async function getPlayers(teamId, page = 1) {
    if (page === 1){
        resetPlayerSelection();
        selectedTeamId = teamId;
        currentPage = 1;
        totalPage = 1;

        playersList.textContent = "";
        loadMoreButtons.hidden = true;
    }

    playerMessage.textContent = "Loading players...";
    loadMoreButtons.disabled = true;

    try {
        const response = await fetch("/api/v1/football/players?team=" + teamId + "&page=" + page);
        if (!response.ok) {
            throw new Error("Could not load players");
        }

        const data = await response.json();

        if (Object.keys(data.errors).length > 0) {
            throw new Error("Football API: " + Object.values(data.errors).join(", "));
        }

        for (const item of data.response) {
            const playerItem = document.createElement("li");
            const playerButton = document.createElement("button");

            playerButton.textContent = item.player.name;

            playerButton.addEventListener("click", function () {
                selectedPlayer = item.player;
                selectedPlayerName.textContent = selectedPlayer.name;
                askSection.hidden = false;
                questionInput.value = "";
                answer.textContent = "";
                message.textContent = "You selected " + selectedPlayer.name;
            });

            playerItem.appendChild(playerButton);
            playersList.appendChild(playerItem);
        }

        currentPage = data.paging.current;
        totalPage = data.paging.total;

        loadMoreButtons.hidden = currentPage >= totalPage;

        playerMessage.textContent = playersList.children.length
            + " players shown. Page "
            + currentPage + " of "
            + totalPage + ".";
    } catch (error){
        playerMessage.textContent = error.message;
    } finally {
        loadMoreButtons.disabled = false;
    }
}


// 7. Send spørgsmål
//Async gør at vi kan bruge await i klikfunktionen.
async function askQuestion() {
    if (selectedPlayer === null) {
        answer.textContent = "Please select a player first.";
        return;
    }

    const question = questionInput.value.trim();//Fjerner mellemrum i starten og slutningen.

    if (question === "") {
        answer.textContent = "Please write a question.";
        return;
    }

    answer.textContent = "Thinking...";
    askButton.disabled = true;

    try {
        const response = await fetch("/api/v1/player/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                playerName: selectedPlayer.name,
                question: question
            })
        });

        if (!response.ok) {
            throw new Error("Could not get an answer. Status: " + response.status);
        }

        const data = await response.json();

        answer.textContent = data.choices[0].message.content; //Henter selve svarteksten fra OpenAI-svaret.
    } catch (error) {
        answer.textContent = error.message;
    } finally {//aktiverer knappen igen, både ved succes og fejl.
        askButton.disabled = false
    }
}