addLayer("fome", {
    name: "Quantum Fome",
    symbol: "F",
    row: 1,
    position: 0,
    branches: ['skyrmion'],

    layerShown() { return player.fome.unlocked },
    resource() {
        if (player.fome.fome.quantum.expansion.gte(1)) return "Quantum Foam"
        if (player.fome.fome.subplanck.expansion.gte(1)) return "Subplanck Foam"
        if (player.fome.fome.subspatial.expansion.gte(1)) return "Subspatial Foam"
        if (player.fome.fome.infitesimal.expansion.gte(1)) return "Infitesimal Foam"
        return "Protoversal Foam"
    },
    effectDescription() {
        if (player.fome.fome.quantum.expansion.gte(1)) return (player.fome.fome.quantum.expansion.gt(1) ? "<sup>" + formatWhole(player.fome.fome.quantum.expansion) + "</sup>" : "")
        if (player.fome.fome.subplanck.expansion.gte(1)) return (player.fome.fome.subplanck.expansion.gt(1) ? "<sup>" + formatWhole(player.fome.fome.subplanck.expansion) + "</sup>" : "")
        if (player.fome.fome.subspatial.expansion.gte(1)) return (player.fome.fome.subspatial.expansion.gt(1) ? "<sup>" + formatWhole(player.fome.fome.subspatial.expansion) + "</sup>" : "")
        if (player.fome.fome.infitesimal.expansion.gte(1)) return (player.fome.fome.infitesimal.expansion.gt(1) ? "<sup>" + formatWhole(player.fome.fome.infitesimal.expansion) + "</sup>" : "")
        return (player.fome.fome.protoversal.expansion.gt(1) ? "<sup>" + formatWhole(player.fome.fome.protoversal.expansion) + "</sup>" : "")
    },
    color: "#ffffff",
    doReset(layer) {
        if (layer != 'fome') {
            let keep = []
            layerDataReset('fome', keep)
            player.fome = startData()
        }
        else {
        }
    },

    effect() {
        totalBoosts = {}
        bonusBoosts = {}

        baseGain = {}
        boostGain = {}
        enlargeGain = {}
        expansionGain = {}
        totalGain = {}

        for (let fome of fomeTypes) {
            totalBoosts[fome] = {}
            bonusBoosts[fome] = {}
            for(let index = 0; index < 5; index++) {
                totalBoosts[fome][index] = getCurrentFomeBoost(fome, index)
                bonusBoosts[fome][index] = layers.fome.bonusBoosts[fome][index]()
            }
        }

        let skyrmions = Decimal.plus(player.skyrmion.points, totalBoosts.subspatial[3])

        baseGain.protoversal = player.fome.fome.protoversal.expansion.gte(1) ? skyrmions.dividedBy(1e2).times(buyableEffect('skyrmion', 121)).times(buyableEffect('skyrmion', 122)).times(buyableEffect('skyrmion', 224)).times(buyableEffect('skyrmion', 131)) : new Decimal(0)
        baseGain.infitesimal = player.fome.fome.infitesimal.expansion.gte(1) ? skyrmions.dividedBy(1e2).times(buyableEffect('skyrmion', 222)).times(buyableEffect('skyrmion', 224)).times(buyableEffect('skyrmion', 132)).times(buyableEffect('skyrmion', 232)) : new Decimal(0),
        baseGain.subspatial = player.fome.fome.subspatial.expansion.gte(1) ? skyrmions.dividedBy(1e2).times(buyableEffect('skyrmion', 123)).times(buyableEffect('skyrmion', 224)).times(buyableEffect('skyrmion', 231)) : new Decimal(0),
        baseGain.subplanck = player.fome.fome.subplanck.expansion.gte(1) ? skyrmions.dividedBy(1e2).times(buyableEffect('skyrmion', 224)) : new Decimal(0),
        baseGain.quantum = player.fome.fome.quantum.expansion.gte(1) ? skyrmions.dividedBy(1e2).times(buyableEffect('skyrmion', 224)) : new Decimal(0)

        boostGain.protoversal = totalBoosts.protoversal[0].times(buyableEffect('skyrmion', 221)).plus(1)
        boostGain.infitesimal = totalBoosts.infitesimal[0].times(buyableEffect('skyrmion', 133)).plus(1)
        boostGain.subspatial = totalBoosts.subspatial[0].times(buyableEffect('skyrmion', 133)).plus(1)
        boostGain.subplanck = totalBoosts.subplanck[0].times(buyableEffect('skyrmion', 233)).times(buyableEffect('skyrmion', 133)).plus(1)
        boostGain.quantum = totalBoosts.quantum[0].times(buyableEffect('skyrmion', 133)).plus(1)

        enlargeGain.protoversal = buyableEffect('fome', 11).times(buyableEffect('fome', 12)).times(buyableEffect('fome', 13))
        enlargeGain.infitesimal = buyableEffect('fome', 21).times(buyableEffect('fome', 22)).times(buyableEffect('fome', 23))
        enlargeGain.subspatial = buyableEffect('fome', 31).times(buyableEffect('fome', 32)).times(buyableEffect('fome', 33))
        enlargeGain.subplanck = buyableEffect('fome', 41).times(buyableEffect('fome', 42)).times(buyableEffect('fome', 43))
        enlargeGain.quantum = buyableEffect('fome', 51).times(buyableEffect('fome', 52)).times(buyableEffect('fome', 53))
        
        for (let fome of ['protoversal', 'infitesimal', 'subspatial', 'subplanck', 'quantum'])
            expansionGain[fome] = player.fome.fome[fome].expansion.cbrt()

        totalGain.protoversal = baseGain.protoversal.times(boostGain.protoversal).times(boostGain.quantum).times(enlargeGain.protoversal).pow(expansionGain.protoversal),
        totalGain.infitesimal = baseGain.infitesimal.times(boostGain.infitesimal).times(boostGain.quantum).times(enlargeGain.infitesimal).pow(expansionGain.infitesimal),
        totalGain.subspatial = baseGain.subspatial.times(boostGain.subspatial).times(boostGain.quantum).times(enlargeGain.subspatial).pow(expansionGain.subspatial),
        totalGain.subplanck = baseGain.subplanck.times(boostGain.subplanck).times(boostGain.quantum).times(enlargeGain.subplanck).pow(expansionGain.subplanck),
        totalGain.quantum = baseGain.quantum.times(boostGain.quantum).times(enlargeGain.quantum).pow(expansionGain.quantum)

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
        unlocked: false,
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
        if (!temp.fome.layerShown) return
        
        let gain = temp.fome.effect.gain.total

        for (let fome of ['protoversal', 'infitesimal', 'subspatial', 'subplanck', 'quantum'])
            player.fome.fome[fome].points = player.fome.fome[fome].points.plus(gain[fome].times(delta))

        if (player.fome.fome.quantum.expansion.gte(1)) player.fome.points = player.fome.fome.quantum.points
        else if (player.fome.fome.subplanck.expansion.gte(1)) player.fome.points = player.fome.fome.subplanck.points
        else if (player.fome.fome.subspatial.expansion.gte(1)) player.fome.points = player.fome.fome.subspatial.points
        else if (player.fome.fome.infitesimal.expansion.gte(1)) player.fome.points = player.fome.fome.infitesimal.points
        else player.fome.points = player.fome.fome.protoversal.points

        if (player.fome.autoProtoversal) {
            buyBuyable('fome', 11)
            buyBuyable('fome', 12)
            buyBuyable('fome', 13)
        }
        if (player.fome.autoInfitesimal) {
            buyBuyable('fome', 21)
            buyBuyable('fome', 22)
            buyBuyable('fome', 23)
        }
        if (player.fome.autoSubspatial) {
            buyBuyable('fome', 31)
            buyBuyable('fome', 32)
            buyBuyable('fome', 33)
        }
        if (player.fome.autoSubplanck) {
            buyBuyable('fome', 41)
            buyBuyable('fome', 42)
            buyBuyable('fome', 43)
        }
        if (player.fome.autoQuantum) {
            buyBuyable('fome', 51)
            buyBuyable('fome', 52)
            buyBuyable('fome', 53)
        }
        if (player.fome.autoReform) {
            buyBuyable('fome', 14)
            buyBuyable('fome', 24)
            buyBuyable('fome', 34)
            buyBuyable('fome', 44)
            buyBuyable('fome', 54)
        }
    },

    bonusBoosts: {
        protoversal: [
            () => getTotalFomeBoost('protoversal', 4).times(0.1).plus(getTotalFomeBoost('subspatial', 2).times(0.1)).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('protoversal', 4).times(0.1).plus(getTotalFomeBoost('subspatial', 2).times(0.1)).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('protoversal', 4).times(0.1).plus(getTotalFomeBoost('subspatial', 2).times(0.1)).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('protoversal', 4).times(0.1).plus(getTotalFomeBoost('subspatial', 2).times(0.1)).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1))
        ],
        infitesimal: [
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1))
        ],
        subspatial: [
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('subspatial', 2).times(0.1).plus(getTotalFomeBoost('quantum', 4).times(0.1)),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1)
        ],
        subplanck: [
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1)
        ],
        quantum: [
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => getTotalFomeBoost('quantum', 4).times(0.1),
            () => new Decimal(0)
        ]
    },

    buyables: {
        rows: 4,
        cols: 5,
        11: {
            cost() { return new Decimal(2).times(Decimal.pow(4, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            canAfford() { return player.fome.fome.protoversal.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        12: {
            cost() { return new Decimal(5).times(Decimal.pow(6, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            canAfford() { return player.fome.fome.protoversal.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        13: {
            cost() { return new Decimal(20).times(Decimal.pow(8, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            canAfford() { return player.fome.fome.protoversal.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        14: {
            cost() { return Decimal.pow(10, getBuyableAmount('fome', this.id).sqr().plus(1).times(4)) },
            display() { return `<h3>${player.fome.fome.infitesimal.points.eq(0) ? `Condense` : `Re-form`} your Protoversal Foam</h3><br/><br/><b>Cost:</b> ${format(temp.fome.buyables[this.id].cost)} Protoversal Foam` },
            canAfford() { return player.fome.fome.protoversal.points.gte(temp.fome.buyables[this.id].cost) },
            buy() {
                player.fome.fome.protoversal.points = player.fome.fome.protoversal.points.minus(temp.fome.buyables[this.id].cost)
                if (player.fome.fome.infitesimal.expansion.eq(0)) player.fome.fome.infitesimal.expansion = player.fome.fome.infitesimal.expansion.plus(1)
                else player.fome.fome.protoversal.expansion = player.fome.fome.protoversal.expansion.plus(1)
                setBuyableAmount('fome', this.id, getBuyableAmount('fome', this.id).plus(1))
            }
        },
        21: {
            cost() { return new Decimal(6).times(Decimal.pow(5, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.infitesimal.expansion.gte(1) },
            canAfford() { return player.fome.fome.infitesimal.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        22: {
            cost() { return new Decimal(10).times(Decimal.pow(7, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.infitesimal.expansion.gte(1) },
            canAfford() { return player.fome.fome.infitesimal.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        23: {
            cost() { return new Decimal(25).times(Decimal.pow(9, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.infitesimal.expansion.gte(1) },
            canAfford() { return player.fome.fome.infitesimal.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        24: {
            cost() { return Decimal.pow(10, getBuyableAmount('fome', this.id).sqr().plus(1).times(5)).dividedBy(5) },
            display() {
                let type = player.fome.fome.subspatial.expansion.eq(0)
                return `<h3>${type ? `Condense` : `Re-form`} your Infitesimal Foam</h3><br/><br/><b>Cost:</b> ${format(temp.fome.buyables[this.id].cost)} Infitesimal Foam${type ? ``: `<br/><br/><b>Requires:</b> Protoversal Foam<sup>${getBuyableAmount('fome', this.id).plus(2)}</sup>`}`
            },
            unlocked() { return player.fome.fome.infitesimal.expansion.gte(1) },
            canAfford() { return (player.fome.fome.subspatial.expansion.eq(0) || player.fome.fome.protoversal.expansion.gt(getBuyableAmount('fome', this.id).plus(1))) && player.fome.fome.infitesimal.points.gte(temp.fome.buyables[this.id].cost) },
            buy() {
                player.fome.fome.infitesimal.points = player.fome.fome.infitesimal.points.minus(temp.fome.buyables[this.id].cost)
                if (player.fome.fome.subspatial.expansion.eq(0)) player.fome.fome.subspatial.expansion = player.fome.fome.subspatial.expansion.plus(1)
                else player.fome.fome.infitesimal.expansion = player.fome.fome.infitesimal.expansion.plus(1)
                setBuyableAmount('fome', this.id, getBuyableAmount('fome', this.id).plus(1))
            }
        },
        31: {
            cost() { return new Decimal(10).times(Decimal.pow(6, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.subspatial.expansion.gte(1) },
            canAfford() { return player.fome.fome.subspatial.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        32: {
            cost() { return new Decimal(18).times(Decimal.pow(8, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.subspatial.expansion.gte(1) },
            canAfford() { return player.fome.fome.subspatial.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        33: {
            cost() { return new Decimal(60).times(Decimal.pow(10, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.subspatial.expansion.gte(1) },
            canAfford() { return player.fome.fome.subspatial.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        34: {
            cost() { return Decimal.pow(10, getBuyableAmount('fome', this.id).sqr().plus(1).times(6)).dividedBy(2.5) },
            display() {
                let type = player.fome.fome.subplanck.expansion.eq(0)
                return `<h3>${type ? `Condense` : `Re-form`} your Subspatial Foam</h3><br/><br/><b>Cost:</b> ${format(temp.fome.buyables[this.id].cost)} Subspatial Foam${type ? ``: `<br/><br/><b>Requires:</b> Infitesimal Foam<sup>${getBuyableAmount('fome', this.id).plus(2)}</sup>`}`
            },
            unlocked() { return player.fome.fome.subspatial.expansion.gte(1) },
            canAfford() { return (player.fome.fome.subplanck.expansion.eq(0) || player.fome.fome.infitesimal.expansion.gt(getBuyableAmount('fome', this.id).plus(1))) && player.fome.fome.subspatial.points.gte(temp.fome.buyables[this.id].cost) },
            buy() {
                player.fome.fome.subspatial.points = player.fome.fome.subspatial.points.minus(temp.fome.buyables[this.id].cost)
                if (player.fome.fome.subplanck.expansion.eq(0)) player.fome.fome.subplanck.expansion = player.fome.fome.subplanck.expansion.plus(1)
                else player.fome.fome.subspatial.expansion = player.fome.fome.subspatial.expansion.plus(1)
                setBuyableAmount('fome', this.id, getBuyableAmount('fome', this.id).plus(1))
            }
        },
        41: {
            cost() { return new Decimal(15).times(Decimal.pow(7, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.subplanck.expansion.gte(1) },
            canAfford() { return player.fome.fome.subplanck.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        42: {
            cost() { return new Decimal(25).times(Decimal.pow(9, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.subplanck.expansion.gte(1) },
            canAfford() { return player.fome.fome.subplanck.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        43: {
            cost() { return new Decimal(90).times(Decimal.pow(11, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.subplanck.expansion.gte(1) },
            canAfford() { return player.fome.fome.subplanck.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        44: {
            cost() { return Decimal.pow(10, getBuyableAmount('fome', this.id).sqr().plus(1).times(7)).dividedBy(1) },
            display() {
                let type = player.fome.fome.quantum.expansion.eq(0)
                return `<h3>${type ? `Condense` : `Re-form`} your Subplanck Foam</h3><br/><br/><b>Cost:</b> ${format(temp.fome.buyables[this.id].cost)} Subplanck Foam${type ? `` : `<br/><br/><b>Requires:</b> Subspatial Foam<sup>${getBuyableAmount('fome', this.id).plus(2)}</sup>`}`
            },
            unlocked() { return player.fome.fome.subplanck.expansion.gte(1) },
            canAfford() { return (player.fome.fome.quantum.expansion.eq(0) || player.fome.fome.subspatial.expansion.gt(getBuyableAmount('fome', this.id).plus(1))) && player.fome.fome.subplanck.points.gte(temp.fome.buyables[this.id].cost) },
            buy() {
                player.fome.fome.subplanck.points = player.fome.fome.subplanck.points.minus(temp.fome.buyables[this.id].cost)
                if (player.fome.fome.quantum.expansion.eq(0)) player.fome.fome.quantum.expansion = player.fome.fome.quantum.expansion.plus(1)
                else player.fome.fome.subplanck.expansion = player.fome.fome.subplanck.expansion.plus(1)
                setBuyableAmount('fome', this.id, getBuyableAmount('fome', this.id).plus(1))
            }
        },
        51: {
            cost() { return new Decimal(20).times(Decimal.pow(8, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.quantum.expansion.gte(1) },
            canAfford() { return player.fome.fome.quantum.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        52: {
            cost() { return new Decimal(30).times(Decimal.pow(10, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.quantum.expansion.gte(1) },
            canAfford() { return player.fome.fome.quantum.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        53: {
            cost() { return new Decimal(100).times(Decimal.pow(12, getBuyableAmount('fome', this.id).pow(1.15))) },
            display() { return displayFomeBuyable(this.id) },
            unlocked() { return player.fome.fome.quantum.expansion.gte(1) },
            canAfford() { return player.fome.fome.quantum.points.gte(temp.fome.buyables[this.id].cost) },
            effect() { return getBuyableAmount('fome', this.id).plus(1) },
            buy() { buyFomeBuyable(this.id) }
        },
        54: {
            cost() { return Decimal.pow(10, getBuyableAmount('fome', this.id).sqr().plus(1).times(7)).times(1e2) },
            display() {
                let type = !(player.inflaton.unlocked || player.acceleron.unlocked)
                return `<h3>${type ? `Condense` : `Re-form`} your Quantum Foam</h3><br/><br/><b>Cost:</b> ${format(temp.fome.buyables[this.id].cost)} Quantum Foam${type ? `` : `<br/><br/><b>Requires:</b> Subplanck Foam<sup>${getBuyableAmount('fome', this.id).plus(2)}</sup>`}`
            },
            unlocked() { return player.fome.fome.quantum.expansion.gte(1) },
            canAfford() { return ((!player.inflaton.unlocked && !player.acceleron.unlocked) || player.fome.fome.subplanck.expansion.gt(getBuyableAmount('fome', this.id).plus(1))) && player.fome.fome.quantum.points.gte(temp.fome.buyables[this.id].cost) },
            buy() {
                player.fome.fome.quantum.points = player.fome.fome.quantum.points.minus(temp.fome.buyables[this.id].cost)
                if (!player.inflaton.unlocked && !player.acceleron.unlocked) {
                    player.inflaton.unlocked = true
                    player.acceleron.unlocked = true
                }
                else player.fome.fome.quantum.expansion = player.fome.fome.quantum.expansion.plus(1)
                setBuyableAmount('fome', this.id, getBuyableAmount('fome', this.id).plus(1))
            }
        }
    },

    milestones: {
        0: {
            requirementDescription: "Re-form your Protoversal Foam",
            effectDescription: "Automatically enlarge your Protoversal Foam",
            unlocked() { return player.fome.fome.protoversal.expansion.gte(1) },
            done() { return player.fome.fome.protoversal.expansion.gt(1) },
            toggles: [['fome', 'autoProtoversal']]
        },
        1: {
            requirementDescription: "Re-form your Infitesimal Foam",
            effectDescription: "Automatically enlarge your Infitesimal Foam",
            unlocked() { return player.fome.fome.infitesimal.expansion.gte(1) },
            done() { return player.fome.fome.infitesimal.expansion.gt(1) },
            toggles: [['fome', 'autoInfitesimal']]
        },
        2: {
            requirementDescription: "Re-form your Subspatial Foam",
            effectDescription: "Automatically enlarge your Subspatial Foam",
            unlocked() { return player.fome.fome.subspatial.expansion.gte(1) },
            done() { return player.fome.fome.subspatial.expansion.gt(1) },
            toggles: [['fome', 'autoSubspatial']]
        },
        3: {
            requirementDescription: "Re-form your Subplanck Foam",
            effectDescription: "Automatically enlarge your Subplanck Foam",
            unlocked() { return player.fome.fome.subplanck.expansion.gte(1) },
            done() { return player.fome.fome.subplanck.expansion.gt(1) },
            toggles: [['fome', 'autoSubplanck']]
        },
        4: {
            requirementDescription: "Re-form your Quantum Foam",
            effectDescription: "Automatically enlarge your Quantum Foam",
            unlocked() { return player.fome.fome.quantum.expansion.gte(1) },
            done() { return player.fome.fome.quantum.expansion.gt(1) },
            toggles: [['fome', 'autoQuantum']]
        },
        5: {
            requirementDescription: "Obtain Quantum Foam<sup>3</sup>",
            effectDescription: "Automatically re-form your Foam",
            unlocked() { return hasMilestone('fome', 4) },
            done() { return player.fome.fome.quantum.expansion.gte(3) },
            toggles: [['fome', 'autoReform']]
        }
    },

    microtabs: {
        stuff: {
            "Foam": {
                shouldNotify() {
                    if (player.tab == "fome" && player.subtabs.fome.stuff == "Foam")
                        return false
                    for(let fome = 10; fome <= 50; fome += 10)
                        for(let dim = 1; dim <= 4; dim++) {
                            let buyable = temp.fome.buyables[fome+dim]
                            if (buyable.unlocked && buyable.canAfford)
                                return true
                        }
                    return false
                },
                content: [
                    "blank",
                    () => player.fome.fome.quantum.expansion.gte(1) ? ["row", [ ["column", [
                                ["display-text", `You have ${format(player.fome.fome.quantum.points)} Quantum Foam${player.fome.fome.quantum.expansion.gt(1) ? `<sup>${formatWhole(player.fome.fome.quantum.expansion)}</sup>` : ``}`],
                                ["display-text", `(${format(temp.fome.effect.gain.total.quantum)}/sec)`]
                        ]], "blank", "blank", ["buyable", 51], ["buyable", 52], ["buyable", 53], ["buyable", 54]
                    ]] : ``,
                    () => player.fome.fome.subplanck.expansion.gte(1) ? ["row", [ ["column", [
                            ["display-text", `You have ${format(player.fome.fome.subplanck.points)} Subplanck Foam${player.fome.fome.subplanck.expansion.gt(1) ? `<sup>${formatWhole(player.fome.fome.subplanck.expansion)}</sup>` : ``}`],
                            ["display-text", `(${format(temp.fome.effect.gain.total.subplanck)}/sec)`]
                        ]], "blank", "blank", ["buyable", 41], ["buyable", 42], ["buyable", 43], ["buyable", 44]
                    ]] : ``,
                    () => player.fome.fome.subspatial.expansion.gte(1) ? ["row", [ ["column", [
                            ["display-text", `You have ${format(player.fome.fome.subspatial.points)} Subspatial Foam${player.fome.fome.subspatial.expansion.gt(1) ? `<sup>${formatWhole(player.fome.fome.subspatial.expansion)}</sup>` : ``}`],
                            ["display-text", `(${format(temp.fome.effect.gain.total.subspatial)}/sec)`]
                        ]], "blank", "blank", ["buyable", 31], ["buyable", 32], ["buyable", 33], ["buyable", 34]
                    ]] : ``,
                    () => player.fome.fome.infitesimal.expansion.gte(1) ? ["row", [ ["column", [
                            ["display-text", `You have ${format(player.fome.fome.infitesimal.points)} Infitesimal Foam${player.fome.fome.infitesimal.expansion.gt(1) ? `<sup>${formatWhole(player.fome.fome.infitesimal.expansion)}</sup>` : ``}`],
                            ["display-text", `(${format(temp.fome.effect.gain.total.infitesimal)}/sec)`]
                        ]], "blank", "blank", ["buyable", 21], ["buyable", 22], ["buyable", 23], ["buyable", 24]
                    ]] : ``,
                    () => player.fome.fome.protoversal.expansion.gte(1) ? ["row", [ ["column", [
                            ["display-text", `You have ${format(player.fome.fome.protoversal.points)} Protoversal Foam${player.fome.fome.protoversal.expansion.gt(1) ? `<sup>${formatWhole(player.fome.fome.protoversal.expansion)}</sup>` : ``}`],
                            ["display-text", `(${format(temp.fome.effect.gain.total.protoversal)}/sec)`]
                        ]], "blank", "blank",["buyable", 11], ["buyable", 12], ["buyable", 13], ["buyable", 14]
                    ]] : ``
                ]
            },
            "Boosts": {
                unlocked() { return player.fome.boosts.protoversal.boosts[0].gte(1) },
                content: [
                    "blank",
                    ["display-text", () => displayFomeBoost(0, 0, `Multiply the generation of Protoversal Foam by ${format(temp.fome.effect.gain.boost.protoversal)}x`)],
                    ["display-text", () => displayFomeBoost(0, 1, `Gain ${format(temp.fome.effect.boosts.total.protoversal[1])} bonus Pion and Spinor Upgrade α levels`)],
                    ["display-text", () => displayFomeBoost(0, 2, `Gain ${format(temp.fome.effect.boosts.total.protoversal[2])} bonus Pion and Spinor Upgrade β levels`)],
                    ["display-text", () => displayFomeBoost(0, 3, `Gain ${format(temp.fome.effect.boosts.total.protoversal[3])} bonus Pion and Spinor Upgrade γ levels`)],
                    ["display-text", () => displayFomeBoost(0, 4, `Add ${format(temp.fome.effect.boosts.total.protoversal[4].times(0.1))} levels to all above boosts`)],
                    "blank",
                    () => {  },
                    ["display-text", () => displayFomeBoost(1, 0, `Multiply the generation of Infitesimal Foam by ${format(temp.fome.effect.gain.boost.infitesimal)}x`)],
                    ["display-text", () => displayFomeBoost(1, 1, `Increase Pion and Spinor gain by ${format(temp.fome.effect.boosts.total.infitesimal[1].times(0.5).times(100))}%`)],
                    ["display-text", () => displayFomeBoost(1, 2, `Reduce Pion and Spinor Upgrade α costs by ${format(Decimal.sub(1, Decimal.pow(0.8, temp.fome.effect.boosts.total.infitesimal[2])).times(100))}%`)],
                    ["display-text", () => displayFomeBoost(1, 3, `Increase Skyrmion gain by ${format(temp.fome.effect.boosts.total.infitesimal[3].times(0.5).times(100))}%`)],
                    ["display-text", () => displayFomeBoost(1, 4, `Reduce Pion and Spinor Upgrade γ costs by ${format(Decimal.sub(1, Decimal.pow(0.8, temp.fome.effect.boosts.total.infitesimal[4])).times(100))}%`)],
                    "blank",
                    ["display-text", () => displayFomeBoost(2, 0, `Multiply the generation of Subspatial Foam by ${format(temp.fome.effect.gain.boost.subspatial)}x`)],
                    ["display-text", () => displayFomeBoost(2, 1, `Decrease effective Pion and Spinor upgrade counts by ${format(temp.fome.effect.boosts.total.subspatial[1])}`)],
                    ["display-text", () => displayFomeBoost(2, 2, `Add ${format(getTotalFomeBoost('subspatial', 2).times(0.1))} levels to all above boosts`)],
                    ["display-text", () => displayFomeBoost(2, 3, `Increase effective Skyrmion count by ${format(temp.fome.effect.boosts.total.subspatial[3])}`)],
                    ["display-text", () => displayFomeBoost(2, 4, `Pion and Spinor upgrades cost as if you had ${format(temp.fome.effect.boosts.total.subspatial[4].times(0.25))} fewer`)],
                    "blank",
                    ["display-text", () => displayFomeBoost(3, 0, `Multiply the generation of Subplanck Foam by ${format(temp.fome.effect.gain.boost.subplanck)}x`)],
                    ["display-text", () => displayFomeBoost(3, 1, `Gain ${format(temp.fome.effect.boosts.total.subplanck[1].times(0.5))} bonus Pion and Spinor Upgrade δ levels`)],
                    ["display-text", () => displayFomeBoost(3, 2, `Gain ${format(temp.fome.effect.boosts.total.subplanck[2].times(0.5))} bonus Pion and Spinor Upgrade ε levels`)],
                    ["display-text", () => displayFomeBoost(3, 3, `Gain ${format(temp.fome.effect.boosts.total.subplanck[3].times(0.5))} bonus Pion and Spinor Upgrade ζ levels`)],
                    ["display-text", () => displayFomeBoost(3, 4, `Gain ${format(temp.fome.effect.boosts.total.subplanck[4].times(0.5))} bonus Pion and Spinor Upgrade η levels`)],
                    "blank",
                    ["display-text", () => displayFomeBoost(4, 0, `Multiply the generation of all Foam types by ${format(temp.fome.effect.gain.boost.quantum)}x`)],
                    ["display-text", () => displayFomeBoost(4, 1, `Gain ${format(temp.fome.effect.boosts.total.quantum[1].times(0.25))} bonus Pion and Spinor Upgrade θ levels`)],
                    ["display-text", () => displayFomeBoost(4, 2, `Gain ${format(temp.fome.effect.boosts.total.quantum[2].times(0.25))} bonus Pion and Spinor Upgrade ι levels`)],
                    ["display-text", () => displayFomeBoost(4, 3, `Gain ${format(temp.fome.effect.boosts.total.quantum[3].times(0.25))} bonus Pion and Spinor Upgrade κ levels`)],
                    ["display-text", () => displayFomeBoost(4, 4, `Add ${format(getTotalFomeBoost('quantum', 4).times(0.1))} levels to all above boosts`)]
                ]
            },
            "Milestones": {
                content: [
                    "milestones"
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
        "buyable"() { return { "height": "100px", "width": "150px" } },
        "microtabs"() { return { "border-style": "none" } }
    }
})
