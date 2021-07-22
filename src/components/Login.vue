<template>
  <div class="wrap">
      <div class="login-box">
          <div class="login-info">
              <div class="label">选择头像</div>
              <ul class="avatar-list">
                  <li v-for="(item,index) in avatars" :key="index" @click="chooseAvatar(index)" :class="{'choosed':choosedAvatar === index}">
                      <img :src="item" alt="">
                  </li>
              </ul>
          </div>
          <div class="login-info">
              <div class="label">用户名</div>
              <input type="text" required placeholder="请输入用户名" list="usernamelist" v-model="nickname">
              <datalist id="usernamelist">
                  <option value="11"></option>
                  <option value="12"></option>
                  <option value="13"></option>
                  <option value="14"></option>
              </datalist>
          </div>
          <button class="login-btn" @click="login">立即登录</button>
      </div>
      <Modal v-if="showModal" :msg="modalMsg" :success="modalSuccess" :fail="modalFail"></Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue'
import axios from 'axios'

export default {
    data(){
        return {
            avatars:[require('@/assets/1.jpg'),require('@/assets/2.jpg'),require('@/assets/3.jpg'),require('@/assets/4.jpg'),
            require('@/assets/5.jpg'),require('@/assets/6.jpg'),require('@/assets/7.jpg'),require('@/assets/8.jpg'),
            require('@/assets/9.jpg'),require('@/assets/10.jpg'),require('@/assets/11.jpg'),require('@/assets/12.jpg'),],
            choosedAvatar:0,
            nickname:"",
            showModal:false,
            modalMsg:'正在登录中，请稍候....',
            modalSuccess:false,
            modalFail:false
        }
    },
    components: {
        Modal
    },
    methods:{
        chooseAvatar(index){
            this.choosedAvatar = index
        },
        toHome(){
            this.$router.push({
                name:'home',
                params:{
                    nickname:this.nickname,
                    avatar:this.avatars[this.choosedAvatar]}
            })
        },
        checkLogin(){
            return new Promise((resolve,reject)=>{
                axios({
                    url:'http://localhost:8082',
                    method:'get',
                    params:{
                        nickname:this.nickname
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.data != '1'){
                        setTimeout(() => {
                            reject('登录失败，该用户名已存在!')
                        }, 2000);
                    }else{
                        setTimeout(() => {
                            resolve('登录成功')  
                        }, 2000);
                    }
                })
            }).then(res=>{
                this.modal(res,'success')  
            }).catch(res=>{
                this.modal(res,'fail')
            })
        },
        login(){
            if(this.nickname.match(/^\s*$/)) alert('用户名不准为空')
            else{
                this.nickname = this.nickname.trim()
                this.showModal = true
                this.checkLogin()
                .then(()=>{
                    setTimeout(() => {
                        this.showModal = false
                        if(this.modalSuccess)                    
                            this.toHome()                            
                        this.modal('正在登录中，请稍候....','normal')                       
                    }, 1000);                     
                })
            }
        },
        modal(msg,type='normal'){
            this.modalMsg = msg
            switch(type){
                case 'success':
                    this.modalSuccess = true
                    this.modalFail = false
                    break;
                case 'fail':
                    this.modalFail = true
                    this.modalSuccess = false
                    break;
                case 'normal':
                    this.modalSuccess = false
                    this.modalFail = false
            }
        }
    }
}
</script>

<style lang="less">
    .login-box {
        width: 300px;
        height: 450px;
        border: 1px solid #ddd;
        padding: 10px;
        box-sizing: border-box;
        background-color: rgb(245, 245, 245);
        box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, .3);
    }

    .login-info {
        margin-bottom: 20px;

        .label {
            font-size: 20px;
            margin-bottom: 10px;
        }

        input {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            outline: none;
            color:rgba(0, 0, 0, .6)
        }
    }

    .avatar-list {
        width:100%;
        display: grid;
        grid-template-columns: repeat(4,1fr);
        gap: 4px;

        /* 保证头像为正方形 */
        li {
            position: relative;
        }

        li::before {
            content:"";
            padding-bottom: 100%;
            display: block;
        }

        img {
            width: 90%;
            height: 90%;
            object-fit: cover;
            cursor: pointer;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }

    .choosed {
        border: 5px solid rgb(26, 173, 25);
    }

    .login-btn {
        text-align: center;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        background-color: rgb(26, 173, 25);
        border: none;
        color: #fff;
        letter-spacing: .3rem;
        cursor: pointer;
    }

    .login-btn:hover {
        background-color: rgb(12, 116, 12);
    }
</style>