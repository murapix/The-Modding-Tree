const fib = [decimalOne, decimalOne]

addLayer("acceleron", {
    name: "Acceleron",
    symbol: "A",
    row: 2,
    position: 0,
    branches: ['fome'],

    layerShown() { return player[this.layer].unlocked ? (player.inflaton.points.gt(0) ? "ghost" : true) : false },
    resource() { return player[this.layer].points.equals(1) ? "Acceleron" : "Accelerons" },
    color: "#0f52ba",
    type: "normal",
    baseResource: "Quantum Foam",
    baseAmount() { return player.fome.fome.quantum.points },
    requires: new Decimal(1e12),
    exponent: 0.1,
    canReset() { return getBuyableAmount('fome', 54).gte(1) && Decimal.gte(temp.acceleron.resetGain, 1) },
    prestigeNotify() { return isLoopFinished(0) ? false : temp.acceleron.canReset },
    gainMult() {
        return defaultUpgradeEffect('acceleron', 12).times(defaultUpgradeEffect('acceleron', 15))
    },
    entropy() {
        let entropy = decimalZero
        for (let id in temp.acceleron.loops) {
            if (typeof temp.acceleron.loops[id] !== 'object') continue

            let loop = temp.acceleron.loops[id]
            if (!loop.unlocked) continue
            if (isLoopFinished(id))
                entropy = entropy.plus(loop.entropy)
        }
        return entropy
    },
    effect() {
        return player.acceleron.best.plus(1).sqrt().times(getClickableState('acceleron', 0)).times(defaultUpgradeEffect('timecube', 12))
    },
    effectDescription() {
        return `which ${player.acceleron.points.eq(1) ? `is` : `are`} causing time to go ${format(temp.acceleron.effect)}x faster`
    },

    update(delta) {
        delta = Decimal.times(delta, temp.acceleron.effect)

        player.acceleron.time = player.acceleron.time.plus(delta)

        for (let loop in temp.acceleron.loops) {
            let finished = isLoopFinished(loop)
            if (delta.lt(0)) {
                if (temp.acceleron.loops[loop].unlocked && !finished) {
                    let buildSpeed = delta.times(defaultUpgradeEffect('acceleron', 112))
                    if (player.acceleron.points.gte(buildSpeed.negate())) {
                        player.acceleron.loops[loop].progress = player.acceleron.loops[loop].progress.minus(buildSpeed).min(temp.acceleron.loops[loop].max)
                        player.acceleron.points = player.acceleron.points.plus(buildSpeed.times(defaultUpgradeEffect('acceleron', 122)))
                        if (isLoopFinished(loop))
                            clickClickable('acceleron', 0)
                    }
                    break
                }
            }
            else if (finished) {
                updateLoopInterval(loop, delta)
            }
            else if (player.acceleron.loops[loop]) {
                let loss = player.acceleron.loops[loop].progress.times(0.001).max(temp.acceleron.loops[loop].max.times(0.0005))
                player.acceleron.loops[loop].progress = player.acceleron.loops[loop].progress.minus(loss).max(0)
            }
        }

        if (player.acceleron.fomeBoost.lte(1e6) && player.acceleron.fomeBoost.gt(1))
            player.acceleron.fomeBoost = player.acceleron.fomeBoost.times(0.92).max(1)
    },

    startData() {
        data = {
            unlocked: false,
            points: decimalZero,
            best: decimalZero,
            total: decimalZero,
            loops: {},
            time: decimalZero,
            fomeBoost: decimalOne,
            entropy: decimalZero,
            enhancements: [0,0,0,0,0]
        }

        for (let loop in layers.acceleron.loops) {
            if (typeof layers.acceleron.loops[loop] === 'object') {
                data.loops[loop] = {
                    progress: decimalZero,
                    interval: decimalZero
                }
            }
        }

        return data
    },

    loops: {
        maxRadius: 150,
        0: {
            unlocked() { return hasUpgrade('acceleron', 15) },
            max: new Decimal(60),
            entropy: decimalOne,
            duration: decimalOne,
            intervalEffect(intervals = decimalOne) { addPoints('acceleron', new Decimal(temp.acceleron.resetGain).times(Decimal.plus(0.001, defaultUpgradeEffect('acceleron', 123, 0))).times(intervals)) },
            intervalDisplay() { return `Every second, gain ${format(Decimal.plus(0.001, defaultUpgradeEffect('acceleron', 123, 0)).times(100), 1)}% of your Acceleron prestige gain` },
            stroke: '#ff0000',
            width: 10
        },
        1: {
            unlocked() { return isLoopFinished(0) },
            max: new Decimal(360),
            entropy: decimalOne,
            duration: new Decimal(60),
            intervalEffect(intervals = decimalOne) {
                let skyrmionEffect = temp.skyrmion.effect
                let fomeEffect = temp.fome.effect

                let time = temp.acceleron.loops[1].duration.plus(defaultUpgradeEffect('acceleron', 111, 0)).times(intervals)

                player.skyrmion.pion.points = player.skyrmion.pion.points.plus(skyrmionEffect.pion.gen.times(time))
                player.skyrmion.spinor.points = player.skyrmion.spinor.points.plus(skyrmionEffect.spinor.gen.times(time))
                for(let fome of fomeTypes)
                    player.fome.fome[fome].points = player.fome.fome[fome].points.plus(fomeEffect.gain.total[fome].times(time))
            },
            intervalDisplay() { return `Every minute, gain ${format(Decimal.plus(1, defaultUpgradeEffect('acceleron', 111, 0)))} minutes of Foam and Skyrmion production` },
            stroke: '#800080',
            width: 10
        },
        2: {
            unlocked() { return isLoopFinished(1) },
            max: new Decimal(600),
            entropy: decimalOne,
            duration: new Decimal(3600),
            intervalEffect(intervals = decimalOne) { addPoints('timecube', intervals.times(defaultUpgradeEffect('timecube', 11)).times(defaultUpgradeEffect('acceleron', 22))) },
            intervalDisplay: 'Every hour, gain a Time Cube',
            stroke: '#0000FF',
            width: 10
        },
        3: {
            unlocked() { return hasUpgrade('timecube', 15) },
            max: new Decimal(250000),
            entropy: decimalOne,
            duration: new Decimal(86400),
            intervalEffect(intervals = decimalOne) { player.acceleron.fomeBoost = Decimal.times(1e6, intervals) },
            intervalDisplay() { return `Every day, gain a decaying boost to Foam production. Currently: ${format(player.acceleron.fomeBoost)}x` },
            stroke: '#008080',
            width: 10
        }
    },

    milestones: {
        0: {
            requirementDescription: "1 Total Acceleron",
            effectDescription: "Unlock the Foam Buy All button<br>Protoversal Foam doesn't shrink on Acceleron reset",
            done() { return player.acceleron.total.gte(1) }
        },
        1: {
            requirementDescription: "2 Total Accelerons",
            effectDescription: "Infinitesimal Foam doesn't shrink on Acceleron reset",
            done() { return player.acceleron.total.gte(2) }
        },
        2: {
            requirementDescription: "3 Total Accelerons",
            effectDescription: "Subspatial Foam doesn't shrink on Acceleron reset",
            done() { return player.acceleron.total.gte(3) }
        },
        3: {
            requirementDescription: "5 Total Accelerons",
            effectDescription: "Start with 10 Skyrmions on Acceleron resets",
            done() { return player.acceleron.total.gte(5) }
        },
        4: {
            requirementDescription: "7 Total Accelerons",
            effectDescription: "Subplanck Foam doesn't shrink on Acceleron reset",
            done() { return player.acceleron.total.gte(7) }
        },
        5: {
            requirementDescription: "10 Total Accelerons",
            effectDescription: "Quantum Foam doesn't shrink on Acceleron reset",
            done() { return player.acceleron.total.gte(10) }
        }
    },

    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: 'Minute Acceleration',
            description: 'Time speed massively multiplies Foam generation',
            cost: decimalOne,
            effect() { return temp.acceleron.effect.abs().sqrt().times(1000) },
            effectDisplay() { return `${format(upgradeEffect('acceleron', 11))}x` },
            unlocked() { return player.acceleron.total.gte(4) }
        },
        12: {
            title: 'Quantum Translation',
            description: 'Each Foam re-formation increases Acceleron gain by 100%',
            cost: new Decimal(5),
            effect() { return fomeTypes.map(type => player.fome.fome[type].expansion).reduce((a,b) => Decimal.plus(a,b)).minus(5) },
            effectDisplay() { return `${formatWhole(upgradeEffect('acceleron', 13))}x` },
            unlocked() { return hasUpgrade('acceleron', 11) }
        },
        13: {
            title: 'Superpositional Acceleration',
            description: 'Gain a new Pion and Spinor Upgrade',
            cost: new Decimal(25),
            unlocked() { return hasUpgrade('acceleron', 12) }
        },
        14: {
            title: 'Quasi-temporal Superstructures',
            description: 'Consume the past to build the future',
            cost: new Decimal(50),
            unlocked() { return hasUpgrade('acceleron', 13) }
        },
        15: {
            title: 'Temporal Fluctuation',
            description: 'Each Entropic Loop multiplies Acceleron gain',
            effect() {
                let count = 1
                for (let loop in layers.acceleron.loops) {
                    if (temp.acceleron.loops[loop].unlocked) {
                        if(isLoopFinished(loop)) count++
                        else break
                    }
                    else break
                }
                return new Decimal(count)
            },
            effectDisplay() { return `${formatWhole(upgradeEffect('acceleron', 15))}x`},
            cost: new Decimal(100),
            unlocked() { return isLoopFinished(0) },
        },
        21: {
            title: 'Unstable Expansion',
            description: 'Unlock Entropic Enhancements',
            cost: new Decimal(300),
            unlocked() { return isLoopFinished(1) }
        },
        22: {
            title: 'Stability Conversion',
            description: 'Each Entropic Loop multiplies Time Cube gain',
            cost: new Decimal(150000),
            effect() {
                let count = 1
                for (let loop in layers.acceleron.loops) {
                    if (temp.acceleron.loops[loop].unlocked) {
                        if (isLoopFinished(loop)) count++
                        else break
                    }
                    else break
                }
                return new Decimal(count)
            },
            effectDisplay() { return `${formatWhole(upgradeEffect('acceleron', 22))}x`},
            unlocked() { return isLoopFinished(2) }
        },
        23: {
            title: 'Subspatial Alacrity',
            description: `Increase Subspatial Foam gain by ${format(1e4)}x`,
            cost: new Decimal(2e6),
            effect: new Decimal(1e4),
            unlocked() { return hasUpgrade('acceleron', 22) }
        },
        24: {
            title: 'Cubic Tetration',
            description: 'Gain access to an additional two Entropic Loops (not yet implemented)',
            cost: new Decimal(1e8),
            unlocked() { return hasUpgrade('acceleron', 23) }
        },
        25: {
            title: 'Temporal Mastery',
            description: 'Unlock Inflatons (not yet implemented)',
            cost: new Decimal(1e30),
            unlocked() { return hasUpgrade('acceleron', 24) }
        },


        // Enhancements
        111: createEnhancement(111, {
            title: 'Entropic Expansion',
            description: 'Increase the second Entropic Loop effect based on purchased Entropic Enhancements',
            effect() { return Decimal.pow(fibonacciNumber(player.acceleron.enhancements[0]), 0.9).times(defaultUpgradeEffect('timecube', 14)) },
            effectDisplay() { return `+${format(temp.acceleron.upgrades[111].effect)} minutes` }
        }),
        112: createEnhancement(112, {
            title: 'Entropic Construction',
            description: 'Entropic Loops build faster based on purchased Entropic Enhancements',
            effect() { return Decimal.pow(10, Decimal.pow(fibonacciNumber(player.acceleron.enhancements[0]), 0.9)) }
        }),
        113: createEnhancement(113, {
            title: 'Entropic Dilation',
            description: `Increase time speed based on purchased Entropic Enhancements`,
            effect() { return Decimal.pow(fibonacciNumber(player.acceleron.enhancements[0]), 0.8).plus(1) },
        }),
        121: createEnhancement(121, {
            title: 'Entropic Formation',
            description: 'Increase Foam gain based on best Accelerons',
            effect() { return Decimal.pow(fibonacciNumber(player.acceleron.best.plus(1).log10().floor()), 2.5).plus(1) },
        }),
        122: createEnhancement(122, {
            title: 'Entropic Development',
            description: 'Decrease Entropic Loop construction cost based on purchased Entropic Enhancements',
            effect() { return Decimal.pow(0.7, fibonacciNumber(player.acceleron.enhancements[0])) },
        }),
        123: createEnhancement(123, {
            title: 'Entropic Acceleration',
            description: 'Increase the first Entropic Loop effect based on completed Entropic Loops',
            effect() {
                let count = 1
                for (let loop in layers.acceleron.loops) {
                    if (temp.acceleron.loops[loop].unlocked) {
                        if(isLoopFinished(loop)) count++
                        else break
                    }
                    else break
                }
                return Decimal.times(count, 0.001)
            },
            effectDisplay() { return `+${format(temp.acceleron.upgrades[123].effect.times(100), 1)}% of your Acceleron prestige gain` }
        }),
        131: createEnhancement(131, {
            title: 'Entropic Extension',
            description: 'Increase Infinitesimal Foam gain based on purchased Entropic Enhancements',
            effect() { return Decimal.pow(fibonacciNumber(player.acceleron.enhancements[0]), 2).plus(1) }
        }),
        132: createEnhancement(132, {
            title: 'Entropic Configuration',
            description: 'Increase Subspatial Foam gain based on purchased Entropic Enhancements',
            effect() { return Decimal.pow(fibonacciNumber(player.acceleron.enhancements[0]), 1.75).plus(1) }
        }),
        133: createEnhancement(133, {
            title: 'Entropic Invention',
            description: 'Increase Subplanck Foam gain based on purchased Entropic Enhancements',
            effect() { return Decimal.pow(fibonacciNumber(player.acceleron.enhancements[0]), 1.5).plus(1) }
        }),
        141: createEnhancement(141, {
            title: 'Entropic Tesselation',
            description: 'Increase Time Cube gain based on best Accelerons',
            effect() { return Decimal.pow(fibonacciNumber(player.acceleron.best.plus(1).log10().floor()), 1.5).plus(1) }
        }),
        142: createEnhancement(142, {
            title: 'Entropic Amplification',
            description: 'Skyrmions are cheaper based on best Time Cubes',
            effect() { return Decimal.pow(0.9, fibonacciNumber(player.timecube.best.plus(1).log10().floor())) }
        }),
        143: createEnhancement(143, {
            title: 'Entropic Rotation',
            description: 'Increase Acceleron gain based on best Time Cubes',
            effect() { return Decimal.pow(fibonacciNumber(player.timecube.best.plus(1).log10().floor()), 1.5).plus(1) }
        })
    },

    clickables: {
        0: {
            display() { return getClickableState('acceleron', 0) == -1 ? "Halt Construction" : "Begin Construction" },
            canClick() {
                for (let loop in temp.acceleron.loops) {
                    if (temp.acceleron.loops[loop].unlocked && getLoopProgress(loop).lt(temp.acceleron.loops[loop].max))
                        return true
                }
                return getClickableState('acceleron', this.id) < 0
            },
            onClick() {
                if (getClickableState('acceleron', 0) == -1)
                    setClickableState('acceleron', 0, 1)
                else setClickableState('acceleron', 0, -1)
            },
            style: {
                'min-height': "30px",
                width: "150px"
            }
        },
        1: {
            display: `Reset Enhancements`,
            canClick: true,
            onClick() {
                player.acceleron.upgrades = player.acceleron.upgrades.filter(id => id < 100)
                player.acceleron.enhancements = player.acceleron.enhancements.map(() => 0)
                player.acceleron.entropy = temp.acceleron.entropy
            },
            style: {
                'min-height': "30px",
                width: "100px"
            }
        }
    },

    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    "blank",
                    "milestones"
                ]
            },
            "Entropic Loops": {
                unlocked() { return hasUpgrade('acceleron', 15) },
                content: [
                    "blank",
                    "loops",
                    "blank",
                    ["clickable", 0],
                    "blank",
                    ["display-text", () => {
                        for (let loop in temp.acceleron.loops) {
                            if (!temp.acceleron.loops[loop].unlocked) continue
                            if (isLoopFinished(loop)) continue
                            return `Construction Progress: ${formatWhole(player.acceleron.loops[loop].progress)} / ${temp.acceleron.loops[loop].max}`
                        }
                        return `Construction Complete`
                    }],
                    () => {
                        for (let loop in temp.acceleron.loops) {
                            if (!temp.acceleron.loops[loop].unlocked) continue
                            if (isLoopFinished(loop)) continue
                            return ["display-text", `Construction will consume ${format(temp.acceleron.loops[loop].max.times(defaultUpgradeEffect('acceleron', 122)))} Accelerons`]
                        }
                    },
                    "blank",
                    ["display-text", () => isLoopFinished(0) ? temp.acceleron.loops[0].intervalDisplay : ''],
                    ["display-text", () => isLoopFinished(1) ? temp.acceleron.loops[1].intervalDisplay : ''],
                    ["display-text", () => isLoopFinished(2) ? temp.acceleron.loops[2].intervalDisplay : ''],
                    ["display-text", () => isLoopFinished(3) ? temp.acceleron.loops[3].intervalDisplay : ''],
                    "blank",
                    () => hasUpgrade('acceleron', 21) ? ["clickable", 1] : '',
                    "blank",
                    () => hasUpgrade('acceleron', 21) ? ["display-text", `You have ${formatWhole(player.acceleron.entropy)} Entropy`] : '',
                    () => hasUpgrade('acceleron', 21) ? ["display-text", `Select one upgrade from each row. Certain upgrades may allow you to select more`] : '',
                    () => hasUpgrade('acceleron', 21) ? ["display-text", `Each purchased Enhancement increases the cost of another`] : '',
                    "blank",
                    () => hasUpgrade('acceleron', 21) ? ["column", [
                        ["row", [["upgrade", 111], ["upgrade", 112], ["upgrade", 113]]],
                        ["row", [["upgrade", 121], ["upgrade", 122], ["upgrade", 123]]],
                        ["row", [["upgrade", 131], ["upgrade", 132], ["upgrade", 133]]],
                        ["row", [["upgrade", 141], ["upgrade", 142], ["upgrade", 143]]],
                    ]] : '',
                    "blank"
                ]
            },
            "Upgrades": {
                content: [
                    "blank",
                    "upgrades"
                ]
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["microtabs", "stuff"]
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } },
    },

    hotkeys: [
        {
            key: "a",
            description: "A: Form your Quantum Foam into Accelerons",
            onPress() { if (canReset('acceleron')) doReset('acceleron') }
        },
        {
            key: "ctrl+a",
            onPress() { if (temp.acceleron.layerShown === true) player.tab = 'acceleron' }
        }
    ]
})

