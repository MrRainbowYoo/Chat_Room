<template>
  <div class="wrap" @click="showEmoji = false">
      <div class="chat-wrap">
          <div class="left-wrap">
              <div class="user">
                  <div class="avatar-wrap">
                      <img :src="myInfo.avatar" alt="">
                  </div>
                  <div class="user-nickname" :title="myInfo.nickname">{{myInfo.nickname}}</div>
              </div>
              <div class="user-list-wrap">
                  <h4>当前在线列表</h4>
                  <div class="user-list">
                        <ul>
                            <li v-for="(item,index) in userList" :key="index">
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="item.avatar" alt="">
                                    </div>
                                    <div class="user-nickname" :title="item.nickname">{{item.nickname}}</div>
                                </div>                          
                            </li>
                        </ul>
                  </div>
              </div>
          </div>
          <div class="right-wrap">
              <div class="room-name">群聊({{userList.length}})</div>

              <div class="room-content" ref="roomContent">
                  <div class="message" v-for="(item,index) in messageList" :key="index" 
                  :class="{'my-message':item.user.nickname==myInfo.nickname,
                  'other-message':item.user.nickname!=myInfo.nickname}">
                  <div  :class="{'message-right':item.user.nickname!=myInfo.nickname}">
                      <div class="message-user" v-show="item.user.nickname!=myInfo.nickname">{{item.user.nickname}}</div>
                      <div class="message-content">{{item.content}}</div>
                  </div>
                        
                        <div class="message-avatar">
                            <img :src="item.user.avatar" alt="">
                        </div>
                  </div>
              </div>

              <div class="room-edit">
                <Emoji class="emoji" :field="'content'" :showEmoji="showEmoji" @hide="hideEmoji"></Emoji>
                <div class="edit-tools">
                    <img :src="smile" alt="" @click.stop="openEmoji">
                    <img :src="file" alt="">
                </div>
                <textarea class="edit-wrap" id="content" ref="content" @keydown.ctrl.enter="sendTest" placeholder="说点什么..."></textarea>
                <div class="send-wrap">
                    <span>按下Ctrl+Enter发送</span>
                    <button @click="sendTest">发送</button>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Emoji from './Emoji.vue'

export default {
    data(){
        return {
            msg:"",
            myInfo:{},
            messageList:[],
            userList:[],
            avatar:require('@/assets/avatar.jpg'),
            file:require('@/assets/file.png'),
            smile:require('@/assets/smile.png'),
            websocket:null,
            showEmoji:false
        }
    },
    components:{
        Emoji
    },
    created(){
      this.init();
        let nickname = this.$route.params.nickname
        let avatar = this.$route.params.avatar
        this.myInfo = {nickname,avatar}
    },
    destroyed() {
      this.websocket.close() //离开路由之后断开websocket连接
    },    
    methods:{
        openEmoji(){
            this.showEmoji=true
        },
        hideEmoji(){
            this.showEmoji = false
        },
        init(){
            const url = "ws://localhost:8001"
            this.websocket = new WebSocket(url)
            this.websocket.onmessage = this.websocketonmessage;
            this.websocket.onopen = this.websocketonopen;
            this.websocket.onerror = this.websocketonerror;
            this.websocket.onclose = this.websocketclose;
        },
        websocketonopen(){ //连接建立之后
            let actions = {
                info:  `${this.myInfo.nickname} 进入了群聊`,
                user: {
                    nickname:this.myInfo.nickname,
                    avatar:this.myInfo.avatar
                },
                type:0
            }
           
            this.websocketsend(JSON.stringify(actions));
        },
        websocketonerror(){//连接建立失败重连
            this.init();
        },
        websocketonmessage(e){ //数据接收
            const redata = e.data
            let jsonData = JSON.parse(redata)
            if(jsonData.type == 0){
                this.userInOut(jsonData.info)
                this.updateUserList(jsonData.userlist)
            }
            else
                this.addMessage(jsonData)
        },
        websocketsend(Data){//数据发送
            this.websocket.send(Data);
        },
        websocketclose(e){  //关闭
            console.log('断开连接',e);
        },
        sendTest(){
            let msg = this.$refs.content.value
            // 空 || 空格 || 换行
            if(msg.match(/^\s*$/)) alert('不准为空')
            else{
                let actions = {
                    user: {
                        nickname:this.myInfo.nickname,
                        avatar:this.myInfo.avatar
                    },
                    type:1,
                    content:msg
                }            
                this.websocketsend(JSON.stringify(actions));
                this.$refs.content.value = ""
            }
        },
        userInOut(info){
            let roomContent = this.$refs.roomContent
            let tip = document.createElement('div')
            tip.className = 'tip'
            tip.innerText = info
            roomContent.appendChild(tip)
            this.scrollToBottom()
        },
        addMessage(redata){
            this.messageList.push(redata)
            console.log(redata)
            this.scrollToBottom()
        },
        updateUserList(userlist){
            this.userList = userlist
        },
        scrollToBottom(){
            this.$nextTick(()=>{
                this.$refs.roomContent.scrollTop = this.$refs.roomContent.scrollHeight
            })
        }
    }
}
</script>

