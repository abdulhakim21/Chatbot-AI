const sendChatbtn = document.querySelector('.chat-input span')
const chatInput = document.querySelector('.chat-input textarea')
const chatBox = document.querySelector('.chatbox')
const chatbotToggle = document.querySelector('.chatbot-toggler')
const chatbotCloseBtn = document.querySelector('.close-btn')

let useMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (massage, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = massage
    return chatLi;
}

const generateResponse = (incommingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incommingChatLi.querySelector('p')

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                    role: "user",
                    content: useMessage
                },
                {
                    role: "system",
                    content: "You are a helpful assistant."
                }
            ]
        })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = 'Wfini kim ochirde :(';
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

const hendleChat = () => {
    useMessage = chatInput.value.trim();
    console.log(useMessage);
    if (!useMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`
    
    chatBox.appendChild(createChatLi(useMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);
    
    setTimeout(() => {
        const incommingChatLi = createChatLi('Think. . .', "incoming")
        chatBox.appendChild(incommingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incommingChatLi);
    }, 600)
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        hendleChat()
    }
})

sendChatbtn.addEventListener('click', hendleChat)
chatbotCloseBtn.addEventListener('click', () => document.body.classList.remove("show-chatbox"));
chatbotToggle.addEventListener('click', () => document.body.classList.toggle("show-chatbox"));
