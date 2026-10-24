"use client";

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BOOKS,
  calculateResults,
  DIMENSIONS,
  QUIZ_QUESTIONS,
  type Dimension
} from "@/lib/quiz";

const money = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(amount);


/* ===== THÔNG TIN LIÊN HỆ & THANH TOÁN ===== */
const ZALO_URL = "https://zalo.me/0908235225";            // Zalo của Thanh Hương
const MESSENGER_URL = "https://m.me/tong.huong.37916";   // Messenger Facebook cá nhân của Thanh Hương
const BANK = {
  bankName: "ACB",
  accountName: "TONG THI THANH HUONG",
  accountNumber: "48629859"
};

type OrderItem = { title: string; price: number; code: string };

function toBankText(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, 20);
}

function OrderModal({ item, onClose }: { item: OrderItem | null; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qrFailed, setQrFailed] = useState(false);

  useEffect(() => {
    if (!item) return;
    setCopied(null);
    setQrFailed(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const phoneDigits = phone.replace(/\D/g, "");
  const ready = name.trim().length >= 2 && phoneDigits.length >= 9 && phoneDigits.length <= 11;
  const note = ready ? `${item.code} ${phoneDigits} ${toBankText(name)}`.trim() : `${item.code} + SĐT + họ tên`;
  const message = ready
    ? `Chào Thanh Hương, mình là ${name.trim()} (SĐT ${phoneDigits}). Mình đã chuyển khoản ${money(item.price)} mua ${item.title}. Mình gửi ảnh chuyển khoản, nhờ bạn gửi file giúp mình nhé.`
    : "";
  const dynamicQr =
    ready && !qrFailed
      ? `https://img.vietqr.io/image/${BANK.bankName}-${BANK.accountNumber}-compact2.png?amount=${item.price}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(BANK.accountName)}`
      : null;

  function copy(text: string, key: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => setCopied(key)).catch(() => setCopied(null));
    }
  }

  function contact(url: string) {
    if (!ready) return;
    copy(message, "message");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="order-backdrop" onClick={onClose}>
      <div
        className="order-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="order-close" onClick={onClose} aria-label="Đóng">×</button>
        <p className="eyebrow">THANH TOÁN &amp; NHẬN EBOOK</p>
        <h3 id="order-title">{item.title}</h3>
        <p className="order-price">{money(item.price)}</p>

        <p className="order-step-title"><span>1</span> Nhập thông tin của bạn</p>
        <div className="order-form">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên" autoComplete="name" aria-label="Họ và tên" />
          <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại (Zalo)" autoComplete="tel" aria-label="Số điện thoại" />
        </div>

        <p className="order-step-title"><span>2</span> Quét mã để chuyển khoản</p>
        <div className="order-qr">
          {dynamicQr ? (
            <Image key="dynamic" src={dynamicQr} unoptimized alt={`Mã QR chuyển khoản ${money(item.price)}`} width={600} height={600} onError={() => setQrFailed(true)} />
          ) : (
            <Image key="static" src={QR_DATA_URI} unoptimized alt={`Mã QR chuyển khoản ${BANK.bankName} - ${BANK.accountName}`} width={520} height={628} />
          )}
        </div>
        <p className="order-qr-caption">
          {dynamicQr
            ? "Mã QR đã điền sẵn số tiền và nội dung. Quét là xong."
            : ready
              ? "Hãy chuyển đúng số tiền và nội dung bên dưới."
              : "Nhập tên và số điện thoại ở bước 1 để có nội dung chuyển khoản."}
        </p>
        <dl className="order-bank">
          <div><dt>Ngân hàng</dt><dd>{BANK.bankName}</dd></div>
          <div><dt>Chủ tài khoản</dt><dd>{BANK.accountName}</dd></div>
          <div>
            <dt>Số tài khoản</dt>
            <dd>{BANK.accountNumber} <button type="button" className="copy-chip" onClick={() => copy(BANK.accountNumber, "account")}>{copied === "account" ? "Đã chép ✓" : "Sao chép"}</button></dd>
          </div>
          <div>
            <dt>Số tiền</dt>
            <dd>{money(item.price)} <button type="button" className="copy-chip" onClick={() => copy(String(item.price), "amount")}>{copied === "amount" ? "Đã chép ✓" : "Sao chép"}</button></dd>
          </div>
          <div>
            <dt>Nội dung</dt>
            <dd>{note} {ready && <button type="button" className="copy-chip" onClick={() => copy(note, "note")}>{copied === "note" ? "Đã chép ✓" : "Sao chép"}</button>}</dd>
          </div>
        </dl>

        <p className="order-step-title"><span>3</span> Chuyển xong? Báo cho Thanh Hương</p>
        <p className="order-hint">Bấm nút bên dưới: tin nhắn kèm tên, số điện thoại và số tiền sẽ được sao chép sẵn. Bạn chỉ cần dán vào ô chat, gửi kèm <strong>ảnh chuyển khoản</strong> và nhận file ebook <strong>trong ngày thanh toán</strong>.</p>
        <div className="order-actions">
          <button type="button" className="button button-dark" disabled={!ready} onClick={() => contact(ZALO_URL)}>Tôi đã chuyển khoản · báo qua Zalo <span>→</span></button>
          <button type="button" className="button button-outline" disabled={!ready} onClick={() => contact(MESSENGER_URL)}>Tôi đã chuyển khoản · báo qua Messenger <span>→</span></button>
        </div>
        {!ready && <p className="order-hint">Hãy nhập họ tên và số điện thoại ở bước 1 để dùng nút trên.</p>}
        {ready && copied === "message" && <p className="order-copied" aria-live="polite">✓ Đã sao chép tin nhắn. Hãy dán vào khung chat và gửi kèm ảnh chuyển khoản.</p>}
        {ready && (
          <>
            <blockquote className="order-message">{message}</blockquote>
            <button type="button" className="button button-outline order-copy-message" onClick={() => copy(message, "message")}>{copied === "message" ? "Đã sao chép ✓" : "Sao chép tin nhắn"}</button>
          </>
        )}

        <p className="order-policy">Hoàn tiền nếu bạn không đọc được sách. Vui lòng không chia sẻ file cho người khác.</p>
      </div>
    </div>
  );
}

function FloatingContact() {
  return (
    <div className="floating-contact" aria-label="Liên hệ nhanh">
      <a className="fc fc-zalo" href={ZALO_URL} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a>
      <a className="fc fc-messenger" href={MESSENGER_URL} target="_blank" rel="noopener noreferrer">Messenger</a>
    </div>
  );
}

const bookOrder = ["book_tinh_lang", "book_vu_tru", "combo_tro_ve"] as const;

const BOOK_CODES = { book_tinh_lang: "BLTL", book_vu_tru: "STVT", combo_tro_ve: "BODOI" } as const;

/* Câu nối cho khách ở giai đoạn khám phá (chưa có nhu cầu nổi bật) */
const BRIDGE_EXPLORE =
  "Khi chưa rõ mình cần gì trước, bạn không phải chọn vội. Bộ đôi cho bạn cả hai điểm bắt đầu: một để tìm lại sự vững vàng bên trong, một để hiểu nhịp điệu riêng của mình, lại tiết kiệm hơn mua lẻ.";

/* Câu nối khi bộ đôi là lựa chọn thứ hai (kết quả chỉ có một nhu cầu nổi bật) */
const BRIDGE_SECOND =
  "Nếu bạn muốn vừa tìm lại sự vững vàng bên trong, vừa hiểu nhịp điệu riêng của mình, bộ đôi cho bạn cả hai hướng cùng lúc, lại tiết kiệm hơn mua lẻ.";

/* Câu nối giữa kết quả trắc nghiệm và cuốn sách được gợi ý */
const BRIDGE = {
  book_tinh_lang: "Cuốn sách đồng hành cùng bạn bằng những thực hành nhỏ mỗi ngày để dừng lại, quan sát mình không phán xét và dần vững vàng hơn.",
  book_vu_tru: "Cuốn sổ tay giúp bạn ghi lại nhịp năng lượng của mình, nhận ra lúc nên tiến lên, lúc cần chậm lại và dần buông bớt điều không nằm trong tầm tay.",
  combo_tro_ve: "Kết quả cho thấy bạn đang cần cả hai hướng: tìm lại sự vững vàng bên trong và hiểu nhịp điệu riêng của mình. Bộ đôi đi cùng bạn trọn hành trình, lại tiết kiệm hơn mua lẻ."
} as const;

export default function Home() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderItem | null>(null);
  const closeOrder = useCallback(() => setOrder(null), []);

  const answeredCount = Object.keys(answers).length;
  const results = useMemo(() => calculateResults(answers), [answers]);

  function chooseAnswer(questionId: number, optionIndex: number) {
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  }

  function handleQuizSubmit() {
    if (answeredCount !== QUIZ_QUESTIONS.length) return;
    setShowResults(true);
    window.setTimeout(() => {
      document.getElementById("quiz-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function restartQuiz() {
    setAnswers({});
    setShowResults(false);
    document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const recommendedIds = results.recommendedBookIds;
  const suggestedBooks: (typeof bookOrder)[number][] = recommendedIds.length
    ? bookOrder.filter((id) => recommendedIds.includes(id))
    : ["book_tinh_lang", "book_vu_tru"];

  const showCombo =
    results.exploratory ||
    (recommendedIds.includes("book_tinh_lang") && recommendedIds.includes("book_vu_tru"));
  const comboSaving =
    BOOKS.book_tinh_lang.launchPrice + BOOKS.book_vu_tru.launchPrice - BOOKS.combo_tro_ve.launchPrice;

  const orderBook = (id: (typeof bookOrder)[number]) =>
    setOrder({ title: BOOKS[id].title, price: BOOKS[id].launchPrice, code: BOOK_CODES[id] });

  const whyFor = (id: (typeof bookOrder)[number]) => {
    const dims = id === "combo_tro_ve" ? results.salient : results.salient.filter((d) => DIMENSIONS[d].bookId === id);
    return dims.map((d) => `“${DIMENSIONS[d].title.replace(/\.$/, "")}”`).join(" · ");
  };

  const renderComboCard = (second: boolean) => (
    <article className="result-combo">
      <div className="result-combo-covers">
        <BookCover variant="warm-coral" sizes="(max-width: 720px) 45vw, 140px" />
        <BookCover variant="teal" sizes="(max-width: 720px) 45vw, 140px" />
      </div>
      <div className="result-book-copy">
        <span className="book-kicker">{second ? "ĐI CẢ HAI HƯỚNG CÙNG LÚC" : "LỰA CHỌN PHÙ HỢP NHẤT VỚI BẠN"}</span>
        <h4>{BOOKS.combo_tro_ve.title}</h4>
        {!second && (
          <p className="result-why">
            {results.exploratory
              ? "Vì bạn đang quan tâm nhiều điều cùng lúc và chưa có nhu cầu nào nổi bật hơn hẳn."
              : `Vì kết quả của bạn: ${whyFor("combo_tro_ve")}`}
          </p>
        )}
        <p>{second ? BRIDGE_SECOND : results.exploratory ? BRIDGE_EXPLORE : BRIDGE.combo_tro_ve}</p>
        <div className="price-line">
          <strong>{money(BOOKS.combo_tro_ve.launchPrice)}</strong>
          <del>{money(BOOKS.combo_tro_ve.listPrice)}</del>
          <span className="save-badge">Tiết kiệm {money(comboSaving)} so với mua lẻ</span>
        </div>
        <div className="result-actions">
          <button type="button" className="button button-dark" onClick={() => orderBook("combo_tro_ve")}>Mua bộ đôi · {money(BOOKS.combo_tro_ve.launchPrice)} <span>→</span></button>
          <a className="button button-outline" href="#books">Xem chi tiết</a>
        </div>
      </div>
    </article>
  );

  const renderResultBook = (id: (typeof bookOrder)[number]) => {
    const book = BOOKS[id];
    const why = whyFor(id);
    return (
      <article className="result-book" key={id}>
        <BookCover variant={id === "book_vu_tru" ? "teal" : "warm-coral"} sizes="(max-width: 720px) 105px, 125px" />
        <div className="result-book-copy">
          <span className="book-kicker">EBOOK · THỰC HÀNH CÁ NHÂN</span>
          <h4>{book.title}</h4>
          {why && <p className="result-why">Vì kết quả của bạn: {why}</p>}
          <p>{why ? BRIDGE[id] : book.description}</p>
          <div className="price-line"><strong>{money(book.launchPrice)}</strong><del>{money(book.listPrice)}</del></div>
          <div className="result-actions">
            <button type="button" className="button button-dark" onClick={() => orderBook(id)}>Mua cuốn này · {money(book.launchPrice)} <span>→</span></button>
            <a className="button button-outline" href="#books">Xem chi tiết</a>
          </div>
        </div>
      </article>
    );
  };

  return (
    <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Trở về trang chủ">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
<Image 
  src="/logo-thanh-huong.png" 
  alt="Logo Thanh Hương" 
  width={40} 
  height={40} 
  style={{ objectFit: 'contain' }} 
/>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>TRỞ VỀ VỚI CHÍNH MÌNH</span>
        </div>
      </a>
        <nav>
          <a href="#quiz">Trắc nghiệm</a>
          <a href="#books">Hai cuốn sách</a>
          <a href="#how-to-buy">Cách mua</a>
          <a href="#about">Về tác giả</a>
        </nav>
        <a className="nav-cta" href="#quiz">Bắt đầu từ đây <span>↗</span></a>
      </header>

      <section className="hero section-wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> MỘT KHOẢNG DỪNG DÀNH CHO BẠN</p>
          <h1>Đôi khi, điều ta cần không phải là cố gắng hơn.<br /><em>Mà là lắng nghe mình rõ hơn.</em></h1>
          <p className="hero-lead">
            Một bài trắc nghiệm ngắn để bạn nhận diện điều mình đang cần — rồi chọn một điểm bắt đầu nhẹ nhàng, vừa với nhịp sống hiện tại.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#quiz">Khám phá nhu cầu của tôi <span>→</span></a>
            <span className="duration"><span className="clock-icon">◷</span> Khoảng 3–5 phút</span>
          </div>
          <div className="hero-note">
            <span className="note-line" />
            <p>Không có câu trả lời đúng hay sai.<br />Chỉ có điều đang thật sự diễn ra bên trong bạn.</p>
          </div>
        </div>
        <div className="hero-art" aria-label="Minh họa thiên nhiên tĩnh lặng">
          <div className="sun" />
          <div className="art-hill hill-back" />
          <div className="art-hill hill-front" />
          <div className="art-leaf leaf-one">✳</div>
          <div className="art-leaf leaf-two">✳</div>
          <div className="art-quote">“Trở về<br />với chính mình.”</div>
          <span className="art-caption">A GENTLE WAY BACK</span>
        </div>
      </section>

      <section className="intro-strip">
        <div className="intro-inner">
          <span className="tiny-sun">✳</span>
          <p>Bạn không cần phải hiểu hết mọi điều ngay hôm nay.<br /><strong>Chỉ cần bắt đầu bằng việc thành thật với chính mình.</strong></p>
          <span className="strip-signature">Thanh Hương</span>
        </div>
      </section>

      <section className="quiz-section section-wrap" id="quiz">
        <div className="section-heading">
          <p className="eyebrow">01 / LẮNG NGHE BÊN TRONG</p>
          <h2>Gần đây, <em>bạn đang cần điều gì?</em></h2>
          <p>Hãy chọn phương án gần với trải nghiệm của bạn nhất trong thời gian gần đây. Bạn có thể nhận ra nhiều nhu cầu cùng lúc.</p>
        </div>

        <div className="quiz-progress-wrap">
          <div className="quiz-progress-label"><span>Hành trình của bạn</span><strong>{answeredCount}/{QUIZ_QUESTIONS.length}</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${(answeredCount / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
        </div>

        <div className="questions-list">
          {QUIZ_QUESTIONS.map((question, questionIndex) => (
            <article className="question-card" key={question.id}>
              <div className="question-number">{String(questionIndex + 1).padStart(2, "0")}</div>
              <div className="question-content">
                <h3>{question.prompt}</h3>
                <div className="options-grid">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[question.id] === optionIndex;
                    return (
                      <button
                        type="button"
                        key={option.label}
                        className={`option ${selected ? "selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => chooseAnswer(question.id, optionIndex)}
                      >
                        <span className="option-radio">{selected ? "✓" : String.fromCharCode(65 + optionIndex)}</span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="quiz-submit-row">
          <p>{answeredCount === QUIZ_QUESTIONS.length ? "Bạn đã trả lời tất cả câu hỏi." : `Còn ${QUIZ_QUESTIONS.length - answeredCount} câu chưa trả lời.`}</p>
          <button className="button button-dark" onClick={handleQuizSubmit} disabled={answeredCount !== QUIZ_QUESTIONS.length}>
            Xem kết quả của tôi <span>→</span>
          </button>
        </div>

        {showResults && (
          <section className="results-panel" id="quiz-results" aria-live="polite" style={{ width: '100%', maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <div className="results-topline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="eyebrow" style={{ color: 'var(--muted)' }}>KẾT QUẢ CỦA BẠN</span>
              <button className="text-button" onClick={restartQuiz} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', textDecoration: 'underline' }}>Làm lại trắc nghiệm ↻</button>
            </div>
            
            {results.exploratory ? (
              /* --- GIAI ĐOẠN KHÁM PHÁ --- */
              <div className="explore-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{ color: 'var(--teal)', fontSize: '2rem' }}>Bạn chưa cần vội gọi tên điều mình đang cần.</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--ink)' }}>
                  “Có thể hiện tại bạn đang quan tâm đến nhiều điều, hoặc nhu cầu bên trong chưa thật sự nổi bật. Điều đó không có nghĩa là bạn thiếu định hướng. Bạn có thể bắt đầu bằng một khoảng lặng nhỏ, quan sát bản thân trong vài ngày và xem điều gì thường xuyên xuất hiện.”
                </p>
                <div style={{ background: 'var(--paper)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--warm-coral)' }}>
                  <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--warm-coral)' }}>Thực hành:</strong>
                  <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {`Trong ba ngày, mỗi tối dành vài phút ghi lại:
- Điều khiến tôi thấy nhẹ nhõm hôm nay.
- Điều khiến tôi cảm thấy gồng mình.
- Điều tôi muốn dành thêm thời gian lắng nghe.`}
                  </p>
                </div>
                <div style={{ marginTop: '10px', fontStyle: 'italic', color: 'var(--muted)' }}>
                  Sau đó, chọn cuốn sách phù hợp với điều bạn muốn khám phá trước tiên.
                </div>
              </div>
            ) : (
              /* --- KẾT QUẢ ĐÁP ÁN NHÓM NHIỀU NHU CẦU / NHU CẦU NỔI BẬT --- */
              <div className="need-grid" style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
                {results.salient.map((dimension: Dimension) => (
                  <article className="need-card" key={dimension} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--paper)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="need-score" style={{ background: 'var(--line)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>{results.scores[dimension]} điểm</span>
                    </div>
                    <h2 style={{ color: 'var(--warm-coral)', margin: '10px 0', fontSize: '1.8rem', lineHeight: '1.4' }}>{DIMENSIONS[dimension].title}</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic', color: 'var(--ink)' }}>{DIMENSIONS[dimension].description}</p>
                    
                    <div style={{ marginTop: '10px', padding: '16px', background: '#fcfbfa', borderRadius: '8px', borderLeft: '4px solid var(--teal)' }}>
                      <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--teal)' }}>Thực hành:</strong>
                      <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{DIMENSIONS[dimension].practice}</p>
                    </div>

                    <div style={{ marginTop: '10px', padding: '16px', background: '#fcfbfa', borderRadius: '8px', borderLeft: '4px solid var(--muted)' }}>
                      <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)' }}>Câu hỏi tự chiêm nghiệm:</strong>
                      <p style={{ lineHeight: '1.6', fontWeight: '500' }}>{DIMENSIONS[dimension].reflection}</p>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--muted)' }}>Sách bắt đầu gợi ý:</span>
                      <BookCover variant={DIMENSIONS[dimension].bookId === "book_vu_tru" ? "teal" : "warm-coral"} />
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="recommendation-heading">
              <p className="eyebrow">ĐIỂM BẮT ĐẦU GỢI Ý</p>
              <h3>
                {showCombo
                  ? results.exploratory
                    ? "Bạn đang quan tâm nhiều điều — bộ đôi giúp bạn khám phá cả hai hướng."
                    : "Bạn đang cần cả hai hướng — bộ đôi là điểm bắt đầu trọn vẹn nhất."
                  : suggestedBooks.length > 1
                    ? "Bạn có thể chọn một trong hai hướng — hoặc kết hợp cả hai."
                    : "Một cuốn sách để bắt đầu — hoặc đi cả hai hướng cùng lúc."}
              </h3>
            </div>

            {renderComboCard(!showCombo)}
            <p className="result-or"><span>{showCombo ? "Hoặc chọn từng cuốn" : "Hoặc bắt đầu với một cuốn"}</span></p>

            <div className="result-books">
              {suggestedBooks.map((id) => renderResultBook(id))}
            </div>
            <p className="result-disclaimer">Kết quả chỉ mang tính gợi mở để tự quan sát, không phải đánh giá tâm lý hay lời khuyên chuyên môn.</p>
          </section>
        )}
      </section>
  
      <section className="books-section" id="books">
        <div className="section-wrap">
          <div className="section-heading centered">
            <p className="eyebrow">02 / HAI ĐIỂM BẮT ĐẦU</p>
            <h2>Mỗi người có một cánh cửa riêng <em>để trở về.</em></h2>
            <p>Không cần đọc thật nhanh. Hãy chọn cuốn sách gần với điều bạn đang cần, rồi thực hành từng chút một.</p>
          </div>

          <div className="combo-card">
            <div className="combo-symbol">✳</div>
            <div className="combo-copy">
              <span className="book-kicker">DÀNH CHO BẠN MUỐN ĐI CẢ HAI HƯỚNG</span>
              <h3>{BOOKS.combo_tro_ve.title}</h3>
              <p>{BOOKS.combo_tro_ve.description}</p>
              <p className="combo-bonus">Gồm cả bài tập thiền đi kèm Sổ tay vũ trụ cá nhân: <a href={BOOKS.book_vu_tru.meditationUrl} target="_blank" rel="noopener noreferrer">{BOOKS.book_vu_tru.meditationTitle} ↗</a></p>
            </div>
            <div className="combo-price">
              <strong>{money(BOOKS.combo_tro_ve.launchPrice)}</strong>
              <del>{money(BOOKS.combo_tro_ve.listPrice)}</del>
              <span>Giá ra mắt · tiết kiệm {money(BOOKS.book_tinh_lang.launchPrice + BOOKS.book_vu_tru.launchPrice - BOOKS.combo_tro_ve.launchPrice)} so với mua lẻ</span>
            </div>
            <button type="button" className="button button-light" onClick={() => setOrder({ title: BOOKS.combo_tro_ve.title, price: BOOKS.combo_tro_ve.launchPrice, code: "BODOI" })}>Mua bộ đôi <span>→</span></button>
          </div>
          <div className="books-grid">
            <BookCard
              variant="clay"
              number="01"
              title={BOOKS.book_tinh_lang.title}
              subtitle={BOOKS.book_tinh_lang.subtitle}
              description={BOOKS.book_tinh_lang.description}
              bullets={[...BOOKS.book_tinh_lang.bullets]}
              listPrice={BOOKS.book_tinh_lang.listPrice}
              launchPrice={BOOKS.book_tinh_lang.launchPrice}
              cta="Tôi muốn bắt đầu từ sự tĩnh lặng"
              onOrder={() => setOrder({ title: BOOKS.book_tinh_lang.title, price: BOOKS.book_tinh_lang.launchPrice, code: "BLTL" })}
            />
            <BookCard
              variant="green"
              number="02"
              title={BOOKS.book_vu_tru.title}
              subtitle={BOOKS.book_vu_tru.subtitle}
              description={BOOKS.book_vu_tru.description}
              bullets={[...BOOKS.book_vu_tru.bullets]}
              listPrice={BOOKS.book_vu_tru.listPrice}
              launchPrice={BOOKS.book_vu_tru.launchPrice}
              cta="Tôi muốn lắng nghe nhịp điệu riêng"
              bonusUrl={BOOKS.book_vu_tru.meditationUrl}
              bonusTitle={BOOKS.book_vu_tru.meditationTitle}
              onOrder={() => setOrder({ title: BOOKS.book_vu_tru.title, price: BOOKS.book_vu_tru.launchPrice, code: "STVT" })}
            />
          </div>
          <div className="buy-steps" id="how-to-buy">
            <h3>Cách mua rất đơn giản</h3>
            <div className="buy-steps-grid">
              <div><span>1</span><p><strong>Chọn sách</strong>Bấm nút mua ở cuốn bạn muốn.</p></div>
              <div><span>2</span><p><strong>Nhập tên, số điện thoại và quét QR</strong>Mã QR đã điền sẵn số tiền và nội dung.</p></div>
              <div><span>3</span><p><strong>Bấm “Tôi đã chuyển khoản”</strong>Gửi ảnh chuyển khoản qua Zalo hoặc Messenger, nhận file ebook trong ngày thanh toán.</p></div>
            </div>
            <p className="policy-note"><strong>Chính sách:</strong> hoàn tiền nếu bạn không đọc được sách. Vui lòng không chia sẻ file cho người khác.</p>
          </div>
        </div>
      </section>

      <section className="how-section section-wrap">
        <div className="how-intro">
          <p className="eyebrow">03 / ĐỌC VÀ THỰC HÀNH</p>
          <h2>Không phải để trở thành một ai khác.<br /><em>Mà để hiểu mình hơn một chút.</em></h2>
        </div>
        <div className="steps">
          <div className="step"><span>01</span><div><h3>Đọc chậm</h3><p>Chọn một đoạn khiến bạn dừng lại. Không cần cố ghi nhớ tất cả.</p></div></div>
          <div className="step"><span>02</span><div><h3>Quan sát thật</h3><p>Để ý cảm xúc, suy nghĩ và nhịp năng lượng của mình trong đời sống thường ngày.</p></div></div>
          <div className="step"><span>03</span><div><h3>Thực hành nhỏ</h3><p>Dành một khoảng thời gian vừa sức, rồi để trải nghiệm của chính bạn lên tiếng.</p></div></div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-wrap about-inner">
        <div className="about-logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image 
            src="/logo-thanh-huong.png" 
            alt="Logo Thanh Hương" 
            width={160} 
            height={160} 
            style={{ objectFit: 'contain' }} 
          />
        </div>
        <div className="about-copy">
          <p className="eyebrow">04 / ĐÔI LỜI TỪ THANH HƯƠNG</p>
          <h2>
            Tôi không có câu trả lời thay bạn.<br />
            <em style={{ color: 'var(--warm-coral)', fontStyle: 'normal' }}>Tôi tin bạn có thể lắng nghe mình.</em>
          </h2>
            <p>Tôi tạo ra những tài liệu và không gian thực hành này như một lời mời trở về: chậm lại, quan sát và thành thật hơn với những gì đang diễn ra bên trong. Bạn không cần phải thay đổi tất cả trong một ngày. Đôi khi, một câu hỏi đúng lúc cũng đủ mở ra một hướng nhìn mới.</p>
            <p className="signature">Thanh Hương <span>— Người đồng hành tâm thức</span></p>
          </div>
        </div>
      </section>

      <section className="faq-section section-wrap">
        <div className="section-heading">
          <p className="eyebrow">05 / CÂU HỎI THƯỜNG GẶP</p>
          <h2>Một vài điều bạn có thể <em>đang tự hỏi.</em></h2>
        </div>
        <div className="faq-list">
          <details><summary>Bài trắc nghiệm có đánh giá tính cách của tôi không?</summary><p>Không. Đây là công cụ tự phản chiếu nhẹ nhàng dựa trên câu trả lời của bạn, không phải bài đánh giá tâm lý hay chẩn đoán.</p></details>
          <details><summary>Tôi có thể có nhiều nhu cầu nổi bật cùng lúc không?</summary><p>Có. Bạn có thể thấy nhiều nhu cầu cùng nổi bật, và kết quả sẽ gợi ý hướng phù hợp với từng nhu cầu. Bạn không bị ép vào một kiểu duy nhất.</p></details>
          <details><summary>Tôi nên bắt đầu với cuốn nào?</summary><p>Hãy tham khảo phần kết quả, đọc mô tả hai cuốn sách và chọn hướng khiến bạn cảm thấy phù hợp nhất lúc này. Nếu chưa rõ, bạn có thể bắt đầu với một cuốn hoặc xem bộ đôi như một lựa chọn mở rộng.</p></details>
          <details><summary>Làm thế nào để mua và nhận ebook?</summary><p>Bấm nút mua ở cuốn bạn chọn, nhập họ tên và số điện thoại, quét mã QR để chuyển khoản, rồi bấm “Tôi đã chuyển khoản” để báo cho Thanh Hương qua Zalo hoặc Messenger kèm ảnh chuyển khoản. Bạn sẽ nhận file ebook trong ngày thanh toán.</p></details>
          <details><summary>Nếu tôi không đọc được sách thì sao?</summary><p>Bạn cứ nhắn cho Thanh Hương qua Zalo hoặc Messenger. Nếu vẫn không đọc được sách, bạn sẽ được hoàn tiền.</p></details>
          <details><summary>Tôi có thể chia sẻ file cho bạn bè không?</summary><p>Vui lòng không chia sẻ file. Nếu bạn muốn tặng sách cho người thân, hãy nhắn Thanh Hương để được hỗ trợ.</p></details>
        </div>
      </section>

      <section className="closing-section" id="contact">
        <div className="closing-flower">✳</div>
        <p className="eyebrow">MỘT LỜI MỜI NHẸ NHÀNG</p>
        <h2>Bạn có thể bắt đầu<br /><em>ngay từ nơi mình đang đứng.</em></h2>
        <p>Không cần phải biết hết con đường. Chỉ cần sẵn lòng lắng nghe bước kế tiếp.</p>
        <a className="button button-light" href="#quiz">Làm bài trắc nghiệm <span>→</span></a>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top"><span className="brand-mark">H</span><span><strong>Thanh Hương</strong><small>TRỞ VỀ VỚI CHÍNH MÌNH</small></span></a>
        <p>© {new Date().getFullYear()} Thanh Hương · Một không gian để lắng nghe chính mình.</p>
        <a href="#top">Lên đầu trang ↑</a>
      </footer>
      <FloatingContact />
      <OrderModal item={order} onClose={closeOrder} />
    </main>
  );
}

function BookCover({ variant, sizes = "280px" }: { variant: "warm-coral" | "teal"; sizes?: string }) {
  return (
    <div style={{ width: '100%', maxWidth: '280px', minWidth: 0, margin: '0 auto' }}>
      <Image
        src={variant === "warm-coral" ? "/bia-ban-linh-tinh-lang.jpg" : "/bia-so-tay-vu-tru.jpg"}
        alt={variant === "warm-coral" ? "Bìa sách Bản lĩnh tĩnh lặng" : "Bìa sách Sổ tay vũ trụ cá nhân"}
        width={280}
        height={400}
        sizes={sizes}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}
      />
    </div>
  );
}

function BookCard({
  variant, number, title, subtitle, description, bullets, listPrice, launchPrice, cta, bonusUrl, bonusTitle, onOrder
}: {
  variant: "clay" | "green";
  number: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  listPrice: number;
  launchPrice: number;
  cta: string;
  bonusUrl?: string;
  bonusTitle?: string;
  onOrder: () => void;
}) {
  return (
    <article className="book-card">
      <div className="book-card-top">
        <span className="book-number">{number} / EBOOK</span>
        <BookCover variant={variant === "clay" ? "warm-coral" : "teal"} />
      </div>
      <div className="book-card-content">
        <h3>{title}</h3>
        <p className="book-subtitle">{subtitle}</p>
        <p className="book-description">{description}</p>
        <ul>{bullets.map((bullet) => <li key={bullet}><span>✓</span>{bullet}</li>)}</ul>
        {bonusUrl && bonusTitle && (
          <p className="book-bonus">Kèm bài tập thiền: <a href={bonusUrl} target="_blank" rel="noopener noreferrer">{bonusTitle} ↗</a></p>
        )}
        <div className="book-price-row"><div><strong>{money(launchPrice)}</strong><del>{money(listPrice)}</del></div><span>Giá ra mắt</span></div>
        <div className="book-card-actions">
          <button type="button" className="button button-dark" onClick={onOrder}>{cta} <span>→</span></button>
        </div>
        <p className="book-delivery">Nhận file ebook trong ngày thanh toán.</p>
      </div>
    </article>
  );
}

/* Ảnh QR chuyển khoản ACB được nhúng sẵn trong code, không cần thêm file ảnh */
const QR_DATA_URI = "data:image/jpeg;base64,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7CBv2+RWpQMx3O8mx6w6eWBtFidnuLbtdK6KgNNDNLGD1UTNwC9253J8iz85ocCCAQe0LhjGsaGsaGtHYANgEyYctXKIoyEREBERAREQEREBERAREQEREBERAREQEREBU6jxR/fvVRU6jxR/fvQVAiBESAqlTeL9s/CqpVKm8X7Z+FBVRERRERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFTqPFH9+9VF0qPFFB3CIERICqdP4v2z8KqKhA15ZyfsNzy29dBXRdOB/p04H+nRXdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd0XTgf6dOB/p0HdF04H+nTgf6dB3RdOB/p04H+nQd10n8U78ycD/TqnO14iJLyfWQVx2Ig7EQCqVN4v2z8KqlUqbxftn4URVRERRERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFTqPFH9+9VFTqPFH9+9BUCIEQCqVN4v2z8KqlUqbxftn4URVRERRERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFTqPFH9+9VFTqPFH9+9BUCIERICqVN4v2z8KqlUqbxftn4UFVERFEREBERAREQEREBERAREQETddXSNaCSdgO0lB2RdWva7YtO4I33C5LgEyOUVMTMLi0H0Q7RvzCqAgoCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAi4357Ln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";
