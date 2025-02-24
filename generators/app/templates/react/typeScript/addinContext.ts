import React from "react";

export interface IGeotabToken {
    rememberMe?: boolean;
    date?: Date;
    source?: string;
    target?: string;
    database: string;
    userName: string;
    sessionId: string;
}

interface IOutputIdEntity {
    groupId: string;
}

const enum RelationOperator {
    "AND" = "And",
    "OR" = "Or"
}

export interface ISessionInfo {
    database: string;
    userName: string;
    sessionId: string;
    domain: string;
}

export interface IGroupListStateOutput<T extends IOutputIdEntity = IOutputIdEntity> {
    relation: RelationOperator;
    groupListSearches: (T | IGroupListStateOutput<T>)[];
}

type TReportGAEvent = (eventAction: string, eventParams: { [key: string]: string }) => void;

export type TCallParams = [string, any?];
export type TMulticallParam = [string, object];
export type TCall = <T = any>(method: string, params: any, successCallback?: Function, errorCallback?: Function) => Promise<T>;
export type TMulticall = <T = any>(calls: TCallParams[]) => Promise<T[]>;
export type TGetSessionCallback = (successCallback: (token: IGeotabToken, host: string) => any, newSession?: boolean) => void;

interface IIdEntity {
    id: string;
}

export interface IGeotabPage {
    getState: () => any;
    setState: (newState: any) => void;
    gotoPage: (pageName: string, options: any) => boolean;
    hasAccessToPage: (pageName: string) => boolean;
    getGroupFilter: () => IIdEntity[];
    getAdvancedGroupFilter: () => IGroupListStateOutput;
    translate: (arg: string | HTMLElement) => string | HTMLElement;
    createGtag: (gaMeasurementId: string) => TReportGAEvent;
    pageState: any;
}


export interface IGeotabApi {
    call: TCall;
    multiCall: TMulticall;
    forget?: () => void;
    getSession(): Promise<ISessionInfo>;
}

interface ILocalizer {}
interface IUser {
    id: string;
    name: string;
    firstName?: string;
}

export interface IAddinContext {
    geoApi: IGeotabApi;
    pageApi: IGeotabPage;
    currentUser: IUser;
    localizer: ILocalizer;
    addinElement: HTMLElement;
    userAddInSecurityIdentifiers: string[];
    addAddinListener: (event: "focus" | "blur", callback: () => void) => () => void;
}

const addinContext = React.createContext<IAddinContext>(undefined as any);

export { addinContext as AddinContext };