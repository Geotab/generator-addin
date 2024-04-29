const GroupListeners = require('../groups/GroupListeners.js')

class AdvancedGroupFilterListener {
    constructor () {
        this.displayBox = document.getElementById('advanced-group-filter')
        this.newConditionButton = document.getElementById('advanced-filter-add-condition-button')
        this.cancelBtn = document.getElementById('advanced-filter-cancel-button')
        this.applyFiltersBtn = document.getElementById('advanced-filter-apply-button')
        this.conditionsList = document.getElementById('advanced-conditions-list')
        this.filterBtn = document.getElementById('open-filter-button')
        this.conditionsState = []
        this.conditionCount = 0
    }

    assignListeners() {
        // Creates a new list item when the add condition button is clicked
        this.newConditionButton.addEventListener('click', () => this._addCondition())

        // Cancel button closes popup and removes all conditions
        this.cancelBtn.addEventListener('click', () => this._cancelFilters())

        // Apply filters button closes popup but keeps all conditions
        this.applyFiltersBtn.addEventListener('click', () => this._applyFilters())

        // Show advanced filter popup when button is clicked from original filter dropdown menu
        this.filterBtn.addEventListener('click', () => this._showAdvancedGroupFilter())
    }

    // Show the advnaced filter popup
    _showAdvancedGroupFilter() {
        conditions.original_filter.groupsFilter.state._activeGroups = []
        conditions.original_filter.groupsFilter.writeActiveGroups()
        let filter = document.getElementById('advanced-group-filter')
        filter.style.display = 'block'
    }

    // Add a condition to the advanced filter
    // Switcher section div is for the AND/OR switcher before the condition (doesn't show for first condition)
    // Left column contains the AND/OR switcher for the condition itself
    // Right column contains the group selection and remove button
    // Group wrapper contains the dropdown menu, toggle button, active groups, and clear active groups button
    _addCondition() {
        this.conditionsList.insertAdjacentHTML('beforeend', `
            <li id='condition${this.conditionCount}' class='section form__section'>
                <div class='section__inter-section-switcher'>
                    <span class='geo-switcher' id='condition${this.conditionCount}-switcher'>
                        <input type='radio' id='condition${this.conditionCount}-inter-and' name='condition${this.conditionCount}-inter-operator' class='switcher geo-switcher__input' checked></input>
                        <label for='condition${this.conditionCount}-inter-and' class='geo-switcher__label' centeredLabelText onLabelSwitcher'>AND</label>
                        <input type='radio' id='condition${this.conditionCount}-inter-or ' name='condition${this.conditionCount}-inter-operator' class='switcher geo-switcher__input'></input>
                        <label for='condition${this.conditionCount}-inter-or ' class='geo-switcher__label' centeredLabelText onLabelSwitcher'>OR</label>
                    </span>
                </div>
                <div class='section__main'>
                    <div class='section__col section__col--left'>
                        <label class='section__label'>Operator</label>
                        <div class='section__switcher'>
                            <span class='geo-switcher' id='condition${this.conditionCount}-operator'>
                                <input type='radio' id='condition${this.conditionCount}-and' name='condition${this.conditionCount}-operator' class='switcher geo-switcher__input' checked></input>
                                <label for='condition${this.conditionCount}-and' class='geo-switcher__label' centeredLabelText onLabelSwitcher'>AND</label>
                                <input type='radio' id='condition${this.conditionCount}-or ' name='condition${this.conditionCount}-operator' class='switcher geo-switcher__input'></input>
                                <label for='condition${this.conditionCount}-or ' class='geo-switcher__label' centeredLabelText onLabelSwitcher'>OR</label>
                            </span>
                        </div>
                    </div>
                    <div class='section__col section__col--right'>
                        <label class='section__label'>Groups</label>
                        <button id='condition${this.conditionCount}-remove' class='section__remove-button geo-button geo-button--link'>Remove condition</button>
                        <div id='group-wrapper' class='section__groups node-select-container'>
                            <div class='entity-navigator-container node-select-container__control advanced-filter-dropdown-groups'>
                                <div class='geo-secondary-button-with-expand geotab-filter__wrapper node-select-container__control-element node-select-container__control-element--spacing-right'>
                                    <input id='condition${this.conditionCount}-search' class='inputBox geo-secondary-button-with-expand__input geotab-filter__input' type='text' placeholder='Select groups...'></input>
                                    <button id='condition${this.conditionCount}-dropdown-toggle' class='geo-secondary-button-with-expand__expand geotab-filter__expand group-toggle-button'>
                                        <svg class="svgIcon geotabIcons_chevron" style="height: 15px; width: 15px;"></svg>
                                    </button>
                                </div>
                                <div id='condition${this.conditionCount}-group-dropdown'>
                                    <div id='condition${this.conditionCount}-filter-dropdown' class='geotabPrimaryFill'></div>
                                </div>
                            </div>
                            <div class='currentState node-select-container__state'>
                                <div class='stateItem closeCrossStateItem'>
                                    <div id='condition${this.conditionCount}-active-groups' class='stateItem__text'>Active Groups: ALL</div>
                                    <button id='condition${this.conditionCount}-clear-group' class='filterCloseButton'></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `)
        
        // Remove the condition when the remove button is clicked
        button = document.getElementById(`condition${this.conditionCount}-remove`)
        button.addEventListener('click', (button) => this._handleRemoveCondition(button))

        operator = document.getElementById(`condition${this.conditionCount}-operator`)
        operator.addEventListener('click', (button) => this._handleToggleOperator(button))

        switcher = document.getElementById(`condition${this.conditionCount}-switcher`)
        switcher.addEventListener('click', (button) => this._handleToggleSwitcher(button))

        // Create a new group listener for each condition
        local_state = {
            _activeGroups: [],
            operator: 'AND',
            switcher: 'AND'
        }
        groupListener = new GroupListeners(global.api, local_state, `condition${this.conditionCount}`, `condition${this.conditionCount}-filter-dropdown`, `condition${this.conditionCount}-group-dropdown`, `condition${this.conditionCount}-search`, `condition${this.conditionCount}-dropdown-toggle`, `condition${this.conditionCount}-clear-group`, `condition${this.conditionCount}-active-groups`);
        groupListener.assignEventListeners();        

        // Increment counter to ensure each condition has a unique name
        this.conditionCount ++
    }

