<template>
  <div class="home">
      <div class="chat-wrap">
          <div class="left-wrap">
              <div class="user">
                  <div class="avatar-wrap">
                      <img :src="avatar" alt="">
                  </div>
                  <div class="user-nickname">司马懿</div>
              </div>
              <div class="user-list-wrap">
                  <h4>当前在线列表</h4>
                  <div class="user-list">
                        <ul>
                            <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>                      <li>
                                <div class="user">
                                    <div class="avatar-wrap">
                                        <img :src="avatar" alt="">
                                    </div>
                                    <div class="user-nickname">司马懿</div>
                                </div>                          
                            </li>
                        </ul>
                  </div>
              </div>
          </div>
          <div class="right-wrap">
              <div class="room-name">群聊(1)</div>

              <div class="room-content" ref="roomContent">
                  <div class="message my-message">
                        <div class="message-content">测试</div>
                        <div class="message-avatar">
                            <img :src="avatar" alt="">
                        </div>
                  </div>
                                    <div class="message other-message">
                        <div class="message-content">那我也测试</div>
                        <div class="message-avatar">
                            <img :src="avatar" alt="">
                        </div>
                  </div>

                  <div class="message my-message" v-for="(item,index) in myMessage" :key="index">
                        <div class="message-content">{{item}}</div>
                        <div class="message-avatar">
                            <img :src="avatar" alt="">
                        </div>
                  </div>
              </div>

              <div class="room-edit">
                <div class="edit-tools"><img :src="file" alt=""></div>
                <div class="edit-wrap" contenteditable ref="content" @keydown.ctrl.enter="sendTest"></div>
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
export default {
    data(){
        return {
            msg:"",
            myMessage:[],
            avatar:require('@/assets/avatar.jpg'),
            file:require('@/assets/file.png'),
            websocket:null
        }
    },
    created(){
    //   this.init();
    },
    destroyed() {
    //   this.websocket.close() //离开路由之后断开websocket连接
    },    
    methods:{
        init(){
            const url = "ws://localhost:8001"
            this.websocket = new WebSocket(url)
            this.websocket.onmessage = this.websocketonmessage;
            this.websocket.onopen = this.websocketonopen;
            this.websocket.onerror = this.websocketonerror;
            this.websocket.onclose = this.websocketclose;
        },
        websocketonopen(){ //连接建立之后
            this.websocketsend('用户已经进入')
            // let actions = {"test":"12345"};
            // this.websocketsend(JSON.stringify(actions));
        },
        websocketonerror(){//连接建立失败重连
            this.init();
        },
        websocketonmessage(e){ //数据接收
            // const redata = JSON.parse(e.data);
            const redata = e.data
            console.log(redata)
        },
        websocketsend(Data){//数据发送
            this.websocket.send(Data);
        },
        websocketclose(e){  //关闭
            console.log('断开连接',e);
        },        
        sendMessage(){
            // alert(this.msg)
            this.websocketsend(this.msg)
        },
        sendTest(){
            let msg = this.$refs.content.innerText
            this.myMessage.push(msg)
            this.$refs.content.innerText = ""
            this.$nextTick(()=>{
                this.$refs.roomContent.scrollTop = this.$refs.roomContent.scrollHeight
                // console.log('scrolltop'+this.$refs.roomContent.scrollTop)
                // console.log('scrollheight'+this.$refs.roomContent.scrollHeight)
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

    .home {
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
        // box-sizing: border-box;
        display: flex;
    }

    .user {
        border-bottom: 1px solid rgba(255, 255, 255, .3);
        padding: 10px 10px 10px 0;
        display: flex;
        align-items: center;

        .avatar-wrap {
            width: @avatarSize;
            height: @avatarSize;
            margin-right: 5px;

            img {
                width: 100%;
            }
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
        }

        .room-edit {
            flex: 1;
            display: flex;
            flex-direction: column;

            .edit-tools {
                padding: 5px 0;
                height: 20px;

                img {
                    height: 100%;
                    cursor: pointer;
                }
            }

            .edit-wrap {
                outline: none;
                height: 130px;
                overflow-y: scroll;
                max-width: 100%;
                word-wrap: break-word;            
            }

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