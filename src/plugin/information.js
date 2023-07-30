// import router from "../router";
//
// var modal = weex.requireModule('modal');

// var stream = weex.requireModule('stream');

function get(url) {
    return new Promise((resolve, reject) => {
        // stream.fetch({
        //     method: 'GET',
        //     type: 'json',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'token': Vue.prototype.vuex.main.userInfo ? (Vue.prototype.vuex.main.userInfo.account + '@@' + Vue.prototype.vuex.main.token) : ''
        //     },
        //     url: 'https://api.studying1v1.com' + url
        // }, function(ret) {
        //     if(ret.ok) {
        //         resolve(ret.data);
        //     } else {
        //         reject(ret);
        //     }
        // });
    });
}

let callback = () => {
}

export function setUpdateUescCallback(cb) {
    callback = cb
}

export function updateUsed(type) {
    return new Promise((resolve) => {
        get('/notice/lastId?types=' + type)
            .then(res => {
                localStorage.setItem('redCode|' + type, res[0])
                callback()
                resolve()
            })
    })
}

export function getNotUsedCount(type) {
    return new Promise((resolve) => {
        const data = localStorage.getItem('redCode|' + type)
        get('/notice/count?types=' + type + '&ids=' + data)
        .then(res => {
            resolve(res[0])
        })
    })
}
