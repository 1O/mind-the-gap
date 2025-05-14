import * as aq from "npm:arquero";
import * as Inputs from "npm:@observablehq/inputs";
import {html} from "npm:htl";
import {FileAttachment} from "observablehq:stdlib";
// Set base path for assets
import { setBasePath } from "npm:@shoelace-style/shoelace";
setBasePath("npm:@shoelace-style/shoelace/dist");


const get_sector_colors = () => {
    return {
        "Spatial Planning": '#b3cde3',
        "Protection forest management":'#ccebc5',
        "Civil protection": '#fbb4ae',
        "Forest fire management": '#decbe4',
        "Natural hazard management": '#fed9a6'
    }
}



const rollup_data = (data) => {
    
    const ordered_sectors = [
        "Natural hazard management", "Civil protection", "Spatial Planning", "Protection forest management",
        "Forest fire management"
    ]
    
    
    return data
    .groupby('measure')
    .rollup({
        id: d => aq.op.any(d.id),
        rating: d => aq.op.max(d.rating),
        sector: d => aq.op.any(d.sector),
        measure: d => aq.op.any(d.measure),
        cluster: d => aq.op.any(d.cluster),
        validated: d => aq.op.any(d.validated),
        gaps: d => aq.op.array_agg_distinct(d.gap),
        phases: d => aq.op.array_agg_distinct(d.phase),
        ownerships: d => aq.op.array_agg_distinct(d.ownership),
        climaterisks: d => aq.op.array_agg_distinct(d.risk)
    })
    .derive({sector_order: aq.escape(d => ordered_sectors.indexOf(d.sector))})
    .orderby("sector_order")
    .derive({no: aq.op.row_number()})    
}


const animate_badge = () => {
    const badge = document.getElementById('badge_container');

    let currentY = window.scrollY + 100; // Starting point
    let targetY = currentY;
    
    function animate() {
      // Interpolation - smooth following with easing
      const easing = 0.1; // Smaller = slower, more floaty
      const delta = targetY - currentY;
      currentY += delta * easing;
    
      badge.style.transform = `translateY(${currentY - 100}px)`; // minus original offset
    
      requestAnimationFrame(animate);
    }
    
    // Update target on scroll
    window.addEventListener('scroll', () => {
      targetY = window.scrollY + 100; // Adjust this offset as needed
    });
    
    // Start animation loop
    animate();
}


const negate_first_timer = () => {
    document.querySelector("#measure_details").classList.remove("blurred")
    document.querySelector(".alert-closable").removeAttribute("open")
}


const get_brief = (cur_row) => {
return html`

    <div class="brief">
    <div><strong>Gap types:</strong> ${cur_row.gaps.join(", ")}</div>
    <div><strong>Risk management cycle (stages):</strong> ${cur_row.phases.join(", ")}</div>
    <div><strong>Risk ownership levels:</strong> ${cur_row.ownerships.join(", ")}</div>
    <div><strong>Targeted climate risk:</strong> ${cur_row.climaterisks.join(", ")}</div>
    <div><strong>Locally validated:</strong> ${["no", "yes"][1*cur_row.validated]}</div>
    </div>
`
}

const get_header = (cur_row) => {
    return html`
    <div slot="header>

    <h1>${"# " + cur_row.no}</h1>
    </div>
    `
}

const get_rater = (cur_row) => {
    return html`<sl-rating id=${cur_row.id} value=${cur_row.rating} max=3></sl-rating>`
}

const get_detail = (cur_row) => {
    return html`<div class="description">${cur_row.measure}</div>`
}


const get_table_favs = (t) => {
    return Inputs.table(t.filter(d => d.rating > 0).orderby(aq.desc("rating")),
        {columns: ["no", "measure", "rating"], header: {no: "#", rating: "stars"},
        select: true, multiple: false,
        width: {no: "2em"},
        format: {rating: d => html`${Array(d).fill(0).map(() => html`<i class="fa fa-star star"></i>`)}`
            }
        }
    )
}

const get_dialog_filter = () => {
    return html`<sl-dialog label="Filter usage"
    id="dialog_filter_info" 
    class="dialog-overview">
    <h1>Use the filters like this:</h1>
&hellip;
    </sl-dialog>
    `
}


const get_newbie_info = (match_count) => {
return html`
  Currently, all ${match_count} available measures will be displayed. You can use the filter menu (left) to narrow down your selection.
<hr/>
    <sl-button size="large" variant="primary" onClick="document.querySelector('#newbie-info').style.display = 'none'">OK</sl-button>
    `

}

export default {
    rollup_data, animate_badge, negate_first_timer,
    get_header, get_rater, get_brief, get_detail,
    get_sector_colors, get_table_favs, get_dialog_filter, get_newbie_info
}