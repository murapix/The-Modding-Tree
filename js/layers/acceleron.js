addLayer("acceleron", {
    name: "Acceleron",
    symbol: "A",
    row: 2,
    position: 0,
    branches: ['fome'],

    layerShown() { return player[this.layer].unlocked ? (player.inflaton.points.gt(0) ? "ghost" : true) : false },
    resource() { return player[this.layer].points.equals(1) ? "Acceleron" : "Accelerons" },
    color: "#0f52ba",
    type: "static",
    baseResource: "Quantum Foam",
    baseAmount() { return player.fome.fome.quantum.points },
    requires: new Decimal(1e6),
    canBuyMax() { return true },
    base: 1e308,
    exponent: 1e308,

    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }}
})