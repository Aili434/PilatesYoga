import React, { useMemo, useState } from 'react';
import './App.css';

type Category = 'ALL' | 'ピラティス' | 'ヨガ';

interface Lesson {
  id: number;
  title: string;
  category: 'ピラティス' | 'ヨガ';
  level: string;
  dateLabel: string;
  timeLabel: string;
  instructor: string;
  capacity: number;
  bookedCount: number;
  description: string;
}

interface Reservation {
  id: string;
  lessonId: number;
  lessonTitle: string;
  category: 'ピラティス' | 'ヨガ';
  dateLabel: string;
  timeLabel: string;
  instructor: string;
  userName: string;
  email: string;
  matRental: boolean;
  note: string;
}

const INITIAL_LESSONS: Lesson[] = [
  {
    id: 1,
    title: '朝のリセット・フローヨガ',
    category: 'ヨガ',
    level: '初心者〜中級',
    dateLabel: '11月28日(土)',
    timeLabel: '09:30 - 10:30',
    instructor: 'Mika',
    capacity: 12,
    bookedCount: 9,
    description: '深い呼吸とともに全身をゆっくり伸ばし、1日のスタートを軽やかに整えるモーニングヨガ。',
  },
  {
    id: 2,
    title: '体幹＆姿勢改善ピラティス',
    category: 'ピラティス',
    level: '初心者歓迎',
    dateLabel: '11月28日(土)',
    timeLabel: '11:15 - 12:15',
    instructor: 'Haruka',
    capacity: 8,
    bookedCount: 8,
    description: 'インナーマッスルを意識しながら背骨や骨盤のバランスを整える人気クラス。',
  },
  {
    id: 3,
    title: 'キャンドル・リラックスヨガ',
    category: 'ヨガ',
    level: 'リラックス',
    dateLabel: '11月29日(日)',
    timeLabel: '19:00 - 20:00',
    instructor: 'Sora',
    capacity: 12,
    bookedCount: 5,
    description: '一日の緊張や疲労をやさしくほどき、心地よい眠りへ導くナイトヨガ。',
  },
  {
    id: 4,
    title: 'しなやかボディメイク・ピラティス',
    category: 'ピラティス',
    level: '中級',
    dateLabel: '11月30日(月)',
    timeLabel: '18:30 - 19:30',
    instructor: 'Haruka',
    capacity: 10,
    bookedCount: 7,
    description: '流れるような動きで腹筋・背面・ヒップラインを引き締めるアクティブクラス。',
  },
  {
    id: 5,
    title: 'デトックス・デープブレスヨガ',
    category: 'ヨガ',
    level: 'オールレベル',
    dateLabel: '12月1日(火)',
    timeLabel: '10:30 - 11:30',
    instructor: 'Mika',
    capacity: 10,
    bookedCount: 4,
    description: 'ねじりのポーズを中心に巡りを高め、心と体をすっきり整えます。',
  },
  {
    id: 6,
    title: '美背中＆美脚フォーカス・ピラティス',
    category: 'ピラティス',
    level: '初心者〜中級',
    dateLabel: '12月2日(水)',
    timeLabel: '19:30 - 20:30',
    instructor: 'Rina',
    capacity: 8,
    bookedCount: 6,
    description: 'デスクワークで固まりやすい肩甲骨まわりと下半身を丁寧にケアするプログラム。',
  },
];

