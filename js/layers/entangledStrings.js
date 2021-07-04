addLayer("entangled", {
    name: "Entangled Strings",
    symbol: "E",
    row: 3,
    position: 0,
    branches: ['acceleron', 'inflaton'],

    isUpdated() { return !hasMilestone('entangled', 2) },
    layerShown() { return player.entangled.unlocked && temp.entangled.isUpdated },
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
        new Decimal(1e19), new Decimal(1e29), Decimal.dInf
    ],
    inflatonRequirements: [
        new Decimal("1e30000"), new Decimal("1e30000"), Decimal.dInf
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
            effectDescription: "Accelerons and Inflatons no longer inflate each other's costs",
            done() { return player.entangled.points.gte(1) }
        },
        1: {
            requirementDescription: "2 Entangled Strings",
            effectDescription: "Unlock more Acceleron and Inflaton content",
            done() { return player.entangled.points.gte(2) }
        },
        2: {
            requirementDescription: "7 Entangled Strings",
            effectDescription: "Unlock Fundamental Particles",
            done() { return player.entangled.points.gte(7) }
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
