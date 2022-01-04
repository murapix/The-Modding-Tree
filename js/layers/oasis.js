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
    distances[2].sort(() => 0.5 - Math.random()).forEach((id, index) => grid[id] = index < 2 ? 'cactus' : 'sand')
    distances[3].sort(() => 0.5 - Math.random()).forEach((id, index) => grid[id] = index < 2 ? 'cactus' : 'sand')
    distances[4].sort(() => 0.5 - Math.random()).forEach((id, index) => grid[id] = index < 3 ? 'cactus' : 'sand')

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
            lastUpdate: 0
        }
        for ([resource, data] of Object.entries(resources)) {
            startData.resources[resource] = {
                unlocked: data.shown ?? false,
                amount: data.initialAmount ?? 0
            }
        }
        for ([job, data] of Object.entries(jobs)) {
            startData.jobs[job] = {
                unlocked: data.shown,
                amount: 0
            }
        }
        startData.jobs.builder.amount = 1
        startData.jobs.forager.amount = 2
        return startData
    },

    update(diff) {
        if (temp.oasis.explored != temp.oasis.prevExplored) shiftOasis()

        if (temp.oasis.resources.people.max <= 0) player.gameSpeed = 0
        switch (player.gameSpeed) {
            case 0:
                player.oasis.lastUpdate += diff
                return
            case 1:
                if (player.oasis.resetTime - player.oasis.lastUpdate < 1) return
                break
            case 2:
                if (player.oasis.resetTime - player.oasis.lastUpdate < 0.33) return
                break
            case 3:
                if (player.oasis.resetTime - player.oasis.lastUpdate < 0.1) return
                break
        }

        let resources = player.oasis.resources

        for ([resource, data] of Object.entries(temp.oasis.resources)) {
            if (data.unlocked) resources[resource].unlocked = true
        }

        for ([resource, amount] of Object.entries(temp.oasis.production)) {
            if (resource === 'people') continue
            resources[resource].amount = clamp(resources[resource].amount + amount, 0, temp.oasis.resources[resource].max)
        }
        
        let builderCount = player.oasis.jobs.builder.amount
        let buildProjects = []
        for (let row = 1; row < temp.oasis.grid.rows; row++) {
            for (let col = 1; col < temp.oasis.grid.cols; col++) {
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

        player.oasis.lastUpdate = player.oasis.resetTime
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
            resourceData[resource] = {
                max: 0,
                id: resource,
                name: data.name,
                unlocked: data.shouldShow ?? false,
                consumed: consumes ? function() { return Object.fromEntries(Object.entries(consumes).map(entry => [entry[0], entry[1]*player.oasis.resources[this.id].amount])) } : {}
            }
        }
        return resourceData
    }(),
    countStorage() {
        let storage = Object.fromEntries(Object.entries(temp.oasis.resources).map(entry => [entry[0], resources[entry[0]].baseStorage ?? 0]))
        for (let data of Object.values(player.oasis.grid)) {
            for ([resource, amount] of Object.entries(buildings[data.building].storage)) {
                storage[resource] = (storage[resource] ?? 0) + amount
            }
        }
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
                max: 0,
                name: data.name,
                unlocked: data.shouldShow
            }
        }
        return jobData
    }(),
    countJobs() {
        let jobs = Object.fromEntries(Object.entries(temp.oasis.jobs).map(entry => [entry[0], 0]))
        for (let job of Object.keys(jobs)) { jobs[job] = 0 }

        for ([building, count] of Object.entries(temp.oasis.buildings)) {
            for ([job, amount] of Object.entries(buildings[building].jobs)) {
                jobs[job] = (jobs[job] ?? 0) + amount*count
            }
        }
        for([job, amount] of Object.entries(jobs)) {
            layers.oasis.jobs[job].max = amount
            temp.oasis.jobs[job].max = amount
        }
    },

    explored() {
        return baseVision
    },
    lastExplored() {
        return temp.oasis.explored
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
                    ["resource-grid", ["people", "food", "wood", "sandstone" ]]
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
                    ["job-grid", ["builder", "forager", "farmer", "logger"]]
                ], {'width': '275px', 'transform-origin': 'left', 'transform': oasisScale, 'transition': 'transform 0.5s !important'}]
            ]],
            "blank"
        ]

        if (player.oasis.grid[player.oasis.selectedTile]) {
            let building = player.oasis.grid[player.oasis.selectedTile].building

            let toDisplay = []
            let provided = buildings[building].provided
            if (provided.length > 0) toDisplay.push(`Provides a source of ${provided.map(resource => terrainResources[resource].name).join(', ')}`)
            let buildingJobs = buildings[building].jobs
            if (Object.keys(buildingJobs).length > 0) toDisplay.push(`Supports ${Object.entries(buildingJobs).map(entry => `${formatWhole(entry[1])} ${jobs[entry[0]].name}${entry[1] === 1 ? '' : 's'}`).join(', ')}`)
            if (player.oasis.grid[player.oasis.selectedTile].action) {
                toDisplay.push('<br>',
                               `In Progress: ${actions[player.oasis.grid[player.oasis.selectedTile].action].name}`,
                               'Remaining Resources:')
                for ([resource, amount] of Object.entries(player.oasis.grid[player.oasis.selectedTile].progress)) {
                    if (amount > 0) toDisplay.push(`${resources[resource].name}: ${formatWhole(amount)}`)
                }
            }

            tabFormat.push(
                ["display-text", `<h2>${buildings[player.oasis.grid[player.oasis.selectedTile].building].name}</h2>`],
                ["display-text", buildings[building].description],
                ...(toDisplay.map(line => ["display-text", line])),
                "blank"
            )

            let actionList = []
            for (let action of buildings[building].actions) {
                if (temp.oasis.clickables[action].unlocked) {
                    actionList.push(action)
                }
            }
            for (let i = 0; i < actionList.length; i += 5) {
                tabFormat.push(["row", actionList.splice(i, i+5).map(action => ["clickable", action])])
            }
            tabFormat.push(["clickable", "cancelBuild"])
        }

        return tabFormat
    }
})

