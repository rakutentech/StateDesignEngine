const StateDesignEngine= require('../src/StateDesignEngine.js');
const fs = require('fs');
const engine= require("state-machine-cat");
const read =fs.readFileSync('__tests__/testdata1.txt','utf8');
console.log(read);

describe('StateDesignEngine', () => {
  it(' constructor() : can create object', () => {
    const s = new StateDesignEngine(engine);
    expect(s).not.toBeNull();
    expect(s).toBeInstanceOf(StateDesignEngine);
  });
  
  it(' setScript(script) : can read all input script', () => {
    const s = new StateDesignEngine(engine);
    expect(s.setScript).toBeInstanceOf(Function);
    expect(s.setScript(read)).toBeInstanceOf(StateDesignEngine);
    expect(s.setScript).not.toBe("");
    // no such file or directory
    s.setScript("syntax error----");
    const t = () => {
      s.init();
    };
    expect(t).toThrow(/Expected/);
  });
  it(' init() : can initialize from script', () => {
    const s = new StateDesignEngine(engine);
    s.setScript(read);
    expect(s.init).toBeInstanceOf(Function);
    expect(s.init()).toBeInstanceOf(StateDesignEngine);
    expect(s.actions).toStrictEqual([
      '[None]',
      'reserve',
      'approve',
      'cancel approval',
      'reject',
      'cancel of reservation',
	  'cancel',
	  'car delivered',
	]);
    expect(s.states).toStrictEqual([
	'initial',
	'Accepting reservations',
	'Reservation accepted',
	'Reserved',
	'final',
    ]);
  });
  it(' createMatrix() : create matrix', () => {
    const s = new StateDesignEngine(engine);
    s.setScript(fs.readFileSync('__tests__/testdata1.txt','utf8'));
	s.init();
	console.log("Matrix");
    expect(s.createMatrix).toBeInstanceOf(Function);
 	expect(s.createMatrix()).toStrictEqual([
      [ [], [ 0 ], [], [], [] ],
      [ [], [], [ 1 ], [], [] ],
      [ [], [ 4, 5 ], [], [ 2 ], [] ],
      [ [], [ 6 ], [ 3 ], [], [ 7 ] ],
      [ [], [], [], [], [] ]
    ]);
  });
    
it(' nCoverage() : can calculate 0 switch coverage', () => {
    const s = new StateDesignEngine(engine);
    s.setScript(fs.readFileSync('__tests__/testData.nest.txt','utf8')).createMatrix();
	expect(s.nCoverage).toBeInstanceOf(Function);
	//s.createMatrix();
	const ZeroSwitch=s.nCoverage(0);
	expect(ZeroSwitch).toStrictEqual([
	 [
        [], [ 0 ], [],
        [], [],    [],
        [], [],    []
      ],
      [
        [],    [], [ 4 ],
        [ 5 ], [], [],
        [],    [], []
      ],
      [
        [], [ 2 ], [ 1 ],
        [], [ 3 ], [],
        [], [],    []
      ],
      [
        [],    [ 9 ], [],
        [ 6 ], [ 7 ], [ 8 ],
        [],    [],    []
      ],
      [
        [],     [],     [ 12 ],
        [ 11 ], [ 10 ], [],
        [],     [],     []
      ],
      [
        [],     [], [],
        [],     [], [],
        [ 15 ], [], []
      ],
      [
        [],     [], [],
        [ 18 ], [], [ 17 ],
        [ 16 ], [], []
      ],
      [
        [], [ 14 ], [],
        [], [ 13 ], [],
        [], [],     []
      ],
      [
        [], [], [], [], [],
        [], [], [], []
      ]
    ]);
  });
  it(' nCoverage() : can calculate 1 switch coverage', () => {
        const s = new StateDesignEngine(engine);
        s.setScript(read);
        s.createMatrix();
        let zeroSwitch = s.nCoverage(1);
        expect(zeroSwitch).toStrictEqual([
            [[],[           ],[[0,1]            ],[     ],[     ]],
            [[],[[1,4],[1,5]],[                 ],[[1,2]],[     ]],
            [[],[[2,6]      ],[[4,1],[5,1],[2,3]],[     ],[[2,7]]],
            [[],[[3,4],[3,5]],[[6,1]            ],[[3,2]],[     ]],
            [[],[           ],[                 ],[     ],[     ]]
          ]);
    });
  it(' printStateEventMatrix() : can print transition matrix', () => {
    let s = new StateDesignEngine(engine);
    s.setScript(read);
	s.createMatrix();
	//s.printStateEventMatrix();
  });
    it(' printCoverage() : can print transition matrix', () => {
    let s = new StateDesignEngine(engine);
    s.setScript(read);
	s.createMatrix();
	//s.printNSwitchMatrix(s.nCoverage(1));
  });
  
  it(' _clean() : can clean all parameters', () => {
    const s = new StateDesignEngine(engine);
	s.create();
  });
 /* [  //init   //Acpt  //Rsv  //Rsd  //fin
      [ [   ], [0   ], [   ], [   ], [   ] ], //initial,
      [ [   ], [    ], [ 1 ], [   ], [   ] ], //Accepting reservations
      [ [   ], [4, 5], [   ], [ 2 ], [   ] ], //Reservation accepted
      [ [   ], [6   ], [ 3 ], [   ], [ 7 ] ], //Reserved
      [ [   ], [    ], [   ], [   ], [   ] ]  //final
	]*/



});