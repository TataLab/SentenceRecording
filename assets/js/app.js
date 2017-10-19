Vue.component('record-item', {
  props: ['item'],
  template:
								"<header class='major'>"+
								"<h2>“{{ item.text }}”</h2>"+
								"<ul class='actions'>"+
								"<li v-if='item.state == \"start\"'><a v-on:click='startRecording' class='button'>Start Recording</a></li>"+
                "<li v-if='item.state == \"recording\"'><a v-on:click='stopRecording' class='button'>Stop Recording</a></li>"+
                "<li v-if='item.state == \"uploaded\"'><a v-on:click='nextItem' class='button'>Next</a></li>"+
								"</ul>"+
                "<h1 v-if='item.state == \"uploading\"'>Uploading...</h1>"+
								"</header>",
  methods: {
    startRecording: function () {
      console.log("recording started")
      this.$emit('set-state', 'recording')
      return false;
    },
    stopRecording: function () {
      console.log("recording stopped")
      this.$emit('set-state', 'uploading')

      setTimeout(function() {this.$emit('set-state', 'uploaded')}.bind(this), 3000)
      return false;
    },
    uploadFile: function () {
      console.log("next")

    },
    nextItem: function () {
      this.$emit('advance-item')

    }
  },
})

var app = new Vue({
  el: '#app',
  data: {
    currentPos: 0,
    sentenceList: [
      { id: 0, text: 'iCub', state: 'start' },
      { id: 1, text: 'Ciao iCub', state: 'start' },
      { id: 2, text: 'Ciao', state: 'start' },
      { id: 3, text: 'Hello iCub', state: 'start' },
      { id: 4, text: 'Hello', state: 'start' },
    ]
  },
  methods: {
    setState: function(state) {
      this.sentenceList[this.currentPos].state = state
    },
    advanceItem: function() {
      if(this.currentPos < this.sentenceList.length-1)
        this.currentPos += 1;
    }
  }
})
