<li>
  <div v-if="status.canShowRoot || !model.isRoot" :class="{ chosed: model.selected }">
    <i class="npg-arrow" @click="toggle($event)" :class="status.arrow"></i>
    <i class="npg-icon" @click="toggle($event)" :class="status.defaultIcon || status.icon"></i>
    <a :title="model.selected ? '点击右键更多操作' : model.title" class="npg-tree-node" @click="chose($event)" @dblclick="toggle($event)" @contextmenu.prevent="popup($event)">
      <span class="npg-tree-title">
        <span>{{model.name}}</span>
      </span>
    </a>
  </div>
  <ul v-if="status.hasChildren && model.open" class="npg-tree-items">
    <tree-items-component class="tree-items-component" v-for="item in model.children" :model="item"></tree-items-component>
  </ul>
</li>