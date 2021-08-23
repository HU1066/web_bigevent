$(function () {
    // 点击去注册
    $("#link_reg").on('click',function () {
        $(".login-box").hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click',function () {
        $(".reg-box").hide();
        $(".login-box").show();
    })

    //从layui获取form对象
    var form = layui.form;
    //自定义校验规则
    form.verify({
        //自定义一个pwd的校验规则
        pwd:[/^[\S]{6,12}$/,'密码必须6-12位，且不能出现空格'],
        repwd:function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
              return '两次密码不一致!';
            }
        }
    })
    var layer = layui.layer;
    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function (e) {
        e.preventDefault();
        $.post('/api/reguser',{username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},function (res) {
            if (res.status !== 0){
              return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录');
            //模拟点击行为
            $('#link_login').click();
        })
    })

    $('#form_login').on('submit',function (e) {
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            //快速获取表单数据
            data:$(this).serialize(),
            success:function (res) {
                if (res.status !== 0) {
                  return layer.msg('登录失败！');
                }
                layer.msg('登录成功');
                //将token保存到localstorage
                localStorage.setItem('token',res.token);
                //console.log(res.token);
                // 跳转主页
                location.href = './index.html';
            }
        })
    })
})