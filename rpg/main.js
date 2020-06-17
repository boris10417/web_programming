//mapArray :決定地圖中每個格子的元素
//ctx : HTML5 Canvas使用
//currenImgMainX,currentImgMainY : 決定主角所在座標
//imgMountain,imgMain,imgEnemy : 障礙物、主角、敵人的圖片物件

let mapArray,ctx,currentImgMainX,currentImgMainY;
let imgMountain,imgMain,imgEnemy;

//當網頁元件載入完成要做的事情
$(document).ready(function(){
    //遊戲地圖
    //0:可走 1:障礙 2:終點 3:敵人
    mapArray = [0,1,1,0,0,0,3,1,2];
    ctx = $("#myCanvas")[0].getContext("2d");

    //擺主角
    imgMain = new Image();
    imgMain.src = "images/spriteSheet.png";
    currentImgMainX = 0;
    currentImgMainY = 0;
    imgMain.onload = function(){
        ctx.drawImage(imgMain,0,0,80,130,currentImgMainX,currentImgMainY,200,200);
    }
    //擺障礙物和敵人
    imgMountain = new Image();
    imgMountain.src = "images/material.png";
    imgEnemy = new Image();
    imgEnemy.src = "images/Enemy.png";
    imgMountain.onload = function(){
        imgEnemy.onload = function(){
            for(let x in mapArray){
                if(mapArray[x]==1){
                    ctx.drawImage(imgMountain,32,65,32,32,x%3*200,Math.floor(x/3)*200,200,200);
                }
                else if(mapArray[x]==3){
                    ctx.drawImage(imgEnemy,7,40,104,135,x%3*200,Math.floor(x/3)*200,200,200);
                }
            }
        }
    };
});

//當有人按下案件後要做的事情
$(document).keydown(function(event){
    let targetImgMainX,targetImgMainY,targetBlock,cutImagePositionX;
    //主角即將要移動過去的目標位置 主角即將要移動過去的那一格編號 依據主角朝向甚麼方向而決定的圖片
    event.preventDefault();
    //避免典籍鍵盤出現瀏覽器的其他行為，例如捲動、放大、換頁...
    //根據使用者案件只是，對應計算目標位置、主角新的方向圖片
    
    switch(event.originalEvent.code){
        case "ArrowLeft": //向左
            targetImgMainX = currentImgMainX-200;
            targetImgMainY = currentImgMainY;
            cutImagePositionX = 175;
            break;
        case "ArrowUp": //向上
            targetImgMainX = currentImgMainX;
            targetImgMainY = currentImgMainY-200;
            cutImagePositionX = 355;
            break;
        case "ArrowRight": //向右
            targetImgMainX = currentImgMainX+200;
            targetImgMainY = currentImgMainY;
            cutImagePositionX = 540;
            break;   
        case "ArrowDown": //向下
            targetImgMainX = currentImgMainX;
            targetImgMainY = currentImgMainY+200;
            cutImagePositionX = 0;
            break;       
        default: //其他按鍵不回應
            return;    
    }
    //在邊界內
    if(targetImgMainX<=400 && targetImgMainX>=0 &&
        targetImgMainY<=400 && targetImgMainY>=0){
        targetBlock = targetImgMainX/200 + targetImgMainY/200*3;
    }
    else{ //超出邊界
        targetBlock = -1;
    }
    //清楚主角原本所在位置
    ctx.clearRect(currentImgMainX,currentImgMainY,200,200);
    if(targetBlock == -1 || mapArray[targetBlock]==1 || mapArray[targetBlock]==3){
        //所有異常(出界、遇到敵人、遇到障礙物都不動)
    }
    else{//正常情況就設定新的位置
        $("#talkBox").empty();
        currentImgMainX = targetImgMainX;
        currentImgMainY = targetImgMainY;
    }
    //在新的位置畫上主角
    ctx.drawImage(imgMain,cutImagePositionX,0,80,130,currentImgMainX,currentImgMainY,200,200);
    //對應文字顯示狀態
    switch(mapArray[targetBlock]){
        case undefined:
            $("#talkBox").text("邊界");
            break;
        case 1:
            $("#talkBox").text("有山");
            break;
        case 2:
            $("#talkBox").text("抵達終點");
            break;
        case 3:
            $("#talkBox").text("哈囉");
            break;        
    }
});