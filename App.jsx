import { useState, useEffect, useRef } from "react";

/* ============================================================
   حكاوي — موقع قصص رعب بالعامية المصرية لـ أمير جلال
   ============================================================

   نظام التصميم (Design Tokens):
   --------------------------------
   الألوان:
     --bone:      #D4C5A8   نص أساسي (لون العظم القديم)
     --void:      #14100D   خلفية أساسية (أسود محروق)
     --rust:      #6E1F1A   الدم الجاف — اللون الوحيد الجريء، يُستخدم بحذر شديد
     --candle:    #C9A227   لهب الشمعة الباهت — للتفاصيل والحدود
     --ash:       #2A241E   خلفية ثانوية / كروت
     --smoke:     #8A7F6E   نص ثانوي خافت

   الخطوط:
     العنوان: "Reem Kufi" — خط كوفي عربي حاد الزوايا، نطبق عليه تشويه يدوي بسيط (letter-spacing سالب + ظل مزدوج) يحاكي الحبر المتآكل
     النص:    "Noto Kufi Arabic" / "Tajawal" — وضوح قرائي للقصص الطويلة
     UI/تسميات: نفس Tajawal بحجم أصغر وتباعد حروف موجب

   التوقيع البصري:
     "الصفحة الممزوقة" — عند فتح أي قصة، شريط تمزّق ورقي (SVG) يتحرك عرضيًا فوق المحتوى قبل ظهوره،
     كأن صفحة كتاب قديم بتُمزّق لتكشف عن النص. نفس الفكرة تتكرر بشكل أهدأ في الفواصل بين الأقسام.
   ============================================================ */

// ---------- بيانات تجريبية (نماذج) ----------
const SAMPLE_STORIES = [
  {
    id: "1",
    title: "اللى بيقرع الباب التالت",
    excerpt:
      "أول قرعتين بيرد عليهم أي واحد. التالتة لازم ترد عليها انت بس. ولو فتحت قبل ما حد يقول اسمك... مبقاش انت اللي هيفتح.",
    body: `سمعت الطرقة الأولى وأنا بغسل الصحون. حاجة عادية، جيران أو ساعي بريد. مسحت إيدي وفتحت، مكنش فيه حد.

رجعت للمطبخ، وبعد دقيقتين بالضبط — مش تقريبًا، بالضبط — سمعت الطرقة الثانية. نفس العدد، نفس القوة، نفس النقطة في الباب. هنا بس بدأت إيدي ترعش.

جدتي كانت دايمًا تقول جملة واحدة عن البيت القديم ده: "التالتة متفتحهاش غير لو عرفت مين قدامك، وما تعرفش غير لو سمعت صوته يقول اسمك."

ماكنتش فاكر الكلام ده وأنا بقرب من الباب للمرة الثالثة. حطيت إيدي على المقبض، وقلبي بيدق أعلى من أي طرقة. وفجأة، صوت من جوه، من ورايا، فاكر اسمي بالكامل — اسم الميلاد اللي ماكنش يعرفه غير أهلي.

ولسه باب بيتنا مقفول لحد دلوقتي. مفتاحه عندي. بس مش أنا اللي بيفتحه بالليل.`,
    fearRating: 4.2,
    ratingsCount: 311,
    date: "2026-05-12",
    readTime: "٦ دقايق",
  },
  {
    id: "2",
    title: "الراكب اللي مدفعش التذكرة",
    excerpt:
      "كل ميكروباص بياخد طريق المقابر بليل، فيه راكب مايدفعش، وما ينزلش، وما يتكلمش. السواقين يعرفوه. الركاب لأ.",
    body: `كنت راجع من شغلي الساعة ٢ بالليل، والميكروباص الوحيد المتاح كان رايح طريق المقابر. السواق قالي "اقعد قدام" بنغمة غريبة، كإنه بيحاول يحميني من حاجة.

بعد المنحنى التالت، حد طلع من العربية اللي وراني وقعد في الكرسي الأخير. ماسمعتش باب يتفتح. السواق بصلي في المراية وهز راسه يعني "ما تتكلمش".

طول الطريق، ماحدش طلب يدفع. ماحدش اتكلم. كنت بس حاسس بريحة تراب رطب جاية من ورايا، وكل ما أحاول أبص في المراية، حاجة جواي تقولي لأ.

نزلت قبل محطتي بشارعين، مشيت الباقي. السواق صرخلي ورايا: "كويس عملت. ده مكانش راكب أصلا. ده بس بيحب يوصل لحد الآخر."`,
    fearRating: 3.8,
    ratingsCount: 198,
    date: "2026-05-28",
    readTime: "٤ دقايق",
  },
  {
    id: "3",
    title: "صورة العيلة الناقصة",
    excerpt:
      "كل سنة، صورة العيلة على الحيطة بتتغير شخص واحد فيها. ومافيش حد بيلاحظ غير اللي هيختفي السنة الجاية.",
    body: `صورة جدي وجدتي وأولادهم الخمسة، معلقة في الصالة من ١٩٧٨. كل عيد، كل العيلة تتجمع تحتها وتتصور صورة جديدة، نفس الترتيب، نفس المكان.

اكتشفت الموضوع وأنا باجمع صور قديمة لألبوم. صورة ١٩٩٠ فيها ٦ أشخاص. صورة ١٩٩١ فيها ٥. مفيش جنازة، مفيش خبر وفاة، الراجل اللي كان واقف في الطرف يمين — عمي رفعت — اختفى من كل الصور اللي بعدها، وكمان من كلام العيلة عنه. لو سألت أي حد "فين عمي رفعت؟"، يبصلك ببلاهة ويقول "مين؟"

قارنت كل صورة بالتالية، سنة بسنة. في كل مرة، شخص واحد بيختفي من الصورة الجديدة، وبيختفي من الذكريات كمان، إلا أنا. أنا بس اللي فاكر اللي اختفوا.

السنة دي، صورة العيد الجاية هتتصور الأسبوع القادم. وأنا واقف في نفس الطرف اللي كان واقف فيه عمي رفعت.`,
    fearRating: 4.6,
    ratingsCount: 422,
    date: "2026-06-03",
    readTime: "٥ دقايق",
  },
];

