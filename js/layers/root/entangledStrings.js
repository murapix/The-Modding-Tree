addLayer("entangled", {
    name: "Entangled Strings",
    symbol: "E",
    row: 3,
    position: 0,
    branches: ['acceleron', 'inflaton'],

    layerShown() { return temp.entangled.paused ? false : player.entangled.unlocked },
    paused() { return player.universeTab !== "none" },
    resource() { return player.entangled.points.equals(1) ? "Entangled String" : "Entangled Strings" },
    color: "#9a4500",
    type: "custom",
    getResetGain() { return (player.acceleron.points.gte(temp.entangled.nextAt.acceleron) && temp.inflaton.storage.gte(temp.entangled.nextAt.inflaton)) ? decimalOne : decimalZero },
    getNextAt() {
        if (player.entangled.points.eq(0)) return { acceleron: new Decimal(1e19), inflaton: new Decimal("1e12000") }
        if (player.entangled.points.eq(1)) return { acceleron: new Decimal(1e29), inflaton: new Decimal("1e30000") }

        let numUpgrades = [13, 23, 31, 32, 33].map(id => hasUpgrade('inflaton', id)).reduce((a,b) => a+b)
        if (player.entangled.points.gt(numUpgrades+1)) return { acceleron: Decimal.dInf, inflaton: Decimal.dInf }

        let points = (hasUpgrade('inflaton', 13) ? 1 : 0) + (hasUpgrade('inflaton', 23) ? 2 : 0) + (hasUpgrade('inflaton', 31) ? 4 : 0) + (hasUpgrade('inflaton', 32) ? 8 : 0) + (hasUpgrade('inflaton', 33) ? 16 : 0)

        return {
            acceleron: temp.entangled.acceleronRequirements[points].times(buyableEffect('skyrmion', 142)),
            inflaton: temp.entangled.inflatonRequirements[points].times(buyableEffect('skyrmion', 242)).pow10()
        }
    },
    acceleronRequirements: [
        new Decimal(1e29), new Decimal(1.5e41), Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf
    ],
    inflatonRequirements: [
        new Decimal(3e4), new Decimal(8.5e12), Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf,
        Decimal.dInf, Decimal.dInf, Decimal.dInf, Decimal.dInf
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
            effectDescription: "Unlock more Acceleron and Inflaton content<br>Keep Skyrmion upgrades and Foam milestones",
            done() { return player.entangled.points.gte(2) }
        },
        2: {
            requirementDescription: "3 Entangled Strings",
            effectDescription: "Keep all parallel research and research queue researches",
            done() { return player.entangled.points.gte(3) }
        },
        6: {
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
