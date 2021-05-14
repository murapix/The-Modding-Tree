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
        research: []
    }},

    nerf() {
        let base = buyableEffect('inflaton', 11).plus(1)
        return Decimal.pow(base, player.inflaton.points.log10())
    },
    gain() {
        let exp = player.inflaton.points.log(10).plus(1).dividedBy(10)
        return player.inflaton.points.times(Decimal.pow(2, exp))
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

        let fomeNerf = effect.nerf
        if (hasResearch('inflaton', 4)) fomeNerf = fomeNerf.dividedBy(researchEffect('inflaton', 4)).max(1)
        for (fomeType of fomeTypes) {
            player.fome.fome[fomeType].points = player.fome.fome[fomeType].points.dividedBy(fomeNerf)
        }
        player.skyrmion.pion.points = player.skyrmion.pion.points.dividedBy(effect.nerf)
        player.skyrmion.spinor.points = player.skyrmion.spinor.points.dividedBy(effect.nerf)
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
            player.inflaton.researchProgress = player.inflaton.researchProgress.plus(buyableEffect('inflaton', 12).times(delta))
            if(player.inflaton.researchProgress.gte(temp.inflaton.research[player.inflaton.researchQueue[0]].cost)) {
                player.inflaton.research.push(player.inflaton.researchQueue.shift())
                player.inflaton.researchProgress = decimalZero
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
                return Decimal.pow(0.975, amount)
            },
            effectDisplay(effect) { return `${formatSmall(effect)}x` },
            cost(amount) { return Decimal.pow(1.1, amount).times(1e30) },
            currencyDisplayName: 'Subspatial Foam',
            currencyLocation() { return player.fome.fome.subspatial },
            size() { return decimalOne },
            unlocked() { return hasUpgrade('inflaton', 11) }
        }),
        12: createInflatonBuilding(12, {
            title: 'Quantum Flux Analyzer',
            description: 'Study fluctuations in the quantum field',
            effect(amount) { return amount },
            effectDisplay(effect) { return `+${formatWhole(effect)} research points/s` },
            cost(amount) {
                let base = hasResearch('inflaton', 3) ? 1.5 : 15
                return Decimal.pow(base, amount).times(1e30)
            },
            currencyDisplayName: 'Subspatial Foam',
            currencyLocation() { return player.fome.fome.subspatial },
            size() { return decimalOne },
            unlocked() { return hasUpgrade('inflaton', 12) }
        }),
        13: createInflatonBuilding(13, {
            title: 'Inflaton Containment Unit',
            description: 'Specialized storage facilities designed to keep Inflatons separated and inert',
            effect(amount) { return Decimal.pow(500, amount) },
            effectDisplay(effect) { return `Store ${formatWhole(effect)}x more Inflatons`},
            cost(amount) { return Decimal.pow(1.2, amount).times(1e15) },
            currencyDisplayName: 'Quantum Foam',
            currencyLocation() { return player.fome.fome.quantum },
            size() { return new Decimal(3) },
            unlocked() { return hasResearch('inflaton', 6) }
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
            description: 'You can stabilize the universe at double the sizew',
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
            title: 'Kendric-Yan Counter Cycling',
            description: 'Gain up to 1e6x more Foam, based on your current Inflatons',
            cost: new Decimal(500),
            effect: new Decimal(1e6),
            requires: [2],
            row: 3,
            pos: 1
        },
        5: {
            title: 'Distributed Analysis Framework',
            description: 'Each Quantum Flux Analyzer increases Research Point gain by 50%',
            cost: new Decimal(1500),
            effect() { return Decimal.pow(1.5, getBuyableAmount('inflaton', 12)) },
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
            fillStyle() { return { "backgroundColor": temp.inflaton.color } }
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
                    ["display-text", () => `You are producing <h3 style='color:${layers[layer].color};text-shadow:${layers[layer].color} 0px 0px 10px;'>${buyableEffect('inflaton', 12)}</h3> research points per second`],
                    "blank",
                    ["bar", "research"],
                    "blank",
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
        cost() { return data.cost(getBuyableAmount('inflaton', id)) },
        effect() { return data.effect(getBuyableAmount('inflaton', id)) },
        display() { return `<br>${data.description}<br><b>Size: </b>${formatLength(temp.inflaton.buyables[id].size)}<br><b>Amount:</b> ${formatWhole(getBuyableAmount('inflaton', id))}<br><b>Current Effect: </b>${data.effectDisplay(temp.inflaton.buyables[id].effect)}<br><b>Cost:</b> ${format(temp.inflaton.buyables[id].cost)} ${data.currencyDisplayName}` },
        canAfford() { return player.inflaton.size.plus(temp.inflaton.buyables[id].size).lte(player.inflaton.maxSize) && currencyLocation()[currencyInternalName].gte(temp.inflaton.buyables[id].cost) },
        buy() {
            setBuyableAmount('inflaton', id, getBuyableAmount('inflaton', id).plus(1))
            currencyLocation()[currencyInternalName] = currencyLocation()[currencyInternalName].minus(temp.inflaton.buyables[id].cost)
            player.inflaton.size = player.inflaton.size.plus(temp.inflaton.buyables[id].size)
        },
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
        let index = research.row*10 + research.pos

        clickables[index] = {
            display() {
                return `<h3>${research.title}</h3><br>${research.description}<br><b>Cost:</b> ${formatWhole(research.cost)} Research Points`
            },
            unlocked() {
                if (hasResearch('inflaton', index)) return true
                if (research.requires) {
                    for (let requirement of research.requires) {
                        let researchReq = temp.inflaton.research[requirement]
                        let reqIndex = researchReq.row*10 + researchReq.pos
                        if (!temp.inflaton.clickables[reqIndex].canClick)
                            return false
                    }
                }
                return true
            },
            canClick() {
                if (hasResearch('inflaton', index)) return false
                if (research.requires) {
                    for (let requirement of research.requires) {
                        if (!hasResearch('inflaton', requirement))
                            return false
                    }
                }
                return true
            },
            onClick() {
                if (player.inflaton.researchQueue.length >= temp.inflaton.queueSize) return
                if (player.inflaton.researchQueue.includes(id)) return
                if (player.inflaton.research.includes(id)) return
                player.inflaton.researchQueue.push(id)
            },
            style() {
                let style = { "margin": "10px" }
                if (player.inflaton.research.includes(id))
                    style["background-color"] = "#77bf5f"
                return style
            },
            research: id
        }
    }

    return clickables
}

function hasResearch(layer, id) {
    return player[layer].research.includes(toNumber(id)) || player[layer].research.includes(String(id))
}

function researchEffect(layer, id) {
    return temp[layer].research[id].effect
}