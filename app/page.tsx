"use client";

import { useMemo, useState } from "react";
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

const bookOrder = ["book_tinh_lang", "book_vu_tru", "combo_tro_ve"] as const;

export default function Home() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");

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
  const suggestedBooks = recommendedIds.length
    ? bookOrder.filter((id) => recommendedIds.includes(id))
    : ["book_tinh_lang", "book_vu_tru"] as const;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label=<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <img 
    src="/logo-thanh-huong.png" 
    alt="Logo Thanh Hương" 
    style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
  />
  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>TRỞ VỀ VỚI CHÍNH MÌNH</span>
</div>>
          <span className="brand-mark">H</span>
          <span>
            <strong>Thanh Hương</strong>
            <small>TRỞ VỀ VỚI CHÍNH MÌNH</small>
          </span>
        </a>
        <nav>
          <a href="#quiz">Trắc nghiệm</a>
          <a href="#books">Hai cuốn sách</a>
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
          <div className="art-quote">“Trở về<br />với mình.”</div>
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
          <section className="results-panel" id="quiz-results" aria-live="polite">
            <div className="results-topline"><span className="eyebrow">02 / ĐIỀU BẠN ĐANG CẦN</span><button className="text-button" onClick={restartQuiz}>Làm lại trắc nghiệm ↻</button></div>
            <h2>{results.exploratory ? "Bạn đang ở giai đoạn khám phá." : "Có hơn một nhu cầu đang cần được lắng nghe."}</h2>
            <p className="results-intro">
              {results.exploratory
                ? "Kết quả hiện chưa cho thấy một nhu cầu nổi bật rõ ràng. Điều đó không có nghĩa là bạn không có nhu cầu — có thể bạn đang ở giai đoạn tìm hiểu và quan sát chính mình."
                : "Những gợi ý dưới đây không phải nhãn dán hay kết luận về con người bạn. Hãy xem chúng như một tấm gương nhỏ để bạn tự cảm nhận điều nào đang phù hợp."}
            </p>

            {results.salient.length > 0 ? (
              <div className="need-grid">
                {results.salient.map((dimension: Dimension) => (
                  <article className="need-card" key={dimension}>
                    <span className="need-score">{results.scores[dimension]} điểm</span>
                    <h3>{DIMENSIONS[dimension].title}</h3>
                    <p>{DIMENSIONS[dimension].description}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="explore-note"><span>✳</span><p>Có thể bắt đầu bằng một bài thực hành ngắn: dành vài phút mỗi ngày để ghi lại cảm xúc, năng lượng và điều bạn thật sự cần — chưa cần vội thay đổi điều gì.</p></div>
            )}

            <div className="recommendation-heading">
              <p className="eyebrow">03 / ĐIỂM BẮT ĐẦU GỢI Ý</p>
              <h3>{suggestedBooks.length > 1 ? "Bạn có thể chọn một trong hai hướng — hoặc kết hợp cả hai." : "Một cuốn sách để bắt đầu hành trình."}</h3>
            </div>
            <div className="result-books">
              {suggestedBooks.map((id) => {
                const book = BOOKS[id];
                return (
                  <article className="result-book" key={id}>
                    <BookCover variant={id === "book_vu_tru" ? "green" : "clay"} />
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
            <p className="eyebrow">04 / HAI ĐIỂM BẮT ĐẦU</p>
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
            />
          </div>
          <div className="combo-card">
            <div className="combo-symbol">✳</div>
            <div className="combo-copy">
              <span className="book-kicker">DÀNH CHO BẠN MUỐN ĐI CẢ HAI HƯỚNG</span>
              <h3>{BOOKS.combo_tro_ve.title}</h3>
              <p>{BOOKS.combo_tro_ve.description} Có kèm gợi ý thiền YouTube “Lắng nghe nhịp điệu bên trong” khi đường dẫn được bổ sung.</p>
            </div>
            <div className="combo-price">
              <strong>{money(BOOKS.combo_tro_ve.launchPrice)}</strong>
              <del>{money(BOOKS.combo_tro_ve.listPrice)}</del>
              <span>Giá ra mắt dự kiến</span>
            </div>
            <a className="button button-light" href="#contact">Quan tâm bộ đôi <span>→</span></a>
          </div>
          <p className="pricing-note">Giá ra mắt dự kiến, có thể điều chỉnh trước khi mở bán chính thức. Các nút mua hàng hiện là vị trí chờ tích hợp thanh toán.</p>
        </div>
      </section>

      <section className="how-section section-wrap">
        <div className="how-intro">
          <p className="eyebrow">05 / ĐỌC VÀ THỰC HÀNH</p>
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
          <div className="about-mark">H<span>✳</span></div>
          <div className="about-copy">
            <p className="eyebrow">06 / ĐÔI LỜI TỪ THANH HƯƠNG</p>
            <h2>Tôi không có câu trả lời thay bạn.<br /><em>Tôi tin bạn có thể lắng nghe mình.</em></h2>
            <p>Tôi tạo ra những tài liệu và không gian thực hành này như một lời mời trở về: chậm lại, quan sát và thành thật hơn với những gì đang diễn ra bên trong. Bạn không cần phải thay đổi tất cả trong một ngày. Đôi khi, một câu hỏi đúng lúc cũng đủ mở ra một hướng nhìn mới.</p>
            <p className="signature">Thanh Hương <span>— SoulCoach</span></p>
          </div>
        </div>
      </section>

      <section className="faq-section section-wrap">
        <div className="section-heading">
          <p className="eyebrow">07 / CÂU HỎI THƯỜNG GẶP</p>
          <h2>Một vài điều bạn có thể <em>đang tự hỏi.</em></h2>
        </div>
        <div className="faq-list">
          <details><summary>Bài trắc nghiệm có đánh giá tính cách của tôi không?</summary><p>Không. Đây là công cụ tự phản chiếu nhẹ nhàng dựa trên câu trả lời của bạn, không phải bài đánh giá tâm lý hay chẩn đoán.</p></details>
          <details><summary>Tôi có thể có nhiều nhu cầu nổi bật cùng lúc không?</summary><p>Có. Hệ thống cho phép nhiều nhóm nhu cầu cùng nổi bật nếu điểm của từng nhóm đạt ngưỡng đã thiết lập. Kết quả không ép bạn vào một kiểu duy nhất.</p></details>
          <details><summary>Tôi nên bắt đầu với cuốn nào?</summary><p>Hãy tham khảo phần kết quả, đọc mô tả hai cuốn sách và chọn hướng khiến bạn cảm thấy phù hợp nhất lúc này. Nếu chưa rõ, bạn có thể bắt đầu với một cuốn hoặc xem bộ đôi như một lựa chọn mở rộng.</p></details>
          <details><summary>Làm thế nào để nhận ebook sau khi mua?</summary><p>Phần thanh toán và gửi ebook chưa được kết nối trong phiên bản này. Trước khi mở bán, cần bổ sung phương thức thanh toán, email nhận đơn và cơ chế gửi file an toàn.</p></details>
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
    </main>
  );
}

function BookCover({ variant }: { variant: "clay" | "green" }) {
  return (
    <div className={`book-cover ${variant}`}>
      <div className="cover-orbit orbit-one" />
      <div className="cover-orbit orbit-two" />
      <span className="cover-small">THANH HƯƠNG · THỰC HÀNH NỘI TÂM</span>
      <span className="cover-title">{variant === "clay" ? "Bản lĩnh\n tĩnh lặng" : "Sổ tay\n vũ trụ cá nhân"}</span>
      <span className="cover-plant">✳</span>
      <span className="cover-bottom">TRỞ VỀ VỚI CHÍNH MÌNH</span>
    </div>
  );
}

function BookCard({
  variant, number, title, subtitle, description, bullets, listPrice, launchPrice, cta
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
}) {
  return (
    <article className="book-card">
      <div className="book-card-top">
        <span className="book-number">{number} / EBOOK</span>
        <BookCover variant={variant} />
      </div>
      <div className="book-card-content">
        <h3>{title}</h3>
        <p className="book-subtitle">{subtitle}</p>
        <p className="book-description">{description}</p>
        <ul>{bullets.map((bullet) => <li key={bullet}><span>✓</span>{bullet}</li>)}</ul>
        <div className="book-price-row"><div><strong>{money(launchPrice)}</strong><del>{money(listPrice)}</del></div><span>Giá ra mắt</span></div>
        <a className="button button-outline" href="#contact">{cta} <span>→</span></a>
      </div>
    </article>
  );
}
