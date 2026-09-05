
addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 0,
    symbol() {return '[[ Resets ]]'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return '[[ Resets ]]'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['rank'])},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})
addLayer("r", {
    name: "r", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Reset", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Reset", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#08c5e7",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "reset points", // Name of prestige currency
    resourceI18N: "reset points", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "points", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.mul(temp.rank.effect[1])
		if (hasUpgrade(this.layer,14)) mult = mult.mul(upgradeEffect(this.layer, 14))
		if (hasUpgrade(this.layer,21)) mult = mult.mul(upgradeEffect(this.layer, 21))
		if (hasUpgrade("reb",11)) mult = mult.mul(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	passiveGeneration() {
        return hasUpgrade("reb", 22)
    },
	doReset(resettingLayer) {
        if (resettingLayer !== "r"
			&& resettingLayer !== "rank"
			&& resettingLayer !== "tier"
			&& resettingLayer !== "tetr") layerDataReset("r")
    },
    upgrades: {
        11: {
            title: "Multiplier I",
            titleI18N: "Multiplier I", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points by 2",
            descriptionI18N: "Multiply points by 2", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("1")},
            unlocked(){return true}
        },
        12: {
            title: "Multiplier II",
            titleI18N: "Multiplier II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points based on reset points",
            descriptionI18N: "Multiply points based on reset points", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.pow(0.5).div(4)) // sqrt(x)/2
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("2")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Self-Synergy I",
            titleI18N: "Self-Synergy I", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points based on itself",
            descriptionI18N: "Multiply points based on itself", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.points.add(1).log10().pow(2).div(10)) // (log10(x+1)^2)/10
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("4")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
        14: {
            title: "Self-Synergy II",
            titleI18N: "Self-Synergy II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply reset points based on itself",
            descriptionI18N: "Multiply reset points based on itself", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.add(1).log10().sqrt().div(10)) // sqrt(log10(x+1))/10
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("15")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
        21: {
            title: "Reset Booster I",
            titleI18N: "Reset Booster I", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply reset points based on points",
            descriptionI18N: "Multiply reset points based on points", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.points.add(1).log10().sqrt().div(5)) // sqrt(log10(x+1))/5
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("25")},
            unlocked(){return hasUpgrade(this.layer,14)}
        },
        22: {
            title: "Multiplier III",
            titleI18N: "Multiplier III", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points by 3",
            descriptionI18N: "Multiply points by 3", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("100")},
            unlocked(){return hasUpgrade(this.layer,21)}
        },
        23: {
            title: "Rebirth",
            titleI18N: "Rebirth", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Unlock a new layer.",
            descriptionI18N: "Unlock a new layer.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            cost:function(){return new Decimal("500")},
            unlocked(){return hasUpgrade(this.layer,22)}
        },
    },
    hotkeys: [
        {key: "r", description: "R: Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "upgrades"
    ],
    layerShown(){return true},
})
addLayer("reb", {
    name: "reb", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Rebirth", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Rebirth", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#16a1d0",
    requires: new Decimal(500), // Can be a function that takes requirement increases into account
    resource: "rebirth points", // Name of prestige currency
    resourceI18N: "rebirth points", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "reset points", // Name of resource prestige is based on
    baseResourceI18N: "reset points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.r.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
	effect() {
		return player[this.layer].points.add(1).cbrt()
	},
	effectDescription() {
		return `which are boosting points by x${format(temp[this.layer].effect)}`
	},
	effectDescriptionI18N() {
		return `which are boosting points by x${format(temp[this.layer].effect)}`
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	doReset(resettingLayer) {
        if (resettingLayer !== "reb"
			&& resettingLayer !== "rank"
			&& resettingLayer !== "tier"
			&& resettingLayer !== "tetr") layerDataReset("reb")
    },
    upgrades: {
        11: {
            title: "Multiplier IV",
            titleI18N: "Multiplier IV", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply reset points by 1.5",
            descriptionI18N: "Multiply reset points by 1.5", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("1")},
            unlocked(){return true}
        },
       	12: {
            title: "Maximized I",
            titleI18N: "Maximized I", 
            description: "Buy max Rank.",
            descriptionI18N: "Buy max Rank.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("35")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Rank Synergy I",
            titleI18N: "Rank Synergy I", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply reset points based on ranks",
            descriptionI18N: "Multiply reset points based on ranks", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.rank.points.pow(0.5).div(4)) // sqrt(x)/2
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("65")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
       	14: {
            title: "No Resets I",
            titleI18N: "No Resets I", 
            description: "Ranks do not reset anything.",
            descriptionI18N: "Ranks do not reset anything.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("750")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
       	21: {
            title: "Automation I",
            titleI18N: "Automation I", 
            description: "Automate Ranks.",
            descriptionI18N: "Automate Ranks.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("5000")},
            unlocked(){return hasUpgrade(this.layer,14)}
        },
       	22: {
            title: "Passive Gain I",
            titleI18N: "Passive Gain I", 
            description: "Passively gain reset points.",
            descriptionI18N: "Passively gain reset points.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("25000")},
            unlocked(){return hasUpgrade(this.layer,21)}
        },
       	23: {
            title: "Prestige",
            titleI18N: "Prestige", 
            description: "Unlock a new layer.",
            descriptionI18N: "Unlock a new layer.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("100000")},
            unlocked(){return hasUpgrade(this.layer,22)}
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "upgrades"
    ],
    layerShown(){return true},
})
addLayer("pres", {
    name: "pres", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Prestige", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Prestige", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#1e81c2",
    requires: new Decimal(100_000), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    resourceI18N: "prestige points", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "rebirth points", // Name of resource prestige is based on
    baseResourceI18N: "rebirth points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.reb.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
	effect() {
		return player[this.layer].points.add(1).sqrt()
	},
	effectDescription() {
		return `which are boosting points by x${format(temp[this.layer].effect)}`
	},
	effectDescriptionI18N() {
		return `which are boosting points by x${format(temp[this.layer].effect)}`
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	doReset(resettingLayer) {
        if (resettingLayer !== "pres"
			&& resettingLayer !== "rank"
			&& resettingLayer !== "tier"
			&& resettingLayer !== "tetr") layerDataReset("pres")
    },
    upgrades: {
        11: {
            title: "Tier Synergy I",
            titleI18N: "Tier Synergy I", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply reset points based on tiers",
            descriptionI18N: "Multiply reset points based on tiers", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.tier.points.sqrt().div(4))
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("1")},
            unlocked(){return true}
        },
        12: {
            title: "Rank Synergy II",
            titleI18N: "Rank Synergy II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply rebirth points based on ranks",
            descriptionI18N: "Multiply rebirth points based on ranks", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.rank.points.cbrt().div(8))
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("2")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
       	13: {
            title: "Maximized II",
            titleI18N: "Maximized II", 
            description: "Buy max Tiers.",
            descriptionI18N: "Buy max Tiers.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("8")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
       	14: {
            title: "Reset Booster II",
            titleI18N: "Reset Booster II", 
            description: "Multiply ranks based on reset points.",
            descriptionI18N: "Multiply ranks based on reset points.", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.reset.points.add(1).log10().pow(1.5).div(16))
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("25")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
       	21: {
            title: "No Resets II",
            titleI18N: "No Resets II", 
            description: "Tiers do not reset anything.",
            descriptionI18N: "Tiers do not reset anything.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("100")},
            unlocked(){return hasUpgrade(this.layer,14)}
        },
       	22: {
            title: "Reset Booster III",
            titleI18N: "Reset Booster III", 
            description: "Multiply rebirth points based on reset points.",
            descriptionI18N: "Multiply rebirth points based on reset points.", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.reset.points.add(1).log10().div(16))
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("500")},
            unlocked(){return hasUpgrade(this.layer,21)}
        },
       	23: {
            title: "Automation II",
            titleI18N: "Automation II", 
            description: "Automate tiers.",
            descriptionI18N: "Automate tiers.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("2500")},
            unlocked(){return hasUpgrade(this.layer,22)}
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "upgrades"
    ],
    layerShown(){return true},
})

addLayer("2layer", {
    name: "sideLayer2",
    position: -1,
    row: 1,
    symbol() {return '[[ Ranking ]]'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return '[[ Ranking ]]'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['r'])},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})
