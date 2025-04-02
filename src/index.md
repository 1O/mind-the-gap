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
setBasePath("/node_modules/@shoelace-style/shoelace/dist");


import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";

```

```js
const data2 = aq.from(await FileAttachment('data/data.csv').csv())
```


<div class="grid grid-cols-4" style="width:90%; font-family:sans; align-items:start">
  <div class="grid-colspan-2"><h1>Policy gap explorer</h1></div>
  <div style="text-align:right"><h1 style="align:middle">X-Risk-CC</h1></div>
  <div style="text-align:right"><img src="assets/ASP_21-27_Logo-Standard.png" width="300"></div>
</div>


```js
// create collection of arquero tables, keyed by column name of data
// each arquero table has one column of unique values of the data column
// Example: unique_entries["sector"] has one column named "choices" containing
// all distinct values of data's column "sector"
const unique_entries = _.zipObject(
    data2.columnNames(),
    data2.columnNames().map(x => aq.table({"choices": _.uniq(data2.array(x))}))
)

const choices_sector = Mutable(unique_entries.sector)


```



```js
const table_options = {height: "15rem"}
```



```js
const row_count = (colname) => {return unique_entries[colname].numRows()}
```


```js

const matches = data2.filter(
   aq.escape(d => aq.op.indexof(selected_sectors.map(x => x.choices), d.sector) > -1 &
                  aq.op.indexof(selected_clusters.map(x => x.choices), d.cluster) > -1 &
                  aq.op.indexof(selected_phases.map(x => x.choices), d.phase) > -1 &
                   aq.op.indexof(selected_phase_categories.map(x => x.choices), 
                    d.phase_category) > -1 &
                  aq.op.indexof(selected_gaps.map(x => x.choices), d.gap) > -1 &
                //   Boolean(d.validated) == Boolean(validated_only) &
                  true
                  )
)
.groupby('measure')
.rollup({
    sector: d => aq.op.any(d.sector),
    measure: d => aq.op.any(d.measure),
    cluster: d => aq.op.any(d.cluster),
    validated: d => aq.op.any(d.validated),
    gaps: d => aq.op.array_agg_distinct(d.gap),
    phases: d => aq.op.array_agg_distinct(d.phase),
    phase_categories: d => aq.op.array_agg_distinct(d.phase_category)
    })
.derive({no: aq.op.row_number()})

const match_count = matches.numRows()

```



<div style="display:grid;
    grid-template-columns: 20% 50% 20%;
    gap:1em;">
    <div><!-- first row, left column --></div>
    <!-- center column: -->
    <div>



</div>
<!-- right column -->
<div></div>




<!-- second row, left column: -->
<div class="card" style="height:40rem">
<sl-badge variant="success" pill>${match_count}</sl-badge> matches

<div class="note" label="Filter">Narrow your search with the filters below.</div>

<sl-details>
    <div slot="summary">Sectors (${selected_sectors.length} / ${row_count('sector')})</div>
    

```js
    const selected_sectors = view(Inputs.table(choices_sector, {required: true})); 
```
    

  </sl-details>
  <sl-details>
    <div slot="summary">Clusters (${selected_clusters.length} / ${row_count('cluster')})</div>

```js
    const searched_clusters = view(Inputs.search(unique_entries.cluster));
```

```js
    const selected_clusters = view(Inputs.table(searched_clusters));
```

</sl-details>
<sl-details>
<div slot="summary">Phases (${selected_phases.length} / ${row_count('phase')})</div>
    <div class="grid-cols-2">

```js
    const selected_phases = view(Inputs.table(unique_entries.phase));  
```

```js
    const selected_phase_categories = view(Inputs.table(unique_entries.phase_category));
```  

</div>
</sl-details>
<sl-details>
    <div slot="summary">Gaps (${selected_gaps.length} / ${row_count('gap')})</div>   

```js
    const selected_gaps = view(Inputs.table(unique_entries.gap, table_options));
```
</sl-details>

<!-- <div class="note" label="Validated?">Show only locally validated measures.</div> -->
<sl-switch id="switch_validated"><small>locally validated measures only</small>
<small style="color:red">funktioniert noch nicht</small>

</sl-switch>

```js
const validated_only = Mutable(false)
const set_validated_only = (x) => {validated_only.value = x}

```

```js
const dummy = document.querySelector("#switch_validated")
     .addEventListener("click", (e) => {        
        e.target.checked ? set_validated_only(true) : set_validated_only(false)
        })
```

</div>
  <!-- center column -->

  <div>
        <div class="grid grid-cols-2">
            <div><h3>Sector: ${matches.get("sector", slide-1)}</h3></div>
            <!-- <div class="brief">
                <dl>    
                    <dt>gaps:</dt><dd>${matches.get("gaps", slide)}</dd>
                    <dt>phases:</dt><dd>${matches.get("phases", slide).join(", ")}</dd>
                    <dt>phase categories:</dt><dd>${matches.get("phase_categories", slide).join(",  ")}</dd>
                    <dt>locally validated:</dt><dd>${["no", "yes"][matches.get("validated", slide)]}</dd>    
                </dl>  
            </div> -->
        </div>
        <div class="grid grid-cols-4 brief">
        <div><strong>gaps:</strong> ${matches.get("gaps", slide-1).join(", ")}</div>
        <div><strong>phases:</strong> ${matches.get("phases", slide-1).join(", ")}</div>
        <div><strong>phase categories:</strong> ${matches.get("phase_categories", slide-1).join(", ")}</div>
        <div><strong>locally validated:</strong> ${["no", "yes"][matches.get("validated", slide-1)]}</div>
        </div>
    <hr/>
    ${html`<div class="note" label="# ${slide}"> ${matches.get("measure", slide-1)}</div>`}
  </div>
<!-- right column -->
<div>
    <div class="card">
    <h3>browse matches</h3>

```js
const slide = view(Inputs.range([1, match_count], {step: 1}))
```


</div>
    <div class="card">
        <h3>download matches</h3>
        <div style="text-align:center">
            ${display(html`<sl-button aria-label="download suggestions" size="large" href="${obj_url}" download="result" circle><i class="fa fa-download"></i></sl-button>`)}
        </div>
    </div>
</div>

</div>




<div class="grid grid-cols-1">

</div>



```js
const blob = new Blob([matches.toCSV()], { type: 'text/csv;charset=utf-8,' });
const obj_url = URL.createObjectURL(blob);
```

