//const contents = JSON.parse('{     "transitions": [         {             "from": "initial",             "to": "Accepting reservations"         },         {             "from": "Accepting reservations",             "to": "Reservation accepted",             "label": "reserve",             "event": "reserve"         },         {             "from": "Reservation accepted",             "to": "Reserved",             "label": "approve",             "event": "approve"         },         {             "from": "Reserved",             "to": "Reservation accepted",             "label": "cancel approval",             "event": "cancel approval"         },         {             "from": "Reservation accepted",             "to": "Accepting reservations",             "label": "reject",             "event": "reject"         },         {             "from": "Reservation accepted",             "to": "Accepting reservations",             "label": "cancel of reservation",             "event": "cancel of reservation"         },         {             "from": "Reserved",             "to": "Accepting reservations",             "label": "cancel",             "event": "cancel"         },         {             "from": "Reserved",             "to": "final",             "label": "car delivered",             "event": "car delivered"         }     ],     "states": [         {             "name": "initial",             "type": "initial"         },         {             "name": "Accepting reservations",             "type": "regular"         },         {             "name": "Reservation accepted",             "type": "regular"         },         {             "name": "Reserved",             "type": "regular"         },         {             "name": "final",             "type": "final"         }     ] }');

//let events = ['[None]',// 0
//'reserve'               ,// 1
//'approve'               ,// 2
//'cancel approval'       ,// 3
//'reject'                ,// 4
//'cancel of reservation' ,// 5
//'cancel'                ,// 6
//'car delivered'          ];//7


const fs = require('fs');
const sde = require('state-machine-cat');
const read =fs.readFileSync('testdata1.txt','utf8');


let json="";
json=sde.render(read,{outputType: "json"});
//console.log("JSON=",json);


//let state = (json.states).map((s) => {s.name});
let states = (json.states).map((s) => s.name);
//console.log("States=",states);

let Actions=new Array();
json.transitions.forEach((ts)=> {
		Actions.push(ts.event || "[None]");
		});
//console.log("actions=",Actions);
 
  
let stateEventMatrix = new Array(states.length + 1).fill('')
.map(()=> new Array(Actions.length+ 1).fill(''));
//console.log(stateEventMatrix);

//set matrix columns
for(let index =1;index<stateEventMatrix[0].length;index++){
    stateEventMatrix[0][index] = Actions[index-1];
}
//console.log("set column=",stateEventMatrix);

//set matrix row
for(let index =1;index<stateEventMatrix.length;index++){
    stateEventMatrix[index][0] = states[index-1];
}

//console.log("set row",stateEventMatrix);


//create final matrix
json.transitions.forEach((transition,index)=> {
    stateEventMatrix[states.indexOf(transition.from)+1][index+1]
      = transition.to;
});
//console.log("StateEventMatrix=",stateEventMatrix);