addLayer("rank", {
    name: "rank", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Ranks (R)", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Ranks (R)", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f2b582",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "ranks", // Name of prestige currency
    resourceI18N: "ranks", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "points", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 2,
    exponent: 0.8, // Prestige currency exponent
	effect() {
		let pts = player[this.layer].points
		let eff = new Decimal(1.15).pow(pts.pow(0.8))
		if (pts.gte(15)) eff = eff.div(new Decimal(1).add(pts.div(15).pow(3).div(5)))
		if (pts.gte(250)) eff = eff.root(new Decimal(1).add(pts.div(250).sqrt().div(5)))
		return eff
	},
	effectDescription() {
		return `which are boosting points by x${format(temp[this.layer].effect)}${player[this.layer].points.gte(15)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(250)?"<sup>2</sup>":""})</span>`:""}`
	},
	effectDescriptionI18N() {
		return `which are boosting points by x${format(temp[this.layer].effect)}${player[this.layer].points.gte(15)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(250)?"<sup>2</sup>":""})</span>`:""}`
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    directMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("tier",13)) mult = mult.mul(upgradeEffect("tier", 13))
		if (hasUpgrade("tetr",13)) mult = mult.mul(1.1)
		if (hasUpgrade("tier",21)) mult = mult.mul(upgradeEffect("tetr", 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	canBuyMax() {return hasUpgrade("reb",12)},
	doReset(resettingLayer) {
        if (resettingLayer !== "rank") layerDataReset("rank")
    },
    resetsNothing() {
        return hasUpgrade("reb",14)
    },
    autoPrestige() {
        return hasUpgrade("reb",21)
    },
    upgrades: {
        11: {
            title: "Multiplier V",
            titleI18N: "Multiplier V", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points by 2",
            descriptionI18N: "Multiply points by 2", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("2")},
            unlocked(){return true}
        },
        12: {
            title: "Multiplier VI",
            titleI18N: "Multiplier VI", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Add +1 to base effect of Multiplier I",
            descriptionI18N: "Add +1 to base effect of Multiplier I", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("3")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Self-Synergy III",
            titleI18N: "Self-Synergy III", 
            description: "Multiply points based on itself",
            descriptionI18N: "Multiply points based on itself", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.points.add(1).log10().pow(2).div(4)) // (log10(x+1)^2)/4
				return mult
			},
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("5")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
        14: {
            title: "Tiers",
            titleI18N: "Tiers", 
            description: "Unlock a new layer.",
            descriptionI18N: "Unlock a new layer.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("7")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
    },
    hotkeys: [
        {key: "p", description: "P: Rank up", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "upgrades"
    ],
    layerShown(){return true},
})

