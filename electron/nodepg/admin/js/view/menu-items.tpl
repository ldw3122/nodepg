<li v-if="init" :title="model.title" @click="click($event)" :class="{spliter: model.spliter}" @mouseover="hover($event)" >
  <div v-if="model.name && !model.spliter">
    {{model.name}}
    <img src="css/images/menu_more.gif" v-if="status.hasChildren" />
  </div>
  <ul v-if="status.hasChildren && !model.spliter" v-show="model.isshow">
    <menu-items-component class="tree-items-component" v-for="item in model.children" :model="item"></menu-items-component>
  </ul>
  <div></div>
</li>