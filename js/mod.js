let modInfo = {
	name: "Universal Reconstruction",
	id: "universal-reconstruction",
	author: "Escapee",
	pointsName: "??",
	discordName: "Escapee",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.1",
	name: "Creation",
}

let changelog = `
	<h1>Changelog:</h1><br>
	<h3>v0.0.1 - Creation</h3>
	<br>- Added two layers, Skyrmion and Foam
	<br>- Pre-foam Skyrmion complete
	<br>- Protoversal Foam sub-layer and Skyrmion buyables complete
	<br>- Added framework for Infitesimal through Quantum Foam sub-layers
`

let winText = `Congratulations! You have reached the end and beaten this game, for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ['displayBuyable', 'displayBoost', 'buyBuyable', 'getTotalBoost']

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current Endgame: 1 Infitesimal Foam"
]

// Determines when the game "ends"
function isEndgame() {
	return player.fome && player.fome.fome.infitesimal.points.gte(1)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}