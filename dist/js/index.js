// 老虎机抽奖版本1.0

(function ($) {
    $.fn.slotMachine = function (setting) {
        //CSS 模糊的css
        // $("body").append("<style>" +
        //     ".slotMachineBlurFast{-webkit-filter: blur(5px);-moz-filter: blur(5px);-o-filter: blur(5px);-ms-filter: blur(5px);filter: blur(5px);}" +
        //     ".slotMachineBlurMedium{-webkit-filter: blur(3px);-moz-filter: blur(3px);-o-filter: blur(3px);-ms-filter: blur(3px);filter: blur(3px);}" +
        //     ".slotMachineBlurSlow{-webkit-filter: blur(1px);-moz-filter: blur(1px);-o-filter: blur(1px);-ms-filter: blur(1px);filter: blur(1px);}" +
        //     "</style>");
        var defaults = { //默认值
            active: 0,
            delay: 0,
            speed: 200,
        };
        var animateFilter = "slotMachineBlurMedium"; //遮罩样式
        setting = $.extend(defaults, setting); //设置样式
        var $solt = $(this); //进行洗牌的对象
        var _numberSolt = $solt.children(); //滚动对象的子元素
        var _timer = null; //设置时间对象
        var _currentAnimate = null; //动画对象
        var _isRunning = false; //是否还在滚动
        var _isTimeBeigin = false; //是否开启了时间间隔循环动画
        var _maxTop = 0; //top的值
        var _active = {
            index: setting.active,
            el: _numberSolt.get(setting.active)
        };
        var speed = setting.speed; //滚动速度
        var endSpeed = speed * 4; //结束滚动的速度
        //Required easing functions
        if (typeof $.easing.easeOutBounce !== "function") {
            //From jQuery easing, extend jQuery animations functions
            $.extend($.easing, {
                easeOutBounce: function (x, t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                    }
                },
            });
        }

        function shuffle() { //滚动动画
            _currentAnimate = $solt.animate({
                    top: _maxTop
                },
                speed,
                function () {
                    if (_isTimeBeigin) { //如果停止了动画循环，停止动画，设置停止滑动到指定位置
                        resetTop();
                        beiginRun();
                    } else {
                        removeAnimate();
                        stopAnimation();
                    }
                }
            )
        };

        function stopAnimation() { //滑动到指定位置
            $solt.animate({
                    top: _maxTop
                },
                endSpeed,
                'easeOutBounce',
                function () {
                    setIsRun(); //设置isRun是false
                    clearTimeout(_timer); //清空timer
                }
            )
        }

        function beiginRun() {
            _timer = setTimeout(function () {
                shuffle();
            }, setting.delay);
        }

        function getMaxTop(num) { //计算top的值
            if (num == null || num == undefined) {
                num = _numberSolt.length - 1;
            }
            let totalTop = -num * _active.el.getBoundingClientRect().height + "px";
            return totalTop;
        }

        function gotoStop(index) { //设置停止的位置，改变时间停止的状态
            _maxTop = getMaxTop(index);
            _isTimeBeigin = false;
            console.log(_isRunning)
        }

        function resetTop() { //重置Top的值
            $solt.css("top", 0);
        }

        function removeAnimate() {
            if (_currentAnimate == null) {
                return;
            }
            console.log("停止", $solt.css("top"))
            _currentAnimate.stop();
        }

        function setIsRun() {
            _isRunning = false;
            $solt.removeClass(animateFilter);
        }
        $solt.running = function () { //判断是否正在滚动
            if (_isRunning) {
                return;
            }
            _isRunning = true;
            _isTimeBeigin = true;
            _maxTop = getMaxTop();
            $solt.addClass(animateFilter);
            beiginRun();
        }
        $solt.isRun = function () { //获得是否正在滚动的状态
            return _isRunning;
        }
        $solt.stopRun = function (index) {

            gotoStop(index); //执行停止操作
        }
        $solt.initPos = function (initPosIndex) { //初始化随机位置
            let initTop = -initPosIndex * _active.el.getBoundingClientRect().height + "px";
            // console.log('dsfdfsd', _active.el.getBoundingClientRect().height);
            $solt.css('top', initTop);
        }
        return $solt;
    }

})(jQuery)