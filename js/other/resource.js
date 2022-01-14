const resources = {
    people: {
        name: "People",
        shouldUnlock: () => temp.oasis.resources.people.max > 0,
        consumes: {
            food: 1
        },
        initialAmount: 3,
        color: 'blue'
    },
    food: {
        name: "Food",
        shouldUnlock: () => temp.oasis.resources.people.max > 0,
        color: 'green'
    },
    wood: {
        name: "Wood",
        shouldUnlock: () => temp.oasis.jobs.scavenger.max > 0,
        baseStorage: 50,
        color: 'brown'
    },
    sandstone: {
        name: "Sandstone",
        shouldUnlock: () => temp.oasis.jobs.knapper.max > 0,
        baseStorage: 100,
        color: 'darkgoldenrod'
    },
    stoneTools: {
        name: "Stone Tools",
        shouldUnlock: () => temp.oasis.jobs.crafter.max > 0,
        baseStorage: 10,
        color: 'dimgrey'
    },
    salt: {
        name: "Salt",
        shouldUnlock: () => temp.oasis.jobs.saltFarmer.max > 0,
        produces: {
            salt: -1,
            food: -1,
            driedFood: 1
        },
        baseStorage: 10,
        color: 'slategrey'
    },
    driedFood: {
        name: "Preserved Food",
        shouldUnlock: () => temp.oasis.jobs.saltFarmer.max > 0,
        baseStorage: 100,
        color: 'olive'
    },
    labor: {
        name : "Days of Work",
        shouldUnlock: () => false
    },
    research: {
        name: "Research",
        shouldUnlock: () => false
    },
    sand: {
        name: "Sand",
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