<div class="npg-attributes fitHeight">
  <span v-for="(item, i) in data" class="group" :style="item.style" v-show="item.hide!=true">
    <label v-if="item.label" v-html="item.label.replace(/ /gmi, '&nbsp')" :style="item.labelStyle"></label>
    <span v-for="(ctl, j) in item.controls">
      <select :id="ctl.id" v-if="ctl.type=='select'" v-show="ctl.hide!=true" :title="ctl.title" v-model="ctl.value" :value="ctl.value" @change="attrChange($event, i, j)" :style="ctl.style" >
        <option v-for="(option, k) in ctl.options" v-show="option.hide!=true" :value="option.value">{{option.text}}</option>
      </select>
      <input :id="ctl.id" v-if="ctl.type=='button'" :type="ctl.type" v-show="ctl.hide!=true" :title="ctl.title" v-model="ctl.value" @click="attrClick($event, i, j)" :style="ctl.style" />
      <label v-if="ctl.type=='checkbox'" v-show="ctl.hide!=true" :title="ctl.title" :style="ctl.style">
        <input :id="ctl.id" type="checkbox" @change="attrChange($event, i, j)" :placeholder="ctl.text" v-model="ctl.value" :value="ctl.value" :checked="ctl.checked" :name="ctl.group" />{{ctl.text}}
      </label>
      <label v-if="ctl.type=='radio'" v-show="ctl.hide!=true" :title="ctl.title" :style="ctl.style">
        <input :id="ctl.id" type="radio" @change="attrChange($event, i, j)" :placeholder="ctl.text" v-model="ctl.value" :value="ctl.value" :checked="ctl.checked" :name="ctl.group" />{{ctl.text}}
      </label>
      <input :id="ctl.id" v-if="ctl.type=='file'" v-show="ctl.hide!=true" :type="ctl.type" @change="attrChange($event, i, j)" :title="ctl.title" :placeholder="ctl.text" v-model="ctl.value" :defaultValue="ctl.value" :value="ctl.value" :style="ctl.style" :accept="ctl.accept" :multiple="ctl.multiple" />
      <input :id="ctl.id" v-if="ctl.type=='number'" v-show="ctl.hide!=true" :type="ctl.type" @blur="attrBlur($event, i, j)" :title="ctl.title" :placeholder="ctl.text" v-model="ctl.value" :value="ctl.value" :style="ctl.style" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" />
      <input :id="ctl.id" v-if="ctl.type!='button' && ctl.type!='select' && ctl.type!='checkbox' && ctl.type!='number' && ctl.type!='radio' && ctl.type!='file'" v-show="ctl.hide!=true" :type="ctl.type" @blur="attrBlur($event, i, j)" :title="ctl.title" :placeholder="ctl.text" v-model="ctl.value" :value="ctl.value" :style="ctl.style" />
    </span>
  </span>
</div>