const SAMPLE_COMMENTS = {
  "1": [
    { id: "c1", name: "هدير .م", text: "قرأتها بليل غلطة كبيرة 😭 مش هقدر أنام", date: "منذ يومين" },
    { id: "c2", name: "كريم عبدالله", text: "جملة الجدة دي فضلت في دماغي. تحفة يا أمير", date: "منذ ٥ أيام" },
  ],
  "2": [{ id: "c3", name: "زائر مجهول", text: "ركبت ميكروباص امبارح وقعدت قدام لوحدي 💀", date: "منذ ٣ أيام" }],
  "3": [],
};

// ---------- خط مخصص متآكل للعناوين (CSS-only) ----------
const torndEdgeFilter = (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id="torn-paper">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.4" numOctaves="2" result="noise" seed="7" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="ink-bleed">
      <feGaussianBlur stdDeviation="0.4" />
    </filter>
  </svg>
);

// ---------- مكوّن: شريط التمزّق الانتقالي ----------
function TornReveal({ active, onDone }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [active, onDone]);

  if (!active) return null;
  return (
    <div className="torn-reveal" aria-hidden="true">
      <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="torn-svg">
        <path
          d="M0,50 Q60,10 120,55 T240,40 T360,60 T480,30 T600,55 T720,35 T840,58 T960,28 T1080,52 T1200,45 V100 H0 Z"
          fill="#14100D"
        />
      </svg>
    </div>
  );
}

