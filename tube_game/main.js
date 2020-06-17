//紀錄已經走過的點
let walk_path = [];
let random_matrix = [];
let end_point = [];//由於元件可能載入太快 導致下方water_flow()的比較壞掉 故要預設終點
let start_point= [];
let arrList =[];
let arrList_with_watter =[];
let original_arrList = [];
let rows_val;
let cols_val;
let arr = [];
let img_id;
let set_time;
let timer;
let water_flow_timer;
let water_move_timer;
let water_move_record = [];
let water_move_count;
let buffer_matrix = []
let image_width = 70;
let image_height = 70;
let state_of_image = [null,"rotate_clicked_img_one_time(this)"];
let state;
let spectial_next_position =[];//由於函式不知道為什麼不能return array by value 因此只能使用全域變數暴力解
$(document).ready(function(){
    $("#level_create").click(function(){
            
            //鎖住圖片旋轉
            //$(".tube").attr("disabled",true);
            //控制圖片能否旋轉的狀態變數
            state = 0;
            /*
            let tubeclass = document.getElementsByClassName('tube');
            for(let i=0;i<tubeclass.length;i++){
                tubeclass[i].onclick() = null;
            }
            */
            //console.log("tube = " + tubeclass);
            //console.log(document.getElementsByClassName('tube'));
            
            //將遊戲說明隱藏
            $("#readme").attr("style","display:none");
            //鎖住產生關卡
            $("#level_create").attr("disabled",true);
            //按下一次開始遊戲後 鎖住直到下一次按下產生關卡後解鎖
            $("#game_start").attr("disabled",false);
            //初始化區
            //console.log(document.getElementById('difficulty').value);
            //根據難度調整時間
            switch(document.getElementById('difficulty').value){
                case "easy":
                    //html顯示重置
                    document.getElementById('timer_display').innerHTML =  "時間限時:30秒";
                    //計時器重置
                    set_time = 30;
                    break;
                case "normal":
                    //html顯示重置
                    document.getElementById('timer_display').innerHTML =  "時間限時:20 秒";
                    //計時器重置
                    set_time = 20;
                    break;
                case "hard":
                    //html顯示重置
                    document.getElementById('timer_display').innerHTML =  "時間限時:15 秒";
                    //計時器重置
                    set_time = 15;
                    break;
                case "really":
                    //html顯示重置
                    document.getElementById('timer_display').innerHTML =  "時間限時:10 秒";
                    //計時器重置
                    set_time = 10;
                    break;
                default:
                    break;
            }

            
            //計時器重置
            //清空目前關卡
            $("#matrix").empty();
            //矩陣重置
            arrList = [];
            //初始化完畢

            //按下按鈕後 根據列數行數產生關卡
            //抓值 rows cols 型態為數字
            rows_val = $("#rows").val();
            cols_val = $("#cols").val();
            //let tr_head = "<tr>";

            //console.log($("#rows").val());
            //console.log(rows);
            //console.log($("#cols").val());

            
            //隨機產生一個矩陣 目標由0 1 2 3 組成
            

            for(let i=0 ;i<rows_val ;i++){
                arr = [];
                //上下左右邊界設為2
                for(let j=0 ;j<cols_val ;j++){
                    if(j==0 || j==(cols_val-1) || i==0 || i==(rows_val-1)){
                        arr.push(Number(2));
                    }
                    else{                    
                        arr.push(Number(0));
                    }
                }//ex:[2,0,0,0,0,0,2]
                arrList.push(arr)
                //[[2,2,2,2,2,2,2],[2,0,0,0,0,0,2],[2,2,2,2,2,2,2]]
            }
            //console.log("arrList = " + arrList);
            //產生隨機路徑的矩陣
            //結果由a~l ,0 ,2 ,3組成
            get_random_path(arrList);

            //console.log("typeof(arrList) = "+typeof(arrList));
            /*//將所有的1藉由walkpath改成水管符號
            change_one_to_tube_shape(n_rows_elements);
            */
           /*
            random_matrix = arrList.slice(0,rows_val);


            //n_rows_elements目前已處理完成
            //接著 照著此矩陣 建立一個圖片矩陣
            //test
            for(let i= 0;i<rows_val;i++){
                $("#matrix").append("<tr>");
                for(let j= 0;j<cols_val;j++){
                    $("#matrix").append(
                        "<td>"+random_matrix[i][j] +"</td>"
                    );
                }
                $("#matrix").append("</tr>");
            }
            */
            //console.log("產生關卡完成一次---");
            //0跟3的位置放入隨機圖片
            random_generate_image(arrList);
            /*//(測試用)產生圖片矩陣
            change_one_to_tube_shape(arrList);
            */
            /*
            //輸出旋轉前的矩陣來看
            console.log("內容打亂前obj=");
            for(let i=0;i<arrList.length;i++){
                console.log(arrList[i]);
            }
            */
            //將內容打亂
            rotate_n_times(arrList);
            /*
            //輸出旋轉後的矩陣來看
            console.log("內容打亂後obj=");
            for(let i=0;i<arrList.length;i++){
                console.log(arrList[i]);
            }
            */
            //產生圖片矩陣
            draw(arrList);

            //$('body').on('click',rotate_clicked_img_one_time());  
            

            //關卡產生完成
            //console.log("關卡產生完成!");

            //顯示開始遊戲按鈕    display : inline-block;
            $("#game_start").attr("style","display:inline-block");
    });
    //當開始遊戲被點擊，倒數開始
    //當按鈕觸發時，計時開始  預設60秒
    //模式為倒數
    $("#game_start").click(function(){
        
        state = 1;
        draw(arrList);

        //按下一次開始遊戲後 鎖住直到下一次按下產生關卡後解鎖
        $("#game_start").attr("disabled",true);
        //console.log("count_down中:");

        let timer_display = document.getElementById("timer_display");
        
        //console.log("目前秒數 = "+set_time);
        //每n秒呼叫一次
        //每一秒 倒數一次
        //0.5秒傳入一次 每兩次呼叫++秒數一次
        timer = setInterval( "pass_one_second()" , 1000);
        
        //console.log("count_down結束，時間(set_time)="+set_time);

       
        //console.log("初始化的arrList_with_watter = ");
        //for(let i=0;i<arrList_with_watter.length;i++){
            //console.log(arrList_with_watter[i]);
        //}
        /* 
            1.水流10秒後才會進 水流後的畫圖應該放在water_flow()中
            2.在時間內，arrlist會隨著點擊改變樣子
            3.時間到後，arrlist_with_water
            
        */
        //呼叫水流檢查答案
        //開始按鈕後，約10秒以上才開始檢查水流
        //初始化紀錄矩陣
        water_move_record = [];
        water_flow_timer = setTimeout("water_flow()", set_time*1000);
        
    });

});


