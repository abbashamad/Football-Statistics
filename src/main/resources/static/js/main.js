
//Her kalder vi de forskellige id'er fra index.html så vi kan lege rundt med deres funktioner.
const loadButton = document.getElementById("load-button");
const message = document.getElementById("message");
const teamList = document.getElementById("teams");
const playerMessage = document.getElementById("players-message");
const playersList = document.getElementById("players");

let selectedPlayer = null; //Her gemmer vi den valgte spiller.


//Her så henter vi selve beskeden, men efter at vi har fetchet.
async function getTeams(){
   message.textContent = "Loading teams...";
   teamList.textContent = "";

   try {
       const response = await fetch("api/v1/football");

       if (!response.ok){
           throw new Error("Could not load teams")
       }

       const data = await response.json(); //Laver response om til JavaScript object.

       for (const item of data.response){ //Er arrayet der indeholder teamsne
           const listTeam = document.createElement("li");//Laver en liste.
           const teamButton = document.createElement("button");
           teamButton.textContent = item.team.name;

           teamButton.addEventListener("click", function (){
               message.textContent = "You selected " + item.team.name + " (ID: " +item.team.id + ")";

               getPlayers(item.team.id);
           });

           listTeam.appendChild(teamButton);
           teamList.appendChild(listTeam)//Adder det til siden.
       }

       message.textContent = data.response.length + " teams found";
   } catch (error){
       message.textContent = error.message;
   }
}

async function getPlayers(teamId){

    playerMessage.textContent = "Loading players...";
    playersList.textContent = "";

    try {
        const response = await fetch("api/v1/football/players?team=" + teamId);
        if (!response.ok){
            throw new Error("Could not load players");
        }

        const data = await response.json();

        if (Object.keys(data.errors).length > 0){
            throw new Error("Football API: " + Object.values(data.errors).join(", "));
        }
        for (const item of data.response){
            const playerItem = document.createElement("li");
            const playerButton = document.createElement("button");

            playerButton.textContent = item.player.name;

            playerButton.addEventListener("click", function (){
                selectedPlayer = item.player;
                message.textContent = "You selected " + selectedPlayer.name;
            });

            playerItem.appendChild(playerButton);
            playersList.appendChild(playerItem);
        }

        playerMessage.textContent = data.response.length + " players shown from page 1.";

    }catch (error){
        playerMessage.textContent = error.message;
    }
}

loadButton.addEventListener("click", getTeams);


const questionInput = document.getElementById("question");
const askButton = document.getElementById("ask-button");
const answer = document.getElementById("answer");


//Async gør at vi kan bruge await i klikfunktionen.
askButton.addEventListener("click", async function () {
    if (selectedPlayer === null){
        answer.textContent = "Please select a player first.";
        return;
    }

    const question = questionInput.value.trim();//Fjerner mellemrum i starten og slutningen.

    if (question === ""){
        answer.textContent = "Please write a question.";
        return;
    }

    answer.textContent = "Thinking...";
    askButton.disabled = true;

    try{
        const response = await fetch("api/v1/player/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                playerName: selectedPlayer.name,
                question: question
            })
        });

        if (!response.ok){
            throw new Error("Could not get an answer. Status: " + response.status);
        }

        const data = await response.json();

        answer.textContent = data.choices[0].message.content; //Henter selve svarteksten fra OpenAI-svaret.
    } catch (error){
        answer.textContent = error.message;
    } finally {//aktiverer knappen igen, både ved succes og fejl.
        askButton.disabled = false
    }
});
