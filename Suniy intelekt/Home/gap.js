const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const messageCount = document.getElementById('message-count');

let messageCounter = 1;
let questionCounter = 0;
const maxQuestions = 30;
let todayQuestions = 0;
let totalQuestions = 0;
const questionTopics = {};

// So'z ma'nolari lug'ati
const wordMeanings = {
    'hotel': "Hotel - mehmonxona, joylashish uchun joy",
    'restaurant': "Restaurant - restoran, ovqatlanish joyi",
    'airport': "Airport - aeroport, havo transporti uchun joy",
    'teacher': "Teacher - o'qituvchi, ta'lim beruvchi",
    'student': "Student - talaba, o'qish bilan shug'ullanuvchi",
    'doctor': "Doctor - shifokor, tibbiyot xodimi",
    'injenyer': "Injenyer - injener, muhandis",
    'programmist': "Programmist - dasturchi, kompyuter dasturlash bo'yicha mutaxassis",
    'jurist': "Jurist - yurist, huquqshunos",
    'ekonomist': "Ekonomist - iqtisodchi, iqtisodiyot bo'yicha mutaxassis",
    'psixolog': "Psixolog - psixolog, ruhshunos",
    'fizik': "Fizik - fizik, jismoniy fanlar bo'yicha mutaxassis",
    'ximik': "Ximik - kimyogar, kimyo bo'yicha mutaxassis",
    'biolog': "Biolog - biolog, hayot fanlari bo'yicha mutaxassis",
    'astronom': "Astronom - astronom, koinot fanlari bo'yicha mutaxassis",
    'futbolchi': "Futbolchi - футболист, football player",
    'basketbolchi': "Basketbolchi - баскетболист, basketball player",
    'voleybolchi': "Voleybolchi - волейболист, volleyball player",
    'tennischi': "Tennischi - теннисист, tennis player",
    'boxchi': "Boxchi - боксёр, boxer",
    'atlet': "Atlet - атлет, athlete",
    'gimnast': "Gimnast - гимнаст, gymnast",
    'plovets': "Plovets - пловец, swimmer",
    'yuguruvchi': "Yuguruvchi - бегун, runner",
    'velosipedchi': "Velosipedchi - велосипедист, cyclist"
};

