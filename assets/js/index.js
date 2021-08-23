$(function () {
    getUserInfo();
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        headers:{
            Authorization:localStorage.getItem('token') || ''
        },
        success:function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //渲染用户头像
            renderAvatar(res.data);
        }
    })
}

//渲染用户头像
function renderAvatar(user) {
    //获取名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //按需渲染头像
    if (user.user_pic !== null) {
        //图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide();
    }else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show();
    }
}