<template>

<div class="emoji-outside" v-show="showEmoji" @click.stop>
    <div class="emoji-wrap">
        <span class="emoji-item" v-for="(item,index) in emojiList" :key="index" :title="item.name" @click="insert(item.emoji)">{{item.emoji}}</span>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return {
            emojiList: require('@/assets/emoji.json'),
        }
    },
    props:{
        field:String,
        showEmoji:Boolean
    },
    methods:{
        async insert(myValue) {
            const myField = document.getElementById(this.field);
            if (myField.selectionStart || myField.selectionStart === 0) {
                var startPos = myField.selectionStart
                var endPos = myField.selectionEnd
                myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
                await this.$nextTick() // 这句是重点, 圈起来
                myField.focus()
                myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
            } else {
                myField.value += myValue
            }
            this.$emit('hide')
        }
    }
}
</script>

<style>
    .emoji-outside {
        width: 350px;
        height: 230px;
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, .3);
        border-radius: 20px;
        background-color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
    }

    .emoji-outside::before {
        content: "";
        position: absolute;
        bottom: -20px;
        width: 0;
        height: 0;
        border: 10px solid;
        border-color: #bdc3c7 transparent transparent transparent;
    }

    .emoji-wrap {
        width: 300px;
        height: 200px;
        padding: 0 10px;
        background-color: #f2f2f2;
        display: grid;
        grid-template-columns: repeat(8,1fr);
        grid-auto-rows: 25px;
        gap: 5px;
        justify-items: center;
        overflow-y: scroll;
    }

    .emoji-wrap::-webkit-scrollbar {
        width: 5px;
        height: 1px;
    }

    .emoji-wrap::-webkit-scrollbar-thumb{
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #f2f2f2;
    }

    .emoji-item {
        cursor: pointer;
    }

    .emoji-item:hover {
        background-color: rgb(197, 186, 186);
    }
</style>