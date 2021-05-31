addLayer("inflaton", {
    name: "Inflaton",
    symbol: "I",
    row: 2,
    position: 2,
    branches: ['fome'],

    layerShown() { return (player.inflaton.unlockOrder > 0 && !hasUpgrade('acceleron', 25)) ? "ghost" : player.inflaton.unlocked },
    resource() { return player[this.layer].points.equals(1) ? "Inflaton" : "Inflatons" },
    color: "#ff5e13",
    type: "static",
    baseResource: "Quantum Foam",
    baseAmount() { return player.fome.fome.quantum.points },
    requires() { return player.inflaton.unlockOrder > 0 ? new Decimal(1e50) : new Decimal(1e12) },
    canBuyMax() { return false },
    base: 1e308,
    exponent: 1e308,
    doReset(layer) {
        if (inChallenge('inflaton', 11)) {
            player.inflaton.inflating = true

        }
        else if (player.inflaton.inflating) {
            
        }
        else {
            if (player.acceleron.unlockOrder === 0 && player.inflaton.unlockOrder === 0)
                player.acceleron.unlockOrder = 1
        }
    },

    startData() { return {
        unlocked: false,
        points: decimalZero,
        best: decimalZero,
        unlockOrder: 0,

        inflating: false,
        size: decimalZero,
        maxSize: decimalZero,

        researchProgress: decimalZero,
        researchQueue: [],
        research: [],
        repeatables: {}
    }},

    nerf() {
        return Decimal.pow(2, player.inflaton.points.log10().times(buyableEffect('inflaton', 11)))
    },
    gain() {
        let exp = player.inflaton.points.log(10).plus(1).dividedBy(10)
        return player.inflaton.points.times(Decimal.pow(2, exp))
    },
    researchGain() {
        let researchGain = buyableEffect('inflaton', 12)
        if (hasResearch('inflaton', 5)) researchGain = researchGain.times(researchEffect('inflaton', 5))
        return researchGain
    },
    effect() {
        if (player.inflaton.points.gt(temp.inflaton.storage) || player.inflaton.inflating) {
            return {
                gain: temp.inflaton.gain,
                nerf: temp.inflaton.nerf
            }
        }
        return {
            gain: decimalZero,
            nerf: decimalOne
        }
    },
    effectDescription() {
        return `<br>which ${player.inflaton.points.eq(1) ? `is` : `are`} dividing all other resources by <span style='color:${layers.inflaton.color};text-shadow:${layers.inflaton.color} 0px 0px 10px;'>${formatWhole(temp.inflaton.effect.nerf)}x</span>`
    },
    size() {
        if (player.inflaton.points.lt(1)) return decimalZero

        let size = player.inflaton.points.log(2).log(2)
        if (hasResearch('inflaton', 2)) size = size.times(2)
        if (hasResearch('inflaton', 8)) size = size.times(2)
        return size
    },
    storage() {
        let base = decimalOne
        if (hasResearch('inflaton', 4)) base = base.times(buyableEffect('inflaton', 13))
        return base
    },

    update(delta) {
        let max = new Decimal('10^^1e308')

        let effect = temp.inflaton.effect
        
        if (effect.gain.lt(max)) player.inflaton.points = player.inflaton.points.plus(effect.gain.times(delta))
        else player.inflaton.points = max

        if (player.inflaton.points.gt(player.inflaton.best)) player.inflaton.best = player.inflaton.points

        let individualNerfs = { pion: decimalOne, spinor: decimalOne }
        for (fomeType of fomeTypes) individualNerfs[fomeType] = decimalOne
        if (hasResearch('inflaton', 7)) individualNerfs.quantum = individualNerfs.quantum.times(researchEffect('inflaton', 7))
        if (hasResearch('inflaton', 14)) individualNerfs.quantum = individualNerfs.quantum.times(researchEffect('inflaton', 14))

        let fomeNerf = effect.nerf
        if (hasResearch('inflaton', 4)) fomeNerf = fomeNerf.dividedBy(researchEffect('inflaton', 4)).max(1)
        for (fomeType of fomeTypes) {
            player.fome.fome[fomeType].points = player.fome.fome[fomeType].points.dividedBy(fomeNerf.times(individualNerfs[fomeType]).max(1))
        }
        player.skyrmion.pion.points = player.skyrmion.pion.points.dividedBy(effect.nerf.times(individualNerfs.pion).max(1))
        player.skyrmion.spinor.points = player.skyrmion.spinor.points.dividedBy(effect.nerf.times(individualNerfs.spinor).max(1))
        if (player.inflaton.unlockOrder > 0) {
            player.acceleron.points = player.acceleron.points.dividedBy(effect.nerf)
            player.timecube.points = player.timecube.points.dividedBy(effect.nerf)
        }

        temp.inflaton.size = layers.inflaton.size()
        if (temp.inflaton.size.gt(player.inflaton.maxSize))
            player.inflaton.maxSize = temp.inflaton.size;

        if (inChallenge('inflaton', 11)) {
            for (fomeType of fomeTypes)
                if (player.fome.fome[fomeType].points.lt(1)) {
                    startChallenge('inflaton', 11)
                    return
                }
            if (player.skyrmion.pion.points.lt(1)) {
                startChallenge('inflaton', 11)
                return
            }
            if (player.skyrmion.spinor.points.lt(1)) {
                startChallenge('inflaton', 11)
                return
            }
        }
        else {
            if (player.inflaton.points.gt(temp.inflaton.storage))
                player.inflaton.points = temp.inflaton.storage
        }

        if (player.inflaton.researchQueue.length > 0) {
            player.inflaton.researchProgress = player.inflaton.researchProgress.plus(temp.inflaton.researchGain.times(delta))
            if(player.inflaton.researchProgress.gte(temp.inflaton.research[player.inflaton.researchQueue[0]].cost)) {
                let id = player.inflaton.researchQueue.shift()
                player.inflaton.research.push(id)
                player.inflaton.researchProgress = decimalZero
                run(temp.inflaton.research[id].onComplete, temp.inflaton.research[id])
            }
        }
    },

    challenges: {
        rows: 1,
        cols: 1,
        11: {
            name: "INFLATE",
            challengeDescription: "<i>Survive</i><br/>",
            goalDescription: `${format('10^^1000')} Inflatons`,
            canComplete() { return player.inflaton.points.eq('10^^1e308') },
            rewardDescription: `Keep a second Inflaton`,
            unlocked() { return player.inflaton.points.lte(temp.inflaton.storage) || inChallenge('inflaton', this.id) },
            onEnter() {
                player.inflaton.inflating = true
                player.inflaton.points = player.inflaton.points.plus(1)
            },
            onExit() {
                player.inflaton.inflating = false
                player.inflaton.points = temp.inflaton.storage.min(player.inflaton.points)
            },
            onComplete() {
                this.onExit()
            }
        }
    },

    upgrades: {
        11: {
            title: 'Subspatial Field Stabilizers',
            description: 'Allow the creation of Subspatial Structures',
            cost: new Decimal(5e13),
            currencyDisplayName: 'Quantum Foam',
            currencyInternalName: 'points',
            currencyLocation() { return player.fome.fome.quantum },
            unlocked() { return hasUpgrade('inflaton', 11) || !player.inflaton.inflating }
        },
        12: {
            title: 'Quantum Field Investigations',
            description: `Stabilization isn't enough. Maybe the constant bubbling of the quantum field may hold the secret to sustaining inflation`,
            cost: new Decimal(1e14),
            currencyDisplayName: 'Quantum Foam',
            currencyInternalName: 'points',
            currencyLocation() { return player.fome.fome.quantum },
            unlocked() { return hasUpgrade('inflaton', 12) || (!player.inflaton.inflating && player.inflaton.maxSize.gt(player.inflaton.unlockOrder > 0 ? 9 : 7.01) && hasUpgrade('inflaton', 11)) }
        },
        21: {
            title: '',
            description: `Generate more Foam based on the size of your universe`,
            cost: new Decimal(1e25),
            effect() { return player.inflaton.maxSize.max(1) },
            effectDisplay() { return `${format(upgradeEffect('inflaton', 21))}x` },
            currencyDisplayName: 'Quantum Foam',
            currencyInternalName: 'points',
            currencyLocation() { return player.fome.fome.quantum },
            unlocked() { return hasUpgrade('inflaton', 21) || (!player.inflaton.inflating && hasResearch('inflaton', 9)) }
        },
        22: {
            title: 'Perpetual Testing Initiative',
            description: `Unlock repeatable research`,
            cost: new Decimal(1e27),
            currencyDisplayName: 'Quantum Foam',
            currencyInternalName: 'points',
            currencyLocation() { return player.fome.fome.quantum },
            unlocked() { return hasUpgrade('inflaton', 22) || (!player.inflaton.inflating && hasResearch('inflaton', 9)) }
        }
    },

    buyables: {
        rows: 1,
        cols: 99,
        respec() {
            Object.keys(player.inflaton.buyables).forEach(id => player.inflaton.buyables[id] = decimalZero)
            player.inflaton.size = decimalZero
        },
        respecConfirm: false,
        11: createInflatonBuilding(11, {
            title: 'M-field Condenser',
            description: 'Slightly reduce the loss of resources to Inflation',
            effect(amount) {
                if (hasResearch('inflaton', 1)) amount = amount.times(researchEffect('inflaton', 1))
                if (hasResearch('inflaton', 19)) amount = amount.times(researchEffect('inflaton', 19).gain)
                return Decimal.pow(0.975, amount)
            },
            effectDisplay(effect) { return `${formatSmall(effect)}x` },
            cost: [1e30, 1.1],
            currencyDisplayName: 'Subspatial Foam',
            currencyLocation() { return player.fome.fome.subspatial },
            size() {
                let size = decimalOne
                if (hasResearch('inflaton', 19)) size = size.times(researchEffect('inflaton', 19).size)
                return size
            },
            unlocked() { return hasUpgrade('inflaton', 11) }
        }),
        12: createInflatonBuilding(12, {
            title: 'Quantum Flux Analyzer',
            description: 'Study fluctuations in the quantum field',
            effect(amount) {
                if (hasResearch('inflaton', 19)) amount = amount.times(researchEffect('inflaton', 19).gain)
                return amount
            },
            effectDisplay(effect) { return `+${formatWhole(effect)} research points/s` },
            cost() { return [1e30, hasResearch('inflaton', 3) ? 1.5 : 15] },
            currencyDisplayName: 'Subspatial Foam',
            currencyLocation() { return player.fome.fome.subspatial },
            size() {
                let size = decimalOne
                if (hasResearch('inflaton', 19)) size = size.times(researchEffect('inflaton', 19).size)
                return size
            },
            unlocked() { return hasUpgrade('inflaton', 12) }
        }),
        13: createInflatonBuilding(13, {
            title: 'Inflaton Containment Unit',
            description: 'Specialized storage facilities designed to keep Inflatons separated and inert',
            effect(amount) {
                if (hasResearch('inflaton', 19)) amount = amount.times(researchEffect('inflaton', 19).gain)
                return Decimal.pow(500, amount.dividedBy(3))
            },
            effectDisplay(effect) { return `Store ${formatWhole(effect)}x more Inflatons`},
            cost: [1e15, 1.2],
            currencyDisplayName: 'Quantum Foam',
            currencyLocation() { return player.fome.fome.quantum },
            size() {
                let size = new Decimal(3)
                if (hasResearch('inflaton', 19)) size = size.times(researchEffect('inflaton', 19).size)
                return size
            },
            unlocked() { return hasResearch('inflaton', 6) }
        }),
        14: createInflatonBuilding(14, {
            title: 'Active Redistribution Center',
            description: 'Tune your M-field Condensers with continuous analysis of inflation patterns',
            effect(amount) {
                let gain = Decimal.pow(1.5, amount)
                let cost = Decimal.pow(100, amount)

                let capacity = temp.inflaton.researchGain
                if (cost.gt(capacity)) {
                    gain = gain.times(capacity).dividedBy(cost)
                    cost = capacity
                }
                return { gain: gain, cost: cost }
            },
            effectDisplay(effect) { return `${format(effect.gain)}x<br><b>Consumes:</b> ${format(effect.cost)} Research/sec` }
        })
    },

    queueSize: 1,
    research: {
        1: {
            title: 'Branon Induction Phases',
            description: 'Quintuple the effect of M-field Condensers',
            cost: new Decimal(75),
            effect: new Decimal(5),
            row: 1,
            pos: 1
        },
        2: {
            title: 'Banach-Tarski Point Manipulation',
            description: 'You can stabilize the universe at double the size',
            cost: new Decimal(100),
            effect: new Decimal(2),
            requires: [1],
            row: 2,
            pos: 1
        },
        3: {
            title: 'Subspatial Binding Constants',
            description: 'Reduce the cost scaling of Quantum Flux Analyzers',
            cost: new Decimal(100),
            requires: [1],
            row: 2,
            pos: 2
        },
        4: {
            title: 'Counter-Inflational Cycles',
            description: 'Gain up to 1e6x more Foam, based on your current Inflatons',
            cost: new Decimal(500),
            effect: new Decimal(1e6),
            requires: [2],
            row: 3,
            pos: 1
        },
        5: {
            title: 'Distributed Analysis Framework',
            description: 'Each Quantum Flux Analyzer increases Research Point gain by 10%',
            cost: new Decimal(1500),
            effect() { return Decimal.pow(1.1, getBuyableAmount('inflaton', 12)) },
            requires: [2, 3],
            row: 3,
            pos: 2
        },
        6: {
            title: 'Inflaton Containment Strategies',
            description: 'Allow construction of Inflaton Containment Units',
            cost: new Decimal(500),
            requires: [3],
            row: 3,
            pos: 3
        },
        7: {
            title: 'Quantum Phasor Coherence',
            description: 'Halve the effect of inflation on Quantum Foam',
            cost: new Decimal(750),
            effect: new Decimal(0.5),
            requires: [4],
            row: 4,
            pos: 1
        },
        8: {
            title: 'Von Neumann Transformation',
            description: 'Double the size of the universe, again',
            cost: new Decimal(750),
            requires: [4],
            row: 4,
            pos: 2
        },
        9: {
            title: '9',
            description: 'Unlock two Inflaton upgrades',
            cost: new Decimal(750),
            requires: [6],
            row: 4,
            pos: 3
        },
        10: {
            title: '10',
            description: 'Enable individual building respecs',
            cost: new Decimal(750),
            requires: [6],
            row: 4,
            pos: 4
        },
        11: {
            title: '11',
            description: 'Retain an additional 1e12x more Foam, based on your current Inflatons',
            cost: new Decimal(1500),
            effect: new Decimal(1e12),
            requires: [7, 9],
            row: 5,
            pos: 1
        },
        12: {
            title: '12',
            description: 'You can queue up to 2 additional researches',
            cost: new Decimal(25000),
            requires: [5],
            row: 5,
            pos: 2
        },
        13: {
            title: '13',
            description: 'Improve the Inflaton Containment Unit storage capabilities',
            cost: new Decimal(1500),
            requires: [10],
            row: 5,
            pos: 3
        },
        14: {
            title: '14',
            description: 'Halve the effect of inflaton on Quantum Foam, again',
            cost: new Decimal(1500),
            effect: new Decimal(0.5),
            requires: [7, 11],
            row: 6,
            pos: 1
        },
        15: {
            title: '15',
            description: 'Unlock a repeatable research',
            cost: new Decimal(1500),
            requires: [8],
            row: 6,
            pos: 2
        },
        16: {
            title: 'Active Restoration Protocols',
            description: 'Allow the construction of ???',
            cost: new Decimal(1500),
            requires: [12, 13],
            row: 6,
            pos: 3
        },
        17: {
            title: 'Inflationary Tolerances',
            description: 'Allow stored Inflatons to inflate to fill your storage',
            cost: new Decimal(1500),
            requires: [10, 13],
            row: 6,
            pos: 4
        },
        18: {
            title: '18',
            description: '',
            cost: new Decimal(1500),
            requires: [14, 15],
            row: 7,
            pos: 1  
        },
        19: {
            title: '19',
            description: 'Increase subspace building size tenfold, and increase their effects by twice as much',
            onComplete() { layers.inflaton.buyables.respec() },
            cost: new Decimal(1500),
            effect() { return { size: new Decimal(10), gain: new Decimal(2) } },
            requires: [14, 15, 16],
            row: 7,
            pos: 2
        },
        20: {
            title: 'Secondary Isolation Standards',
            description: 'M-field Condensers no longer affect ',
            cost: new Decimal(1500),
            requires: [16],
            row: 7,
            pos: 3
        },
        21: {
            title: '21',
            description: '',
            cost: new Decimal(1500),
            requires: [16, 17],
            row: 7,
            pos: 4
        },
        22: {
            title: '22',
            description: 'Unlock another repeatable research project',
            cost: new Decimal(1500),
            requires: [18, 19],
            row: 8,
            pos: 1
        },
        23: {
            title: '23',
            description: 'Unlock another repeatable research project',
            cost: new Decimal(1500),
            requires: [12, 15],
            row: 8,
            pos: 2
        },
        24: {
            title: '24',
            description: 'Automatically build subspace buildings, and building them no longer consumes Foam',
            cost: new Decimal(1500),
            requires: [20, 21],
            row: 8,
            pos: 3
        },
        25: {
            title: 'Spatial Mastery',
            description: 'Unlock Accelerons',
            cost: new Decimal(1500),
            requires: [22, 23, 24],
            row: 9,
            pos: 1
        },

        111: {
            title: 'Repeatable: Eternal Inflation',
            description: 'Double the size of your universe',
            cost(amount) { return Decimal.pow(1000, amount).times(1e30) },
            effect(amount) { return Decimal.pow(2, amount) },
            effectDisplay(effect) { return `${format(effect)}x` },
            unlocked() { return hasResearch('inflaton', 15) },
            repeatable: true,
            row: 0,
            pos: 1
        },
        112: {
            title: 'Repeatable: Subspacial Construction',
            description: 'Increase subspace building size tenfold, and increase their effects by twice as much',
            cost(amount) { return Decimal.pow(1000, amount).times(1e30) },
            effect(amount) { return { size: Decimal.pow(10, amount), gain: Decimal.pow(2, amount) } },
            effectDisplay(effect) { return `${format(effect)}x` },
            unlocked() { return hasResearch('inflaton', 22) },
            repeatable: true,
            row: 0,
            pos: 2
        },
        113: {
            title: 'Repeatable: Efficient Design',
            description: '',
            cost(amount) { return Decimal.pow(1000, amount).times(1e30) },
            effect(amount) { return Decimal.pow(1.5, amount) },
            effectDisplay(effect) { return `${format(effect)}x` },
            unlocked() { return hasResearch('inflaton', 23) },
            repeatable: true,
            row: 0,
            pos: 3
        },
        114: {
            title: 'Repeatable: Inflational Dynamics',
            description: '',
            cost(amount) { return Decimal.pow(1000, amount).times(1e30) },
            effect(amount) { return Decimal.pow(1e3, amount) },
            effectDisplay(effect) { return `${format(effect)}x` },
            unlocked() { return false },
            repeatable: true,
            row: 0,
            pos: 4
        },
        115: {
            title: 'Repeatable: Perpetual Testing',
            description: `Increase Distributed Analysis Framework's maximum Analyzer limit`,
            cost(amount) { return Decimal.pow(1000, amount).times(1e30) },
            effect(amount) { return Decimal.pow(10, amount) },
            effectDisplay(effect) { return `${format(effect)}x` },
            unlocked() { return false },
            repeatable: true,
            row: 0,
            pos: 5
        }
    },

    clickables: {},
    bars: {
        research: {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() {
                if (player.inflaton.researchQueue.length > 0)
                    return Decimal.div(player.inflaton.researchProgress,
                        temp.inflaton.research[player.inflaton.researchQueue[0]].cost)
                return decimalZero
            },
            display() {
                if (player.inflaton.researchQueue.length > 0) {
                    let id = player.inflaton.researchQueue[0]
                    let title = temp.inflaton.research[id].title
                    let progress = player.inflaton.researchProgress
                    let max = temp.inflaton.research[id].cost
                    return `Current Research: ${title}<br>Progress: ${formatWhole(progress)} / ${formatWhole(max)}`
                }
                return `Current Research: None`
            },
            fillStyle() { return { "backgroundColor": temp.inflaton.color } },
            onClick() {
                player.inflaton.researchQueue.shift()
                player.inflaton.researchProgress = decimalZero
                console.log(3)
            }
        }
    },

    microtabs: {
        stuff: {
            "Upgrades": {
                unlocked() { return hasUpgrade('inflaton', 11) },
                content: [
                    "blank",
                    "challenges",
                    "blank",
                    "upgrades"
                ]
            },
            "Subspace": {
                unlocked() { return hasUpgrade('inflaton', 11) },
                content: [
                    "blank",
                    "buyables"
                ]
            },
            "Research": {
                unlocked() { return hasUpgrade('inflaton', 12) },
                content: [
                    "blank",
                    ["display-text", () => `You are producing <h3 style='color:${layers[layer].color};text-shadow:${layers[layer].color} 0px 0px 10px;'>${formatWhole(temp.inflaton.researchGain)}</h3> research points per second`],
                    "blank",
                    ["bar", "research"],
                    "blank",
                    ["row", [["clickable", 1], ["clickable", 2], ["clickable", 3], ["clickable", 4], ["clickable", 5]]],
                    "clickables"
                ]
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text", () => `You have managed to stabilize the universe at a diameter of ${formatLength(player.inflaton.maxSize)}`],
        ["display-text", () => `Construction Space Used: ${formatLength(player.inflaton.size)} / ${formatLength(player.inflaton.maxSize)}`],
        "blank",
        () => !hasUpgrade('inflaton', 11) ? "challenges" : '',
        () => !hasUpgrade('inflaton', 11) ? "blank" : '',
        () => !hasUpgrade('inflaton', 11) ? "upgrades" : '',
        () => hasUpgrade('inflaton', 11) ? ["microtabs", "stuff"] : ''
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } },
        "buyable"() { return { "height": "100px", "width": "300px" } }
    },

    hotkeys: [
        {
            key: "ctrl+i",
            onPress() { if (temp.inflaton.layerShown === true) player.tab = 'inflaton' }
        }
    ]
})

