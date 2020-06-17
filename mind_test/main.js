$(document).ready(function(){
    //建立currerntQuiz 儲存作答的狀態(第幾題)
    let currentQuiz=null;
    //按下按鈕
    $("#startButton").click(function(){
        if(currentQuiz==null){
            //作答第0題
            currentQuiz=0;
            //顯示題目
            $("#question").text(questions[0].question);
            //清空選項
            $("#options").empty();
            //放入選項
            for(let x=0;x<questions[0].answers.length;x++){
                $("#options").append(
                    "<input name='options' type='radio' value="+
                    x+">"+
                    "<label>"+questions[0].answers[x][0]+
                    "</label><br><br>"
                );
            }
            //按鈕寫next
            $("#startButton").attr("value","Next");
        }
        else{
            //若已開始作答 從此繼續
            //尋訪每個選項是否都有被選取
            $.each(
                $(":radio"),function(i,val){
                    if(val.checked){
                        //假設已產生最終結果:1
                        //分成是否已產生最終結果(A-D)
                        if(isNaN(questions[currentQuiz].answers[i][1])){
                            //通往最終成果
                            let finalResult = questions[currentQuiz].answers[i][1];
                            //顯示最終成果的標題
                            $("#question").text(finalAnswers[finalResult][0]);
                            //清空選項區域
                            $("#options").empty();
                            //顯示最終成果的內容
                            $("#options").append(finalAnswers[finalResult][1]+"<br><br>");
                            //重置 第幾題的變數
                            currentQuiz=null;
                            $("#startButton").attr("value","Restart");
                        }
                        else{
                            //繼續下個題目:2
                            //指定下一個要顯示的題目，原始資料從1開始，所以要-1 PS:資料從0開始存 顯示從1開始算
                            currentQuiz = questions[currentQuiz].answers[i][1]-1;
                            //顯示新的題目
                            $("#question").text(questions[currentQuiz].question);
                            //清空舊的選項內容
                            $("#options").empty();
                            //顯示新的選項內容
                            for(let x=0;x<questions[currentQuiz].answers.length;x++){//questions[currentQuiz].answers.length 此例應為4
                                $("#options").append(
                                    "<input name='options' type='radio' value="+
                                    x+">"+
                                    "<label>"+questions[currentQuiz].answers[x][0]+
                                    "</label><br><br>"
                                );
                            }
                        }
                        //完成跳出迴圈
                        return false;
                    }
                }
            );            
        }
    });
});