function rotate_clicked_img_one_time(elem){
    //console.log("rotate_clicked_img_one_time()中");
    //抓到目前被點擊圖片的id
    let id = $(elem).attr('id');
    //console.log($(elem).attr('class'));
    //console.log("hasclass() = "+$(elem).hasClass("tube"));

    let row = Math.floor( Number(id) / cols_val);
    let col = Math.floor( Number(id) % cols_val) - 1;
    //console.log("row = "+row);
    //console.log("col = "+col);
    if(row>0 && row<rows_val && col > 0&& col < cols_val){
         //旋轉此id的圖片，並紀錄矩陣
        //console.log("old arrList[row][col] = "+arrList[row][col]);
        arrList[row][col] = rotate(arrList[row][col]);
        //console.log("new arrList[row][col] = "+arrList[row][col]);
    }
    //產生圖片矩陣
    //console.log("旋轉完!");

    //將目前被點擊的id傳入 只改變目標圖片
    draw_in_playing(id,arrList);

    //每次點擊都旋轉圖片
    draw(arrList);
    //console.log("畫圖完!");
    //console.log("rotate_clicked_img_one_time()結束");    
}

//點擊旋轉圖片的func


/*
1.先產生起點與終點
ex:
    rows = 5 cols = 7

    rows == 0 |2,2,2,2,2,2,2|
    rows == 1 |2,0,0,0,0,0,2|
    rows == 2 |2,0,0,0,t,0,2|
    rows == 3 |2,0,0,0,0,0,2|
    rows == 4 |2,2,2,2,2,2,2|
    t座標(2,4)
     19 % 5 = 4

    id  = 7    * 2 + (4 + 1) = 19
        = cols * x +  y + 1
2.接著從起點開始一步一步尋找路徑，
遇到0就可以走
遇到a~l代表已經走過
遇到2代表撞牆
遇到3代表死路
*/
function get_random_path(obj){
    //從obj拿到列與行
    let rows = obj.length;
    let cols = obj[0].length;

    //console.log("get_random_path()中，目前rows:"+rows+"  目前cols:"+cols);

    //產生起點與終點位置，
    //列的選擇範圍:ex:rows = 6 ,Math.floor(Math.random()*6-2)+1= 0~4 +1 1~5
    start_point = [Math.floor(Math.random()*(rows-2))+1,0]
    end_point = [Math.floor(Math.random()*(rows-2))+1,cols-1]

    //先將終點設為1
    /*ex
        設起點為(1,0) 終點為(3,7)
        rows == 0 |2,2,2,2,2,2,2|
        rows == 1 |1,0,0,0,0,0,2|
        rows == 2 |2,0,0,0,0,0,2|
        rows == 3 |2,0,0,0,0,0,1|
        rows == 4 |2,2,2,2,2,2,2|
    */
    obj[end_point[0]][end_point[1]] = 1;

    //console.log("起點,終點:"+start_point+"||"+end_point);
    

    //現在找路徑 從起點開始
    //記錄目前位置與下一格位置的:[number(row),number(col),水管形狀]
    let this_position = [];
    let next_position = [];

    //確認是否抵達終點
    while(!(this_position[0]==end_point[0] &&//確認rows
        this_position[1]==end_point[1] )){//確認cols
            //console.log("obj=");
            for(let i=0;i<obj.length;i++){
                //console.log(obj[i]);
            }
            //初始化
            //下一格位置每一輪都先洗掉
            next_position = [];
            //初始化結束

            //第一輪將起點放入目前位置
            if(this_position.length == 0){
                //console.log("this_position.length="+this_position.length);
                //將目前位置移動到起點
                //複製而不是建立reference 要用slice
                this_position = [start_point[0],start_point[1],"k"];
                //console.log("目前位置的內容:"+this_position);
                //console.log(":"+this_position[0] +"  "+this_position[1]+"  "+this_position[2]);

                //每輪都要將矩陣中目前位置的值放入水管符號，須測試符號與數字能否同時存在
                obj[this_position[0]][this_position[1]] = this_position[2];
            }
            //第二輪開始根據目前位置做事
            else{
                
                //根據目前位置與水管形狀得出下一格位置在哪，並且同時得出下一格所有可能的水管形狀
                next_position = find_next_position(this_position);

                //console.log("next_position = "+next_position[0]+","+next_position[1]+","+next_position[2]);
                /*
                1.判斷下一格能不能走
                2.若能走，判斷下下個位置的值，並得出可以確實使用的水管形狀，從中挑選任一，
                    當前方的路被堵死時需重新判斷下下格位置的值，並得出新的可以確實使用的水管形狀，從中挑選任一
                    當下下個位置的值是終點時，強制挑選水管形狀為通往終點的
                3.若不能走，將下一格設為3，目前這格設為0，後退一步
                */
               //console.log("this_position = "+this_position);
               //console.log("get_random_path中，準備進入check_road_and_random_a_tube()");
                this_position = check_road_and_random_a_tube(obj,next_position,this_position);
                //console.log("new_this_position = "+this_position);
                //每輪都要將矩陣中目前位置的值放入水管符號，須測試符號與數字能否同時存在
                obj[this_position[0]][this_position[1]] = this_position[2];
            }
    }
    //最後將終點也改變，預計為k
    obj[this_position[0]][this_position[1]] = this_position[2];

    //console.log("get_random_path中，結束");
}

