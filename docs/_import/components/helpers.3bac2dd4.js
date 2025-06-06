import * as aq from "../../_npm/arquero@7.2.0/f3eb4e3f.js";
import * as Inputs from "../../_observablehq/stdlib/inputs.ff6354fc.js";
import {html} from "../../_npm/htl@0.3.1/063eb405.js";
import {FileAttachment} from "../../_observablehq/stdlib.d4a7cb81.js";
// Set base path for assets
import { setBasePath } from "../../_npm/@shoelace-style/shoelace@2.19.0/41f6f18a.js";
setBasePath("npm:@shoelace-style/shoelace/dist");



const nodes_to_inputs = (tag_name = "sl-button") => {
    // make arbitrary nodes emit an input event so they can be used
    // as an input element by Observable
    
    let nodes = document.getElementsByTagName(tag_name)    
    Object.keys(nodes).map(k => {
        const el = nodes[k]       
        el.addEventListener('click', () => {
            const event = new Event('input', { bubbles: true });
            el.dispatchEvent(event);
        });
        
    })    
}

const get_sector_colors = () => {
    return {
        "Spatial Planning": '#b3cde3',
        "Protection forest management":'#ccebc5',
        "Civil protection": '#fbb4ae',
        "Forest fire management": '#decbe4',
        "Natural hazard management": '#fed9a6'
    }
}



const get_reset_button_filters = () => {
    return Inputs.button(
        html`<span class="fas fa-slash" data-fa-mask="fas fa-filter" data-fa-transform="up-2.5"></span> clear filters`
    )
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
    
    const the_rater = get_rater(cur_row)
    // update ratings for the displayed slide
    the_rater.addEventListener("sl-change", (e) => {
        update_ratings({[e.target.id]: e.target.value})    
    });    
    
    
    const html_if_match = html`
    <h3>
    <span class="tag" style="background-color:${get_sector_colors()[cur_row.sector]}">${cur_row.sector}</span>
    </h3>
    <h4 class="tag">${cur_row.cluster}</strong></h4>
    <hr/>
    <p class="measure">${cur_row.measure}</p>
    <p>&mdash; ${cur_row.id}</p>
    
    <div slot="footer"> 
        <div>${get_brief(cur_row)}</div>
        <div></div>
    </div>
    `
    
    const html_no_match = html`<sl-alert variant="warning" open>
  <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
  <h3>oops &hellip;</strong></h3>
  No matches for this specific query. Try another filter combination or clear filters altogether.
</sl-alert>`
    
    return typeof(cur_row.id) === "undefined" ? html_no_match : html_if_match
    
    
}





const get_table_favs = (t, ratings) => {
    
    const favorites = t
    .derive({rating: aq.escape(d => ratings[d.id])},
    {no: aq.op.row_number() - 1} // avoid erroneous array indexing with 1-based row nums
)


return Inputs.table(favorites.filter(d => d.rating > 0).orderby(aq.desc("rating")),
{columns: ["id", "measure", "rating"], header: {id: "#", rating: "stars"},
select: true, multiple: false,
width: {id: "4em"},
header: {measure: "gap"},
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


const button_show_dialog_filter = () => {
    return html`<sl-button circle size="small" variant="neutral"
    onclick="document.querySelector('#dialog_filter_info').show()">?</sl-button>`
}

const get_newbie_info = (match_count) => {
    return html`
  Currently, all ${match_count} available measures will be displayed. You can use the filter menu (left) to narrow down your selection.
<hr/>
    <sl-button size="large" variant="primary" onClick="document.querySelector('#newbie-info').style.display='none'">OK</sl-button>
    `
    
}

export default {
    nodes_to_inputs,
    get_reset_button_filters,
    rollup_data, animate_badge, negate_first_timer,
    get_header, get_rater, get_brief, 
    get_sector_colors, get_table_favs, get_dialog_filter, 
    button_show_dialog_filter,
    get_newbie_info, get_detail
}