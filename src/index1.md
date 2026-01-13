---
theme: ['air']
---

<link rel="stylesheet" href="custom.css">
<link rel="stylesheet" href="assets/shoelace-light.css">
    <script defer src="assets/fontawesome/fontawesome.js"></script>
<script defer src="assets/fontawesome/solid.js"></script>

```js   
import * as aq from "npm:arquero";

// Set base path for assets
import { setBasePath } from "npm:@shoelace-style/shoelace";
setBasePath("npm:@shoelace-style/shoelace/dist");

import showdown from "npm:showdown";

import H from "./components/helpers.js"; // H for helper functions

import ExcelJS from "npm:exceljs"

```

```js



const db = DuckDBClient.of({
    measures: FileAttachment("data/measures.csv"),
    sectors: FileAttachment("data/sectors.csv")
});

// const measures = aq.from(await FileAttachment('data/data2.csv').csv())    
// const sectors = aq.from(await FileAttachment('data/sectors.csv').csv())

// const fifi = db.SQL`SELECT * FROM measures`


//const fifi = db.sql`SELECT * FROM measures`


const hugo = JSON.stringify([3, 1])
```

${hugo}

```js

const qs = "SELECT * FROM measures"

const fifi = db.query`SELECT * FROM measures`


```



```js

```



${Inputs.table(fifi)}

