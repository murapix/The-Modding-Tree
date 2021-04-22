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
        let fomeBoost = temp.fome.effect.boosts ? temp.fome.effect.boosts.total.infinitesimal[3].times(0.5).plus(1) : 1
        return buyableEffect('skyrmion', 211).times(fomeBoost).recip()
    },
    doReset(layer) {
        switch (layer) {
            case "acceleron":
            case "inflaton":
                player.skyrmion.points = decimalZero
                player.skyrmion.pion.points = decimalZero
                player.skyrmion.spinor.points = decimalZero
                layerDataReset("skyrmion", ["upgrades"])
                break;
            case "skyrmion":
                if (!hasUpgrade('skyrmion', 1)) {
                    player.skyrmion.pion.points = player.skyrmion.pion.points.minus(temp.skyrmion.nextAt)
                    player.skyrmion.spinor.points = player.skyrmion.spinor.points.minus(temp.skyrmion.nextAt)
                }
                break;
            default:
                break;
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
            zeta: buyableEffect('skyrmion', 223),
            lambda: buyableEffect('skyrmion', 234)
        }

        let fomeBoost = fomeBoosts ? fomeBoosts.total.infinitesimal[1].times(0.5).plus(1) : 1
        let fomeCount = fomeBoosts ? fomeBoosts.total.subspatial[1] : 0

        let universalBoost = pion.alpha.times(fomeBoost).times(spinor.zeta).times(spinor.lambda)

        let eff = {
            pion: {
                gen: skyrmions.times(0.01).times(universalBoost).times(spinor.gamma),
                costNerf: Decimal.pow(player.skyrmion.spinor.upgrades.minus(fomeCount).times(0.2).times(spinor.beta).plus(1), player.skyrmion.spinor.upgrades.minus(fomeCount).times(0.25))
            },
            spinor: {
                gen: skyrmions.times(0.01).times(universalBoost).times(pion.gamma),
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
        delta = Decimal.times(delta, temp.acceleron.effect.time)

        let eff = temp.skyrmion.effect
        player.skyrmion.pion.points = player.skyrmion.pion.points.plus(eff.pion.gen.times(delta)).max(0)
        player.skyrmion.spinor.points = player.skyrmion.spinor.points.plus(eff.spinor.gen.times(delta)).max(0)

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
            if (hasUpgrade('skyrmion', 12)) buyBuyable('skyrmion', 134)
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
            if (hasUpgrade('skyrmion', 12)) buyBuyable('skyrmion', 234)
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
            unlocked() { return player.skyrmion.points.gte(12) || hasUpgrade('skyrmion', 1) },
            title: 'Reformation',
            description: `Automatically gain Skyrmions; they don't cost Pions or Spinors`,
            cost: new Decimal(16),
            pay() {}
        },
        2: {
            unlocked() { return player.skyrmion.points.gte(20) || hasUpgrade('skyrmion', 2) },
            title: 'Alteration',
            description: `Unlock the Pion and Spinor Upgrade autobuyers and let them autobuy <b>α</b> upgrades. <b>α</b> upgrades no longer cost Pions or Spinors`,
            cost: new Decimal(24),
            pay() {}
        },
        3: {
            unlocked() { return player.skyrmion.points.gte(25) || hasUpgrade('skyrmion', 3) },
            title: 'Benediction',
            description: `Allow the autobuyers to buy <b>β</b> upgrades. <b>β</b> upgrades no longer cost Pions or Spinors`,
            cost: new Decimal(28),
            pay() {}
        },
        4: {
            unlocked() { return player.skyrmion.points.gte(30) || hasUpgrade('skyrmion', 4) },
            title: 'Consolidation',
            description: `Allow the autobuyers to buy <b>γ</b> upgrades. <b>γ</b> upgrades no longer cost Pions or Spinors`,
            cost: new Decimal(32),
            pay() {}
        },
        5: {
            unlocked() { return player.skyrmion.points.gte(35) || hasUpgrade('skyrmion', 5) },
            title: 'Diversification',
            description: `Allow the autobuyers to buy <b>δ</b> upgrades. <b>δ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(36),
            pay() {}
        },
        6: {
            unlocked() { return player.skyrmion.points.gte(40) || hasUpgrade('skyrmion', 6) },
            title: 'Encapsulation',
            description: `Allow the autobuyers to buy <b>ε</b> upgrades. <b>ε</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(42),
            pay() {}
        },
        7: {
            unlocked() { return player.skyrmion.points.gte(45) || hasUpgrade('skyrmion', 7) },
            title: 'Fabrication',
            description: `Allow the autobuyers to buy <b>ζ</b> upgrades. <b>ζ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(48),
            pay() {}
        },
        8: {
            unlocked() { return player.skyrmion.points.gte(50) || hasUpgrade('skyrmion', 8) },
            title: 'Germination',
            description: `Allow the autobuyers to buy <b>η</b> upgrades. <b>η</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(52),
            pay() {}
        },
        9: {
            unlocked() { return player.skyrmion.points.gte(55) || hasUpgrade('skyrmion', 9) },
            title: 'Hesitation',
            description: `Allow the autobuyers to buy <b>θ</b> upgrades. <b>θ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(56),
            pay() {}
        },
        10: {
            unlocked() { return player.skyrmion.points.gte(60) || hasUpgrade('skyrmion', 10) },
            title: 'Immitation',
            description: `Allow the autobuyers to buy <b>ι</b> upgrades. <b>ι</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(64),
            pay() {}
        },
        11: {
            unlocked() { return player.skyrmion.points.gte(65) || hasUpgrade('skyrmion', 11) },
            title: 'Juxtaposition',
            description: `Allow the autobuyers to buy <b>κ</b> upgrades. <b>κ</b> ugprades no longer cost Pions or Spinors`,
            cost: new Decimal(69),
            pay() {}
        },
        12: {
            unlocked() { return (player.skyrmion.points.gte(70) || hasUpgrade('skyrmion', 12)) && hasUpgrade('acceleron', 14) },
            title: 'Lateralization',
            description: `Allow the autobuyers to buy <b>λ</b> upgrades. <b>λ</b> upgrades no longer cost Pions or Spinors`,
            cost: new Decimal(72),
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
                [[0.1, 1.2],
                 [9.5, 15, 25],
                 [2.65e77, 187.5, 90]],
                (cost) => cost.times(Decimal.pow(0.8, getTotalFomeBoost('infinitesimal', 2))),
                `Gain 50% more Pions and Spinors`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.5, amount),
                () => getTotalFomeBoost('protoversal', 1),
                undefined,
                () => hasUpgrade('skyrmion', 2)),
        112: createSkyrmionBuyable('β', 112,
                [[0.1, 1.3],
                 [6, 19.5, 15],
                 [3.01e39, 292.5, 45]],
                (cost) => cost.plus(0.9),
                `Reduce the nerf to Spinor upgrade cost by 10%`,
                (effect) => `Spinor upgrade cost nerf reduced by ${format(Decimal.sub(1, effect).times(100))}%`,
                (amount) => Decimal.pow(0.9, amount),
                () => getTotalFomeBoost('protoversal', 2),
                undefined,
                () => hasUpgrade('skyrmion', 3)),
        113: createSkyrmionBuyable('γ', 113,
                [[0.1, 1.7],
                 [25, 25, 10],
                 [1.97e71, 367.5, 60]],
                (cost) => cost.times(Decimal.pow(0.8, getTotalFomeBoost('infinitesimal', 4))),
                `Gain 75% more Spinors`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.75, amount),
                () => getTotalFomeBoost('protoversal', 3),
                undefined,
                () => hasUpgrade('skyrmion', 4)),
        121: createSkyrmionBuyable('δ', 121,
                [[30, 15],
                 [1.1e72, 225, 60]],
                undefined,
                `Gain 70% more Protoversal Foam from Skyrmions`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.7, amount),
                () => Decimal.times(getTotalFomeBoost('subplanck', 1), 0.5),
                () => player.fome.boosts.protoversal.boosts[0].gte(1),
                () => hasUpgrade('skyrmion', 5)),
        122: createSkyrmionBuyable('ε', 122,
                [[50, 12],
                 [2.82e66, 144, 60]],
                undefined,
                `Increase Protoversal Foam gain by 50% per order of magnitude of Infinitesimal Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.infinitesimal.points.plus(1).log10().times(amount).times(0.5).plus(1),
                () => Decimal.times(getTotalFomeBoost('subplanck', 2), 0.5),
                () => player.fome.fome.infinitesimal.expansion.gte(1),
                () => hasUpgrade('skyrmion', 6)),
        123: createSkyrmionBuyable('ζ', 123,
                [[2e4, 14],
                 [1.71e73, 196, 60]],
                undefined,
                `Increase Subspatial Foam gain by 5% per Skyrmion`,
                (effect) => `${format(effect)}x`,
                (amount) => player.skyrmion.points.plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.subspatial[3] : 0).times(amount).times(0.05).plus(1),
                () => Decimal.times(getTotalFomeBoost('subplanck', 3), 0.5),
                () => player.fome.fome.subspatial.expansion.gte(1),
                () => hasUpgrade('skyrmion', 7)),
        124: createSkyrmionBuyable('η', 124,
                [[3e6, 12],
                 [1.69e71, 144, 60]],
                undefined,
                `Gain a free level of <b>Spinor Upgrade ε</b>`,
                (effect) => `${format(effect)} free levels`,
                (amount) => amount,
                () => Decimal.times(getTotalFomeBoost('subplanck', 4), 0.5),
                () => player.fome.fome.protoversal.expansion.gte(2),
                () => hasUpgrade('skyrmion', 8)),
        131: createSkyrmionBuyable('θ', 131,
                [[1e7, 13],
                 [6.86e72, 169, 60]],
                undefined,
                `Increase Protoversal Foam gain by 100% per order of magnitude of Subspatial Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.subspatial.points.plus(1).log10().times(amount).plus(1),
                () => getTotalFomeBoost('quantum', 1).times(0.25),
                () => player.fome.fome.subplanck.expansion.gte(1),
                () => hasUpgrade('skyrmion', 9)),
        132: createSkyrmionBuyable('ι', 132,
                [[2e14, 15],
                 [1.68e67, 225, 45]],
                undefined,
                `Your Spinors increase Infinitesimal Foam generation by 2% per order of magnitude`,
                (effect) => `${format(effect)}x`,
                (amount) => player.skyrmion.spinor.points.plus(1).log10().times(amount).times(0.02).plus(1),
                () => getTotalFomeBoost('quantum', 2).times(0.25),
                () => player.fome.fome.protoversal.expansion.gte(3),
                () => hasUpgrade('skyrmion', 10)),
        133: createSkyrmionBuyable('κ', 133,
                [[5e17, 13.5],
                 [3.66e68, 182, 45]],
                undefined,
                `Protoversal Boost 1 levels increase other Foam Boost 1 effects by 30%`,
                (effect) => `${format(effect)}x`,
                (amount) => amount.times(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[0] : 0).times(0.3).plus(1),
                () => getTotalFomeBoost('quantum', 3).times(0.25),
                () => player.fome.fome.infinitesimal.expansion.gte(2),
                () => hasUpgrade('skyrmion', 11)),
        134: createSkyrmionBuyable('λ', 134,
                [[7e10, 10, 0, 1.1],
                 [4.92e76, 100, 45, 1.1]],
                undefined,
                `Increase Infinitesimal Foam Boost 1 effect by 100%`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(2, amount),
                undefined,
                () => hasUpgrade('acceleron', 14),
                () => hasUpgrade('skyrmion', 12)),
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
                [[0.1, 1.2],
                 [9.5, 15, 25],
                 [2.65e77, 187.5, 90]],
                (cost) => cost.times(Decimal.pow(0.8, getTotalFomeBoost('infinitesimal', 2))),
                `Gain 50% more Skyrmions`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.5, amount),
                () => getTotalFomeBoost('protoversal', 1),
                undefined,
                () => hasUpgrade('skyrmion', 2)),
        212: createSkyrmionBuyable('β', 212,
                [[0.1, 1.3],
                 [6, 19.5, 15],
                 [3.01e39, 292.5, 45]],
                (cost) => cost.plus(0.9),
                `Reduce the nerf to Pion upgrade cost by 10%`,
                (effect) => `Pion upgrade cost nerf reduced by ${format(Decimal.sub(1, effect).times(100))}%`,
                (amount) => Decimal.pow(0.9, amount),
                () => getTotalFomeBoost('protoversal', 2),
                undefined,
                () => hasUpgrade('skyrmion', 3)),
        213: createSkyrmionBuyable('γ', 213,
                [[0.1, 1.7],
                 [25, 25, 10],
                 [1.97e71, 367.5, 60]],
                (cost) => cost.times(Decimal.pow(0.8, getTotalFomeBoost('infinitesimal', 4))),
                `Gain 75% more Pions`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.75, amount),
                () => getTotalFomeBoost('protoversal', 3),
                undefined,
                () => hasUpgrade('skyrmion', 4)),
        221: createSkyrmionBuyable('δ', 221,
                [[30, 15],
                 [1.1e72, 225, 60]],
                undefined,
                `Gain 70% more Protoversal Boost 1 effect`,
                (effect) => `${format(effect)}x`,
                (amount) => Decimal.pow(1.7, amount),
                () => getTotalFomeBoost('subplanck', 1).times(0.5),
                () => player.fome.boosts.protoversal.boosts[0].gte(1),
                () => hasUpgrade('skyrmion', 5)),
        222: createSkyrmionBuyable('ε', 222,
                [[50, 12],
                 [2.82e66, 144, 60]],
                undefined,
                `Increase Infinitesimal Foam gain by 50% per order of magnitude of Protoversal Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.protoversal.points.plus(1).log10().times(amount).plus(1),
                () => getTotalFomeBoost('subplanck', 2).times(0.5).plus(buyableEffect('skyrmion', 124)),
                () => player.fome.fome.infinitesimal.expansion.gte(1),
                () => hasUpgrade('skyrmion', 6)),
        223: createSkyrmionBuyable('ζ', 223,
                [[2e4, 14],
                 [1.71e73, 196, 60]],
                undefined,
                `Increase Pion and Spinor gain by 30% per order of magnitude of Subspatial Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.subspatial.points.plus(1).log10().times(amount).times(0.3).plus(1),
                () => getTotalFomeBoost('subplanck', 3).times(0.5),
                () => player.fome.fome.subspatial.expansion.gte(1),
                () => hasUpgrade('skyrmion', 7)),
        224: createSkyrmionBuyable('η', 224,
                [[3e6, 12],
                 [1.69e71, 144, 60]],
                undefined,
                `Gain 120% increased Foam generation`,
                (effect) => `${format(effect)}x`,
                (amount) => amount.times(1.2).plus(1),
                () => getTotalFomeBoost('subplanck', 4).times(0.5),
                () => player.fome.fome.protoversal.expansion.gte(2),
                () => hasUpgrade('skyrmion', 8)),
        231: createSkyrmionBuyable('θ', 231,
                [[1e7, 13],
                 [6.86e72, 169, 60]],
                undefined,
                `Increase Subspatial Foam gain by 30% per order of magnitude of Protoversal and Infinitesimal Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.protoversal.points.plus(1).log10().plus(player.fome.fome.infinitesimal.points.plus(1).log10()).times(amount).times(0.3).plus(1),
                () => getTotalFomeBoost('quantum', 1).times(0.25),
                () => player.fome.fome.subplanck.expansion.gte(1),
                () => hasUpgrade('skyrmion', 9)),
        232: createSkyrmionBuyable('ι', 232,
                [[2e14, 15],
                 [1.68e67, 225, 45]],
                undefined,
                `Your Pions increase Infinitesimal Foam generation by 2% per order of magnitude`,
                (effect) => `${format(effect)}x`,
                (amount) => player.skyrmion.pion.points.plus(1).log10().times(amount).times(0.02).plus(1),
                () => getTotalFomeBoost('quantum', 2).times(0.25),
                () => player.fome.fome.protoversal.expansion.gte(3),
                () => hasUpgrade('skyrmion', 10)),
        233: createSkyrmionBuyable('κ', 233,
                [[5e17, 13.5],
                 [3.66e68, 182, 45]],
                undefined,
                `Increase Subplanck Boost 1 effect by 40% per order of magnitude of Subplanck Foam`,
                (effect) => `${format(effect)}x`,
                (amount) => player.fome.fome.subplanck.points.plus(1).log10().times(amount).times(0.4).plus(1),
                () => getTotalFomeBoost('quantum', 3).times(0.25),
                () => player.fome.fome.infinitesimal.expansion.gte(2),
                () => hasUpgrade('skyrmion', 11)),
        234: createSkyrmionBuyable('λ', 234,
                [[7e20, 10],
                 [7e65, 100, 45]],
                undefined,
                `ln(Best Accelerons) increases Pion and Spinor gain`,
                (effect) => `${format(effect)}x`,
                (amount) => amount.times(player.acceleron.best.plus(1).ln()).plus(1),
                undefined,
                () => hasUpgrade('acceleron', 14),
                () => hasUpgrade('skyrmion', 12)),
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
                    ]],
                    ["row", [
                        ["upgrade", 12]
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

// initial * base ^ (amount - softcap) -> [initial, base, softcap]
function createCostFunc(costLists) {
    if (!costLists[0][2]) costLists[0][2] = 0
    costLists = costLists.map(list => list.map(value => new Decimal(value)))

    return (amount) => {
        let costList = costLists[floorSearch(costLists, amount)]
        return costList[0].times(Decimal.pow(costList[1], Decimal.pow(amount, costList[3] ? costList[3] : decimalOne).minus(costList[2])))
    }
}

function floorSearch(costLists, x, low = 0, high = costLists.length-1) {
    if (x.lt(0)) return 0
    if (low > high) return -1
    if (x.gte(costLists[high][2])) return high
    
    let mid = ~~((low + high) / 2)
    if (costLists[mid][2].eq(x)) return mid
    if (mid > 0 && costLists[mid-1][2].lte(x) && x.lt(costLists[mid][2])) return mid-1
    if (x.lt(costLists[mid][2])) return floorSearch(costLists, x, low, mid-1)
    return floorSearch(costLists, x, mid+1, high)
}

function createSkyrmionBuyable(symbol, id, costLists, costModifierFunc = (cost) => cost, text, effectTextFunc, effectFunc, bonusAmountFunc = () => new Decimal(0), unlockedFunc = () => true, isFree = () => false) {
	let type = id >= 200 ? 'spinor' : 'pion'
	let upperType = id >= 200 ? 'Spinor' : 'Pion'
    let costFunc = createCostFunc(costLists)
	return {
		unlocked() { return unlockedFunc() },
		cost() {
			let amount = getBuyableAmount('skyrmion', id).minus(Decimal.times(getTotalFomeBoost('subspatial', 4), 0.25))
			return costModifierFunc(costFunc(amount)).times(temp.skyrmion.effect[type].costNerf)
		},
		title: `${upperType} Upgrade ${symbol}`,
		display() {
			let amount = getBuyableAmount('skyrmion', id)
			let bonusAmount = bonusAmountFunc()
			return `<br/>${text}<br/><br/><b>Amount:</b> ${formatWhole(amount)}${Decimal.gt(bonusAmount, 0) ? ` + ${formatWhole(bonusAmount)}` : ``}<br/><br/><b>Current Effect:</b> ${effectTextFunc(temp.skyrmion.buyables[id].effect)}<br/><br/><b>Cost:</b> ${format(temp.skyrmion.buyables[id].cost)} ${upperType}s`
		},
		effect() { return effectFunc(getBuyableAmount('skyrmion', id).plus(bonusAmountFunc())) },
		canAfford() { return player.skyrmion[type].points.gte(temp.skyrmion.buyables[id].cost) },
		buy() {
			if (!isFree()) player.skyrmion[type].points = player.skyrmion[type].points.minus(temp.skyrmion.buyables[id].cost)
			player.skyrmion[type].upgrades = player.skyrmion[type].upgrades.plus(1)
			setBuyableAmount('skyrmion', id, getBuyableAmount('skyrmion', id).plus(1))
		}
	}
}