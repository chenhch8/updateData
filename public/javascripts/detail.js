/**
 * Created by flyman on 16-9-12.
 */
$(function () {
    // 点击后进入详情页
    $("tr").on("click", function (event) {
        var target = $(event.target).parent().children().eq(0);
        var href = target.text();
        if (href === undefined || !(/\d*/.test(Number(href)))) return;
        location.href = "/details/" + href;
    });

    // 点击"取消"后返回上一页面
    $("#back").on("click", function () {
        window.history.back();
    });
    
    $("#download").on("click", function () {
        var imgDate = $("[name=updateDate]").val();
        imgDate = imgDate.substring(0, index);
        imgDate = imgDate.replace('/', '-').replace('/', '-');
    });

    function getDate() {
        var date = $("[name=updateDate]").val();
        var index = date.lastIndexOf('/');
        date = date.substring(0, index);
        date = date.replace('/', '-').replace('/', '-');
        return date;
    }

    // 进入详情页后装载图片--懒加载
    (function () {
        var img = $("._image_ > div");
        if (img === undefined) return;

        var imgDate = getDate();
        var imgID = $("[name=stdnum]").val();

        var imgURL = "/photos/" + imgDate + '~' + imgID + '.jpg';

        var image = $(document.createElement('img'));
        image.attr("src", imgURL);
        image.addClass("img-thumbnail img-responsive img-rounded");
        img.append(image);
    })();
});
