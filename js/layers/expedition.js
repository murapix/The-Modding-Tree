addLayer("expedition", {
    type: "none",

    row: 0,
    position: 2,
    color: '#f6d7b0',

    startData() {
        return {
            unlocked: false
        }
    },

    update() {
        if (hasResearch('travel')) player.expedition.unlocked = true
    },

    tabFormat: [
        "blank",
        ["display-text", '<h2>TODO</h2>']
    ]
})