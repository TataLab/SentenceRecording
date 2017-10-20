var session = {
  audio: true,
  video: false
};

var options = {
    recorderType: StereoAudioRecorder,
    mimeType: 'audio/wav'
};

var recordRTC = null;

var onError = function(err) {
  console.log(err);
}

Vue.component('record-item', {
  props: ['item', 'speaker'],
  template:
								"<header class='major'>"+
								"<h2>“{{ item.text }}”</h2>"+
								"<ul class='actions'>"+
								"<li v-if='item.state == \"start\"'><a v-on:click='startRecording' class='button special start-recording'>Start Recording</a></li>"+
                "<li v-if='item.state == \"recording\"'><a v-on:click='stopRecording' class='button special stop-recording'>Stop Recording</a></li>"+
                "<li v-if='item.state == \"uploaded\"'><a v-on:click='redo' class='button'>Redo</a></li>"+
                "<li v-if='item.state == \"uploaded\"'><a v-on:click='nextItem' class='button'>Next</a></li>"+
								"</ul>"+
                "<h1 v-if='item.state == \"uploading\"'>Uploading...</h1>"+
								"</header>",
  methods: {
    startRecording: function () {
      console.log("recording started")

      navigator.getUserMedia(session, function (mediaStream) {
        recordRTC = RecordRTC(mediaStream, options);
        recordRTC.startRecording();
      }, onError);

      this.$emit('set-state', 'recording')
      return false;
    },
    stopRecording: function () {
      console.log("recording stopped")
      self = this;

      recordRTC.stopRecording(function(audioURL) {
        console.log(audioURL);
        var formData = new FormData();
        formData.append('edition[audio]', recordRTC.getBlob())
        $.ajax({
          type: 'POST',
          url: 'https://content.dropboxapi.com/2/files/upload',
          data: formData,
          contentType: 'application/octet-stream',
          cache: false,
          processData: false,
          headers : {
              'Authorization' : 'Bearer aMXLck5euG0AAAAAAAAbUCOAkXQtiIp3jOKuFIdYZYcul4lO1U1M3bVpniDqkxFZ',
              'Dropbox-API-Arg' : '{"path":"/icub-data/'+self.speaker+'/'+self.item.text.toLowerCase().replace(" ", "-")+'.pcm","mode":"add","autorename":true}'
          }
        }).done(function( data ) {

        self.$emit('set-state', 'uploaded')
  });
      });

      this.$emit('set-state', 'uploading')

      //setTimeout(function() {this.$emit('set-state', 'uploaded')}.bind(this), 3000)
      return false;
    },
    uploadFile: function () {
      console.log("next")

    },
    nextItem: function () {
      this.$emit('advance-item')

    },
    redo: function () {

      this.$emit('set-state', 'start')

    }
  },
})

var app = new Vue({
  el: '#app',
  data: {
    speaker: btoa(Math.random()).substring(0,12),
    currentPos: 0,
    sentenceList: [
      { id: 0, text: 'iCub', state: 'start' },
      { id: 1, text: 'Ciao iCub', state: 'start' },
      { id: 2, text: 'Ciao', state: 'start' },
      { id: 3, text: 'Hello iCub', state: 'start' },
      { id: 4, text: 'Hello', state: 'start' },
    ],
    complete: function() { return !(this.currentPos <= this.sentenceList.length) },
  },
  methods: {
    setState: function(state) {
      this.sentenceList[this.currentPos].state = state
    },
    advanceItem: function() {
      if(this.currentPos <= this.sentenceList.length-1)
        this.currentPos += 1;
    }
  }
})
