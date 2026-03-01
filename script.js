import { events } from "./schedule.js"
const eventsContainer = document.getElementById("eventsContainer");
const searchOutput = document.getElementById("searchOutput");
const sortSelect = document.getElementById("sortSelect");
const outputTitle = document.getElementById("outputTitle");
const tButton = document.querySelectorAll(".tButton");
const searchInput = document.getElementById("searchInput");
const lineupContainer = document.getElementById("lineupContainer");

let lineup = [];

function renderEvents(eventArray, output) { 
  
    output.innerHTML = ""; 

    eventArray.forEach(event => {
        const card = document.createElement("div"); 

        card.classList.add("event-card");

        const isSaved = lineup.includes(event.id);
  
        card.innerHTML = `
          <h3><b>${event.name}</b></h3>
          <hr/>
          <p>Category: ${event.category}</p>
          <p>Day: ${event.day}</p>
          <p>Time: ${event.time}</p>
          <p>Venue: ${event.venue}</p>
          <p>Registrations: ${event.registrations}</p>
          <button 
            class="save-btn ${isSaved ? "active" : ""}" 
            data-id="${event.id}">
            ${isSaved ? "♥ Saved" : "♡ Save"}
            </button>
        `;

        output.appendChild(card);
        
    }); 
}

function sort(array, selection){
    let rarray = [...array];
    if(selection == "day"){
        for(let j = 1; j < rarray.length-1; j++){
            for(let i = 0; i < rarray.length - j ; i++){
                if(rarray[i].day > rarray[i+1].day){
                    let temp = rarray[i];
                    rarray[i] = rarray[i+1];
                    rarray[i+1] = temp;
                }
            }
        }
        return rarray;
    }
    else if(selection == "registrations"){
        for(let j = 1; j < rarray.length-1; j++){
            for(let i = 0; i < rarray.length - j ; i++){
                if(rarray[i].registrations < rarray[i+1].registrations){
                    let temp = rarray[i];
                    rarray[i] = rarray[i+1];
                    rarray[i+1] = temp;
                }
            }
        }
        return rarray;
    }
    else return rarray;
};

let currentCategory = null;
let currentSearch = "";

tButton.forEach(button => {
    button.addEventListener("click", function(){
        tButton.forEach(button => button.classList.remove("active"));
        this.classList.toggle("active");

        currentCategory = this.dataset.value;

        update();

        if(this.textContent=="Clear"){
            setTimeout(function() {button.classList.remove("active");}, 100);
        }
    });
});


function update(){
    let list = [...events];

    if(currentCategory && currentCategory !== "Clear") list = list.filter(e => e.category === currentCategory);

    if(currentSearch.trim() !== "") list = list.filter(e => e.name.toLowerCase().includes(currentSearch.toLowerCase()));

    list = sort(list, sortSelect.value);
    renderEvents(list, eventsContainer);

    if((currentCategory === "Clear" || currentCategory === null) && currentSearch.trim() === "") {
        outputTitle.innerHTML = "";
        outputTitle.innerHTML = "All Events:"
    }
    else if((currentCategory !== "Clear" && currentCategory !== null) || currentSearch.trim() !== ""){
        outputTitle.innerHTML = "";
        outputTitle.innerHTML = "Results:"
    }
}

sortSelect.addEventListener("change", function() {
    update();
});

searchInput.addEventListener("input", function() {
    currentSearch = this.value;

    update();
});

update();

eventsContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("save-btn")) {

    const eventId = Number(e.target.dataset.id);

    if (lineup.includes(eventId)) {
      lineup = lineup.filter(id => id !== eventId);
    } else {
      lineup.push(eventId);
    }

    update();       
    renderLineup(); 
  }
});

function renderLineup() {
    const savedEvents = events.filter(e => lineup.includes(e.id));
    renderEvents(savedEvents, lineupContainer);
}

