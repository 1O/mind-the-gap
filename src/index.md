---
theme: ["wide"]
---


<link rel="stylesheet" href="assets/shoelace-light.css">
<script defer src="assets/fontawesome/fontawesome.js"></script>
<script defer src="assets/fontawesome/solid.js"></script>

```js   
import * as aq from "npm:arquero";

import { setBasePath } from "npm:@shoelace-style/shoelace";
import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
// Set base path for assets
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

const item_count = {}

// [sector].map((table) => item_count[])


```




# Mind The Gap

<strong>A truly mindboggling adaptation machine by the Wolves and the Danes</strong>



## Pick your poison


```js
const table_options = {columns: ["description"], height: "15rem"}
```


<div id="settings" class="card grid grid-cols-2" style="grid-auto-rows: auto;">


<sl-tab-group>
    <sl-tab slot="nav" panel="sectors">Sectors</sl-tab>
    <sl-tab slot="nav" panel="topics">Topics</sl-tab>
    <sl-tab slot="nav" panel="phases">Phases</sl-tab>
    <sl-tab slot="nav" panel="gaps">Gaps</sl-tab>

<sl-tab-panel name="sectors">

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
</sl-tab-group>





</div>



## Behold! ${matches.numRows()} sweet match(es)

```js
const matches = data.measures
        .filter(aq.escape(d => {
            const is_match = (   
            _.findIndex(selected_sectors, ['id', d.sector_id]) > -1 &
            _.findIndex(selected_topics, ['id', d.topic_id]) > -1 &
            _.findIndex(selected_phases, ['id', d.phase_id]) > -1 &
            _.findIndex(selected_gaps, ['id', d.gap_id]) > -1
            )
            return is_match
        }
        ))
```

<div class="grid grid-cols-2" style="grid-auto-rows: auto;">

<div class="grid-colspan-2">
${display(Inputs.table(matches, {
        multiple: false, select: false, columns: ["description"] 
    }))
    }

</div>
  

</div>



<div class="card grid grid-cols-2" style="grid-auto-rows: auto;">

<div class="grid-colspan-2">

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
            .rename({ description: 'phase'}),
            {columns: ['measure', 'sector', 'topic', 'phase', 'gap']}
            )
)
```

</sl-details>

</div>
</div>
