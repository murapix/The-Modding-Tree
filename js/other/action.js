class Action {
    constructor(name) {
        this.name = name
        this.canRun = () => true
        this.requirementText = ''
        this.stateCheck = () => !player.oasis.grid[player.oasis.selectedTile]?.action && temp.oasis.resources.people.max > 0
        this.unlocked = () => true
    }

    setCanRun(requirementText, canRun) { this.requirementText = requirementText; this.canRun = canRun; return this }
    setUnlocked(unlocked) { this.unlocked = unlocked; return this }
}

class BuildAction extends Action {
    constructor(name, building) {
        super(name)
        this.building = building
        this.cost = {}
    }

    costs(resource, amount) { this.cost[resource] = amount; return this }
}

class DemolishAction extends Action {
    constructor(name, building = '') {
        super(name)
        this.building = building
        this.provide = {}
    }

    getOutputBuilding() { return this.building ? this.building : ((temp.oasis.countResourcesAroundSelected?.[1]?.water ?? 0) - (temp.oasis.countResourcesAroundSelected?.[0]?.water ?? 0)) > 0 ? 'soil' : 'sand' }
    provides(resource, amount) { this.provide[resource] = amount; return this }
}

const actions = {
    buildFreeCampsite: new BuildAction("Settle", "campsite").setCanRun("Must be within 2 tiles of Water", () => (temp.oasis.countResourcesAroundSelected?.[2]?.water ?? 0) > 0),
    buildCampsite: new BuildAction("Build a Campsite", "campsite").setCanRun("Must be within 2 tiles of Water", () => (temp.oasis.countResourcesAroundSelected?.[2]?.water ?? 0) > 0).costs('wood', 10),
    demolishCampsite: new DemolishAction("Demolish the Campsite"),
    upgradeCampsite: new BuildAction("Expand the Campsite", "encampment").costs('wood', 25),
    demolishEncampment: new DemolishAction("Demolish the Encampment"),
    
    buildBasicFarm: new BuildAction("Plow a Farm", "basicFarm").setCanRun("Must be adjacent to Water", () => (temp.oasis.countResourcesAroundSelected?.[1]?.water ?? 0) > 0).costs('labor', 10),
    demolishBasicFarm: new DemolishAction("Demolish the Farm"),
    upgradeBasicFarm: new BuildAction("Dig irrigation canals", "irrigatedFarm"),
    demolishIrrigatedFarm: new DemolishAction("Demolish the Farm"),

    clearCactus: new DemolishAction("Cut down the Cactus").provides('food', 15),
    clearTrees: new DemolishAction("Cut down the Trees").provides('wood', 15),
    buildLoggingCamp: new BuildAction("Set up logging operations", "loggingCamp").costs('labor', 10),
    demolishLoggingCamp: new DemolishAction("Demolish the Logging Camp", "tree"),

    digDigsite: new BuildAction("Dig down to bedrock", "digsite").costs('labor', 60),
    fillDigsite: new DemolishAction("Fill in the Digsite"),
    digQuarry: new BuildAction("Mine out a quarry", "quarry").costs('labor', 180),
    fillQuarry: new DemolishAction("Fill in the Quarry"),
}

actions.buildFreeCampsite.stateCheck = () => !(player.oasis.grid[player.oasis.selectedTile]?.action ?? true) && temp.oasis.resources.people.max <= 0