$(function () {
    getUserInfo();

    var layer = layui.layer;

    $('#btnLogout').on('click',function () {
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            //清空本地token
            localStorage.removeItem('token');
            //跳转至登录页
            location.href = './login.html';
            layer.close(index);
        });
    })
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