// Wikipedia API orqali ma'lumot olish
async function getWikipediaInfo(topic) {
    try {
        // O'zbek Wikipedia API
        const response = await fetch(`https://uz.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
        
        if (!response.ok) {
            throw new Error('Maqola topilmadi');
        }
        
        const data = await response.json();
        return data.extract || "Ushbu mavzuda ma'lumot topilmadi.";
    } catch (error) {
        try {
            // Agar O'zbek tilida topilmasa, Ingliz tilida qidirish
            const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
            
            if (!response.ok) {
                throw new Error('Maqola topilmadi');
            }
            
            const data = await response.json();
            return data.extract || "Ushbu mavzuda ma'lumot topilmadi.";
        } catch (error2) {
            return "Ushbu mavzu bo'yicha Wikipedia ma'lumotlari topilmadi.";
        }
    }
}

// Asosiy AI javob berish funksiyasi
async function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 1. So'z ma'nolari qidirish
    if (lowerMessage.includes(' nima') || lowerMessage.includes('nimani anglatadi') ||
        lowerMessage.includes('ma\'nosi') || lowerMessage.includes('qanday manoda') ||
        lowerMessage.includes('nima deyiladi')) {
        
        const word = lowerMessage.replace(/ nima\??/g, '')
                               .replace(/ma\'nosi/g, '')
                               .replace(/qanday manoda/g, '')
                               .replace(/nimani anglatadi/g, '')
                               .replace(/nima deyiladi/g, '')
                               .trim();
        
        if (word && wordMeanings[word]) {
            return wordMeanings[word];
        } else {
            // Agar lug'atda topilmasa, Wikipedia'dan qidirish
            const wikiInfo = await getWikipediaInfo(word);
            return `"${word}" haqida ma'lumot:\n${wikiInfo}`;
        }
    }

    // 2. Matematik misollar
    if (lowerMessage.includes('qo\'sh') || lowerMessage.includes('+') || 
        lowerMessage.includes('ayir') || lowerMessage.includes('-') ||
        lowerMessage.includes('ko\'paytir') || lowerMessage.includes('*') || lowerMessage.includes('kopaytir') ||
        lowerMessage.includes('bo\'l') || lowerMessage.includes('/') || lowerMessage.includes('bol') ||
        lowerMessage.includes('kvadrat') || lowerMessage.includes('²') || lowerMessage.includes('daraja') ||
        lowerMessage.includes('ildiz') || lowerMessage.includes('√') ||
        lowerMessage.includes('misol') || lowerMessage.includes('hisobla') || lowerMessage.includes('masala') ||
        lowerMessage.includes('yig\'indi') || lowerMessage.includes('farq') || lowerMessage.includes('kopaytma') || lowerMessage.includes('bolinma')) {
        return solveMathProblem(userMessage);
    }

    // 3. Wikipedia orqali umumiy mavzular qidirish
    if (lowerMessage.includes('haqida') || lowerMessage.includes('qanday') || 
        lowerMessage.includes('kim') || lowerMessage.includes('nima') ||
        lowerMessage.includes('tarixi') || lowerMessage.includes('qayerda') ||
        lowerMessage.includes('qachon') || lowerMessage.includes('necha')) {
        
        // Mavzuni ajratib olish
        const topic = userMessage.replace(/haqida|qanday|kim|nima|tarixi|qayerda|qachon|necha/g, '').trim();
        
        if (topic.length > 2) {
            const wikiInfo = await getWikipediaInfo(topic);
            return `${topic} haqida:\n${wikiInfo}`;
        }
    }

    // 4. Shaxsiy savollar
    if (lowerMessage.includes('isming nima') || lowerMessage.includes('sening isming') || 
        lowerMessage.includes('kim siz') || lowerMessage.includes('siz kimsiz')) {
        return "Mening ismim AI Assistant. Men sun'iy intellekt yordamchisiman. Sizga so'z ma'nolari, matematik misollar va turli savollarga javob berishda yordam bera olaman.";
    }

    if (lowerMessage.includes('qanday ishlaysiz') || lowerMessage.includes('nima qila olasiz')) {
        return "Men quyidagi vazifalarni bajarishim mumkin:\n• So'z ma'nolarini izlash\n• Matematik misollar yechish\n• Wikipedia orqali ma'lumot qidirish\n• Turli mavzular bo'yicha ma'lumot berish\n• Savollaringizga javob berish";
    }

    // 5. Salomlashish
    if (lowerMessage.includes('salom') || lowerMessage.includes('assalom') ||
        lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Assalomu alaykum! Men sizning sun'iy intellekt yordamchingizman. So'z ma'nolarini izlash, matematik misollar yechish, Wikipedia orqali ma'lumot qidirish va savollaringizga javob berishda yordam bera olaman.";
    }

    if (lowerMessage.includes('yaxshimisiz') || lowerMessage.includes('qalaysiz')) {
        return "Rahmat, yaxshiman! Siz qaleysiz? Menga savollaringizni bering, men sizga yordam berishdan xursand bo'laman.";
    }

    if (lowerMessage.includes('rahmat') || lowerMessage.includes('thanks') || lowerMessage.includes('tashakkur')) {
        return "Arzimaydi! Agar yana savollaringiz bo'lsa, murojaat qiling. Sizga yordam berishdan mamnunman.";
    }

    if (lowerMessage.includes('hayer') || lowerMessage.includes('xayr') || lowerMessage.includes('bye')) {
        return "Xayr, sog' bo'ling! Yana savollaringiz bo'lsa, murojaat qiling.";
    }

    // 6. Wikipedia orqali qidirish
    const wikiInfo = await getWikipediaInfo(userMessage);
    if (wikiInfo && !wikiInfo.includes("ma'lumotlari topilmadi")) {
        return `${userMessage} haqida:\n${wikiInfo}`;
    }

    // 7. Umumiy javob
    return "Kechirasiz, men bu savolga aniq javob bera olmayman. Iltimos, so'z ma'nosi so'rang, matematik misol bering yoki Wikipedia orqali qidiriladigan mavzu haqida so'rang. Masalan: 'hotel nima?' yoki '5 + 3 qo'shing' yoki 'Toshkent haqida'";
}

