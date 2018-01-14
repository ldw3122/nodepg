<div class="npg-tips" v-if="show" :style="{ 'left':options.x+'px', 'top':options.y+'px', height: (options.height ? options.height + 'px':'auto'), width: (options.width ? options.width + 'px':'auto') }">
  <div class="npg-tips-arrow-top" v-if="options.pos=='top'" :style="{ 'left': (options.arrowLeft ? options.arrowLeft + 'px' : 'auto'), 'position':'fixed' }"></div>
  <div class="npg-tips-arrow-left" v-if="options.pos=='left'" :style="{ 'top': (options.arrowTop ? options.arrowTop + 'px' : 'auto'), 'position':'fixed' }"></div>
  <div class="npg-tips-content" :style="options.style">
    <div>
      <div class="title">
        {{data.title}}
      </div>
      <form>
        <input type="hidden" v-model="data.path" :value="data.path" />
        <div class="image-viewer">
          <div class="file-tree"></div>
          <div class="image-peview">
            <span>
              <img :src="data.src" width='100%' height='100%' />
            </span>
          </div>
        </div>
        <div class="button-group" v-if="options.okText || options.closeText">
          <input v-if="options.closeText" @click="close($event)" :value="options.closeText" type="button" />
          <input v-if="options.okText" @click="ok($event)" :value="options.okText" type="button" />
        </div>
      </form>
    </div>
  </div>
  <div class="npg-tips-arrow-right" v-if="options.pos=='right'" :style="{'right':'-'+options.width+'px', 'top': (options.arrowTop ? options.arrowTop + 'px' : 'auto'), 'position':'fixed' }"></div>
</div>
<div class="npg-tips-arrow-bottom" v-if="options.pos=='bottom'" :style="{'margin-top':options.y+(options.height || 16)+29+'px', 'left': (options.arrowLeft ? options.arrowLeft + 'px' : 'auto'), 'position':'fixed' }"></div>