<style lang='less'>
    @bgColor:#ecf0f1;
    @leftColor:#2e3238;
    @rightColor:#eeeeee;
    @avatarSize: 40px;

    .emoji{
        bottom: 110%;
        left: -30%;
    }

    /* 设置滚动条样式 */
    /* 滚动条整体样式 */
    .user-list::-webkit-scrollbar, .edit-wrap::-webkit-scrollbar, .room-content::-webkit-scrollbar {
        width: 5px;
        height: 1px;
    }
    /* 滚动条里面的小方块 */
    .edit-wrap::-webkit-scrollbar-thumb{
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #f2f2f2;
    }
    /* 滚动条里面的轨道 选择不显示 */
    .edit-wrap-clq::-webkit-scrollbar-track{
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        background: #fff;
    }

    .wrap {
        width: 100vw;
        height: 100vh;
        background-color: @bgColor;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .chat-wrap {
        width: 800px;
        height: 600px;
        border: 1px solid #333;
        box-sizing: border-box;
        display: flex;
    }

    .user {
        border-bottom: 1px solid rgba(255, 255, 255, .3);
        padding: 10px 10px 10px 0;
        display: flex;
        align-items: center;
        cursor: default;

        .avatar-wrap {
            width: @avatarSize;
            height: @avatarSize;
            margin-right: 5px;

            img {
                width: 100%;
            }
        }
        
        .user-nickname {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;            
        }
    }

    .left-wrap {
        width: 240px;
        background-color: @leftColor;
        color: #fff;
        padding: 10px;
        box-sizing: border-box;

        .user-list {
            height:450px;
            overflow-y:scroll;
        }

        .user-list-wrap {
            margin: 10px 0;
        }
    }

    .right-wrap {
        // flex: 1;
        width: 560px;
        display: flex;
        flex-direction: column;
        background-color: @rightColor;
        padding: 10px;
        box-sizing: border-box;

        .room-name {
            font-size: 20px;
            text-align: center;
            height: 50px;
            line-height: 50px;
        }

        .room-content {
            border: 1px solid #d6d6d6;
            border-left: none;
            border-right: none;
            padding: 10px;
            height: 350px;
            overflow-y: auto;

            .tip {
                text-align: center;
                font-size: 12px;
                color:#b7b7b7;
                margin: 5px 0;
            }
        }

        .room-edit {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;

            .edit-tools {
                padding: 5px 0;
                height: 20px;

                img {
                    margin: 0 5px;
                    height: 100%;
                    cursor: pointer;
                }
            }

            .edit-wrap {
                background-color: @rightColor;
                border: none;
                outline: none;
                height: 130px;
                overflow-y: scroll;
                max-width: 100%;
                word-wrap: break-word;
                resize:none;
                color: #2c3e50;      
                font-size: 16px;   
                font-family: Avenir,Helvetica,Arial,sans-serif;   
            }

            // .edit-wrap:empty::before {
			// 	content: attr(placeholder);
			// 	font-size: 14px;
			// 	color: #CCC;
			// 	line-height: 21px;
			// 	padding-top: 20px;
			// }

            .send-wrap {
                height: 30px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                font-size: 11px;
                color: #b1b0b0;

                button {
                    box-sizing: border-box;
                    padding: 0 10px;
                    margin-left: 10px;
                }
            }
        }
    }

    .message {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        margin: 15px 0;

        .message-avatar {
            width: @avatarSize;
            height: @avatarSize;

            img {
                width: 100%;
                height: 100%
            }
        }

        .message-right {
            margin-top: -14px;
        }

        .message-user {
            font-size: 12px;
            color: #b7b7b7;
            text-align: left;
            padding: 5px 0;
        }
        
        .message-content {
            min-height: @avatarSize;
            max-width: 400px;
            word-wrap: break-word;
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 10px;
            box-sizing: border-box;

        }
    }

    .my-message {
        display: flex;

        .message-avatar {
            margin-left: 10px;
        }

        .message-content {
            background-color: #b2e281;
            position: relative;

            &::after {
                content: "";
                position: absolute;
                left: 100%;
                top: 14px;
                border: 6px solid transparent;
                border-left-color: #b2e281;
                border-left-width: 6px;            
            }            
        }
    }

    .other-message {
        display: flex;
        flex-direction: row-reverse;

        .message-avatar {
            margin-right: 10px;
        }

        .message-content {
            background-color: #fff;
            position: relative;
            display: inline-block;

            &::after {
                content: "";
                position: absolute;
                right: 100%;
                top: 14px;
                border: 6px solid transparent;
                border-right-color: #fff;
                border-right-width: 6px;            
            }            
        }        
    }
</style>