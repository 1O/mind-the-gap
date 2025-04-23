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



export default {
    rollup_data, animate_badge
}