export function App() {
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [flashMessage, setFlashMessage] = useState<string>('');

  // 予約フォーム
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [matRental, setMatRental] = useState(true);
  const [note, setNote] = useState('');

  const filteredLessons = useMemo(() => {
    if (selectedCategory === 'ALL') return lessons;
    return lessons.filter((item) => item.category === selectedCategory);
  }, [lessons, selectedCategory]);

  const openBookingModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setFlashMessage('');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson) return;

    const remaining = selectedLesson.capacity - selectedLesson.bookedCount;
    if (remaining <= 0) {
      alert('申し訳ありません。この枠は満席になりました。');
      return;
    }

    if (!userName.trim() || !email.trim()) {
      alert('お名前とメールアドレスを入力してください。');
      return;
    }

    const newReservation: Reservation = {
      id: `${Date.now()}`,
      lessonId: selectedLesson.id,
      lessonTitle: selectedLesson.title,
      category: selectedLesson.category,
      dateLabel: selectedLesson.dateLabel,
      timeLabel: selectedLesson.timeLabel,
      instructor: selectedLesson.instructor,
      userName: userName.trim(),
      email: email.trim(),
      matRental,
      note: note.trim(),
    };

    setReservations((prev) => [newReservation, ...prev]);
    setLessons((prev) =>
      prev.map((item) =>
        item.id === selectedLesson.id
          ? { ...item, bookedCount: item.bookedCount + 1 }
          : item
      )
    );

    setFlashMessage(`「${selectedLesson.title}」の予約が完了しました！`);
    setUserName('');
    setEmail('');
    setMatRental(true);
    setNote('');
    setSelectedLesson(null);
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setReservations((prev) => prev.filter((r) => r.id !== reservation.id));
    setLessons((prev) =>
      prev.map((item) =>
        item.id === reservation.lessonId
          ? { ...item, bookedCount: Math.max(0, item.bookedCount - 1) }
          : item
      )
    );
    setFlashMessage(`「${reservation.lessonTitle}」の予約をキャンセルしました。`);
  };

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-inner">
          <span className="eyebrow">MAGENTA STUDIO &bull; PILATES &amp; YOGA</span>
          <h1 className="title">私らしく輝き、心と体を整えるスタジオ予約</h1>
          <p className="subtitle">
            ご希望のピラティス・ヨガクラスを選んで、いつでもオンラインで予約・キャンセルができます。
          </p>
        </div>
      </header>

      <div className="container">
        {flashMessage && (
          <div className="flash" role="status">
            <span>&#10024; {flashMessage}</span>
            <button
              type="button"
              className="flash-close"
              onClick={() => setFlashMessage('')}
              aria-label="閉じる"
            >
              &times;
            </button>
          </div>
        )}

        <section className="filter-bar" aria-label="カテゴリー絞り込み">
          {(['ALL', 'ピラティス', 'ヨガ'] as Category[]).map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'ALL' ? 'すべてのレッスン' : category}
            </button>
          ))}
        </section>

        <main className="grid">
          <section className="lesson-list">
            {filteredLessons.map((lesson) => {
              const remaining = lesson.capacity - lesson.bookedCount;
              const isFull = remaining <= 0;

              return (
                <article key={lesson.id} className="card">
                  <div className="card-top">
                    <span
                      className={`badge ${
                        lesson.category === 'ピラティス' ? 'pilates' : 'yoga'
                      }`}
                    >
                      {lesson.category}
                    </span>
                    <span className="level">{lesson.level}</span>
                  </div>

                  <h2 className="card-title">{lesson.title}</h2>
                  <p className="card-meta">
                    {lesson.dateLabel} ／ {lesson.timeLabel}
                  </p>
                  <p className="card-instructor">担当インストラクター：{lesson.instructor}</p>
                  <p className="card-desc">{lesson.description}</p>

                  <div className="card-footer">
                    <span className={`seats ${isFull ? 'full' : ''}`}>
                      {isFull ? '満席（受付終了）' : `残り ${remaining} 席 / 定員 ${lesson.capacity} 名`}
                    </span>
                    <button
                      type="button"
                      className="reserve-btn"
                      disabled={isFull}
                      onClick={() => openBookingModal(lesson)}
                    >
                      {isFull ? '満席' : 'この枠を予約する'}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="my-bookings">
            <div className="my-bookings-header">
              <h2>マイ予約リスト</h2>
              <span className="count-pill">{reservations.length} 件</span>
            </div>

            {reservations.length === 0 ? (
              <div className="empty-box">
                <p className="empty-title">現在予約中のレッスンはありません</p>
                <p className="empty-text">
                  気になるクラスの「この枠を予約する」ボタンから簡単に予約できます。
                </p>
              </div>
            ) : (
              <ul className="booking-list">
                {reservations.map((res) => (
                  <li key={res.id} className="booking-item">
                    <div className="booking-top">
                      <span className="booking-cat">{res.category}</span>
                      <span className="booking-date">
                        {res.dateLabel} {res.timeLabel}
                      </span>
                    </div>
                    <div className="booking-title">{res.lessonTitle}</div>
                    <div className="booking-sub">
                      お名前：{res.userName} ／ 担当：{res.instructor}
                    </div>
                    <div className="booking-sub">
                      マット：{res.matRental ? 'スタジオレンタル（無料）' : 'ご自身で持参'}
                    </div>
                    {res.note && <div className="booking-note">体調メモ：{res.note}</div>}
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => handleCancelReservation(res)}
                    >
                      予約をキャンセルする
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </main>
      </div>

      {selectedLesson && (
        <div className="modal-backdrop" onClick={() => setSelectedLesson(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-tag">{selectedLesson.category} 予約フォーム</p>
            <h2>{selectedLesson.title}</h2>
            <p className="modal-time">
              {selectedLesson.dateLabel} {selectedLesson.timeLabel}（担当：{selectedLesson.instructor}）
            </p>

            <form onSubmit={handleBookingSubmit} className="form">
              <label>
                お名前 <span className="req">*</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="例：山田 花子"
                  required
                />
              </label>

              <label>
                メールアドレス <span className="req">*</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="例：hanako@example.com"
                  required
                />
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={matRental}
                  onChange={(e) => setMatRental(e.target.checked)}
                />
                ヨガマットを無料レンタルする
              </label>

              <label>
                体調・気になっている部位メモ（任意）
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="例：肩こりがあります、初心者です"
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setSelectedLesson(null)}
                >
                  閉じる
                </button>
                <button type="submit" className="reserve-btn">
                  予約を確定する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
