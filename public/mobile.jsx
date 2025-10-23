const { useState, useMemo, Fragment } = React;

function initialsFrom(name, last) {
  const a = (name || '').trim();
  const b = (last || '').trim();
  const i1 = a ? a[0] : '';
  const i2 = b ? b[0] : '';
  return (i1 + i2).toUpperCase() || 'АИ';
}

function Icon({ name, active }) {
  const color = active ? '#8b5cf6' : 'currentColor';
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home') {
    return (
      <svg {...common}><path d="M3 11l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>
    );
  }
  if (name === 'pay') {
    return (
      <svg {...common}><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
    );
  }
  if (name === 'products') {
    return (
      <svg {...common}><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
    );
  }
  if (name === 'chat') {
    return (
      <svg {...common}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
    );
  }
  return null;
}

function fmt(amount, currency = 'BYN', hidden = false) {
  if (hidden) return '•••••';
  try {
    return new Intl.NumberFormat('ru-BY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' ' + currency;
  } catch {
    return amount.toFixed(2) + ' ' + currency;
  }
}

function HeaderBar() {
  return (
    <header className="mobile-header" />
  );
}

// Quick actions удалены по требованию

function CarouselPlaceholder() {
  return (
    <section className="carousel">
      <div className="carousel-track">
        <div className="product-card svg-card">
          <img src="/media/SUPEROMAVISA.svg" alt="SuperOma Visa" className="card-image" />
        </div>
        <div className="product-card svg-card">
          <img src="/media/SUPEROMAMASTERCARD.svg" alt="SuperOma MasterCard" className="card-image" />
        </div>
      </div>
      <div className="cards-divider">
        <div className="divider-line"></div>
        <div className="divider-dot"></div>
        <div className="divider-line"></div>
      </div>
    </section>
  );
}

function SuperOmaButton({ onClick }) {
  return (
    <button className="superoma-full-btn" onClick={onClick}>
      <img src="/media/сыгасуперома.svg" alt="Сыграть SuperOma" className="superoma-btn-image" />
    </button>
  );
}

function TxRow({ icon, name, time, amount, currency }) {
  const positive = amount >= 0;
  return (
    <div className="tx-item">
      <div className="tx-icon" aria-hidden>{icon}</div>
      <div className="tx-main">
        <div className="tx-merchant">{name}</div>
        <div className="tx-time">{time}</div>
      </div>
      <div className={`tx-amount ${positive ? 'pos' : 'neg'}`}>{positive ? '+' : ''}{fmt(Math.abs(amount), currency, false)}</div>
    </div>
  );
}

function Transactions({ items }) {
  return (
    <section className="tx-section">
      <div className="tx-header">
        <div className="tx-title">Последние операции</div>
        <a className="tx-all" href="#" onClick={(e)=>{e.preventDefault(); alert('История (демо)')}}>Показать все</a>
      </div>
      <div className="tx-list">
        {items.map((t, i) => <TxRow key={i} {...t} />)}
      </div>
    </section>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { key: 'home', label: 'Главная', icon: 'home' },
    { key: 'pay', label: 'Платежи', icon: 'pay' },
    { key: 'products', label: 'Продукты', icon: 'products' },
    { key: 'chat', label: 'Чат', icon: 'chat' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(it => (
        <button key={it.key} className={`nav-item ${active === it.key ? 'active' : ''}`} onClick={()=>onChange(it.key)}>
          <div className="nav-icon" aria-hidden><Icon name={it.icon} active={active === it.key} /></div>
          <div className="nav-label">{it.label}</div>
        </button>
      ))}
    </nav>
  );
}

function Stepper({ step, total }) {
  return (
    <div className="stepper">
      <div className="stepper-track">
        <div className="stepper-progress" style={{ width: `${Math.min(((step+1)/total)*100,100)}%` }} />
      </div>
      <div className="stepper-label">Шаг {Math.min(step+1, total)} из {total}</div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

function RadioGrid({ name, value, onChange, options, onSelect }) {
  return (
    <div className="radio-grid">
      {options.map((opt) => (
        <label key={opt} className={`radio-card ${value===opt ? 'active' : ''}`} onClick={()=>{ onChange(opt); if(onSelect) onSelect(); }}>
          <input type="radio" name={name} value={opt} checked={value===opt} onChange={()=>{}} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function Dropzone({ file, onSelect }) {
  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  }
  return (
    <div className="dropzone" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
      <div className="dz-label">Перетащите PDF сюда или выберите файл</div>
      <input type="file" accept="application/pdf" onChange={(e)=>onSelect(e.target.files?.[0] || null)} />
      {file && (
        <div className="dz-file">Выбран файл: {file.name} ({Math.round(file.size/1024)} КБ)</div>
      )}
    </div>
  );
}

function MobileApp() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(-1);
  const total = 6;
  const [aiMode, setAiMode] = useState(''); // 5 вопросов + PDF (без имени)

  // profile/greetings
  const [profileFirstName, setProfileFirstName] = useState('Алексей');
  const [profileLastName, setProfileLastName] = useState('Иванов');
  const [notifCount, setNotifCount] = useState(2);
  const [active, setActive] = useState('home');
  const [showMapPage, setShowMapPage] = useState(false);

  // quick actions + report wizard
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [wizardFirstName, setWizardFirstName] = useState('');
  const [wizardLastName, setWizardLastName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultHTML, setResultHTML] = useState('');

  // carousel
  const [hide, setHide] = useState(false);

  // transactions
  const tx = useMemo(() => ([
    { icon: '🛒', name: 'ГИППО', time: 'Сегодня, 14:31', amount: -27.50, currency: 'BYN' },
    { icon: '☕', name: 'Кофейня', time: 'Сегодня, 12:10', amount: -4.20, currency: 'BYN' },
    { icon: '💸', name: 'Перевод от Ивана П.', time: 'Вчера, 10:35', amount: 100.00, currency: 'BYN' }
  ]), []);

  function resetWizard() {
    setStep(-1);
    setAiMode('');
    setQ1(''); setQ2(''); setQ3(''); setQ4(''); setQ5('');
    setWizardFirstName(''); setWizardLastName(''); setFile(null); setError('');
    setLoading(false); setResultHTML('');
    setChatMessages([]);
    setChatInput('');
  }

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // Konvertiki state
  const [konvertiki, setKonvertiki] = useState([
    { 
      id: 1, 
      goal: 'Отпуск', 
      current: 450, 
      target: 2000, 
      participants: [
        { id: 1, name: 'Алексей', avatar: 'https://i.pravatar.cc/150?img=12' },
        { id: 2, name: 'Мария', avatar: 'https://i.pravatar.cc/150?img=5' }
      ],
      payments: [
        { id: 1, date: 'Сегодня, 14:31', amount: 50, type: 'Пополнение', from: 'Алексей' },
        { id: 2, date: 'Вчера, 18:20', amount: 100, type: 'Пополнение', from: 'Мария' },
        { id: 3, date: 'Вчера, 12:15', amount: 150, type: 'Пополнение', from: 'Алексей' },
        { id: 4, date: '20 окт, 16:45', amount: 150, type: 'Пополнение', from: 'Мария' }
      ],
      roundingAmount: 0.05
    }
  ]);
  
  const [showKonvertikModal, setShowKonvertikModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showKonvertikDetailModal, setShowKonvertikDetailModal] = useState(false);
  const [selectedKonvertik, setSelectedKonvertik] = useState(null);
  const [newKonvertikGoal, setNewKonvertikGoal] = useState('');
  const [newKonvertikTarget, setNewKonvertikTarget] = useState('');
  const [newKonvertikParticipants, setNewKonvertikParticipants] = useState([]);
  
  const availableParticipants = [
    { id: 1, name: 'Алексей', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 2, name: 'Мария', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Дмитрий', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: 4, name: 'Елена', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: 5, name: 'Иван', avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 6, name: 'Анна', avatar: 'https://i.pravatar.cc/150?img=20' }
  ];
  
  function openKonvertikModal() {
    setNewKonvertikGoal('');
    setNewKonvertikTarget('');
    setNewKonvertikParticipants([]);
    setShowKonvertikModal(true);
  }
  
  function toggleParticipant(participant) {
    setNewKonvertikParticipants(prev => {
      const exists = prev.find(p => p.id === participant.id);
      if (exists) {
        return prev.filter(p => p.id !== participant.id);
      } else {
        return [...prev, participant];
      }
    });
  }
  
  function createKonvertik() {
    if (!newKonvertikGoal.trim() || !newKonvertikTarget || newKonvertikParticipants.length === 0) {
      alert('Заполните все поля и добавьте участников');
      return;
    }
    const newId = Math.max(...konvertiki.map(k => k.id), 0) + 1;
    setKonvertiki([...konvertiki, { 
      id: newId, 
      goal: newKonvertikGoal, 
      current: 0, 
      target: parseFloat(newKonvertikTarget),
      participants: newKonvertikParticipants,
      payments: [],
      roundingAmount: 0.05
    }]);
    setShowKonvertikModal(false);
  }
  
  function openKonvertikDetail(konvertik) {
    setSelectedKonvertik(konvertik);
    setShowKonvertikDetailModal(true);
  }

  async function sendChatMessage() {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const question = chatInput;
    setChatInput('');
    
    // Добавляем индикатор печати
    setChatMessages(prev => [...prev, { role: 'ai', text: 'Печатаю...', typing: true }]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      });
      
      const data = await response.json();
      
      // Удаляем индикатор и добавляем реальный ответ
      setChatMessages(prev => prev.filter(m => !m.typing));
      
      if (response.ok && data.reply) {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'Извините, произошла ошибка. Попробуйте ещё раз.' }]);
      }
    } catch (error) {
      setChatMessages(prev => prev.filter(m => !m.typing));
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Ошибка связи с сервером. Проверьте подключение.' }]);
    }
  }

  function next() { setStep((s)=>Math.min(s+1, total)); }

  async function submit() {
    setError('');
    if (!file) { setError('Пожалуйста, выберите PDF файл.'); return; }
    if (file.type !== 'application/pdf') { setError('Поддерживается только PDF.'); return; }
    if (file.size > 20*1024*1024) { setError('Максимальный размер файла 20 МБ.'); return; }

    setLoading(true);

    const fd = new FormData();
    fd.append('pdf', file);
    fd.append('q1', q1); fd.append('q2', q2); fd.append('q3', q3); fd.append('q4', q4); fd.append('q5', q5);
    fd.append('firstName', wizardFirstName); fd.append('lastName', wizardLastName);

    try {
      const r = await fetch('/api/analyze', { method: 'POST', body: fd });
      const json = await r.json();
      if (!r.ok) {
        const details = json?.details ? `: ${String(json.details)}` : '';
        setError((json?.error || 'Ошибка анализа') + details);
        setLoading(false);
        return;
      }
      const html = window.marked?.parse(json.analysis || '') || (json.analysis || '');
      setResultHTML(html);
      setLoading(false);
      setStep(7);
    } catch (e) {
      setError('Сетевая ошибка');
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <div className="mobile-shell">
        <HeaderBar />

        <main className="mobile-main">
          {active === 'home' && !showMapPage && (
            <Fragment>
              <CarouselPlaceholder />
              <SuperOmaButton onClick={()=>setShowMapPage(true)} />
              
              <div className="page-divider"></div>
              
              <section className="konvertiki-section-new">
                <div className="konvertiki-header">
                  <h3 className="konvertiki-title">Конвертики</h3>
                  <button className="konvertiki-add-btn" onClick={openKonvertikModal} aria-label="Добавить конверт">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
                <div className="konvertiki-list">
                  {konvertiki.map((k) => {
                    const progress = Math.min((k.current / k.target) * 100, 100);
                    return (
                      <div key={k.id} className="konvertik-card-new" onClick={()=>openKonvertikDetail(k)}>
                        <div className="konvertik-goal">{k.goal}</div>
                        <div className="konvertik-content">
                          <div className="konvertik-envelope">
                            <svg width="80" height="80" viewBox="0 0 100 100" className="envelope-svg">
                              <rect x="10" y="25" width="80" height="50" rx="4" fill="rgba(17,26,43,0.6)" stroke="#8b5cf6" strokeWidth="2"/>
                              <path d="M10 25 L50 55 L90 25" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="konvertik-progress-bar">
                            <div className="konvertik-progress-fill" style={{width: `${progress}%`}}></div>
                          </div>
                          <div className="konvertik-info">
                            <div className="konvertik-amount">{k.current} / {k.target} BYN</div>
                            <div className="konvertik-participants">
                              {k.participants.slice(0, 3).map((p, i) => (
                                <img key={p.id} src={p.avatar} alt={p.name} className="participant-avatar" style={{marginLeft: i > 0 ? '-8px' : '0'}} />
                              ))}
                              {k.participants.length > 3 && <span className="participant-more">+{k.participants.length - 3}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
              
              <div className="page-divider"></div>
              
              <Transactions items={tx} />
            </Fragment>
          )}
          
          {active === 'home' && showMapPage && (
            <div className="map-page">
              <button className="map-back-btn" onClick={()=>setShowMapPage(false)} aria-label="Назад">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <div className="map-container">
                <img src="/media/map.svg" alt="Карта пути" className="map-image" />
              </div>
            </div>
          )}
          {active === 'pay' && (
            <section className="app-section">
              <h3 className="app-section-title">Быстрые платежи</h3>
              <div className="app-grid">
                <button className="app-tile">
                  <div className="app-tile-icon">📱</div>
                  <div className="app-tile-label">Мобильная связь</div>
                </button>
                <button className="app-tile">
                  <div className="app-tile-icon">💡</div>
                  <div className="app-tile-label">Коммунальные</div>
                </button>
                <button className="app-tile">
                  <div className="app-tile-icon">🌐</div>
                  <div className="app-tile-label">Интернет</div>
                </button>
                <button className="app-tile">
                  <div className="app-tile-icon">🚗</div>
                  <div className="app-tile-label">Штрафы ГАИ</div>
                </button>
              </div>
              
              <h3 className="app-section-title" style={{marginTop:'24px'}}>Переводы</h3>
              <div className="app-list">
                <button className="app-list-item">
                  <div className="app-list-icon">💳</div>
                  <div className="app-list-content">
                    <div className="app-list-title">По номеру карты</div>
                    <div className="app-list-subtitle">Мгновенный перевод</div>
                  </div>
                  <div className="app-list-arrow">›</div>
                </button>
                <button className="app-list-item">
                  <div className="app-list-icon">📞</div>
                  <div className="app-list-content">
                    <div className="app-list-title">По номеру телефона</div>
                    <div className="app-list-subtitle">Без комиссии</div>
                  </div>
                  <div className="app-list-arrow">›</div>
                </button>
              </div>
            </section>
          )}
          {active === 'products' && (
            <section className="app-section">
              <h3 className="app-section-title">Мои продукты</h3>
              <div className="app-list">
                <button className="app-list-item">
                  <div className="app-list-icon">💳</div>
                  <div className="app-list-content">
                    <div className="app-list-title">Карты</div>
                    <div className="app-list-subtitle">2 активные • SuperOma Visa, MasterCard</div>
                  </div>
                  <div className="app-list-arrow">›</div>
                </button>
                <button className="app-list-item">
                  <div className="app-list-icon">💰</div>
                  <div className="app-list-content">
                    <div className="app-list-title">Вклады</div>
                    <div className="app-list-subtitle">До 12% годовых • Накопительный, Срочный</div>
                  </div>
                  <div className="app-list-arrow">›</div>
                </button>
                <button className="app-list-item">
                  <div className="app-list-icon">🏦</div>
                  <div className="app-list-content">
                    <div className="app-list-title">Кредиты</div>
                    <div className="app-list-subtitle">От 9.9% • Потребительский, Авто</div>
                  </div>
                  <div className="app-list-arrow">›</div>
                </button>
              </div>
              
              <h3 className="app-section-title" style={{marginTop:'24px'}}>Финансовый анализ</h3>
              <button className="app-action-btn" onClick={()=>{ setOpen(true); resetWizard(); }}>
                <div className="app-action-icon">📊</div>
                <div className="app-action-content">
                  <div className="app-action-title">Создать отчет</div>
                  <div className="app-action-subtitle">Анализ расходов и рекомендации</div>
                </div>
              </button>
            </section>
          )}
          {active === 'chat' && (
            <section className="app-section">
              <h3 className="app-section-title">Поддержка</h3>
              <button className="app-action-btn" onClick={()=>{ setOpen(true); setAiMode('chat'); setStep(100); }}>
                <div className="app-action-icon">💬</div>
                <div className="app-action-content">
                  <div className="app-action-title">Чат с ИИ-помощником</div>
                  <div className="app-action-subtitle">Ответы на вопросы о финансах 24/7</div>
                </div>
              </button>
              
              <h3 className="app-section-title" style={{marginTop:'24px'}}>Контакты</h3>
              <div className="app-list">
                <button className="app-list-item">
                  <div className="app-list-icon">📞</div>
                  <div className="app-list-content">
                    <div className="app-list-title">Горячая линия</div>
                    <div className="app-list-subtitle">+375 (17) 229-2-229</div>
                  </div>
                  <div className="app-list-arrow">›</div>
                </button>
                <button className="app-list-item">
                  <div className="app-list-icon">✉️</div>
                  <div className="app-list-content">
                    <div className="app-list-title">Email</div>
                    <div className="app-list-subtitle">info@mtbank.by</div>
                  </div>
                  <div className="app-list-arrow">›</div>
                </button>
              </div>
            </section>
          )}
        </main>
        <button className="fab" onClick={()=>{ setOpen(true); resetWizard(); }} aria-label="Создать отчет">
          <img src="/media/книпкаподсчеткредита.svg" alt="Подсчет кредита" className="fab-image" />
        </button>

        <BottomNav active={active} onChange={setActive} />
      </div>

      {showKonvertikModal && (
        <Modal onClose={()=>setShowKonvertikModal(false)}>
          <div className="modal-body">
            <h2>Создать конвертик</h2>
            <p className="muted">Укажите цель накоплений, участников и сумму</p>
            
            <div style={{marginTop:'20px'}}>
              <label className="input-label">Название цели</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="Например: Отпуск, Подарок, Авто"
                value={newKonvertikGoal}
                onChange={(e)=>setNewKonvertikGoal(e.target.value)}
              />
            </div>
            
            <div style={{marginTop:'16px'}}>
              <label className="input-label">Целевая сумма (BYN)</label>
              <input 
                type="number" 
                className="modal-input" 
                placeholder="1000"
                value={newKonvertikTarget}
                onChange={(e)=>setNewKonvertikTarget(e.target.value)}
              />
            </div>
            
            <div style={{marginTop:'16px'}}>
              <label className="input-label">Участники ({newKonvertikParticipants.length})</label>
              <button className="btn" onClick={()=>setShowParticipantsModal(true)} style={{width:'100%',marginTop:'8px'}}>
                {newKonvertikParticipants.length === 0 ? 'Добавить участников' : 'Изменить участников'}
              </button>
              {newKonvertikParticipants.length > 0 && (
                <div className="selected-participants">
                  {newKonvertikParticipants.map(p => (
                    <div key={p.id} className="selected-participant">
                      <img src={p.avatar} alt={p.name} className="participant-avatar-small" />
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button className="btn" onClick={()=>setShowKonvertikModal(false)}>Отмена</button>
              <button className="btn primary" onClick={createKonvertik}>Создать</button>
            </div>
          </div>
        </Modal>
      )}

      {showParticipantsModal && (
        <Modal onClose={()=>setShowParticipantsModal(false)}>
          <div className="modal-body">
            <h2>Выбрать участников</h2>
            <p className="muted">Выберите людей, которые будут копить вместе с вами</p>
            
            <div className="participants-grid">
              {availableParticipants.map(p => {
                const isSelected = newKonvertikParticipants.find(sp => sp.id === p.id);
                return (
                  <div 
                    key={p.id} 
                    className={`participant-card ${isSelected ? 'selected' : ''}`}
                    onClick={()=>toggleParticipant(p)}
                  >
                    <img src={p.avatar} alt={p.name} className="participant-avatar-large" />
                    <div className="participant-name">{p.name}</div>
                    {isSelected && (
                      <div className="participant-check">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="modal-actions">
              <button className="btn primary" onClick={()=>setShowParticipantsModal(false)}>Готово</button>
            </div>
          </div>
        </Modal>
      )}

      {showKonvertikDetailModal && selectedKonvertik && (
        <Modal onClose={()=>setShowKonvertikDetailModal(false)}>
          <div className="modal-body">
            <h2>{selectedKonvertik.goal}</h2>
            <p className="muted">Детали конвертика</p>
            
            {/* Конверт с прогрессом */}
            <div className="detail-envelope-section">
              <div className="detail-envelope">
                <svg width="120" height="120" viewBox="0 0 100 100" className="envelope-svg-large">
                  <rect x="10" y="25" width="80" height="50" rx="4" fill="rgba(17,26,43,0.6)" stroke="#8b5cf6" strokeWidth="2"/>
                  <path d="M10 25 L50 55 L90 25" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="detail-progress-bar">
                <div className="detail-progress-fill" style={{width: `${Math.min((selectedKonvertik.current / selectedKonvertik.target) * 100, 100)}%`}}></div>
              </div>
              <div className="detail-amount">{selectedKonvertik.current} / {selectedKonvertik.target} BYN</div>
              <div className="detail-percent">{Math.min((selectedKonvertik.current / selectedKonvertik.target) * 100, 100).toFixed(1)}% собрано</div>
            </div>
            
            {/* Автоматическое округление */}
            <div className="detail-section">
              <div className="detail-section-header">
                <div className="detail-section-icon">🔄</div>
                <div>
                  <div className="detail-section-title">Автоматическое округление</div>
                  <div className="detail-section-subtitle">Округление каждой покупки</div>
                </div>
              </div>
              <div className="detail-rounding-info">
                <div className="rounding-amount">{selectedKonvertik.roundingAmount.toFixed(2)} BYN</div>
                <div className="rounding-text">списывается с карты при каждой покупке</div>
              </div>
            </div>
            
            {/* Участники */}
            <div className="detail-section">
              <div className="detail-section-header">
                <div className="detail-section-icon">👥</div>
                <div>
                  <div className="detail-section-title">Участники ({selectedKonvertik.participants.length})</div>
                  <div className="detail-section-subtitle">Копят вместе с вами</div>
                </div>
              </div>
              <div className="detail-participants-list">
                {selectedKonvertik.participants.map(p => (
                  <div key={p.id} className="detail-participant">
                    <img src={p.avatar} alt={p.name} className="detail-participant-avatar" />
                    <div className="detail-participant-name">{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* История платежей */}
            <div className="detail-section">
              <div className="detail-section-header">
                <div className="detail-section-icon">💰</div>
                <div>
                  <div className="detail-section-title">История платежей</div>
                  <div className="detail-section-subtitle">{selectedKonvertik.payments?.length || 0} операций</div>
                </div>
              </div>
              <div className="detail-payments-list">
                {selectedKonvertik.payments && selectedKonvertik.payments.length > 0 ? (
                  selectedKonvertik.payments.map(payment => (
                    <div key={payment.id} className="detail-payment">
                      <div className="detail-payment-icon">💸</div>
                      <div className="detail-payment-main">
                        <div className="detail-payment-type">{payment.type}</div>
                        <div className="detail-payment-info">{payment.from} • {payment.date}</div>
                      </div>
                      <div className="detail-payment-amount">+{payment.amount} BYN</div>
                    </div>
                  ))
                ) : (
                  <div className="detail-empty">Пока нет платежей</div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn primary" onClick={()=>setShowKonvertikDetailModal(false)}>Закрыть</button>
            </div>
          </div>
        </Modal>
      )}

      {open && (
        <Modal onClose={()=>setOpen(false)}>
          {step >= 0 && step < 100 && aiMode === 'analysis' && <Stepper step={Math.min(step, total-1)} total={total} />}
          <div className="modal-body">
            {step === -1 && (
              <div>
                <h2>Выберите режим</h2>
                <p className="muted">Что вы хотите сделать?</p>
                <div className="radio-grid">
                  <button className="radio-card mode-select" onClick={()=>{ setAiMode('chat'); setStep(100); }}>
                    <span>💬 Чат с ИИ</span>
                  </button>
                  <button className="radio-card mode-select" onClick={()=>{ setAiMode('analysis'); setStep(0); }}>
                    <span>📊 Анализ расходов</span>
                  </button>
                </div>
              </div>
            )}

            {step === 100 && (
              <div>
                <h2>💬 Чат с ИИ-помощником</h2>
                <div className="chat-container">
                  <div className="chat-messages">
                    {chatMessages.length === 0 && (
                      <div className="chat-welcome">
                        <div className="chat-welcome-icon">👋</div>
                        <p>Привет! Я ваш финансовый помощник.</p>
                        <p className="muted">Задайте мне любой вопрос о финансах!</p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`chat-message ${msg.role}`}>
                        <div className="chat-avatar">{msg.role === 'user' ? '👤' : '💬'}</div>
                        <div className="chat-bubble">{msg.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-area">
                    <label className="chat-attach-btn" title="Прикрепить файл">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                      </svg>
                      <input type="file" style={{display:'none'}} />
                    </label>
                    <input 
                      type="text" 
                      className="chat-input" 
                      placeholder="Напишите сообщение..."
                      value={chatInput}
                      onChange={(e)=>setChatInput(e.target.value)}
                      onKeyPress={(e)=>{ if(e.key==='Enter') sendChatMessage(); }}
                    />
                    <button className="chat-send-btn" onClick={sendChatMessage}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 0 && aiMode === 'analysis' && (
              <div>
                <h2>Какая у вас цель?</h2>
                <p className="muted">Выберите главное, что хотите улучшить</p>
                <RadioGrid name="q1" value={q1} onChange={setQ1} onSelect={next} options={[
                  'Экономить больше',
                  'Избавиться от долгов',
                  'Накопить на покупку',
                  'Начать инвестировать'
                ]} />
                <button className="modal-back-btn" onClick={()=>{ setStep(-1); setAiMode(''); }} aria-label="Назад">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {step === 1 && aiMode === 'analysis' && (
              <div>
                <h2>Какой у вас доход в месяц?</h2>
                <p className="muted">Выберите наиболее подходящий вариант</p>
                <RadioGrid name="q2" value={q2} onChange={setQ2} onSelect={next} options={[
                  'Менее 800 BYN',
                  '1000 - 1500 BYN',
                  '1500 - 2500 BYN',
                  'Более 2500 BYN'
                ]} />
                <button className="modal-back-btn" onClick={()=>setStep(0)} aria-label="Назад">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {step === 2 && aiMode === 'analysis' && (
              <div>
                <h2>Что важнее всего?</h2>
                <p className="muted">На чём сфокусироваться в первую очередь</p>
                <RadioGrid name="q3" value={q3} onChange={setQ3} onSelect={next} options={[
                  'Создать резерв',
                  'Закрыть кредиты',
                  'Начать инвестировать',
                  'Сократить расходы'
                ]} />
                <button className="modal-back-btn" onClick={()=>setStep(1)} aria-label="Назад">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {step === 3 && aiMode === 'analysis' && (
              <div>
                <h2>На какой срок планируете?</h2>
                <p className="muted">Выберите период для рекомендаций</p>
                <RadioGrid name="q4" value={q4} onChange={setQ4} onSelect={next} options={['1 месяц','3 месяца','6 месяцев','1 год']} />
                <button className="modal-back-btn" onClick={()=>setStep(2)} aria-label="Назад">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {step === 4 && aiMode === 'analysis' && (
              <div>
                <h2>Как относитесь к риску?</h2>
                <p className="muted">Ваш подход к финансовым решениям</p>
                <RadioGrid name="q5" value={q5} onChange={setQ5} onSelect={next} options={['Осторожно','Умеренно','Смело']} />
                <button className="modal-back-btn" onClick={()=>setStep(3)} aria-label="Назад">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {step === 5 && aiMode === 'analysis' && !loading && resultHTML === '' && (
              <div>
                <h2>Выписка</h2>
                <p className="muted">Загрузите PDF-файл выписки для анализа</p>
                
                <div className="file-upload-section">
                  {!file ? (
                    <div className="file-upload-empty">
                      <div className="file-upload-icon">📄</div>
                      <div className="file-upload-text">Файл не выбран</div>
                    </div>
                  ) : (
                    <div className="file-upload-selected">
                      <div className="file-upload-icon">📄</div>
                      <div className="file-upload-info">
                        <div className="file-upload-name">{file.name}</div>
                        <div className="file-upload-size">{Math.round(file.size/1024)} КБ</div>
                      </div>
                      <button className="file-remove-btn" onClick={()=>setFile(null)} aria-label="Удалить">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <label className="file-upload-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>{file ? 'Выбрать другой файл' : 'Загрузить выписку'}</span>
                    <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0] || null)} style={{display:'none'}} />
                  </label>
                </div>
                
                {error && <div className="error">{error}</div>}
                <div className="modal-actions">
                  <button className="btn primary" onClick={submit} disabled={!file}>Получить анализ</button>
                </div>
                <button className="modal-back-btn" onClick={()=>setStep(4)} aria-label="Назад">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {loading && aiMode === 'analysis' && (
              <div className="center">
                <div className="spinner" />
                <div className="muted">Анализируем ваш отчёт...</div>
              </div>
            )}

            {!loading && resultHTML !== '' && aiMode === 'analysis' && (
              <div className="result-pane">
                <h2>Готовый отчет</h2>
                <div className="markdown" dangerouslySetInnerHTML={{ __html: resultHTML }} />
                <div className="modal-actions">
                  <button className="btn primary" onClick={()=>{ setAiMode('chat'); setStep(100); }}>💬 Перейти к обсуждению с ИИ</button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MobileApp />);
