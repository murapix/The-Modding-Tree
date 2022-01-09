const baseVision = 4
const maxVision = 12

const baseSize = 2*baseVision+1
const maxSize = 2*maxVision+1
const oasis = ((baseSize+1)*100 + (baseSize+1))/2
const freshOasis = function() {
    let distances = new Array(baseVision+1).fill().map(u => ([]))
    for (let row = 1; row <= baseSize; row++) {
        for (let col = 1; col <= baseSize; col++) {
            let distance = Math.max(Math.abs(row-(baseVision+1)), Math.abs(col-(baseVision+1)))
            distances[distance].push(row*100+col)
        }
    }

    let grid = {}
    distances[0].forEach(id => grid[id] = 'oasis')
    distances[1].sort(() => 0.5 - Math.random()).forEach((id, index) => grid[id] = index < 3 ? 'tree' : 'soil')
    distances[2].sort(() => 0.5 - Math.random()).forEach((id, index) => grid[id] = index < 3 ? 'cactus' : 'sand')
    distances[3].sort(() => 0.5 - Math.random()).forEach((id, index) => grid[id] = index < 3 ? 'cactus' : 'sand')
    distances[4].sort(() => 0.5 - Math.random()).forEach((id, index) => grid[id] = index < 4 ? 'cactus' : 'sand')

    return grid
}()

