addLayer("inflaton", {
    name: "Inflaton",
    symbol: "I",
    row: 2,
    position: 2,
    branches: ['fome'],

    effectDescription: '<br/><h2>DANGER</h2><br/><h3>CONSTRUCTION AREA</h3><br/>AUTHORIZED PERSONNEL ONLY',
    canReset: false,
    layerShown() { return (player.acceleron.best.gt(0) && !hasUpgrade('acceleron', 25)) ? "ghost" : player[this.layer].unlocked },
    resource() { return player[this.layer].points.equals(1) ? "Inflaton" : "Inflatons" },
    color: "#ff5e13",
    type: "static",
    baseResource: "Quantum Foam",
    baseAmount() { return player.fome.fome.quantum.points },
    requires: new Decimal(1e300),
    canBuyMax() { return false },
    base: 1e308,
    exponent: 1e308,
    doReset(layer) {
        if (inChallenge('inflaton', 11)) {
            player.inflaton.inflating = true
            
        }
        else if (player.inflaton.inflating) {
            
        }
        else {

        }
    },

    startData() { return {
        unlocked: false,
        points: decimalZero,
        best: decimalZero,
        actual: decimalZero,
        inflating: false
    }},

    effect() {
        let gainFactor = decimalOne
        let nerfFactor = new Decimal(100)

        let inflatonNerf = player.inflaton.points.gt(1) ? Decimal.pow(nerfFactor, player.inflaton.points.log10()) : decimalOne
        let inflatonGain = player.inflaton.points.gt(1) ? player.inflaton.points.pow(gainFactor) : decimalZero

        return {
            gain: inflatonGain,
            nerf: inflatonNerf
        }
    },

    update(delta) {
        let max = new Decimal('10^^1e308')

        let effect = temp.inflaton.effect
        
        if (effect.gain.lt(max)) player.inflaton.points = player.inflaton.points.plus(effect.gain.times(delta))
        else player.inflaton.points = max

        if (player.inflaton.points.gt(player.inflaton.best)) player.inflaton.best = player.inflaton.points

        for (fomeType of fomeTypes)
            player.fome.fome[fomeType].points = player.fome.fome[fomeType].points.dividedBy(effect.nerf)
        player.skyrmion.pion.points = player.skyrmion.pion.points.dividedBy(effect.nerf)
        player.skyrmion.spinor.points = player.skyrmion.spinor.points.dividedBy(effect.nerf)

        if (inChallenge('inflaton', 11)) {
            for (fomeType of fomeTypes)
                if (player.fome.fome[fomeType].points.lt(1)) {
                    startChallenge('inflaton', 11)
                    return
                }
            if (player.skyrmion.pion.points.lt(1)) {
                startChallenge('inflaton', 11)
                return
            }
            if (player.skyrmion.spinor.points.lt(1)) {
                startChallenge('inflaton', 11)
                return
            }
        }
    },

    challenges: {
        rows: 1,
        cols: 1,
        11: {
            name: "INFLATE",
            challengeDescription: "<i>Survive</i><br/>",
            goalDescription: `${format('10^^1000')} Inflatons`,
            canComplete() { return player.inflaton.points.eq('10^^1e308') },
            rewardDescription: `Keep a second Inflaton`,
            unlocked() { return player.inflaton.points.eq(1) || inChallenge('inflaton', this.id) },
            onEnter() {
                player.inflaton.inflating = true
                player.inflaton.actual = player.inflaton.points
                player.inflaton.points = player.inflaton.points.plus(1)
            },
            onExit() {
                player.inflaton.inflating = false
                player.inflaton.points = player.inflaton.actual
            },
            onComplete() {
                this.onExit()
            }
        }
    },

    hotkeys: [
        {
            key: "ctrl+i",
            onPress() { if (temp.inflaton.layerShown === true) player.tab = 'inflaton' }
        }
    ]
})