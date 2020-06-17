$(document).ready(function(){
    setTable();
 
    //如果有人來設定日期
    $("#inputDate").change(function(){
        let inputDate = $(this).val();
        console.log(inputDate);//yyyy-mm-dd
        let splitText = inputDate.split("-");
        console.log(splitText);
        setMonthAndDay(splitText[1],splitText[2]);
        setTable();
    });
 
});

function setTable(){
    $("#courseTable").empty();
 
    //一次產生固定標題列
    $("#courseTable").append(
        "<tr><th>場次</th><th>時間</th><th>主題</th></tr>"
    );
    //反覆產生資料列
    let topicCount = topicsArray.length;
 
    //計算一天有多少毫秒
    let oneDayMilliseconds = 24*60*60*1000;
 
    for(let x=0; x<topicCount; x++){
        let thisDate = new Date(startDate.getTime()+7*x*oneDayMilliseconds);
        let trSpecial = "<tr>";
        if(topicsArray[x]=="不上課"){
            trSpecial = "<tr style='background-color:lightyellow'>";
        }
        $("#courseTable").append(
            trSpecial +
            "<td>"+ (x+1) +"</td>"+
            "<td>"+ thisDate.toLocaleDateString().slice(5) +"</td>"+
            "<td>" + topicsArray[x]+"</td>"+
            "</tr>"
        ); //每一列有場次、預計日期、主題
    }
}
