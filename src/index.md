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

const is_newbie = Mutable(true)
const unset_newbie = () => is_newbie.value = false

//H.nodes_to_inputs('sl-button')

const sector_labels = {
    "natural hazard management": "Natural hazard management",
    "civil protection": "Civil protection",
    "spatial planning" : "Spatial Planning",
    "forest fires": "Forest fire management", 
    "protection forests" : "Protection forest management"
}
```


```js
const data2 = aq.from(await FileAttachment('data/data1.csv').csv())
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


const measure_count = 475 //data2.dedupe("id").array("id").length

```



```js
const data2_rolled_up = H.rollup_data(data2)
```


<div class="grid grid-cols-4" style="width:90%; font-family:sans; align-items:start">
  <div class="grid-colspan-2"><h1>Mind the gap!</h1>
   <h2>the X-RISK-CC policy gap explorer</h2    >
  </div>
  <div style="text-align:right"><h1 style="align:middle">X-Risk-CC</h1></div>
  <div style="text-align:right"><img src="assets/X-RISK-CC_Logo_Landscape_large.png" width="300"></div>
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


const ordered_sectors = [
"Natural Hazard Management", "Civil Protection", "Spatial Planning", "Protection Forest Management",
"Forest Fire Management"
]

const ordered_phases = [
    "Prevention: non-structural", "Prevention: structural",
	"Preparedness: tool implementation", "Preparedness: tools",
	"Response: tool implementation", "Response: tools",
  //  "Recovery: tool implementation",
	"Recovery: learning", "Recovery: structural",
    "Cross-cutting, generic"
]

const ordered_ownerships = [
    "transnational", 
    "national & subnational",
    "local & regional", 
    "private & individual (citizens, households, property owners)",
    "multi-level, cross-level, co-owned"    
]


const ordered_climaterisks = [
    "floods: riverine, fluvial", "flooding: pluvial", "hydrological hazards: other",
    "gravitational hazards: mass movements", 
    "forest disturbances & loss of protective forest functions",
    "forest fire, wildfire", "drought", "direct extreme weather impacts",
    "(peri-)glacial hazards", "multi-hazard, multi-risk"
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
const matches = H.rollup_data(
    data2.filter(
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
)
.derive({no: aq.op.row_number() - 1})

const match_count = matches.numRows()

```


```js
// save user defined matches and ratings to browser's local storage:
{localStorage.setItem("adaptation_measures", matches.toCSV())}
```

```js
// retrieve user defined matches (if necessary)
const storage_data = aq.fromCSV(localStorage.getItem("adaptation_measures"))
```


```js
const ratings = Mutable({})
const update_ratings = (entry) => {
    ratings.value = Object.assign({}, ratings.value, entry);
}
const reset_ratings = () => ratings.value = {}

```

```js
const favorites = matches
    .derive({rating: aq.escape(d => ratings[d.id])})
    .filter(d => d.rating > 0)
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

<div><!-- second row, left column: -->




<div id="badge_container">
<sl-badge id="badge_matchcount" variant="success" pill style="font-size:larger">${match_count}</sl-badge> matches
</div>

```js
let dummy = H.animate_badge()
```

<div class="card">

<div style="display:grid; grid-template-columns:90% 10%; justify-content: space-between;">
Narrow your search with the filters below.
${H.button_show_dialog_filter()}
</div>
<div style="display:grid; grid-template-columns:50% 50%;">
<div>

```js
const reset_filters = view(H.get_reset_button_filters());
``` 

```js
// apart from resetting other views, do this whenever "reset filter" button is clicked:
{reset_filters; set_slide(1)}
```
</div>
<div>
${H.get_dialog_filter()}

</div>
</div>


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
     (${selected_ownership_levels.length} / ${ordered_ownerships.length})
     </div>   

```js
    const selected_ownership_levels = (reset_filters, view(Inputs.table(
        ordered_ownerships.map(x => {return {"choices" : x}}),
        {header: {choices: "Risk ownership level"}, columns:["choices"]}
    ))); 
