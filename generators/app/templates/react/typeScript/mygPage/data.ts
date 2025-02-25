import { ColumnSortDirection, ISortableValue } from "@geotab/zenith/dist/table/sortable/interfaces";

export type TVersion = "v1" | "unknown" | "all";
export type TComponentType = "all" | "electron" | "atom" | "organism";

export interface IComponent {
    id: string;
    name: string;
    type: TComponentType;
    link: string;
    designReview: boolean;
}

export const componentTypes = [{
    id: "all",
    name: "All"
}, {
    id: "atom",
    name: "Atom",
}, {
    id: "organism",
    name: "Organism"
}];

export const components: IComponent[] = [{
    id: "button",
    name: "Button",
    type: "atom",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/buttons-button-text--docs",
    designReview: true
}, {
    id: "textInput",
    name: "Text input",
    type: "atom",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/fields-field-text-input--docs",
    designReview: true
}, {
    id: "textSearch",
    name: "Text search",
    type: "atom",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/fields-field-search--docs",
    designReview: true
}, {
    id: "textarea",
    name: "Text area",
    type: "atom",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/fields-field-text-input-multiline--docs",
    designReview: false
}, {
    id: "menu",
    name: "Menu",
    type: "atom",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/work-in-progress-menu--docs",
    designReview: false
}, {
    id: "card",
    name: "Card",
    type: "organism",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/containers-card--docs",
    designReview: true
}, {
    id: "header",
    name: "Header",
    type: "organism",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/containers-header--docs",
    designReview: true
}, {
    id: "dataTable",
    name: "Data table",
    type: "organism",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/data-table-data-table--docs",
    designReview: true
}, {
    id: "banner",
    name: "Banner",
    type: "atom",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/work-in-progress-banner--docs",
    designReview: false
}, {
    id: "tabbar",
    name: "Tabbar",
    type: "organism",
    link: "https://developers.geotab.com/zenith-storybook/index.html?path=/docs/work-in-progress-tab-bar--docs",
    designReview: false
}];

const matchesSearch = (component: IComponent, search: string) => !search || component.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
const matchesTypes = (component: IComponent, types: Set<string>) => !types.size || types.has("all") || types.has(component.type);

export const getData = (search: string, types: string[]) => {
    if (!search && types.length === 0) {
        return components;
    }
    const typesSet = new Set(types);
    return components.filter((component) => matchesSearch(component, search) && matchesTypes(component, typesSet));
};

export const getSortFn = ((sortValue: ISortableValue | undefined) => {
    return (a: IComponent, b: IComponent) => {
        const direction = sortValue?.sortDirection === ColumnSortDirection.Ascending ? 1 : -1;
        if (sortValue?.sortColumn === "design-review") {
            if (a.designReview === b.designReview) {
                return -1 * direction;
            }
            if (a.designReview && !b.designReview) {
                return -1 * direction;
            }
            return 1 * direction;
        }
        const col = (sortValue?.sortColumn || "name") as keyof IComponent;
        return (a[col] < b[col] ? -1 : 1) * direction;
    };
})