function shiftOasis() {
    let prevSize = temp.oasis.prevExplored
    let newSize = temp.oasis.explored

    let shift = newSize - prevSize
    if (shift > 0) {
        for (let row = temp.oasis.grid.rows; row > shift; row--) {
            for (let col = temp.oasis.grid.cols; col > shift; col--) {
                player.oasis.grid[row*100+col] = player.oasis.grid[(row-shift)*100+(col-shift)]
            }
        }
    }
    else {
        for (let row = 1; row < temp.oasis.grid.rows-shift; row++) {
            for (let col = 1; col < temp.oasis.grid.rows-shift; col++) {
                player.oasis.grid[row*100+col] = player.oasis.grid[(row+shift)*100+(col+shift)]
            }
        }
    }
}

function createResourceBars(bars) {
    for (resource of Object.keys(layers.oasis.resources)) {
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
    for (job of Object.keys(layers.oasis.jobs)) {
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
    for (action of Object.keys(actions)) {
        if (actions[action] instanceof BuildAction) {
            clickables[action] = {
                title() { return `<b>${actions[this.action].name}<br>${buildings[actions[this.action].building].display}</b>` },
                display() { return '' },
                unlocked() { return actions[this.action].stateCheck() && actions[this.action].unlocked() },
                canClick() { return actions[this.action].stateCheck() && actions[this.action].canRun() },
                onClick() {
                    player.oasis.grid[player.oasis.selectedTile].action = this.action
                    player.oasis.grid[player.oasis.selectedTile].progress = {...actions[this.action].cost}
                },
                tooltip() { return temp.oasis.clickables[this.id].canClick ? '' : actions[this.action].requirementText },
                style() { return {
                        'background-color': '#00000000',
                        'color': '#ffffff',
                        'border': temp.oasis.clickables[this.id].canClick ? '2px solid #f6d7b0' : '2px solid #888888'
                    }
                },
                action: action
            }
        }
        else if (actions[action] instanceof DemolishAction) {
            clickables[action] = {
                title() { return `<b>${actions[this.action].name}<br>${buildings[actions[this.action].getOutputBuilding()].display}</b>` },
                display() { return '' },
                unlocked() { return actions[this.action].stateCheck() && actions[this.action].unlocked() },
                canClick() { return actions[this.action].stateCheck() && actions[this.action].canRun() },
                onClick() {
                    player.oasis.grid[player.oasis.selectedTile].action = ''
                    player.oasis.grid[player.oasis.selectedTile].progress = {}
                    player.oasis.grid[player.oasis.selectedTile].building = actions[this.action].getOutputBuilding()
                },
                tooltip() { return temp.oasis.clickables[this.id].canClick ? '' : actions[this.action].requirementText },
                style() { return {
                        'background-color': '#00000000',
                        'color': '#ffffff',
                        'border': temp.oasis.clickables[this.id].canClick ? '2px solid #ffa430' : '2px solid #888888'
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
            'background-color': '#00000000',
            'color': '#ffffff',
            'border': temp.oasis.clickables[this.id].canClick ? '2px solid #ffa430' : '2px solid #888888'
        } }
    }
}