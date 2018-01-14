<div class="npg-tabs npg-container">
  <div class="npg-tabs-button">
    <div class="tabs-nav-left" v-show="navOver" @click="navLeft($event)"></div>
    <div class="tabs-nav">
      <div class="tabs-nav-wrapper" style="transform: translate3d(0px, 0px, 0px);">
        <div class="tabs-tab" v-for="(item, index) in data" :class="{active:selectIndex==index}" :title="item.path" @mouseover="mouseover(index)"  @mouseout="mouseout(index)" @click="select(index)">
          <i class="npg-icon" :class="item.icon" v-if="item.icon"></i>
          <span>{{item.name}}</span>
          <span class="btnClose">
            <i v-show="closeButtonIndex==index && item.showClose" @click="close(index)">X</i>
          </span>
        </div>
      </div>
    </div>
    <div class="tabs-nav-right" v-show="navOver" @click="navRight($event)"></div>
  </div>
  <div class="npg-tab-page fitHeight fitWidth" @click="pageClick($event);">
    <div v-for="(item, index) in data" v-show="selectIndex==index" :id="'tab_page_'+index" v-html="item.content" class="npg-tab-page-content">

    </div>
  </div>
  <div class="footer" v-show="showFooter"></div>
</div>