addLayer("oasis", {
    type: "none",

    row: 0,
    position: 0,
    color: "#f6d7b0",
    
    startData() {
        let startData  = {
            unlocked: true,
            unemployed: 0,
            resources: {},
            jobs: {},
            time: { day: 1, month: 1, year: 1 },
            previousPopulation: 0
        }
        for ([resource, data] of Object.entries(resources)) {
            startData.resources[resource] = {
                unlocked: data.unlocked ?? false,
                amount: data.initialAmount ?? 0
            }
        }
        for ([job, data] of Object.entries(jobs)) {
            startData.jobs[job] = {
                unlocked: false,
                amount: 0
            }
        }
        startData.jobs.forager.amount = 3
        return startData
    },

    update() {
        if (temp.oasis.explored != temp.oasis.lastExplored) shiftOasis()

        if (temp.oasis.resources.people.max <= 0) player.gameSpeed = 0
        { // Update time
            player.oasis.time.day++
            if (player.oasis.time.day > 30) {
                player.oasis.time.day -= 30
                player.oasis.time.month++
            }
            if (player.oasis.time.month > 12) {
                player.oasis.time.month -= 12
                player.oasis.time.year++
            }
        }

        { // Update resources
            let resources = player.oasis.resources

            for ([resource, data] of Object.entries(temp.oasis.resources)) {
                if (data.unlocked) resources[resource].unlocked = true
            }

            for ([resource, amount] of Object.entries(temp.oasis.production)) {
                let change = clamp(amount, -resources[resource].amount, temp.oasis.resources[resource].max - resources[resource].amount)
                resources[resource].amount += change
                if (resource === 'people')
                    player.oasis.unemployed += change
            }
        }
        
        { // Update build projects
            let builderCount = player.oasis.jobs.builder.amount
            let buildProjects = []
            for (let row = 1; row <= temp.oasis.grid.rows; row++) {
                for (let col = 1; col <= temp.oasis.grid.cols; col++) {
                    if (player.oasis.grid[row*100+col].action) {
                        buildProjects.push(row*100+col)
                    }
                }
            }
            let buildersPerProject = ~~(builderCount / buildProjects.length)
            let remainingBuilders = builderCount % buildProjects.length
            let builderCounts = []
            for (let i = 1; i <= buildProjects.length; i++) {
                builderCounts.push(buildersPerProject + (i <= remainingBuilders ? 1 : 0))
            }

            for (let i = 0; i < buildProjects.length; i++) {
                for ([resource, amount] of Object.entries(player.oasis.grid[buildProjects[i]].progress)) {
                    if (resource === 'labor') continue
                    if (builderCounts[i] === 0) break
                    let resourceAmount = player.oasis.resources[resource].amount
                    let usableAmount = Math.min(resourceAmount, builderCounts[i], amount)
                    player.oasis.grid[buildProjects[i]].progress[resource] -= usableAmount
                    player.oasis.resources[resource].amount -= usableAmount
                    builderCounts[i] -= usableAmount
                }
                if (builderCounts[i] > 0 && (player.oasis.grid[buildProjects[i]].progress.labor ?? 0) > 0) {
                    let usableAmount = Math.min(player.oasis.grid[buildProjects[i]].progress.labor, builderCounts[i])
                    player.oasis.grid[buildProjects[i]].progress.labor -= usableAmount
                    builderCounts[i] -= usableAmount
                }
                if (Object.values(player.oasis.grid[buildProjects[i]].progress).filter(amount => amount > 0).length === 0) {
                    player.oasis.grid[buildProjects[i]].building = actions[player.oasis.grid[buildProjects[i]].action].building
                    player.oasis.grid[buildProjects[i]].action = ''
                    player.oasis.grid[buildProjects[i]].progress = {}
                }
                if (i < buildProjects.length - 1 && builderCounts[i] > 0)
                    builderCounts[i+1] += builderCounts[i]
            }
        }

        { // Update sand/soil
            let waterLocs = []
            for (let row = 1; row < temp.oasis.grid.rows; row++) {
                for (let col = 1; col < temp.oasis.grid.cols; col++) {
                    let loc = row*100+col
                    if (buildings[player.oasis.grid[loc].building].provided.includes('water'))
                        waterLocs.push(loc)
                    else if (player.oasis.grid[loc].building === 'soil') player.oasis.grid[loc].building = 'sand'
                }
            }

            for (waterLoc of waterLocs) {
                for (adjacent of [waterLoc-101, waterLoc-100, waterLoc-99, waterLoc-1, waterLoc+1, waterLoc+99, waterLoc+100, waterLoc+101]) {
                    if (!player.oasis.grid[adjacent]) continue
                    if (player.oasis.grid[adjacent].building === 'sand') player.oasis.grid[adjacent].building = 'soil'
                }
            }
        }

        { // Update unlocks
            for ([resource, data] of Object.entries(temp.oasis.resources))
                if (data.unlocked) player.oasis.resources[resource].unlocked = true
            for ([job, data] of Object.entries(temp.oasis.jobs))
                if (data.unlocked) player.oasis.jobs[job].unlocked = true
        }
    },

    grid: {
        rows: () => 2*temp.oasis.explored+1, maxRows: maxSize,
        cols: () => 2*temp.oasis.explored+1, maxCols: maxSize,
        getStartData(id) { return {
            building: freshOasis[id] ?? 'sand',
            progress: {},
            action: '',
         } },
        getUnlocked(id) { return true },
        getCanClick(data, id) { return true },
        onClick(data, id) {
            if (player.oasis.selectedTile == id) player.oasis.selectedTile = 0
            else player.oasis.selectedTile = id
        },
        getDisplay(data, id) { return buildings[data.building].display },
        getStyle(data, id) {
            let style = {}
            if (id == player.oasis.selectedTile) style['border'] = '1px solid #888888'
            else if (data.action) style['border'] = '1px solid #f6d7b0'
            return style
        }
    },

    bars: {},
    resources: function(){
        let resourceData = {}
        for ([resource, data] of Object.entries(resources)) {
            let consumes = data.consumes
            let produces = data.produces
            resourceData[resource] = {
                max: 0,
                id: resource,
                name: data.name,
                unlocked: data.shouldUnlock ?? false,
                consumed: consumes ? function() { return Object.fromEntries(Object.entries(consumes).map(([resource, amount]) => [resource, amount*player.oasis.resources[this.id].amount])) } : {},
                produced: produces ? function() { return Object.fromEntries(Object.entries(produces).map(([resource, amount]) => [resource, amount*player.oasis.resources[this.id].amount])) } : {}
            }
        }
        return resourceData
    }(),
    countStorage() {
        let storage = Object.fromEntries(Object.keys(temp.oasis.resources).map(resource => [resource, 0]))
        for ([building, count] of Object.entries(temp.oasis.buildings)) {
            for ([resource, amount] of Object.entries(buildings[building].storage)) {
                storage[resource] = (storage[resource] ?? 0) + amount*count
            }
        }
        for (resource in temp.oasis.resources)
            storage[resource] = Math.max(resources[resource].baseStorage ?? 0, storage[resource] ?? 0)
        for ([resource, amount] of Object.entries(storage)) {
            layers.oasis.resources[resource].max = amount
            temp.oasis.resources[resource].max = amount
        }
    },
    countResourcesAroundSelected() {
        if (player.oasis.grid[player.oasis.selectedTile]) {
            let selectedRow = ~~(player.oasis.selectedTile/100)
            let selectedCol = player.oasis.selectedTile%100
            let distances = new Array(maxSize).fill().map(u => ({}))

            for (let row = 1; row <= temp.oasis.grid.rows; row++) {
                for(let col = 1; col <= temp.oasis.grid.cols; col++) {
                    let distance = Math.max(Math.abs(row-selectedRow), Math.abs(col-selectedCol))
                    for (resource of buildings[player.oasis.grid[row*100+col].building].provided) {
                        distances[distance][resource] = (distances[distance][resource] ?? 0) + 1
                    }
                }
            }
            for (let distance = 0; distance < distances.length-1; distance++) {
                for ([resource, amount] of Object.entries(distances[distance])) {
                    distances[distance+1][resource] = (distances[distance+1][resource] ?? 0) + amount
                }
            }

            return distances
        }
    },

    clickables: {},
    jobs: function() {
        let jobData = {}
        for ([job, data] of Object.entries(jobs)) {
            jobData[job] = {
                max: Number.MAX_SAFE_INTEGER,
                name: data.name,
                unlocked: data.shouldUnlock ?? false,
                shown: data.shouldShow ?? true
            }
        }
        return jobData
    }(),
    countJobs() {
        let jobs = Object.fromEntries(Object.entries(temp.oasis.jobs).map(entry => [entry[0], 0]))
        for (let job in jobs) { jobs[job] = 0 }

        for ([building, count] of Object.entries(temp.oasis.buildings)) {
            for ([job, amount] of Object.entries(buildings[building].jobs)) {
                jobs[job] = (jobs[job] ?? 0) + amount*count
            }
        }
        for([job, amount] of Object.entries(jobs)) {
            layers.oasis.jobs[job].max = amount
            temp.oasis.jobs[job].max = amount
        }
        if (temp.oasis.buildings) {
            for ([job, data] of Object.entries(player.oasis.jobs)) {
                if (temp.oasis.jobs[job].max < data.amount) {
                    player.oasis.unemployed -= temp.oasis.jobs[job].max - data.amount
                    data.amount = temp.oasis.jobs[job].max
                }
            }
        }
        if (player.oasis.unemployed < 0) {
            Object.values(player.oasis.jobs).reverse().forEach(data => {
                if (player.oasis.unemployed >= 0) return
                if (data.amount >= -player.oasis.unemployed) {
                    data.amount += player.oasis.unemployed
                    player.oasis.unemployed = 0
                }
                else {
                    player.oasis.unemployed += data.amount
                    data.amount = 0
                }
            })
        }
    },

    lastExplored() {
        return temp.oasis.explored
    },
    explored() {
        return baseVision
    },

    buildings() {
        let buildingCounts = {}
        for (let data of Object.values(player.oasis.grid))
            buildingCounts[data.building] = (buildingCounts[data.building] ?? 0) + 1
        return buildingCounts
    },
    production() {
        let production = {}

        for (data of Object.values(temp.oasis.resources)) {
            for ([resource, amount] of Object.entries(data.consumed)) {
                production[resource] = (production[resource] ?? 0) - amount
            }
        }

        for ([job, data] of Object.entries(player.oasis.jobs)) {
            for ([resource, amount] of Object.entries(jobs[job].getWork(data.amount))) {
                production[resource] = (production[resource] ?? 0) + amount
            }
        }

        for (data of Object.values(temp.oasis.resources)) {
            let productionRatios = []
            for ([resource, amount] of Object.entries(data.produced)) {
                if (amount > 0) {
                    if (player.oasis.resources[resource].amount >= temp.oasis.resources[resource].max) productionRatios.push(0)
                    else productionRatios.push((temp.oasis.resources[resource].max - player.oasis.resources[resource].amount) / amount)
                }
                else if (amount < 0) {
                    productionRatios.push(player.oasis.resources[resource].amount / -amount)
                }
                else productionRatios.push(0)
            }
            let productionRatio = Math.min(1, ...productionRatios)
            for ([resource, amount] of Object.entries(data.produced)) {
                production[resource] = (production[resource] ?? 0) + ~~(amount*productionRatio)
            }
        }

        if ((production.food ?? 0) < -player.oasis.resources.food.amount) {
            production.driedFood = production.food + player.oasis.resources.food.amount
            production.food -= player.oasis.resources.food.amount
        }
        if ((production.food ?? 0) + (production.driedFood ?? 0) < 0) {
            if ((player.oasis.resources.food.amount ?? 0) + (player.oasis.resources.driedFood.amount ?? 0) === 0) {
                production.people = Math.floor(production.food/30)
            }
        }
        else {
            if (player.oasis.time.day === 1) player.oasis.previousPopulation = player.oasis.resources.people.amount
            if (player.oasis.resources.people.amount < temp.oasis.resources.people.max) {
                if (player.oasis.previousPopulatoin > 60)
                    production.people = Math.min(~~(player.oasis.previousPopulation/60), temp.oasis.resources.people.max - player.oasis.resources.people.amount)
                else if (player.oasis.time.day <= player.oasis.previousPopulation/2)
                    production.people = Math.min(1, temp.oasis.resources.people.max - player.oasis.resources.people.amount)
            }
        }

        return production
    },

    tabFormat: () => {
        let oasisHeight = `${temp.oasis.grid.rows*24 + 34}px`
        let oasisScale = `scale(${(temp.oasis.resources.people.max > 0) ? 1 : 0}, 1)`
        let tabFormat = [
            "blank",
            ["oasis-row", [
                ["column", [
                    ["display-text", "Resources"],
                    "blank",
                    ["resource-grid", ["people", "food", "driedFood", "wood", "sandstone", "salt", "stoneTools" ]]
                ], {'width': '275px', 'transform-origin': 'right', 'transform': oasisScale, 'transition': 'transform 0.5s !important'}],
                ["blank", ['20px', '20px']],
                ["v-line", oasisHeight, {'transform-origin': 'right', 'transform': oasisScale}],
                ["blank", ['20px', '20px']],    
                ["column", [
                    ["display-text", `${temp.oasis.resources.people.max > 0 ? 'Map' : 'Your people look for a place to settle down'}`],
                    "blank",
                    "grid"
                ]],
                ["blank", ['20px', '20px']],
                ["v-line", oasisHeight, {'transform-origin': 'left', 'transform': oasisScale}],
                ["blank", ['20px', '20px']],
                ["column", [
                    ["display-text", "Jobs"],
                    "blank",
                    ["job-grid", ["builder", "forager", "scavenger", "knapper", "farmer", "logger", "miner", "saltFarmer", "crafter", "elder"]]
                ], {'width': '275px', 'transform-origin': 'left', 'transform': oasisScale, 'transition': 'transform 0.5s !important'}]
            ]],
            "blank"
        ]

        if (player.oasis.grid[player.oasis.selectedTile]) {
            let building = player.oasis.grid[player.oasis.selectedTile].building

            let toDisplay = [`<h2>${buildings[player.oasis.grid[player.oasis.selectedTile].building].name}</h2>`,
                             buildings[building].description]
            let provided = buildings[building].provided
            if (provided.length > 0) toDisplay.push(`Provides a source of ${provided.map(resource => terrainResources[resource].name).join(', ')}`)
            let stored = buildings[building].storage
            if (Object.keys(stored).length > 0) toDisplay.push(`Contains space for ${Object.entries(stored).map(([resource, amount]) => `${formatWhole(amount)} ${resources[resource].name}`).join(', ')}`)
            let buildingJobs = buildings[building].jobs
            if (Object.keys(buildingJobs).length > 0) toDisplay.push(`Supports ${Object.entries(buildingJobs).map(([job, amount]) => `${formatWhole(amount)} ${jobs[job].name}${amount === 1 ? '' : 's'}`).join(', ')}`)
            if (player.oasis.grid[player.oasis.selectedTile].action) {
                toDisplay.push('<br>',
                               `In Progress: ${actions[player.oasis.grid[player.oasis.selectedTile].action].name}`,
                               'Remaining Resources:')
                for ([resource, amount] of Object.entries(player.oasis.grid[player.oasis.selectedTile].progress)) {
                    if (amount > 0) toDisplay.push(`${resources[resource].name}: ${formatWhole(amount)}`)
                }
            }
            tabFormat.push(...(toDisplay.map(line => ["display-text", line])), "blank")

            let actionList = new Set()
            for (let action of buildings[building].upgrades) {
                if (temp.oasis.clickables[action].unlocked) {
                    actionList.add(action)
                }
            }
            actionList = [...actionList]
            if (buildings[building].demolish) {
                actionList.push(buildings[building].demolish)
            }
            for (let i = 0; i < actionList.length; i += 5) {
                tabFormat.push(["row", actionList.slice(i, i+5).map(action => ["clickable", action])])
            }
            tabFormat.push(["clickable", "cancelBuild"])
        }

        return tabFormat
    }
})

