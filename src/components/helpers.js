import * as aq from "npm:arquero";
import * as Inputs from "npm:@observablehq/inputs";
import _ from "npm:lodash";
import {html} from "npm:htl";
import {FileAttachment} from "observablehq:stdlib";
// Set base path for assets
import { setBasePath } from "npm:@shoelace-style/shoelace";
setBasePath("npm:@shoelace-style/shoelace/dist");


// to render markdown to HTML
// use like: md.unsafe(`**important**`)
import markdownit from "npm:markdown-it"; 
const Markdown = new markdownit({html: true});

const md = {
  unsafe(string) {
    const template = document.createElement("template");
    template.innerHTML = Markdown.render(string);
    return template.content.cloneNode(true);
  }
};
// ---------------------------


import ExcelJS from "npm:exceljs"
import P from "./prose.js"; // for help texts etc.

// import the actual data:
const data = aq.from(await FileAttachment('../data/data.csv').csv())


const img_src = await FileAttachment('../assets/X-RISK-CC_Logo_Landscape_large.png').arrayBuffer()

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



const get_brief_per_measure_id = (id, data) => {
    const data_measurement = data.filter(aq.escape(d => d.id == id))
    const get_uniques_as_string = (tag) => _.uniq(data_measurement.array(tag)).join(", ")
    
    
    return html`
<div class="brief">
    <div><strong>ID:</strong> ${get_uniques_as_string("id")}</div>
    <div><strong>Risk management cycle (stages):</strong> ${get_uniques_as_string("phase")}</div>
    <div><strong>Gap types:</strong> ${get_uniques_as_string("gap")}</div>
    <div><strong>Risk ownership levels:</strong> ${get_uniques_as_string("ownership")}</div>
    <div><strong>Targeted climate risk:</strong> ${get_uniques_as_string("risk")}</div>
    <div><strong>Locally validated:</strong> ${["no", "yes"][get_uniques_as_string("validated")]}</div>
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
    let html_rater = html`<span></span>`
    if(typeof(cur_row.id) !== "undefined"){
        html_rater = html`<sl-rating id=${cur_row.id} value=${cur_row.rating} max=3>
        </sl-rating>`
    }
    return html_rater
}


const get_detail = (cur_row) => {
    
    const the_rater = get_rater(cur_row)
    // update ratings for the displayed slide
    the_rater.addEventListener("sl-change", (e) => {
        update_ratings({[e.target.id]: e.target.value})    
    });
    
    let content = ""
   
    if(!cur_row.id){ // cur_row.id is null, i. e. no match
        content = html`<sl-alert variant="warning" open>
            <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
            <h3>oops &hellip;</strong></h3>
            No matches for this specific query. Try another filter combination or clear filters altogether.
            </sl-alert>`        
    } else {
        content = html`
            <h3>
            <span class="tag" style="background-color:${get_sector_colors()[cur_row.sector]}">${cur_row.sector}</span>
            </h3>
            <hr/>
            <h4 class="tag">Topic: ${cur_row.cluster}</strong></h4>
            <hr/>
            <!-- md.unsafe converts markdown to HTML -->
            <p class="measure">${md.unsafe(cur_row.measure)}</p>
                
            <div slot="footer">         
                <div>${get_brief_per_measure_id(cur_row.id, data)}</div>
                <div></div>
            </div>
            `        
    }
       
    return content
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
    const stuff = P.tt
    const options_to_html = (options) => {
        _.forEach(options, (k, v) => {return "asdfasdf"})
    }

    return html`<sl-dialog label="Filter usage"
    id="dialog_filter_info" class="dialog-overview" 
    style="--width: 30vw;"
    >
    <div>
    ${Object.keys(stuff)
        .map(k => {
            const v = stuff[k]
            return html`<sl-card style="width:100%; margin-bottom: 2em;">
            <div slot="header">Filter: <strong>${v.label}</strong></div>
            <div>
                Guiding question: <i>${v.general}</i>
                <sl-details summary="Filter options" style="padding: 0em">
                    <dl>
                    ${Object.keys(v.options).map(x => html`
                        <dt>${x}</dt><dd>${v.options[x]}</dd>
                        `)}
                    </dl>
                </sl-details>
            <div>
            </sl-card>`
        })
    }
    </div>
    </sl-dialog>
    `
}


const button_show_dialog_filter = () => {
    return html`<sl-button circle size="small" variant="neutral"
    onclick="document.querySelector('#dialog_filter_info').show()">?</sl-button>`
}

const get_newbie_info = (match_count) => {
    return html`
The entire repository of policy gaps contains ${match_count} entries. Use the filter menu (left) to narrow down your selection.
    
<hr/>
    <sl-button size="large" variant="primary" onClick="document.querySelector('#newbie-info').style.display='none'">OK</sl-button>
    `
    
}

const get_blob_buffer = (matches, criteria, validated_only) => {
    
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
    
    
    const objects_to_string = x => x.map(x => x.choices).join(', ')
    
    ws_readme.addImage(header_logo, {
        tl: { col: 0, row: 0 },
        ext: { width: 600, height: 600/5.464348}
    });
        
    ws_readme.getColumn(1).alignment = {vertical:'top', wrapText: true };
    

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const date_formatted = `${year}-${month}-${day}`;

    const col_criteria = ws_readme.getColumn(2)
    col_criteria.width = 80;
    col_criteria.alignment = {vertical:'top', wrapText: true };    
    
    const content = {
        A8: `generated with the X-RISK-CC Policy Gap Explorer on:`,
        B8: `${date_formatted}`,
        A10 : "The results match the following criteria:",
        A11 : "policy sectors:",
        B11 : objects_to_string(criteria.sectors),
        A12 :"phases of risk management cycle:",
        B12 : objects_to_string(criteria.phases),
        A13 : "gap types:",
        B13 : objects_to_string(criteria.gaps),
        A14 : "risk ownership levels:",
        B14: objects_to_string(criteria.ownerships),
        A15 : "climate risks related to:",
        B15 : objects_to_string(criteria.risks),
        A16 : "show locally validated measures only?",
        B16 : validated_only
    }
    
    // fill worksheet cells:
    _.forEach(content, (v, k) => ws_readme.getCell(k).value = v)
    
    
    
    // set col widths for README:
    Object.entries({A: 20, B: 20})
        .forEach(k => ws_readme.getColumn(k[0]).width = k[1])
    
    
    ws.addRows(matches.objects())
    
    ws.views = [{state: 'frozen', xSplit: 2, ySplit: 1}];

    return wb.xlsx.writeBuffer();     

}






export default {
    data,
    nodes_to_inputs,
    get_reset_button_filters,
    rollup_data, animate_badge, negate_first_timer,
    get_header, get_rater,
    get_sector_colors, get_table_favs, get_dialog_filter, 
    button_show_dialog_filter,
    get_newbie_info, get_detail, get_blob_buffer
}