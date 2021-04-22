addLayer("timecube", {
    name: "Time Cubes",
    symbol: "T",
    row: 3,
    position: 0,
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
        delta = Decimal.times(delta, temp.acceleron.effect.time)
    },

    startData() {
        return {
            unlocked: true,
            points: decimalZero,
        }
    },

    componentStyles: {
        "microtabs"() { return { "border-style": "none" } },
    }
})