function shiftOasis() {
    let prevSize = temp.oasis.lastExplored
    let newSize = temp.oasis.explored

    let shift = newSize - prevSize
    console.log(shift)
    // if (shift > 0) {
    //     for (let row = temp.oasis.grid.rows; row > shift; row--) {
    //         for (let col = temp.oasis.grid.cols; col > shift; col--) {
    //             player.oasis.grid[row*100+col] = player.oasis.grid[(row-shift)*100+(col-shift)]
    //         }
    //     }
    // }
    // else {
    //     for (let row = 1; row < temp.oasis.grid.rows-shift; row++) {
    //         for (let col = 1; col < temp.oasis.grid.rows-shift; col++) {
    //             player.oasis.grid[row*100+col] = player.oasis.grid[(row+shift)*100+(col+shift)]
    //         }
    //     }
    // }
}

function createResourceBars(bars) {
    for (resource in layers.oasis.resources) {
        bars[resource] = {
            direction: RIGHT,
            width: 100,
            height: 20,
            progress() { return player.oasis.resources[this.id].amount / temp.oasis.resources[this.id].max },
            display() { return `<span>${formatWhole(player.oasis.resources[this.id].amount)}/${formatWhole(temp.oasis.resources[this.id].max)}</span>` },
            fillStyle() { return { 'background-color': '#0000ff' } },
        }
    }
}

