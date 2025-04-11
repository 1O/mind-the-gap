<link rel="stylesheet" href="assets/shoelace-light.css">

```js
import { setBasePath } from "npm:@shoelace-style/shoelace";
setBasePath("npm:@shoelace-style/shoelace/dist");
```

<sl-rating max=3 id="ratingInput" data-id="sp_2"><sl-rating>



```js
const ratings = Mutable({})
const update_ratings = (x) => {
    ratings.value[x.k] = x.v
    return ratings.value
    }

```

```js
const rating = Generators.observe((notify) => {
  const rated = (e) => {
    let t = e.target
    notify({k: t.dataset.id, v:ratingInput.value})
    };  
  ratingInput.addEventListener("sl-change", rated);
});


```

```js
(update_ratings(rating))

``` 

${console.log(ratings)}



