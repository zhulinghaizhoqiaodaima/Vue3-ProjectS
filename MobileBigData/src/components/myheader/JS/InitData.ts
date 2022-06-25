import { IData, IchinaTotal, twData, chinatyep, chinaObj } from "../interface/IData";
import axios from "axios";
import * as echarts from "echarts";
import chinaJson from "../../../assets/china.json"
type EChartsOption = echarts.EChartsOption;

class InitData implements IData {
    twData: twData = {
        today: undefined,
        total: undefined,
        extData: undefined,
        name: undefined,
        id: undefined
    }; // 最优办法接着嵌套，但是我懒，知道方法就欧克啦.
    areaTree: any[] = []
    showList: any[] = []
    chinaDayList: any[] = [];
    chinaTotal: IchinaTotal = {
        today: undefined,
        extData: undefined,
        total: undefined
    };
    china: any[] = [];
    // = [
    //     {
    //         today: undefined,
    //         total: undefined,
    //         extData: undefined,
    //         name: undefined,
    //         id: undefined,
    //     }
    // ]
    mapType: number = 1
    lineType: number = 1
    lastUpdateTime: string = ''
    name: string = ''
    type: number = 1
    isScroll: Boolean = true
}
const initDataFun = async (data: InitData) => {
    let mapDom: HTMLElement | null = document.getElementById("map");
    let mapDom2: HTMLElement | null = document.querySelector("#map2");
    let optionMap: EChartsOption = {
        title: {//标题内容
            // text: '中国疫情图',
            subtext: "单击省份可查看病例数",
        },
        tooltip: {//提示框组件
            trigger: "item",//触发类型 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
            formatter: "现有确诊病例<br/>{b}: {c} ",//提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            //  模板变量有 { a }, { b }，{ c }，{ d }，{ e }，分别表示系列名，数据名，数据值等。 在 trigger 为 'axis' 的时候，会有多个系列的数据，此时可以通过 { a0 }, { a1 }, { a2 } 这种后面加索引的方式表示系列的索引。 不同图表类型下的 { a }，{ b }，{ c }，{ d } 含义不一样。 其中变量{ a }, { b }, { c }, { d } 在不同图表类型下代表数据含义为：

            // 折线（区域）图、柱状（条形）图、K线图: { a }（系列名称），{ b }（类目值），{ c }（数值）, { d }（无）

            // 散点图（气泡）图: { a }（系列名称），{ b }（数据名称），{ c }（数值数组）, { d }（无）

            // 地图: { a }（系列名称），{ b }（区域名称），{ c }（合并数值）, { d }（无）

            // 饼图、仪表盘、漏斗图: { a }（系列名称），{ b }（数据项名称），{ c }（数值）, { d }（百分比）

        },
        visualMap: {
            show: false,
        },
    }; // 以上定义echart图相关变量

    let myMap = echarts.init((mapDom as HTMLElement)) // 使用断言，获取dom元素,需要使用某个变量，无法强制转扭其数据格式，而后期使用的是固定格式，故采用断言.
    let myMap2 = echarts.init((mapDom2 as HTMLElement)) // 使用断言
    myMap.showLoading()
    echarts.registerMap('china', (chinaJson as any))
    let series = {
        type: "map",//
        map: "china", // America
        colorBy: "series",//按照系列分配调色盘中的颜色，同一系列中的所有数据都是用相同的颜色
        zoom: 1.3,//当前视角的缩放比例
        top: 80,//组件离容器上侧的距离
        label: {
            show: true,
            color: "#333",
            fontSize: 10,
        },
    }
    let res = await (await axios("/api/ug/api/wuhan/app/data/list-total?t=330415245809")).data.data;
    data.areaTree = getPageList(res.areaTree);
    data.showList = data.areaTree[0];
    data.chinaDayList = res.chinaDayList;
    data.chinaTotal = res.chinaTotal;
    data.china = res.areaTree.find((v: { id: string; }) => v.id === "0").children;

    // console.log(data.china)
    data.twData = res.areaTree[2].children.find((item: { id: string; }) => item.id === '700000');
    // echarts数据
    let mapData: any[] = [];
    data.china.map((item: any) => {
        mapData.push({
            name: item.name,
            value: item.total.confirm - item.total.dead - item.total.heal || 0,
        })
    })
    myMap.hideLoading();
    myMap.setOption({
        ...optionMap, series: {
            ...series,
            data: mapData
        }
    });
    myMap2.setOption({
        ...optionMap, series: {
            ...series,
            data: mapData
        }
    });
}
const getPageList = (list:any[])=>{
    const arr:Array<any[]>[] = [];
    for (let index = 0; index < list.length; index+=30) {
        arr.push(list.slice(index,index+30))
        
    }
    return arr;
}
export {
    InitData,
    initDataFun
}
