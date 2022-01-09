var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
    showTree: true
}

addLayer("tree-tab", {
    clickables: {
        pause: {
            display: '||',
            canClick() { return player.gameSpeed != 0 },
            onClick() { player.gameSpeed = 0 },
            style: { 'width': '40px', 'min-height': '20px' }
        },
        play: {
            display: '▶',
            canClick() { return player.gameSpeed != 1 },
            onClick() { if (temp.oasis.resources.people.max > 0) player.gameSpeed = 1 },
            style: { 'width': '40px', 'min-height': '20px' }
        },
        fast: {
            display: '▶▶',
            canClick() { return player.gameSpeed != 2 },
            onClick() { if (temp.oasis.resources.people.max > 0) player.gameSpeed = 2 },
            style: { 'width': '40px', 'min-height': '20px' }
        },
        fastest: {
            display: '▶▶▶',
            canClick() { return player.gameSpeed != 3 },
            onClick() { if (temp.oasis.resources.people.max > 0) player.gameSpeed = 3 },
            style: { 'width': '40px', 'min-height': '20px' }
        }
    },
    
    tabFormat: [
        "blank",
        ["row", [
            ["display-text", () => `Year: ${player.oasis.time.year}`, {'margin': '0px 4px'}],
            ["display-text", () => `Month: ${player.oasis.time.month}`, {'margin': '0px 4px'}],
            ["display-text", () => `Day: ${player.oasis.time.day}`, {'margin': '0px 4px'}]
        ]],
        "blank",
        ['microtabs', 'game']
    ],
    microtabs: {
        game: {
            "The Oasis": {
                embedLayer: "oasis"
            },
            "Research": {
                unlocked() { return player.research.unlocked },
                embedLayer: "research"
            },
            "Expeditions": {
                unlocked() { return player.expedition.unlocked },
                embedLayer: "expedition"
            }
        }
    },
    previousTab: "",
    leftTab: true,
})