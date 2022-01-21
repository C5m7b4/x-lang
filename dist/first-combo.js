let a = 6;
let b = 5;
function play (a, b){
	let total = add(a, b);
	print(total);
	
};
play(a, b);


  /*
    runtime functions
  */
  function print(...args){
    console.log(...args);
  }

  function add(...args){
    return args.reduce((sum, num) => sum + num, 0);
  }

  function sub(x, y){
    return x - y;
  }

  function mul(...args){
    return args.reduce((sum, num) => sum * num, 1);
  }

  function div(x, y){
    return x / y;
  }

  function mod(x, y){
    return x % y;
  }

  function abs(n){
    return Math.abs(n);
  }

  function pow(n, m){
    return Math.pow(n, m);
  }

  function sqrt(x){
    return Math.sqrt(x);
  }

