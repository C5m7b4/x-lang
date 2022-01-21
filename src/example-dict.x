a_dict = <dict>{ "1": 2 "3": 4}
b_dict = {1: 2 3: 4}
print(a_dict)
print(b_dict)
empty_dict = <dict>{}
print("empty dict" empty_dict)

set(a_dict "foo" "bar")
print(get(a_dict "foo"))
print(a_dict)
print("the dict has" size(a_dict) "entries in it")
set(a_dict "more" "less")
print("the dict has" size(a_dict) "entries in it")

each(entries(a_dict) [ |entry|
  key = at( entry 0)
  value = at( entry 1)
  print(key ":" value)
])