function createInflatonBuilding(id, data) {
    let currencyLocation = data.currencyLocation ? data.currencyLocation : () => player.inflaton
    let currencyInternalName = data.currencyInternalName ? data.currencyInternalName : 'points'
    
    return {
        title: data.title,
        cost() {
            let mult, base
            if (typeof data.cost === 'function')
                [mult, base] = data.cost()
            else if (typeof data.cost === 'object')
                [mult, base] = data.cost
            mult = new Decimal(mult)
            base = new Decimal(base)
            let amount = getBuyableAmount('inflaton', id)
            let size = temp.inflaton.buyables[id].size
            return mult.times(base.pow(size).minus(1)).times(base.pow(amount)).dividedBy(base.minus(1))
        },
        effect() { return data.effect(getBuyableAmount('inflaton', id)) },
        display() { return `<br>${data.description}<br><b>Size: </b>${formatLength(temp.inflaton.buyables[id].size)}<br><b>Area:</b> ${formatLength(getBuyableAmount('inflaton', id))}<br><b>Current Effect: </b>${data.effectDisplay(temp.inflaton.buyables[id].effect)}<br><b>Cost:</b> ${format(temp.inflaton.buyables[id].cost)} ${data.currencyDisplayName}` },
        canAfford() { return player.inflaton.size.plus(temp.inflaton.buyables[id].size).lte(player.inflaton.maxSize) && currencyLocation()[currencyInternalName].gte(temp.inflaton.buyables[id].cost) },
        buy() {
            setBuyableAmount('inflaton', id, getBuyableAmount('inflaton', id).plus(temp.inflaton.buyables[id].size))
            currencyLocation()[currencyInternalName] = currencyLocation()[currencyInternalName].minus(temp.inflaton.buyables[id].cost)
            player.inflaton.size = player.inflaton.size.plus(temp.inflaton.buyables[id].size)
        },
        sellOne() {
            if (getBuyableAmount('inflaton', id).gt(0)) {
                setBuyableAmount('inflaton', id, getBuyableAmount('inflaton', id).minus(temp.inflaton.buyables[id].size).max(0))
                player.inflaton.size = player.inflaton.size.minus(temp.inflaton.buyables[id].size)
            }
        },
        sellAll() {
            player.inflaton.size = player.inflaton.size.minus(getBuyableAmount('inflaton', id))
            setBuyableAmount('inflaton', id, decimalZero)
        },
        canSellOne() { return hasResearch('inflaton', 10) },
        canSellAll() { return hasResearch('inflaton', 10) },
        size: data.size,
        unlocked: data.unlocked,

        style: data.style,
        purchaseLimit: data.purchaseLimit
    }
}

