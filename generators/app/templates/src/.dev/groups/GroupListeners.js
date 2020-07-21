const Groups = require('./Groups.js');
let xIconSvg = require('../images/close-round.svg').default;
let chevron = require('../images/Font_Awesome_5_solid_chevron-left.svg').default;

class GroupListeners {

    constructor(api, state, target){
        this.groupBox = new Groups(api, state, target);
        window.groupsFilter = this.groupBox;
        this.displayBox = document.getElementById(target);
        this.inputBox = document.getElementById('group-input');
        this.groupToggle = document.getElementById('group-toggle-button');
        this.deleteAllBtn = document.getElementById('group-remove-all');
        this.firstOpen = true;
        this.open = false;
        this.closeListener;
    }

    assignEventListeners(){
        this.groupToggle.addEventListener('click', () => this._groupToggleListener(this.displayBox));
        this.inputBox.addEventListener('change', (event) => this._groupSearchListener(event.target.value));
        this.deleteAllBtn.addEventListener('click', () => this._groupResetAllFilters());
    }

    _groupResetAllFilters(){
        this.groupBox.resetActiveGroups();
    }

    _groupSearchListener(keyword){
        if(!this.open){
            this._groupToggleListener(this.displayBox);
        }

        if(keyword !== ''){
            this.groupBox.groupSearch(keyword);
        } else {
            this.groupBox.generateRootHtml();
        }
    }

    _groupToggleListener(display){
        if(!this.open){
            display.style.display = 'block';
            
            if(this.firstOpen){
                this.groupBox.getAllGroupsInDatabase();
                this.firstOpen = false;
            } else {
                this.groupBox.generateRootHtml();
            }

            this.open = true;
        } else {
            display.style.display = 'none';
            this.open = false;
        }

        this._rotateToggleButton();
    }

    _rotateToggleButton(){
        if(this.open){
            this.groupToggle.children[0].style['mask-image'] = `url(${xIconSvg})`;
            this.groupToggle.children[0].style['-webkit-mask-image'] = `url(${xIconSvg})`;
            this.groupToggle.children[0].style['transform'] = 'none';
        } else {
            this.groupToggle.children[0].style['mask-image'] = `url(${chevron})`;
            this.groupToggle.children[0].style['-webkit-mask-image'] = `url(${chevron})`;
            this.groupToggle.children[0].style['transform'] = 'rotate(-90deg)';
        }
    }

    _groupHiddenListener(){
        // Hide the div.
        this.displayBox.style.display = none;
    }
}

module.exports = GroupListeners;
