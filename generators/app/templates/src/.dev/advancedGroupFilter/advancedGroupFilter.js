// HTML for the advanced group filter popup
let body = document.getElementsByTagName('body')[0];
let advancedGroupFilter = `
<link rel='stylesheet' href='https://mypreview.geotab.com/geotab/checkmate/main.css?skin=my_geotab'>

<style>
.geo-dialog {
    display: none;
    left:50%;
    top:50%;
    transform: translate(-50%, -50%)
}

.advanced-groups-filter {
    max-height: 75vh;
    overflow-y: auto;
}

.advanced-filter-dropdown-groups {
    flex-direction: column;
}
</style>

<div id='advanced-group-filter' class='geo-dialog'>
    <div class='geo-dialog__header'>
        <div class='geo-dialog__title ellipsis'>Advanced Group Filter</div>
    </div>
    <div class='geo-dialog__content'>
        <div class='form advanced-groups-filter'>
            <div class='form__desc'>Create conditions below to filter the entire system.</div>
            <ul id='advanced-conditions-list' class='sections form__sections'></ul>
            <div class='form__add-section'>
                <button id='advanced-filter-add-condition-button' class='add-section__button geo-button geo-caption'>Add new condition</button>
            </div>
        </div>
    </div>
    <div class='geo-dialog__footer'>
        <button id='advanced-filter-cancel-button' class='geo-button'>Cancel</button>
        <button id='advanced-filter-apply-button' class='geo-button geo-button--action'>Apply filters</button>
    </div>

</div>
`
body.innerHTML = advancedGroupFilter + body.innerHTML;