
//Her kalder vi de forskellige id'er fra index.html så vi kan lege rundt med deres funktioner.
const loadButton = document.getElementById("load-button");
const message = document.getElementById("message");
const teamList = document.getElementById("teams");


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
           });

           listTeam.appendChild(teamButton);
           teamList.appendChild(listTeam)//Adder det til siden.
       }

       message.textContent = data.response.length + " teams found";
   } catch (error){
       message.textContent = error.message;
   }
}

loadButton.addEventListener("click", getTeams);
