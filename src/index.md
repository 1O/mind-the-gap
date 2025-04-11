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


const colors = {"Spatial Planning": '#b3cde3',
 "Protection forest management":'#ccebc5',
 "Civil protection": '#fbb4ae',
 "Forest fire management": '#decbe4',
 "Natural hazard management": '#fed9a6'}
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

```

```js
const ordered_phases = [
    "Prevention: non-structural", "Prevention: structural",
	"Preparedness: tool implementation", "Preparedness: tools",
	"Response: tool implementation", "Response: tools",
	"Recovery: learning", "Recovery: structural", "Recovery: tool implementation",
    "Cross-cutting, generic"
]

const ordered_ownerships = [
    "local & regional", "national & subnational",
    "transnational national & subnational", "transnational", 
    "multi-level, cross-level, co-owned"    
]

unique_entries.phase = unique_entries.phase
    .derive({order: aq.escape(d => ordered_phases.indexOf(d.choices))})
    .orderby("order")

unique_entries.ownership = unique_entries.ownership
    .derive({order: aq.escape(d => ordered_ownerships.indexOf(d.choices))})
    .orderby("order")

unique_entries.climaterisk = unique_entries.risk
    .orderby("choices")

```

```js
const row_count = (colname) => {return unique_entries[colname].numRows()}
```

```js
const matches = data2.filter(
   aq.escape(d => aq.op.indexof(selected_sectors.map(x => x.choices), d.sector) > -1 &
                  // aq.op.indexof(selected_clusters.map(x => x.choices), d.cluster) > -1 &
                  aq.op.indexof(selected_phases.map(x => x.choices), d.phase) > -1 &
                  aq.op.indexof(selected_gaps.map(x => x.choices), d.gap) > -1 &
                  aq.op.indexof(selected_ownership_levels.map(x => x.choices), d.ownership) > -1 &
                  aq.op.indexof(selected_climaterisks.map(x => x.choices), d.risk) > -1 &
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
    ownerships: d => aq.op.array_agg_distinct(d.ownership),
    climaterisks: d => aq.op.array_agg_distinct(d.risk)
    })
.derive({
    no: aq.op.row_number()
})

const match_count = matches.numRows()

```

```js
const ratings = Mutable({})
const update_ratings = (x) => {
    ratings.value[x.k] = x.v
    return ratings.value
    }
```


```js
// things that should be triggered when "matches" (the filtered data)
// changes
const refresh_views = (matches) => {
    var badge = document.querySelector("#badge_matchcount")
    badge.setAttribute("pulse", "")
    setTimeout(() => badge.removeAttribute("pulse"), 1000)    
    return("")
    
    }
```


<!-- doesn't display anything but listens to changes in "matches",
e. g. to add and remove pulsating css to badges
-->
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
${match_count - 1}</sl-badge> matches

<div class="card">


```js
const reset_filters = view(Inputs.button(html`<span class="fas fa-slash" data-fa-mask="fas fa-filter" data-fa-transform="up-2.5"></span> clear filters`))
```
Narrow your search with the filters below.

<sl-details>
    <div slot="summary">Policy sector (${selected_sectors.length} / ${row_count('sector')})</div>
    

```js
    const selected_sectors = (reset_filters, view(Inputs.table(unique_entries.sector, 
    {required: true, header: {choices: "Policy sector"}}
    ))); 
```  

</sl-details>
<sl-details>
    <div slot="summary">Risk management cycle (${selected_phases.length} / ${row_count('phase')})</div>
        <div class="grid-cols-2">

```js
    const selected_phases = (reset_filters, view(Inputs.table(unique_entries.phase,
        {header: {choices: "Risk management cycle"}, columns: ["choices"]}
    )));  
```

</div>
</sl-details>
<sl-details>
    <div slot="summary">Gap types (${selected_gaps.length} / ${row_count('gap')})</div>   

```js
    const selected_gaps = (reset_filters, view(Inputs.table(unique_entries.gap,
        {header: {choices: "Gap types"}}
    )));
```
</sl-details>
<sl-details>
    <div slot="summary">Risk ownership level
     (${selected_ownership_levels.length} / ${row_count('ownership')})
     </div>   

```js
    const selected_ownership_levels = (reset_filters, view(Inputs.table(unique_entries.ownership,
        {header: {choices: "Risk ownership level"}, columns:["choices"]}
    ))); 
```
</sl-details>
<sl-details>
    <div slot="summary">Targeted climate risk
     (${selected_ownership_levels.length} / ${row_count('ownership')})
     </div>   

```js
    const selected_climaterisks = (reset_filters, view(Inputs.table(unique_entries.climaterisk,
        {header: {choices: "Climate risk"}, columns:["choices"]}
    ))); 
```
</sl-details>


```js
    const validated_only = (reset_filters, view(Inputs.toggle({label: "Locally validated gaps", value: false})))
```



</div> <!-- end of left filter card -->


<div class="card">
    <h3>download matches</h3>
    <div style="text-align:center">
        ${display(html`<sl-button aria-label="download suggestions" size="large" href="${obj_url}" download="result" circle><i class="fa fa-download"></i></sl-button>`)}
    </div>
</div>


</div>
  <!-- center column -->



<div>
        <div class="grid grid-cols-2">
            ${html`<div >
            <h3><tag style="background-color: ${colors[matches.get('sector', slide)]} !important">${matches.get("sector", slide)}</tag></h3>
            </div>
            `}
        </div>
        <div class="brief"> 
        <div><strong>Cluster:</strong> ${matches.get("cluster", slide)}</div>       
        <div><strong>Gap types:</strong> ${matches.get("gaps", slide).join(", ")}</div>
        <div><strong>Risk management cycle (stages):</strong> ${matches.get("phases", slide).join(", ")}</div>
        <div><strong>Risk ownership levels:</strong> ${matches.get("ownerships", slide).join(", ")}</div>
        <div><strong>Targeted climate risk:</strong> ${matches.get("climaterisks")}</div>
        <div><strong>Locally validated:</strong> ${["no", "yes"][1*matches.get("validated", slide)    ]}</div>
        </div>
    <hr/>


```js
const description = html`
<h1>${"# " + matches.get("no", slide)}</h1>
<div class="note" label="">
<div class="description">
${matches.get("measure", slide)}
</div>

`
```

<div class="container-description">
    <div class="navigate">

```js
const back = (reset_filters, view(Inputs.button("<", {value: null})));
```

</div>   
<div>

```js
const rating_input = html`<sl-rating max=3 id="rating_input" data-id=${matches.get('id', slide)}></sl-rating>`
```

${rating_input}
${description}
</div>

<div class="navigate">

```js
const forth = (reset_filters, view(Inputs.button(">", {value: null})));
```

```js
const slide = forth - back;
```

```js
const rating = Generators.observe((notify) => {
  const rated = (e) => {
    let t = e.target
    notify({k: t.dataset.id, v:rating_input.value})
    };  
  rating_input // use the id of the input element
    .addEventListener("sl-change", rated);
});
```

```js
const favorites = (Object.entries(update_ratings(rating))
    .map(([k, v]) => ({id: k, rating: v})))

``` 

</div>
</div> <!-- description container -->

</div>
<!-- right column -->
<div>

```js
Inputs.table(favorites)
```

</div>

</div>




<div class="grid grid-cols-1">

</div>



```js
const blob = new Blob([matches.toCSV()], { type: 'text/csv;charset=utf-8,' });
const obj_url = URL.createObjectURL(blob);
```

