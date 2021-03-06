let a_array = [1, 2, 3];
let a_set = new Set([2, 4, 5]);
print(a_set);
let e_array = [1, 2, 3, 4];
let a_dict = new Map([[1, 2], [3, 4]]);
let b_dict = new Map([[1, 2], [3, 4]]);
let c_dict = new Map([["name", "Maria"], ["age", 10]]);
print(c_dict);
let empty_array = [];
let empty_set = new Set([]);
let empty_dict = new Map([]);

/*
  runtime functions
*/
function print(...args) {
  console.log(...args);
}

function add(...args) {
  return args.reduce((sum, num) => sum + num, 0);
}

function sub(x, y) {
  return x - y;
}

function mul(...args) {
  return args.reduce((sum, num) => sum * num, 1);
}

function div(x, y) {
  return x / y;
}

function mod(x, y) {
  return x % y;
}

function abs(n) {
  return Math.abs(n);
}

function pow(n, m) {
  return Math.pow(n, m);
}

function sqrt(x) {
  return Math.sqrt(x);
}

function gt(x, y) {
  return x > y;
}

function eq(one, other) {
  return one === other;
}

function $if(cond, consequent, alternate) {
  if (cond) {
    return consequent();
  } else {
    return alternate();
  }
}

function map(arr, fun) {
  return arr.map(fun);
}

function filter(arr, fun) {
  return arr.filter(fun);
}

function reduce(arr, fun, initValue) {
  return arr.reduce(fun, initValue);
}

function each(arr, fun) {
  return arr.forEach(fun);
}