// ---------- مكوّن: تقييم الخوف (نجوم جمجمة) ----------
function FearRating({ value, count, onRate, userRated }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="fear-rating">
      <span className="fear-rating__label">معدل الرعب</span>
      <div className="fear-rating__skulls" role="group" aria-label="قيّم مستوى الخوف من ١ لـ ٥">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`skull-btn ${(hover || Math.round(value)) >= n ? "skull-btn--lit" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate(n)}
            aria-label={`${n} من ٥`}
            disabled={userRated}
          >
            💀
          </button>
        ))}
      </div>
      <span className="fear-rating__count">
        {value.toFixed(1)} من ٥ — {count} صوت
      </span>
    </div>
  );
}

// ---------- مكوّن: قسم التعليقات ----------
function CommentsSection({ storyId, initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function submitComment(e) {
    e.preventDefault();
    if (!text.trim()) {
      setError("اكتب تعليقك الأول.");
      return;
    }
    const newComment = {
      id: `c-${Date.now()}`,
      name: name.trim() || "زائر مجهول",
      text: text.trim(),
      date: "الآن",
    };
    setComments([newComment, ...comments]);
    setText("");
    setName("");
    setError("");
  }

  return (
    <section className="comments" aria-label="التعليقات">
      <h3 className="comments__title">
        <span>الهمسات تحت القصة</span>
        <span className="comments__count">({comments.length})</span>
      </h3>

      <form className="comments__form" onSubmit={submitComment}>
        <input
          type="text"
          placeholder="اسمك (اختياري)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="comments__input"
          maxLength={40}
        />
        <textarea
          placeholder="شاركنا رأيك... أو خوفك."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="comments__textarea"
          rows={3}
          maxLength={500}
        />
        {error && <p className="comments__error">{error}</p>}
        <button type="submit" className="btn btn--ghost">
          اهمس بتعليقك
        </button>
      </form>

      <ul className="comments__list">
        {comments.length === 0 && <li className="comments__empty">لسه مفيش همسات. كن أول من يهمس.</li>}
        {comments.map((c) => (
          <li key={c.id} className="comment">
            <div className="comment__head">
              <span className="comment__name">{c.name}</span>
              <span className="comment__date">{c.date}</span>
            </div>
            <p className="comment__text">{c.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- مكوّن: كارت قصة ----------
function StoryCard({ story, onOpen }) {
  return (
    <article className="story-card" onClick={() => onOpen(story.id)} tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(story.id) : null)}>
      <div className="story-card__rule" aria-hidden="true" />
      <h3 className="story-card__title">{story.title}</h3>
      <p className="story-card__excerpt">{story.excerpt}</p>
      <div className="story-card__meta">
        <span>💀 {story.fearRating.toFixed(1)}</span>
        <span>{story.readTime}</span>
      </div>
    </article>
  );
}

// ---------- الصفحة: الرئيسية ----------
function HomePage({ stories, onOpenStory, onNavigate }) {
  return (
    <>
      <section className="hero">
        <div className="hero__noise" aria-hidden="true" />
        <p className="hero__eyebrow">حكاوي بالليل ما تتقالش بالنور</p>
        <h1 className="hero__title">
          <span className="hero__title-line">كل باب اتقفل</span>
          <span className="hero__title-line hero__title-line--accent">له طارق محصلش</span>
        </h1>
        <p className="hero__sub">
          قصص رعب بالعامية المصرية، كاتبها <strong>أمير جلال</strong>. اقرا براحتك، بس سيب النور مفتوح.
        </p>
        <button className="btn btn--primary" onClick={() => onNavigate("stories")}>
          ادخل لو عندك جرأة
        </button>
      </section>

      <section className="latest">
        <h2 className="section-title">آخر الحكاوي</h2>
        <div className="story-grid">
          {stories.slice(0, 3).map((s) => (
            <StoryCard key={s.id} story={s} onOpen={onOpenStory} />
          ))}
        </div>
      </section>
    </>
  );
}

// ---------- الصفحة: أرشيف القصص ----------
function StoriesPage({ stories, onOpenStory }) {
  const [sort, setSort] = useState("new");
  const sorted = [...stories].sort((a, b) =>
    sort === "new" ? new Date(b.date) - new Date(a.date) : b.fearRating - a.fearRating
  );
  return (
    <section className="archive">
      <div className="archive__head">
        <h1 className="page-title">أرشيف الحكاوي</h1>
        <div className="archive__sort" role="group" aria-label="ترتيب القصص">
          <button className={`chip ${sort === "new" ? "chip--active" : ""}`} onClick={() => setSort("new")}>
            الأحدث
          </button>
          <button className={`chip ${sort === "scary" ? "chip--active" : ""}`} onClick={() => setSort("scary")}>
            الأكتر رعبًا
          </button>
        </div>
      </div>
      <div className="story-grid">
        {sorted.map((s) => (
          <StoryCard key={s.id} story={s} onOpen={onOpenStory} />
        ))}
      </div>
    </section>
  );
}

// ---------- الصفحة: قصة فردية ----------
function StoryPage({ story, comments, onRate, userRated, onBack }) {
  const [revealing, setRevealing] = useState(true);

  return (
    <article className="story-page">
      <TornReveal active={revealing} onDone={() => setRevealing(false)} />
      <button className="back-link" onClick={onBack}>
        ← رجوع للأرشيف
      </button>
      <header className="story-page__head">
        <h1 className="story-page__title">{story.title}</h1>
        <div className="story-page__meta">
          <span>{story.readTime} قراية</span>
          <span>·</span>
          <span>{new Date(story.date).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </header>

      <div className="story-page__body">
        {story.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <FearRating value={story.fearRating} count={story.ratingsCount} onRate={onRate} userRated={userRated} />

      <CommentsSection storyId={story.id} initialComments={comments} />
    </article>
  );
}

// ---------- الصفحة: عننا ----------
function AboutPage() {
  return (
    <section className="about">
      <h1 className="page-title">عن أمير جلال</h1>
      <div className="about__content">
        <p>
          أمير جلال كاتب قصص رعب بالعامية المصرية، بيحاول يحوّل التفاصيل اليومية العادية — الميكروباص بليل، صورة العيلة على الحيطة، طرقة الباب — لحاجة تقلب نومك.
        </p>
        <p>
          "حكاوي" مش موقع لمؤثرات صوتية أو دم مزيف. الرعب هنا في التفاصيل الصغيرة اللي ممكن تكون موجودة في بيتك دلوقتي.
        </p>
      </div>
    </section>
  );
}

// ---------- الصفحة: تواصل ----------
function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <section className="contact">
      <h1 className="page-title">تواصل معايا</h1>
      {sent ? (
        <p className="contact__success">اتسلمت رسالتك. لو فيها حاجة محتاجة رد، هترجع لك.</p>
      ) : (
        <form
          className="contact__form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="field">
            <span>اسمك</span>
            <input type="text" required />
          </label>
          <label className="field">
            <span>إيميلك</span>
            <input type="email" required />
          </label>
          <label className="field">
            <span>رسالتك</span>
            <textarea rows={5} required />
          </label>
          <button type="submit" className="btn btn--primary">
            بعّت الرسالة
          </button>
        </form>
      )}
    </section>
  );
}

// ---------- التطبيق الرئيسي ----------
export default function App() {
  const [route, setRoute] = useState({ page: "home" });
  const [stories, setStories] = useState(SAMPLE_STORIES);
  const [commentsByStory, setCommentsByStory] = useState(SAMPLE_COMMENTS);
  const [userRatedStories, setUserRatedStories] = useState({});

  function openStory(id) {
    setRoute({ page: "story", id });
    window.scrollTo(0, 0);
  }

  function rateStory(id, n) {
    if (userRatedStories[id]) return;
    setStories((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              fearRating: (s.fearRating * s.ratingsCount + n) / (s.ratingsCount + 1),
              ratingsCount: s.ratingsCount + 1,
            }
          : s
      )
    );
    setUserRatedStories((prev) => ({ ...prev, [id]: true }));
  }

  const navItems = [
    { key: "home", label: "الرئيسية" },
    { key: "stories", label: "الحكاوي" },
    { key: "about", label: "عننا" },
    { key: "contact", label: "تواصل" },
  ];

  return (
    <div className="app" dir="rtl">
      {torndEdgeFilter}
      <Styles />
      <header className="site-header">
        <button className="brand" onClick={() => setRoute({ page: "home" })}>
          <span className="brand__mark">☾</span>
          <span className="brand__name">حكاوي</span>
        </button>
        <nav className="site-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`site-nav__link ${route.page === item.key ? "site-nav__link--active" : ""}`}
              onClick={() => setRoute({ page: item.key })}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="site-main">
        {route.page === "home" && (
          <HomePage stories={stories} onOpenStory={openStory} onNavigate={(p) => setRoute({ page: p })} />
        )}
        {route.page === "stories" && <StoriesPage stories={stories} onOpenStory={openStory} />}
        {route.page === "story" && (
          <StoryPage
            story={stories.find((s) => s.id === route.id)}
            comments={commentsByStory[route.id]}
            onRate={(n) => rateStory(route.id, n)}
            userRated={!!userRatedStories[route.id]}
            onBack={() => setRoute({ page: "stories" })}
          />
        )}
        {route.page === "about" && <AboutPage />}
        {route.page === "contact" && <ContactPage />}
      </main>

      <footer className="site-footer">
        <p>حكاوي © {new Date().getFullYear()} — كل القصص من خيال أمير جلال. أي تشابه مع الواقع هو الجزء المخيف.</p>
      </footer>
    </div>
  );
}

// ---------- الأنماط ----------
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@700&family=Tajawal:wght@400;500;700&display=swap');

      :root {
        --bone: #D4C5A8;
        --void: #14100D;
        --void-2: #0E0B08;
        --rust: #8A2A22;
        --rust-dim: #5C1E18;
        --candle: #C9A227;
        --ash: #221C16;
        --ash-2: #2A231C;
        --smoke: #8A7F6E;
        --radius: 2px;
      }

      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }

      .app {
        background: var(--void);
        color: var(--bone);
        font-family: 'Tajawal', sans-serif;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
      }
      .app::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background-image: radial-gradient(circle at 20% 20%, rgba(201,162,39,0.04), transparent 40%),
                           radial-gradient(circle at 80% 70%, rgba(138,42,34,0.05), transparent 45%);
        z-index: 0;
      }

      button { font-family: inherit; cursor: pointer; }
      input, textarea { font-family: inherit; }

      /* ===== Header ===== */
      .site-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 22px clamp(20px, 5vw, 64px);
        border-bottom: 1px solid rgba(201,162,39,0.18);
        position: relative;
        z-index: 5;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        background: none;
        border: none;
        color: var(--bone);
      }
      .brand__mark { color: var(--candle); font-size: 1.4rem; }
      .brand__name {
        font-family: 'Reem Kufi', sans-serif;
        font-size: 1.5rem;
        letter-spacing: 1px;
      }
      .site-nav { display: flex; gap: clamp(14px, 2vw, 28px); }
      .site-nav__link {
        background: none;
        border: none;
        color: var(--smoke);
        font-size: 0.95rem;
        padding: 6px 2px;
        border-bottom: 2px solid transparent;
        transition: color 0.2s, border-color 0.2s;
      }
      .site-nav__link:hover, .site-nav__link--active {
        color: var(--candle);
        border-bottom-color: var(--rust);
      }

      .site-main {
        position: relative;
        z-index: 1;
        max-width: 1080px;
        margin: 0 auto;
        padding: 0 clamp(20px, 5vw, 64px) 80px;
      }

      /* ===== Hero ===== */
      .hero {
        padding: clamp(60px, 12vh, 120px) 0 70px;
        text-align: center;
        position: relative;
      }
      .hero__eyebrow {
        color: var(--rust);
        letter-spacing: 2px;
        font-size: 0.85rem;
        margin-bottom: 18px;
      }
      .hero__title {
        font-family: 'Reem Kufi', sans-serif;
        font-size: clamp(2.4rem, 6vw, 4.2rem);
        line-height: 1.25;
        margin: 0 0 22px;
        filter: url(#torn-paper);
      }
      .hero__title-line { display: block; color: var(--bone); }
      .hero__title-line--accent { color: var(--rust); }
      .hero__sub {
        color: var(--smoke);
        max-width: 540px;
        margin: 0 auto 34px;
        font-size: 1.05rem;
        line-height: 1.8;
      }
      .hero__sub strong { color: var(--candle); }

      .btn {
        font-size: 1rem;
        padding: 13px 30px;
        border-radius: var(--radius);
        border: 1px solid var(--candle);
        background: transparent;
        color: var(--candle);
        transition: all 0.25s;
      }
      .btn--primary {
        background: var(--rust-dim);
        border-color: var(--rust);
        color: var(--bone);
      }
      .btn--primary:hover { background: var(--rust); }
      .btn--ghost { border-color: rgba(201,162,39,0.4); color: var(--smoke); font-size: 0.9rem; padding: 10px 22px; }
      .btn--ghost:hover { border-color: var(--candle); color: var(--candle); }

      /* ===== Section titles ===== */
      .section-title, .page-title {
        font-family: 'Reem Kufi', sans-serif;
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        margin-bottom: 28px;
        position: relative;
        padding-bottom: 14px;
      }
      .section-title::after, .page-title::after {
        content: "";
        position: absolute;
        bottom: 0; right: 0;
        width: 60px; height: 2px;
        background: var(--rust);
      }

      /* ===== Story grid & cards ===== */
      .story-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 22px;
      }
      .story-card {
        background: var(--ash);
        border: 1px solid rgba(201,162,39,0.12);
        padding: 26px 24px;
        cursor: pointer;
        transition: transform 0.25s, border-color 0.25s, background 0.25s;
        position: relative;
      }
      .story-card:hover {
        transform: translateY(-4px);
        border-color: var(--rust);
        background: var(--ash-2);
      }
      .story-card:focus-visible { outline: 2px solid var(--candle); outline-offset: 3px; }
      .story-card__rule { width: 28px; height: 2px; background: var(--candle); margin-bottom: 16px; }
      .story-card__title {
        font-family: 'Reem Kufi', sans-serif;
        font-size: 1.25rem;
        margin: 0 0 12px;
        color: var(--bone);
      }
      .story-card__excerpt {
        color: var(--smoke);
        font-size: 0.92rem;
        line-height: 1.75;
        margin: 0 0 18px;
      }
      .story-card__meta {
        display: flex;
        gap: 16px;
        font-size: 0.82rem;
        color: var(--candle);
      }

      /* ===== Archive ===== */
      .archive__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
      }
      .archive__sort { display: flex; gap: 8px; margin-bottom: 28px; }
      .chip {
        background: none;
        border: 1px solid rgba(201,162,39,0.3);
        color: var(--smoke);
        padding: 7px 16px;
        border-radius: 999px;
        font-size: 0.85rem;
      }
      .chip--active { border-color: var(--candle); color: var(--candle); }

      /* ===== Story page ===== */
      .story-page { position: relative; padding-top: 30px; }
      .back-link {
        background: none;
        border: none;
        color: var(--smoke);
        font-size: 0.9rem;
        margin-bottom: 30px;
        padding: 0;
      }
      .back-link:hover { color: var(--candle); }
      .story-page__title {
        font-family: 'Reem Kufi', sans-serif;
        font-size: clamp(1.8rem, 4vw, 2.6rem);
        margin: 0 0 12px;
      }
      .story-page__meta {
        color: var(--smoke);
        font-size: 0.88rem;
        display: flex;
        gap: 10px;
        margin-bottom: 36px;
      }
      .story-page__body {
        font-size: 1.08rem;
        line-height: 2.1;
        color: var(--bone);
        max-width: 680px;
      }
      .story-page__body p { margin: 0 0 24px; }
      .story-page__body p:first-of-type::first-letter {
        font-size: 2.6rem;
        color: var(--rust);
        font-family: 'Reem Kufi', sans-serif;
        padding-left: 6px;
      }

      /* ===== Torn reveal transition ===== */
      .torn-reveal {
        position: fixed;
        inset: 0;
        z-index: 50;
        pointer-events: none;
        animation: tornFade 0.75s ease forwards;
      }
      .torn-svg { width: 100%; height: 100%; display: block; }
      @keyframes tornFade {
        0% { opacity: 1; transform: scaleY(1); }
        70% { opacity: 1; }
        100% { opacity: 0; transform: scaleY(1.4); }
      }
      @media (prefers-reduced-motion: reduce) {
        .torn-reveal { display: none; }
      }

      /* ===== Fear rating ===== */
      .fear-rating {
        margin: 50px 0 10px;
        padding: 22px 26px;
        background: var(--ash);
        border: 1px solid rgba(201,162,39,0.15);
        max-width: 680px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 14px;
      }
      .fear-rating__label { color: var(--smoke); font-size: 0.88rem; }
      .fear-rating__skulls { display: flex; gap: 4px; }
      .skull-btn {
        background: none;
        border: none;
        font-size: 1.3rem;
        filter: grayscale(1) opacity(0.35);
        transition: filter 0.15s, transform 0.15s;
      }
      .skull-btn:hover:not(:disabled) { transform: scale(1.15); }
      .skull-btn--lit { filter: grayscale(0) opacity(1); }
      .skull-btn:disabled { cursor: default; }
      .fear-rating__count { color: var(--candle); font-size: 0.85rem; margin-right: auto; }

      /* ===== Comments ===== */
      .comments { max-width: 680px; margin-top: 50px; }
      .comments__title {
        font-family: 'Reem Kufi', sans-serif;
        font-size: 1.3rem;
        display: flex;
        gap: 8px;
        align-items: baseline;
        margin-bottom: 20px;
      }
      .comments__count { color: var(--smoke); font-size: 0.95rem; font-family: 'Tajawal', sans-serif; }
      .comments__form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 32px;
        background: var(--ash);
        padding: 18px;
        border: 1px solid rgba(201,162,39,0.12);
      }
      .comments__input, .comments__textarea {
        background: var(--void-2);
        border: 1px solid rgba(201,162,39,0.2);
        color: var(--bone);
        padding: 10px 14px;
        border-radius: var(--radius);
        font-size: 0.95rem;
        resize: vertical;
      }
      .comments__input:focus, .comments__textarea:focus {
        outline: none;
        border-color: var(--candle);
      }
      .comments__error { color: var(--rust); font-size: 0.85rem; margin: 0; }
      .comments__form .btn { align-self: flex-start; }
      .comments__list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 16px; }
      .comments__empty { color: var(--smoke); font-style: italic; }
      .comment {
        border-right: 2px solid var(--rust-dim);
        padding: 4px 16px 4px 0;
      }
      .comment__head { display: flex; gap: 10px; align-items: baseline; margin-bottom: 6px; }
      .comment__name { color: var(--candle); font-size: 0.92rem; font-weight: 700; }
      .comment__date { color: var(--smoke); font-size: 0.78rem; }
      .comment__text { margin: 0; color: var(--bone); line-height: 1.7; font-size: 0.95rem; }

      /* ===== About / Contact ===== */
      .about__content, .contact__form { max-width: 640px; }
      .about__content p { line-height: 1.9; color: var(--bone); margin-bottom: 18px; }
      .contact__form { display: flex; flex-direction: column; gap: 18px; }
      .field { display: flex; flex-direction: column; gap: 8px; color: var(--smoke); font-size: 0.92rem; }
      .field input, .field textarea {
        background: var(--ash);
        border: 1px solid rgba(201,162,39,0.2);
        color: var(--bone);
        padding: 11px 14px;
        border-radius: var(--radius);
        font-size: 0.98rem;
      }
      .field input:focus, .field textarea:focus { outline: none; border-color: var(--candle); }
      .contact__success { color: var(--candle); font-size: 1.05rem; }

      /* ===== Footer ===== */
      .site-footer {
        text-align: center;
        padding: 30px 20px;
        color: var(--smoke);
        font-size: 0.82rem;
        border-top: 1px solid rgba(201,162,39,0.12);
      }

      /* ===== Responsive ===== */
      @media (max-width: 640px) {
        .site-nav { gap: 12px; }
        .site-nav__link { font-size: 0.85rem; }
        .hero { padding-top: 50px; }
      }
    `}</style>
  );
}
