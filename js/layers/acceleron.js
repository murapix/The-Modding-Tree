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
    requires: new Decimal(1e6),
    exponent: 0.1,
    gainMult() {
        return hasUpgrade('acceleron', 13) ? upgradeEffect('acceleron', 13) : decimalOne
    },
    effect() {
        let entropy = decimalZero
        let maxEntropy = decimalZero

        for (let id in temp.acceleron.loops) {
            if (typeof temp.acceleron.loops[id] !== 'object') continue

            let loop = temp.acceleron.loops[id]
            if (!loop.unlocked) continue
            if (isLoopFinished(id))
                maxEntropy = maxEntropy.plus(loop.entropy)
        }

        for(let id in temp.acceleron.clickables)
            if (temp.acceleron.clickables[id].entropy)
                entropy = entropy.plus(temp.acceleron.clickables[id].entropy)

        return {
            time: player.acceleron.best.plus(1).sqrt().times(getClickableState('acceleron', 0)).times(clickableEffect('acceleron', 42)),
            maxEntropy: maxEntropy.times(defaultUpgradeEffect('acceleron', 22)),
            entropy: entropy,
            instability: Decimal.pow(0.75, entropy.minus(maxEntropy)).recip()
        }
    },
    effectDescription() {
        return `which ${player.acceleron.points.eq(1) ? `is` : `are`} causing time to go ${format(temp.acceleron.effect.time)}x faster`
    },

    update(delta) {
        delta = Decimal.times(delta, temp.acceleron.effect.time)

        player.acceleron.time = player.acceleron.time.plus(delta)

        let hasConstruction = false
        for (let loop in temp.acceleron.loops) {
            let finished = isLoopFinished(loop)
            if (delta.lt(0)) {
                if (temp.acceleron.loops[loop].unlocked && !finished) {
                    let buildSpeed = temp.acceleron.loops[loop].buildSpeed.times(delta).times(clickableEffect('acceleron', 22))
                    if (player.acceleron.points.gte(buildSpeed.negate())) {
                        player.acceleron.loops[loop].progress = player.acceleron.loops[loop].progress.minus(buildSpeed).min(temp.acceleron.loops[loop].max)
                        player.acceleron.points = player.acceleron.points.plus(buildSpeed.times(clickableEffect('acceleron', 32)))
                    }
                    hasConstruction = true
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
        if (!hasConstruction && delta.lt(0))
            clickClickable('acceleron', 0)

        let outerLoop
        for(let loop in temp.acceleron.loops) {
            if (temp.acceleron.loops[loop].unlocked) {
                if (isLoopFinished(loop))
                    outerLoop = {id: loop, loop: temp.acceleron.loops[loop]}
                else if (player.acceleron.loops[loop].progress.gt(0))
                    outerLoop = undefined
            }
        }
        if (outerLoop) {
            if (temp.acceleron.effect.entropy.gt(temp.acceleron.effect.maxEntropy.times(2))) {
                player.acceleron.instability = player.acceleron.instability.plus(temp.acceleron.effect.entropy.minus(temp.acceleron.effect.maxEntropy).times(delta))
                if (player.acceleron.instability.gte(outerLoop.loop.duration))
                    player.acceleron.loops[outerLoop.id].progress = player.acceleron.loops[outerLoop.id].progress.times(0.95)
            }
        }
    },

    startData() {
        data = {
            unlocked: false,
            points: decimalZero,
            best: decimalZero,
            total: decimalZero,
            loops: {},
            time: decimalZero,
            instability: decimalZero,
            clickables: {
                0: 1,
                12: 0,
                22: 0,
                32: 0,
                42: 0
            }
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
            max: new Decimal(250),
            entropy: fibonacciNumber(0),
            buildSpeed: decimalOne,
            duration: new Decimal(60),
            intervalEffect(intervals = decimalOne) { addPoints('acceleron', new Decimal(temp.acceleron.resetGain).times(0.05).times(intervals)) },
            intervalDisplay: `Every minute, gain 5% of your Accelerons prestige gain`,
            stroke: '#ff0000',
            width: 10
        },
        1: {
            unlocked() { return isLoopFinished(0) },
            max: new Decimal(1500),
            entropy: fibonacciNumber(1),
            buildSpeed: new Decimal(10),
            duration: new Decimal(3600),
            intervalEffect(intervals = decimalOne) {
                let skyrmionEffect = temp.skyrmion.effect
                let fomeEffect = temp.fome.effect

                let time = temp.acceleron.loops[1].duration.times(clickableEffect('acceleron', 12).plus(1)).times(intervals).times(temp.acceleron.effect.time)

                player.skyrmion.pion.points = player.skyrmion.pion.points.plus(skyrmionEffect.pion.gen.times(time))
                player.skyrmion.spinor.points = player.skyrmion.spinor.points.plus(skyrmionEffect.spinor.gen.times(time))
                for(let fome of fomeTypes)
                    player.fome.fome[fome].points = player.fome.fome[fome].points.plus(fomeEffect.gain.total[fome].times(time))
            },
            intervalDisplay() { return `Every hour, gain ${format(clickableEffect('acceleron', 12).plus(1))} hours of Fome and Skyrmion production` },
            stroke: '#800080',
            width: 10
        },
        2: {
            unlocked() { return isLoopFinished(1) },
            max: new Decimal(250000),
            entropy: fibonacciNumber(2),
            buildSpeed: decimalOne,
            duration: new Decimal(86400),
            intervalEffect(intervals = decimalOne) { addPoints('timecube', intervals) },
            intervalDisplay: 'Every day, gain a Time Cube',
            stroke: '#0000FF',
            width: 10
        }
    },

    milestones: {
        0: {
            requirementDescription: "1 Total Acceleron",
            effectDescription: "Unlock the Foam Buy All button",
            done() { return player.acceleron.total.gte(1) }
        },
        1: {
            requirementDescription: "4 Total Accelerons",
            effectDescription: "Enlarging Protoversal Foam no longer consumes Foam",
            done() { return player.acceleron.total.gte(4) }
        },
        2: {
            requirementDescription: "16 Total Accelerons",
            effectDescription: "Enlarging Infinitesimal Foam no longer consumes Foam",
            done() { return player.acceleron.total.gte(16) }
        },
        3: {
            requirementDescription: "64 Total Accelerons",
            effectDescription: "Enlarging Subspatial Foam no longer consumes Foam",
            done() { return player.acceleron.total.gte(64) }
        },
        4: {
            requirementDescription: "256 Total Accelerons",
            effectDescription: "Enlarging Subplanck Foam no longer consumes Foam",
            done() { return player.acceleron.total.gte(256) }
        },
        5: {
            requirementDescription: "1024 Total Accelerons",
            effectDescription: "Enlarging Quantum Foam no longer consumes Foam",
            done() { return player.acceleron.total.gte(1024) }
        }
    },

    upgrades: {
        rows: 5,
        cols: 100,
        11: {
            title: 'Minute Acceleration',
            description: 'Time speed massively multiplies Infinitesimal Foam generation',
            cost: new Decimal(1),
            effect() { return temp.acceleron.effect.time.times(100) },
            effectDisplay() { return `${format(upgradeEffect('acceleron', 11))}x` }
        },
        12: {
            title: 'Temporal Fluctuation',
            description: 'Minute Acceleration now also applies to Protoversal and Subspatial Foam',
            cost: new Decimal(10),
            unlocked() { return hasUpgrade('acceleron', 11) }
        },
        13: {
            title: 'Quantum Translation',
            description: 'Each Foam re-formation increases Acceleron gain by 100%',
            cost: new Decimal(15),
            effect() { return fomeTypes.map(type => player.fome.fome[type].expansion).reduce((a,b) => Decimal.plus(a,b)).minus(5) },
            effectDisplay() { return `${format(upgradeEffect('acceleron', 13))}x` },
            unlocked() { return hasUpgrade('acceleron', 12) }
        },
        14: {
            title: 'Superpositional Acceleration',
            description: 'Gain a new Pion and Spinor Upgrade',
            cost: new Decimal(150),
            unlocked() { return hasUpgrade('acceleron', 13) }
        },
        15: {
            title: 'Quasi-temporal Superstructures',
            description: 'Consume the past to build the future',
            cost: new Decimal(250),
            unlocked() { return hasUpgrade('acceleron', 14) }
        },
        21: {
            title: 'Unstable Expansion',
            description: 'Unlock Entropic Enhancements',
            cost: new Decimal(3000),
            unlocked() { return isLoopFinished(1) }
        },
        22: {
            title: 'Stability Conversion',
            description: 'Double maximum Entropy',
            cost: new Decimal(150000),
            effect: new Decimal(2),
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
        }
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
                height: "30px",
                width: "150px"
            }
        },

        11: createEntropySelector(11),
        12: createEntropySelector(12,
                'Entropic Expansion',
                (amount) => Decimal.pow(amount, 0.9),
                () => `Increased effect of the second Entropic Loop<br/><br/><b>Current Effect:</b> +${format(clickableEffect('acceleron', 12))} hours`,
                (amount) => new Decimal(amount)),
        13: createEntropySelector(13),

        21: createEntropySelector(21),
        22: createEntropySelector(22,
                'Entropic Construction',
                (amount) => Decimal.pow(10, Decimal.pow(amount, 1.1)),
                () => `Increased Entropic Loop build speed<br/><br/><b>Current Effect:</b> ${format(clickableEffect('acceleron', 22))}x`,
                (amount) => new Decimal(amount)),
        23: createEntropySelector(23),

        31: createEntropySelector(31),
        32: createEntropySelector(32,
                'Entropic Development',
                (amount) => Decimal.pow(0.7, amount),
                () => `Decrease Entropic Loop build cost<br/><br/><b>Current Effect:</b> ${format(clickableEffect('acceleron', 32))}x Accelerons consumed`,
                (amount) => new Decimal(amount)),
        33: createEntropySelector(33),

        41: createEntropySelector(41),
        42: createEntropySelector(42,
                'Entropic Dilation',
                (amount) => Decimal.pow(amount, 0.8).plus(1),
                () => `Increase time speed<br/><br/><b>Current Effect:</b> ${format(clickableEffect('acceleron', 42))}x faster`,
                (amount) => new Decimal(amount)),
        43: createEntropySelector(43),
    },

    microtabs: {
        stuff: {
            "Upgrades": {
                content: [
                    "blank",
                    ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15]]],
                    ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24], ["upgrade", 25]]]
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
                    ["display-text", () => {
                        let stability = temp.acceleron.effect.maxEntropy.minus(temp.acceleron.effect.entropy)
                        if (stability.gt(0))
                            return `Stability: ${format(stability)}`
                        else return `Instability: ${format(stability.negate())} / ${format(temp.acceleron.effect.maxEntropy)}`
                    }],
                    () => {
                        let effect = temp.acceleron.effect
                        if (effect.entropy.gt(effect.maxEntropy)) {
                            return ["display-text", `Warning: Excess Entropy is causing loop instability, increasing build cost by ${format(temp.acceleron.effect.instability.minus(1).times(100))}%`]
                        }
                    },
                    () => {
                        let effect = temp.acceleron.effect
                        if (effect.entropy.gt(effect.maxEntropy.times(2))) {
                            return ["display-text", `Warning: Excess Entropy is causing severe loop instability, remaining at this level may cause stable loops to decay`]
                        }
                    },
                    "blank",
                    ["display-text", () => isLoopFinished(0) ? temp.acceleron.loops[0].intervalDisplay : ''],
                    ["display-text", () => isLoopFinished(1) ? temp.acceleron.loops[1].intervalDisplay : ''],
                    ["display-text", () => isLoopFinished(2) ? temp.acceleron.loops[2].intervalDisplay : ''],
                    "blank",
                    () => hasUpgrade('acceleron', 21) ? ["row", [
                        ["column", [["clickable", 11], ["clickable", 12], ["clickable", 13]]],
                        "blank",
                        ["column", [["clickable", 21], ["clickable", 22], ["clickable", 23]]],
                        "blank",
                        ["column", [["clickable", 31], ["clickable", 32], ["clickable", 33]]],
                        "blank",
                        ["column", [["clickable", 41], ["clickable", 42], ["clickable", 43]]]
                    ]] : '',
                    "blank"
                ]
            },
            "Milestones": {
                content: [
                    "blank",
                    "milestones"
                ]
            }
        }
    },

    tabFormat: [
        "main-display",
        ["display-text", () => ``],
        "prestige-button",
        "blank",
        ["microtabs", "stuff"]
    ],

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } },
    }
})

