let a_dict = new Map([["1", 2], ["3", 4]]);
let b_dict = new Map([[1, 2], [3, 4]]);
print(a_dict);
print(b_dict);
let empty_dict = new Map([]);
print("empty dict", empty_dict);
set(a_dict, "foo", "bar");
print(get(a_dict, "foo"));
print(a_dict);
print("the dict has", size(a_dict), "entries in it");
set(a_dict, "more", "less");
print("the dict has", size(a_dict), "entries in it");
each(entries(a_dict), function (entry) {
let key = at(entry, 0);
let value = at(entry, 1);
	return print(key, ":", value);

});

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

function split(str, separator) {
  return str.split(separator);
}

function at(arr, index) {
  return arr[index];
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

function entries(map) {
  return Array.from(map.entries());
}

function get(map, key) {
  return map.get(key);
}

function set(map, key, value) {
  map.set(key, value);
}

function size(setOrMap) {
  return setOrMap.size;
}

function length(arr) {
  return arr.length;
}