// Matematik misollar yechish
function solveMathProblem(problem) {
    const lowerProblem = problem.toLowerCase();
    
    // Qo'shish
    if (lowerProblem.includes('qo\'sh') || lowerProblem.includes('+') || lowerProblem.includes('yig\'indi')) {
        const numbers = problem.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const result = numbers.reduce((sum, num) => sum + parseInt(num), 0);
            return `${numbers.join(' + ')} = ${result}`;
        }
    }
    
    // Ayirish
    if (lowerProblem.includes('ayir') || lowerProblem.includes('-') || lowerProblem.includes('farq')) {
        const numbers = problem.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const result = numbers.reduce((diff, num, index) => 
                index === 0 ? parseInt(num) : diff - parseInt(num));
            return `${numbers.join(' - ')} = ${result}`;
        }
    }
    
    // Ko'paytirish
    if (lowerProblem.includes('ko\'paytir') || lowerProblem.includes('kopaytir') || lowerProblem.includes('*') || lowerProblem.includes('kopaytma')) {
        const numbers = problem.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const result = numbers.reduce((product, num) => product * parseInt(num), 1);
            return `${numbers.join(' × ')} = ${result}`;
        }
    }
    
    // Bo'lish
    if (lowerProblem.includes('bo\'l') || lowerProblem.includes('bol') || lowerProblem.includes('/') || lowerProblem.includes('bolinma')) {
        const numbers = problem.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const result = numbers.reduce((quotient, num, index) => 
                index === 0 ? parseInt(num) : quotient / parseInt(num));
            return `${numbers.join(' ÷ ')} = ${result.toFixed(2)}`;
        }
    }
    
    // Kvadrat
    if (lowerProblem.includes('kvadrat') || lowerProblem.includes('²') || lowerProblem.includes('daraja')) {
        const number = problem.match(/\d+/);
        if (number) {
            const num = parseInt(number[0]);
            return `${num}² = ${num * num}`;
        }
    }
    
    // Ildiz
    if (lowerProblem.includes('ildiz') || lowerProblem.includes('√') || lowerProblem.includes('kvadrat ildiz')) {
        const number = problem.match(/\d+/);
        if (number) {
            const num = parseInt(number[0]);
            return `√${num} = ${Math.sqrt(num).toFixed(2)}`;
        }
    }
    
    return "Misolni tushunmadim. Iltimos, aniqroq misol bering. Masalan: '5 + 3 qo'shing' yoki '16 ildizini toping'";
}

// DOM yuklanganda ishlaydigan funksiyalar
document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    updateReport();
    updateQuestionsCount();
    loadSectionStates();
    addMessageHoverAnimations();
});

// Qorong'i rejimni sozlash
darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Yon panel bo'limlarini yig'ish/ochish
document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const isActive = content.classList.contains('active');
        
        document.querySelectorAll('.collapsible-content').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.section-header').forEach(item => {
            item.classList.remove('active');
        });
        
        if (!isActive) {
            content.classList.add('active');
            this.classList.add('active');
        }
        
        saveSectionStates();
    });
});

// Tez savollar tugmalari
document.querySelectorAll('.question-btn').forEach(button => {
    button.addEventListener('click', function() {
        const question = this.getAttribute('data-question');
        userInput.value = question;
        sendMessage();
    });
});

// Hisobot va statistikalar
document.getElementById('generate-report').addEventListener('click', generateReport);
document.getElementById('reset-stats').addEventListener('click', resetStatistics);

// Xabar yuborish
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Xabar yuborish funksiyasi
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    addUserMessage(message);
    userInput.value = "";

    trackQuestionTopic(message.toLowerCase());

    if (questionCounter >= maxQuestions) {
        addAIMessage(`Kechirasiz, sizning ${maxQuestions} ta savollar limitingiz tugadi. Ertaga yana murojaat qiling!`);
        return;
    }

    questionCounter++;
    updateQuestionsCount();
    
    const loadingMessage = addLoadingMessage();
    
    try {
        const aiResponse = await getAIResponse(message);
        removeLoadingMessage(loadingMessage);
        addAIMessage(aiResponse);
        
        messageCounter++;
        messageCount.textContent = messageCounter;
    } catch (error) {
        removeLoadingMessage(loadingMessage);
        addAIMessage("Kechirasiz, ma'lumotlarni olishda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    }
}

// Foydalanuvchi xabarini qo'shish
function addUserMessage(message) {
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user-message');
    userMessageDiv.innerHTML = `<div class="message-content"><strong>Siz:</strong> ${message}</div>`;
    chatMessages.appendChild(userMessageDiv);
    animateMessageEntry(userMessageDiv);
    scrollToBottom();
}

// AI xabarini qo'shish
function addAIMessage(message) {
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.classList.add('message', 'ai-message');
    aiMessageDiv.innerHTML = `<div class="message-content"><strong>AI:</strong> ${message}</div>`;
    chatMessages.appendChild(aiMessageDiv);
    animateMessageEntry(aiMessageDiv);
    scrollToBottom();
}

// Yuklanayotgan xabar
function addLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai-message');
    loadingDiv.id = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="message-content">
            <strong>AI:</strong> Ma'lumotlar qidirilmoqda...
            <div class="loading"></div>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    scrollToBottom();
    return loadingDiv;
}

// Yuklanayotgan xabarni olib tashlash
function removeLoadingMessage(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}

