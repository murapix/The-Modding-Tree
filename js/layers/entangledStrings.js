addLayer("entangled", {
    name: "Entangled Strings",
    symbol: "E",
    row: 3,
    position: 0,
    branches: ['acceleron', 'inflaton'],

    layerShown() { return player.entangled.unlocked },
    resource() { return player.entangled.points.equals(1) ? "Entangled String" : "Entangled Strings" },
    color: "#9a4500",
    type: "custom",
    getResetGain() { return (player.acceleron.points.gte(temp.entangled.nextAt.acceleron) && temp.inflaton.storage.gte(temp.entangled.nextAt.inflaton)) ? decimalOne : decimalZero },
    getNextAt() {
        let points = player.entangled.points.min(2).toNumber()
        return {
            acceleron: temp.entangled.acceleronRequirements[points],
            inflaton: temp.entangled.inflatonRequirements[points]
        }
    },
    acceleronRequirements: [
        new Decimal(1e19), new Decimal(1e29), new Decimal("10^^1e308")
    ],
    inflatonRequirements: [
        new Decimal("1e30000"), new Decimal("1e30000"), new Decimal("10^^1e308")
    ],

    prestigeButtonText() {
        return `Extract ${formatWhole(temp.entangled.getResetGain)} Entangled String${temp.entangled.getResetGain.eq(1) ? `` : `s`}<br><br>Requires:<br>${format(temp.entangled.nextAt.acceleron)} Accelerons<br>${format(temp.entangled.nextAt.inflaton)} stored Inflatons`
    },
    canReset() {
        return temp.entangled.getResetGain.gte(1)
    },
    baseAmount() {
        return player.points
    },
    requires: decimalZero,

    doReset(layer) {
        player.acceleron.unlockOrder = 0
        player.inflaton.unlockOrder = 0
    },

    startData() {
        return {
            unlocked: false,
            points: decimalZero,
            best: decimalZero
        }
    },

    milestones: {
        0: {
            requirementDescription: "1 Entangled String",
            effectDescription: "Accelerons and Inflatons no longer inflate each other's costs<br>Start with a row of Inflaton research for each Entangled String",
            done() { return player.entangled.points.gte(1) }
        },
        1: {
            requirementDescription: "2 Entangled Strings",
            effectDescription: "Start with a completed Entropic Loop for each Entangled String beyond the first<br>Unlock more Acceleron and Inflaton content",
            done() { return player.entangled.points.gte(2) }
        }
    },

    tabFormat: [
        "main-display",
        "blank",
        "prestige-button",
        "blank",
        "milestones"
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } },
    },

    hotkeys: [
        {
            key: "e",
            description: "E: Entangle spacetime into another String",
            onPress() { if (canReset('entangled')) doReset('entangled') }
        },
        {
            key: "ctrl+e",
            onPress() { if (temp.entangled.layerShown === true) player.tab = 'entangled' }
        }
    ]
})
