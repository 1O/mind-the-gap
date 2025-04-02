```js

const options_sector = Mutable([{choice: "a"},{choice: "b"}])
    
const reset_values = (a) => {    
    options_sector.value= a
    return true
}

```




```js
const selected_sectors = view(Inputs.table(options_sector))
```

${display(selected_sectors)}


<button id="resetter">asdf</button>

```js
//document.querySelector("#resetter").addEventListener("click", () => reset_values([{choice: "b"}, {choice: "c"}, {choice: "c"}]))
``` 