// Savol mavzularini kuzatish
function trackQuestionTopic(question) {
    let topic = "Boshqa";
    
    if (question.includes(' nima') || question.includes('ma\'nosi')) topic = "So'z ma'nolari";
    else if (question.includes('misol') || question.includes('masala') || question.includes('hisobla')) topic = "Matematika";
    else if (question.includes('salom') || question.includes('assalom') || question.includes('rahmat')) topic = "Salomlashish";
    else if (question.includes('fizika')) topic = "Fizika";
    else if (question.includes('kimyo')) topic = "Kimyo";
    else if (question.includes('biologiya')) topic = "Biologiya";
    else if (question.includes('astronomiya')) topic = "Astronomiya";
    else if (question.includes('steam')) topic = "Steam";
    else if (question.includes('dasturlash') || question.includes('dastur')) topic = "Dasturlash";
    else if (question.includes('python')) topic = "Python";
    else if (question.includes('internet')) topic = "Internet";
    else if (question.includes('matematika')) topic = "Matematika";
    else if (question.includes('tarix')) topic = "Tarix";
    else if (question.includes('haqida') || question.includes('qanday') || question.includes('kim')) topic = "Wikipedia";
    
    questionTopics[topic] = (questionTopics[topic] || 0) + 1;
    todayQuestions++;
    totalQuestions++;
    
    updateReport();
}

// Savollar sonini yangilash
function updateQuestionsCount() {
    const questionsCount = document.getElementById('questions-count');
    questionsCount.textContent = `${questionCounter}/${maxQuestions}`;
    
    if (questionCounter >= maxQuestions - 5) {
        questionsCount.style.color = '#ff6b6b';
    } else if (questionCounter >= maxQuestions - 10) {
        questionsCount.style.color = '#ffa726';
    } else {
        questionsCount.style.color = '#4CAF50';
    }
}

// Hisobotni yangilash
function updateReport() {
    document.getElementById('today-questions').textContent = todayQuestions;
    document.getElementById('total-questions').textContent = totalQuestions;
    
    const topTopics = Object.entries(questionTopics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([topic, count]) => `${topic} (${count})`)
        .join(', ');
    
    document.getElementById('top-topics').textContent = topTopics || '-';
}

// Hisobot yaratish
function generateReport() {
    const reportMessage = `📊 HISOBOT:
    
Bugun berilgan savollar: ${todayQuestions}
Jami savollar: ${totalQuestions}
Eng ko'p so'ralgan mavzular: ${document.getElementById('top-topics').textContent}

Savollar qolgan: ${maxQuestions - questionCounter}`;

    addAIMessage(reportMessage);
}

// Statistikani tozalash
function resetStatistics() {
    if (confirm("Statistikani tozalashni xohlaysizmi?")) {
        todayQuestions = 0;
        totalQuestions = 0;
        questionCounter = 0;
        Object.keys(questionTopics).forEach(key => delete questionTopics[key]);
        updateReport();
        updateQuestionsCount();
        addAIMessage("Statistika tozalandi! Yangi hisob boshlandi.");
    }
}

// Bo'lim holatlarini saqlash
function saveSectionStates() {
    const states = {};
    document.querySelectorAll('.collapsible-content').forEach(section => {
        states[section.id] = section.classList.contains('active');
    });
    localStorage.setItem('sectionStates', JSON.stringify(states));
}

// Bo'lim holatlarini yuklash
function loadSectionStates() {
    const savedStates = localStorage.getItem('sectionStates');
    if (savedStates) {
        const states = JSON.parse(savedStates);
        Object.keys(states).forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const header = document.querySelector(`[data-target="${sectionId}"]`);
            if (states[sectionId] && section && header) {
                section.classList.add('active');
                header.classList.add('active');
            }
        });
    }
}

// Animatsiya funksiyalari
function animateMessageEntry(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.5s ease';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

function addMessageHoverAnimations() {
    document.querySelectorAll('.message').forEach(message => {
        message.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            this.style.transition = 'all 0.3s ease';
        });
        
        message.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Input va tugmalar uchun animatsiyalar
userInput.addEventListener('focus', function() {
    this.style.transform = 'scale(1.02)';
    this.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.3)';
    this.style.transition = 'all 0.3s ease';
});

userInput.addEventListener('blur', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = 'none';
});

sendBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1) rotate(5deg)';
    this.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
    this.style.transition = 'all 0.3s ease';
});

sendBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
    this.style.boxShadow = 'none';
});

document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    header.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

document.querySelectorAll('.question-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
        this.style.boxShadow = '0 3px 8px rgba(102, 126, 234, 0.3)';
        this.style.transition = 'all 0.3s ease';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
        this.style.boxShadow = 'none';
    });
});

// Chat oynasini pastga aylantirish
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}