<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>Mening AI Yordamchim — Sun'iy Intelekt</title>
    <style>
        body {
            background: #0d1117;
            color: #e6edf3;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            width: 90%;
            max-width: 900px;
            margin: auto;
            padding: 30px 0;
        }
        h1, h2, h3 {
            color: #58a6ff;
        }
        .banner {
            text-align: center;
            margin-bottom: 20px;
        }
        .banner img {
            max-width: 100%;
            border-radius: 8px;
        }

        /* COPY BOX */
        .code-box {
            position: relative;
            background: #161b22;
            padding: 18px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 1px solid #30363d;
        }
        .copy-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 6px 12px;
            background: #238636;
            color: white;
            font-size: 14px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
        }
        .copy-btn:hover {
            background: #2ea043;
        }
        pre {
            margin-top: 15px;
            white-space: pre-wrap;
        }
        a {
            color: #79c0ff;
        }
    </style>
</head>

<body>

<div class="container">

    <div class="banner">
        <img src="https://raw.githubusercontent.com/ABULFAYZ-DEV/Suniiy-intelekt-uzb/main/banner.png" alt="Banner">
        <h1>Mening AI Yordamchim — Sun’iy Intelekt</h1>
    </div>

    <h2>🚀 Loyiha haqida</h2>
    <p>
        <b>Mening AI Yordamchim</b> — foydalanuvchining savollariga javob beradigan, matn generatsiyasi,
        yordamchi funksiyalar va bir qator aqlli algoritmlarni bajaradigan sun’iy intellekt tizimi.
    </p>

    <h2>✨ Xususiyatlar</h2>
    <ul>
        <li>Matn generatsiyasi</li>
        <li>Oddiy buyruqlarni bajarish</li>
        <li>Tezkor ishlash</li>
        <li>Modulli tuzilma</li>
        <li>Oson integratsiya</li>
    </ul>

    <h2>🛠️ O‘rnatish</h2>
    <div class="code-box">
        <button class="copy-btn" onclick="copyCode('code1')">Copy</button>
        <pre id="code1">git clone https://github.com/ABULFAYZ-DEV/Suniiy-intelekt-uzb
cd Suniiy-intelekt-uzb
pip install -r requirements.txt</pre>
    </div>

    <h2>▶️ Ishga tushirish</h2>
    <div class="code-box">
        <button class="copy-btn" onclick="copyCode('code2')">Copy</button>
        <pre id="code2">python src/main.py</pre>
    </div>

    <h2>📸 Banner</h2>
    <div class="code-box">
        <button class="copy-btn" onclick="copyCode('code3')">Copy</button>
        <pre id="code3">![Banner](banner.png)</pre>
    </div>

    <h2>🤝 Hissa qo‘shish</h2>
    <p>
        Takliflar va yangilanishlar uchun GitHub’dagi Issues bo‘limidan foydalanishingiz mumkin.
    </p>

    <h2>📧 Aloqa</h2>
    <p>
        GitHub profil: <a href="https://github.com/ABULFAYZ-DEV">ABULFAYZ-DEV</a><br>
        Loyiha sahifasi: <a href="https://github.com/ABULFAYZ-DEV/Suniiy-intelekt-uzb">Suniiy-intelekt-uzb</a>
    </p>

</div>

<script>
function copyCode(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text);
    alert("Kodni nusxalandi!");
}
</script>

</body>
</html>
