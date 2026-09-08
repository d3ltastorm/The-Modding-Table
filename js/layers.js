
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
		mult = mult.mul(temp.tier.effect[1])
		mult = mult.mul(temp.tetr.effect[1])
		if (hasUpgrade(this.layer,14)) mult = mult.mul(upgradeEffect(this.layer, 14))
		if (hasUpgrade(this.layer,21)) mult = mult.mul(upgradeEffect(this.layer, 21))
		if (hasUpgrade("reb",11)) mult = mult.mul(1.5)
		if (hasUpgrade("sr",13)) mult = mult.mul(2)
		mult = mult.mul(temp.pent.effect[1])
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	passiveGeneration() {
        return hasUpgrade("reb", 22)
    },
	doReset(resettingLayer) {
		let keep = [];
        if (resettingLayer == "reb"
		   || resettingLayer == "pres") layerDataReset("r", keep)
    },
    upgrades: {
        11: {
            title: "Reset Multiplier",
            titleI18N: "Reset Multiplier", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points by 2",
            descriptionI18N: "Multiply points by 2", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("1")},
            unlocked(){return true}
        },
        12: {
            title: "Reset Multiplier II",
            titleI18N: "Reset Multiplier II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points based on reset points",
            descriptionI18N: "Multiply points based on reset points", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.add(1).log10().pow(2).div(5)) // (log10(x+1)^2)/5
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("2")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Reset Self-Synergy",
            titleI18N: "Reset Self-Synergy", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points based on itself",
            descriptionI18N: "Multiply points based on itself", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.points.add(1).log10().pow(1.5).div(4).mul(player.points.div(2).root(8))) // ((log10(x+1)^1.5)/4)*rt8(x/2)
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("4")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
        14: {
            title: "Reset Self-Synergy II",
            titleI18N: "Reset Self-Synergy II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
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
            title: "Reset Multiplier III",
            titleI18N: "Reset Multiplier III", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
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
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("500")},
            unlocked(){return hasUpgrade(this.layer,22)}
        },
        24: {
            title: "Reset Rank Booster",
            titleI18N: "Reset Rank Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply your ranks by 1.1.",
            descriptionI18N: "Multiply your ranks by 1.1.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("100000000")},
            unlocked(){return hasUpgrade(this.layer,23)}
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
		let keep = [];
		if (hasUpgrade("sr",31)) keep.push("upgrades");
        if (resettingLayer == "pres") layerDataReset("reb", keep)
    },
    upgrades: {
        11: {
            title: "Rebirth Multiplier",
            titleI18N: "Rebirth Multiplier", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply reset points by 1.5",
            descriptionI18N: "Multiply reset points by 1.5", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("1")},
            unlocked(){return true}
        },
       	12: {
            title: "Rank Maximized",
            titleI18N: "Rank Maximized", 
            description: "Buy max Rank.",
            descriptionI18N: "Buy max Rank.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("35")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Rebirth Rank Booster",
            titleI18N: "Rebirth Rank Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply reset points based on ranks",
            descriptionI18N: "Multiply reset points based on ranks", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.rank.points.pow(0.5).div(4)) // sqrt(x)/2
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("250")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
       	14: {
            title: "No Rank Resets",
            titleI18N: "No Rank Resets", 
            description: "Ranks do not reset anything.",
            descriptionI18N: "Ranks do not reset anything.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("750")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
       	21: {
            title: "Rank Automation",
            titleI18N: "Rank Automation", 
            description: "Automate Ranks.",
            descriptionI18N: "Automate Ranks.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("5000")},
            unlocked(){return hasUpgrade(this.layer,14)}
        },
       	22: {
            title: "Reset Passive Gain",
            titleI18N: "Reset Passive Gain", 
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
        24: {
            title: "Kept Reset Upgrades",
            titleI18N: "Kept Reset Upgrades", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Keep your reset upgrades on reset.",
            descriptionI18N: "Keep your reset upgrades on reset.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("100000000")},
            unlocked(){return hasUpgrade(this.layer, 23)}
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
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
		let keep = [];
        if (resettingLayer == "pent") layerDataReset("pres", keep)
    },
    upgrades: {
        11: {
            title: "Tier Reset Booster",
            titleI18N: "Tier Reset Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
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
            title: "Rank Rebirth Booster",
            titleI18N: "Rank Rebirth Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
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
            title: "Tier Maximized",
            titleI18N: "Tier Maximized", 
            description: "Buy max Tiers.",
            descriptionI18N: "Buy max Tiers.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("25")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
       	14: {
            title: "Prestige Powers",
            titleI18N: "Prestige Powers", 
            description: "^1.05 points.",
            descriptionI18N: "^1.05 points.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("50")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
       	15: {
            title: "Prestige Rank Booster",
            titleI18N: "Prestige Rank Booster", 
            description: "Multiply ranks based on reset points.",
            descriptionI18N: "Multiply ranks based on reset points.", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.r.points.add(1).log10().pow(1.5).div(16))
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("75")},
            unlocked(){return hasUpgrade(this.layer,14)}
        },
       	21: {
            title: "No Tier Resets",
            titleI18N: "No Tier Resets", 
            description: "Tiers do not reset anything.",
            descriptionI18N: "Tiers do not reset anything.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("350")},
            unlocked(){return hasUpgrade(this.layer,15)}
        },
       	22: {
            title: "Reset Rebirth Booster",
            titleI18N: "Reset Booster III", 
            description: "Multiply rebirth points based on reset points.",
            descriptionI18N: "Multiply rebirth points based on reset points.", 
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player.r.points.add(1).log10().div(16))
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("2500")},
            unlocked(){return hasUpgrade(this.layer,21)}
        },
       	23: {
            title: "Tier Automation",
            titleI18N: "Tier Automation", 
            description: "Automate tiers.",
            descriptionI18N: "Automate tiers.", 
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("15000")},
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
addLayer("sr", {
    name: "sr", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Super Reset", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Super Reset", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#77e4f8",
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "super reset points", // Name of prestige currency
    resourceI18N: "super reset points", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "points", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	doReset(resettingLayer) {
		let keep = [];
        if (resettingLayer == "asc"
		   || resettingLayer == "tsc"
		   || resettingLayer == "pent") layerDataReset("sr", keep)
    },
    upgrades: {
        11: {
            title: "Rank Self-Synergy II",
            titleI18N: "Rank Self-Synergy II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply ranks based on itself",
            descriptionI18N: "Multiply ranks based on itself", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("1")},
            unlocked(){return true}
        },
        12: {
            title: "Super Reset Booster",
            titleI18N: "Super Reset Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points based on super reset points.",
            descriptionI18N: "Multiply points based on super reset points.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.add(1).log10().mul(2).pow(5).mul(6)) // (log10(x+1)^5)*6
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("3")},
            unlocked(){return hasUpgrade(this.layer, 11)}
        },
        13: {
            title: "Buffed",
            titleI18N: "Buffed", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points by 25 and reset points by 2.",
            descriptionI18N: "Multiply points by 25 and reset points by 2.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("100")},
            unlocked(){return hasUpgrade(this.layer, 12)}
        },
        14: {
            title: "Kept Prestige Upgrades",
            titleI18N: "Kept Prestige Upgrades", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Keep your prestige upgrades on reset.",
            descriptionI18N: "Keep your prestige upgrades on reset.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("2500")},
            unlocked(){return hasUpgrade(this.layer, 13)}
        },
        15: {
            title: "Super Reset Tier Booster",
            titleI18N: "Super Reset Tier Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply tiers based on super reset points.",
            descriptionI18N: "Multiply tiers based on super reset points.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(1);
				mult = mult.add(player[this.layer].points.add(1).log10().add(1).log10())
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("35000")},
            unlocked(){return hasUpgrade(this.layer, 14)}
        },
        21: {
            title: "Tetr Maximized",
            titleI18N: "Tetr Maximized", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Buy max tetrs.",
            descriptionI18N: "Buy max tetrs.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("50000000")},
            unlocked(){return hasUpgrade(this.layer, 15)}
        },
        22: {
            title: "Tetr Automated",
            titleI18N: "Tetr Automated", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Automate tetrs.",
            descriptionI18N: "Automate tetrs.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("2.5e9")},
            unlocked(){return hasUpgrade(this.layer, 21)}
        },
        23: {
            title: "Reset Booster",
            titleI18N: "Reset Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply your points based on reset points.",
            descriptionI18N: "Multiply your points based on reset points.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
			effect() {
				let mult = new Decimal(2).pow(player.r.points.add(1).log10().add(1).log10().pow(1.5).div(25));
				return mult
			}, 
            effectDisplay() { return `x${format(upgradeEffect(this.layer, this.id))}` },
            cost:function(){return new Decimal("1.3e15")},
            unlocked(){return hasUpgrade(this.layer, 22)}
        },
        24: {
            title: "No Tetr Resets",
            titleI18N: "No Tetr Resets", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Tetrs do not reset anything.",
            descriptionI18N: "Tetrs do not reset anything.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("3.5e26")},
            unlocked(){return hasUpgrade(this.layer, 23)}
        },
        25: {
            title: "Passive Gain II",
            titleI18N: "Passive Gain II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Passively gain rebirth points.",
            descriptionI18N: "Passively gain rebirth points.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("7e45")},
            unlocked(){return hasUpgrade(this.layer, 24)}
        },
        31: {
            title: "Kept Rebirth Upgrades",
            titleI18N: "Kept Rebirth Upgrades", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Keep your rebirth upgrades on reset.",
            descriptionI18N: "Keep your rebirth upgrades on reset.", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("5.5e62")},
            unlocked(){return hasUpgrade(this.layer, 25)}
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
addLayer("asc", {
    name: "asc", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Ascension", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Ascension", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#77c1f8",
    requires: new Decimal(5e9), // Can be a function that takes requirement increases into account
    resource: "ascension points", // Name of prestige currency
    resourceI18N: "ascension points", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "super reset points", // Name of resource prestige is based on
    baseResourceI18N: "super reset points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.sr.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	doReset(resettingLayer) {
		let keep = [];
        if (resettingLayer == "tsc") layerDataReset("asc", keep)
    },
    upgrades: {
        11: {
            title: "Self-Synergy I-1",
            titleI18N: "Self-Synergy I-1", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply ranks based on itself",
            descriptionI18N: "Multiply ranks based on itself", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("1")},
            unlocked(){return true}
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
		let eff = new Decimal(1.25).pow(pts.pow(0.8))
		if (pts.gte(15)) eff = eff.root(new Decimal(1).add(pts.div(15).sqrt().div(10)))
		if (pts.gte(250)) eff = eff.root(new Decimal(1).add(pts.div(250).log10().div(2)))
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
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("tier",13)) mult = mult.mul(upgradeEffect("tier", 13))
		if (hasUpgrade("tier",21)) mult = mult.mul(upgradeEffect("tetr", 21))
		if (hasUpgrade("tetr",13)) mult = mult.mul(1.1)
		if (hasUpgrade("r",24)) mult = mult.mul(1.1)
		if (hasUpgrade("pres",15)) mult = mult.mul(upgradeEffect("pres", 15))
		mult = mult.mul(temp.pent.effect[2])
        return mult
    },
	canBuyMax() {return hasUpgrade("reb",12)},
	doReset(resettingLayer) {
		let keep = [];
		if (hasMilestone("pent",10)) keep.push("upgrades");
        if (resettingLayer == "tier"
		   || resettingLayer == "tetr"
		   || resettingLayer == "pent") layerDataReset("rank", keep)
    },
    resetsNothing() {
        return hasUpgrade("reb",14)
    },
    autoPrestige() {
        return hasUpgrade("reb",21)
    },
    upgrades: {
        11: {
            title: "Rank Booster",
            titleI18N: "Rank Booster", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Multiply points by 2",
            descriptionI18N: "Multiply points by 2", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("2")},
            unlocked(){return true}
        },
        12: {
            title: "Rank Booster II",
            titleI18N: "Rank Booster II", // Second name of title for internationalization (i18n) if internationalizationMod is enabled
            description: "Add +1 to base effect of Multiplier I",
            descriptionI18N: "Add +1 to base effect of Multiplier I", // Second name of description for internationalization (i18n) if internationalizationMod is enabled
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("3")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Self-Synergy",
            titleI18N: "Self-Synergy", 
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
	base: 1.5,
    exponent: 0.75, // Prestige currency exponent
	effect() {
		let pts = player[this.layer].points
		let pointMulti = new Decimal(1.3).pow(pts.pow(0.7))
		if (pts.gte(20)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(20).sqrt().div(20)))
		if (pts.gte(250)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(250).log10().pow(2).div(5)))
		let resetMulti = new Decimal(1.2).pow(pts.pow(0.4))
		if (pts.gte(20)) resetMulti = resetMulti.div(new Decimal(1).add(pts.div(20).sqrt().div(5)))
		if (pts.gte(250)) resetMulti = resetMulti.root(new Decimal(1).add(pts.div(250).log10().pow(2).div(5)))
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
		mult = new Decimal(1)
		mult = mult.mul(temp.pent.effect[3])
		if (hasUpgrade("sr",15)) mult = mult.mul(upgradeEffect("sr",15))
		return mult
    },
	doReset(resettingLayer) {
		let keep = [];
		if (hasMilestone("pent",10)) keep.push("upgrades");
        if (resettingLayer == "tetr"
		   || resettingLayer == "pent") layerDataReset("tier", keep)
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
            title: "Tier Booster",
            titleI18N: "Tier Booster", 
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
            title: "Tier Booster II",
            titleI18N: "Tier Booster II", 
            description: "Multiply points by 2.5.",
            descriptionI18N: "Multiply points by 2.5.",
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("3")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Rank Booster III",
            titleI18N: "Rank Booster III", 
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
            title: "Tier Booster III",
            titleI18N: "Tier Booster III", 
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
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
		if (pts.gte(30)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(30).log10().pow(2).div(20)))
		if (pts.gte(250)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(250).log10().pow(2).div(5)))
		let resetMulti = new Decimal(1.3).pow(pts.pow(0.4))
		if (pts.gte(30)) resetMulti = resetMulti.div(new Decimal(1).add(pts.div(30).log10().pow(2).div(5)))
		if (pts.gte(250)) resetMulti = resetMulti.root(new Decimal(1).add(pts.div(250).log10().pow(2).div(5)))
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
		let keep = [];
        if (resettingLayer == "pent") layerDataReset("tetr", keep)
    },
	canBuyMax() {return hasUpgrade("sr",21)},
    resetsNothing() {
        return hasUpgrade("sr",24)
    },
    autoPrestige() {
        return hasUpgrade("sr",22)
    },
    upgrades: {
        11: {
            title: "Tetr Booster",
            titleI18N: "Tetr Booster", 
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
            title: "Tetr Booster II",
            titleI18N: "Tetr Booster II", 
            description: "Multiply points by 1.5.",
            descriptionI18N: "Multiply points by 1.5.",
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("3")},
            unlocked(){return hasUpgrade(this.layer,11)}
        },
        13: {
            title: "Rank Multiplier",
            titleI18N: "Rank Multiplier", 
            description: "Multiply ranks by 1.1.",
            descriptionI18N: "Multiply ranks by 1.1.",
            style: {"border-radius": "0"},
            cost:function(){return new Decimal("4")},
            unlocked(){return hasUpgrade(this.layer,12)}
        },
        14: {
            title: "Tetr Booster III",
            titleI18N: "Tetr Booster III", 
            description: "Multiply points by 2.",
            descriptionI18N: "Multiply points by 2.",
            style: {"border-radius": "0 15px 15px 0"},
            cost:function(){return new Decimal("6")},
            unlocked(){return hasUpgrade(this.layer,13)}
        },
        21: {
            title: "Tetr Rank Multiplier",
            titleI18N: "Tetr Rank Multiplier", 
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
addLayer("pent", {
    name: "pent", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Pents (P)", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Pents (P)", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#63ee96",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "pents", // Name of prestige currency
    resourceI18N: "pents", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "tetrs", // Name of resource prestige is based on
    baseResourceI18N: "tetrs", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.tetr.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 1.2,
    exponent: 0.6, // Prestige currency exponent
	effect() {
		let pts = player[this.layer].points
		let pointMulti = new Decimal(4).pow(pts.pow(0.8))
		if (pts.gte(30)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(30).log10().pow(2).div(20)))
		if (pts.gte(100)) pointMulti = pointMulti.root(new Decimal(1).add(pts.div(100).log10().pow(2).div(5)))
		let resetMulti = new Decimal(1.5).pow(pts.pow(0.4))
		if (pts.gte(30)) resetMulti = resetMulti.root(new Decimal(1).add(pts.div(30).log10().pow(2).div(15)))
		if (pts.gte(100)) resetMulti = resetMulti.root(new Decimal(1).add(pts.div(100).log10().pow(2).div(5)))
		let rankMulti = new Decimal(1.25).pow(pts.pow(0.6))
		if (pts.gte(30)) rankMulti = rankMulti.div(new Decimal(1).add(pts.div(30).log10().pow(2).div(10)))
		if (pts.gte(100)) rankMulti = rankMulti.root(new Decimal(1).add(pts.div(100).log10().pow(2).div(5)))
		let tierMulti = new Decimal(1.1).pow(pts.pow(0.4))
		if (pts.gte(30)) tierMulti = tierMulti.div(new Decimal(1).add(pts.div(30).log10().pow(1.5).div(5)))
		if (pts.gte(100)) tierMulti = tierMulti.root(new Decimal(1).add(pts.div(100).log10().pow(1.5).div(5)))
		let eff = [pointMulti, resetMulti, rankMulti, tierMulti]
		return eff
	},
	effectDescription() {
		return `which are boosting points by x${format(temp[this.layer].effect[0])}, reset points by x${format(temp[this.layer].effect[1])}, ranks by x${format(temp[this.layer].effect[2])}, and tiers by x${format(temp[this.layer].effect[3])}${player[this.layer].points.gte(30)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(50)?"<sup>2</sup>":""})</span>`:""}`
	},
	effectDescriptionI18N() {
		return `which are boosting points by x${format(temp[this.layer].effect[0])}, reset points by x${format(temp[this.layer].effect[1])}, ranks by x${format(temp[this.layer].effect[2])}, and tiers by x${format(temp[this.layer].effect[3])}${player[this.layer].points.gte(30)?` <span style="font-size: 12px">(softcapped${player[this.layer].points.gte(50)?"<sup>2</sup>":""})</span>`:""}`
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    milestones: {
        10: {
            requirementDescription() { return `Pent ${formatWhole(3)}` },
            requirementDescriptionI18N() { return `Pent ${formatWhole(3)}` },
            effectDescription: "Keep your Rank and Tier upgrades on reset.",
            effectDescriptionI18N: "Keep your Rank and Tier upgrades on reset.",
            done() { return player[this.layer].points.gte(3)}
        }
    },
    hotkeys: [],
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "upgrades"
    ],
    layerShown(){return true},
})
// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed
