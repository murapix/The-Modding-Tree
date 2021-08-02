addLayer("timecube", {
    name: "Time Cubes",
    symbol: "T",
    row: 2,
    position: 1,
    branches: ['acceleron'],

    layerShown() { return temp.timecube.paused ? false : (hasMilestone('entangled', 0) || isLoopFinished(2)) },
    paused() { return player.universeTab !== "none" },
    resource() { return player[this.layer].points.equals(1) ? "Time Cube" : "Time Cubes" },
    color: "#f037ea",
    type: "none",

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
            effect() { return player.acceleron.points.max(0).plus(1).log10() },
            effectDisplay() { return `${format(upgradeEffect('timecube', 11))}x` }
        },
        12: {
            title: 'Time',
            description: 'log10(Best Time Cubes) increases Acceleron effect',
            cost: new Decimal(2),
            effect() { return player.timecube.best.max(0).plus(1).log10().plus(1) },
            effectDisplay() { return `${format(upgradeEffect('timecube', 12))}x` },
            unlocked() { return hasUpgrade('timecube', 11) || hasUpgrade('timecube', this.id) }
        },
        13: {
            title: 'Tier',
            description: 'Each upgrade in this row gives a free level of every Foam Boost',
            cost: new Decimal(3),
            effect() { return [11,12,13,14,15].map(id => hasUpgrade('timecube', id) ? 1 : 0).reduce(Decimal.plus) },
            effectDisplay() { return `+${formatWhole(upgradeEffect('timecube', 13))} free levels` },
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
        },
        21: {
            title: 'Twice',
            description: 'Double maximum entropy',
            cost: new Decimal(2500),
            effect: new Decimal(2),
            onPurchase() {
                player.acceleron.entropy = player.acceleron.entropy.plus(temp.acceleron.entropy)
            },
            unlocked() { return hasUpgrade('timecube', 15) || hasUpgrade('timecube', this.id) }
        },
        22: {
            title: 'Twist',
            description: 'You may select an additional first row Entropic Enhancement',
            effect: 1,
            cost: new Decimal(4e8),
            unlocked() { return hasUpgrade('timecube', 21) || hasUpgrade('timecube', this.id) }
        },
        23: {
            title: 'Ten',
            description: 'Increase Entropic Loop build speed by 10,000x',
            effect: new Decimal(10000),
            cost: new Decimal(5e8),
            unlocked() { return hasUpgrade('timecube', 22) || hasUpgrade('timecube', this.id) }
        },
        24: {
            title: 'Twirl',
            description: 'You may select an additional fourth row Entropic Enhancement',
            effect: 1,
            cost: new Decimal(1.25e9),
            unlocked() { return hasUpgrade('timecube', 23) || hasUpgrade('timecube', this.id) }
        },
        25: {
            title: 'Tetrate',
            description: 'Unlock the fourth column of Entropic Enhancements',
            cost: new Decimal(5e9),
            unlocked() { return hasUpgrade('timecube', 24) || hasUpgrade('timecube', this.id) }
        }
    },

    tabFormat: [
        "main-display",
        "blank",
        () => hasUpgrade('timecube', 31) ? ["microtabs", "stuff"] : "upgrades"
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
