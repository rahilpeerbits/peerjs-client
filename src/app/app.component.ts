import { Component, OnInit, ViewChild } from '@angular/core';
import Peer from 'peerjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  peer: Peer = new Peer({
    host: '192.168.1.113',
    port: 8521,
    path: '/'
  });
  mypeerid: string = '';
  otherId: any = '';
  connecton: any;
  navigator: any = window.navigator;
  isOtherUserLoggedin = false;
  @ViewChild('video') video:any;
  @ViewChild('avideo') avideo:any; 
  
  constructor() {
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.mypeerid = this.peer.id;
      console.log(this.mypeerid);
    }, 3000);
    this.peer.on('connection', (conn) => {
      conn.on('data', (data: any) => {
        // Will print 'hi!'
        console.log(data);
      });
      conn.on('open', () => {
        conn.send('hello!');
        this.isOtherUserLoggedin = true;
      });
    });
    this.peer.on('error', (err) => {
      console.log(err);
    });
    const that = this;
    var getUserMedia = this.navigator.getUserMedia || this.navigator.webkitGetUserMedia || this.navigator.mozGetUserMedia;
    let isPlayed = false;
    this.peer.on('call', function(call) {
      getUserMedia({video: true, audio: true}, function(stream: any) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream: any) {
          // Show stream in some video/canvas element.
          let _video = that.avideo.nativeElement;
          var binaryData = [];
          binaryData.push(remoteStream);
          if(!isPlayed) {
            _video.srcObject = remoteStream;
            _video.play();
            isPlayed = true;
          }

          // Show stream in some video/canvas element.
          let _Myvideo = that.video.nativeElement;
          // var binaryData = [];
          // binaryData.push(stream);
          _Myvideo.srcObject = stream;
          _Myvideo.play();
        });
      }, function(err: any) {
        console.log('Failed to get local stream' ,err);
      });
    });
  }
  connectPeer(): void {
    const conn = this.peer.connect(this.otherId);
    this.connecton = conn;
    if(conn){
      conn.on('open', () => {
        conn.send('Connected');
      }),
      conn.on('data', (data) => {
        console.log(data);
      })
    }
  }
  emitMsg() {
    this.connecton.send('sent message');
  }
  call() {
    const that = this;
    let isPlayed = false;
    let getUserMedia = this.navigator.getUserMedia || this.navigator.webkitGetUserMedia || this.navigator.mozGetUserMedia;
    
    getUserMedia({video: true, audio: true}, function(stream: any) {
      var call = that.peer.call(that.otherId, stream);
      call.on('stream', function(remoteStream: any) {
        // Show stream in some video/canvas element.
        let _video = that.video.nativeElement;
        if(!isPlayed) {
          _video.srcObject = remoteStream;
          _video.play();  
          isPlayed = true;
        }


        // Show stream in some video/canvas element.
        let _Myvideo = that.avideo.nativeElement;
        // var binaryData = [];
        // binaryData.push(stream);
        // if(!isPlayed) {
          _Myvideo.srcObject = stream;
          _Myvideo.play();
          isPlayed = true;
        // }

      });
    }, function(err: any) {
      console.log('Failed to get local stream' ,err);
    });
  }
}
