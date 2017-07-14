module.exports = function(tagsArray) {
    var tagsWithoutDuplicates = [];
    try {
        for (var tag_index in tagsArray) {
            if (tagsWithoutDuplicates.includes(tagsArray[tag_index])) {
                continue;
            } else {
                tagsWithoutDuplicates.push(tagsArray[tag_index]);
            }
        }
    } catch (e) {
        console.log("error in removeDuplicateTags function...\n", e);
    }

    return tagsWithoutDuplicates;
};