/*
目前next_position包含了下個位置的(row,col,[三種可以使用的水管形狀])
1.確認下個位置是否可行走，
若可以則根據水管形狀找到分別的下下個位置，將下下個位置的值存起
使用隨機數當骰到0時，決定為接下來的水管線
*/
function check_road_and_random_a_tube(obj,next_position,this_position){
    
    //1.確認下個位置是否可行走，
    switch(obj[next_position[0]][next_position[1]]){
        case 1://下格為終點
            //1.紀錄目前位置 與水管形狀
            walk_path.push([this_position[0],this_position[1]]);
            obj[this_position[0]][this_position[1]] = this_position[2];
            //2.將位置移動到下一格
            return [next_position[0],next_position[1],"k"];
            break;
        case 0://可走
            //當路可以走時
            //1.紀錄目前位置
            walk_path.push([this_position[0],this_position[1]]);
            //......
            //2.根據水管形狀找到分別的下下個位置，將下下個位置的值存起
            let next_next_position = [];
            let row =next_position[0];
            let col =next_position[1];
            for(let i=0;i<3;i++){
                switch(next_position[2][i]){
                    case 'a'://上往右:a
                        next_next_position.push([row,col+1]);
                        break;
                    case 'b'://上往下:b
                        next_next_position.push([row+1,col]);
                        break;
                    case 'c'://上往左:c
                        next_next_position.push([row,col-1]);
                        break;    
                    case 'd'://右往下:d
                        next_next_position.push([row+1,col]);
                        break;
                    case 'e'://右往左:e
                        next_next_position.push([row,col-1]);
                        break;
                    case 'f'://右往上:f
                        next_next_position.push([row-1,col]);
                        break;
                    case 'g'://下往左:g
                        next_next_position.push([row,col-1]);
                        break;
                    case 'h'://下往上:h
                        next_next_position.push([row-1,col]);
                        break;
                    case 'i'://下往右:i
                        next_next_position.push([row,col+1]);
                        break;
                    case 'j'://左往上:j 
                        next_next_position.push([row-1,col]);
                        break;
                    case 'k'://左往右:k 
                        next_next_position.push([row,col+1]);
                        break;
                    case 'l'://左往下:l
                        next_next_position.push([row+1,col]);
                        break;  
                    }
            }
            //next_next_position現在存了三個座標 分別為三種水管形狀的終點座標
            //接著檢查這三個座標哪幾個能用
            //若當下下個位置的值是終點時，強制挑選水管形狀為通往終點的，並將下格位置放入目前位置return
            for(let i=0;i<3;i++){
                if(next_next_position[i][0] == end_point[0] && next_next_position[i][1] == end_point[1]){
                    return [next_position[0],next_position[1],next_position[2][i]]
                }
            }
            //若當下下個位置的值都不是終點時

            //隨機產生數字0~2 將被選到的水管形狀測試是否能用，若不能則重骰
            let random_zero_to_two = (Math.floor(Math.random()*3));
            
            //console.log("next_next_position[0] =["+next_next_position[0][0]+","+next_next_position[0][1]+"]");
            //console.log("next_next_position[1] =["+next_next_position[1][0]+","+next_next_position[1][1]+"]");
            //console.log("next_next_position[2] =["+next_next_position[2][0]+","+next_next_position[2][1]+"]");
            //console.log("random_zero_to_two ="+random_zero_to_two);
            
            //若選的座標!=0 代表該形狀的水管不能用 重骰
            //檢查next_next_position若皆為!=0 則不進入迴圈，意思是當下下個位置必定沒路走時，隨便挑一個管線，反正之後會後退回來
            while(obj[next_next_position[random_zero_to_two][0]][next_next_position[random_zero_to_two][1]] != 0 && !(
                (obj[next_next_position[0][0]][next_next_position[0][1]] != 0)&&
                (obj[next_next_position[1][0]][next_next_position[1][1]] != 0)&&
                (obj[next_next_position[2][0]][next_next_position[2][1]] != 0)
                )
            ){
                random_zero_to_two = (Math.floor(Math.random()*3));
                //console.log("random_zero_to_two ="+random_zero_to_two);
                
            }
            
            //當終於骰到能用的時候，將內容放入this_position
            //console.log("新的目前位置[new_row,new_col,new_shape] ="+[next_position[0],next_position[1],next_position[2][random_zero_to_two]]);
            return [next_position[0],next_position[1],next_position[2][random_zero_to_two]];
            /*
            console.log("check_road_and_random_a_tube中，準備進入choose_a_tube()");
            let buffer_next_position = choose_a_tube(obj,next_position[0],next_position[1],this_position[2]);
            this_position = []
            this_position = buffer_next_position.slice(0,3);
            */
            break;
        case 2://牆
        case 3://死路
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
            //若不能走，將下一格設為3，目前這格設為0，後退兩步
            //當紀錄遇到死路狀況 但是不能把已經走過的路蓋掉
            /*if(obj[next_position[0]][next_position[1]] == 2){
                obj[next_position[0]][next_position[1]] = 3;
            }*/
            obj[this_position[0]][this_position[1]] = 3;
            obj[walk_path[walk_path.length-1][0]][walk_path[walk_path.length-1][1]] = 0;                
            //目前位置後退兩步
            //目前位置放入walk_path的倒數第二格
            this_position = [walk_path[walk_path.length-2][0]  ,  walk_path[walk_path.length-2][1]  ,  obj[walk_path[walk_path.length-2][0]][walk_path[walk_path.length-2][1]]];
            
            //將walk_path最上層兩個元素pop掉，刪掉的第一格是遇到死路的目前位置，刪掉第二格是前一格位置，刪掉才能排新的管線
            //console.log("walk_path = ["+walk_path+"]");
            walk_path.pop();
            walk_path.pop();
            //console.log("walk_path = ["+walk_path+"]");
            //console.log("161行，walk_path = "+walk_path);
            //
            break;    
    }
    
    
    //console.log("check_road_and_random_a_tube中，結束");
    return this_position;
}


