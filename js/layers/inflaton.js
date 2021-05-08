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
        actual: decimalZero,
        inflating: false,
    }},

    effect() {
        if (player.inflaton.points.gt(1)) {
            let inflatonLog = 10
            let inflatonDiv = 10
            let nerfFactor = decimalOne.times(buyableEffect('inflaton', 11)).plus(1)

            let inflatonNerf = Decimal.pow(nerfFactor, player.inflaton.points.log10())
            let inflatonGain = player.inflaton.points.times(Decimal.pow(2, player.inflaton.points.log(inflatonLog).plus(1).dividedBy(inflatonDiv)))

            return {
                gain: inflatonGain,
                nerf: inflatonNerf
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
        if (player.inflaton.best.gt(1)) {
            return player.inflaton.best.log(2).log(2)
        }
        return decimalZero
    },

    update(delta) {
        let max = new Decimal('10^^1e308')

        let effect = temp.inflaton.effect
        
        if (effect.gain.lt(max)) player.inflaton.points = player.inflaton.points.plus(effect.gain.times(delta))
        else player.inflaton.points = max

        if (player.inflaton.points.gt(player.inflaton.best)) player.inflaton.best = player.inflaton.points

        for (fomeType of fomeTypes)
            player.fome.fome[fomeType].points = player.fome.fome[fomeType].points.dividedBy(effect.nerf)
        player.skyrmion.pion.points = player.skyrmion.pion.points.dividedBy(effect.nerf)
        player.skyrmion.spinor.points = player.skyrmion.spinor.points.dividedBy(effect.nerf)
        if (player.inflaton.unlockOrder > 0) {
            player.acceleron.points = player.acceleron.points.dividedBy(effect.nerf)
            player.timecube.points = player.timecube.points.dividedBy(effect.nerf)
        }

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
            unlocked() { return player.inflaton.points.eq(1) || inChallenge('inflaton', this.id) },
            onEnter() {
                player.inflaton.inflating = true
                player.inflaton.actual = player.inflaton.points
                player.inflaton.points = player.inflaton.points.plus(1)
            },
            onExit() {
                player.inflaton.inflating = false
                player.inflaton.points = player.inflaton.actual
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
            cost: new Decimal(2e16),
            currencyDisplayName: 'Quantum Foam',
            currencyInternalName: 'points',
            currencyLocation() { return player.fome.fome.quantum },
            unlocked() { return hasUpgrade('inflaton', 11) || (!player.inflaton.inflating && player.inflaton.best.gt(1)) }
        }
    },

    buyables: {
        respec() {
            console.log("respecced")
            for (let id in player.inflaton.buyables)
                player.inflaton.buyables[id] = decimalZero
        },
        respecConfirm: false,
        11: createInflatonBuilding(11, {
            title: 'Spin-field Condenser',
            description: 'Slightly reduce the loss of resources to Inflation',
            effect(amount) { return Decimal.pow(0.975, amount) },
            effectDisplay(effect) { return `${formatSmall(effect)}x` },
            cost: decimalOne,
            unlocked() { return hasUpgrade('inflaton', 11) }
        })
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
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text", () => `Current Universal Size: ${formatLength(temp.inflaton.size)}`],
        "blank",
        () => !hasUpgrade('inflaton', 11) ? "challenges" : '',
        () => !hasUpgrade('inflaton', 11) ? "blank" : '',
        () => !hasUpgrade('inflaton', 11) ? "upgrades" : '',
        () => hasUpgrade('inflaton', 11) ? ["microtabs", "stuff"] : ''
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } }
    },

    hotkeys: [
        {
            key: "ctrl+i",
            onPress() { if (temp.inflaton.layerShown === true) player.tab = 'inflaton' }
        }
    ]
})

function createInflatonBuilding(id, data) {
    return {
        title: data.title,
        cost: data.cost,
        effect() { return data.effect(getBuyableAmount('inflaton', id)) },
        display() { return `<br><br>${data.description}<br><br><b>Amount:</b> ${getBuyableAmount('inflaton', id)}<br><br><b>Current Effect: </b>${data.effectDisplay(temp.inflaton.buyables[id].effect)}<br><br><b>Cost:</b> ${format(temp.inflaton.buyables[id].cost)}` },
        canAfford() { return player.inflaton.best.gte(temp.inflaton.buyables[id].cost) },
        buy() { setBuyableAmount('inflaton', id, getBuyableAmount('inflaton', id).plus(1)) }
    }
}