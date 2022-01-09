class Building {
    constructor(name, description, display) {
        this.name = name
        this.description = description
        this.display = display
        this.jobs = {}
        this.storage = {}
        this.provided = []
        this.upgrades = []
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
}

const buildings = {
    // Natural
    oasis: new Building("Oasis", "Lifegiving waters", colored('〰〰', '#6060ff', 'sub'))
                .provides('water'),
    sand: new Building("Sand", "A vast, empty expanse", colored('〜〜〜', '#f6d7b0', 'sub'))
                .withUpgrades('buildFreeCampsite', 'buildSmallWarehouse'),
    soil: new Building("Soil", "Soft and fertile, perfect for plants to thrive", colored('____', '#9b7653', 'span'))
                .withUpgrades('buildFreeCampsite', 'buildSmallWarehouse'),
    cactus: new Building("Cactus", "Lonely and tall, a valuable source of fruit", `${colored('〜', '#f6d7b0', 'sub')}${colored('🌵', '#00cc00', 'span')}`)
                .hasJob('forager', 1)
                .withDemolish('Cut down the Cactus', undefined, {food: 15}),
    tree: new Building("Tree", "A cluster of palm trees, ripe for harvest", colored('↟↟↟', '#00ff00', 'span'))
                .hasJob('scavenger', 1)
                .withUpgrades('buildLoggingCamp')
                .withDemolish('Cut down the Trees', undefined, {wood: 15}),

    // Nomadic
    campsite: new Building("Campsite", "A small but comfortable place to rest", colored('ᐱ', '#ffffff', 'span'))
                .provides('civilization')
                .hasStorage('people', 3).hasStorage('food', 30)
                .hasJob('builder', 1)
                .withDemolish('Demolish the Campsite'),
    sandPit: new Building("Sand Pit", "A small pit dug in the sand. Some small stones can be found poking out", colored('\\_/', '#f6d7b0', 'sub'))
                .hasJob('knapper', 1)
                .withDemolish('Fill in the Sand Pit'),

    // Primitive
    encampment: new Building("Encampment", "A semi-permanent encampment", colored('ᐱᐱ', '#ffffff', 'span'))
                .provides('civilization')
                .hasStorage('people', 5).hasStorage('food', 50)
                .hasJob('builder', 2).hasJob('crafter', 1)
                .withDemolish('Demolish the Encampment'),
    loggingCamp: new Building("Logging Camp", "Lumber is chopped and refined here from the scarce trees in the area", `${colored('↟', '#00ff00', 'span')}${colored('ᐱ', '#ffffff', 'span')}${colored('↟', '#00ff00', 'span')}`)
                .hasJob('logger', 2)
                .withDemolish('Demolish the Logging Camp', 'tree'),
    quarry: new Building("Quarry", "A large open hole in the ground, providing precious construction materials", `${colored('⛏', '#f6d7b0', 'span')}`)
                .hasJob('miner', 3)
                .withDemolish('Fill in the Quarry'),
    smallWarehouse: new Building("Small Warehouse", "A small yet spacious structure, built to store large amounts of material", colored('🞑', '#ffffff', 'h2'))
                .hasStorage('wood', 500).hasStorage('sandstone', 500).hasStorage('salt', 100).hasStorage('driedFood', 300).hasStorage('stoneTools', 100)
                .withDemolish('Tear down the Warehouse'),

    // Stone Age
    settlement: new Building("Settlement", "A small, permanent settlement", `${colored('〜', '#f6d7b0', 'sub')}${colored('⊓', '#ffffff', 'h2')}`)
                .provides('civilization')
                .hasStorage('people', 15).hasStorage('food', 150)
                .hasJob('builder', 5).hasJob('crafter', 2).hasJob('elder', 1)
                .withDemolish('Demolish the Settlement'),
    basicFarm: new Building("Basic Farm", "A simple yet vibrant field", colored('↡↡↡↡', '#F5DEB3', 'span'))
                .hasJob('farmer', 2)
                .withDemolish('Clear out the Farm'),
    irrigatedFarm: new Building("Irrigated Farm", "Irrigation channels allow even better crop growth", `${colored('↡', '#F5DEB3', 'span')}${colored('〰', '#6060ff', 'sub')}${colored('↡', '#F5DEB3', 'span')}`)
                .provides('water')
                .hasJob('farmer', 3)
                .withDemolish('Clear out the Farm'),
    canal: new Building("Canal", "Dedicated channels allow water to be transported across the land", `${colored('\\', '#f6d7b0', 'span')}${colored('〰', '#6060ff', 'sub')}${colored('/', '#f6d7b0', 'span')}`)
                .provides('water')
                .withDemolish('Fill in the Canal'),
    saltPool: new Building("Evaporation Pool", "A large flat evaporation surface allows salt and minerals to be easily harvested from the bubbling Oasis", colored('〰〰', '#ffffff', 'sub'))
                .hasJob('saltFarmer', 1)
                .withDemolish('Reclaim the Evaporation Pool'),

    // Exploration Age
    lookoutTower: new Building("Lookout Tower", "A tall tower from which the lay of the land may be discovered", colored('⌈⌉', '#ffffff', 'h2'))
                .provides('exploration')
                .withDemolish('Tear down the Lookout Tower')
}

initActions()