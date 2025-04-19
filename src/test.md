```js
const data = aq.from([{a: "cp", b: "m1"}, 
{a: "cp", b: "m2"}, {a: "pf", b: "m2"}
])

const selections = Mutable({a: ["c"]})
const reselect = (k, v) => selections.value[k] = v

```



${selected_b}

hier:

```js
const get_disabled = (col1, col2) => { // disable col1 based on col2
 return data
    .derive({x: aq.escape(d => selected_b.indexOf(d[col2]) != -1)})
    .groupby(col1).rollup({y : aq.op.sum("x")})
    .filter(d => d.y < 1)
    .array(col1)    
}
```

${get_disabled("a", "b")}


```js
const selected_a = (reset_filters,
  view(Inputs.checkbox(data.array("a"),
  {label:"sector",
    disabled: get_disabled("a", "b"),
    unique: true,
  value: data.array("a")
 }))
)
```


```js
const selected_b = (reset_filters,
view(Inputs.checkbox(data.array("b"),
 {label: "cycle", unique: true,  value: data.array("b")}))
)
```


```js
const data_filtered = data.filter(
        aq.escape(d => aq.op.indexof(selected_a, d.a) > -1 &
                  aq.op.indexof(selected_b, d.b) > -1
        )
)

```

${Inputs.table(data)}


${Inputs.table(data_filtered)}


```js
const reset_filters = view(Inputs.button(html`<span class="fas fa-slash" data-fa-mask="fas fa-filter" data-fa-transform="up-2.5"></span> clear filters`))
```