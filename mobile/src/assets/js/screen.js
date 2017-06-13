
window.onload = function() {

    //:active失效问题
    document.body.addEventListener('touchstart', function () {});
    // 获取屏幕大小
    var html1 = document.documentElement;
    var screen = html1.clientWidth;
    function getfont() {
        html1.style.fontSize = 100/375 * screen + 'px';    
    }
    getfont();
        // 监听div和屏幕的改变
    window.onresize = function() {
        var html1 = document.documentElement;
        var scW = html1.clientWidth;
        screen=scW;
        getfont();
    }
    
    
} 
