type IData = {
    areaTree: any[],
    chinaDayList: any[],
    chinaTotal: object;
    showList: any[],
    china: any[],
    twData: object,
    type: number,
    mapType: number,
    lineType: number,
    lastUpdateTime: string,
    isScroll: Boolean
}

type IchinaTotal = {
    today: any
    extData: any
    total: any
}

type twData = {
    today: any
    total: any
    extData: any
    name: any
    id: any
}
type chinaObj = {
    today: any,
    total: any,
    extData: any,
    name: any,
    id: any
}
type chinatyep = {
    [index:number]:chinaObj 
}
export type {
    IData,
    IchinaTotal,
    twData,
    chinatyep,
    chinaObj
}