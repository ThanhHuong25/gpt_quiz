"use client";

import Image from 'next/image';
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
              <span className="eyebrow" style={{ color: 'var(--muted)' }}>02 / ĐIỀU BẠN ĐANG CẦN</span>
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
                    Trong ba ngày, mỗi tối dành vài phút ghi lại:\n- Điều khiến tôi thấy nhẹ nhõm hôm nay.\n- Điều khiến tôi cảm thấy gồng mình.\n- Điều tôi muốn dành thêm thời gian lắng nghe.
                  </p>
                </div>
                <div style={{ marginTop: '10px', fontStyle: 'italic', color: 'var(--muted)' }}>
                  Sau đó, chọn cuốn sách phù hợp với điều bạn muốn khám phá trước tiên.
                </div>
              </div>
            ) : (
              /* --- KẾT QUẢ ĐÁP ÁN NHÓM NHIỀU NHU CẦU / NHU CẦU NỔI BẬT --- */
              <div className="need-grid" style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
                {results.salient.map((dimension: string) => (
                  <article className="need-card" key={dimension} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--paper)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="need-score" style={{ background: 'var(--line)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>{results.scores[dimension]} điểm</span>
                    </div>
                    <h2 style={{ color: 'var(--warm-coral)', margin: '10px 0', fontSize: '1.8rem', lineHeight: '1.4' }}>{DIMENSIONS[dimension].title}</h2>
