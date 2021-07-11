class StateDesignEngine
{
	constructor(engine){
	this.engine = engine || require('state-machine-cat');
	this.create();
	}

	setScript(script){
		this.script=script;
		return this;
	}
	
	create(){
	this.json="";
	this.states=new Array();
	this.actions=new Array();
	this.stateEventMatrix=new Array();
	this.nswitchMatrix=new Array();
	this.trans=new Array();
	}
	
	init(){
		this.create();		
		this.json=this.engine.render(this.script,{outputType: "json"});
		this.states =this.innerStates(this.json.states).map((s) => s.name); 
		this.json.transitions.forEach((t)=> {this.actions.push(t.event || "[None]");});
		return this;
	}
		
	
	innerStates(states){
    const ret = new Array(); 
    states.forEach((state) => {   
      if(state.statemachine){
        if(state.statemachine.states){
          this.innerStates(state.statemachine.states).forEach((s) => {
            ret.push(s);
          });
        }
        if(state.statemachine.transitions){
          state.statemachine.transitions.forEach((t)=> {
            this.json.transitions.push(t);
          });
        }
      }
      ret.push(state);
    });
    return ret;
  }
	
	createMatrix(){
		this.init();
		//Create matrix 
		this.states.forEach(() => { 
			const row = new Array();     
        this.actions.forEach(() => {
			row.push('');
      });
		this.trans.push(row);  
		
    });
		this.states.forEach(() => { 
			const row = new Array();  
		this.states.forEach(() => {    
			row.push(new Array());
      });
		this.nswitchMatrix.push(row); 
    });

		this.json.transitions.forEach((t,i)=> {
			const event = t.event || "[None]";
			this.trans[this.states.indexOf(t.from)][i]= this.states.indexOf(t.to);
			this.nswitchMatrix[this.states.indexOf(t.from)][this.states.indexOf(t.to)].push(i);
	});			
		return this.nswitchMatrix;
	}
	
 
	nCoverage(n,mat){
		n = n || 0;
		
		if(n < 1){
			return this.nswitchMatrix;
		}

		const nswitchMatrix = this.nCoverage(n-1,mat || this.nswitchMatrix);

		const nMat = new Array();
		// this.matrix * this.matrix
		this.nswitchMatrix.forEach((originalMatrixRow,originalMatrixRowIndex) => {
		nMat.push(new Array());
		originalMatrixRow.forEach((outerOriginalMatrixRowElement,outerOriginalMatrixRowElementIndex) => {
        nMat[originalMatrixRowIndex].push(new Array());
        originalMatrixRow.forEach((innerOriginalMatrixRowElement,innerOriginalMatrixRowElementIndex) => {
          // push events if the path exists
          if(this.nswitchMatrix[originalMatrixRowIndex][innerOriginalMatrixRowElementIndex].length > 0 && nswitchMatrix[innerOriginalMatrixRowElementIndex][outerOriginalMatrixRowElementIndex].length > 0){
            const events = new Array();
            this.nswitchMatrix[originalMatrixRowIndex][innerOriginalMatrixRowElementIndex].forEach((eventOne)=>{
              nswitchMatrix[innerOriginalMatrixRowElementIndex][outerOriginalMatrixRowElementIndex].forEach((eventTwo)=>{
                events.push([eventOne,eventTwo].flat());
              });
            });
            events.forEach((e) => {
              nMat[originalMatrixRowIndex][outerOriginalMatrixRowElementIndex].push(e);
            });
          }
        });
      });
    });
    return nMat;
  }
	
	printStateEventMatrix(){
	console.log(`||${this.actions.join("|")}|`);
    console.log(`|:--|${this.actions.map(()=>":--").join("|")}|`);
    this.trans.forEach((states,y) => {
      console.log(`|**${this.states[y]}**|${states.map((s) => s > 0 ? this.states[s] : "").join("|")}|`);
    });
	}
	

	printNSwitch(nCoverage){
    nCoverage = nCoverage || this.nswitchMatrix;
	  //console.log("nSwitchCoverage"+nSwitchCoverage);
    let swit = 0; // n + 1 switch Coverage
    let no = 0;   // test case number

    const data = new Array();
    this.states.forEach((from,y) => {
      this.states.forEach((to,x) => {
        if(nCoverage[y][x].length > 0){
          nCoverage[y][x].forEach((path) => {
            let tr = ""; // transition
            //N switch
            if(typeof path === "object"){
              // path.length  should be "n+1" switch coverage
              // ex [1,2,3,4] = 3 switch coverage
              // ex [1,2] = 1 switch coverage
              let prevState = y;
              // print transition
              // ex) event1|state2|event2|state3 ....
              tr = path.map((p) => {
                const ret = new Array();
                ret.push(this.actions[p]);
                ret.push(this.states[this.trans[prevState][p]]);
                prevState = this.trans[prevState][p];
		      //console.log(prevState);
                return ret.join("|");
              }).join("|");
              swit = path.length;
            }else{
              //Zero switch
              tr = `${this.actions[path]}|${to}`;
              swit = 1;
            }
            data.push(`|${no}|${from}|${tr}|`);
            no++;
          });
        }
      });
    });
    //create headers
    const header = new Array();
    header.push("#");
    let i = 1;
    for(;i <= swit ; i ++){
      header.push(`State#${i}`);
      header.push(`Event#${i}`);
    }
    header.push(`State#${i}`);
    const header2 = new Array();
    header.forEach(() => { header2.push(":--") })

    console.log(`|${header.join("|")}|`);
    console.log(`|${header2.join("|")}|`);
    console.log(data.join("\n"));
  }
  
  
   printNSwitchMatrix(nCoverage){
    nCoverage = nCoverage || this.nswitchMatrix;
    console.log(`||${this.states.join("|")}|`);
    console.log(`|:--|${this.states.map(()=>":--").join("|")}|`);
    nCoverage.forEach((row,y)=>{
      console.log(`|**${this.states[y]}**|${row.map((r) => {
        if(r.length < 1) {
          return "";
        }
        if(typeof r[0] === "object"){
          return r.map((p) => p.map((n) => this.actions[n]).join(" -> ")).join(",");
        }
        return r.map((n) => this.actions[n]).join(",");
      }).join("|")}|`);
    });
  }
  
  printDiagram(){
    console.log(this.engine.render(this.script,{outputType: "svg"}));
  }
  
  
}

  Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
  }
});
module.exports = StateDesignEngine;
