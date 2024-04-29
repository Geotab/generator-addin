// Helper class for groups. Handles most HTML generation and heavy lifting.
class _GroupHelper {
    
    /**
     * Converts the group array into a dictionary where the key is the id of group.
     * Prevents nested iteration to look for and sort through groups.
     * 
     * @param {array} groupArray Raw group array returned from the api.
     */
    static convertGroupsListToDictionary(groupArray){
        let dict = groupArray.reduce((output, current) => {
            let id = current.id;
            
            // Clean the data.
            output[id] = {
                children: current.children,
                color: current.color,
                comments: current.comments,
                reference: current.reference,
                name: current.name || 'GroupCompanyId',
                selected: false
            };

            return output;
        }, {});

        return dict;
    }

    static generateActiveHeaderText(state, stateLength, groupDictionary, operator){
        let text = ``;

        for(let i=0; i<stateLength; i++){
            let id = state._activeGroups[i].id;
            let name = groupDictionary[id].name;

            if(i === state._activeGroups.length-1){
                text += ' ' + name;
            } else {
                text += ' ' + name + ` ${operator}`;
            }
        }

        return text;
    }

    static generateFolderEventListener(label, previous, current){
        let listener = `conditions.${label}.groupsFilter.changeFocus('${previous}', '${current}');`;
        return listener;
    }

    static generateFilterEventListener(label, filter){
        let listener = `conditions.${label}.groupsFilter.toggleGroupFilter('${filter}');`;
        return listener;
    }

    static generatePreviousFolderEventListener(label){
        let listener = `conditions.${label}.groupsFilter.goToPreviousFolder()`;
        return listener;
    }

    static generateFilterListElement(label, childId, childNode){
        let checked = childNode.selected ? 'checked' : '';
        return `<li id="group-item-${childId}" onchange="${this.generateFilterEventListener(label, childId)}">
                    <input id="group-use-${childId}" type="checkbox" class="geotabSwitchButton navButton" ${checked}>
                    <label id="group-use-${childId}-label" for="group-use-${childId}" class="geotabButton" style="width: 100%;">${childNode.name}</label>
                </li>`;
    }

    static generateFolderListElement(label, id, root, node){
        return `<li id="group-folder-${node.id}" class="geotabButton navButton" onclick="${this.generateFolderEventListener(label, root, id)}">
                    <span class="icon geotabIcons_folder"></span>
                    ${node.name}
               </li>`;
    }

    /**
     * Iterates over entire dictionary object for search terms and returns html of matching folder/filter names.
     * 
     * @param {object} groupsDictionary dictionary used in search.
     * @param {RegExp} regex Regex defining search term.
     */
    static generateSearchHtml(label, groupsDictionary, id, regex = /^.*$/g){
        let html = `<ul id=${id} class="geotabPrimaryFill select-buttons">`;
        let resultCount = 0;
        
        // When we iterate over all the keys in the groupsDictionary, we get all the groups instead of top level children
        // of user's Root group.
        Object.keys(groupsDictionary).forEach(key => {
            let node = groupsDictionary[key];
            if(regex.test(node.name.toLowerCase())){
                if(node.children.length > 0){
                    html += this.generateFolderListElement(label, key, 'GroupCompanyId', node);
                    resultCount++;
                } else {
                    html += this.generateFilterListElement(label, key, node);
                    resultCount++;
                }
            }
        });

        if(resultCount === 0){
            html += `<p style="text-align: center;">No Results Found.</p>`;
        }

        html += `</ul>`;
        return html;
    }

    /**
     * Used to generate html for a folder. If the folder is not the top level folder (GroupCompanyId),
     * navigational items (Use this Level and Go Up one Level) will be generated.
     * 
     * @param {object} groupsDictionary the dictionary used to generate the folder.
     * @param {string} root the dictionary key we start the folder on.
     * @param {string} baseNode the user's highest group permission. 
     */
    static generateNodeHtml(label, groupsDictionary, root, parent, baseNode = root){
        let html = `<ul id="${parent}-ul" class="geotabPrimaryFill select-buttons">`
        let name = groupsDictionary[root].name;
        let checked = groupsDictionary[root].selected ? 'checked' : '';

        if(root !== baseNode){
            html += `<li onchange="${this.generateFilterEventListener(label, root)}">
                        <input id="group-go-to-${root}" type="checkbox" class="geotabSwitchButton navButton" ${checked}>
                        <label for="group-go-to-${root}" class="geotabButton" style="width:100%;">
                            <span class='icon geotabIcons_status'></span>
                            Everything in ${name}
                        </label>
                     </li>`;
            html += `<li onchange="${this.generatePreviousFolderEventListener(label)}">
                        <input id="group-use-${root}" type="checkbox" class="geotabSwitchButton navButton">
                        <label for="group-use-${root}" class="geotabButton" style="width:100%;">
                        <span class='icon geotabIcons_level_up'></span>
                            Up one level
                        </label>
                     </li>`;
        }
        
        html += this.generateFolderHtml(label, groupsDictionary, root);
        html += `</ul>`;

        return html;
    }

    /**
     * Looks at the children of the provided root object and generates html for the child objects.
     * 
     * @param {object} groupsDictionary 
     * @param {string} root Base level to use for html generation
     */
    static generateFolderHtml(label, groupsDictionary, root){
        let html = ``;

        groupsDictionary[root].children.forEach( child => {
            let childId = child.id
            let childNode = groupsDictionary[childId];

            if(childNode.children.length > 0){
                html += this.generateFolderListElement(label, childId, root, childNode);
            } else {
                html += this.generateFilterListElement(label, childId, childNode);
            }
        });

        return html;
    }
}

module.exports = _GroupHelper;
