    //配置牌堆
    let leftDeck = [[], [], [], []];  //暫放區
    let rightDeck = [[1,2], [14,15], [27,28], [40,41]]; //排序區
    let underDeck = [[], [], [], [], [], [], [], []]; //亂牌堆
    let timeMachine = [];  //紀錄移動

    //更新拖動的牌堆
    let copyLeftDeck = [[], [], [], []];
    let copyRightDeck = [[1,2], [14,15], [27,28], [40,41]];
    let copyUnderDeck = [[], [], [], [], [], [], [], []];

    //(預設配置好一些牌)
    let defaultCard = [1, 2, 14, 15, 27, 28, 40, 41];

    let timer //放計時ID
    let time = 0;
    let isPause = false;  //暫停功能
    let clock = document.querySelector('#clock')
    function showTime(){
        let min = "0" + Math.floor(time/60)
        let sec = "0" + time%60
        let realTime = min.slice(-2)+':'+sec.slice(-2)
        return realTime
    }
    function countTime(){
        time++
        clock.innerHTML = showTime()
    }
    function counting(){
        timer = setInterval(function(){countTime();Over();hintShow();},1000)
    }
    function stopCounting(){
        clearTimeout(timer)
    }
    const hint = document.querySelector('#hint')
    function hintShow(){
        if(time == 300){
            hint.classList.add('show')
            setTimeout(function(){hint.classList.remove('show')},5000)
        }
    }

    function shuffle(array) {   //Fisher-Yates演算法//亂數排序演算法
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function newCards(){
      //新建一個長度52的undefined陣列，參數第一個為內容，第二個為index序，將index序＋1後放回去
        let newCardDeck = Array.from({length: 52},(_,k) => k+1);
        let shuffleCardDeck = shuffle(newCardDeck); //把1~52順序的數字洗亂
        for(let i=0;i<defaultCard.length;i++){ //抽出預設的牌
            let index=shuffleCardDeck.indexOf(defaultCard[i]);
            shuffleCardDeck.splice(index,1);
        }
        // 分 6,6,6,6,5,5,5,5張放入八個牌堆內 0~5 6~11 12~17 18~23 24~28.........
        for (let i=0;i<=7;i++){
            if(i<=3){
                underDeck[i]=shuffleCardDeck.splice(0,6);
            }else{
                underDeck[i]=shuffleCardDeck.splice(0,5);
            }
        }
    }

    newCards()

    //備份牌堆
    for(let i=0;i<underDeck.length;i++){
        copyUnderDeck[i] = underDeck[i].slice(0) 
    }

    //分花色
    let kindColor = function(num){
        let k = Math.floor(num / 13);
        if(k==0 || num==13){
            return 's'; //黑桃
        }else if(k==1 && num!=13){
            return 'h'; //紅心
        }else if(k==2 && num!=26){
            return 'd'; //方塊
        }else if(k==3 && num!=39){
            return 'c'; //梅花
        }else if(num==26){
            return 'h';
        }else if(num==39){
            return 'd';
        }else if(k==4){
            return 'c'
        }
    }
    //比對花色用
    let pairKindColor = function(num){
        let k = Math.ceil(num / 13);
        return k
    }

    //分數字
    let cardNum = function(num){
       let k=num%13;
       if(k==0){
           return 13;
       }else{
           return k;
       }
    }

    //比對亂牌區規則
    let pairCard = function(child,mom){
        if(cardNum(child) + 1 == cardNum(mom)){  
          if(pairKindColor(child) + pairKindColor(mom) !== 5 && pairKindColor(child) != pairKindColor(mom)){
              return true
          }else{
              return false
          }
        }else{
            return false
        }
    }

    let medsection = document.getElementById('medsection'); //抓中央牌區的把拔

    let freshUnderView = function(){  //渲染中央牌區元素
        underDeck.forEach((decks,index) =>{   //把每個牌堆放進html元素
            const medDeck = document.createElement('div');
            medDeck.id = `under-deck-${index}`;
            medDeck.className = 'deck';
            medDeck.deck = 'under';
            decks.forEach((cards,cardIndex) =>{ //把牌堆裡的卡也放進html元素
                const underCard = document.createElement('div');
                underCard.draggable = true;
                underCard.id = `card${cards}`;
                underCard.className='cardbox0';
                underCard.deck = `under${index}`;
                underCard.number = cards;

                underCard.style.backgroundImage = `url(img/card/poker-${kindColor(cards)}${cardNum(cards)}.svg)`;

                medDeck.appendChild(underCard); //卡片放進牌堆
            })
            medsection.appendChild(medDeck);  //牌堆放進中央牌區
        })
    }

    let rightCardDeck = document.getElementById('rightCardDeck'); //一樣，抓右上牌區父層

    let freshRightView = function(){  //渲染右上成功排序區
        rightDeck.forEach((decks,index) => {
            const deckTR = document.createElement('div');
            deckTR.id = `right-deck-${index}`;
            deckTR.className = 'deck';
            deckTR.deck = 'right'
            decks.forEach((cards,cardIndex) => {
                const rightCard = document.createElement('div');

                rightCard.draggable = true;
                
                rightCard.id = `card${cards}`;
                rightCard.className= 'cardbox0';
                rightCard.deck = `right${index}`;
                rightCard.number = cards;

                rightCard.style.backgroundImage = `url(img/card/poker-${kindColor(cards)}${cardNum(cards)}.svg)`;

                deckTR.appendChild(rightCard);
            })
            rightCardDeck.appendChild(deckTR);
        })
    }
    
    let leftCardDeck = document.getElementById('lefttCardDeck');

    let freshLeftView = function(){ //左上牌區
        leftDeck.forEach((decks,index) => {
            const deckTL = document.createElement('div');
            deckTL.id = `left-deck-${index}`;
            deckTL.className = 'deck';
            deckTL.deck = 'left';
            decks.forEach((cards,cardIndex) => {
                const leftCard = document.createElement('div');

                leftCard.draggable = true;

                leftCard.id = `card${cardIndex}`;
                leftCard.className= 'cardbox0';
                leftCard.number = cards;
                leftCard.deck = `left${index}`;

                leftCard.style.backgroundImage = `url(img/card/poker-${kindColor(cards)}${cardNum(cards)}.svg)`;

                deckTL.appendChild(leftCard);
            })
            leftCardDeck.appendChild(deckTL);
        })
    }

   //最一開始的搜尋，設定draggable
    function beginSerch(){
        let serchCards = document.querySelectorAll('[draggable="true"]');
        serchCards.forEach((item) => {
            item.draggable = false
        })
        if(defaultCard.length !== 0){  //把右上牌都設為可拖動
            for(i=0; i<defaultCard.length; i++){
                serchCards[i].draggable = true;
            }
        }
        //全部整理成巢狀結構
        for(let i=0; i<underDeck.length; i++){  //從原始陣列抓，用複製的也可以
            let outerDeck = document.querySelector('#under-deck-'+i)
            for(let p=underDeck[i].length-1; p>=1; p--){
                let numC = underDeck[i].slice(p,p+1)
                let numM = underDeck[i].slice(p-1,p)
                let cardC = document.querySelector('#card'+numC)
                let cardM = document.querySelector('#card'+numM)
                outerDeck.removeChild(cardC)
                cardM.appendChild(cardC)
            }
        }
        //從複製的陣列抓每組最後一個數設可拖動
        let lastCard = []  //存起來最後一張牌(也有可能有些牌堆沒牌)
        for(let i = 0;i<copyUnderDeck.length;i++){  //從複製的陣列抓每組最後一個數設可拖動
            let c = copyUnderDeck[i].slice(-1)
            let C = document.querySelector('#card'+c);
            C.draggable = true
            lastCard.push(C)
        }
        //判斷最後一張元素的父層是否可拖動
        let last2Card = []
        parentDraggable(lastCard, last2Card)
        // //判斷最後第二張元素的父層是否可拖動
        // //判斷最後第三張元素父層是否可拖動
        // //我覺得連五張都對順序的機率太低了，但為了完整性還是寫一下
        if (last2Card.length > 0){
            let last3Card = []
            parentDraggable(last2Card, last3Card)
            if(last3Card.length > 0){
                let last4Card = []
                parentDraggable(last3Card, last4Card)
                if(last4Card.length > 0){
                    let last5Card = []
                    parentDraggable(last4Card, last5Card)
                }
            }
        }
    }

    function parentDraggable(child,dad){  //用於判斷上層可否拖動
        if(child.length>0){
            for(let i=0; i<child.length; i++){
                if(child[i].parentNode.deck == 'under')return //判斷上層是不是到deck了
                if(pairCard(child[i].number, child[i].parentNode.number)){
                    child[i].parentNode.draggable = true
                    dad.push(child[i].parentNode)
                }
            }
        }
    }

    function serchDraggable(){
        //要先把亂牌區的牌都先設不能拖曳
        for(let i=0;i<copyUnderDeck.length;i++){
            if(copyUnderDeck[i].length > 0){
                for(let r=0;r<copyUnderDeck[i].length;r++){
                    let deckss = copyUnderDeck[i]
                    let Fcard = document.querySelector('#card'+deckss[r])
                    Fcard.draggable = false
                }
            }
        }
        let lastCard = [] //先找各牌堆最後一張牌
        for(let i=0; i<copyUnderDeck.length; i++){
            if(copyUnderDeck[i].length>0){  //牌堆有牌才做設定
                let c = copyUnderDeck[i].slice(-1)
                let C = document.querySelector('#card'+c);
                C.draggable = true
                lastCard.push(C)
            }
        }
        let bouns = 0  //設定左上剩多少空位
        for(let i=0;i<copyLeftDeck.length;i++){
            if(copyLeftDeck[i].length < 1){
                bouns++;
            }
        }
        if(lastCard.length > 0 && bouns>0){
            let last2Card = []
            parentDraggable(lastCard, last2Card)
            if (last2Card.length > 0 && bouns>1){
                let last3Card = []
                parentDraggable(last2Card, last3Card)
                if(last3Card.length > 0 && bouns>2){
                    let last4Card = []
                    parentDraggable(last3Card, last4Card)
                    if(last4Card.length > 0 && bouns>3){
                        let last5Card = []
                        parentDraggable(last4Card, last5Card)
                    }
                }
            }
        } 
    }
    function childrenAttr(child){
        if(child.children){  //把其子孫都更改牌區屬性
            let child1 = child.children
            child1.deck = 'under'+child.deck.slice(-1)
            if(child1.children){
                let child2 = child1.children
                child2.deck = 'under'+child.deck.slice(-1)
                if(child2.children){
                    let child3 = child2.children
                    child3.deck = 'under'+child.deck.slice(-1)
                    if(child3.children){
                        let child4 = child3.children
                        child4.deck = 'under'+child.deck.slice(-1)
                    }
                }
            }
        }
    }
    
    let sourceContainerId = '';
    let sourceId = '';
    let all = document.querySelector('#mainPage');
    //把拖曳事件註冊在整個外層
    all.addEventListener('dragstart', dragSStart);
    all.addEventListener("dragend", dragEEnd);
    all.addEventListener('drop', dropped);
    all.addEventListener('dragenter', cancelDDefault);
    all.addEventListener('dragleave', cancelDDefault);
    all.addEventListener('dragover', cancelDDefault);  //沒設這個就不能順利drop
    //註冊底下功能按鈕事件
    let pauseBtn = document.querySelector('#pause')
    pauseBtn.addEventListener('click', pause);
    let redoBtn = document.querySelector('#redo');
    redoBtn.addEventListener('click', redo);
    let restartBtn = document.querySelector('#restart');
    restartBtn.addEventListener('click', reStart);
    let newgameBtn = document.querySelector('#newgame');
    newgameBtn.addEventListener('click', newGame);
    //註冊overPage按鈕事件
    const overPage = document.querySelector('#gameOver')
    const overReStartBtn = document.querySelector('#restart2')
    overReStartBtn.addEventListener('click', reStart)
    const overNewBtn = document.querySelector('#newgame2')
    overNewBtn.addEventListener('click', newGame) 
    const overCloseBtn = document.querySelector('#overClose')
    overCloseBtn.addEventListener('click', closeWindow)
    //註冊winPage按鈕事件
    const winPage = document.querySelector('#winGame')
    const winReStartBtn = document.querySelector('#restart3')
    winReStartBtn.addEventListener('click', reStart)
    const winNewBtn = document.querySelector('#newgame3')
    winNewBtn.addEventListener('click', newGame)
    const winCloseBtn = document.querySelector('#winClose')
    winCloseBtn.addEventListener('click',closeWindow)

    const loadPage = document.querySelector('#loginPage')
    const beginPage = document.querySelector('#beginPage')
    const beginBtn = document.querySelector('#start')
    beginBtn.addEventListener('click', beginGame)

    function cancelDDefault (e) {
		  e.preventDefault()
		  e.stopPropagation()
		  return false
	}

    function dragSStart (e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.id);
        sourceContainerId = e.target.parentElement.id;
        sourceId = e.target.id;           
    }
    function dragEEnd(e){
        e.target.classList.remove('dragging');                  
    }
    
    function dropped(e){    
      if (e.target.id.indexOf('deck')>-1 || e.target.id.indexOf('card')>-1) {//判斷是不是指定的容器
            cancelDDefault(e);
            let id = e.dataTransfer.getData('text/plain');
            if (id==e.target.id) {return;}  //判斷是不是同一張牌
            if (sourceContainerId==e.target.id){return;}  //判斷是不是同一個容器

            if (e.target.deck == 'left'){  //放到左上牌區判斷
                let moveCard = document.querySelector('#' + id)
                if(moveCard.children.length < 1 ) {  //判斷裡面有沒有包東西
                    if(moveCard.deck.indexOf('under')>-1){
                        copyLeftDeck[e.target.id.slice(-1)].push(moveCard.number);
                        copyUnderDeck[moveCard.deck.slice(-1)].pop();   //更新陣列資料
                    }
                    if(moveCard.deck.indexOf('right')>-1){
                        copyLeftDeck[e.target.id.slice(-1)].push(moveCard.number);
                        copyRightDeck[moveCard.deck.slice(-1)].pop();   //更新陣列資料
                    }
                    if(moveCard.deck.indexOf('left')>-1){
                        copyLeftDeck[e.target.id.slice(-1)].push(moveCard.number);
                        copyLeftDeck[moveCard.deck.slice(-1)].pop();    //更新陣列資料
                    }

                    moveCard.deck = 'left'+e.target.id.slice(-1);  //更改牌區屬性
                    e.target.appendChild(moveCard); 
                    timeMachine.push({ //時光機紀錄
                    from:{
                        card: sourceId,
                        deck: sourceContainerId
                    },
                    to:{
                        deck:e.target.id
                    }
                    })
                    serchDraggable();
                }
            }
            if (e.target.deck.indexOf('right')>-1){  //放到右上判斷
                let moveCard = document.querySelector('#' + id)
                if(moveCard.children.length >=1){return}  //禁止牌裡面有牌
                // if(e.target.deck == 'right'){                 //先不做還沒有Ａ放在裡面的情況
                //     let correct = moveCard.number
                //     if (correct == 1 || correct == 14 || correct == 27 || correct == 40){
                let mom = document.querySelector('#'+e.target.id)
                //if(moveCard.number)
                if(mom.number == moveCard.number - 1){
                    if(moveCard.deck.indexOf('under')>-1){
                        copyRightDeck[e.target.deck.slice(-1)].push(moveCard.number);
                        copyUnderDeck[moveCard.deck.slice(-1)].pop();   //更新陣列資料
                    }   //不會有其他同right牌組的牌跑到另一組
                    if(moveCard.deck.indexOf('left')>-1){
                        copyRightDeck[e.target.deck.slice(-1)].push(moveCard.number);
                        copyLeftDeck[moveCard.deck.slice(-1)].pop();    //更新陣列資料
                    }
                    moveCard.deck = 'right'+e.target.deck.slice(-1);  //更改牌區屬性
                    e.target.appendChild(moveCard); 
                    timeMachine.push({ //時光機紀錄
                    from:{
                        card: sourceId,
                        deck: sourceContainerId
                    },
                    to:{
                        deck:e.target.id
                    }
                    })
                    serchDraggable();
                }
            }
            if (e.target.deck.indexOf('under')>-1){   //放到亂牌區判斷
                let moveCard = document.querySelector('#' + id)
                let mom = document.querySelector('#'+e.target.id)
                if(mom.deck == 'under'){//如果是放到空牌堆
                    if(moveCard.deck.indexOf('under')>-1){  //更新陣列資料  如果卡片原本是亂牌區
                        let ar = copyUnderDeck[moveCard.deck.slice(-1)] //找移動牌原本所屬的陣列
                        let index = ar.indexOf(moveCard.number)    //找他的在陣列的位置
                        let ns = ar.splice(index,ar.length-index)  //包括他之後的數字都切掉
                        let ar2 = copyUnderDeck[mom.id.slice(-1)]  //目標容器原本的陣列
                        for(let i=0;i<ns.length;i++){
                            ar2.push(ns[i])
                        }
                    }else if(moveCard.deck.indexOf('left')>-1){   //如果卡片原本在左上區
                        let ar = copyLeftDeck[moveCard.deck.slice(-1)]  //原本是左上哪區陣列
                        let ar2 = copyUnderDeck[mom.id.slice(-1)]   //目標陣列
                        ar2.push(moveCard.number)  //因為從左上移一定只有一張
                        ar.pop()   //所以不指定直接刪除就好
                    }else if(moveCard.deck.indexOf('right')>-1){ //如果卡片原本在右上
                        let ar = copyRightDeck[moveCard.deck.slice(-1)]
                        let ar2 = copyUnderDeck[mom.id.slice(-1)]
                        ar2.push(moveCard.number)  //從右上移也一定只有一張
                        ar.pop()
                    }
                    moveCard.deck = 'under'+mom.id.slice(-1)  //更改牌區屬性
                    childrenAttr(moveCard) //子孫牌都改屬性
                    mom.appendChild(moveCard);
                    timeMachine.push({
                        from:{
                            card: sourceId,
                            deck: sourceContainerId
                        },
                        to:{
                            deck:e.target.id
                        }
                    })
                    serchDraggable();
                }else if(pairCard(moveCard.number, mom.number)){ //放到牌上有對花色順序
                    if(mom.childElementCount>0)return //避免放到除了最後一張的牌
                    if(moveCard.deck.indexOf('under')>-1){  //更新陣列資料  如果卡片原本是亂牌區
                        let ar = copyUnderDeck[moveCard.deck.slice(-1)] //找移動牌原本所屬的陣列
                        let index = ar.indexOf(moveCard.number)    //找他在陣列的位置
                        let ns = ar.splice(index, ar.length-index)  //包括他之後的數字都切掉
                        let ar2 = copyUnderDeck[mom.deck.slice(-1)]  //目標容器原本的陣列
                        for(let i=0;i<ns.length;i++){
                            ar2.push(ns[i])
                        }
                    }else if(moveCard.deck.indexOf('left')>-1){   //如果卡片原本在左上區
                        let ar = copyLeftDeck[moveCard.deck.slice(-1)]  //原本是左上哪區陣列
                        let ar2 = copyUnderDeck[mom.deck.slice(-1)]   //目標陣列
                        ar2.push(moveCard.number)  //因為從左上移一定只有一張
                        ar.pop()   //所以不指定直接刪除就好
                    }else if(moveCard.deck.indexOf('right')>-1){ //如果卡片原本在右上
                        let ar = copyRightDeck[moveCard.deck.slice(-1)]
                        let ar2 = copyUnderDeck[mom.deck.slice(-1)]
                        ar2.push(moveCard.number)  //從右上移也一定只有一張
                        ar.pop()
                    }
                    moveCard.deck = 'under'+mom.deck.slice(-1)  //更改牌區屬性
                    childrenAttr(moveCard) //更改子孫屬性
                    mom.appendChild(moveCard);
                    timeMachine.push({
                        from:{
                            card: sourceId,
                            deck: sourceContainerId
                        },
                        to:{
                            deck:e.target.id
                        }
                    })
                    serchDraggable();
                }
            } 
        }
        isFinish();
    }

    function redo(){
        if (timeMachine.length===0) return;
        let lastMove = timeMachine.pop();

        let beginDeck = document.querySelector('#' + lastMove.from.deck);
        let cardMoved = document.querySelector('#' + lastMove.from.card);
        let finishDeck = document.querySelector('#' + lastMove.to.deck);
        //復原屬性
        if(beginDeck.deck.indexOf('under')>-1){ //如果是從亂牌堆來的
            if(beginDeck.deck == 'under'){ //假設是從空牌堆來
                let attr = 'under' + beginDeck.id.slice(-1)
                cardMoved.deck = attr  //復原原本牌的屬性
                childrenAttr(cardMoved)  //有子孫的話也改回來
            }else{//其他就表示從有牌的牌堆來
                let attr = 'under' + beginDeck.deck.slice(-1)
                cardMoved.deck = attr
                childrenAttr(cardMoved)  //有子孫的話也改回來
            }
            //復原陣列
            let ar = copyUnderDeck[cardMoved.deck.slice(-1)] //原本所在陣列
            if(finishDeck.deck == 'left'){ //左上復原(一定是放在空牌堆上，只會移一張)
                let ar2 = copyLeftDeck[finishDeck.id.slice(-1)]
                ar2.pop()
                ar.push(cardMoved.number)
            }else if(finishDeck.deck.indexOf('right')>-1){ //右上復原(只會移一張，因預設的關係所以一定會放在牌上，先不做無ace在右上預設的情況)
                let ar2 = copyRightDeck[finishDeck.deck.slice(-1)]
                ar2.pop()
                ar.push(cardMoved.number)
            }else if(finishDeck.deck.indexOf('under')>-1){ //下方復原（會移多張，有可能在空牌）
                if(finishDeck.deck == 'under'){ //空牌堆的話
                    let ar2 = copyUnderDeck[finishDeck.id.slice(-1)] //找到從哪裏復原的陣列
                    let index = ar2.indexOf(cardMoved.number)    //找他在陣列的位置
                    let ns = ar2.splice(index, ar2.length-index)  //包括他之後的數字都切掉
                    for(let i=0;i<ns.length;i++){  //一個一個放
                        ar.push(ns[i])
                    }
                }else{ //有牌的話
                    let ar2 = copyUnderDeck[finishDeck.deck.slice(-1)]
                    let index = ar2.indexOf(cardMoved.number)
                    let ns = ar2.splice(index, ar2.length-index)
                    for(let i=0; i<ns.length;i++){
                        ar.push(ns[i])
                    }
                }
            }
        }else if(beginDeck.deck.indexOf('left')>-1){ //如果原來從左上來的(一定在空牌堆上，只有一張)
            let attr = 'left' + beginDeck.id.slice(-1)
            cardMoved.deck = attr
            let ar = copyLeftDeck[cardMoved.deck.slice(-1)]
            if(finishDeck.deck == 'left'){
                let ar2 = copyLeftDeck[finishDeck.id.slice(-1)]
                ar2.pop()
                ar.push(cardMoved.number)
            }else if(finishDeck.deck.indexOf('right')>-1){
                let ar2 = copyRightDeck[finishDeck.deck.slice(-1)] //右上復原(未寫如果是空牌堆的情況)
                ar2.pop()
                ar.push(cardMoved.number)
            }else if(finishDeck.deck.indexOf('under')>-1){
                if(finishDeck.deck == 'under'){
                    let ar2 = copyUnderDeck[finishDeck.id.slice(-1)]
                    ar2.pop()
                    ar.push(cardMoved.number)
                }else{
                    let ar2 = copyUnderDeck[finishDeck.deck.slice(-1)]
                    ar2.pop()
                    ar.push(cardMoved.number)
                }
            }
        }else if(beginDeck.deck.indexOf('right')>-1){ //如果原來從右上來(只會移一張)(未寫如果是空牌堆的情況)
            let attr = "right" + beginDeck.deck.slice(-1)
            cardMoved.deck = attr
            let ar = copyRightDeck[cardMoved.deck.slice(-1)]
            if(finishDeck.deck == 'left'){
                let ar2 = copyLeftDeck[finishDeck.id.slice(-1)]
                ar2.pop()
                ar.push(cardMoved.number)
                //預設不會有其他右上牌移到右上的情況
            }else if(finishDeck.deck.indexOf('under')>-1){
                if(finishDeck.deck == 'under'){
                    let ar2 = copyUnderDeck[finishDeck.id.slice(-1)]
                    ar2.pop()
                    ar.push(cardMoved.number)
                }else{
                    let ar2 = copyUnderDeck[finishDeck.id.slice(-1)]
                    ar2.pop()
                    ar.push(cardMoved.number)
                }
            }
        }

        finishDeck.removeChild(cardMoved);
        beginDeck.appendChild(cardMoved);
        console.log(copyUnderDeck)
        console.log(copyLeftDeck)
        console.log(copyRightDeck)
        serchDraggable();
    }

    function reStart(){
        time = 0
        clock.innerHTML = '00:00'
        if(isPause){
            page.classList.remove('show')
            pBtn.innerHTML = '暫停'
            isPause = !isPause
            counting()
            clock.classList.remove('pauseTime')
        }
        overPage.classList.remove('show')
        winPage.classList.remove('show')
        if(timeMachine.length < 1)return
        leftCardDeck.innerHTML = '';
        rightCardDeck.innerHTML = '';
        medsection.innerHTML = '';
        copyLeftDeck = [[], [], [], []];
        copyRightDeck = [[1,2], [14,15], [27,28], [40,41]];
        for(let i=0;i<underDeck.length;i++){
            copyUnderDeck[i] = underDeck[i].slice(0) 
        }
        timeMachine = [];
        freshUnderView();
        freshLeftView();
        freshRightView();
        beginSerch();
    }

    let page = document.querySelector('#gamePause')
    let pBtn = document.querySelector('#pause')
    function pause(e){
        if(isPause){
            page.classList.remove('show')
            pBtn.innerHTML = '暫停'
            counting()
            clock.classList.remove('pauseTime')
        }else{
            page.classList.add('show')
            pBtn.innerHTML = '繼續遊戲'
            stopCounting()
            clock.classList.add('pauseTime')
        }
        isPause = !isPause
    }

    function newGame(){
        stopCounting()
        time = 0
        clock.innerHTML = '00:00'
        if(isPause){
            page.classList.remove('show')
            pBtn.innerHTML = '暫停'
            isPause = !isPause
            clock.classList.remove('pauseTime')
        }
        winPage.classList.remove('show')
        overPage.classList.remove('show')
        leftCardDeck.innerHTML = '';
        rightCardDeck.innerHTML = '';
        medsection.innerHTML = '';
        timeMachine = [];
        copyLeftDeck = [[], [], [], []];
        copyRightDeck = [[1,2], [14,15], [27,28], [40,41]];
        underDeck = [[], [], [], [], [], [], [], []];
        newCards()
        for(let i=0;i<underDeck.length;i++){
            copyUnderDeck[i] = underDeck[i].slice(0) 
        }
        freshUnderView();
        freshLeftView();
        freshRightView();
        beginSerch();
        loadPage.style.display = 'block'
        setTimeout(function(){playAlredy();counting();}, 3000)
    }

    function isFinish(){
        console.log(copyUnderDeck)
        console.log(copyLeftDeck)
        console.log(copyRightDeck)
        if(copyRightDeck[0].length !==13)return;
        if(copyRightDeck[1].length !==13)return;
        if(copyRightDeck[2].length !==13)return;
        if(copyRightDeck[3].length !==13)return;
        winPage.classList.add('show');
        pause()
    }
    function closeWindow(){
        window.open('', '_self', ''); 
        window.close();
    }
    
    function beginGame(){
        beginPage.style.display = 'none'
        all.style.display = 'block'
        loadPage.style.display = 'block'
        setTimeout(function(){playAlredy();counting()}, 3000)
    }

    function playAlredy(){
        loadPage.style.display = 'none'
    }

    function Over(){
        if(time >= 900){
            overPage.classList.add('show')
            pause()
        }
    }

    freshLeftView();
    freshRightView();
    freshUnderView();
    beginSerch();