//藉由目前位置與水管形狀，判斷下一格位置的row col 與三種可能的水管形狀
//回傳(row ,col ,[三種可能的水管形狀])
function find_next_position(this_position){
    let next_position = [];
    //根據目前位置的水管形狀 判斷下一格在哪
    //並且直接判斷可能的管線有哪些，ex:['j','k','l']
    switch(this_position[2]){
        case 'a'://上往右:a
            next_position.push(this_position[0]);
            next_position.push(this_position[1]+1);    
            next_position.push(['j','k','l']);
            break;
        case 'b'://上往下:b
            next_position.push(this_position[0]+1);
            next_position.push(this_position[1]);
            next_position.push(['a','b','c']);
            break;
        case 'c'://上往左:c
            next_position.push(this_position[0]);
            next_position.push(this_position[1]-1);
            next_position.push(['d','e','f']);
            break;    
        case 'd'://右往下:d
            next_position.push(this_position[0]+1);
            next_position.push(this_position[1]);
            next_position.push(['a','b','c']);
            break;
        case 'e'://右往左:e
            next_position.push(this_position[0]);
            next_position.push(this_position[1]-1);
            next_position.push(['d','e','f']);
            break;
        case 'f'://右往上:f
            next_position.push(this_position[0]-1);
            next_position.push(this_position[1]);
            next_position.push(['g','h','i']);
            break;
        case 'g'://下往左:g
            next_position.push(this_position[0]);
            next_position.push(this_position[1]-1);
            next_position.push(['d','e','f']);
            break;
        case 'h'://下往上:h
            next_position.push(this_position[0]-1);
            next_position.push(this_position[1]);
            next_position.push(['g','h','i']);
            break;
        case 'i'://下往右:i
            next_position.push(this_position[0]);
            next_position.push(this_position[1]+1);
            next_position.push(['j','k','l']);
            break;
        case 'j'://左往上:j 
            next_position.push(this_position[0]-1);
            next_position.push(this_position[1]);
            next_position.push(['g','h','i']);
            break;
        case 'k'://左往右:k 
            next_position.push(this_position[0]);
            next_position.push(this_position[1]+1);
            next_position.push(['j','k','l']);
            break;
        case 'l'://左往下:l
            next_position.push(this_position[0]+1);
            next_position.push(this_position[1]);
            next_position.push(['a','b','c']);
            break;        
    }
    //console.log("find_next_position中，結束");
    return next_position;
}
//上右下左

