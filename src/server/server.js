let ws = require('nodejs-websocket');
let userlist = []
console.log('开始建立连接...')

let server = ws.createServer(function (conn) {
    conn.on('text', function (str) {
        console.log('浏览器给服务端收到的信息为:' + str)

        let strObj = JSON.parse(str)
        let user = strObj.user
        conn.nickname = user.nickname
        updateUserList(user)
        strObj.userlist = userlist
        broadcast(JSON.stringify(strObj))
    })

    conn.on('close', function (code) {
        console.log('关闭连接', code, conn.nickname)
        for(let i=0;i<userlist.length;i++){
            if(userlist[i].nickname == conn.nickname){
                userlist.splice(i,1)
            }
        }
        let strObj = {
            info: `${conn.nickname} 离开了群聊`,
            type:0,
            userlist
        }
        broadcast(JSON.stringify(strObj))
        // console.log(conn)
    });

    conn.on('error', function (code, reason) {
        console.log('异常关闭', code, reason)
    });
}).listen(8001)

let http = require('http');
let url = require('url');
http.createServer((req,res)=>{
    res.writeHead(200,{'Content-type':'text/plain;charset=utf-8',"Access-Control-Allow-Origin": "*"});
    let param = url.parse(req.url,true).query
    console.log('用户尝试用户名登录：'+param.nickname)
    let nameList = []
    for(let item of userlist)
        nameList.push(item.nickname)
    console.log('已有的用户列表')
    console.log(nameList)
    if(nameList.includes(param.nickname))    
        res.end('0')
    else
        res.end('1')
}).listen(8082)

function broadcast(data){
    server.connections.forEach(conn=>{
        conn.sendText(data)
    })
}

function updateUserList(user){
    let nameList = []
    for(let item of userlist)
        nameList.push(item.nickname)
    nameList.includes(user.nickname) || userlist.push(user)
}

console.log('WebSocket建立完毕');