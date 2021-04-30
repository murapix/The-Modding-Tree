addLayer("timecube", {
    name: "Time Cubes",
    symbol: "T",
    row: 2,
    position: 1,
    branches: ['acceleron'],

    layerShown() { return isLoopFinished(2) },
    resource() { return player[this.layer].points.equals(1) ? "Time Cube" : "Time Cubes" },
    color: "#f037ea",
    type: "none",
    effect() {
    },
    effectDescription() {
    },

    update(delta) {
        delta = Decimal.times(delta, temp.acceleron.effect)
    },

    startData() {
        return {
            unlocked: true,
            points: decimalZero,
            best: decimalZero
        }
    },

    upgrades: {
        rows: 20,
        cols: 5,
        11: {
            title: 'Tile',
            description: 'log10(Accelerons) increases Time Cube gain',
            cost: decimalOne,
            effect() { return player.acceleron.points.plus(1).log10() },
            effectDisplay() { return `${format(upgradeEffect('timecube', 11))}x` }
        },
        12: {
            title: 'Time',
            description: 'log10(Best Time Cubes) increases Acceleron effect',
            cost: new Decimal(2),
            effect() { return player.timecube.best.plus(1).log10().plus(1) },
            effectDisplay() { return `${format(upgradeEffect('timecube', 12))}x` },
            unlocked() { return hasUpgrade('timecube', 11) || hasUpgrade('timecube', this.id) }
        },
        13: {
            title: 'Tier',
            description: 'Each upgrade in this row gives a free level of every Foam Boost',
            cost: new Decimal(3),
            effect() { return [11,12,13,14,15].map(id => hasUpgrade('timecube', id) ? 1 : 0).reduce(Decimal.plus) },
            effectDisplay() { `+${formatWhole(upgradeEffect('timecube', 13))} free levels` },
            unlocked() { return hasUpgrade('timecube', 12) || hasUpgrade('timecube', this.id) }
        },
        14: {
            title: 'Tilt',
            description: 'Entropic Expansion is 50% stronger',
            cost: new Decimal(10),
            effect: new Decimal(1.5),
            unlocked() { return hasUpgrade('timecube', 13) || hasUpgrade('timecube', this.id) }
        },
        15: {
            title: 'Tiny',
            description: 'Unlock another Entropic Loop',
            cost: new Decimal(25),
            unlocked() { return hasUpgrade('timecube', 14) || hasUpgrade('timecube', this.id) }
        }
    },

    tabFormat: [
        "main-display",
        "blank",
        "buyables",
        "blank",
        "upgrades"
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } },
    },

    hotkeys: [
        {
            key: "ctrl+c",
            onPress() { if (temp.timecube.layerShown === true) player.tab = 'timecube' }
        }
    ]
})
