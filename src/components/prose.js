// tooltip contents:
const tt = {
    sector: {
        "label": "Sector", 
        "general": "Which sectors should be screened?",
        "options": {"null": ""}
    },
    phases: {
        "label": "Risk management cycle",
        "general": "To what phases, categories and aspects of the risk management cycle, according to the RRMA scheme, does the gap issue mostly relate to?",
        "options": {
            "Prevention: structural": "Active grey, green and hybrid measures to mitigate or control hazards; structural protection measures, technical protection infrastructure, incl. related protection concepts that are part of protection systems; nature-based, bio-engineered, or hybrid protection measures; object-related structural protection measures at property level (presence, design events, effectiveness, adequacy for magnitude and frequency of current and future hazard events, condition, maintenance)",
            "Prevention: non-structural": "Measures to reduce exposure and vulnerability; hazard and risk assessments; hazard and risk maps; contingency plans and implementation; passive risk prevention by spatial planning, land use management & ecosystem-based adaptation services; insurance-based incentives for prevention; information & communication",
            "Preparedness: tools": "Tool-based measures to anticipate and prepare for hazard events; monitoring, forecasting and early warning systems; impact predictions (availability, reliability, accuracy); warning and alert chains; insurance; resource planning; information & communication; organisation",
            "Preparedness: tool implementation": "Standard procedures (available, known, trained, implemented, sufficient, effective); deployment planning; training; compliance with warnings and procedures",
            "Response: tools": "Organisation, structures, procedures, protocols for managing enfolding events, mitigating their consequences, and limiting extent of damage (availability, quality, adequacy); information-sharing and communication mechanism; resources",
            "Response: tool implementation": "Implementation of organisational, procedural, informational & communicative arrangements (adequacy, effectiveness, compliance) for alert, rescue and damage mitigation",
            "Recovery: structural":	"Post-event measures to repair and reconstruct after damage events; repair and compensation of physical damage; funding & financing of reconstruction; building back better; mitigating long-term consequences",
            "Recovery: learning": "Post-event measures to evaluate and learn from damage events; debriefings;  documentation and analysis of events; revision and re-adjustment of risk management frameworks; strengthening risk prevention and future resilience",
            "All, cross-cutting, generic":	"Cross-sectional, generic or overarching; relating to the entire risk management cycle"
        }
    },
    gaps: {
        "label": "Policy gaps",
        "general": "What are the prevailing root causes of the gap? To what dimensions do these main causes and needs for action predominantly belong?",
        "options": {
            "Knowledge, data & evidence": "Lacking or insufficient data, information, evidence and assessments (e.g. related to climate, hazards, risk, management options) prevents more effective risk management policies and actions; uncertainties; monitoring & early warning systems and forecasting tools missing or not fit-for-purpose; complexity of climate-hazard-impact-event-management interactions and of compound and cascading risk; too little knowledge exchange & transfer",
            "Awareness & recognition": "Issues and (emerging) challenges not recognized or not perceived as urgent enough; problems and solutions have not entered policy agendas yet or have too little priority; lack of political will to act; available knowledge about key risks and management options not known or not acccessible to decision-makers; lacking familiarity with existing plans, rules and procedures",
            "Policy design & planning": "Policies (strategies, action plans, instruments, procedures) for new, emerging or extreme risks missing; existing policies not fit-for-purpose, e.g. critical issues are blind spots (e.g., emerging risks, cascading risks, compound impacts), or clear objectives and actions to manage key risks missing, lacking or incomplete; planning instruments (e.g. spatial plans, land use plans, flood protection plans, forest management plans) missing or not adequately addressing key risks; restricted or disparate coverage of geograpic areas by policies (e.g., when policies do not apply to the entire territory of interest); certain vulnerable social groups or exposed system elements not covered; too rigid and unflexible policies that do not allow adapting to changing circumstances; lack of coherence and integration between different policy fields, leading to conflicting goals and trade-offs; lack of future-oriented foresight in policies, e.g. no preparedness for future climate change or changes in non-climatic risk drivers",
            "Governance: organisational & procedural": "Responsibilities (organisations, authorities, actors) missing or unclear; institutional arrangements, cooperation agreements, communication mechanisms, horizontal and vertical governance bodies and mechanisms missing or inadequate; institutional practices and routines, standard operating procedures and protocols missing or not fit-for-purpose; lack of stakeholder involvement; cross-border cooperation inadequate; lack of supportive and enabling governance frameworks for local and regional actors",
            "Legislative & regulatory": "Absence or lack of updating of necessary legislation and regulatory provisions (laws, subordinated legislation, ordinances, implementing regulations, norms, standards) to address critical issues or emerging challenges; existing legislation or regulations acting as barrier to solutions",
            "Resources, capacity & implementation": "Policies, instruments and actions exist largely on paper only, implementation widely lacking or insufficient; lack of funding and financial resources; lack of capacities (staff, equipment, expertise, skills, training, infrastructure, technology, coordination capacity) among responsible insitutions and actors to implement action; lacking availability of solutions (tools, instruments, measures)",
            "Compliance & enforcement": "Existing regulations, plans and procedures not applied or followed; insufficient enforcement and execution of legal or policy provision, incl. supervision and inspection",
            "Effectiveness & efficiency": "Measures in place are lacking effectiveness and efficiency in coping with key risks (e.g. due to insufficient consideration of extreme events, cascading risks or residual risk, poor implementation, technical or human failure, maladaptive effects not considered, missing cost-benefit or cost-effectiveness evaluations)",
            "Local risk preparedness & community-driven adaptive capacities": "Low local preparedness levels; local prevention and coping capacities not fully exploited; lack of bottom-up or bottom-linked initiatives for review and improvement of risk management practices; disaster events not used as windows of opportunities for reflection and learning (e.g., systematic debriefings and structured event documentation lacking; lessons learnt missed or not implemented in practice); endogenous potentials for increasing resilience underused",
            "Other": ""
        }
    },
    ownerships: {
        "label": "Risk ownership level",
        "general": "At what levels (government, political-administrative system, governance, society) do the most crucial decisions or actions need to be taken in order to overcome the policy gap? Actors at what levels are primarily responsible and accountable for implementing the related need for action? Select the level that has the key role and is most needed and decisive for effective solutions. If possible, choose only the one option that applies most.",
        "options": {
            "Transnational": "Gaps & needs that have a clear Alpine-wide or transboundary dimension and can best be tackled by actors (cooperation structures, institutions, networks), instruments and processes at the scale of the Alpine macro-region, the Alpine Convention area, or at cross-border level. Typical examples include EUSALP, the Alpine Convention, the Alpine Space programme, cross-border Interreg programmes, cross-border spatial planning instruments, or cross-border cooperation agreements. The category 'transnational' also applies if the management of transboundary hazards and risks as well as of related transboundary resources (e.g. international river basins) requires cross-border cooperation and coordination between entities of two or more countries.    ",
            "National & subnational": "Gaps & needs that depend primarily on top-down or top-linked agency. Responsible actors (government, authorities, public administrations, organisations, institutions, bodies, networks, individuals) are allocated at i) national, country-wide level (countries / NUTS0) and at ii) subnational territorial level (e.g., Länder, federal states, cantons, regions, provinces / NUTS1, NUTS2, NUTS3). This includes in particular higher-ranking levels of: i) the territorial / political-administrative system with own compentence areas, legislative powers, policy-making and financing capacities, ii) the market system with capacity to decide about business policies, and iii) organized civil society (e.g., NGOs, interest groups, chambers, associations).",
            "Local & regional": "Gaps & needs that depend primarily on bottom-up or bottom-linked agency. Responsible actors (authorities, politicians, public administration, organisations, institutions, agencies, bodies, networks, individuals) are allocated at the level of municipalities, cities, micro-regions, inter-municipal cooperations, municipality mergers, management/planning/development regions (LAU - NUTS3).",
            "Multi-level, cross-level, co-owned": "Decisions and actions that need to be shaped and taken collectively by actors at (several) different levels and that inevitably require collaboration and coordination across levels. This category applies in particular if overcoming the gap requires to an equal or similar extent the agency and coordinated actions by  the national/subnational level and/or the local/regional level and/or the private/individual level. In cases where the primary main responsibility cannot be clearly allocated to one distinct level alone, this multi-level option should be chosen.",
            "Private & individual (citizens, households, property owners)": "Gaps & needs that primarily need to be tackled by individual citizens, typically in their roles as households, land or property owners, tenants, insurance customers, etc. ",
            "Non-specific, generic, other": "If none of the above categories apply."
        }
    },
    relations: {"label": "Risk related to",
        "general": "What type of natural hazard process or climate impact causes the risk addressed by the gap?",
        "options": {
            "Floods: fluvial": "Risks related to flooding at rivers; innundations caused by high streamflow exceeding the flow capacity of a water body",
            "Flooding: pluvial": "Risks related to innundation independent of water bodies caused by heavy rainfall exceeding the infiltration capacity of the soil and subsequent surface runoff; often also called (urban) flashflood",
            "Hydrological hazards: other": "Risks related to mudflows, debris flow, hyperconcentrated flow, torrential flooding: transport processes of sediment, water and often driftwood in torrential catchments; landslides of the flow type and torrential process, characterized by high sediment concentration and  internal deformation of the material",
            "Gravitational hazards: mass movements": "Risks related to landslide, earth flow: shallow slides and deep-seated slides of earth and/or debris with a sliding process along a distinct rupture surface or shear zone. Transition into debris flow may often occur.  Rockfall, rock avalanche, rock slide, rock slope failure: fall process of single blocks;  rapid, massive, flow-like motion of fragmented rock from a large rock slide or rock fall, characterised by large runout lengt; sliding of a rock mass along a discrete shear zone/rupture surfac.e",
            "(Peri-)Glacial hazards": "Risks related to glacier collapse, ice avalanches, glacial lake outbursts",
            "Drought": "Risks related to soil mostuire drought, streamflow drought, groundwater drought, flashdrought; may cause agricultural drought, ecological drought, socio-economic drought ",
            "Forest fire, wildfire": "Drought, heat, bark beetle infestations and windthrow are pre-disposing factors for forest fire risk.",
            "Forest disturbances & loss of protective forest functions": "Risks related to bark beetle infestations, windthrow, water stress, leading to deterioriating quantity, quality and effectiveness of protection forests with increasing downslope hazard potential and cascading impacts across sectors.",
            "Direct extreme weather impacts": "Direct physical impacts of extreme weather agents (strong winds, hail, lightning, extreme temperature, snow and ice load, lightning) on exposed objects (buildings, infrastructure, humans, agricultural crops, etc.)",
            "Multi-hazard, multi-risk": "If more than four distinct hazard/risk categories apply. Includes gap topics with explicit and clear reference to compound hazards and cascading risks."
        }
    },
    validation: {
        "label": "Local validation",
        "general": "Has this measure undergone local validation?",
        "options": {"null": "null"}
    }
}

export default {
    tt
}