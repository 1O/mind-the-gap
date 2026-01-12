```js
const o = Mutable({"foo": "bar"})
const change_o = (x) => {
    o.value = Object.assign({}, o.value, x)
}

```

```js
change_o({fooi: "bazi"})
```

${console.log(o)}


