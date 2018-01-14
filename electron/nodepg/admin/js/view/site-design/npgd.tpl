<div class="npg-design block" @mousemove="pageMove($event)" @mouseup="sliderClear($event)">
	<div class="npg-toolsbar">
		<p v-for="item in data.page.platforms" class="icon-button" :title="item.name" @click="setPageWidth(item, $event)" :class="{activate: data.page.mode==item.name}">
			<i class="fa" :class="item.class"></i>
			<span>{{item.name}}</span>
		</p>
    <div class="mySlider" style="float:left; margin-top: 12px; width:200px;">

    </div>
	</div>
	<div class="npg-page-bg fitHeight" @mouseover="sliderClear($event)">
		<div class="npg-page-content" :style="data.page.style">
			<div id="zxxScaleRulerH" class="zxxScaleRuler_h" style="display: block;">
				<span class="n" style="left: 2px;">0</span><span class="n" style="left: 52px;">50</span><span class="n" style="left: 102px;">100</span><span class="n" style="left: 152px;">150</span><span class="n" style="left: 202px;">200</span><span class="n" style="left: 252px;">250</span><span class="n" style="left: 302px;">300</span><span class="n" style="left: 352px;">350</span><span class="n" style="left: 402px;">400</span><span class="n" style="left: 452px;">450</span><span class="n" style="left: 502px;">500</span><span class="n" style="left: 552px;">550</span><span class="n" style="left: 602px;">600</span><span class="n" style="left: 652px;">650</span><span class="n" style="left: 702px;">700</span><span class="n" style="left: 752px;">750</span><span class="n" style="left: 802px;">800</span><span class="n" style="left: 852px;">850</span><span class="n" style="left: 902px;">900</span><span class="n" style="left: 952px;">950</span><span class="n" style="left: 1002px;">1000</span><span class="n" style="left: 1052px;">1050</span><span class="n" style="left: 1102px;">1100</span><span class="n" style="left: 1152px;">1150</span><span class="n" style="left: 1202px;">1200</span><span class="n" style="left: 1252px;">1250</span><span class="n" style="left: 1302px;">1300</span><span class="n" style="left: 1352px;">1350</span><span class="n" style="left: 1402px;">1400</span><span class="n" style="left: 1452px;">1450</span><span class="n" style="left: 1502px;">1500</span><span class="n" style="left: 1552px;">1550</span><span class="n" style="top: 1602px;">1600</span><span class="n" style="top: 1652px;">1650</span>
			</div>

			<div id="zxxScaleRulerV" class="zxxScaleRuler_v" style="display: block;">
				<span class="n" style="top: 2px;">0</span><span class="n" style="top: 52px;">50</span><span class="n" style="top: 102px;">100</span><span class="n" style="top: 152px;">150</span><span class="n" style="top: 202px;">200</span><span class="n" style="top: 252px;">250</span><span class="n" style="top: 302px;">300</span><span class="n" style="top: 352px;">350</span><span class="n" style="top: 402px;">400</span><span class="n" style="top: 452px;">450</span><span class="n" style="top: 502px;">500</span><span class="n" style="top: 552px;">550</span><span class="n" style="top: 602px;">600</span><span class="n" style="top: 652px;">650</span><span class="n" style="top: 702px;">700</span><span class="n" style="top: 752px;">750</span><span class="n" style="top: 802px;">800</span><span class="n" style="top: 852px;">850</span><span class="n" style="top: 902px;">900</span><span class="n" style="top: 952px;">950</span><span class="n" style="top: 1002px;">1000</span><span class="n" style="top: 1052px;">1050</span><span class="n" style="top: 1102px;">1100</span><span class="n" style="top: 1152px;">1150</span><span class="n" style="top: 1202px;">1200</span><span class="n" style="top: 1252px;">1250</span><span class="n" style="top: 1302px;">1300</span><span class="n" style="top: 1352px;">1350</span><span class="n" style="top: 1402px;">1400</span><span class="n" style="top: 1452px;">1450</span><span class="n" style="top: 1502px;">1500</span><span class="n" style="top: 1552px;">1550</span><span class="n" style="top: 1602px;">1600</span><span class="n" style="top: 1652px;">1650</span>
			</div>

			<div class="npg-page-body fitWidth" v-html="data.page.content" @click="onSelect($event)"></div>
		</div>
	</div>
  <div class="npg-status-bar">

  </div>
</div>
