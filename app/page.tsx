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

function OrderModal({ item, onClose }: { item: OrderItem | null; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    setCopied(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const message = `Chào Thanh Hương, mình đã chuyển khoản ${money(item.price)} mua ${item.title}. Mình gửi ảnh chuyển khoản, nhờ bạn gửi file giúp mình nhé.`;
  const note = `${item.code} + họ tên của bạn`;

  function copy(text: string, key: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => setCopied(key)).catch(() => setCopied(null));
    }
  }

  function contact(url: string) {
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

        <p className="order-step-title"><span>1</span> Quét mã hoặc chuyển khoản</p>
        <div className="order-qr">
          <Image src="/qr-bank.jpg" alt={`Mã QR chuyển khoản ${BANK.bankName} - ${BANK.accountName}`} width={640} height={773} sizes="240px" />
        </div>
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
          <div><dt>Nội dung</dt><dd>{note}</dd></div>
        </dl>

        <p className="order-step-title"><span>2</span> Gửi ảnh chuyển khoản để nhận file</p>
        <p className="order-hint">Sau khi chuyển khoản, nhắn cho Thanh Hương kèm ảnh chụp màn hình. Bạn sẽ nhận file ebook <strong>trong ngày thanh toán</strong>. Tin nhắn mẫu đã được sao chép sẵn, bạn chỉ cần dán và gửi.</p>
        <div className="order-actions">
          <button type="button" className="button button-dark" onClick={() => contact(ZALO_URL)}>Gửi qua Zalo <span>→</span></button>
          <button type="button" className="button button-outline" onClick={() => contact(MESSENGER_URL)}>Gửi qua Messenger <span>→</span></button>
        </div>
        {copied === "message" && <p className="order-copied" aria-live="polite">✓ Đã sao chép tin nhắn. Hãy dán vào khung chat.</p>}

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
              <h3>{suggestedBooks.length > 1 ? "Bạn có thể chọn một trong hai hướng — hoặc kết hợp cả hai." : "Một cuốn sách để bắt đầu hành trình."}</h3>
            </div>
            <div className="result-books">
              {suggestedBooks.map((id) => {
                const book = BOOKS[id as keyof typeof BOOKS];
                return (
                  <article className="result-book" key={id}>
                    <BookCover variant={id === "book_vu_tru" ? "teal" : "warm-coral"} sizes="(max-width: 720px) 105px, 125px" />
                    <div className="result-book-copy">
                      <span className="book-kicker">EBOOK · THỰC HÀNH CÁ NHÂN</span>
                      <h4>{book.title}</h4>
                      <p>{book.description}</p>
                      <div className="price-line"><strong>{money(book.launchPrice)}</strong><del>{money(book.listPrice)}</del></div>
                      <a className="button button-outline" href="#books">Tìm hiểu cuốn sách <span>→</span></a>
                    </div>
                  </article>
                );
              })}
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
              previewUrl={BOOKS.book_tinh_lang.previewUrl}
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
              previewUrl={BOOKS.book_vu_tru.previewUrl}
              bonusUrl={BOOKS.book_vu_tru.meditationUrl}
              bonusTitle={BOOKS.book_vu_tru.meditationTitle}
              onOrder={() => setOrder({ title: BOOKS.book_vu_tru.title, price: BOOKS.book_vu_tru.launchPrice, code: "STVT" })}
            />
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
          <div className="buy-steps" id="how-to-buy">
            <h3>Cách mua rất đơn giản</h3>
            <div className="buy-steps-grid">
              <div><span>1</span><p><strong>Chọn sách</strong>Bấm nút mua ở cuốn bạn muốn.</p></div>
              <div><span>2</span><p><strong>Quét mã QR chuyển khoản</strong>Chuyển đúng số tiền hiển thị trong hộp thanh toán.</p></div>
              <div><span>3</span><p><strong>Gửi ảnh chuyển khoản</strong>Nhắn qua Zalo hoặc Messenger, nhận file ebook trong ngày thanh toán.</p></div>
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
          <details><summary>Làm thế nào để mua và nhận ebook?</summary><p>Bấm nút mua ở cuốn bạn chọn, quét mã QR để chuyển khoản, rồi gửi ảnh chuyển khoản qua Zalo hoặc Messenger của Thanh Hương. Bạn sẽ nhận file ebook trong ngày thanh toán.</p></details>
          <details><summary>Tôi có thể đọc thử trước khi mua không?</summary><p>Có. Mỗi cuốn đều có nút “Đọc thử” để bạn xem trước một phần nội dung.</p></details>
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
  variant, number, title, subtitle, description, bullets, listPrice, launchPrice, cta, previewUrl, bonusUrl, bonusTitle, onOrder
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
  previewUrl: string;
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
          <a className="button button-outline" href={previewUrl} target="_blank" rel="noopener noreferrer">Đọc thử <span>↗</span></a>
        </div>
        <p className="book-delivery">Nhận file ebook trong ngày thanh toán.</p>
      </div>
    </article>
  );
}
