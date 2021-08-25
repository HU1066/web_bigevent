$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义一个查询参数对象
    var q = {
        pagenum:1,
        pagesize:2,
        cate_id:'',
        state:''
    }

    //定义时间过滤器
    template.defaults.imports.dateFormat = function(date){
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    //定义补零方法
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                //console.log(res);
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                var htmlStr = template('tpl-cate',res);
                $('[name = cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    $('#form-search').on('submit',function (e) {
        e.preventDefault();
        //获取表单选中项的值
        var cate_id = $('[name = cate_id]').val();
        var state = $('[name = state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    function renderPage(total) {
        laypage.render({
            elem:'pageBox',
            count:total,
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','limit','prev', 'page', 'next','skip'],
            limits:[2,3,5,10],
            //分页发生切换时，触发回调
            jump:function (obj,first) {
                //最新页码复制到q对象中
                q.pagenum = obj.curr;
                //把最新的条目数赋值到q中
                q.pagesize = obj.limit;
                //根据最新q渲染表格
                //首次不执行
                if(!first){
                    //do something
                    initTable();
                }
                //initTable();
            }
        })
    }
    
    $('tbody').on('click','.btn-del',function () {
        var len = $('.btn-del').length;
        //console.log('ok');
        var id = $(this).attr('data-id');
        //console.log(id);
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    //当数据删除完成后，判断当前页是否有剩余数据
                    //如没有，则需将页码值-1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})