//現在定義水管
//上往右:a
//上往下:b
//上往左:c
//右往下:d
//右往左:e
//右往上:f
//下往左:g
//下往上:h
//下往右:i
//左往上:j      
//左往右:k      
//左往下:l

//每次函式，統一順時針旋轉一次
//回傳符號就好
function rotate(string){
    switch(string){
        case 'a':
        case 'f':
            return 'd';
            break;
        case 'b':
        case 'h':
            return 'e';
            break;
        case 'c':
        case 'j':
            return 'a';
            break;
        case 'd':
        case 'i':
            return 'l';
            break;
        case 'e':
        case 'k':
            return 'b';
            break;
        case 'g':
        case 'l':
            return 'c';
            break;
    }

}

//隨機旋轉n次
function rotate_n_times(obj){

    let rotatetime = 0;
    //尋訪中間內容並將水管形狀隨機次數旋轉
    //row範圍:1~rows_val-1 
    //col範圍:1~cols_val-1 
    for(let i=1;i<rows_val-1;i++){
        for(let j=1;j<cols_val-1;j++){
            
            //隨機旋轉1到3次
            let rotatetime = (Math.floor(Math.random() * 2)+1);
            while(rotatetime>0){
                obj[i][j] = rotate(obj[i][j]);
                rotatetime--;
            }
        }
    }
}

//將矩陣內容打亂
function random_generate_image(obj){
    let a_l = "abcdefghijkl";
    //console.log("a_l[0] = " + a_l[0]);
    //console.log("a_l.length = " + a_l.length);
    /*/輸出現在的矩陣來看
    console.log("obj=");
    for(let i=0;i<obj.length;i++){
        console.log(obj[i]);
    }
*/
    for(let i=0;i<rows_val;i++){
        for(let j=0;j<cols_val;j++){
            if(obj[i][j] == 0 || obj[i][j] == 3){
                obj[i][j] = a_l[ Math.floor(Math.random() * 12) ];
            }
        }
    }
    /*
    //輸出新的矩陣來看
    console.log("obj=");
        for(let i=0;i<obj.length;i++){
            console.log(obj[i]);
        }
        */
}
//setInterval(pass_one_second(60),)


function pass_one_second(){
    //("pass_one_second中:");
    //console.log("state =="+state);
    //不確定每秒呼叫一次draw有沒有問題
    //目前用成使用onclick  每次點擊的時候改變一張圖片 (倒數階段)
    //draw(arrList);

    //3 2 1
    if(set_time <= 0){
        //初始化區
        water_move_count = 0;
        //初始化區結束
        timer_display.innerHTML = "時間到";
        clearInterval(timer);
        //console.log("timer = "+timer);
        buffer_matrix = arrList.map(b => b.map(c => c));
        water_move_timer = setInterval("water_move_per_sec()",1000);
        //畫有水的水管矩陣
        //console.log("畫圖中");
        //console.log("final arrList_with_watter = ");
        //for(let i=0;i<arrList_with_watter.length;i++){
            //console.log(arrList_with_watter[i]);
        //}

        //change_one_to_tube_shape(arrList_with_watter);
        //draw(arrList_with_watter);
        //console.log("畫圖結束");
    }
    else{
        set_time--;
        timer_display.innerHTML = "時間剩下 "+set_time +" 秒";
    }
    //console.log("目前秒數(left_time) = "+set_time);
}


