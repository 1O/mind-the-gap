import * as htl from "npm:htl";
import * as aq from "npm:arquero";
import {FileAttachment} from "observablehq:stdlib";


const data = {}

data.sectors = aq.from(await FileAttachment('../data/sectors.csv').csv());
data.topics = aq.from(await FileAttachment('../data/topics.csv').csv());    
data.phases = aq.from(await FileAttachment('../data/phases.csv').csv());
data.gaps = aq.from(await FileAttachment('../data/gaps.csv').csv());
data.measures = aq.from(await FileAttachment('../data/measures.csv').csv());


const all_data = data.measures
            .rename({ description: 'measure'})
            .lookup(data.sectors, ['sector_id', 'id'], 'description')
            .rename({description: 'sector'})
            .lookup(data.topics, ['topic_id', 'id'], 'description')
            .rename({ description: 'topic'})
            .lookup(data.gaps, ['gap_id', 'id'], 'description')
            .rename({ description: 'gap'})
            .lookup(data.phases, ['phase_id', 'id'], 'description')
            .rename({ description: 'phase'})
            .derive({no: aq.op.row_number()})


console.log(all_data) 


const get_suggestion_card = (index) => { 

    const d = JSON.parse(all_data.filter(aq.escape(x => x.id == index)).toJSON()).data
    // const d = JSON.parse(data.slice(index, index + 1).toJSON()).data
    
    return htl.html`
    <sl-carousel-item>
    <sl-card class="card-footer">
    <p class="quote">${d.measure}</p>
    <hr/>
    <sl-button-group>
    <sl-tooltip content=${d.sector}><sl-button pill> Sector</sl-button></sl-tooltip>
    <sl-tooltip content=${d.topic}><sl-button pill> Topic</sl-button></sl-tooltip>
    <sl-tooltip content=${d.phase}><sl-button pill> Phase</sl-button></sl-tooltip>
    <sl-tooltip content=${d.gap}><sl-button pill> Gap</sl-button></sl-tooltip>
    </sl-button-group> 
    </sl-card>  
    </sl-carousel-item>
    `
};

export default {get_suggestion_card };