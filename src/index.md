---
theme: []
---

<link rel="stylesheet" href="custom.css">
<link rel="stylesheet" href="assets/shoelace-light.css">

<script defer src="assets/fontawesome/fontawesome.js"></script>
<script defer src="assets/fontawesome/solid.js"></script>

```js   
import * as aq from "npm:arquero";


import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
// Set base path for assets
import { setBasePath } from "npm:@shoelace-style/shoelace";
setBasePath("/node_modules/@shoelace-style/shoelace/dist");
```

```js
const data = {}

data.sectors = aq.from(await FileAttachment('data/sectors.csv').csv());
data.topics = aq.from(await FileAttachment('./data/topics.csv').csv());    
data.phases = aq.from(await FileAttachment('data/phases.csv').csv());
data.gaps = aq.from(await FileAttachment('data/gaps.csv').csv());
data.measures = aq.from(await FileAttachment('data/measures.csv').csv());

const data2 = aq.from(await FileAttachment('data/data.csv').csv())

```

```js
// store row (=item) count of tables
const item_count = {}
_.forEach(data, (v, k) => item_count[k] = v.numRows())

```



# Mind The Gap


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


<strong>A truly mindboggling adaptation machine by the Wolves and the Danes</strong>



```js
const table_options = {height: "15rem"}
```


<sl-drawer label="Filter suggestions by sector, topic, phase of risk management or adaptation gap:" id="drawer-filters" class="drawer-custom-size" style="--size: 50vw;">

  <sl-button slot="header" variant="primary">Close</sl-button>

```js
const row_count = (colname) => {return unique_entries[colname].numRows()}
```

<sl-tab-group>
    <sl-tab slot="nav" panel="sectors"> Sectors (${selected_sectors.length} / ${row_count("sector")})</sl-tab>
    <sl-tab slot="nav" panel="clusters">Clusters (${selected_clusters.length} / ${row_count("cluster")})</sl-tab>
    <sl-tab slot="nav" panel="phases">Phases (${selected_phases.length}/${row_count("phase")})</sl-tab>
    <sl-tab slot="nav" panel="gaps">Gaps (${selected_gaps.length}/${row_count("gap")})</sl-tab>
    

    
<sl-tab-panel name="sectors" active>

```js
    const selected_sectors = view(Inputs.table(unique_entries.sector))        
```

</sl-tab-panel>

<sl-tab-panel name="clusters">

```js
    const searched_clusters = view(Inputs.search(unique_entries.cluster));
```

```js
    const selected_clusters = view(Inputs.table(searched_clusters, table_options));
```

</sl-tab-panel>
<sl-tab-panel name="phases">


<div class="grid grid-cols-2">

<div>

```js
    const selected_phases = view(Inputs.table(unique_entries.phase), table_options);
```  
</div>
<div>

```js
    const selected_phase_categories = view(Inputs.table(data2.dedupe('phase_category').select('phase_category')));
```  
</div>
</div>


</sl-tab-panel>
<sl-tab-panel name="gaps">

```js
    const selected_gaps = view(Inputs.table(unique_entries.gap, table_options));
```

  </sl-tab-panel>
</sl-tab-group>
</sl-drawer>

```js
const drawer = document.querySelector('#drawer-filters');
```

```js
const filter_menu = document.querySelector('#filter-menu')
filter_menu.addEventListener('sl-select',
 (e) => {const choice = e.detail.item.value
    if (choice == "set") {drawer.show()}
 })

drawer.querySelector('sl-button[variant="primary"]')
    .addEventListener('click', () => drawer.hide());
```

${display(Array.isArray(selected_sectors.map(x => x.choices   )))}


```js

const matches = data2.filter(
   aq.escape(d => aq.op.indexof(selected_sectors.map(x => x.choices), d.sector) > -1 &
                  aq.op.indexof(selected_clusters.map(x => x.choices), d.cluster) > -1 &
                  aq.op.indexof(selected_phases.map(x => x.choices), d.phase) > -1 &
                //   aq.op.indexof(selected_phase_categories.map(x => x.choices), 
                //    d.phase_category) > -1 &
                  aq.op.indexof(selected_gaps.map(x => x.choices), d.gap) > -1 &
                  true                  
                  )
)
.groupby('measure').rollup({ measure: d => aq.op.any(d.measure)})
.derive({no: aq.op.row_number()});

const match_count = matches.numRows()
    
        
```

```js
const suggestion_index = Mutable(0)
const set_index = (i) => suggestion_index.value = i

```


<div class="grid grid-cols-1" style="grid-auto-rows: auto;">
    <div>
        <sl-dropdown>
        <sl-button slot="trigger" size="large" pill caret>${match_count} Suggestions</sl-button>
        <sl-menu id="filter-menu">
            <sl-menu-item value="set"><i class="fa fa-filter"></i> Filter</sl-menu-item>
            <sl-menu-item value="clear"><i class="fa-solid fa-filter-circle-xmark"></i> Clear filter</sl-menu-item>
        </sl-menu>
        </sl-dropdown>
    </div>
    <div>
        ${display(match_count)}
        <sl-carousel id="carousel" navigation mouse-dragging loop class="carousel">
            ${display(matches.array('measure').map((m, i) => html`<sl-carousel-item class="card"><p class="quote">${m}</p></sl-carousel-item>`)
            )}
        </sl-carousel>
    </div>
<div>
<div class="grid grid-cols-1">    
    <div style="text-align:center">
        ${display(html`<sl-progress-bar value=${100*(1+suggestion_index)/match_count} style="--height: 2px;"></sl-progress-bar>`)}
        ${suggestion_index + 1} / ${match_count}
    </div>
</div>
<div class="grid grid-cols-1">
    <div style="text-align:center">
        ${display(html`<sl-button aria-label="download suggestions" size="large" href="${obj_url}" download="result" circle><i class="fa fa-download"></i></sl-button>`)}
    </div>
</div>

```js
const carousel = document.querySelector("#carousel")
carousel.addEventListener("sl-slide-change", (e) => set_index(e.detail.index))
```

```js
const blob = new Blob([matches.toCSV()], { type: 'text/csv;charset=utf-8,' });
const obj_url = URL.createObjectURL(blob);
```

