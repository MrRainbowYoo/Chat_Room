// var WebSocketServer = require('ws').Server;
// wss = new WebSocketServer({ port: 3000 });
// wss.on('connection', function (ws) {
//     console.log('服务端：客户端已连接');
//     ws.on('message', function (message) {
//         //打印客户端监听的消息
//         console.log(message);
//     });
// });

var ws = require('nodejs-websocket');
console.log('开始建立连接...')

ws.createServer(function (conn) {
    conn.on('text', function (str) {
        console.log('浏览器给服务端收到的信息为:' + str)
        conn.sendText('服务器下发的内容=>'+str)
    })
    conn.on('close', function (code, reason) {
        console.log('关闭连接', code, reason)
    });
    conn.on('error', function (code, reason) {
        console.log('异常关闭', code, reason)
    });
}).listen(8001)
console.log('WebSocket建立完毕');