```
</sl-details>
<sl-details>
    <div slot="summary">Risks related to
     (${selected_climaterisks.length} / ${ordered_climaterisks.length   })
     </div>   

```js
    const selected_climaterisks = (reset_filters, view(Inputs.table(
        ordered_climaterisks.map(x => {return {"choices" : x}}),
        {header: {choices: "Climate risk"}, columns:["choices"]}
    ))); 
```
</sl-details>
<sl-details>
    <div slot="summary">Local validation</div>


```js
    const validated_only = (reset_filters, view(Inputs.toggle({label: "locally validated?", value: false})))
```

</sl-details>

</div> <!-- end of left filter card -->
</div>




<div><!-- center column -->

<div class="navigate_measures">
    <div>

```js
const back = (reset_filters, view(Inputs.button(html`<i class="fa fa-caret-left"/>`, {value: null})));
```
    
</div>


<div>



${slide} / ${match_count}



<!--
    <sl-alert id="no_filters" open closable class="alert-closable">
    <sl-icon slot="icon" name="info-circle"></sl-icon>
    Currently, all ${match_count} available measures will be displayed.<br>You can use the filter menu (left) to narrow down your selection.

```js
// hide the "use filters" alert if appropriate:
{match_count < measure_count && document.querySelector("#no_filters").removeAttribute("open")}

```
-->

</div>

<div>

```js
const forth = (reset_filters, view(Inputs.button(html`<i class="fa fa-caret-right"/>`, {value: null})));
```

</div>


<!-- code for navigation through slides -->

```js
// navigation through slides (measures):
const slide = Mutable(1);
const set_slide = (n) => slide.value = n
const increase_slide = (x) => slide.value < match_count ? slide.value += 1 : false
const decrease_slide = (x) => slide.value > 1 ? slide.value += -1 : false
```

```js
// increase slide number by clicking forward button
{increase_slide(forth)}
```

```js
// decrease slide number by clicking back button
{decrease_slide(back)}
```
<!-- end code for navigation through slides -->

```js
// extract current row/slide from table "matches"
// (selected via pager, match list or favourites list)
const cur_row = matches.objects()[slide-1]


```

</div>

<!--navigate_measures-->


<div id="newbie-info">${H.get_newbie_info(match_count)}</div>
<div class="container-description">


```js
const the_rater = H.get_rater(cur_row)
// update ratings for the displayed slide
the_rater.addEventListener("sl-change", (e) => {
    update_ratings({[e.target.id]: e.target.value});
    return false;    
    });
```


<sl-card class="card_measure">
    <div slot="header"><div></div>${the_rater}</div>${H.get_detail(cur_row)}
</sl-card>
</div>


</div><!-- end of center column -->
<!-- right column: -->
<div>

<strong>Favourites</strong>



```js
{
let any_favs = Object.keys(ratings).length
document.querySelector("#no_favs").style.display = any_favs ? "none" : "block"
document.querySelector("#table_favorites").style.display = any_favs ? "block" : "none"
}
```
<sl-alert id="no_favs" open>No favourites selected yet. You can add favourites with the rating widget: 
<sl-rating max=3 style="--symbol-size: 1rem;" disabled></sl-rating>
</sl-alert>

<div id="table_favorites">

```js
const reset_ratings_clicked = view(Inputs.button(html`<span class="fas fa-slash" data-fa-mask="fas fa-star" data-fa-transform="up-2.5"></span> clear favourites`))
```

```js
const selected_favorite = (reset_filters, view(H.get_table_favs(matches, ratings)))
```

</div>

```js
// set slide number by selecting from the list of favourites:
{selected_favorite && set_slide(
        1 + matches.array("id").indexOf(selected_favorite.id)
        )
}
```


```js
{reset_ratings_clicked && reset_ratings()}
```


<strong>Matches</strong>

```js
const selected_match = (reset_filters, view(Inputs.table(matches,
{columns: ["id", "measure"], header: {id: "#", rating: "stars"},
select: true, multiple: false, width: {no: "2em"},
format: {measure: d => html`<span style="">${d}</span`},
width: {id: "4em"},
header:{measure: "gap"}
}
)))
```

```js
// set slide number by selecting from the list of matches:
{    selected_match && set_slide(
        1 + matches.array("id").indexOf(selected_match.id)
                       )
}
```


```js
const img_src = await FileAttachment('./assets/X-RISK-CC_Logo_Landscape_large.png').arrayBuffer()
```


```js
const wb = new ExcelJS.Workbook();
const ws_readme = wb.addWorksheet('README');
const ws = wb.addWorksheet('Results');
const header_logo = wb.addImage({buffer: img_src, extension: 'png'});

