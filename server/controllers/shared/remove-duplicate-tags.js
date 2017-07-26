module.exports = function(tagsArray) {
    if (Array.isArray(tagsArray)) {
        var tagsWithoutDuplicates = [];
        try {
            for (var tag_index in tagsArray) {
                if (tagsWithoutDuplicates.includes(tagsArray[tag_index])) {
                    continue;
                } else {
                    console.log("pushing: ", tagsArray[tag_index]);
                    tagsWithoutDuplicates.push(tagsArray[tag_index]);
                }
            }
        } catch (e) {
            console.log("error in removeDuplicateTags function...\n", e);
        }

        return tagsWithoutDuplicates;

    } else {
        //not an array, probably an object:
        var tagsWithoutDuplicates = [];

        for (var key in tagsArray) {
            // skip loop if the property is from prototype
            if (!tagsArray.hasOwnProperty(key)) continue;
            var theValue = tagsArray[key];
            console.log("obj: ", obj);

            if (theValue !== 'false' && theValue !== false) {
                if (!tagsWithoutDuplicates.includes(key)) {
                    if (theValue == true || theValue == 'true') {
                        tagsWithoutDuplicates.push(key);
                    } else { //if it is an 'other', then just push it...
                        tagsWithoutDuplicates.push(theValue);
                    }
                }
            }
        } //done looping through tags array...
        return tagsWithoutDuplicates;
    }
};