function getLoopProgress(id) { return player.acceleron.loops[id].progress }

function isLoopFinished(id) { return player.acceleron.loops[id] ? player.acceleron.loops[id].progress.gte(temp.acceleron.loops[id].max) : false }

function updateLoopInterval(id, delta) {
	let loop = layers.acceleron.loops[id]
	let data = player.acceleron.loops[id]
	if (loop.intervalEffect) {
		data.interval = data.interval.plus(delta)
		let numIntervals = data.interval.dividedBy(loop.duration).floor()
		data.interval = data.interval.minus(numIntervals.times(loop.duration))
		loop.intervalEffect(numIntervals)
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

function createEntropySelector(id, title, effect, effectDisplay, entropy) {
	let type = id%10
	switch (type) {
		case 1:
			return {
				title: '⇧',
            	canClick: true,
            	onClick() { setClickableState('acceleron', id+1, getClickableState('acceleron', id+1) + 1) },
            	style: { height: "30px", width: "60px" } 
			}
		case 2:
			return {
				title: title,
				display() { return `<br/>${temp.acceleron.clickables[this.id].effectDisplay}<br/><br/><b>Entropy:</b> ${format(temp.acceleron.clickables[this.id].entropy)}` },
				effect() { return effect(getClickableState('acceleron', this.id)) },
				effectDisplay() { return effectDisplay() },
				entropy() { return entropy(getClickableState('acceleron', this.id)) },
				canClick: false,
				style: { height: "150px", width: "150px" }
			}
		case 3:
			return {
				title: '⇩',
            	canClick() { return getClickableState('acceleron', id-1) > 0 },
            	onClick() { setClickableState('acceleron', id-1, getClickableState('acceleron', id-1) - 1) },
            	style: { height: "30px", width: "60px" }
			}
	}
}

function fibonacciNumber(index) {
    if (index < 0) return 0
    if (fib[index]) return fib[index]

    let num = fibonacciNumber(index-2).plus(fibonacciNumber(index-1))
    fib[index] = num
    return num
}