
<script setup lang="ts">// 内部本身目前不支持顶部async/await
import { onMounted, reactive, toRefs } from 'vue';
import { InitData, initDataFun } from './JS/InitData'
import List from "../List/List.vue"
import Scrollcom from "../ScrollCom/ScrollCom.vue"
const data = reactive(new InitData());
onMounted(async () => {
  await initDataFun(data)
}); // 钩子函数，内部是异步调用 onMounted 挂载上去后再次渲染.
const { chinaTotal, chinaDayList, areaTree, twData, china, showList } = toRefs(data); // 第一次初始化，是为空。
function tabChange(num: number) {
  data.type = num;
}
const mapTypeChange = (type: number) => {
  data.mapType = type; // 跳转按钮
}
let page: number = 0;
const getlist = () => {
  //子组件通知父组件
  console.log("加载下一页");

  page++;
  if (data.areaTree[page]) {
    data.showList.push(...data.areaTree[page])
  } else {
    data.isScroll = false;
  }



}
const refreshFun =async (fun:Function) => {
   await initDataFun(data)
   fun();
   page = 0;
   data.isScroll =true;
} 

</script>
<template>
  <div class="wrap">
    <div class="topBox">
      <img class="bgImg" src="../../assets/bg.png" alt="">
      <div class="titleText">
        <h1>科学防护， 共度难关</h1>
        <h2>肺炎疫情实时动态播报</h2>
      </div>
    </div>
    <div class="coverCards" v-if="chinaTotal.total">
      <div class="coverTab">
        <div @click="tabChange(1)" :class="{ active: data.type === 1 }">全国疫情数据(含港澳台)</div>
        <div @click="tabChange(2)" :class="{ active: data.type === 2 }">台湾疫情数据</div>
      </div>
      <div v-show="data.type === 1" class="coverInfo">
        <div>
          <h4 class="title">境外输入</h4>
          <p class="number">{{ chinaTotal.total.input }}</p>
          <p class="tip">
            较昨日
            <span>+{{ chinaTotal.today.input }}</span>
          </p>
        </div>
        <div>
          <h4 class="title">无症状感染者</h4>
          <p class="number">{{ chinaTotal.extData.noSymptom }}</p>
          <p class="tip">
            较昨日
            <span>+{{ chinaTotal.extData.incrNoSymptom }}</span>
          </p>
        </div>
        <div>
          <h4 class="title">现有确诊</h4>
          <p class="number">
            {{
                chinaTotal.total.confirm -
                chinaTotal.today.dead -
                chinaTotal.today.heal
            }}
          </p>
          <p class="tip">
            较昨日
            <span>+{{ chinaTotal.today.storeConfirm }}</span>
          </p>
        </div>
        <div>
          <h4 class="title">累计确诊</h4>
          <p class="number">{{ chinaTotal.total.confirm }}</p>
          <p class="tip">
            较昨日
            <span>+{{ chinaTotal.today.confirm }}</span>
          </p>
        </div>
        <div>
          <h4 class="title">累计死亡</h4>
          <p class="number">{{ chinaTotal.total.dead }}</p>
          <p class="tip">
            较昨日
            <span>+{{ chinaTotal.today.dead }}</span>
          </p>
        </div>
        <div>
          <h4 class="title">累计治愈</h4>
          <p class="number">{{ chinaTotal.total.heal }}</p>
          <p class="tip">
            较昨日
            <span>+{{ chinaTotal.today.heal }}</span>
          </p>
        </div>
      </div>
      <div v-show="data.type === 2" class="coverInfo">
        <div>
          <h4 class="title">累计确诊</h4>
          <p class="number">{{ twData.total.confirm }}</p>
          <p class="tip">
            较昨日
            <span>+{{ twData.today.confirm }}</span>
          </p>
        </div>
        <div>
          <h4 class="title">累计死亡</h4>
          <p class="number">{{ twData.total.dead }}</p>
          <p class="tip">
            较昨日
            <span>+{{ twData.today.dead }}</span>
          </p>
        </div>
        <div>
          <h4 class="title">累计治愈</h4>
          <p class="number">{{ twData.total.heal }}</p>
          <p class="tip">
            较昨日
            <span>+{{ twData.today.heal }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- echarts -->
    <div class="data-map content">
      <h3>中国疫情</h3>
      <div class="map-box">
        <div :class="data.mapType == 1 ? 'to-left' : 'to-right'" id="map"></div>
        <div :class="data.mapType == 1 ? 'to-left' : 'to-right'" id="map2"></div>
      </div>
      <div class="map-btn">
        <div @click="mapTypeChange(1)" :class="{ active: data.mapType == 1 }">
          现有确诊
        </div>
        <div @click="mapTypeChange(2)" :class="{ active: data.mapType == 2 }">
          累计确诊
        </div>
      </div>
    </div>
    <!-- <div class="data-line content">
      <div class="line-box">
        <div id="line"></div>
        <div id="line1"></div>
        <div id="line2"></div>
      </div>
    </div> -->
    <!-- 列表 -->
    <div class="data-list content">
      <h3>中国病例</h3>
      <List v-if="china.length > 0" :show-children="true" :list="china" />
    </div>
    <div class="data-list content" v-if="data.showList.length">
      <h3>世界病例</h3>
      <Scrollcom :distance="100" :isScroll="(data.isScroll as boolean)" @getList="getlist" @refreshFun="refreshFun">
        <List :show-children="true" :list="data.showList" />
      </Scrollcom>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes toRight {
  from {
    left: 0;
  }

  to {
    left: calc(0px - 100vw + 1rem);
  }
}

// 项目动画移动

@keyframes toLeft {
  from {
    left: calc(0px - 100vw + 1rem);
  }

  to {
    left: 0;
  }
}

html {
  font-size: 14px;
}

.wrap {
  position: relative;

  .topBox {
    position: relative;

    .bgImg {
      width: 100vw;
    }

    .titleText {
      position: absolute;
      z-index: 1;
      color: aliceblue;
      top: 20px;
      left: 1rem;
    }
  }

  .coverCards {
    position: absolute;
    width: calc(100% - 2rem);
    top: 120px;
    border-radius: 20px;
    left: 1rem;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 2px 20px rgb(0 0 0 /10%); // 等于 rgb(0,0,0,.1)

    >div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      &.coverTab {

        >div {
          background-color: #efefef;
          width: 50%;
          text-align: center;
          height: 40px;
          line-height: 40px;

          &.active {
            background-color: #ffffff;

          }
        }
      }

      &.coverInfo {
        >div {
          width: 33%;
          text-align: center;
          margin: 10px 0;

          &:nth-child(2) {

            .number,
            span {
              color: #ffa352;
            }
          }

          &:nth-child(3) {

            .number,
            span {
              color: #791618;
            }
          }

          &:nth-child(4) {

            .number,
            span {
              color: #e44a3d;
            }
          }

          &:nth-child(5) {

            .number,
            span {
              color: #333;
            }
          }

          &:nth-child(6) {

            .number,
            span {
              color: #34aa70;
            }
          }

          .title {
            font-size: 12px;
          }

          .number {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 5px 0;
            color: #a31d13;

            span {
              color: #a31d13;
            }
          }

          .tip {
            font-size: 12px;
          }
        }
      }
    }
  }


  .content {
    padding: 0 1rem;
  }

  .data-map,
  .data-list {
    margin-top: 130px;
    // overflow: hidden;

    h3 {
      border-left: 8px solid #e10000;
      padding-left: 1rem;
    }
  }

  .map-box {
    display: flex;
    width: 200%;
  }

  .data-line {
    margin-top: 20px;
  }

  #line,
  #line1,
  #line2 {
    height: 400px;
    width: 100%;
  }

  #map,
  #map2 {
    height: 350px;
    width: 50%;
    animation-fill-mode: forwards;
    left: 0;
  }

  #map {
    margin-right: 1rem;
  }

  #map2 {
    margin-left: 1rem;
  }

  .to-left {
    animation: toLeft 1s;
  }

  .to-right {
    animation: toRight 1s;
  }

  .map-btn,
  .line-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;

    >div {
      width: 45%;
      height: 40px;
      line-height: 40px;
      border: 1px solid #d2d2d2;
      box-shadow: 0 5px 7px 1px rgb(0 0 0 / 5%);
      border-radius: 5px;
      text-align: center;

      &.active {
        border-color: #ce4733;
        background-color: #fef7f7;
        color: #ce2c1e;
      }
    }
  }

  .line-btn {
    >div {
      width: 30%;
      height: 55px;
      line-height: 25px;
      padding-top: 5px;
    }
  }

  .data-list {
    margin-top: 20px;
  }

}
</style>
