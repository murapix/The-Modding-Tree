let modInfo = {
	name: "Universal Reconstruction",
	id: "universal-reconstruction",
	author: "Escapee",
	pointsName: "??",
	modFiles: [
		"layers/help.js",
		"layers/skyrmion.js",
		"layers/fome.js",
		"layers/acceleron.js",
		"layers/timecube.js",
		"layers/inflaton.js",
		"layers/entangledStrings.js"
	],

	discordName: "Escapee",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.6.0",
	name: "Amplification",
}

let changelog = `
	<h1>Changelog:</h1>
	<br><br>
	<h3>v0.6.0 - Amplification</h3>
	<br>- Updated to TMT 2.5.11.1
	<br>- Filled out the Inflaton layer
	<br>- Initial balance pass for both Acceleron- and Inflaton-first playthroughs
	<br>- Added a help tab, with information on each major layer
	<br>- Various improvements to background systems
	<br>- Added the initial framework for the final phase 1 layer
	<br><br>
	<h3>v0.5.0 - Dilation</h3>
	<br>- Finished Acceleron layer up to Inflaton unlock
	<br>- Nerfed higher resource Acceleron and Quantum Foam effects (while likely drop those nerfs by a lot later)
	<br>- Re-enabled Inflaton layer, but with nothing in there yet
	<br><br>
	<h3>v0.4.0 - Crystallization</h3>
	<br>- Updated to TMT 2.4
	<br>- Rebalanced everything from Foam unlock through Time Cubes
	<br>- Replaced Entropic Enhancement selectors with more defined upgrade selections
	<br>- Fixed some typos and clarity issues
	<br><br>
	<h3>v0.3.3</h3>
	<br>- Merge first two Acceleron milestones
	<br><br>
	<h3>v0.3.2</h3>
	<br>- Fixed Skyrmion and Acceleron upgrades being buyable without enough points
	<br>- Added Buy All buttons and hotkeys for Skyrmion and Foam layers, and shifted around milestones to unlock them
	<br><br>
	<h3>v0.3.1</h3>
	<br>- Fixed Skyrmions and Foam not generating without Entropic Loop 2
	<br><br>
	<h3>v0.3.0 - Acceleration</h3>
	<br>- Started work on Inflatons
	<br>- Implemented first half of Accelerons
	<br>- Deflated higher Skyrmion and Foam amounts
	<br>- Minor rebalance to shift end-of-Foam to intended route
	<br><br>
	<h3>v0.2.0 - Formation</h3>
	<br>- Added Infinitesimal through Quantum Foam boosts and buyables
	<br>- Added Foam milestones
	<br>- Rebalanced Foam formation levels
	<br>- Rebalanced Pion and Spinor α and γ buyables
	<br>- Added 6 more Pion and Spinor buyables each
	<br>- Added Pion and Spinor autobuyer upgrades
	<br>- Barebones third row added - no content yet
	<br><br>
	<h3>v0.1.0 - Creation</h3>
	<br>- Added two layers, Skyrmion and Foam
	<br>- Pre-foam Skyrmion complete
	<br>- Protoversal Foam sub-layer and Skyrmion buyables complete
	<br>- Added framework for Infinitesimal through Quantum Foam sub-layers
`

let winText = `Congratulations! You have reached the end and beaten this game, for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ['displayBoost', 'buyBuyable', 'getTotalBoost', 'buyableAmount', 'createBuyable', 'progressEffect', 'intervalEffect', 'finishEffect', 'hoverDisplay']

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
		return decimalZero

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current Endgame: 1 Entangled String"
]

// Determines when the game "ends"
function isEndgame() {
	return player.entangled.points.gte(1)
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	
}