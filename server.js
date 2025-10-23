const path = require('path');
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

// Serve mobile SPA at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function buildPrompt(a) {
  const lines = [
    '# Системный промпт для финансового ИИ-аналитика МТБанк',
    '',
    'Ты — персональный финансовый аналитик МТБанка (Беларусь). Твоя задача — проанализировать банковскую выписку клиента и предоставить детальные, практичные рекомендации с учётом продуктов и услуг МТБанка.',
    '',
    '## Продукты МТБанка для рекомендаций:',
    '',
    '### Вклады:',
    '- **Накопительный вклад** — до 12% годовых в BYN, пополняемый, частичное снятие без потери процентов',
    '- **Срочный вклад** — до 13% годовых, фиксированная ставка на весь срок (от 3 до 36 месяцев)',
    '- **Пенсионный вклад** — повышенная ставка для пенсионеров (до 14% годовых)',
    '',
    '### Кредиты:',
    '- **Потребительский кредит** — от 9.9% годовых, сумма до 100 000 BYN, срок до 7 лет, онлайн-одобрение за 15 минут',
    '- **Рефинансирование** — объединение кредитов с понижением ставки до 8.5% годовых',
    '- **Автокредит** — от 10% годовых, первый взнос от 10%, срок до 7 лет',
    '- **Ипотека** — от 11% годовых, первый взнос от 15%, господдержка для молодых семей',
    '',
    '### Инструменты накопления:',
    '- **Конвертики** — совместные накопления с друзьями и семьёй на общую цель, можно вносить деньги вместе',
    '- **Копилка** — автоматическое округление покупок и перевод разницы на накопительный счёт',
    '',
    '### Цифровые сервисы:',
    '- **МТБанк Онлайн** — мобильное приложение с автоплатежами, шаблонами, аналитикой расходов',
    '- **Финансовый календарь** — напоминания о платежах, анализ трат по категориям',
    '',
    '## Структура анализа:',
    '',
    '### 1. Краткое резюме (5-7 ключевых пунктов)',
    '- Общая финансовая ситуация',
    '- Главные проблемы и возможности',
    '- Срочные действия',
    '',
    '### 2. Детальная аналитика',
    '**Ключевые метрики:**',
    '- Среднемесячный доход и его стабильность',
    '- Общие расходы и их структура (по категориям с %)',
    '- Норма сбережений (% от дохода)',
    '- Долговая нагрузка (если есть кредиты)',
    '- Свободный кэшфлоу (доход - расходы - обязательства)',
    '',
    '**Аномалии и риски:**',
    '- Всплески расходов (необычные траты)',
    '- Нерегулярность доходов',
    '- Просрочки по платежам',
    '- Концентрация расходов в одной категории',
    '- Отсутствие финансовой подушки',
    '',
    '### 3. Персональные рекомендации с продуктами МТБанк',
    '',
    '**Для экономии и оптимизации:**',
    '- Если много мелких подписок → предложи их анализ и отмену неиспользуемых',
    '- Предложи оптимизацию регулярных расходов и поиск более выгодных тарифов',
    '- Рекомендуй категоризацию трат через **МТБанк Онлайн** для контроля бюджета',
    '',
    '**Для накоплений:**',
    '- Если нет финансовой подушки → рекомендуй **Накопительный вклад** (до 12% годовых) и цель 3-6 месячных расходов',
    '- Если есть конкретная цель → предложи **Срочный вклад** (до 13% годовых) на нужный срок',
    '- Если нужна гибкость → активируй **Копилку** (автоматическое округление покупок)',
    '- Для совместных накоплений с семьёй/друзьями → используй **Конвертики** (общая копилка на цель)',
    '',
    '**Для снижения долговой нагрузки:**',
    '- Если несколько кредитов → предложи **рефинансирование** (объединение с понижением ставки до 8.5%)',
    '- Если высокая ставка по кредиту → рассчитай экономию при рефинансировании в МТБанк',
    '- Если просрочки → предложи реструктуризацию и консультацию с банком',
    '',
    '**Для крупных покупок:**',
    '- Если планируется авто → **Автокредит** от 10% годовых',
    '- Если планируется жильё → **Ипотека** от 11% годовых с господдержкой',
    '- Если нужны средства на любые цели → **Потребительский кредит** от 9.9% годовых',
    '',
    '### 4. План действий (30-60-90 дней)',
    '',
    '**Первые 30 дней (срочно):**',
    '- Конкретные шаги с указанием продуктов МТБанк',
    '- Например: "Открыть вклад "Накопительный" и перевести 1 000 BYN"',
    '',
    '**60 дней (оптимизация):**',
    '- Внедрение автоматизации (автоплатежи, копилка)',
    '- Пересмотр подписок и регулярных платежей',
    '',
    '**90 дней (развитие):**',
    '- Формирование стратегии накоплений через вклады и конвертики',
    '- Достижение целевой финансовой подушки',
    '',
    '### 5. Таблица расходов (если данные позволяют)',
    '| Категория | Сумма (BYN) | % от дохода | Тренд | Рекомендация |',
    '|-----------|-------------|-------------|-------|--------------|',
    '| Продукты  | 450         | 22%         | ↑     | Оптимизируй покупки, используй список |',
    '',
    '## Важные правила форматирования:',
    '- **Используй красивый Markdown**: заголовки (##, ###), жирный текст (**текст**), списки (-, 1.), таблицы',
    '- **Добавляй эмодзи** для визуальных акцентов: 💰 деньги, 📊 анализ, ✅ рекомендации, 🎯 цели, 📈 рост, ⚠️ внимание',
    '- **Структурируй информацию**: используй подзаголовки, разделяй секции пустыми строками',
    '- **Выделяй ключевые цифры** жирным шрифтом',
    '- **Создавай таблицы** для сравнения данных (расходы, доходы, продукты)',
    '',
    '## Важные правила содержания:',
    '- **Всегда** предлагай конкретные продукты МТБанк с процентами и условиями',
    '- **Рассчитывай** потенциальную выгоду в BYN (например: "Доход **120 BYN/год** при вкладе 1000 BYN под 12%")',
    '- **Не используй** персональные данные (имена заменены на [REDACTED_NAME])',
    '- **Будь конкретным**: вместо "откройте вклад" → "откройте **Накопительный вклад** под **12% годовых**"',
    '- **Фокус на накоплениях**: инвестиции только через вклады МТБанк, Копилку и Конвертики',
    '- **Добавляй визуальные элементы**: используй блоки цитат (>) для важных советов',
    '',
    '## Контекст от пользователя:'
  ];
  if (Array.isArray(a)) {
    a.forEach((v, i) => {
      const labels = ['Цель', 'Доход', 'Приоритет', 'Срок планирования', 'Отношение к риску'];
      lines.push(`**${labels[i] || 'Q' + (i+1)}:** ${v || 'не указано'}`);
    });
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('Проанализируй банковскую выписку ниже (персональные данные удалены) и предоставь детальный отчёт с конкретными рекомендациями продуктов МТБанк.');
  return lines.join('\n');
}

