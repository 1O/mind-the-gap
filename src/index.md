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
```

```js
// store row (=item) count of tables
const item_count = {}
_.forEach(data, (v, k) => item_count[k] = v.numRows())

```



# Mind The Gap

<strong>A truly mindboggling adaptation machine by the Wolves and the Danes</strong>


```js
const table_options = {columns: ["description"], height: "15rem"}
```


<sl-drawer label="Filter suggestions by sector, topic, phase of risk management or adaptation gap:" id = "drawer-filters" class="drawer-custom-size" style="--size: 50vw;">
  <!-- <sl-input autofocus placeholder="I will have focus when the drawer is opened"></sl-input> -->
  <sl-button slot="header" variant="primary">Close</sl-button>


<sl-tab-group>
    <sl-tab slot="nav" panel="sectors"> Sectors (${selected_sectors.length}/${item_count.sectors})</sl-tab>
    <sl-tab slot="nav" panel="topics">Topics  (${selected_topics.length}/${item_count.topics})</sl-tab>
    <sl-tab slot="nav" panel="phases">Phases  (${selected_phases.length}/${item_count.phases})</sl-tab>
    <sl-tab slot="nav" panel="gaps">Gaps  (${selected_gaps.length}/${item_count.gaps})</sl-tab>
    <sl-tab slot="nav" panel="measures">Measures  (${selected_measures.length}/${item_count.measures})</sl-tab>

    
<sl-tab-panel name="sectors" active>

```js
    const searched_sectors = view(Inputs.search(data.sectors));
```
```js
    const selected_sectors = view(Inputs.table(searched_sectors, table_options));   
```
</sl-tab-panel>

<sl-tab-panel name="topics">

```js
    const searched_topics = view(Inputs.search(data.topics));
```
```js
    const selected_topics = view(Inputs.table(searched_topics, table_options));
```
</sl-tab-panel>
<sl-tab-panel name="phases">

```js
    const searched_phases = view(Inputs.search(data.phases));
```
```js
    const selected_phases = view(Inputs.table(searched_phases, table_options));
```  

</sl-tab-panel>
<sl-tab-panel name="gaps">

```js
    const searched_gaps = view(Inputs.search(data.gaps));
```
```js
    const selected_gaps = view(Inputs.table(searched_gaps, table_options));
```

  </sl-tab-panel>
<sl-tab-panel name="measures">  

```js
    const searched_measures = view(Inputs.search(data.measures));
```
```js
    const selected_measures = view(Inputs.table(searched_measures, table_options));
    const match_count = matches.numRows()
```
</sl-tab-panel>
</sl-tab-group>
</sl-drawer>





```js
const filter_menu = document.querySelector('#filter-menu')
filter_menu.addEventListener('sl-select',
 (e) => {const choice = e.detail.item.value
    if (choice == "set") {drawer.show()}
 })

const drawer = document.querySelector('#drawer-filters');
drawer.querySelector('sl-button[variant="primary"]')
    .addEventListener('click', () => drawer.hide());
```


```js
const matches = data.measures
        .filter(aq.escape(d =>             
            _.findIndex(selected_sectors, ['id', d.sector_id]) > -1 &
            _.findIndex(selected_topics, ['id', d.topic_id]) > -1 &
            _.findIndex(selected_phases, ['id', d.phase_id]) > -1 &
            _.findIndex(selected_gaps, ['id', d.gap_id]) > -1
        ))                    
        .derive({no: aq.op.row_number()});
        
        
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
        <sl-carousel id="carousel" navigation mouse-dragging loop class="carousel">
        ${display(
        matches.array('description').map((m, i) => html`<sl-carousel-item class="card"><p class="quote">${m}</p></sl-carousel-item>`)
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


<!--
<sl-details>

<div slot="summary" >Here's the gory details ...</div>

```js
display(Inputs.table(data.measures
            .rename({ description: 'measure'})
            .lookup(data.sectors, ['sector_id', 'id'], 'description')
            .rename({description: 'sector'})
            .lookup(data.topics, ['topic_id', 'id'], 'description')
            .rename({ description: 'topic'})
            .lookup(data.gaps, ['gap_id', 'id'], 'description')
            .rename({ description: 'gap'})
            .lookup(data.phases, ['phase_id', 'id'], 'description')
            .rename({ description: 'phase'})
            .derive({no: aq.op.row_number()}),
            {columns: ['no', 'measure', 'sector', 'topic', 'phase', 'gap'],
             header: {no: '#'},
             width: 'auto', layout: 'auto' // don't truncate text content
            }
            )
)
```

</sl-details>

-->