//時間到之後 使用水流檢查 檢查方式為最後有沒有到終點為準
//檢查時需要看現在位置與下一格位置的水管是否可連通
function water_flow(){
    //console.log("in water_flow()");
    //console.log("start_point = "+start_point);
    //console.log("end_point = "+end_point);
    //初始化區
    //目前位置 = 起點座標 內容:row col 形狀
    let this_position = [start_point[0],start_point[1], arrList[start_point[0]][start_point[1]]];
    //設第一次的時候 前一位置 與 目前位置相同
    let prev_position = this_position;
    //此變數用以確認玩家勝利與否
    let win = true;

    //console.log("typeof(arrList) = "+typeof(arrList));
    //console.log("typeof(arrList[0]) = "+typeof(arrList[0]));
    //console.log("arrList[0].length = "+arrList[0].length);
    //有待測試 目前效果好像會出事 $.extend(true, {}, arrList);
    //arrList_with_watter = $.extend(true, {}, arrList);
    //arrList_with_watter = arrList.concat();
    //arrList_with_watter = arrList.slice();
    //arrList_with_watter = arrList.slice(0,arrList.length);
    /*//暴力解 也不行
    arrList_with_watter = new Array(arrList.length);
    for(let i=0;i<arrList.length;i++){
        arrList_with_watter[i] = new Array(arrList[i]);
    }
    */
   arrList_with_watter = [];
    arrList_with_watter = arrList.map(b => b.map(c => c));
        
    //console.log("in water flow arrList = ");
    //for(let i=0;i<arrList.length;i++){
        //console.log(arrList[i]);
    //}      
    //console.log("in water flow arrList_with_watter = ");
    //for(let i=0;i<arrList_with_watter.length;i++){
        //console.log(arrList_with_watter[i]);
    //}
    /*
    arrList_with_watter[0][0] = "X";
    console.log("添加檢查符號 X");
    
    console.log("in water flow arrList = ");
    for(let i=0;i<arrList.length;i++){
        console.log(arrList[i]);
    }
    console.log("in water flow arrList_with_watter = ");
    for(let i=0;i<arrList_with_watter.length;i++){
        console.log(arrList_with_watter[i]);
    }
    */
    let next_position;
    //初始化end

    //console.log("this_position = "+this_position);
    //尋找水流的路時，應該記錄已經流過的位置
    //使用arrList_with_watter矩陣紀錄
    while(! (  (this_position[0] == end_point[0]) && (this_position[1] == end_point[1]) ) ){
        /*//根據目前位置畫新的充滿水的水管
        change_one_to_tube_shape(arrList);*/
        //console.log("in while()");

        //console.log("prev_position = "+prev_position);
        //console.log("this_position = "+this_position);

        //紀錄水流移動座標 之後用以每秒畫圖 
        //第0次 this_p = 起點
        //第1次 this_p = 起點 +1 格
        //倒數第二次 this_p = 終點前一格

        if(check_two_tube_can_connect_and_pass(prev_position,this_position) == false ){
            //console.log("check_two_tube_can_connect_and_pass() == false");
            win = false;
            break;
        }
        else{
            water_move_record.push([this_position[0],this_position[1]]);

            //console.log("check_two_tube_can_connect_and_pass() == true");
            //將水管的圖片名稱後方+0 接下來畫圖將畫出充滿水的
            arrList_with_watter[this_position[0]][this_position[1]] = arrList[this_position[0]][this_position[1]].concat("0");
            //console.log
            //檢查
            /**/
            //console.log("prev_position = "+prev_position);
            //console.log("this_position = "+this_position);
            //console.log("spectial_next_position = "+spectial_next_position);
            
            //下一個位置
            next_position = [];
            next_position = spectial_next_position.concat();
            //將前一位置 = 目前位置
            prev_position = [];
            prev_position = this_position.slice(0,this_position.length);
    
            //目前位置 =下個位置
            this_position = [];
            this_position = [next_position[0],next_position[1],next_position[2]];
            //next position基本上會消失並在下一輪重新宣告
            /*
            console.log("shift之後:");
            console.log("prev_position = "+prev_position);
            console.log("this_position = "+this_position);
            console.log("next_position = "+next_position);
            */
           
            
        }
    }
    //若為終點
    if((this_position[0] == end_point[0]) && (this_position[1] == end_point[1])){
        //補上最後一個節點的圖片+0
        arrList_with_watter[this_position[0]][this_position[1]] = arrList[this_position[0]][this_position[1]]+"0";
        //最後一次 水流到終點的紀錄點
        water_move_record.push([this_position[0],this_position[1]]);
    }
    else{//不補上 不紀錄
    }
    //console.log("typeof(arrList_with_watter) = "+typeof(arrList_with_watter));
    
    //console.log("in water flow arrList_with_watter = ");
    //for(let i=0;i<arrList_with_watter.length;i++){
        //console.log(arrList_with_watter[i]);
    //}

    
    

    //console.log("while結束() with win = "+win);

    if(!win){
        alert("水撞牆了!GAME OVER!");
    }
    else{
        alert("You Win!");
    }
    //時間到後馬上把圖片鎖住不讓旋轉
    $(".tube").attr("disabled",true);
    //console.log("water_flow()結束");
}

