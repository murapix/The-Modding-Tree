addLayer("skyrmion", {
    name: "Skyrmion",
    symbol: "S",
    row: 0,
    position: 0,

    layerShown() { return true },
    resource() { return player[this.layer].points.equals(1) ? "Skyrmion" : "Skyrmions" },
    color: "#37d7ff",
    type: "static",
    baseResource: "Pions and Spinors",
    baseAmount() { return Decimal.min(player[this.layer].pion.points, player[this.layer].spinor.points) },
    requires: new Decimal(1),
    canBuyMax() { return true },
    base: 10,
    exponent: 1,
    gainMult() {
        return buyableEffect(this.layer, 21).recip()
    },
    doReset(layer) {
        if (layer != this.layer) {
            let keep = []
            layerDataReset(this.layer, keep)
        }
        else {
            player[this.layer].pion.points = player[this.layer].pion.points.minus(temp[this.layer].nextAt)
            player[this.layer].spinor.points = player[this.layer].spinor.points.minus(temp[this.layer].nextAt)
        }
    },

    effect() {
        let skyrmions = player[this.layer].points
        let pion = {
            alpha: buyableEffect(this.layer, 11),
            beta: buyableEffect(this.layer, 12),
            gamma: buyableEffect(this.layer, 13)
        }
        let spinor = {
            beta: buyableEffect(this.layer, 22),
            gamma: buyableEffect(this.layer, 23)
        }

        let eff = {
            pion: {
                gen: new Decimal(skyrmions).times(0.01).times(pion.alpha).times(spinor.gamma),
                costNerf: Decimal.pow(player[this.layer].spinor.upgrades.times(0.2).times(spinor.beta).plus(1), player[this.layer].spinor.upgrades.times(0.25))
            },
            spinor: {
                gen: skyrmions.times(0.01).times(pion.alpha).times(pion.gamma),
                costNerf: Decimal.pow(player[this.layer].pion.upgrades.times(0.2).times(pion.beta).plus(1), player[this.layer].pion.upgrades.times(0.25))
            }
        }
        return eff
    },
    effectDescription() {
        let eff = this.effect()
        return `which ${player[this.layer].points.equals(1) ? "is" : "are"} producing <h3 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>${format(eff.pion.gen)}</h3> Pions/s and <h3 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>${format(eff.spinor.gen)}</h3> Spinors/s`
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
        let eff = temp[this.layer].effect
        player[this.layer].pion.points = player[this.layer].pion.points.plus(eff.pion.gen.times(delta))
        player[this.layer].spinor.points = player[this.layer].spinor.points.plus(eff.spinor.gen.times(delta))
    },
    shouldNotify() {
        for(let i = 10; i <= 20; i += 10)
            for(let j = 1; j <= 3; j++)
                if (getBuyableAmount(this.layer, i+j).eq(0) && layers[this.layer].buyables[i+j].canAfford())
                    return true
        return false
    },

    milestones: {
        0: {
            requirementDescription: "10 Skyrmions",
            effectDescription: "Begin Fome generation",
            done() { return player[this.layer].points.gte(10) }
        }
    },

    utils: {
        displayBuyable(baseEffect, effect, amount, bonusAmount, cost, currency) {
            return `<br/>${baseEffect}<br/><br/><b>Amount:</b> ${formatWhole(amount)}${bonusAmount > 0 ? ` + ${formatWhole(bonusAmount)}` : ''}<br/><br/><b>Current Effect:</b> ${effect}<br/><br/><b>Cost:</b> ${format(cost)} ${currency}`
        }
    },

    buyables: {
        rows: 1,
        cols: 1,
        11: {
            cost() { 
                let amount = getBuyableAmount(this.layer, this.id)
                if (amount.lt(25))
                    return Decimal.pow(1.2, amount).dividedBy(10).times(temp[this.layer].effect.pion.costNerf)
                else return Decimal.pow(18, amount).dividedBy(1e28).times(temp[this.layer].effect.pion.costNerf)
                },
            title: "Pion Upgrade α",
            display() {
                return layers[this.layer].utils.displayBuyable('Gain 50% more Pions and Spinors',
                                                               `${format(this.effect())}x`,
                                                               getBuyableAmount(this.layer, this.id),
                                                               temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[1] : 0,
                                                               this.cost(),
                                                               'Pions')
            },
            effect() { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id).plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[1] : 0)) },
            canAfford() { return player[this.layer].pion.points.gte(this.cost()) },
            buy() {
                player[this.layer].pion.points = player[this.layer].pion.points.minus(this.cost())
                player[this.layer].pion.upgrades = player[this.layer].pion.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            },
        },
        12: {
            cost() {
                let amount = getBuyableAmount(this.layer, this.id)
                if (amount.lt(15))
                    return Decimal.pow(1.3, amount).dividedBy(10).plus(0.9).times(temp[this.layer].effect.pion.costNerf)
                else return Decimal.pow(19.5, amount).dividedBy(1e15).times(temp[this.layer].effect.pion.costNerf)
            },
            title: "Pion Upgrade β",
            display() {
                return layers[this.layer].utils.displayBuyable('Reduce the nerf to Spinor buyable cost by 10%',
                                                               `Spinor buyable cost nerf reduced by ${format(Decimal.sub(1, this.effect()).times(100))}%`,
                                                               getBuyableAmount(this.layer, this.id),
                                                               temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[2] : 0,
                                                               this.cost(),
                                                               'Pions')
            },
            effect() { return Decimal.pow(0.9, getBuyableAmount(this.layer, this.id).plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[2] : 0)) },
            canAfford() { return player[this.layer].pion.points.gte(this.cost()) },
            buy() {
                player[this.layer].pion.points = player[this.layer].pion.points.minus(this.cost())
                player[this.layer].pion.upgrades = player[this.layer].pion.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        13: {
            cost() {
                let amount = getBuyableAmount(this.layer, this.id)
                if (amount.lt(10))
                    return Decimal.pow(1.7, amount).dividedBy(10).plus(4.9).times(temp[this.layer].effect.pion.costNerf)
                else return Decimal.pow(25, amount).dividedBy(1e11).times(temp[this.layer].effect.pion.costNerf)
            },
            title: "Pion Upgrade γ",
            display() { return layers[this.layer].utils.displayBuyable('Increase Spinor gain by 75%',
                                                                       `${format(this.effect())}x`,
                                                                       getBuyableAmount(this.layer, this.id),
                                                                       temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[3] : 0,
                                                                       this.cost(),
                                                                       'Pions')
            },
            effect() { return Decimal.pow(1.75, getBuyableAmount(this.layer, this.id).plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[3] : 0)) },
            canAfford() { return player[this.layer].pion.points.gte(this.cost()) },
            buy() {
                player[this.layer].pion.points = player[this.layer].pion.points.minus(this.cost())
                player[this.layer].pion.upgrades = player[this.layer].pion.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        14: {
            unlocked() { return player.fome.boosts.protoversal.boosts[0].gte(1) },
            cost() {
                return Decimal.pow(25, getBuyableAmount(this.layer, this.id)).times(1e6).times(temp[this.layer].effect.pion.costNerf)
            },
            title: "Pion Upgrade δ",
            display() { return layers[this.layer].utils.displayBuyable('Increase Protoversal Foam gain from Skyrmions by 100%',
                                                                       `${format(this.effect())}x`,
                                                                       getBuyableAmount(this.layer, this.id),
                                                                       new Decimal(0),
                                                                       this.cost(),
                                                                       'Pions')
            },
            effect() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player[this.layer].pion.points.gte(this.cost()) },
            buy() {
                player[this.layer].pion.points = player[this.layer].pion.points.minus(this.cost())
                player[this.layer].pion.upgrades = player[this.layer].pion.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        21: {
            cost() {
                let amount = getBuyableAmount(this.layer, this.id)
                if (amount.lt(25))
                    return Decimal.pow(1.2, amount).dividedBy(10).times(temp[this.layer].effect.spinor.costNerf)
                else return Decimal.pow(18, amount).dividedBy(1e28).times(temp[this.layer].effect.spinor.costNerf)
            },
            title: "Spinor Upgrade α",
            display() { return layers[this.layer].utils.displayBuyable('Gain 50% more Skyrmions',
                                                                       `${format(this.effect())}x`,
                                                                       getBuyableAmount(this.layer, this.id),
                                                                       temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[1] : 0,
                                                                       this.cost(),
                                                                       'Spinors')
            },
            effect() { return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id).plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[1] : 0)) },
            canAfford() { return player[this.layer].spinor.points.gte(this.cost()) },
            buy() {
                player[this.layer].spinor.points = player[this.layer].spinor.points.minus(this.cost())
                player[this.layer].spinor.upgrades = player[this.layer].spinor.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        22: {
            cost() {
                let amount = getBuyableAmount(this.layer, this.id)
                if (amount.lt(15))
                    return Decimal.pow(1.3, amount).dividedBy(10).plus(0.9).times(temp[this.layer].effect.spinor.costNerf)
                else return Decimal.pow(19.5, amount).dividedBy(1e15).times(temp[this.layer].effect.spinor.costNerf)
            },
            title: "Spinor Upgrade β",
            display() { return layers[this.layer].utils.displayBuyable('Reduce the nerf to Pion buyable cost by 10%',
                                                                       `Pion buyable cost nerf reduced by ${format(Decimal.sub(1, this.effect()).times(100))}%`,
                                                                       getBuyableAmount(this.layer, this.id),
                                                                       temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[2] : 0,
                                                                       this.cost(),
                                                                       'Spinors')
            },
            effect() { return Decimal.pow(0.9, getBuyableAmount(this.layer, this.id).plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[2] : 0)) },
            canAfford() { return player[this.layer].spinor.points.gte(this.cost()) },
            buy() {
                player[this.layer].spinor.points = player[this.layer].spinor.points.minus(this.cost())
                player[this.layer].spinor.upgrades = player[this.layer].spinor.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        23: {
            cost() {
                let amount = getBuyableAmount(this.layer, this.id)
                if (amount.lt(10))
                    return Decimal.pow(1.7, amount).dividedBy(10).plus(4.9).times(temp[this.layer].effect.spinor.costNerf)
                else return Decimal.pow(25, amount).dividedBy(1e11).times(temp[this.layer].effect.spinor.costNerf)
            },
            title: "Spinor Upgrade γ",
            display() { return layers[this.layer].utils.displayBuyable('Increase Pion gain by 75%',
                                                                       `${format(this.effect())}x`,
                                                                       getBuyableAmount(this.layer, this.id),
                                                                       temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[3] : 0,
                                                                       this.cost(),
                                                                       'Spinors')
            },
            effect() { return Decimal.pow(1.75, getBuyableAmount(this.layer, this.id).plus(temp.fome.effect.boosts ? temp.fome.effect.boosts.total.protoversal[3] : 0)) },
            canAfford() { return player[this.layer].spinor.points.gte(this.cost()) },
            buy() {
                player[this.layer].spinor.points = player[this.layer].spinor.points.minus(this.cost())
                player[this.layer].spinor.upgrades = player[this.layer].spinor.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        },
        24: {
            unlocked() { return player.fome.boosts.protoversal.boosts[0].gte(1) },
            cost() {
                return Decimal.pow(25, getBuyableAmount(this.layer, this.id)).times(1e6).times(temp[this.layer].effect.spinor.costNerf)
            },
            title: "Spinor Upgrade δ",
            display() { return layers[this.layer].utils.displayBuyable('Increase Protoversal Boost 1 effect by 100%',
                                                                       `${format(this.effect())}x`,
                                                                       getBuyableAmount(this.layer, this.id),
                                                                       new Decimal(0),
                                                                       this.cost(),
                                                                       'Spinors')
            },
            effect() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player[this.layer].spinor.points.gte(this.cost()) },
            buy() {
                player[this.layer].spinor.points = player[this.layer].spinor.points.minus(this.cost())
                player[this.layer].spinor.upgrades = player[this.layer].spinor.upgrades.plus(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1))
            }
        }
    },

    microtabs: {
        stuff: {
            "Skyrmions": {
                content: [
                    "blank",
                    "milestones"
                ]
            },
            "Pions": {
                content: [
                    "blank",
                    ["display-text", () => `Your Spinor buyables are increasing Pion buyable cost by ${format(temp.skyrmion.effect.pion.costNerf.times(100))}%`],
                    "blank",
                    ["row", [["buyable", "11"], ["buyable", "12"], ["buyable", "13"]]],
                    ["row", [["buyable", "14"], ["buyable", "15"], ["buyable", "16"]]]
                ]
            },
            "Spinors": {
                content: [
                    "blank",
                    ["display-text", () => `Your Pion buyables are increasing Spinor buyable cost by ${format(temp.skyrmion.effect.spinor.costNerf.times(100))}%`],
                    "blank",
                    ["row", [["buyable", "21"], ["buyable", "22"], ["buyable", "23"]]],
                    ["row", [["buyable", "24"], ["buyable", "25"], ["buyable", "26"]]]
                ]
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", () => "You have <h2 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>" + format(player.skyrmion.pion.points) + "</h2> Pions"],
        "blank",
        ["display-text", () => "You have <h2 style='color:#37d7ff;text-shadow:#37d7ff 0px 0px 10px;'>" + format(player.skyrmion.spinor.points) + "</h2> Spinors"],
        "blank",
        ["microtabs", "stuff"]
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } }
    },

    hotkeys: [
        {
            key: "s",
            description: "S: Condense some Pions and Spinors for another Skyrmion",
            onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ]
})