function createJobButtons(clickables) {
    for (job in layers.oasis.jobs) {
        clickables[`${job}-up`] = {
            display: `+`,
            canClick() { return player.oasis.jobs[this.job].amount < temp.oasis.jobs[this.job].max && player.oasis.unemployed > 0 },
            onClick() {
                let increment = 0
                switch (shiftDown + 2*ctrlDown) {
                    case 0: increment = 1; break
                    case 1: increment = 5; break
                    case 2: increment = 25; break
                    case 3: increment = Number.MAX_SAFE_INTEGER; break
                }
                increment = Math.min(increment, temp.oasis.jobs[this.job].max - player.oasis.jobs[this.job].amount, player.oasis.unemployed)
                player.oasis.jobs[this.job].amount += increment
                player.oasis.unemployed -= increment
            },
            style: {
                'width': '20px',
                'min-height': '20px',
            },
            job: job
        }
        clickables[`${job}-down`] = {
            display: `-`,
            canClick() { return player.oasis.jobs[this.job].amount > 0 },
            onClick() {
                let increment = 0
                switch (shiftDown + 2*ctrlDown) {
                    case 0: increment = 1; break
                    case 1: increment = 5; break
                    case 2: increment = 25; break
                    case 3: increment = Number.MAX_SAFE_INTEGER; break
                }
                increment = Math.min(increment, player.oasis.jobs[this.job].amount)
                player.oasis.jobs[this.job].amount -= increment
                player.oasis.unemployed += increment
            },
            style: {
                'width': '20px',
                'min-height': '20px',
            },
            job: job
        }
    }
}

