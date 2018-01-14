<div class="npg-tree npg-container-ole fitHeight">
  <div class="fitHeight">
    <span class="search-box">
      <input type="text" placeholder="过滤(filter)"/>
      <a class="btn-search"></a>
      <a class="btnAdd" v-show="add" :title="buttonAddTitle" @click="addOnClick($event)"></a>
    </span>
    <div class="fitHeight" style="overflow:auto;">
      <ul class="npg-tree-items" id="npg-tree-container">
        <li id="site-items"></li>
      </ul>
    </div>
  </div>
</div>