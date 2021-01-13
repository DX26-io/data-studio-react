import SockJS from 'sockjs-client';
const url = 'http://localhost:9000/flair-ws';
const sock = new SockJS(url);
sock.onopen = () => {
  debugger
  console.log('connection to server open');
};

sock.onmessage = e => {
  debugger
  this.setState( { messages: [e.data, ...this.state.messages] });
};

sock.onclose = () => {
  debugger
  console.log('close');
};