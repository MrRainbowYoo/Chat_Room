<template>
    <div class="modal">
        <div class="modal-box" :class="{'success':success,'fail':fail}">
            {{msg}}
        </div>
    </div>
</template>

<script>
export default {
    props:{
        msg:String,
        success:Boolean,
        fail:Boolean
    }
}
</script>

<style>
    .modal {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, .8);
        z-index: 1;
    }

    .modal-box {
        width: 200px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        z-index: 2;
        border-radius: 20px;
        animation: 1s showModal;
        font-size: 14px;
        font-weight: bold;
    }

    .success {
        color: rgb(26, 173, 25);
    }

    .fail {
        color: #e74c3c;
    }

    @keyframes showModal {
        from{
            transform: scale(0);
        }
        to{
            transform: scale(1);
        }
    }
</style>