function getLoopProgress(id) { return player.acceleron.loops[id].progress }

function isLoopFinished(id) { return player.acceleron.loops[id] ? player.acceleron.loops[id].progress.gte(temp.acceleron.loops[id].max) : false }

function updateLoopInterval(id, delta) {
	let loop = layers.acceleron.loops[id]
	let data = player.acceleron.loops[id]
	if (loop.intervalEffect) {
		data.interval = data.interval.plus(delta)
		let numIntervals = data.interval.dividedBy(loop.duration).floor()
        if (numIntervals.gte(1)) {
		    data.interval = data.interval.minus(numIntervals.times(loop.duration))
		    loop.intervalEffect(numIntervals)
        }
	}
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	var angleInRadians = angleInDegrees * Math.PI / 180

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	}
}

function describeArc(x, y, radius, startAngle, endAngle) {
	let start = polarToCartesian(x, y, radius, startAngle)
	let end = polarToCartesian(x, y, radius, endAngle)

	return [
		'M', start.x, start.y,
		'A', radius, radius, 0, endAngle - startAngle > 180 ? '1' : '0', 1, end.x, end.y
	].join(' ')
}

function fibonacciNumber(index) {
    if (index < 0) return 0
    if (fib[index]) return fib[index]

    let num = fibonacciNumber(index-2).plus(fibonacciNumber(index-1))
    fib[index] = num
    return num
}

function createEnhancement(id, data) {
    data.currencyDisplayName = 'Entropy',
    data.currencyInternalName = 'entropy',
    data.currencyLayer = 'acceleron'

    let row = ~~((id-100)/10)
    data.onPurchase = () => {
        player.acceleron.enhancements[0]++
        player.acceleron.enhancements[row]++
    }

    if (data.cost === undefined)
        data.cost = () => fibonacciNumber(player.acceleron.enhancements[0])

    if (data.unlocked === undefined)
        data.unlocked = () => hasUpgrade('acceleron', 21) && isLoopFinished(row-1) && (hasUpgrade('acceleron', id) || player.acceleron.enhancements[row] < 1)

    if (data.effectDisplay === undefined)
        data.effectDisplay = () => `${format(temp.acceleron.upgrades[id].effect)}x`

    return data
}