ws.columns = [
  { header: 'Id', key: 'id', width: 5},
  { header: 'Rating', key: 'rating', width: 5 },
  { header: 'Topic', key: 'cluster', width: 16 },
  { header: 'Sector', key: 'sector', width: 16 },
  { header: 'Phases', key: 'phases', width: 16 },
  { header: 'Gap', key: 'measure', width: 50 },
  { header: 'Risk ownership level', key: 'ownerships', width: 16 },
  { header: 'Risk(s) related to', key: 'climaterisks', width: 32 },
  { header: 'Locally validated', key: 'validated', width: 4 }
];


ws.autoFilter = 'A1:I1';

// (re)set col widths for results:
Object.entries({A: 5, B: 5, C: 20, D: 20, E: 20, 
                F: 40, G: 20, H: 20, I: 10
                })
    .forEach(k => ws.getColumn(k[0]).width = k[1])


ws_readme.addImage(header_logo, {
  tl: { col: 0, row: 0 },
  ext: { width: 600, height: 600/5.464348}
});

ws_readme.getCell('A8').value = "generated on:"
ws_readme.getCell('B8').value = new Date()

const objects_to_string = x => x.map(x => x.choices).join(', ')

ws_readme.getColumn(1).alignment = {vertical:'top', wrapText: true };

const col_criteria = ws_readme.getColumn(2)
col_criteria.width = 80;
col_criteria.alignment = {vertical:'top', wrapText: true };

ws_readme.getCell('A10').value = "The results match the following criteria:"



ws_readme.getCell('A11').value = "policy sectors:"
ws_readme.getCell('B11').value = objects_to_string(selected_sectors)

ws_readme.getCell('A12').value = "phases of risk management cycle:"
ws_readme.getCell('B12').value = objects_to_string(selected_phases)

ws_readme.getCell('A13').value = "gap types:"
ws_readme.getCell('B13').value = objects_to_string(selected_gaps)

ws_readme.getCell('A14').value = "risk ownership levels:"
ws_readme.getCell('B14').value = objects_to_string(selected_ownership_levels)

ws_readme.getCell('A15').value = "climate risks related to:"
ws_readme.getCell('B15').value = objects_to_string(selected_climaterisks)

ws_readme.getCell('A16').value = "show locally validated measures only?"
ws_readme.getCell('B16').value = validated_only




// set col widths for README:
Object.entries({A: 20, B: 20})
    .forEach(k => ws_readme.getColumn(k[0]).width = k[1])

// ws_readme.getColumn(2).width = 20

ws.addRows(matches
// .groupby('id')
// .rollup({ phases: d => d.phases})
.objects()
)

ws.views = [
  {state: 'frozen', xSplit: 2, ySplit: 1}
];

const xl_blob = new Blob([await wb.xlsx.writeBuffer()], {type: '.xlsx'})
const obj_url = URL.createObjectURL(xl_blob);

```




<div class="">
    <strong>Download matches:</strong>
    <div style="text-align:center">
        ${display(html`<sl-button aria-label="download suggestions" size="large" href="${obj_url}" 
        download="X-RISK-CC_policy-gaps-results.xlsx"
         circle><i class="fa fa-download"></i></sl-button>`)}
    </div>
</div>

</div>

</div>

