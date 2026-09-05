function layerDisplay(id){
    if(tmp[id].layerShown===undefined){
        return true
    }
    return tmp[id].layerShown
}

function layerDisplayTotal(id){
    for(i in id){
        let a = layerDisplay(id[i])
        if(a==true){
            return true
        }
    }
}

addLayer("SideTab", {
    name: "AllLayer",
    position: -999,
    row: 0,
    symbol() {return i18n('其他页面', 'Side Tab', false)},
    nodeStyle: {"font-size": "15px", "text-center": "center", "height": "30px"},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    small: true,
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['Setting','Statistics','Information','Changelog'])},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("Setting", {
    name: "Setting",
    position: -998,
    row: 0,
    symbol() {return i18n('设置', 'Setting', false)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("Information", {
    name: "Information",
    position: -997,
    row: 0,
    symbol() {return i18n('信息', 'Information', false)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("Changelog", {
    name: "Changelog",
    position: -996,
    row: 0,
    symbol() {return i18n('更新日志', 'Changelog', false)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})
addLayer("ach", {
    name: "ach",
    position: -995,
    row: 0,
    symbol() {return 'Achievements'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return 'Achievements'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#fe0000",
    type: "none",
    achievements: {
        11: {
            name: "First Rank",
            done() { return player.rank.points.gte(1) },
            tooltip: "Rank up once.",
        },
        12: {
            name: "First Tier",
            done() { return player.tier.points.gte(1) },
            tooltip: "Tier up once.",
        },
        13: {
            name: "Tenth Rank",
            done() { return player.rank.points.gte(10) },
            tooltip: "Get Rank 10.",
        },
        14: {
            name: "Thousands",
            done() { return player.points.gte(1000) },
            tooltip: "Get 1,000 points.",
        },
        15: {
            name: "Start over",
            done() { return player.r.points.gte(1) },
            tooltip: "Reset once.",
        },
        21: {
            name: "Tenth Tier",
            done() { return player.tier.points.gte(10) },
            tooltip: "Get Tier 10.",
        },
        22: {
            name: "Too many resets!",
            done() { return player.r.points.gte(25) },
            tooltip: "Get 25 reset points.",
        },
        23: {
            name: "First Tetr",
            done() { return player.tetr.points.gte(1) },
            tooltip: "Tetr up once.",
        },
        24: {
            name: "More upgrades?",
            done() { return hasUpgrade("tetr",12) },
            tooltip: "Buy Meta-Upgrade I upgrade.",
        },
        25: {
            name: "QoL",
            done() { return hasUpgrade("tier",22) },
            tooltip: "Buy Maximized I upgrade.",
        },
        31: {
            name: "Tenth Tetr",
            done() { return player.tetr.points.gte(10) },
            tooltip: "Get Tetr 10.",
        },
        32: {
            name: "Reborn",
            done() { return player.reb.points.gte(1) },
            tooltip: "Rebirth once.",
        },
    },
    tabFormat: [
		"blank", 
		["display-text", function() { return "Achievements: "+player.ach.achievements.length+"/"+(Object.keys(tmp.ach.achievements).length - 2) }], 
		"blank", "blank",
		"achievements",
	],
})
