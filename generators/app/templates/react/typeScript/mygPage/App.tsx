import React, { useCallback, useMemo, useState } from "react";
import "@geotab/zenith/dist/index.css";
import {
    Card,
    Cards,
    ColumnSortDirection,
    FiltersBar,
    getEmptySelection,
    getSortableValue,
    Header,
    IconCheck,
    IconDownload,
    IconLoader,
    IListColumn,
    Layout,
    Menu,
    Pill,
    Table,
    useMobile,
} from "@geotab/zenith";
import { componentTypes, getData, getSortFn, IComponent } from "../data";
import { ProgressChart } from "./ProgressChart";
import { ZenithSummary } from "./ZenithSummary";

const linkRenderer = (entity: IComponent) => {
    return <a href={entity.link} className="zen-link" target="_blank" rel="noopener noreferrer">{entity.link}</a>;
};

const designReviewRenderer = (entity: IComponent) => {
    if (entity.designReview) {
        return <Pill type="success" icon={IconCheck}>Approved</Pill>;
    }
    return <Pill type="warning" icon={IconLoader}>Pending</Pill>;
};

const capitalizeFirstLetter = (str: string) => {
    if (str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const defaultSortValue = {
    sortColumn: "name",
    sortDirection: ColumnSortDirection.Ascending
};

const defaultValues = {
    search: { state: { value: "" } },
    type: { state: { selectedOption: ["all"] } },
};

const App: React.FC = () => {
    const pageName = "zenith-addin";
    const isMobile = useMobile();
    const [isFiltersBarOpen, setIsFiltersBarOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>(defaultValues.search.state.value);
    const [typeValue, setTypeValue] = useState<string[]>(defaultValues.type.state.selectedOption);

    const getDefaultStateFilters = () => defaultValues;
    const handleClearAllFilters = useCallback(() => {
        setSearchValue(defaultValues.search.state.value);
        setTypeValue(defaultValues.type.state.selectedOption);
    }, []);

    const [sortValue, setSortValue] = useState(getSortableValue(pageName, defaultSortValue));
    const [selected, setSelected] = useState(getEmptySelection());

    const columns: IListColumn<IComponent>[] = [
        { id: "name", title: "Name", meta: { defaultWidth: 200 } },
        { id: "type", title: "Type", meta: { defaultWidth: 100 }, columnComponent: { render: entity => capitalizeFirstLetter(entity.type), renderHeader: title => title } },
        { id: "design-review", title: "Design review", meta: { defaultWidth: 200 }, columnComponent: { render: designReviewRenderer, renderHeader: title => title } },
        { id: "link", title: "Link", meta: { defaultWidth: 400 }, sortable: false, columnComponent: { render: linkRenderer, renderHeader: title => title } }
    ];

    const entities = useMemo(() => {
        const data = getData(searchValue, typeValue);
        const sortFn = getSortFn(sortValue);
        return data.sort(sortFn);
    }, [sortValue, searchValue, typeValue]);

    return <Layout>
        <Header>
            <Header.Title pageName="Zenith" isBeta={true} />
            <Header.Menu id="submenu" name="Submenu">
                <Menu.Item id="item1" name="Item 1" onClick={() => { console.log("Item 1"); }} />
                <Menu.Item id="item2" name="Item 2" onClick={() => { console.log("Item 2"); }} />
                <Menu.Item id="item3" name="Item 3" onClick={() => { console.log("Item 3"); }} />
            </Header.Menu>
            <Header.Button id="primary-action" type="primary" onClick={() => { alert("Primary action"); }}>Primary action</Header.Button>
            <FiltersBar
                isAllFiltersVisible={isFiltersBarOpen}
                toggleAllFilters={setIsFiltersBarOpen}
                getDefaultFiltersState={getDefaultStateFilters}
                onClearAllFilters={handleClearAllFilters}>
                <FiltersBar.Search
                    id="search"
                    state={{ value: searchValue }}
                    onChange={({ value }) => setSearchValue(value)}
                    sidePanelTitle=""
                    showInSidePanel={false}
                    props={{ placeholder: "Name..." }} />
                <FiltersBar.Dropdown
                    id="type"
                    showInSidePanel
                    sidePanelTitle={"Type"}
                    state={{ selectedOption: typeValue }} props={{
                        multiselect: false,
                        searchField: false,
                        dataItems: componentTypes,
                        placeholder: "Type",
                        errorHandler: () => {},
                        defaultValue: defaultValues.type.state.selectedOption,
                        showSelection: true,
                        showCounterPill: false
                    }}
                    onChange={({ selectedOption }) => setTypeValue(selectedOption) } />
            </FiltersBar>
        </Header>
        <Cards>
            <Card size="L" title="Progress" status="info" tooltip="How many components exist in every version" tooltipAlignment="top" tooltipSize="auto">
                <Card.Content>
                    <ProgressChart />
                </Card.Content>
            </Card>
            <Card size="XS" autoHeight={true} title="Summary">
                <Card.Content>
                    <ZenithSummary />
                </Card.Content>
            </Card>
        </Cards>
        <Table
            height={ isMobile ? "1700px" : "640px" }
            flexible={{
                pageName
            }}
            sortable={{
                pageName,
                value: sortValue,
                onChange: setSortValue
            }}
            selectable={{
                selection: selected,
                onSelect: setSelected
            }}
            columns={columns}
            entities={entities}>
            <Table.Empty />
            <Table.Fullscreen />
            <Table.BulkActions>
                <Table.BulkButton icon={IconDownload} title="Download" onClick={() => console.log("Download")} />
            </Table.BulkActions>
        </Table>
    </Layout>
};

export default App;
