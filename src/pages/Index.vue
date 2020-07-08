<template>
<q-page>
<div class="row justify-center full-width q-mt-md">
      <div class="col-lg-3 col-xs-10" >
       	<div class="title-font">ROOM CODE</div>
       			<q-input class="input-font" filled mask="AAAA" v-model="code" placeholder="ENTER 4-LETTER CODE"/>
       	<div class="q-mt-md title-font" >NAME</div>
       			<q-input class="input-font" mask="XXXXXXXXXX" filled v-model="username" placeholder="ENTER YOUR NAME" />
      </div>
       <q-btn
      size="22px"
      class="q-px-xl q-py-xs q-mt-md"
      color="primary"
      label="Play"
    />
</div>
</q-page>
</template>

<script>
export default {
	name: 'PageIndex',
	data () {
		return {
  			code: '',
  			username: ''
		}
	}
}
</script>


<style lang="stylus">
  .title-font
    font-family: 'Fira Sans', sans-serif;
    color: #333
    font-weight: 900
    font-size: 25px
    padding-left: 14px
  .input-font
    font-family: 'Fire Sans', sans-serif;
    font-size: 18px
    font-weight: 200
</style>