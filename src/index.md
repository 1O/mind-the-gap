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

```

```js
const sector_labels = {
    "natural hazard management": "Natural hazard management",
    "civil protection": "Civil protection",
    "spatial planning" : "Spatial Planning",
    "forest fires": "Forest fire management", 
    "protection forests" : "Protection forest management"
}
```

```js
const data2 = aq.from(await FileAttachment('data/data.csv').csv())
// convert 0/1 in csv data to false/true
    .derive({
    "validated": aq.escape(d => d.validated == 1),
    "rating": 0,    
    "sector_order": aq.escape(
        d => ["natural hazard management", "civil protection",
            "spatial planning", "forest fires", "protection forests"
        ].indexOf(d.sector)
        ),
    "sector" : aq.escape(d => sector_labels[d.sector])
    })
    .orderby('sector_order')

// an array of {id: rating}, where id is the measure id (e. g. "sp_1")
// and a user-defined rating (integer)
const ratings = Mutable(data2.dedupe("id", "rating").select("id", "rating").objects())
const colors = {"spatial planning": '#b3cde3',
 "protection forests":'#ccebc5',
 "civil protection": '#fbb4ae',
 "forest fires": '#decbe4',
 "natural hazard management": '#fed9a6'}
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
const row_count = (colname) => {return unique_entries[colname].numRows()}
```

```js
const matches = data2.filter(
   aq.escape(d => aq.op.indexof(selected_sectors.map(x => x.choices), d.sector) > -1 &
                  // aq.op.indexof(selected_clusters.map(x => x.choices), d.cluster) > -1 &
                  aq.op.indexof(selected_phases.map(x => x.choices), d.phase) > -1 &
                   aq.op.indexof(selected_phase_categories.map(x => x.choices), 
                    d.phase_category) > -1 &
                  aq.op.indexof(selected_gaps.map(x => x.choices), d.gap) > -1 &
                  // filter on "locally validation", depending on user's choice (switch)
                  aq.op.indexof([true, validated_only], d.validated) > -1 &
                  true
                  )
)
.groupby('measure')
.rollup({
    id: d => aq.op.any(d.id),
    sector: d => aq.op.any(d.sector),
    measure: d => aq.op.any(d.measure),
    cluster: d => aq.op.any(d.cluster),
    validated: d => aq.op.any(d.validated),
    gaps: d => aq.op.array_agg_distinct(d.gap),
    phases: d => aq.op.array_agg_distinct(d.phase),
    phase_categories: d => aq.op.array_agg_distinct(d.phase_category)
    })
.derive({
    no: aq.op.row_number(),
    rating: 0 // to set favorites
})

const match_count = matches.numRows()

```

${Inputs.table(data2)}


```js
// things that should be triggered when "matches" (the filtered data)
// changes
const refresh_views = (matches) => {
    reset_slider_val(); 
    var badge = document.querySelector("#badge_matchcount")
    badge.setAttribute("pulse", "")
    setTimeout(() => badge.removeAttribute("pulse"), 1000)    
    return("")
    
    }
```

<!-- doesn't display anything but listens to changes in "matches": -->
<span>${refresh_views(matches)}</span>


<div style="display:grid;
    grid-template-columns: 20% 50% 20%;
    gap:1em;">
    <div><!-- first row, left column --></div>
    <!-- center column: -->
    <div>
</div>

<div></div><!-- first row, right column -->

<!-- second row, left column: -->



<div>
<sl-badge id="badge_matchcount" variant="success" pill style="font-size:larger">
${match_count}</sl-badge> matches

<div class="card">

<i class="fa fa-filter"></i> Narrow your search with the filters below:

<sl-details>
    <div slot="summary">Policy sector (${selected_sectors.length} / ${row_count('sector')})</div>
    

```js
    const selected_sectors = view(Inputs.table(choices_sector, 
    {required: true, header: {choices: "Policy sector"}}
    )); 
```
    

  </sl-details>

<!--
  <sl-details>
    <div slot="summary">Clusters (${selected_clusters.length} / ${row_count('cluster')})</div>

```js
    // const searched_clusters = view(Inputs.search(unique_entries.cluster));
```

```js
    // const selected_clusters = view(Inputs.table(searched_clusters,
    // {header: {choices: "Clusters"}}
    // )
    // );
```
-->

</sl-details>
<sl-details>
<div slot="summary">Phases (${selected_phases.length} / ${row_count('phase')})</div>
    <div class="grid-cols-2">

```js
    const selected_phases = view(Inputs.table(unique_entries.phase,
        {header: {choices: "Phase"}}
    ));  
```

```js
    const selected_phase_categories = view(Inputs.table(unique_entries.phase_category,
        {header: {choices: "Phase category"}}
    ));
```  

</div>
</sl-details>
<sl-details>
    <div slot="summary">Gaps (${selected_gaps.length} / ${row_count('gap')})</div>   

```js
    const selected_gaps = view(Inputs.table(unique_entries.gap,
        {header: {choices: "Gaps"}}
    ));
```
</sl-details>


<sl-switch help-text="locally validated measures only" id="switch_validation"></sl-switch>
</div> <!-- end of left filter card -->


```js
const validated_only = Mutable(false)
const set_validated_only = (x) => {validated_only.value = x;}
```

```js
{
document.querySelector("#switch_validation")
.addEventListener("sl-change", e => {set_validated_only(e.target.checked); return ("")}
)
}
```

</div>
  <!-- center column -->

  <div>
        <div class="grid grid-cols-2">
            ${html`<div >
            <h3><tag style="background-color: ${colors[matches.get('sector', slide-1)]} !important">${matches.get("sector", slide-1)}</tag></h3>
            </div>
            `}
            <!-- <div class="brief">
                <dl>    
                    <dt>gaps:</dt><dd>${matches.get("gaps", slide)}</dd>
                    <dt>phases:</dt><dd>${matches.get("phases", slide).join(", ")}</dd>
                    <dt>phase categories:</dt><dd>${matches.get("phase_categories", slide).join(",  ")}</dd>
                    <dt>locally validated:</dt><dd>${["no", "yes"][Boolean(matches.get("validated", slide))]}</dd>    
                </dl>  
            </div> -->
        </div>
        <div class="grid grid-cols-4 brief">        
        <div><strong>gaps:</strong> ${matches.get("gaps", slide-1).join(", ")}</div>
        <div><strong>phases:</strong> ${matches.get("phases", slide-1).join(", ")}</div>
        <div><strong>phase categories:</strong> ${matches.get("phase_categories", slide-1).join(", ")}</div>
        <div><strong>locally validated:</strong> ${["no", "yes"][1*matches.get("validated", slide-1)    ]}</div>
        </div>
    <hr/>

```js
const description = html`
<div class="note" label="# ${slide}">
<div style="column-count:2; column-gap: 5rem">
${matches.get("measure", slide-1)}
</div>
<!--
<sl-rating label="Rating" max="3" id="rate_${matches.get("id", slide-1)}"></sl-rating>
<div>
-->
`
```

${description}
</div>
<!-- right column -->
<div>
    <div class="card">
    <h3>browse matches</h3>

```js
const slider_val = Mutable(1)
const reset_slider_val = () => slider_val.value = 1
const slide = view(Inputs.range([1, match_count], {value: slider_val.value, step: 1}))
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

