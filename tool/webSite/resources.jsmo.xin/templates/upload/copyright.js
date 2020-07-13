var footlogo =
    '<span style="vertical-align: top;display: inline-block;">&nbsp;&nbsp;&nbsp;&nbsp;技术支持</span> <a id="flogo" target="_blank" href="http://www.uemo.net"><img src="http://resources.jsmo.xin/templates/upload/2/logo/logo.png" width="50" height="20"></a>';

if (window.location.origin.indexOf("uemo.net") != -1 && !$("#flogo")[0]) {
    $(footlogo).appendTo("#footer>p");

    $("#assistBtn ._fa-qq").attr("href", "tel:010-69557550");

    $("#assistBtn ._fa-qq").attr(
        "href",
        "tencent://message/?uin=2852263145&Site=uemo&Menu=yes"
    );

    $("#contactinfo .contact_name").text("魔艺(UEmo)极速建站系统");

    $("#contactinfo .contact_add").text("地址：北京市建外SOHO东区2号楼");

    $("#contactinfo .contact_zip").text("邮编：100000");

    $("#contactinfo .contact_tel").text("电话：010-69557550");

    $("#contactinfo .contact_mob").text("手机：13521043455  /  13811334772");

    $("#contactinfo .contact_eml").text("邮箱：touch@uelike.com");

    $("#online_lx #olx_qq a")
        .attr("href", "tencent://message/?uin=2852263145&Site=uemo&Menu=yes")

        .text("2852263145");

    $("#online_lx #olx_tel p").text("010-69557550");

    var add =
        '<li class="navitem"> <a href="http://www.uemo.net/" target="_blank"> <span data-title="返回UEmo">返回UEmo</span> </a></li>';

    $(add).insertAfter($("#header .content .nav>.navitem:last"));

    $(add).insertAfter($("#navMini .content .nav>.navitem:last"));

    $("#copyright").remove();
}

if (window.location.origin.indexOf("jsmo.xin") != -1) {
    $("#flogo,#flogodes").remove();
}
if (Promise) {
    function testAutoPlay() {
        // 杩斿洖涓€涓猵romise浠ュ憡璇夎皟鐢ㄨ€呮娴嬬粨鏋�

        return new Promise(resolve => {
            if (!$("#topSlider video").length) return;

            let audio = $("video")[0];

            let autoplay = true;

            // play杩斿洖鐨勬槸涓€涓猵romise

            audio
                .play()
                .then(() => {
                    // 鏀寔鑷姩鎾斁

                    autoplay = true;
                })
                .catch(err => {
                    // 涓嶆敮鎸佽嚜鍔ㄦ挱鏀�

                    autoplay = false;
                })
                .finally(() => {
                    // 鍛婅瘔璋冪敤鑰呯粨鏋�

                    resolve(autoplay);
                });
        });
    }

    testAutoPlay()
        .then(res => {
            if (!res) {
                $("#topSlider video").each(function(i, e) {
                    let timer;

                    timer = setInterval(function() {
                        if (e.paused) {
                            e.muted = true;

                            e.play();
                        } else {
                            clearInterval(timer);
                        }
                    }, 400);
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}