addLayer("tier", {
    name: "tier", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Tiers (T)", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Tiers (T)", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#efd66b",
    requires: new Decimal(7), // Can be a function that takes requirement increases into account
    resource: "tiers", // Name of prestige currency
    resourceI18N: "tiers", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "ranks", // Name of resource prestige is based on
    baseResourceI18N: "ranks", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.rank.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 1.35,
    exponent: 0.75, // Prestige currency exponent
	effect() {
		let pts = player[this.layer].points
		let pointMulti = new Decimal(1.3).pow(pts.pow(0.7))
		if (pts.gte(20)) pointMulti = pointMulti.div(new Decimal(1).add(pts.div(20).pow(3).div(5)))
		if (pts.gte(250)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(250).sqrt().div(5)))
		let resetMulti = new Decimal(1.2).pow(pts.pow(0.4))
		if (pts.gte(20)) resetMulti = resetMulti.div(new Decimal(1).add(pts.div(20).sqrt().div(5)))
		if (pts.gte(250)) resetMulti = resetMulti.root(new Decimal(1).add(pts.div(250).cbrt().div(5)))
		let eff = [pointMulti, resetMulti]
		return eff
	},
	effectDescription() {
		return `which are boosting points by x${format(temp[this.layer].effect[0])} and reset points by x${format(temp[this.layer].effect[1])}${player[this.layer].points.gte(20)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(250)?"<sup>2</sup>":""})</span>`:""}`
	},
	effectDescriptionI18N() {
		return `which are boosting points by x${format(temp[this.layer].effect[0])} and reset points by x${format(temp[this.layer].effect[1])}${player[this.layer].points.gte(20)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(250)?"<sup>2</sup>":""})</span>`:""}`
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	doReset(resettingLayer) {
        if (resettingLayer !== "tier") layerDataReset("tier")
    },
	canBuyMax() {return hasUpgrade("pres",13)},
    resetsNothing() {
        return hasUpgrade("pres",21)
    },
    autoPrestige() {
        return hasUpgrade("pres",23)
    },
    upgrades: {
        11: {
            title: "Booster I",
            titleI18N: "Booster I", 
            description: "Multiply points based on tiers",
            descriptionI18N: "Multiply points based on tiers",
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.add(1).log10().pow(2)) // log10(x+1)^2
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("2")},
            unlocked(){return true}
        },
        12: {
            title: "Multiplier VII",
            titleI18N: "Multiplier VII", 
            description: "Multiply points by 2.5.",
            descriptionI18N: "Multiply points by 2.5.",
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("3")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Rank Booster I",
            titleI18N: "Rank Booster I", 
            description: "Multiply ranks based on points",
            descriptionI18N: "Multiply ranks based on points", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.points.add(1).log10().cbrt().div(5)) // cbrt(log10(x+1))/5
				return mult
			},
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("6")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
        14: {
            title: "Multiplier VIII",
            titleI18N: "Multiplier VIII", 
            description: "Multiply points based on tiers",
            descriptionI18N: "Multiply points based on tiers", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.root(2.5)) // root2.5(x+1)
				return mult
			},
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("10")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
        21: {
            title: "Tetrs",
            titleI18N: "Tetrs", 
            description: "Unlock a new layer.",
            descriptionI18N: "Unlock a new layer.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("16")},
            unlocked(){return hasUpgrade(this.layer,14)}
        },
    },
    hotkeys: [],
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "upgrades"
    ],
    layerShown(){return hasUpgrade("rank",14) || hasAchievement("ach",12)},
})
addLayer("tetr", {
    name: "tetr", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Tetrs (Ŧ)", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Tetrs (Ŧ)", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#cbe368",
    requires: new Decimal(16), // Can be a function that takes requirement increases into account
    resource: "tetrs", // Name of prestige currency
    resourceI18N: "tetrs", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "tiers", // Name of resource prestige is based on
    baseResourceI18N: "tiers", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.tier.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 1.1,
    exponent: 0.85, // Prestige currency exponent
	effect() {
		let pts = player[this.layer].points
		let pointMulti = new Decimal(1.5).pow(pts.pow(0.7))
		if (pts.gte(30)) pointMulti = pointMulti.div(new Decimal(1).add(pts.div(20).pow(3).div(5)))
		if (pts.gte(250)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(250).sqrt().div(5)))
		let resetMulti = new Decimal(1.3).pow(pts.pow(0.4))
		if (pts.gte(30)) resetMulti = resetMulti.div(new Decimal(1).add(pts.div(30).sqrt().div(5)))
		if (pts.gte(250)) resetMulti = resetMulti.root(new Decimal(1).add(pts.div(250).cbrt().div(5)))
		let eff = [pointMulti, resetMulti]
		return eff
	},
	effectDescription() {
		return `which are boosting points by x${format(temp[this.layer].effect[0])} and reset points by x${format(temp[this.layer].effect[1])}${player[this.layer].points.gte(30)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(250)?"<sup>2</sup>":""})</span>`:""}`
	},
	effectDescriptionI18N() {
		return `which are boosting points by x${format(temp[this.layer].effect[0])} and reset points by x${format(temp[this.layer].effect[1])}${player[this.layer].points.gte(30)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(250)?"<sup>2</sup>":""})</span>`:""}`
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	doReset(resettingLayer) {
        if (resettingLayer !== "tetr") layerDataReset("tetr")
    },
    upgrades: {
        11: {
            title: "Booster III",
            titleI18N: "Booster III", 
            description: "Multiply points based on tiers",
            descriptionI18N: "Multiply points based on tiers",
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.tier.points.add(1).log10().pow(2)) // log10(x+1)^2
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("2")},
            unlocked(){return true}
        },
        12: {
            title: "Meta-Upgrade I",
            titleI18N: "Meta-Upgrade I", 
            description: "Unlock a new upgrade.",
            descriptionI18N: "Unlock a new upgrade.",
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("3")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Rank Multiplier I",
            titleI18N: "Rank Multiplier I", 
            description: "Multiply ranks by 1.1.",
            descriptionI18N: "Multiply ranks by 1.1.",
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("4")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
        14: {
            title: "Multiplier IX",
            titleI18N: "Multiplier IX", 
            description: "Multiply points by 2.",
            descriptionI18N: "Multiply points by 2.",
            style: {"border-radius": "0 15px 15px 0"},
            cost:function(){return new Decimal("6")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
        21: {
            title: "Rank Booster II",
            titleI18N: "Rank Booster II", 
            description: "Multiply ranks based on tetrs",
            descriptionI18N: "Multiply ranks based on tetrs", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.add(1).log10().cbrt()) // cbrt(log10(x+1))
				return mult
			},
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("8")},
            unlocked(){return hasUpgrade(this.layer,14)}
        },
        22: {
            title: "Maximized II",
            titleI18N: "Maximized II", 
            description: "Buy max tiers.",
            descriptionI18N: "Buy max tiers.",
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("17")},
            unlocked(){return hasUpgrade(this.layer,21)}
        },
    },
    hotkeys: [],
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "upgrades"
    ],
    layerShown(){return hasUpgrade("tier",21) || hasAchievement("ach",23)},
})
addLayer("ach", {
    name: "ach",
    position: -1,
    row: -1,
    symbol() {return '[[ Achievements ]]'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return '[[ Achievements ]]'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
    }},
    color: "#fe0000",
    layerShown() {return true},
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
// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed
