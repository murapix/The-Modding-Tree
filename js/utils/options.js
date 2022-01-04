// ************ Options ************

let options = {}

function getStartOptions() {
    return {
        autosave: true,
        msDisplay: "always",
        theme: "default",
        hideChallenges: false,
        tooltipForcing: true,
    }
}

function toggleOpt(name) {
    options[name] = !options[name];
}
function changeTreeQuality() {
    document.body.style.setProperty('--hqProperty1', "4px solid");
    document.body.style.setProperty('--hqProperty2a', "-4px -4px 4px rgba(0, 0, 0, 0) inset");
    document.body.style.setProperty('--hqProperty2b', "");
    document.body.style.setProperty('--hqProperty3', "none");
}
function toggleAuto(toggle) {
    Vue.set(player[toggle[0]], [toggle[1]], !player[toggle[0]][toggle[1]]);
    needCanvasUpdate=true
}

const MS_DISPLAYS = ["ALL", "LAST, AUTO, INCOMPLETE", "AUTOMATION, INCOMPLETE", "INCOMPLETE", "NONE"];

const MS_SETTINGS = ["always", "last", "automation", "incomplete", "never"];

function adjustMSDisp() {
    options.msDisplay = MS_SETTINGS[(MS_SETTINGS.indexOf(options.msDisplay) + 1) % 5];
}
function milestoneShown(layer, id) {
    complete = player[layer].milestones.includes(id);
    auto = layers[layer].milestones[id].toggles;

    switch (options.msDisplay) {
        case "always":
            return true;
        case "last":
            return (auto) || !complete || player[layer].lastMilestone === id;
        case "automation":
            return (auto) || !complete;
        case "incomplete":
            return !complete;
        case "never":
            return false;
    }
    return false;
}
