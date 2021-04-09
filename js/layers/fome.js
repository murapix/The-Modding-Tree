addLayer("fome", {
    name: "Quantum Fome",
    symbol: "F",
    row: 1,
    position: 0,
    branches: ['skyrmion'],

    layerShown() { return hasMilestone("skyrmion", 0) },
    resource() {
        if (player[this.layer].fome.quantum.expansion.gte(1)) return "Quantum Foam"
        if (player[this.layer].fome.subplanck.expansion.gte(1)) return "Subplanck Foam"
        if (player[this.layer].fome.subspatial.expansion.gte(1)) return "Subspatial Foam"
        if (player[this.layer].fome.infitesimal.expansion.gte(1)) return "Infitesimal Foam"
        return "Protoversal Foam"
    },
    effectDescription() {
        if (player[this.layer].fome.quantum.expansion.gte(1)) return (player[this.layer].fome.quantum.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.quantum.expansion) + "</sup>" : "")
        if (player[this.layer].fome.subplanck.expansion.gte(1)) return (player[this.layer].fome.subplanck.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.subplanck.expansion) + "</sup>" : "")
        if (player[this.layer].fome.subspatial.expansion.gte(1)) return (player[this.layer].fome.subspatial.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.subspatial.expansion) + "</sup>" : "")
        if (player[this.layer].fome.infitesimal.expansion.gte(1)) return (player[this.layer].fome.infitesimal.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.infitesimal.expansion) + "</sup>" : "")
        return (player[this.layer].fome.protoversal.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.protoversal.expansion) + "</sup>" : "")
    },
    color: "#ffffff",
    doReset(layer) {
        if (layer != this.layer) {
            let keep = []
            layerDataReset(this.layer, keep)
        }
        else {
        }
    },

    effect() {
        getTotalBoost = layers[this.layer].utils.getTotalBoost

        totalBoosts = {}
        bonusBoosts = {}

        baseGain = {}
        boostGain = {}
        enlargeGain = {}
        totalGain = {}

        for (let fome of ['protoversal', 'infitesimal', 'subspatial', 'subplanck', 'quantum']) {
            totalBoosts[fome] = {}
            bonusBoosts[fome] = {}
            for(let index = 0; index < 5; index++) {
                totalBoosts[fome][index] = getTotalBoost(fome, index)
                bonusBoosts[fome][index] = layers[this.layer].bonusBoosts[fome][index]()
            }
        }

        baseGain.protoversal = player[this.layer].fome.protoversal.expansion.gte(1) ? player.skyrmion.points.dividedBy(1e2).times(buyableEffect('skyrmion', 14)) : new Decimal(0)
        baseGain.infitesimal = player[this.layer].fome.infitesimal.expansion.gte(1) ? player.skyrmion.points.dividedBy(1e2) : new Decimal(0),
        baseGain.subspatial = player[this.layer].fome.subspatial.expansion.gte(1) ? player.skyrmion.points.dividedBy(1e2) : new Decimal(0),
        baseGain.subplanck = player[this.layer].fome.subplanck.expansion.gte(1) ? player.skyrmion.points.dividedBy(1e2) : new Decimal(0),
        baseGain.quantum = player[this.layer].fome.quantum.expansion.gte(1) ? player.skyrmion.points.dividedBy(1e2) : new Decimal(0)

        boostGain.protoversal = totalBoosts.protoversal[0].times(buyableEffect('skyrmion', 24)).plus(1)
        boostGain.infitesimal = totalBoosts.infitesimal[0].plus(1)
        boostGain.subspatial = totalBoosts.subspatial[0].plus(1)
        boostGain.subplanck = totalBoosts.subplanck[0].plus(1)
        boostGain.quantum = totalBoosts.quantum[0].plus(1)

        enlargeGain.protoversal = buyableEffect(this.layer, 11).times(buyableEffect(this.layer, 12)).times(buyableEffect(this.layer, 13))
        enlargeGain.infitesimal = buyableEffect(this.layer, 21).times(buyableEffect(this.layer, 22)).times(buyableEffect(this.layer, 23))
        enlargeGain.subspatial = buyableEffect(this.layer, 31).times(buyableEffect(this.layer, 32)).times(buyableEffect(this.layer, 33))
        enlargeGain.subplanck = buyableEffect(this.layer, 41).times(buyableEffect(this.layer, 42)).times(buyableEffect(this.layer, 43))
        enlargeGain.quantum = buyableEffect(this.layer, 51).times(buyableEffect(this.layer, 52)).times(buyableEffect(this.layer, 53))

        totalGain.protoversal = baseGain.protoversal.times(boostGain.protoversal).times(boostGain.quantum).times(enlargeGain.protoversal),
        totalGain.infitesimal = baseGain.infitesimal.times(boostGain.infitesimal).times(boostGain.quantum).times(enlargeGain.infitesimal),
        totalGain.subspatial = baseGain.subspatial.times(boostGain.subspatial).times(boostGain.quantum).times(enlargeGain.subspatial),
        totalGain.subplanck = baseGain.subplanck.times(boostGain.subplanck).times(boostGain.quantum).times(enlargeGain.subplanck),
        totalGain.quantum = baseGain.quantum.times(boostGain.quantum).times(enlargeGain.quantum)

        return {
            boosts: {
                bonus: bonusBoosts,
                total: totalBoosts
            },
            gain: {
                base: baseGain,
                boost: boostGain,
                total: totalGain
            }
        }
    },
    
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        fome: {
            protoversal: {
                points: new Decimal(0),
                expansion: new Decimal(1)
            },
            infitesimal: {
                points: new Decimal(0),
                expansion: new Decimal(0)
            },
            subspatial: {
                points: new Decimal(0),
                expansion: new Decimal(0)
            },
            subplanck: {
                points: new Decimal(0),
                expansion: new Decimal(0)
            },
            quantum: {
                points: new Decimal(0),
                expansion: new Decimal(0)
            }
        },
        boosts: {
            protoversal: {
                index: 0,
                boosts: [
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0)
                ]
            },
            infitesimal: {
                index: 0,
                boosts: [
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0)
                ]
            },
            subspatial: {
                index: 0,
                boosts: [
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0)
                ]
            },
            subplanck: {
                index: 0,
                boosts: [
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0)
                ]
            },
            quantum: {
                index: 0,
                boosts: [
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0),
                    new Decimal(0)
                ]
            }
        }
    }},

    update(delta) {
        if (!temp[this.layer].layerShown) return
        
        let gain = temp[this.layer].effect.gain.total

        for (let fome of ['protoversal', 'infitesimal', 'subspatial', 'subplanck', 'quantum'])
            player[this.layer].fome[fome].points = player[this.layer].fome[fome].points.plus(gain[fome].times(delta))

        if (player[this.layer].fome.quantum.expansion.gte(1)) player[this.layer].points = player[this.layer].fome.quantum.points
        else if (player[this.layer].fome.subplanck.expansion.gte(1)) player[this.layer].points = player[this.layer].fome.subplanck.points
        else if (player[this.layer].fome.subspatial.expansion.gte(1)) player[this.layer].points = player[this.layer].fome.subspatial.points
        else if (player[this.layer].fome.infitesimal.expansion.gte(1)) player[this.layer].points = player[this.layer].fome.infitesimal.points
        else player[this.layer].points = player[this.layer].fome.protoversal.points
    },

    utils: {
        displayBuyable(id, cost) {
            let fome, Dim, dim
            switch (~~(id/10)) {
                case 1: fome = 'Protoversal'; break
                case 2: fome = 'Infitesimal'; break
                case 3: fome = 'Subspatial'; break
                case 4: fome = 'Subplanck'; break
                case 5: fome = 'Quantum'; break
            }
            switch (~~(id%10)) {
                case 1: Dim = "Height"; dim = "height"; break
                case 2: Dim = "Width"; dim = "width"; break
                case 3: Dim = "Depth"; dim = "depth"; break
            }
            return "<h2>Enlarge " + fome + " Foam " + dim + " by 1m</h2><br/><br/><b>Current " + Dim + ":</b> " + formatWhole(getBuyableAmount('fome', id)) + "m<br/><br/><b>Cost:</b> " + format(cost)
        },
        displayBoost(fome, name, index, effect) {
            let boost = player.fome.boosts[fome].boosts[index]
            let bonus = temp.fome.effect.boosts.bonus[fome][index]
            return (boost > 0 || bonus > 0) ? `${name} Boost ${index+1} [${(boost > 0 ? formatWhole(boost) : '0') + (bonus > 0 ? ` + ${formatWhole(bonus)}` : ``)}]: ${effect}` : ``
        },
        buyBuyable(id, cost) {
            let fome
            switch (~~(id/10)) {
                case 1: fome = 'protoversal'; break
                case 2: fome = 'infitesimal'; break
                case 3: fome = 'subspatial'; break
                case 4: fome = 'subplanck'; break
                case 5: fome = 'quantum'; break
            }
            player.fome.fome[fome].points = player.fome.fome[fome].points.minus(cost)
            setBuyableAmount(layer, id, getBuyableAmount(layer, id).plus(1))
            player.fome.boosts[fome].boosts[player.fome.boosts[fome].index] = player.fome.boosts[fome].boosts[player.fome.boosts[fome].index++].plus(1)
            if (player.fome.boosts[fome].index >= 5)
                player.fome.boosts[fome].index %= 5
        },
        getTotalBoost(fome, index) {
            return player.fome.boosts[fome].boosts[index].plus(layers.fome.bonusBoosts[fome][index]())
        }
    },

    bonusBoosts: {
        protoversal: [
            () => { return layers.fome.utils.getTotalBoost('protoversal', 4).times(0.1) },
            () => { return layers.fome.utils.getTotalBoost('protoversal', 4).times(0.1) },
            () => { return layers.fome.utils.getTotalBoost('protoversal', 4).times(0.1) },
            () => { return layers.fome.utils.getTotalBoost('protoversal', 4).times(0.1) },
            () => { return new Decimal(0) }
        ],
        infitesimal: [
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) }
        ],
        subspatial: [
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) }
        ],
        subplanck: [
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) }
        ],
        quantum: [
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) },
            () => { return new Decimal(0) }
        ]
    },

    buyables: {
        rows: 4,
        cols: 5,
        11: {
            cost() { return new Decimal(2).times(Decimal.pow(4, getBuyableAmount(this.layer, this.id))) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            canAfford() { return player[this.layer].fome.protoversal.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        12: {
            cost() { return new Decimal(5).times(Decimal.pow(6, getBuyableAmount(this.layer, this.id))) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            canAfford() { return player[this.layer].fome.protoversal.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        13: {
            cost() { return new Decimal(20).times(Decimal.pow(8, getBuyableAmount(this.layer, this.id))) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            canAfford() { return player[this.layer].fome.protoversal.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        14: {
            cost() { return new Decimal(1e4).times(Decimal.pow(1e4, getBuyableAmount(this.layer, this.id))) },
            display() { return "<h2>" + (player[this.layer].fome.infitesimal.expansion.eq(0) ? "Condense" : "Re-form") + " your Protoversal Foam</h2><br/><br/><b>Cost:</b> " + format(this.cost()) + " Protoversal Foam" },
            canAfford() { return player[this.layer].fome.protoversal.points.gte(this.cost()) },
            buy() {
                player[this.layer].fome.protoversal.points = player[this.layer].fome.protoversal.points.minus(this.cost())
                if (player[this.layer].fome.infitesimal.expansion.eq(0)) player[this.layer].fome.infitesimal.expansion = player[this.layer].fome.infitesimal.expansion.plus(1)
                else player[this.layer].fome.protoversal.expansion = player[this.layer].fome.protoversal.expansion.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        21: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.infitesimal.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.infitesimal.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        22: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.infitesimal.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.infitesimal.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        23: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.infitesimal.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.infitesimal.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        24: {
            cost() { return Decimal.pow(1e6, getBuyableAmount(this.layer, this.id).plus(1)) },
            display() { return "<h2>" + (player[this.layer].fome.subspatial.expansion.eq(0) ? "Condense" : "Re-form") + " your Infitesimal Foam</h2><br/><br/><b>Cost:</b> " + format(this.cost()) + " Infitesimal Foam" },
            unlocked() { return player[this.layer].fome.infitesimal.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.infitesimal.points.gte(this.cost()) },
            buy() {
                player[this.layer].fome.infitesimal.points = player[this.layer].fome.infitesimal.points.minus(this.cost())
                if (player[this.layer].fome.subspatial.expansion.eq(0))
                    player[this.layer].fome.subspatial.expansion = player[this.layer].fome.subspatial.expansion.plus(1)
                player[this.layer].fome.infitesimal.expansion = player[this.layer].fome.infitesimal.expansion.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        31: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.subspatial.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subspatial.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        32: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.subspatial.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subspatial.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        33: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.subspatial.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subspatial.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        34: {
            cost() { return Decimal.pow(1e6, getBuyableAmount(this.layer, this.id).plus(1)) },
            display() { return "<h2>" + (player[this.layer].fome.subplanck.expansion.eq(0) ? "Condense" : "Re-form") + " your Subspatial Foam</h2><br/><br/><b>Cost:</b> " + format(this.cost()) + " Subspatial Foam" },
            unlocked() { return player[this.layer].fome.subspatial.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subspatial.points.gte(this.cost()) },
            buy() {
                player[this.layer].fome.subspatial.points = player[this.layer].fome.subspatial.points.minus(this.cost())
                if (player[this.layer].fome.subplanck.expansion.eq(0))
                    player[this.layer].fome.subplanck.expansion = player[this.layer].fome.subplanck.expansion.plus(1)
                player[this.layer].fome.subspatial.expansion = player[this.layer].fome.subspatial.expansion.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        41: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.subplanck.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subplanck.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        42: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.subplanck.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subplanck.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        43: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.subplanck.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subplanck.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        44: {
            cost() { return Decimal.pow(1e6, getBuyableAmount(this.layer, this.id).plus(1)) },
            display() { return "<h2>" + (player[this.layer].fome.quantum.expansion.eq(0) ? "Condense" : "Re-form") + " your Subplanck Foam</h2><br/><br/><b>Cost:</b> " + format(this.cost()) + " Subplanck Foam" },
            unlocked() { return player[this.layer].fome.subplanck.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.subplanck.points.gte(this.cost()) },
            buy() {
                player[this.layer].fome.subplanck.points = player[this.layer].fome.subplanck.points.minus(this.cost())
                if (player[this.layer].fome.quantum.expansion.eq(0))
                    player[this.layer].fome.quantum.expansion = player[this.layer].fome.quantum.expansion.plus(1)
                player[this.layer].fome.subplanck.expansion = player[this.layer].fome.subplanck.expansion.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        51: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.quantum.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.quantum.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        52: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.quantum.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.quantum.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        53: {
            cost() { return new Decimal(1) },
            display() { return layers[this.layer].utils.displayBuyable(this.id, this.cost()) },
            unlocked() { return player[this.layer].fome.quantum.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.quantum.points.gte(this.cost()) },
            effect() { return getBuyableAmount(this.layer, this.id).plus(1) },
            buy() { layers[this.layer].utils.buyBuyable(this.id, this.cost()) }
        },
        54: {
            cost() { return Decimal.pow(1e6, getBuyableAmount(this.layer, this.id).plus(1)) },
            display() { return "<h2>" + (player[this.layer].fome.quantum.expansion.eq(1) ? "Condense" : "Re-form") + " your Quantum Foam</h2><br/><br/><b>Cost:</b> " + format(this.cost()) + " Quantum Foam" },
            unlocked() { return player[this.layer].fome.quantum.expansion.gte(1) },
            canAfford() { return player[this.layer].fome.quantum.points.gte(this.cost()) },
            buy() {
                player[this.layer].fome.quantum.points = player[this.layer].fome.quantum.points.minus(this.cost())
                player[this.layer].fome.quantum.expansion = player[this.layer].fome.quantum.expansion.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        }
    },

    microtabs: {
        stuff: {
            "Foam": {
                content: [
                    "blank",
                    ["row", [
                        ["display-text", () => player[this.layer].fome.quantum.expansion.gte(1) ? "Quantum Fome" + (player[this.layer].fome.quantum.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.quantum.expansion) + "</sup>" : "") + ": " + format(player[this.layer].fome.quantum.points) : ""],
                        ["display-text", () => player[this.layer].fome.quantum.expansion.gte(1) ? "&nbsp;&nbsp;&nbsp;&nbsp;You are gaining " + format(temp[this.layer].effect.gain.total.quantum) + " Quantum Foam/s" : ""]
                    ]],
                    ["row", [
                        ["display-text", () => player[this.layer].fome.subplanck.expansion.gte(1) ? "Subplanck Fome" + (player[this.layer].fome.subplanck.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.subplanck.expansion) + "</sup>" : "") + ": " + format(player[this.layer].fome.subplanck.points) : ""],
                        ["display-text", () => player[this.layer].fome.subplanck.expansion.gte(1) ? "&nbsp;&nbsp;&nbsp;&nbsp;You are gaining " + format(temp[this.layer].effect.gain.total.subplanck) + " Subplanck Foam/s" : ""]
                    ]],
                    ["row", [
                        ["display-text", () => player[this.layer].fome.subspatial.expansion.gte(1) ? "Subspatial Fome" + (player[this.layer].fome.subspatial.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.subspatial.expansion) + "</sup>" : "") + ": " + format(player[this.layer].fome.subspatial.points) : ""],
                        ["display-text", () => player[this.layer].fome.subspatial.expansion.gte(1) ? "&nbsp;&nbsp;&nbsp;&nbsp;You are gaining " + format(temp[this.layer].effect.gain.total.subspatial) + " Subspatial Foam/s" : ""]
                    ]],
                    ["row", [
                        ["display-text", () => player[this.layer].fome.infitesimal.expansion.gte(1) ? "Infitesimal Fome" + (player[this.layer].fome.infitesimal.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.infitesimal.expansion) + "</sup>" : "") + ": " + format(player[this.layer].fome.infitesimal.points) : ""],
                        ["display-text", () => player[this.layer].fome.infitesimal.expansion.gte(1) ? "&nbsp;&nbsp;&nbsp;&nbsp;You are gaining " + format(temp[this.layer].effect.gain.total.infitesimal) + " Infitesimal Foam/s" : ""]
                    ]],
                    ["row", [
                        ["display-text", () => player[this.layer].fome.protoversal.expansion.gte(1) ? "Protoversal Fome" + (player[this.layer].fome.protoversal.expansion.gt(1) ? "<sup>" + formatWhole(player[this.layer].fome.protoversal.expansion) + "</sup>" : "") + ": " + format(player[this.layer].fome.protoversal.points) : ""],
                        ["display-text", () => player[this.layer].fome.protoversal.expansion.gte(1) ? "&nbsp;&nbsp;&nbsp;&nbsp;You are gaining " + format(temp[this.layer].effect.gain.total.protoversal) + " Protoversal Foam/s" : ""]
                    ]],
                    "blank",
                    "buyables",
                ]
            },
            "Boosts": {
                unlocked() { return player.fome.boosts.protoversal.boosts[0].gte(1) },
                content: [
                    "blank",
                    ["display-text", () => layers[this.layer].utils.displayBoost('protoversal', 'Protoversal', 0, `Multiply the generation of Protoversal Foam by ${format(temp[this.layer].effect.gain.boost.protoversal)}x`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('protoversal', 'Protoversal', 1, `Gain ${format(layers[this.layer].utils.getTotalBoost('protoversal', 1))} bonus Pion and Spinor Upgrade α levels`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('protoversal', 'Protoversal', 2, `Gain ${format(layers[this.layer].utils.getTotalBoost('protoversal', 2))} bonus Pion and Spinor Upgrade β levels`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('protoversal', 'Protoversal', 3, `Gain ${format(layers[this.layer].utils.getTotalBoost('protoversal', 3))} bonus Pion and Spinor Upgrade γ levels`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('protoversal', 'Protoversal', 4, `Add ${format(layers[this.layer].utils.getTotalBoost('protoversal', 4).times(0.1))} levels to all above boosts`)],
                    "blank",
                    ["display-text", () => layers[this.layer].utils.displayBoost('infitesimal', 'Infitesimal', 0, `Multiply the generation of Infitesimal Foam by ${format(layers[this.layer].utils.getTotalBoost('infitesimal', 0).plus(1))}x`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('infitesimal', 'Infitesimal', 1, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('infitesimal', 'Infitesimal', 2, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('infitesimal', 'Infitesimal', 3, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('infitesimal', 'Infitesimal', 4, ``)],
                    "blank",
                    ["display-text", () => layers[this.layer].utils.displayBoost('subspatial', 'Subspatial', 0, `Multiply the generation of Subspatial Foam by ${format(layers[this.layer].utils.getTotalBoost('subspatial', 0).plus(1))}x`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subspatial', 'Subspatial', 1, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subspatial', 'Subspatial', 2, `Add ${format(layers[this.layer].utils.getTotalBoost('subspatial', 3).times(0.1))} levels to all above boosts`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subspatial', 'Subspatial', 3, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subspatial', 'Subspatial', 4, ``)],
                    "blank",
                    ["display-text", () => layers[this.layer].utils.displayBoost('subplanck', 'Subplanck', 0, `Multiply the generation of Subplanck Foam by ${format(layers[this.layer].utils.getTotalBoost('subplanck', 0).plus(1))}x`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subplanck', 'Subplanck', 1, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subplanck', 'Subplanck', 2, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subplanck', 'Subplanck', 3, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('subplanck', 'Subplanck', 4, ``)],
                    "blank",
                    ["display-text", () => layers[this.layer].utils.displayBoost('quantum', 'Quantum', 0, `Multiply the generation of all Foam types by ${format(layers[this.layer].utils.getTotalBoost('quantum', 0).plus(1))}x`)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('quantum', 'Quantum', 1, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('quantum', 'Quantum', 2, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('quantum', 'Quantum', 3, ``)],
                    ["display-text", () => layers[this.layer].utils.displayBoost('quantum', 'Quantum', 4, `Add ${format(layers[this.layer].utils.getTotalBoost('quantum', 4).times(0.1))} levels to all above boosts`)]
                ]
            }
        }
    },

    tabFormat: [
        ["display-text", () => {
            let points
            if (player.fome.fome.quantum.expansion.gte(1)) points = player.fome.fome.quantum.points
            else if (player.fome.fome.subplanck.expansion.gte(1)) points = player.fome.fome.subplanck.points
            else if (player.fome.fome.subspatial.expansion.gte(1)) points = player.fome.fome.subspatial.points
            else if (player.fome.fome.infitesimal.expansion.gte(1)) points = player.fome.fome.infitesimal.points
            else points = player.fome.fome.protoversal.points
            return "You have <h2 style='color:#ffffff;text-shadow:#ffffff 0px 0px 10px;'>" + formatWhole(points) + "</h2> " + temp.fome.resource + temp.fome.effectDescription
        }],
        "blank",
        ["microtabs", "stuff"]
    ],

    componentStyles: {
        "buyable"() { return { "height": "100px" } },
        "microtabs"() { return { "border-style": "none" } }
    }
})
