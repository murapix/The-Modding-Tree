class Job {
    constructor(id, name, produces = {}, consumes = {}) {
        this.name = name
        this.produces = produces
        this.consumes = consumes
        this.shouldUnlock = () => temp.oasis.jobs[id].max > 0
        this.shouldShow = () => true
    }

    workAmount() {
        let max = Number.MAX_SAFE_INTEGER
        for ([resource, amount] of Object.entries(this.consumes)) {
            let available = player.oasis.resources[resource].amount
            let workable = Math.floor(available / (amount))
            if (workable < max)
                max = workable
        }
        for ([resource, amount] of Object.entries(this.produces)) {
            let freeSpace = player.oasis.resources[resource].max - player.oasis.resources[resource].amount
            let workable = Math.ceil(freeSpace / (amount))
            if (workable < max)
                max = workable
        }
        return max
    }

    getWork(workers) {
        let production = {}

        let workAmount = Math.min(this.workAmount(), workers)
        for ([resource, amount] of Object.entries(this.consumes))
            production[resource] = (production[resource] ?? 0) - (amount * workAmount)
        for ([resource, amount] of Object.entries(this.produces))
            production[resource] = (production[resource] ?? 0) + (amount * workAmount)

        return production
    }

    setShouldUnlock(shouldUnlock) { this.shouldUnlock = shouldUnlock; return this }
    setShouldShow(shouldShow) { this.shouldShow = shouldShow; return this }
}

const jobs = {
    builder: new Job('builder', "Builder"),
    forager: new Job('forager', "Forager", {'food': 2}).setShouldShow(() => temp.oasis.jobs.forager.max > 0),
    scavenger: new Job('scavenger', "Scavenger", {'wood': 1}).setShouldShow(() => temp.oasis.jobs.scavenger.max > 0),
    knapper: new Job('knapper', "Knapper", {'sandstone': 1}).setShouldShow(() => temp.oasis.jobs.knapper.max > 0),
    farmer: new Job('farmer', "Farmer", {'food': 4}),
    logger: new Job('logger', "Logger", {'wood': 2}),
    miner: new Job('miner', "Miner", {'sandstone': 2}),
    crafter: new Job('crafter', "Crafter", {'stoneTools': 1}, {'wood': 1, 'sandstone': 1}),
    elder: new Job('elder', "Elder", {'research': 1}),
    saltFarmer: new Job('saltFarmer', "Salt Farmer", {'salt': 1}),
    astrologist: new Job('astrologist', "Astrologist", {'research': 3}),
}