function createActionButtons(clickables) {
    for (action in actions) {
        if (actions[action] instanceof BuildAction) {
            clickables[action] = {
                title() { return `<b>${actions[this.action].name}<br>${buildings[actions[this.action].building].display}</b>` },
                display: '',
                unlocked() { return actions[this.action].stateCheck() && actions[this.action].unlocked() },
                canClick() { return actions[this.action].stateCheck() && actions[this.action].canRun() },
                onClick() {
                    player.oasis.grid[player.oasis.selectedTile].action = this.action
                    player.oasis.grid[player.oasis.selectedTile].progress = {...actions[this.action].cost}
                },
                tooltip() {
                    let building = buildings[actions[this.action].building]
                    let toDisplay = [`<h2>${building.name}</h2>`,
                                     building.description]
                    let provided = building.provided
                    if (provided.length > 0) toDisplay.push(`Provides a source of ${provided.map(resource => terrainResources[resource].name).join(', ')}`)
                    let stored = building.storage
            if (Object.keys(stored).length > 0) toDisplay.push(`Contains space for ${Object.entries(stored).map(([resource, amount]) => `${formatWhole(amount)} ${resources[resource].name}`).join(', ')}`)
                    let buildingJobs = building.jobs
                    if (Object.keys(buildingJobs).length > 0) toDisplay.push(`Supports ${Object.entries(buildingJobs).map(([job, amount]) => `${formatWhole(amount)} ${jobs[job].name}${amount === 1 ? '' : 's'}`).join(', ')}`)
                    if (!temp.oasis.clickables[this.id].canClick) toDisplay.push(`<br>${colored(actions[this.action].requirementText, '#dd0000', 'h3')}`)

                    if (Object.keys(actions[this.action].cost).length > 0) {
                        toDisplay.push('<br>Will Require:')
                        for ([resource, amount] of Object.entries(actions[this.action].cost)) {
                            if (amount > 0) toDisplay.push(`${resources[resource].name}: ${formatWhole(amount)}`)
                        }
                    }

                    return toDisplay.join('<br>')
                },
                style() { return {
                        'background-color': '#000000',
                        'color': '#ffffff',
                        'border': temp.oasis.clickables[this.id].canClick ? '2px solid #f6d7b0' : '2px solid #888888',
                        'margin': '0px 10px'
                    }
                },
                action: action
            }
        }
        else if (actions[action] instanceof DemolishAction) {
            clickables[action] = {
                title() { return `<b>${actions[this.action].name}<br>${buildings[actions[this.action].getOutputBuilding()].display}</b>` },
                display: '',
                unlocked() { return actions[this.action].stateCheck() && actions[this.action].unlocked() },
                canClick() { return actions[this.action].stateCheck() && actions[this.action].canRun() },
                onClick() {
                    player.oasis.grid[player.oasis.selectedTile].action = ''
                    player.oasis.grid[player.oasis.selectedTile].progress = {}
                    player.oasis.grid[player.oasis.selectedTile].building = actions[this.action].getOutputBuilding()
                },
                tooltip() {
                    let building = buildings[actions[this.action].getOutputBuilding()]
                    let toDisplay = [`<h2>${building.name}</h2>`,
                                     building.description]
                    let provided = building.provided
                    if (provided.length > 0) toDisplay.push(`Provides a source of ${provided.map(resource => terrainResources[resource].name).join(', ')}`)
                    let buildingJobs = building.jobs
                    if (Object.keys(buildingJobs).length > 0) toDisplay.push(`Supports ${Object.entries(buildingJobs).map(entry => `${formatWhole(entry[1])} ${jobs[entry[0]].name}${entry[1] === 1 ? '' : 's'}`).join(', ')}`)
                    if (!temp.oasis.clickables[this.id].canClick) toDisplay.push(`<br>${colored(actions[this.action].requirementText, '#880000', 'span')}`)
                    return toDisplay.join('<br>')
                },
                style() { return {
                        'background-color': '#000000',
                        'color': '#ffffff',
                        'border': temp.oasis.clickables[this.id].canClick ? '2px solid #ffa430' : '2px solid #888888',
                        'margin': '0px 10px'
                    }
                },
                action: action
            }
        }
    }

    clickables.buildFreeCampsite.onClick = () => {
        player.oasis.grid[player.oasis.selectedTile].action = ''
        player.oasis.grid[player.oasis.selectedTile].progress = {}
        player.oasis.grid[player.oasis.selectedTile].building = 'campsite'
        player.gameSpeed = 1
    }

    clickables.cancelBuild = {
        title: 'Cancel Construction',
        display: 'Spent resources will be lost',
        unlocked() { return Boolean(player.oasis.grid[player.oasis.selectedTile]?.action) },
        canClick() { return Boolean(player.oasis.grid[player.oasis.selectedTile]?.action) },
        onClick() {
            player.oasis.grid[player.oasis.selectedTile].action = ''
            player.oasis.grid[player.oasis.selectedTile].progress = {}
        },
        style() { return {
            'background-color': '#000000',
            'color': '#ffffff',
            'border': temp.oasis.clickables[this.id].canClick ? '2px solid #ffa430' : '2px solid #888888',
            'margin': '0px 10px'
        } }
    }
}

