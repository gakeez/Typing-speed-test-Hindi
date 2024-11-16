const typingText = document.querySelector(".typing-text p"), // 显示需要输入的文本段落
inpField = document.querySelector(".wrapper .input-field"), // 用户输入字段
tryAgainBtn = document.querySelector(".content button"), // 重试按钮
timeTag = document.querySelector(".time span b"), // 显示剩余时间
mistakeTag = document.querySelector(".mistake span"), // 显示错误次数
wpmTag = document.querySelector(".wpm span"), // 显示每分钟打字数 (WPM)
cpmTag = document.querySelector(".cpm span"); // 显示每分钟字符数 (CPM)

// 初始化变量
let timer,
maxTime = 60, // 最大时间 60 秒
timeLeft = maxTime, // 剩余时间
charIndex = mistakes = isTyping = 0; // 当前字符索引 错误计数 是否在输入标志

// 加载一个随机段落
function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length); // 随机选择一个段落的索引
    typingText.innerHTML = ""; // 清空 typingText 的内容
    paragraphs[ranIndex].split("").forEach(char => { // 将段落中的每个字符包裹在 span 中
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active"); // 将第一个字符标记为 active
    document.addEventListener("keydown", () => inpField.focus()); // 在按下任意键时，输入框获得焦点
    typingText.addEventListener("click", () => inpField.focus()); // 在点击段落时，输入框获得焦点
}

// 初始化打字功能
function initTyping() {
    let characters = typingText.querySelectorAll("span"); // 获取段落中的所有字符
    let typedChar = inpField.value.split("")[charIndex]; // 获取用户输入的当前字符
    if(charIndex < characters.length - 1 && timeLeft > 0) { // 确保未超出字符数且时间未结束
        if(!isTyping) { // 如果是第一次输入，开始计时
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) { // 如果用户删除字符
            if(charIndex > 0) { // 如果字符索引大于 0，减少索引
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) { // 如果删除的字符是错误的，减少错误计数
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect"); // 移除字符的正确或错误类
            }
        } else {
            if(characters[charIndex].innerText == typedChar) { // 如果输入字符正确
                characters[charIndex].classList.add("correct");
            } else { // 如果输入字符错误
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active")); // 移除所有字符的 active 类
        characters[charIndex].classList.add("active"); // 为当前字符添加 active 类

        // 计算 WPM (每分钟打字数)
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm; // 处理异常情况
        
        // 更新统计数据
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else { 
        clearInterval(timer); // 停止计时
        inpField.value = ""; // 清空输入框
    }   
}

// 如果时间还有剩余
function initTimer() {
    if(timeLeft > 0) { // 如果时间还有剩余
        timeLeft--; // 减少时间
        timeTag.innerText = timeLeft; // 更新显示的剩余时间
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60); // 更新 WPM
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer); // 时间结束，停止计时
    }
}

// 重置游戏
function resetGame() {
    loadParagraph(); // 重置游戏
    clearInterval(timer); // 清除计时器
    timeLeft = maxTime; // 重置时间
    charIndex = mistakes = isTyping = 0; // 重置索引和计数
    inpField.value = ""; // 清空输入框
    // 重置统计显示
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}

// 初始加载段落
loadParagraph();
// 监听输入事件
inpField.addEventListener("input", initTyping);
// 监听重试按钮点击事件
tryAgainBtn.addEventListener("click", resetGame);