    _handleToggleOperator(button) {
        operator = button.srcElement.id.slice(-3)
        id = button.srcElement.id.slice(0, -4)
        if (operator === 'and') {
            conditions[id].groupsFilter.state.operator = 'AND'
            conditions[id].groupsFilter.writeActiveGroups()
        }
        if (operator === 'or ') {
            conditions[id].groupsFilter.state.operator = 'OR'
            conditions[id].groupsFilter.writeActiveGroups()
        }
    }

    _handleToggleSwitcher(button) {
        switcher = button.srcElement.id.slice(-3)
        id = button.srcElement.id.slice(0, -10)
        if (switcher === 'and') {
            conditions[id].groupsFilter.state.switcher = 'AND'
        }
        if (switcher === 'or ') {
            conditions[id].groupsFilter.state.switcher = 'OR'
        }

    }

    // Remove condition
    _handleRemoveCondition(button) {
        id = button.srcElement.id.slice(0, -7)
        condition = document.getElementById(id)
        condition.remove()
        delete conditions[id]
    }

    // Remove all conditions and hide popup
    _cancelFilters() {
        this.displayBox.style.display = 'none'
        this.conditionsList.innerHTML = ''
        for (let i = 0; i < this.conditionCount; i++) {
            delete conditions[`condition${i}`]
        }
        this.conditionCount = 0
    }

    // Keep conditions and hide popup
    _applyFilters() {
        for (let i = 0; i < this.conditionCount; i++) {
            if (conditions[`condition${i}`]) {
                if (conditions[`condition${i}`].groupsFilter.state._activeGroups.length > 0) {
                    this.conditionsState.push(conditions[`condition${i}`].groupsFilter)
                }
            }
        }
        this._createFilterObject()
        this._writeAdvancedFilter()
        this.displayBox.style.display = 'none'
    }

    _createFilterObject() {
        filter_obj = {}
        for (let i = 0; i < this.conditionsState.length; i++) {
            condition = this.conditionsState[i]
            if (condition.state._activeGroups.length === 1) {
                obj = {"groupId": condition.state._activeGroups[0].id}
            }
            else {
                obj = {
                    "relation": condition.state.operator,
                    "groupFilterConditions": []
                }
                for (j in condition.state._activeGroups) {
                    obj["groupFilterConditions"].push({"groupId": condition.state._activeGroups[j].id})
                }
            }
            if (i != 0) {
                filter_obj = {
                    "relation": condition.state.switcher,
                    "groupFilterConditions": [
                        filter_obj,
                        obj
                    ]
                }
            }
            else {
                filter_obj = obj 
            }
        }
        window.state._advancedGroupsFilter = filter_obj
        global.geotab.addin.<%= root %>.focus(global.api, global.state);
    }

    _writeAdvancedFilter() {
        text = `Active Groups: `
        for (let i = 0; i < this.conditionsState.length; i++) {
            condition = this.conditionsState[i]
            if (i != 0) {
                text += ` ${condition.state.switcher} `
            }
            if (this.conditionsState.length > 1 && condition.state._activeGroups.length > 1) {
                text += `(`
            }
            for(let j = 0; j < condition.state._activeGroups.length; j++){
                let id = condition.state._activeGroups[j].id;
                let name = condition.groupsDictionary[id].name;
    
                if(j === 0){
                    text += name;
                } else {
                    text += ` ${condition.state.operator} ${name}`;
                }
            } 
            if (this.conditionsState.length > 1 && condition.state._activeGroups.length > 1) {
                text += `)`
            }
        }
        conditions.original_filter.groupsFilter.activeLabel.innerHTML = text
        this.conditionsState = []
    }
}

module.exports = AdvancedGroupFilterListener