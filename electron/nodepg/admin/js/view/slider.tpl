<div class="npg-slider" id="pageSlider">
  <div class="npg-slider-rail"></div>
  <div class="npg-slider-track" :style="'visibility: visible; left: 0%; width:'+data.percent+'%;'" @mousedown="sliderMouseDown($event)"></div>
  <div class="npg-slider-step" @click="pageMove($event)" @mousedown="sliderMouseDown($event)"></div>
  <div @mousedown="sliderMouseDown($event)" :valuemin="data.min" :valuemax="data.max" :valuenow="data.value" class="npg-slider-handle" :style="'left:'+ data.percent + '%;'"></div>
  <div class="npg-slider-mark"></div>
</div>