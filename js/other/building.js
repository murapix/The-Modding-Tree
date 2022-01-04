class Building {
    constructor(name, description, display) {
        this.name = name
        this.description = description
        this.display = display
        this.jobs = {}
        this.storage = {}
        this.provided = []
        this.actions = []
    }

    hasJob(job, amount) { this.jobs[job] = amount; return this}
    hasStorage(resource, amount) { this.storage[resource] = amount; return this }
    provides(...products) { this.provided.push(...products); return this }
    withActions(...actions) { this.actions.push(...actions); return this }
}

const buildings = {
    sand: new Building("Sand", "A vast, empty expanse", colored('〜〜〜', '#f6d7b0', 'sub'))
                .withActions('buildFreeCampsite', 'buildCampsite', 'digDigsite'),
    oasis: new Building("Oasis", "Lifegiving waters", colored('〰〰', '#6060ff', 'sub')).provides('water'),

    campsite: new Building("Campsite", "A small but comfortable place to rest", colored('ᐱ', '#ffffff', 'span')).hasJob('builder', 1).hasStorage('people', 3)
                .withActions('upgradeCampsite', 'demolishCampsite'),
    encampment: new Building("Encampment", "A fledgling settlement", colored('ᐱᐱ', '#ffffff', 'span')).hasJob('builder', 2).hasStorage('people', 5)
                .withActions('demolishEncampment'),

    soil: new Building("Soil", "Soft and fertile, perfect for plants to thrive", colored('____', '#9b7653', 'span'))
                .withActions('buildFreeCampsite', 'buildBasicFarm', 'buildCampsite'),
    basicFarm: new Building("Basic Farm", "A simple yet vibrant field", colored('↡↡↡↡', '#F5DEB3', 'span')).hasJob('farmer', 3)
                .withActions('upgradeBasicFarm', 'demolishBasicFarm'),
    irrigatedFarm: new Building("Irrigated Farm", "Irrigation channels allow even better crop growth", `${colored('↡', '#F5DEB3', 'span')}${colored('〰', '#6060ff', 'sub')}${colored('↡', '#F5DEB3', 'span')}`).provides('water').hasJob('farmer', 3)
                .withActions('demolishIrrigatedFarm'),

    cactus: new Building("Cactus", "Lonely and tall, a valuable source of fruit", `${colored('〜', '#f6d7b0', 'sub')}${colored('🌵', '#00cc00', 'span')}`).hasJob('forager', 1)
                .withActions('clearCactus'),
    tree: new Building("Tree", "A cluster of palm trees, ripe for harvest", colored('↟↟↟', '#00ff00', 'span')).hasJob('forager', 1)
                .withActions('buildLoggingCamp', 'clearTrees'),
    loggingCamp: new Building("Logging Camp", "Lumber is chopped and refined here from the scarce trees in the area", `${colored('↟', '#00ff00', 'span')}${colored('ᐱ', '#ffffff', 'span')}${colored('↟', '#00ff00', 'span')}`).hasJob('logger', 2)
                .withActions('demolishLoggingCamp'),

    digsite: new Building("Digsite", "The sands have been dug away, allowing access to the bedrock beneath", `${colored('⛏', '#f6d7b0', 'span')}`).hasJob('miner', 3)
                .withActions('digQuarry', 'fillDigsite'),
    quarry: new Building("Quarry", "A large open hole in the ground, providing precious construction materials", `${colored('⛏⛏', '#f6d7b0', 'sub')}`).hasJob('miner', 10)
                .withActions('fillQuarry')
}