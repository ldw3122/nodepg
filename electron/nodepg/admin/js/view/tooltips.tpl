<div class="npg-tips" v-if="show" :style="{ 'left':options.x+'px', 'top':options.y+'px' }">
  <div class="npg-tips-arrow-top" v-if="options.pos=='top'"></div>
  <div class="npg-tips-arrow-left" v-if="options.pos=='left'"></div>
  <div class="npg-tips-content" :style="options.style">
    <div>
      <div class="title">
        {{data.title}}
      </div>
      <form v-if="data.form">
        <div v-for="(item, index) in data.form" class="row">
          <label>{{item.label}}</label>
          <input :type="item.type" :title="item.title" :placeholder="item.title" v-model="item.value" :value="item.value" @keypress="verify($event, index)"></input>
        </div>
        <div class="button-group" v-if="options.okText || options.closeText">
          <input v-if="options.closeText" @click="close($event)" :value="options.closeText" type="button" />
          <input v-if="options.okText" @click="ok($event)" :value="options.okText" type="button" />
        </div>
      </form>
    </div>
  </div>
  <div class="npg-tips-arrow-right" v-if="options.pos=='right'" :style="{'right':'-'+options.width+'px'}"></div>
</div>
<div class="npg-tips-arrow-bottom" v-if="options.pos=='bottom'" :style="{'margin-top':options.y+(options.height || 16)+29+'px'}"></div>