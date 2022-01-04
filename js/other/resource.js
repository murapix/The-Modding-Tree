const resources = {
    people: {
        name: "People",
        shouldShow: () => temp.oasis.resources.people.max > 0,
        consumes: {
            food: 1
        },
        initialAmount: 3
    },
    food: {
        name: "Food",
        shouldShow: () => temp.oasis.resources.people.max > 0,
        baseStorage: 30
    },
    wood: {
        name: "Wood",
        shouldShow: () => false,
        baseStorage: 10
    },
    sandstone: {
        name: "Sandstone",
        shouldShow: () => false,
        baseStorage: 10
    },
    labor: {
        name : "Days of Work",
        shouldShow: () => false
    }
}

const terrainResources = {
    water: {
        name: "Water",
    }
}