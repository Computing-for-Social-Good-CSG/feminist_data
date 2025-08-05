// remove items from an array
export function removeItems(arr, toRemove) {
    var result = [];
    for (var i=0; i<arr.length; i++) {
        var index = toRemove.indexOf(arr[i]);
        if (index == -1) {
            result.push(arr[i]);
        }
    }
    return result;
}
