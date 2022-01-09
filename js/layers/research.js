class Research {
    constructor(title, display, cost, pos, prerequisites) {
        this.title = title
        this.display = display
        this.cost = cost
        this.pos = pos
        this.prerequisites = prerequisites
    }

    addToQueue() {
        if (player.research.researched.includes(this.id) || player.research.queue.includes(this.id)) return
        this.prerequisites?.forEach(id => layers.research.research[id].addToQueue())
        player.research.queue.push(this.id)
    }
    removeFromQueue() {
        let researchIndex = player.research.queue.indexOf(this.id)
        if (researchIndex < 0) return
        player.research.queue.splice(researchIndex, 1)
        while (researchIndex < player.research.queue.length) {
            let research = player.research.queue[researchIndex]
            let data = temp.research.research[research]
            if (data.prerequisites && data.prerequisites.find(id => !player.research.queue.includes(id) && !player.research.researched.includes(id)))
                player.research.queue.splice(researchIndex, 1)
            else researchIndex++
        }
    }
}

addLayer("research", {
    type: "none",

    row: 0,
    position: 1,
    color: "#ffffff",
    
    startData() {
        let startData  = {
            unlocked: false,
            points: 0,
            progress: 0,
            researched: [],
            queue: []
        }
        return startData
    },

    update() {
        if (temp.oasis.production.research > 0) player.research.unlocked = true
        player.research.points += temp.oasis.production.research

        if (player.research.queue.length > 0) {
            let cost = temp.research.research[player.research.queue[0]].cost
            let remProgress = cost - player.research.progress
            let change = Math.min(remProgress, temp.oasis.production.research*2, player.research.points)
            player.research.progress += change
            player.research.points -= change
            if (player.research.progress >= cost) {
                player.research.researched.push(player.research.queue.shift())
                player.research.progress = 0
            }
        }
        else {
            player.research.progress = 0
        }
    },

    research: {
        saltPool: new Research(
            'Evaporation Pools',
            buildings.saltPool.display,
            10,
            [0,1]
        ),
        canal: new Research(
            'Canals',
            buildings.canal.display,
            50,
            [1,2],
            ['saltPool']
        ),
        farm: new Research(
            'Agriculture',
            buildings.basicFarm.display,
            10,
            [0,3]
        ),
        canalFarm: new Research(
            'Irrigation',
            buildings.irrigatedFarm.display,
            100,
            [2,3],
            ['canal', 'farm']
        ),
        walls: new Research(
            'Construction',
            colored('|¯¯|', '#ffffff', 'span'),
            100,
            [2,1],
            ['canal']
        ),
        stars: new Research(
            'Astrology',
            '',
            500,
            [3,2],
            ['walls']
        ),
        travel: new Research(
            'Expeditions',
            '',
            100,
            [2,0],
            ['saltPool']
        ),
        lookout: new Research(
            'Expansion',
            buildings.lookoutTower.display,
            500,
            [3,0],
            ['travel', 'walls']
        ),
        mine: new Research(
            'Mining',
            buildings.quarry.display,
            500,
            [3,1],
            ['travel', 'walls']
        ),
        writing: new Research(
            'Writing',
            '',
            1000,
            [4,2],
            ['stars']
        )
    },

    tabFormat: [
        "blank",
        ["display-text", () => `Research Points: ${formatWhole(player.research.points)}`],
        "blank",
        'researchScreen'
    ]
})

function linkResearchIDs() {
    for (research in layers.research.research) {
        layers.research.research[research].id = research
    }
}

function clickResearch(id) {
    if (!player.research.unlocked || tmp.research.deactivated) return
    if (player.research.queue.indexOf(id) >= 0)
        run(layers.research.research[id].removeFromQueue, layers.research.research[id])
    else
        run(layers.research.research[id].addToQueue, layers.research.research[id])
}

function hasResearch(id) {
    return player.research.researched.includes(id)
}

