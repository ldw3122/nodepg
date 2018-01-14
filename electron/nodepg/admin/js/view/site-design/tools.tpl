<div v-if="data" class="tools-panel">
	<div v-for="(item, index) in data" class="icon-button" :id="item.id" draggable="true">
		<i :class="item.class" :title="item.name"></i>
	</div>
</div>
