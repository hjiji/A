const main = document.querySelector("#main");
const qna = document.querySelector("#qna");
const result = document.querySelector("#result");

const endPoint = 8;
const select = [0, 0, 0];

function calResult(){
    var result = select.indexOf(Math.max(...select));
    return result;
}

function setResult(){
    let point = calResult();
    const resultName = document.querySelector('.resultname');
    resultName.innerHTML = infoList[point].name;
    fetch('data/data.json')
        .then((data)=> data.json())
        .then((obj) => {
            obj[point] += 1;
            fileWrite(point);
        })

    var resultImg = document.createElement('img');
    const imgDiv = document.querySelector('#resultImg');
    var imgURL = 'img/image-' + point + '.png';
    resultImg.src = imgURL;
    resultImg.alt = point;
    resultImg.classList.add('img-fluid');
    imgDiv.appendChild(resultImg);

    const resultDesc = document.querySelector('.resultDesc');
    resultDesc.innerHTML = infoList[point].desc;
}

function fileWrite(content) {
    $.ajax({
        type: "GET",
        url: "https://script.google.com/macros/s/AKfycbydO_nNnNopT7nytF_2tB2mNffB4mCNRbDN0fED5X5sQpG_dCOyWKeBpXxD7GDj0_wm/exec",
        data: {
            "결과": content,
            "": "",
            "": ""
        },
        success: function(response) {
            console.log(content + "가 스프레드 시트에 입력 되었습니다.");
        }
    })

}

function saveFile(contents) {
    const blob = new Blob([contents], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'new1.txt';
    a.click();
}

function goResult(){
    qna.style.WebkitAnimation = "fadeOut 1s";
    qna.style.animation = "fadeOut 1s";
    setTimeout(() => {
        result.style.WebkitAnimation = "fadeIn 1s";
        result.style.animation = "fadeIn 1s";
        setTimeout(() => {
            qna.style.display = "none";
            result.style.display = "block"
    }, 450)})
    setResult();
}

function addAnswer(answerText, qIdx, idx){
    var a = document.querySelector('.answerBox');
    var answer = document.createElement('button');
    answer.classList.add('answerList');
    answer.classList.add('my-3');
    answer.classList.add('py-3');
    answer.classList.add('mx-auto');
    answer.classList.add('fadeIn');

    a.appendChild(answer);
    answer.innerHTML = answerText;

    answer.addEventListener("click", function(){
        var children = document.querySelectorAll('.answerList');
        for(let i = 0; i < children.length; i++){
            children[i].disabled = true;
            children[i].style.WebkitAnimation = "fadeOut 0.5s";
            children[i].style.animation = "fadeOut 0,5s";
        }
        setTimeout(() => {
            var target = qnaList[qIdx].a[idx];
            select[target.type[0]] += 1;
            for(let i = 0; i < children.length; i++){
                children[i].style.display = "none";
            }
            goNext(++qIdx);
        },450)
    }, false);
}

function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsText(file);
    });
  }
  
  function handleFileSelect(event) {
  const fileInput = document.querySelector('#fileInput');
  fileInput.addEventListener('change', handleFileSelect);
  }

function goNext(qIdx){
    if(qIdx === endPoint){
        goResult();
        return;
    }

    var q = document.querySelector('.qBox');
    q.innerHTML = qnaList[qIdx].q;
    for(let i in qnaList[qIdx].a){
        addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
    }
    var status = document.querySelector('.statusBar');
    status.style.width = (100/endPoint) * (qIdx+1) + '%';
    
    if (qnaList[qIdx].image) {
        var img = document.createElement('img');
        img.src = qnaList[qIdx].image;
        img.classList.add('qBox-image');
        q.appendChild(img);
    }
}

function begin(){
    main.style.WebkitAnimation = "fadeOut 1s";
    main.style.animation = "fadeOut 1s";
    setTimeout(() => {
        qna.style.WebkitAnimation = "fadeIn 1s";
        qna.style.animation = "fadeIn 1s";
        setTimeout(() => {
            main.style.display = "none";
            qna.style.display = "block";
    }, 450)
    let qIdx = 0;
    goNext(qIdx);
}, 450); 
}