$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname : function (value) {
            if (value > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function (res) {
                if (res.status !== 0){
                    return layer.msg('获取用户信息失败！');
                }
                //console.log(res.data)
                form.val('formUserInfo',res.data);

            }
        })
    }

    //重置表单数据
    $('#btnReset').on('click',function (e) {
        //阻止表单默认重置
        e.preventDefault();
        initUserInfo();
    })

    //监听表单提交
    $('.layui-form').on('submit',function (e) {
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }

                layer.msg('更新用户信息成功！');
                //调用父页面方法，渲染头像和信息
                window.parent.getUserInfo();
            }
        })
    })
})