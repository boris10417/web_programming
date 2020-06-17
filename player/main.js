var player;//youtube播放器
var currentPlay = 0;//紀錄目前播到第幾首歌

//當youtube API準備好時
function onYouTubeIframeAPIReady(){
    player = new YT.Player("player",
    {
        height:"390",
        width:"640",
        videoId:playList[currentPlay],
        playerVars:{
            "autoplay":0,//不自動播放
            "controls":0,//不顯示控制項
            "start":playTime[currentPlay][0],//起始秒數
            "end":playTime[currentPlay][1],//結束秒數
            "showinfo":0,//2018/9/25被廢除後，關不掉上方標題
            "rel":0,//相關影片，2018/9/25後，可透過預載影片擋住
            "iv_load_policy":3//不顯示影片註解式行銷
        },
        events:{
            "onReady":onPlayerReady,
            "onStateChange":onPlayerStateChange
        }
    }
    );
}

//當youtbe播放器準備好，設定按鈕事件
function onPlayerReady(event){
    $("#playButton").click(function(){
        $("#songName").text(player.getVideoData().title);
        player.playVideo();
    });
}

//當播放器播放狀態改變時
function onPlayerStateChange(event){
    //當目前播放秒數與預期播放結束秒數相同時，去播下一首
    if(Math.floor(player.getCurrentTime())==playTime[currentPlay][1]){
        //正常播下一首
        if(currentPlay < playList.length-1){
            currentPlay++;
            player.loadVideoById({
                "videoId":playList[currentPlay],
                "startSeconds":playTime[currentPlay][0],  
                "endSeconds":playTime[currentPlay][1],  
                "suggestedQuality":"large"          
            });
        }
        else{//已經播到最後一首的話，就將第一手準備好，並且停止播放
            currentPlay = 0;//還原至預設值確保下輪播放從第一首開始
            player.cueVideoById({
                "videoId":playList[currentPlay],
                "startSeconds":playTime[currentPlay][0],  
                "endSeconds":playTime[currentPlay][1],  
                "suggestedQuality":"large"
            });
        }
    }
    //影片開始時抓取影片標題來顯示
    if(player.getVideoLoadedFraction()>0){
        $("#songName").text(player.getVideoData().title);
    }
}