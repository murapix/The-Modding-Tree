class Job {
    constructor(name, produces = {}, consumes = {}) {
        this.name = name
        this.produces = produces
        this.consumes = consumes
        this.shown = false
        this.shouldShow = false
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

    setShown() { this.shown = true; return this }
    setShouldShow(shouldShow) { this.shouldShow = shouldShow; return this }
}

const jobs = {
    builder: new Job("Builder").setShown(),
    forager: new Job("Forager", {'food': 2}).setShown(),
    farmer: new Job("Farmer", {'food': 4}),
    logger: new Job("Logger", {'wood': 1}),
    miner: new Job("Miner", {'sandstone': 1}),
}