function loadResearchVue() {
    Vue.component('research', {
        props: ['layer', 'data'],
        computed: {
            researched() { return player.research.researched.includes(this.data) },
            prerequisitesResearched() {
                if (this.researched) return true
                return (layers.research.research[this.data].prerequisites?.filter(prereq => !player.research.researched.includes(prereq)).length ?? 0) === 0
            },
            inQueue() { return player.research.queue.includes(this.data) },
            progress() { return player.research.queue[0] === this.data ? 0.5 : 0 },
            index() { return player.research.queue.indexOf(this.data) }
        },
        template: `
            <button :class="{ researchContainer: true, tooltipBox: true, can: !researched, researchable: (prerequisitesResearched && !researched), notResearchable: !prerequisitesResearched }"
                    :style="[{}]"
                    v-on:click="clickResearch(data)" :id='"research-" + layer + "-" + data'>
                <div>
                    <div :class="{ researchDisplay: true, researched: researched }" v-html="run(layers.research.research[data].display, layers.research.research[data])"></div>
                    <div v-if="!researched && player.research.queue[0] !== data" class="progressDisplay">{{formatWhole(temp.research.research[data].cost)}}</div>
                    <div v-else-if="!researched && player.research.queue[0] === data" class="progressDisplay">{{formatWhole(player.research.progress)}}/{{formatWhole(temp.research.research[data].cost)}}</div>
                    <div v-if="index >= 0" class="queueIndex">{{index+1}}</div>
                    <div class="researchName">{{tmp.research.research[data].title}}</div>
                </div>
                <tooltip v-if="tmp.research.research[data].tooltip" :text="tmp.research.research[data].tooltip"></tooltip>
            </button>
            `
    })

    Vue.component('researchScreen', {
        props: ['layer'],
        data() {
            return { blankWidth: 100 }
        },
        computed: {
            size() { return Object.values(layers.research.research).map(research => research.pos).reduce(([x1, y1], [x2, y2]) => [Math.max(x1, x2), Math.max(y1, y2)]).map(i => i+1) },
            rows() { return this.size[1] },
            cols() { return this.size[0] },
            grid() {
                let grid = new Array(this.rows).fill().map(() => new Array(this.cols*2-1).fill(''))
                for (research in layers.research.research) {
                    let [col, row] = layers.research.research[research].pos
                    grid[row][col*2] = research
                }
                return grid
            },
            lines() {
                let lines = []
                let dependents = {}
                for (research in layers.research.research) {
                    dependents[research] = []
                    if (layers.research.research[research].prerequisites)
                        for (prereq of layers.research.research[research].prerequisites)
                            dependents[prereq].push(research)
                }
                for (research in layers.research.research) {
                    let splitX = Math.min(...dependents[research].map(dep => layers.research.research[dep].pos[0]))*(300+this.blankWidth)-this.blankWidth/2
                    let color = player.research.researched.includes(research) ? 'white' : 'grey'
                    for (dep of dependents[research]) {
                        let startX = (layers.research.research[research].pos[0])*(300+this.blankWidth)+300
                        let startY = layers.research.research[research].pos[1]*50+25
                        let endX = (layers.research.research[dep].pos[0])*(300+this.blankWidth)
                        let endY = layers.research.research[dep].pos[1]*50+25
                        if (startY === endY) {
                            lines.push([color, `M ${startX},${startY} H ${endX}`])
                        }
                        else {
                            let arcStartX = splitX-10
                            let arcDir = (startY < endY ? 10 : -10)
                            let arcStartY = endY - arcDir
                            let arcStartClockwise = (startY < endY ? 1 : 0)
                            let arcEndClockwise = (startY < endY ? 0 : 1)

                            lines.push([color, `M ${startX},${startY} H ${arcStartX} a 10,10 0 0,${arcStartClockwise} 10,${arcDir} V ${arcStartY} a 10,10 0 0,${arcEndClockwise} 10,${arcDir} H ${endX}`])
                        }
                    }
                }
                return lines
            }
        },
        template: `
        <div style="overflow-x: auto; max-width: 90vw" class="researchTableDiv">
            <svg :width="(cols*(300+blankWidth)-blankWidth)" :height="(rows*51)">
                <g v-for="line in lines" fill="none" stroke-width="4" stroke-linecap="round">
                    <path :stroke="line[0]" :d="line[1]" />
                </g>
            </svg>
            <div :style="'margin-top: -'+(rows*51+2)+'px'">
                <table class="researchTable">
                    <tr v-for="row in grid">
                        <td v-for="val in row">
                            <research v-if="val && typeof val === 'string'" :layer="layer" :data="val"></research>
                            <blank v-else :layer="layer" :data="[blankWidth+'px', '50px']"></blank>
                        </td>
                    </tr>
                </table>
            </div>
            <blank>
        </div>
        `
    })
}