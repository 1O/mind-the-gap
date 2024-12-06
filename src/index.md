---
theme: ["wide"]
---

# Mind The Gap

<strong>A truly mindboggling adaptation machine by the Wolves and the Danes</strong>

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
const sectors = aq.from(await FileAttachment('data/sectors.csv').csv());
const topics = aq.from(await FileAttachment('./data/topics.csv').csv());    
const phases = aq.from(await FileAttachment('data/phases.csv').csv());
const gaps = aq.from(await FileAttachment('data/gaps.csv').csv());
const measures = aq.from(await FileAttachment('data/measures.csv').csv());
```

## Pick your poison

<div class="card grid grid-cols-2" style="grid-auto-rows: auto;">

<div class="grid-colspan-2">That's right. Filter away...

</div>

<sl-details class="">
  <div slot="summary"><i class="fa fa-filter mr-3"></i> Sectors</div>


```js
    const searched_sectors = view(Inputs.search(sectors, {columns: ["description"]}))
```
```js
    const selected_sectors = view(Inputs.table(searched_sectors, {select: true}))
```
</sl-details>



<sl-details class="">
  <div slot="summary"><i class="fa fa-filter mr-3"></i> Topics</div>

```js
    const searched_topics = view(Inputs.search(topics, {columns: ["description"]}))
```
```js
    const selected_topics = view(Inputs.table(searched_topics, {select: true}))
```

</sl-details>

<sl-details class="">
  <div slot="summary"><i class="fa fa-filter mr-3"></i> Phases</div>

```js
    const searched_phases = view(Inputs.search(phases, {columns: ["description"]}))
```
```js
    const selected_phases = view(Inputs.table(searched_phases, {select: true}))
```
</sl-details>


<sl-details class="">
  <div slot="summary"><i class="fa fa-filter mr-3"></i> Gap types</div>

```js
    const searched_gaps = view(Inputs.search(gaps, {columns: ["description"]}))
```
```js
    const selected_gaps = view(Inputs.table(searched_gaps, {select: true}))
```

</sl-details>



</div>



## Behold! Those wonderful results!

<div class="grid grid-cols-2" style="grid-auto-rows: auto;">

<div class="grid-colspan-2">
${display(Inputs.table(
    measures
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
    , {multiple: false, select: false, columns: ["description"] }))
    }

</div>
  

</div>



<div class="card grid grid-cols-2" style="grid-auto-rows: auto;">

<div class="grid-colspan-2">

<sl-details>

<div slot="summary">Here's the gory details ...</div>

```js
display(Inputs.table(measures
            .rename({ description: 'measure'})
            .lookup(sectors, ['sector_id', 'id'], 'description')
            .rename({ description: 'sector'})
            .lookup(topics, ['topic_id', 'id'], 'description')
            .rename({ description: 'topic'})
            .lookup(gaps, ['gap_id', 'id'], 'description')
            .rename({ description: 'gap'})
            .lookup(phases, ['phase_id', 'id'], 'description')
            .rename({ description: 'phase'}),
            {columns: ['measure', 'sector', 'topic', 'phase', 'gap']}
            )
)
```

</sl-details>

</div>
</div>
