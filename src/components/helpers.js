import * as aq from "npm:arquero";
import {html} from "npm:htl";


const colors = {
    "Spatial Planning": '#b3cde3',
    "Protection forest management":'#ccebc5',
    "Civil protection": '#fbb4ae',
    "Forest fire management": '#decbe4',
    "Natural hazard management": '#fed9a6'
}


const rollup_data = (data) => {
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
    <div>
        <h3><tag style="background-color: ${colors[cur_row.sector]} !important">${cur_row.sector}</tag></h3>
    </div>
    <div class="brief">                     
    <div><strong>Cluster:</strong> ${cur_row.cluster}</div>       
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
    <h1>${"# " + cur_row.no}</h1>
    `
}

const get_rater = (cur_row) => {
    return html`<sl-rating id=${cur_row.id} value=${cur_row.rating} max=3></sl-rating>`
}

const get_detail = (cur_row) => {
    return html`<div class="description">${cur_row.measure}</div>`
}

export default {
    rollup_data, animate_badge, negate_first_timer,
    get_header, get_rater, get_brief, get_detail
}