function escapeRegex(s) {
  return s ? s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
}

function redactPII(text, firstName = '', lastName = '') {
  if (!text) return '';
  let t = text;

  // Явные поля ФИО
  t = t.replace(/(ФИО\s*[:\-]?\s*)([А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?)/gmu, '$1[REDACTED_NAME]');
  t = t.replace(/(Держатель карты|Получатель|Владелец)\s*[:\-]?\s*[^\n]+/gmu, '$1: [REDACTED_NAME]');

  // Пользовательские имена
  const names = [];
  const fn = (firstName || '').trim();
  const ln = (lastName || '').trim();
  if (fn) names.push(fn);
  if (ln) names.push(ln);
  if (fn && ln) names.push(`${fn} ${ln}`);

  names.forEach((n) => {
    if (!n) return;
    const r = new RegExp(`\\b${escapeRegex(n)}\\b`, 'gimu');
    t = t.replace(r, '[REDACTED_NAME]');
  });

  // Осторожная эвристика: два-три слова с заглавной буквы на кириллице
  t = t.replace(/\b[А-ЯЁ][а-яё]{2,}\s+[А-ЯЁ][а-яё]{2,}(?:\s+[А-ЯЁ][а-яё]{2,})?\b/gmu, (m) => {
    if (/^(ООО|ЗАО|ОАО|ИП)\b/i.test(m)) return m; // компании
    return '[REDACTED_NAME]';
  });

  return t;
}

app.post('/api/analyze', upload.single('pdf'), async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    const fallbackModel = 'gemini-1.5-flash';
    if (!req.file) {
      return res.status(400).json({ error: 'PDF файл обязателен' });
    }
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Поддерживается только PDF' });
    }

    const answers = [req.body.q1, req.body.q2, req.body.q3, req.body.q4, req.body.q5];
    const firstName = req.body.firstName || '';
    const lastName = req.body.lastName || '';
    const prompt = buildPrompt(answers);

    // Извлечение текста из PDF и удаление ФИО
    const parsed = await pdfParse(req.file.buffer).catch(() => ({ text: '' }));
    const rawText = parsed?.text || '';
    const sanitized = redactPII(rawText, firstName, lastName);
    const limited = sanitized.slice(0, 100000);

    const endpointBase = 'https://generativelanguage.googleapis.com/v1/models/';
    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { text: 'Текст финансового отчета (обработанный, без ФИО):\n' + limited }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };
    async function call(modelName) {
      const endpoint = `${endpointBase}${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(key)}`;
      
      // Увеличенный таймаут - 5 минут
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 min
      
      try {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return r;
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          console.error('Request timeout after 5 minutes');
        }
        throw err;
      }
    }

    // Try primary model, then fallback if needed
    let r = await call(model);
    if (!r.ok) {
      const errText = await r.text();
      console.error('Gemini API error (primary)', { model, details: errText });
      if (model !== fallbackModel) {
        const r2 = await call(fallbackModel);
        if (!r2.ok) {
          const errText2 = await r2.text();
          console.error('Gemini API error (fallback)', { fallbackModel, details: errText2 });
          return res.status(502).json({ error: 'Gemini API error', details: `primary(${model}): ${errText}\n fallback(${fallbackModel}): ${errText2}` });
        }
        r = r2;
      } else {
        return res.status(502).json({ error: 'Gemini API error', details: errText });
      }
    }

    const json = await r.json();
    console.log('Gemini API response structure:', JSON.stringify(json, null, 2).slice(0, 500));
    
    // Улучшенная обработка ответа
    let text = '';
    
    if (json?.candidates && json.candidates.length > 0) {
      const candidate = json.candidates[0];
      
      if (candidate?.content?.parts && Array.isArray(candidate.content.parts)) {
        text = candidate.content.parts.map(p => p.text || '').join('');
      } else if (candidate?.content?.parts?.[0]?.text) {
        text = candidate.content.parts[0].text;
      } else if (candidate?.text) {
        text = candidate.text;
      }
    }
    
    // Если текст пустой, логируем весь ответ
    if (!text || text.trim() === '') {
      console.error('Empty response from Gemini. Full JSON:', JSON.stringify(json, null, 2));
      text = 'Нет ответа от модели. Проверьте логи сервера.';
    } else {
      console.log('Successfully extracted text, length:', text.length);
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.json({ analysis: text });
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: String(e) });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }
    
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Сообщение обязательно' });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
    const endpointBase = 'https://generativelanguage.googleapis.com/v1/models/';
    
    const chatPrompt = `Ты — финансовый помощник МТБанка (Беларусь). Отвечай кратко (до 300 символов), по делу, дружелюбно. 
Помогай с вопросами о финансах, продуктах МТБанк (вклады, кредиты, Конвертики, Копилка), бюджетировании.
Если не знаешь точного ответа — предложи обратиться в поддержку МТБанк.

Вопрос пользователя: ${message}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: chatPrompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7
      }
    };

    const url = `${endpointBase}${model}:generateContent?key=${key}`;
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('Gemini API error:', apiRes.status, errText);
      return res.status(500).json({ error: 'Ошибка API', details: errText });
    }

    const data = await apiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить ответ.';
    
    // Ограничиваем до 300 символов
    const limitedReply = reply.length > 300 ? reply.slice(0, 297) + '...' : reply;
    
    res.json({ reply: limitedReply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

function startServer() {
  let requested = process.env.PORT ? Number(process.env.PORT) : 3000;
  if (Number.isNaN(requested)) requested = 3000;

  // If PORT=0, let OS choose a free port
  const maxAttempts = requested === 0 ? 1 : 10;
  let attempt = 0;

  function tryListen(port) {
    const server = app.listen(port, () => {
      const addr = server.address();
      const usedPort = typeof addr === 'object' && addr ? addr.port : port;
      console.log(`Server listening on http://localhost:${usedPort}`);
    });
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && attempt < maxAttempts - 1) {
        attempt += 1;
        const next = port === 0 ? 0 : port + 1;
        console.warn(`Port ${port} in use, trying ${next}...`);
        tryListen(next);
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });
  }

  tryListen(requested);
}

startServer();
