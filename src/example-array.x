arr = { 1 2 { 3 4 5 } "hello" "world" }
print(arr)
each(arr [ |item|
  print(item)
])
squared = map(arr [ |item|
  a = mul(item item)
  add(a 3)
])
print(squared)
