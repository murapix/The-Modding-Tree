var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: ""
}

addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})