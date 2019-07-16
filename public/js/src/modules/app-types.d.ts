interface IApplicationMeta {
    baseHREF: string;
}

interface IContentLoaderDataRegistry {
    pages: any[];
    posts: any[];
    isReady?: boolean;
}

interface IContentLoaderCache {
    [key: string]: JQuery;
}

interface IConfigLoader {

}

interface IContentLoader {

}

interface IRouterHandler {
    path: RegExp;
    callback: Function;
}

interface IRouterHistory extends History {
    Adapter: {
        bind(HTMLElement, string, Function): any
    }

    getState(): { data: { path: string } };
}

interface IRouter {
    base: string;
    history: IRouterHistory;
    routes: IRouterHandler[];
}

interface IResourceMonitorState {
    isSleeping: boolean;
    isInitialized: boolean;
    gcPtr: number;
    headPtr: number;
    sum: number;
    latest: number;
    prev: number;
    sleepTimeoutId: number;
}

interface IResourceMonitorConfig {
    /**
     * @default 200
     */
    bufferSize?: number;

    /**
     * @default (1000 / 60) // 50 frames per millisecond
     */
    idleFrequency?: number;
}

interface IResourceMonitor {
    state: IResourceMonitorState;
    config: IResourceMonitorConfig;
    subscriptions: Function[];
    store: number[];
}

type IModuleMeta<T = any> = T;
type IModuleElement = HTMLElement | Window;

interface IModule<DOMElement = IModuleElement, Meta = IModuleMeta> {
    meta: Meta;
    $window: JQuery<DOMElement>;
    $root: JQuery<DOMElement>;
    resourceMonitor: IResourceMonitor;
    configLoader: IConfigLoader;
    contentLoader: IContentLoader;
    router: IRouter;

    $timeout(callback, wait): void;
}

interface IApplication extends IModule {
    $root: JQuery;
    $window: JQuery<Window>;
    meta: IApplicationMeta;
    configLoader: IConfigLoader;
    contentLoader: IContentLoader;
    router: IRouter;
    previousPath: string;

}

interface IConfigLoaderState {
    flag: string;
}

type IConfigLoaderData = any

