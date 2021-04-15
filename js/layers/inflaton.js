addLayer("inflaton", {
    name: "Inflaton",
    symbol: "I",
    row: 2,
    position: 1,
    branches: ['fome'],

    layerShown() { return player[this.layer].unlocked ? (player.acceleron.points.gt(0) ? "ghost" : true) : false },
    resource() { return player[this.layer].points.equals(1) ? "Inflaton" : "Inflatons" },
    color: "#ff5e13",
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