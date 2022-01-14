class Building {
    constructor(name, description, display) {
        this.name = name
        this.description = description
        this.display = display
        this.jobs = {}
        this.storage = {}
        this.provided = []
        this.upgrades = []
        this.sandLimit = 0
        this.height = 0
        this.buried = ''
        this.ruined = ''
    }

    hasJob(job, amount) { this.jobs[job] = amount; return this}
    hasStorage(resource, amount) { this.storage[resource] = amount; return this }
    provides(...products) { this.provided.push(...products); return this }
    withUpgrades(...upgrades) { this.upgrades.push(...upgrades); return this }
    withDemolish(demolishText, building, provides = {}) {
        let demolishName = `demolish_${this.name}`
        actions[demolishName] = new DemolishAction(demolishText, building);
        actions[demolishName].provide = provides
        this.demolish = demolishName
        return this
    }
    withSandLimit(limit) { this.sandLimit = limit; return this }
    withHeight(height) { this.height = height; return this }
    withBuried(buried) { this.buried = buried; return this }
}

const buildings = {
    // Natural
    oasis: new Building("Oasis", "Lifegiving waters", colored('〰〰', '#6060ff', 'sub'))
                .provides('water')
                .withSandLimit(9),
    sand: new Building("Sand", "A vast, empty expanse", colored('〜〜〜', '#f6d7b0', 'sub'))
                .withUpgrades('buildFreeCampsite', 'buildCactusFarm', 'buildLookoutTower')
                .withSandLimit(Number.MAX_SAFE_INTEGER),
    soil: new Building("Soil", "Soft and fertile, perfect for plants to thrive", colored('____', '#9b7653', 'span'))
                .withUpgrades('buildFreeCampsite')
                .withSandLimit(Number.MAX_SAFE_INTEGER),
    cactus: new Building("Cactus", "Lonely and tall, a valuable source of fruit", `${colored('〜', '#f6d7b0', 'sub')}${colored('🌵', '#00cc00', 'span')}`)
                .hasJob('forager', 1)
                .withUpgrades('buildCactusFarm')
                .withDemolish('Cut down the Cactus', undefined, {food: 15})
                .withSandLimit(9),
    tree: new Building("Tree", "A cluster of palm trees, ripe for harvest", colored('↟↟↟', '#00ff00', 'span'))
                .hasJob('scavenger', 1)
                .withUpgrades('buildLoggingCamp')
                .withDemolish('Cut down the Trees', undefined, {wood: 15})
                .withSandLimit(24)
                .withHeight(1),

    // Nomadic
    campsite: new Building("Campsite", "A small but comfortable place to rest", colored('ᐱ', '#ffffff', 'span'))
                .provides('civilization')
                .hasStorage('people', 3).hasStorage('food', 30)
                .hasJob('builder', 1)
                .withDemolish('Demolish the Campsite')
                .withSandLimit(2)
                .withBuried('buriedCampsite'),
    buriedCampsite: new Building('', '', '').hasJob('builder', 1),
    sandPit: new Building("Sand Pit", "A small pit dug in the sand. Some small stones can be found poking out", colored('\\_/', '#f6d7b0', 'sub'))
                .hasJob('knapper', 1)
                .withDemolish('Fill in the Sand Pit')
                .withSandLimit(4),

    // Primitive
    encampment: new Building("Encampment", "A semi-permanent encampment", colored('ᐱᐱ', '#ffffff', 'span'))
                .provides('civilization')
                .hasStorage('people', 5).hasStorage('food', 50)
                .hasJob('builder', 2).hasJob('crafter', 1)
                .withDemolish('Demolish the Encampment')
                .withSandLimit(4),
    loggingCamp: new Building("Logging Camp", "Lumber is chopped and refined here from the scarce trees in the area", `${colored('↟', '#00ff00', 'span')}${colored('ᐱ', '#ffffff', 'span')}${colored('↟', '#00ff00', 'span')}`)
                .hasJob('logger', 2)
                .withDemolish('Demolish the Logging Camp', 'tree')
                .withSandLimit(9)
                .withHeight(1),
    quarry: new Building("Quarry", "A large open hole in the ground, providing precious construction materials", `${colored('⛏', '#f6d7b0', 'span')}`)
                .hasJob('miner', 3)
                .withDemolish('Fill in the Quarry')
                .withSandLimit(24),
    smallWarehouse: new Building("Small Warehouse", "A small yet spacious structure, built to store large amounts of material", colored('🞑', '#ffffff', 'h2'))
                .hasStorage('wood', 500).hasStorage('sandstone', 500).hasStorage('salt', 100).hasStorage('driedFood', 300).hasStorage('stoneTools', 100)
                .withDemolish('Tear down the Warehouse')
                .withSandLimit(9)
                .withHeight(1),

    // Stone Age
    settlement: new Building("Settlement", "A small, permanent settlement", `${colored('〜', '#f6d7b0', 'sub')}${colored('⊓', '#ffffff', 'h2')}`)
                .provides('civilization')
                .hasStorage('people', 15).hasStorage('food', 150)
                .hasJob('builder', 5).hasJob('crafter', 2).hasJob('elder', 1).hasJob('sweeper', 1)
                .withDemolish('Demolish the Settlement')
                .withSandLimit(6)
                .withHeight(1)
                .withBuried('buriedSettlement'),
    buriedSettlement: new Building('', '', '').hasJob('builder', 5).hasJob('sweeper', 1),
    basicFarm: new Building("Basic Farm", "A simple yet vibrant field", colored('↡↡↡↡', '#F5DEB3', 'span'))
                .hasJob('farmer', 2)
                .withDemolish('Clear out the Farm'),
    cactusFarm: new Building("Cactus Farm", "A prickly field full of cultivated cacti", colored('🌵🌵', '#00cc00', 'sub'))
                .hasJob('farmer', 1)
                .withDemolish('Abandon the Cacti', 'cactus')
                .withSandLimit(9),
    canal: new Building("Canal", "Dedicated channels allow water to be transported across the land", `${colored('\\', '#f6d7b0', 'span')}${colored('〰', '#6060ff', 'sub')}${colored('/', '#f6d7b0', 'span')}`)
                .provides('water')
                .withDemolish('Fill in the Canal')
                .withSandLimit(2),
    saltPool: new Building("Evaporation Pool", "A large flat evaporation surface allows salt and minerals to be easily harvested from the bubbling Oasis", colored('____', '#ffffff', 'span'))
                .hasJob('saltFarmer', 1)
                .withDemolish('Reclaim the Evaporation Pool')
                .withSandLimit(2),
    smallWall: new Building("Rudimentary Wall", "A rudimentary wall, built to protect the settlement from the encroaching sands", colored('|-|', '#ffffff', 'span'))
                .withSandLimit(9)
                .withHeight(2),

    // Exploration Age
    lookoutTower: new Building("Lookout Tower", "A tall tower from which the lay of the land may be discovered", colored('⌈⌉', '#ffffff', 'h2'))
                .provides('exploration')
                .withDemolish('Tear down the Lookout Tower')
                .withSandLimit(15)
                .withHeight(3),
    mine: new Building("Mine", "A deep mine from which the earth's bounty may be extracted", colored('⛏⛏', '#f6d7b0', 'h2')),
    mediumWarehouse: new Building("Medium Warehouse", "A spacious structure, built to store large amounts of material", colored('🞑🞑', '#ffffff', 'h2'))
                .hasStorage('wood', 2500).hasStorage('sandstone', 2500).hasStorage('salt', 500).hasStorage('driedFood', 1500).hasStorage('stoneTools', 500)
                .withDemolish('Tear down the Warehouse')
                .withSandLimit(14)
                .withHeight(1),
    mediumWall: new Building("Sturdy Wall", "A sturdy wall, built to protect the settlement from the encroaching sands", colored('|=|', '#ffffff', 'span'))
                .withSandLimit(19)
                .withHeight(3),
    camelFarm: new Building("Camel Pen", "An enclosed area in which camels can be raised and fed", colored('|🐪|', '#ffffff', 'span'))
                .withSandLimit(2),
    village: new Building("Village", "A small community center", colored('⊓⊓', '#ffffff', 'h2'))
                .provides('civilization')
                .hasStorage('people', 45).hasStorage('food', 450)
                .hasJob('builder', 12).hasJob('crafter', 5).hasJob('elder', 3).hasJob('sweeper', 2)
                .withDemolish('Demolish the Settlement')
                .withSandLimit(6)
                .withHeight(1),
    smelter: new Building("Smithy", "A group of forges, dedicated to the work of metal", colored('🔥', '#ffffff', 'h2')),

    largeWall: new Building("Towering Wall", "A towering wall, built to protect the settlement from the encroaching sands", colored('|≡|', '#ffffff', 'span'))
                .withSandLimit(39)
                .withHeight(4),
}

initActions()