function createResearchClickables() {
    let clickables = {}

    for(let id in layers.inflaton.research) {
        let research = layers.inflaton.research[id]
        clickables[research.row*10 + research.pos] = createResearchClickable(id, research)
    }

    return clickables
}

function createResearchClickable(id, research) {
    let clickable = {
        unlocked() {
            if (hasResearch('inflaton', id)) return true
            if (research.requires) {
                for (let requirement of research.requires) {
                    let researchReq = temp.inflaton.research[requirement]
                    let reqIndex = researchReq.row*10 + researchReq.pos
                    if (!temp.inflaton.clickables[reqIndex].canClick)
                        return false
                }
            }
            return temp.inflaton.research[id].unlocked === undefined ? true : temp.inflaton.research[id].unlocked
        },
        canClick() {
            if (research.requires) {
                for (let requirement of research.requires) {
                    if (!hasResearch('inflaton', requirement))
                        return false
                }
            }
            return true
        },
        research: id
    }

    if (research.repeatable) {
        clickable.display = () => `<h3>${research.title} ${formatRoman(researchLevel('inflaton', id).plus(1))}</h3><br>${research.description}<br><b>Effect: </b>${temp.inflaton.clickables[id-110].effectDisplay()}<br><b>Cost:</b> ${formatWhole(temp.inflaton.clickables[id-110].cost)} Research Points`
        clickable.onClick = () => {
            if (player.inflaton.researchQueue.length >= temp.inflaton.queueSize) return
            if (player.inflaton.researchQueue.includes(id)) return
            player.inflaton.researchQueue.push(id)
        }
        clickable.cost = () => research.cost(researchLevel('inflaton', id))
        clickable.effect = () => research.effect(researchLevel('inflaton', id))
        clickable.effectDisplay = () => research.effectDisplay(temp.inflaton.clickables[id-110].effect)
    }
    else {
        clickable.style = () => {
            let style = { "margin": "10px" }
            if (player.inflaton.research.includes(id))
                style["background-color"] = "#77bf5f"
            return style
        }
        clickable.display = () => `<h3>${research.title}</h3><br>${research.description}<br><b>Cost:</b> ${formatWhole(research.cost)} Research Points`
        clickable.onClick = () => {
            if (player.inflaton.researchQueue.length >= temp.inflaton.queueSize) return
            if (player.inflaton.researchQueue.includes(id)) return
            if (player.inflaton.research.includes(id)) return
            player.inflaton.researchQueue.push(id)
        }
    }

    return clickable
}

function hasResearch(layer, id) {
    return player[layer].research.includes(toNumber(id)) || player[layer].research.includes(String(id))
}

function researchLevel(layer, id) {
    if (temp[layer].research[id].repeatable)
        return player[layer].repeatables[id] === undefined ? decimalZero : player[layer].repeatables[id]
    else return hasResearch(layer, id) ? decimalOne : decimalZero
}

function researchEffect(layer, id) {
    return temp[layer].research[id].effect
}

function repeatableEffect(layer, id) {
    return layers[layer].research[id].effect(researchLevel(layer, id))
}