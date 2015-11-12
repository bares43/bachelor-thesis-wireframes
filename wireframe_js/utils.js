/**
 * @param node
 * @param tags
 * @returns {boolean}
 * @deprecated
 */
function isElement(node,tags){
    for(var i = 0;i<tags.length;i++){
        if(node.is(tags[i])) return true;
    }
}

String.prototype.getAllOccurrences = function(char){
    var regex = new RegExp(char,"gi"), result, indices = [];
    while ( (result = regex.exec(this.toString())) ) {
        indices.push(result.index);
    }
    return indices;
};