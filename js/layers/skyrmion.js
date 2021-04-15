addLayer("skyrmion", {
    name: "Skyrmion",
    symbol: "S",
    row: 0,
    position: 0,

    layerShown() { return true },
    resource() { return player.skyrmion.points.equals(1) ? "Skyrmion" : "Skyrmions" },
    color: "#37d7ff",
    type: "static",
    baseResource: "Pions and Spinors",
    baseAmount() { return Decimal.min(player.skyrmion.pion.points, player.skyrmion.spinor.points) },
    requires: new Decimal(1),
    canBuyMax() { return true },
    base: 10,
    exponent: 1,
    gainMult() {
        let fomeBoost = temp.fome.effect.boosts ? temp.fome.effect.boosts.total.infitesimal[3].times(0.5).plus(1) : 1
        return buyableEffect('skyrmion', 211).times(fomeBoost).recip()
    },
    doReset(layer) {
        if (layer != 'skyrmion') {
            let keep = []
            layerDataReset('skyrmion', keep)
            player.skyrmion = startData()
        }
        else {
            player.skyrmion.pion.points = player.skyrmion.pion.points.minus(temp.skyrmion.nextAt)
            player.skyrmion.spinor.points = player.skyrmion.spinor.points.minus(temp.skyrmion.nextAt)
        }
    },
    autoPrestige() { return hasUpgrade('skyrmion', 1) },

    effect() {
        let fomeBoosts = temp.fome.effect.boosts

        let skyrmions = player.skyrmion.points.plus(fomeBoosts ? fomeBoosts.total.subspatial[3] : 0)
        let pion = {
            alpha: buyableEffect('skyrmion', 111),
            beta: buyableEffect('skyrmion', 112),
            gamma: buyableEffect('skyrmion', 113)
        }
        let spinor = {
            beta: buyableEffect('skyrmion', 212),
            gamma: buyableEffect('skyrmion', 213),
            zeta: buyableEffect('skyrmion', 223)
        }

        let fomeBoost = fomeBoosts ? fomeBoosts.total.infitesimal[1].times(0.5).plus(1) : 1
        let fomeCount = fomeBoosts ? fomeBoosts.total.subspatial[1] : 0

        let eff = {
            pion: {
                gen: skyrmions.times(0.01).times(pion.alpha).times(spinor.gamma).times(fomeBoost).times(spinor.zeta),
                costNerf: Decimal.pow(player.skyrmion.spinor.upgrades.minus(fomeCount).times(0.2).times(spinor.beta).plus(1), player.skyrmion.spinor.upgrades.minus(fomeCount).times(0.25))
            },
            spinor: {
                gen: skyrmions.times(0.01).times(pion.alpha).times(pion.gamma).times(fomeBoost).times(spinor.zeta),
                costNerf: Decimal.pow(player.skyrmion.pion.upgrades.minus(fomeCount).times(0.2).times(pion.beta).plus(1), player.skyrmion.pion.upgrades.minus(fomeCount).times(0.25))
            }
        }
        return eff
    },
    effectDescription() {
        let eff = temp.skyrmion.effect
        return `which ${player.skyrmion.points.equals(1) ? "is" : "are"} producing <h3 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>${format(eff.pion.gen)}</h3> Pions/s and <h3 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>${format(eff.spinor.gen)}</h3> Spinors/s`
    },
    
    startData() { return {
        unlocked: true,
		points: new Decimal(1),
        pion: {
            points: new Decimal(0),
            upgrades: new Decimal(0)
        },
        spinor: {
            points: new Decimal(0),
            upgrades: new Decimal(0)
        }
    }},

    update(delta) {
        let eff = temp.skyrmion.effect
        player.skyrmion.pion.points = player.skyrmion.pion.points.plus(eff.pion.gen.times(delta))
        player.skyrmion.spinor.points = player.skyrmion.spinor.points.plus(eff.spinor.gen.times(delta))

        if (player.skyrmion.autobuyPion) {
            if (hasUpgrade('skyrmion', 2)) buyBuyable('skyrmion', 111)
            if (hasUpgrade('skyrmion', 3)) buyBuyable('skyrmion', 112)
            if (hasUpgrade('skyrmion', 4)) buyBuyable('skyrmion', 113)
            if (hasUpgrade('skyrmion', 5)) buyBuyable('skyrmion', 121)
            if (hasUpgrade('skyrmion', 6)) buyBuyable('skyrmion', 122)
            if (hasUpgrade('skyrmion', 7)) buyBuyable('skyrmion', 123)
            if (hasUpgrade('skyrmion', 8)) buyBuyable('skyrmion', 124)
            if (hasUpgrade('skyrmion', 9)) buyBuyable('skyrmion', 131)
            if (hasUpgrade('skyrmion', 10)) buyBuyable('skyrmion', 132)
            if (hasUpgrade('skyrmion', 11)) buyBuyable('skyrmion', 133)
        }
        if (player.skyrmion.autobuySpinor) {
            if (hasUpgrade('skyrmion', 2)) buyBuyable('skyrmion', 211)
            if (hasUpgrade('skyrmion', 3)) buyBuyable('skyrmion', 212)
            if (hasUpgrade('skyrmion', 4)) buyBuyable('skyrmion', 213)
            if (hasUpgrade('skyrmion', 5)) buyBuyable('skyrmion', 221)
            if (hasUpgrade('skyrmion', 6)) buyBuyable('skyrmion', 222)
            if (hasUpgrade('skyrmion', 7)) buyBuyable('skyrmion', 223)
            if (hasUpgrade('skyrmion', 8)) buyBuyable('skyrmion', 224)
            if (hasUpgrade('skyrmion', 9)) buyBuyable('skyrmion', 231)
            if (hasUpgrade('skyrmion', 10)) buyBuyable('skyrmion', 232)
            if (hasUpgrade('skyrmion', 11)) buyBuyable('skyrmion', 233)
        }
    },

    upgrades: {
        0: {
            title: 'Condensation',
            description: 'Begin Foam generation',
            cost: new Decimal(10),
            onPurchase() { player.fome.unlocked = true },
            pay() {}
        },
        1: {
            unlocked() { return player.skyrmion.points.gte(12) },
            title: 'Reformation',
            description: `Automatically gain Skyrmions; they don't cost Pions or Spinors`,
            cost: new Decimal(16),
            pay() {}
        },
        2: {
            unlocked() { return player.skyrmion.points.gte(20) },
            title: 'Alteration',
            description: `Unlock the Pion and Spinor Upgrade autobuyers and let them autobuy <b>α</b> upgrades. <b>α</b> upgrades no longer cost Pions or Spinors`,
            cost: new Decimal(24),
            pay() {}
        },
        3: {
            unlocked() { return player.skyrmion.points.gte(25) },
            title: 'Benediction',
            description: `Allow the autobuyers to buy <b>β</b> upgrades. <b>β</b> upgrades no longer cost Pions or Spinors`,
            cost: new Decimal(28),
            pay() {}
        },
        4: {
            unlocked() { return player.skyrmion.points.gte(30) },
            title: 'Consolidation',
            description: `Allow the autobuyers to buy <b>γ</b> upgrades. <b>γ</b> upgrades no longer cost Pions or Spinors`,
            cost: new Decimal(32),
            pay() {}
        },
        5: {
            unlocked() { return player.skyrmion.points.gte(35) },
            title: 'Diversification',
            description: `Allow the autobuyers to buy <b>δ</b> upgrades. <b>δ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(36),
            pay() {}
        },
        6: {
            unlocked() { return player.skyrmion.points.gte(40) },
            title: 'Encapsulation',
            description: `Allow the autobuyers to buy <b>ε</b> upgrades. <b>ε</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(42),
            pay() {}
        },
        7: {
            unlocked() { return player.skyrmion.points.gte(45) },
            title: 'Fabrication',
            description: `Allow the autobuyers to buy <b>ζ</b> upgrades. <b>ζ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(48),
            pay() {}
        },
        8: {
            unlocked() { return player.skyrmion.points.gte(50) },
            title: 'Germination',
            description: `Allow the autobuyers to buy <b>η</b> upgrades. <b>η</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(52),
            pay() {}
        },
        9: {
            unlocked() { return player.skyrmion.points.gte(55) },
            title: 'Hesitation',
            description: `Allow the autobuyers to buy <b>θ</b> upgrades. <b>θ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(56),
            pay() {}
        },
        10: {
            unlocked() { return player.skyrmion.points.gte(60) },
            title: 'Immitation',
            description: `Allow the autobuyers to buy <b>ι</b> upgrades. <b>ι</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(64),
            pay() {}
        },
        11: {
            unlocked() { return player.skyrmion.points.gte(65) },
            title: 'Juxtaposition',
            description: `Allow the autobuyers to buy <b>κ</b> upgrades. <b>κ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(69),
            pay() {}
        }
    },

    milestonePopups: false,
    milestones: {
        0: {
            requirementDescription: 'Autobuy Pion Upgrades',
            effectDescription: '',
            unlocked() { return this.done() },
            done() { return hasUpgrade('skyrmion', 2) },
            toggles: [['skyrmion', 'autobuyPion']]
        },
        1: {
            requirementDescription: 'Autobuy Spinor Upgrades',
            effectDescription: '',
            unlocked() { return this.done() },
            done() { return hasUpgrade('skyrmion', 2) },
            toggles: [['skyrmion', 'autobuySpinor']]
        }
    },

    buyables: {
        rows: 5,
        cols: 4,
        111: createSkyrmionBuyable('α', 111,
                (amount) => (amount.lt(25) ? Decimal.pow(1.2, amount).dividedBy(10) : Decimal.pow(15, amount).dividedBy(2e26)).times(Decimal.pow(0.8, getTotalFomeBoost('infitesimal', 2))),
                `Gain 50% more Pions and Spinors`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.5, amount),
                () => getTotalFomeBoost('protoversal', 1),
                undefined,
                () => hasUpgrade('skyrmion', 2)),
        112: createSkyrmionBuyable('β', 112,
                (amount) => (amount.lt(15) ? Decimal.pow(1.3, amount).dividedBy(10).plus(0.9) : Decimal.pow(19.5, amount).dividedBy(1e15)),
                `Reduce the nerf to Spinor upgrade cost by 10%`,
                (effect) => `Spinor upgrade cost nerf reduced by ${format(Decimal.sub(1, effect).times(100))}%`,
                (amount) => Decimal.pow(0.9, amount),
                () => getTotalFomeBoost('protoversal', 2)),
        113: createSkyrmionBuyable('γ', 113,
                (amount) => (amount.lt(10) ? Decimal.pow(1.7, amount).dividedBy(10).plus(4.9) : Decimal.pow(25, amount).dividedBy(1e11)).times(Decimal.pow(0.8, getTotalFomeBoost('infitesimal', 4))),
                `Gain 75% more Spinors`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.75, amount),
                () => getTotalFomeBoost('protoversal', 3)),
        121: createSkyrmionBuyable('δ', 121,
                (amount) => Decimal.pow(15, amount).times(30),
                `Gain 70% more Protoversal Foam from Skyrmions`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.7, amount),
                () => Decimal.times(getTotalFomeBoost('subplanck', 1), 0.5),
                () => player.fome.boosts.protoversal.boosts[0].gte(1)),
        122: createSkyrmionBuyable('ε', 122,
                (amount) => Decimal.pow(12, amount).times(50),
                `Increase Protoversal Foam gain by 50% per order of magnitude of Infitesimal Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.infitesimal.points.plus(1).log10().times(amount).times(0.5).plus(1),
                () => Decimal.times(getTotalFomeBoost('subplanck', 2), 0.5),
                () => player.fome.fome.infitesimal.expansion.gte(1)),
        123: createSkyrmionBuyable('ζ', 123,
                (amount) => Decimal.pow(14, amount).times(2e4),
                `Increase Subspatial Foam gain by 5% per Skyrmion`,
                (effect) => `${format(effect)}x`,
                (amount) => player.skyrmion.points.plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.subspatial[3] : 0).times(amount).times(0.05).plus(1),
                () => Decimal.times(getTotalFomeBoost('subplanck', 3), 0.5),
                () => player.fome.fome.subspatial.expansion.gte(1)),
        124: createSkyrmionBuyable('η', 124,
                (amount) => Decimal.pow(12, amount).times(3e6),
                `Gain a free level of <b>Spinor Upgrade ε</b>`,
                (effect) => `${format(effect)} free levels`,
                (amount) => amount,
                () => Decimal.times(getTotalFomeBoost('subplanck', 4), 0.5),
                () => player.fome.fome.protoversal.expansion.gte(2)),
        131: createSkyrmionBuyable('θ', 131,
                (amount) => Decimal.pow(13, amount).times(1e7),
                `Increase Protoversal Foam gain by 100% per order of magnitude of Subspatial Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.subspatial.points.plus(1).log10().times(amount).plus(1),
                () => getTotalFomeBoost('quantum', 1).times(0.25),
                () => player.fome.fome.subplanck.expansion.gte(1)),
        132: createSkyrmionBuyable('ι', 132,
                (amount) => Decimal.pow(15, amount).times(2e14),
                `Your Spinors increase Infitesimal Foam generation by 2% per order of magnitude`,
                (effect) => `${format(effect)}x`,
                (amount) => player.skyrmion.spinor.points.plus(1).log10().times(amount).times(0.02).plus(1),
                () => getTotalFomeBoost('quantum', 2).times(0.25),
                () => player.fome.fome.protoversal.expansion.gte(3)),
        133: createSkyrmionBuyable('κ', 133,
                (amount) => Decimal.pow(13.5, amount).times(5e17),
                `Protoversal Boost 1 levels increase other Foam Boost 1 effects by 30%`,
                (effect) => `${format(effect)}x`,
                (amount) => amount.times(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[0] : 0).times(0.3).plus(1),
                () => getTotalFomeBoost('quantum', 3).times(0.25),
                () => player.fome.fome.infitesimal.expansion.gte(2)),
        134: {
            unlocked() { return false },
            title: "Pion Upgrade λ"
        },
        141: {
            unlocked() { return false },
            title: "Pion Upgrade μ"
        },
        142: {
            unlocked() { return false },
            title: "Pion Upgrade ν"
        },
        143: {
            unlocked() { return false },
            title: "Pion Upgrade ξ"
        },
        144: {
            unlocked() { return false },
            title: "Pion Upgrade ο"
        },
        151: {
            unlocked() { return false },
            title: "Pion Upgrade π"
        },
        152: {
            unlocked() { return false },
            title: "Pion Upgrade ρ"
        },
        153: {
            unlocked() { return false },
            title: "Pion Upgrade σ"
        },
        154: {
            unlocked() { return false },
            title: "Pion Upgrade τ"
        },
        114: {
            unlocked() { return false },
            title: "Pion Upgrade υ"
        },
        115: {
            unlocked() { return false },
            title: "Pion Upgrade φ"
        },
        125: {
            unlocked() { return false },
            title: "Pion Upgrade χ"
        },
        135: {
            unlocked() { return false },
            title: "Pion Upgrade ψ"
        },
        145: {
            unlocked() { return false },
            title: "Pion Upgrade ω"
        },
        211: createSkyrmionBuyable('α', 211,
                (amount) => (amount.lt(25) ? Decimal.pow(1.2, amount).dividedBy(10) : Decimal.pow(15, amount).dividedBy(2e26)).times(Decimal.pow(0.8, getTotalFomeBoost('infitesimal', 2))),
                `Gain 50% more Skyrmions`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.5, amount),
                () => getTotalFomeBoost('protoversal', 1)),
        212: createSkyrmionBuyable('β', 212,
                (amount) => (amount.lt(15) ? Decimal.pow(1.3, amount).dividedBy(10).plus(0.9) : Decimal.pow(19.5, amount).dividedBy(1e15)),
                `Reduce the nerf to Pion upgrade cost by 10%`,
                (effect) => `Pion upgrade cost nerf reduced by ${format(Decimal.sub(1, effect).times(100))}%`,
                (amount) => Decimal.pow(0.9, amount),
                () => getTotalFomeBoost('protoversal', 2)),
        213: createSkyrmionBuyable('γ', 213,
                (amount) => (amount.lt(10) ? Decimal.pow(1.7, amount).dividedBy(10).plus(4.9) : Decimal.pow(25, amount).dividedBy(1e11)).times(Decimal.pow(0.8, getTotalFomeBoost('infitesimal', 4))),
                `Gain 75% more Pions`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.75, amount),
                () => getTotalFomeBoost('protoversal', 3)),
        221: createSkyrmionBuyable('δ', 221,
                (amount) => Decimal.pow(15, amount).times(30),
                `Gain 70% more Protoversal Boost 1 effect`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.7, amount),
                () => getTotalFomeBoost('subplanck', 1).times(0.5),
                () => player.fome.boosts.protoversal.boosts[0].gte(1)
        ),
        222: createSkyrmionBuyable('ε', 222,
                (amount) => Decimal.pow(12, amount).times(50),
                `Increase Infitesimal Foam gain by 50% per order of magnitude of Protoversal Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.protoversal.points.plus(1).log10().times(amount).plus(1),
                () => getTotalFomeBoost('subplanck', 2).times(0.5).plus(buyableEffect('skyrmion', 124)),
                () => player.fome.fome.infitesimal.expansion.gte(1)),
        223: createSkyrmionBuyable('ζ', 223,
                (amount) => Decimal.pow(14, amount).times(2e4),
                `Increase Pion and Spinor gain by 30% per order of magnitude of Subspatial Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.subspatial.points.plus(1).log10().times(amount).times(0.3).plus(1),
                () => getTotalFomeBoost('subplanck', 3).times(0.5),
                () => player.fome.fome.subspatial.expansion.gte(1)),
        224: createSkyrmionBuyable('η', 224,
                (amount) => Decimal.pow(12, amount).times(3e6),
                `Gain 120% increased Foam generation`,
                (effect) => `${format(effect)}x`,
                (amount) => amount.times(1.2).plus(1),
                () => getTotalFomeBoost('subplanck', 4).times(0.5),
                () => player.fome.fome.protoversal.expansion.gte(2)),
        231: createSkyrmionBuyable('θ', 231,
                (amount) => Decimal.pow(13, amount).times(1e7),
                `Increase Subspatial Foam gain by 30% per order of magnitude of Protoversal and Infitesimal Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.protoversal.points.plus(1).log10().plus(player.fome.fome.infitesimal.points.plus(1).log10()).times(amount).times(0.3).plus(1),
                () => getTotalFomeBoost('quantum', 1).times(0.25),
                () => player.fome.fome.subplanck.expansion.gte(1)),
        232: createSkyrmionBuyable('ι', 232,
                (amount) => Decimal.pow(15, amount).times(2e14),
                `Your Pions increase Infitesimal Foam generation by 2% per order of magnitude`,
                (effect) => `${format(effect)}x`,
                (amount) => player.skyrmion.pion.points.plus(1).log10().times(amount).times(0.02).plus(1),
                () => getTotalFomeBoost('quantum', 2).times(0.25),
                () => player.fome.fome.protoversal.expansion.gte(3)),
        233: createSkyrmionBuyable('κ', 233,
                (amount) => Decimal.pow(13.5, amount).times(5e17),
                `Increase Subplanck Boost 1 effect by 40% per order of magnitude of Subplanck Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.subplanck.points.plus(1).log10().times(amount).times(0.4).plus(1),
                () => getTotalFomeBoost('quantum', 3).times(0.25),
                () => player.fome.fome.infitesimal.expansion.gte(2)),
        234: {
            unlocked() { return false },
            title: "Spinor Upgrade λ"
        },
        241: {
            unlocked() { return false },
            title: "Spinor Upgrade μ"
        },
        242: {
            unlocked() { return false },
            title: "Spinor Upgrade ν"
        },
        243: {
            unlocked() { return false },
            title: "Spinor Upgrade ξ"
        },
        244: {
            unlocked() { return false },
            title: "Spinor Upgrade ο"
        },
        251: {
            unlocked() { return false },
            title: "Spinor Upgrade π"
        },
        252: {
            unlocked() { return false },
            title: "Spinor Upgrade ρ"
        },
        253: {
            unlocked() { return false },
            title: "Spinor Upgrade σ"
        },
        254: {
            unlocked() { return false },
            title: "Spinor Upgrade τ"
        },
        214: {
            unlocked() { return false },
            title: "Spinor Upgrade υ"
        },
        215: {
            unlocked() { return false },
            title: "Spinor Upgrade φ"
        },
        225: {
            unlocked() { return false },
            title: "Spinor Upgrade χ"
        },
        235: {
            unlocked() { return false },
            title: "Spinor Upgrade ψ"
        },
        245: {
            unlocked() { return false },
            title: "Spinor Upgrade ω"
        }
    },

    microtabs: {
        stuff: {
            "Skyrmions": {
                shouldNotify() {
                    if (player.tab == "skyrmion" && player.subtabs.skyrmion.stuff == "Skyrmions")
                        return false
                    for(let index = 0; index <= 11; index++) {
                        if (temp.skyrmion.upgrades[index].unlocked && temp.skyrmion.upgrades[index].canAfford)
                            return true
                    }
                    return false
                },
                content: [
                    "blank",
                    () => hasMilestone('skyrmion', 0) ? ["row", [["milestone", 0], ["milestone", 1]]] : ``,
                    () => hasMilestone('skyrmion', 0) ? "blank" : ``,
                    ["row", [
                        ["upgrade", 0], ["upgrade", 1]
                    ]],
                    ["row", [
                        ["upgrade", 2], ["upgrade", 3], ["upgrade", 4]
                    ]],
                    ["row", [
                        ["upgrade", 5], ["upgrade", 6], ["upgrade", 7], ["upgrade", 8]
                    ]],
                    ["row", [
                        ["upgrade", 9], ["upgrade", 10], ["upgrade", 11]
                    ]]
                ]
            },
            "Pions": {
                shouldNotify() {
                    if (player.tab == "skyrmion" && player.subtabs.skyrmion.stuff == "Pions")
                        return false
                    for (let row = 1; row <= 5; row++) {
                        for(let col = 1; col <= 5 - ~~(row/5); col++) {
                            let index = 100 + 10*row + col
                            let buyable = temp.skyrmion.buyables[index]
                            if (buyable.unlocked && buyable.canAfford)
                                return true
                        }
                    }
                    return false
                },
                content: [
                    "blank",
                    ["display-text", () => `Your Spinor upgrades are increasing Pion upgrade cost by ${format(temp.skyrmion.effect.pion.costNerf.minus(1).times(100))}%`],
                    "blank",
                    ["row", [["buyable", 111], ["buyable", 112], ["buyable", 113], ["buyable", 114], ["buyable", 115]]],
                    ["row", [["buyable", 121], ["buyable", 122], ["buyable", 123], ["buyable", 124], ["buyable", 125]]],
                    ["row", [["buyable", 131], ["buyable", 132], ["buyable", 133], ["buyable", 134], ["buyable", 135]]],
                    ["row", [["buyable", 141], ["buyable", 142], ["buyable", 143], ["buyable", 144], ["buyable", 145]]],
                    ["row", [["buyable", 151], ["buyable", 152], ["buyable", 153], ["buyable", 154]]]
                    // 
                ]
            },
            "Spinors": {
                shouldNotify() {
                    if (player.tab == "skyrmion" && player.subtabs.skyrmion.stuff == "Spinors")
                        return false
                    for (let row = 1; row <= 5; row++) {
                        for(let col = 1; col <= 5 - ~~(row/5); col++) {
                            let index = 200 + 10*row + col
                            let buyable = temp.skyrmion.buyables[index]
                            if (buyable.unlocked && buyable.canAfford)
                                return true
                        }
                    }
                    return false
                },
                content: [
                    "blank",
                    ["display-text", () => `Your Pion upgrades are increasing Spinor upgrade cost by ${format(temp.skyrmion.effect.spinor.costNerf.minus(1).times(100))}%`],
                    "blank",
                    ["row", [["buyable", 211], ["buyable", 212], ["buyable", 213], ["buyable", 214], ["buyable", 215]]],
                    ["row", [["buyable", 221], ["buyable", 222], ["buyable", 223], ["buyable", 224], ["buyable", 225]]],
                    ["row", [["buyable", 231], ["buyable", 232], ["buyable", 233], ["buyable", 234], ["buyable", 235]]],
                    ["row", [["buyable", 241], ["buyable", 242], ["buyable", 243], ["buyable", 244], ["buyable", 245]]],
                    ["row", [["buyable", 251], ["buyable", 252], ["buyable", 253], ["buyable", 254]]]
                ]
            }
        }
    },

    tabFormat: [
        "main-display",
        () => temp.fome.effect.boosts && temp.fome.effect.boosts.total.subspatial[3].gte(1) ? ["display-text", `Your Subspatial Foam is granting an additional <h3 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>${format(temp.fome.effect.boosts.total.subspatial[3])}</h2> Skyrmions`] : ``,
        "prestige-button",
        "blank",
        ["display-text", () => `You have <h2 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>${format(player.skyrmion.pion.points)}</h2> Pions`],
        "blank",
        ["display-text", () => `You have <h2 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>${format(player.skyrmion.spinor.points)}</h2> Spinors`],
        "blank",
        ["microtabs", "stuff"],
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } }
    },

    hotkeys: [
        {
            key: "s",
            description: "S: Condense some Pions and Spinors for another Skyrmion",
            onPress() { if (canReset('skyrmion')) doReset('skyrmion') } 
        },
    ]
})