//根據水的前一個位置 水現在的位置 水現在的位置的水管形狀 判斷下一個座標
function find_next_position_easy_version(prev_position,this_position){
    //第一輪 this_position與 prev_position相同 無條件判斷下一個座標為row,col+1
    let next_position = [];
    spectial_next_position = [];
    //須修正 需考慮來向 去向
    //水管種類:abcdel
    //根據目前位置的座標與水管形狀找到下個位置
    //若沒有水管的流向 我要怎麼知道目前的形狀是通往哪個點呢?
    //故找尋下個位置的座標時，流向需考慮
    //console.log("find_next_position_easy_version()中");
    //第一輪 this_position與 prev_position相同 無條件判斷下一個座標為row,col+1
    if(prev_position[0] == this_position[0] && prev_position[1] == this_position[1]){
        //console.log("起點狀況");
        let buffer = [this_position[0],this_position[1]+1 , arrList[ this_position[0] ][ this_position[1]+1 ]];
        //console.log("buffer =" + buffer);
        spectial_next_position = [this_position[0], this_position[1]+1 ,arrList[ this_position[0] ][ this_position[1]+1 ]];
        //console.log("spectial_next_position =" + spectial_next_position);
    }
    //
    else{
        //console.log("中途狀況");
        let next;
        //求出下一個位置
        //"up to down" ex:上下情況 上右型水管 next = 右邊 
        if(prev_position[0]+1 == this_position[0] && prev_position[1] ==this_position[1]){
            next = find_next_position_by_situation_and_shape("up to down",this_position[2]);
        }
        //"down to up"
        else if(prev_position[0]-1 == this_position[0] && prev_position[1] == this_position[1]){
            next = find_next_position_by_situation_and_shape("down to up",this_position[2]);
        }
        //"right to left"
        else if(prev_position[0] == this_position[0] && prev_position[1]-1 == this_position[1]){
            next = find_next_position_by_situation_and_shape("right to left",this_position[2]);
        }
        //"left to right"
        else if(prev_position[0] == this_position[0] && prev_position[1]+1 == this_position[1]){
            next = find_next_position_by_situation_and_shape("left to right",this_position[2]);
        }
        //當下一位置的水管無法通過時 回傳字串false
        if(next == "false"){
            return false;
        }
        //console.log("this_position = "+this_position);
        switch(next){
            
            case "right":
                spectial_next_position = [this_position[0] ,this_position[1]+1, arrList[ this_position[0] ][ this_position[1]+1 ] ] ;
                break;
            case "up":
                spectial_next_position = [this_position[0]-1,this_position[1],arrList[this_position[0]-1][this_position[1]] ] ;
                break;
            case "down":
                spectial_next_position = [this_position[0]+1,this_position[1],arrList[this_position[0]+1][this_position[1]]] ;
                break;
            case "left":
                spectial_next_position = [this_position[0],this_position[1]-1,arrList[this_position[0]][this_position[1]-1]] ;
                break;
        }
        return true;
        console.log("next = "+next);
        console.log("spectial_next_position ="+spectial_next_position);
    }
}

//新定義的水管
//由於起點跟終點不會旋轉 因此用"k"來判斷終點到沒
//判斷是否可連通
//需要座標判斷水的來向 與 水的去向
//若為死路 則alert(game over) 
function check_two_tube_can_connect_and_pass(prev,this_p){
    //console.log("prev = "+this_p);
    //console.log("this_p = "+this_p);

    //1.藉由先前位置與目前位置先判斷水的流向
    //2.藉由水的流向 與 現在水管形狀 得出下一位置
    
    //起點例外
    if(prev[0] == this_p[0] && prev[1] == this_p[1]){
        next = "right";
    }
    //當目前位置的水管形狀 是2 或 d0 e0 k0 a0 l0 b0 c0 任一種時 代表遇到死路 回傳false
    else if(this_p[2] == 2 || this_p[2] =="d0" || this_p[2] =="e0" ||this_p[2] =="k0" ||this_p[2] =="a0" ||this_p[2] =="l0" ||this_p[2] =="b0" ||this_p[2] =="c0"  ){
        next = "false";
    }
    else{
        //求出下一個位置
        //"up to down" ex:上下情況 上右型水管 next = 右邊 
        if(prev[0]+1 == this_p[0] && prev[1] ==this_p[1]){
            next = find_next_position_by_situation_and_shape("up to down",this_p[2]);
        }
            //"down to up"
        else if(prev[0]-1 == this_p[0] && prev[1] == this_p[1]){
            next = find_next_position_by_situation_and_shape("down to up",this_p[2]);
        }
        //"right to left"
        else if(prev[0] == this_p[0] && prev[1]-1 == this_p[1]){
            next = find_next_position_by_situation_and_shape("right to left",this_p[2]);
        }
        //"left to right"
        else if(prev[0] == this_p[0] && prev[1]+1 == this_p[1]){
            next = find_next_position_by_situation_and_shape("left to right",this_p[2]);
        }
    }
    switch(next){          
        case "right":
            spectial_next_position = [this_p[0] ,this_p[1]+1, arrList[ this_p[0] ][ this_p[1]+1 ] ] ;
            break;
        case "up":
            spectial_next_position = [this_p[0]-1,this_p[1],arrList[this_p[0]-1][this_p[1]] ] ;
            break;
        case "down":
            spectial_next_position = [this_p[0]+1,this_p[1],arrList[this_p[0]+1][this_p[1]]] ;
            break;
        case "left":
            spectial_next_position = [this_p[0],this_p[1]-1,arrList[this_p[0]][this_p[1]-1]] ;
            break;
        case "false":
            break;    
    }
    if(next == "false"){
        return false;
    }
    else{
        return true;
    }
}


/*
下右 d
左右 e k
上右 a
左下 l
上下 b
左上 c
只要有水的方向 與水管形狀即可判斷下一座標
當判斷不出下個座標時，代表兩條水管沒有一條可行之路
由於起點直接統一傳回右側為下一位置 故不用處理起點
*/
function find_next_position_by_situation_and_shape(situation,shape){
    console.log("find_next_position_by_situation_and_shape()中");
    let combine = situation.concat(" "+shape);
    let next ;
    switch(combine){
        case "up to down a":
            next = "right"; 
            break;
        case "up to down b":
            next = "down";
            break;
        case "up to down c":
            next = "left";              
            break;
        case "down to up d":
            next = "right";
            break;
        case "down to up l":
            next = "left";
            break;
        case "down to up b":
            next ="up";           
            break;
        case "left to right e":
            next = "right"; 
            break;
        case "left to right l":
            next = "down";
            break;
        case "left to right c":
            next = "up";
            break;
        case "right to left d":
            next = "down";
            break;
        case "right to left e":
            next = "right";
            break;
        case "right to left a":
            next = "up";
            break;
        default :
            next = "false";
            break;    
    }
    return next;
}


