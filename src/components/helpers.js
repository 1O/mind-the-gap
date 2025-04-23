import * as aq from "npm:arquero";


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


const animate_badge = (currentY, targetY) => {
    const badge = document.getElementById('badge_matchcount');
    const easing = 0.1;
    const delta = targetY - currentY;
    currentY += delta * easing;
    badge.style.transform = `translateY(${currentY - 100}px)`; // minus original offset
    requestAnimationFrame(animate_badge);
  }


export default {
    rollup_data, animate_badge
}