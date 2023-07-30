<template>
    <div class="button" :class="{ button_disabled: disabled, primary, warning, error }">
        <icon :src="icon" width="36" height="36" class="button_img"/>
        <text class="button_text">{{text}}</text>
    </div>
</template>

<script>
    export default {
        name: "Button",
        props: {
            text: String,
            icon: String,
            warning: Boolean,
            error: Boolean,
            primary: Boolean,
            disabled: Boolean,
        }
    }
</script>

<style scoped lang="less">
    .button {
        height: 88px;
        border-radius: 10px;
        padding-left: 20px;
        padding-right: 20px;
        border-style: solid;
        border-width: 2px;
        border-color: #ccd6d2;
        display: flex;
        background-color: white;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;

        &_img {
            margin-right: 10px;
        }
        &.primary {
            background: #00795c;
            border: none;
            .button_text {
                color: white;
            }
        }
        &.warning {
            background: #ff7e00;
            border: none;
            .button_text {
                color: white;
            }
        }
        &.error {
            background: #ff0000;
            border: none;
            .button_text {
                color: white;
            }
        }
    }

    .button_disabled {
        opacity: 0.4;
    }

    .button_text {
        line-height: 80px;
        font-size: 35px;
        color: #4a4a4a;
        text-align: center;
        flex-grow: 1;
    }
</style>