//每秒呼叫一次移動 也就是每秒畫一張圖片 根據紀錄的座標改圖即可
function water_move_per_sec(){
    //buffer_matrix = 舊的矩陣
    //暫存舊的矩陣

    if(water_move_count >= (water_move_record.length)){
        clearInterval(water_move_timer);
        //輸出遊戲結束的說明資訊
        setTimeout( alert("遊戲結束，請按產生關卡以另開新局!!"), 3000);
        
        //鎖住產生關卡
        $("#level_create").attr("disabled",false);
    }
    else{
        //將矩陣上的值 以每次一秒的速度改變 並且呼叫
        //water_move_count++;
        //console.log("in water_move_per_sec() arrList = ");
        state = 0;
        for(let i=0;i<arrList.length;i++){
            //console.log(arrList[i]);
        }
        //console.log("water_move_record.length = "+ water_move_record.length);
        //console.log("water_move_count = "+ water_move_count);
        buffer_matrix[ water_move_record[water_move_count][0]][water_move_record[water_move_count][1]] =  arrList[water_move_record[water_move_count][0]][water_move_record[water_move_count][1]] + "0";
        //console.log("water_move_record[" + (water_move_count) + "] = "+ water_move_record[water_move_count]);
        
        //水流一次畫一整張
        draw(buffer_matrix);

    }
    water_move_count++;
}



//一次畫整個圖用
function draw(obj){
    //console.log("draw()中");
    //console.log("state = "+state);
    //console.log("state_of_image[state] = "+state_of_image[state]);

    first_draw(obj);
    
}

//初次畫圖 append圖片 列*行個圖片
function first_draw(obj){
    $("#matrix").empty();
    $("#matrix").css("height",rows_val*image_height+100+"px");
    $("#matrix").css("width",cols_val*image_width+100+"px");
    $("#matrix").css("border-style","dashed");
    for(let i= 0;i<rows_val;i++){
        $("#matrix").append("<tr>");
        for(let j= 0;j<cols_val;j++){
            //當為邊界 且不為起點或終點時
            if(obj[i][j] == 2 ){//(不為起點且不為終點)且(左右邊界或上下邊界)|| obj[i][j] == 3
                $("#matrix").append('<img class="wall" id='+ (cols_val * i + 1 + j) +' src="images/border.png" width="'+image_width +'px" height="'+image_height +'px" />');
            }
            //有水的水管 abcdel
            else if(obj[i][j] =="a0" ||obj[i][j] =="b0" || obj[i][j] =="c0"||obj[i][j] =="d0"||obj[i][j] =="e0" || obj[i][j] =="l0"){
                $("#matrix").append('<img class="water_fill" id='+ (cols_val * i + 1 + j) +' src="images/'+obj[i][j]+'.png" width="'+image_width +'px" height="'+image_height +'px" />');
            }
            //沒水的水管   
            else{
                //id =cols * x + 1 + y  
                $("#matrix").append('<img class="tube" onClick="' +state_of_image[state] +'" id='+ (cols_val * i + 1 + j) +' src="images/'+obj[i][j]+'.png" width="'+image_width +'px" height="'+image_height +'px" />');
            
            }
        }
        $("#matrix").append("</tr>");
    }
}
//後方改圖 只針對attr做操作   
//id不變 高度寬度不變
//src會變 onclick會變

//每次呼叫只改變一張圖片
//目前此函式只有在倒數階段會使用到，用以保證倒數時不會因為畫圖跟倒數同時執行而導致中間操作卡頓
function draw_in_playing(id,obj){
    //console.log("draw_in_playing()中");
    for(let i= 0;i<rows_val;i++){      
        for(let j= 0;j<cols_val;j++){
            //console.log("id = "+id);
            //當為邊界 且不為起點或終點時
            if(obj[i][j] == 2 ){//(不為起點且不為終點)且(左右邊界或上下邊界)|| obj[i][j] == 3
            }
            //有水的水管 abcdel
            else if(obj[i][j] =="a0" ||obj[i][j] =="b0" || obj[i][j] =="c0"||obj[i][j] =="d0"||obj[i][j] =="e0" || obj[i][j] =="l0"){
                $("#id").attr("src","images/"+obj[i][j]+".png" , "onlcick",state_of_image[state]);
            }
            //沒水的水管   
            else{
                //id =cols * x + 1 + y  
                $("#id").attr("src","images/"+obj[i][j]+".png？time" + new Date().getTime() , "onlcick",state_of_image[state]);
                
                //console.log($("#id").attr("src","images/"+obj[i][j]+".png"));
            }
        }
    }

    //console.log("目前矩陣在draw_in_playing中 = ")
    //for(let i=0;i<obj.length;i++){
        //console.log(obj[i]);
    //}
}