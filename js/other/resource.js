const resources = {
    people: {
        name: "People",
        shouldUnlock: () => temp.oasis.resources.people.max > 0,
        consumes: {
            food: 1
        },
        initialAmount: 3
    },
    food: {
        name: "Food",
        shouldUnlock: () => temp.oasis.resources.people.max > 0
    },
    wood: {
        name: "Wood",
        shouldUnlock: () => temp.oasis.jobs.scavenger.max > 0,
        baseStorage: 50
    },
    sandstone: {
        name: "Sandstone",
        shouldUnlock: () => temp.oasis.jobs.knapper.max > 0,
        baseStorage: 100
    },
    stoneTools: {
        name: "Stone Tools",
        shouldUnlock: () => temp.oasis.jobs.crafter.max > 0,
        baseStorage: 10
    },
    salt: {
        name: "Salt",
        shouldUnlock: () => temp.oasis.jobs.saltFarmer.max > 0,
        produces: {
            salt: -1,
            food: -1,
            driedFood: 1
        },
        baseStorage: 10
    },
    driedFood: {
        name: "Preserved Food",
        shouldUnlock: () => temp.oasis.jobs.saltFarmer.max > 0,
        baseStorage: 100
    },
    labor: {
        name : "Days of Work",
        shouldUnlock: () => false
    },
    research: {
        name: "Research",
        shouldUnlock: () => false
    }
}

const terrainResources = {
    water: {
        name: "Water"
    },
    civilization: {
        name: "Civilization"
    },
    exploration: {
        name: "Exploration"
    }
}