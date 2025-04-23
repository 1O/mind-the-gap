```js
const data = aq.from([{id: 1, a: "cp", b: "m1"}, 
{id: 2, a: "cp", b: "m2"}, {id: 3, a: "pf", b: "m2"}
])

```

```js
const selections_a = view(Inputs.checkbox(data.array("a"),
{unique: true,
disabled: get_invalid_a()
}))
```

```js
const selections_b = view(Inputs.checkbox(data.array("b"),
{unique: true,
disabled: get_invalid_b()
}))

```

```js
const get_invalid_a = () => {
return data
.groupby("a")
.rollup({b: aq.op.array_agg("b")})
.derive({x: aq.escape(d => _.intersection(selections_b, d.b).length)})
.filter(d => d.x < 1)
.array("a")  
}
```
```js
 const get_invalid_b = () => {
return data
.groupby("b")
.rollup({a: aq.op.array_agg("a")})
.derive({x: aq.escape(d => _.intersection(selections_a, d.a).length)})
.filter(d => d.x < 1)
.array("b")  
}

```

${display(selections_a)}