function loadOasisVue() {
    Vue.component('oasis-row', {
        props: ['layer', 'data'],
        computed: {
            key() {return this.$vnode.key}
        },
        template: `
        <div class="upgTable instant">
            <div class="upgRow">
                <div v-for="(item, index) in data" style="margin-top: 0">
                    <div v-if="!Array.isArray(item)" v-bind:is="item" :layer= "layer" v-bind:style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
                    <div v-else-if="item.length==3" v-bind:style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" :key="key + '-' + index"></div>
                    <div v-else-if="item.length==2" v-bind:is="item[0]" :layer= "layer" :data= "item[1]" v-bind:style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
                </div>
            </div>
        </div>
        `
    })

    Vue.component('resource-grid', {
        props: ['layer', 'data'],
        computed: {
            key() { return this.$vnode.key },
            unlocked() { return this.data.filter(resource => player.oasis.resources[resource].unlocked) }
        },
        template: `
        <table>
            <tr v-for="resource in unlocked">
                <td style='text-align: left'><display-text :layer="layer" :data="temp.oasis.resources[resource].name"></display-text></td>
                <td><blank :layer="layer" :data="['20px', '17px']"></blank></td>
                <td><bar :layer="layer" :data="resource"></bar></td>
                <td><blank :layer="layer" :data="['20px', '17px']"></blank></td>
                <td style='text-align: right'><display-text :layer="layer" :data="(temp.oasis.production[resource] ?? 0) + '/day'"></display-text></td>
            </tr>
        </table>
        `
    })

    Vue.component('job-grid', {
        props: ['layer', 'data'],
        computed: {
            key() { return this.$vnode.key },
            unlocked() { return this.data.filter(job => player.oasis.jobs[job].unlocked && temp.oasis.jobs[job].shown) }
        },
        template: `
        <table>
            <tr>
                <td style='text-align: left'><display-text :layer="layer" :data="'Unemployed'"></display-text></td>
                <td><blank :layer="layer" :data="['20px', '17px']"></blank></td>
                <td><blank :layer="layer" :data="['20px', '17px']"></blank></td>
                <td style='text-align: right'><display-text :layer="layer" :data="formatWhole(player.oasis.unemployed)+'/'+formatWhole(player.oasis.resources.people.amount)"></display-text></td>
            </tr>
            <tr v-for="job in unlocked">
                <td style='text-align: left'><display-text :layer="layer" :data="temp.oasis.jobs[job].name"></display-text></td>
                <td><blank :layer="layer" :data="['20px', '17px']"></blank></td>
                <td><clickable :layer="layer" :data="job+'-up'"></clickable></td>
                <td style='text-align: right'><display-text :layer="layer" :data="formatWhole(player.oasis.jobs[job].amount)+'/'+formatWhole(temp.oasis.jobs[job].max)"></display-text></td>
                <td><clickable :layer="layer" :data="job+'-down'"></clickable></td>
            </tr>
        </table>
        `
    })
}