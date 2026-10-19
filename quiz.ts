export type Dimension = "A" | "B" | "C" | "D";
export type ScoreVector = Record<Dimension, number>;

export type QuizOption = {
  label: string;
  scores: ScoreVector;
};

export type QuizQuestion = {
  id: number;
  prompt: string;
  helper?: string;
  options: QuizOption[];
};

export const DIMENSIONS: Record<
  Dimension,
  { title: string; short: string; description: string; bookId: string }
> = {
  A: {
    title: "Tìm lại sự vững vàng",
    short: "Sự vững vàng",
    description:
      "Bạn có thể đang cần một khoảng dừng để lắng lại, ổn định cảm xúc và trở về với hiện tại thay vì phải gồng mình đi tiếp.",
    bookId: "book_tinh_lang"
  },
  B: {
    title: "Hiểu mình và những phản ứng của mình",
    short: "Thấu hiểu bản thân",
    description:
      "Bạn có thể đang muốn nhận ra điều gì diễn ra bên trong mình, điều gì kích hoạt phản ứng và cách quan sát bản thân mà không vội phán xét.",
    bookId: "book_tinh_lang"
  },
  C: {
    title: "Tìm nhịp điệu riêng",
    short: "Nhịp điệu riêng",
    description:
      "Bạn có thể đang cần hiểu nhịp năng lượng của mình: khi nào nên tiến lên, khi nào nên chậm lại và cách lắng nghe những chu kỳ cá nhân.",
    bookId: "book_vu_tru"
  },
  D: {
    title: "Buông bớt kiểm soát và sống có chủ đích",
    short: "Buông kiểm soát",
    description:
      "Bạn có thể đang muốn bớt tiêu hao năng lượng vào những điều ngoài tầm tay và lựa chọn cách sống phù hợp hơn với điều thật sự quan trọng.",
    bookId: "book_tinh_lang"
  }
};

export const BOOKS = {
  book_tinh_lang: {
    id: "book_tinh_lang",
    title: "Bản lĩnh tĩnh lặng",
    subtitle: "Một hành trình thực hành để trở về với sự vững vàng bên trong",
    listPrice: 89000,
    launchPrice: 69000,
    description:
      "Dành cho những lúc bạn muốn chậm lại, quan sát những gì đang diễn ra bên trong và nuôi dưỡng sự vững vàng qua thực hành nhỏ mỗi ngày.",
    bullets: [
      "Nhận diện trạng thái bên trong mà không vội phán xét",
      "Thực hành trở về với hiện tại",
      "Từng bước nới lỏng thói quen gồng mình"
    ]
  },
  book_vu_tru: {
    id: "book_vu_tru",
    title: "Sổ tay vũ trụ cá nhân",
    subtitle: "Lắng nghe nhịp điệu và những chu kỳ của chính mình",
    listPrice: 79000,
    launchPrice: 59000,
    description:
      "Dành cho những ai muốn quan sát nhịp năng lượng cá nhân, nhận biết lúc nên mở rộng và lúc cần nghỉ ngơi, đồng thời ghi lại những khám phá của mình.",
    bullets: [
      "Quan sát nhịp điệu cá nhân qua ghi chép",
      "Nhận biết lúc tiến lên và lúc chậm lại",
      "Thực hành buông bớt kiểm soát"
    ]
  },
  combo_tro_ve: {
    id: "combo_tro_ve",
    title: "Bộ đôi Trở về với chính mình",
    subtitle: "Hai ebook và gợi ý thực hành thiền đồng hành",
    listPrice: 149000,
    launchPrice: 119000,
    description:
      "Kết hợp hai hướng thực hành: tìm lại sự vững vàng bên trong và hiểu nhịp điệu riêng của mình.",
    bullets: [
      "Ebook Bản lĩnh tĩnh lặng",
      "Ebook Sổ tay vũ trụ cá nhân",
      "Gợi ý thiền YouTube: Lắng nghe nhịp điệu bên trong"
    ]
  }
} as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Khi cuộc sống trở nên quá nhiều, điều gì thường xảy ra với bạn?",
    options: [
      { label: "Tôi cố gắng gồng lên để xử lý hết mọi việc.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Tôi bị cuốn vào cảm xúc và khó hiểu vì sao mình phản ứng như vậy.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Tôi không biết nên tiếp tục hay nghỉ ngơi.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Tôi lo mọi thứ sẽ không ổn nếu mình không kiểm soát.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 2,
    prompt: "Khi bắt đầu một ngày mới, điều bạn mong muốn nhất là gì?",
    options: [
      { label: "Cảm thấy bình tâm và đủ vững vàng để đón nhận ngày mới.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Hiểu rõ cảm xúc và nhu cầu thật của mình.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Biết hôm nay nên tập trung hay dành thời gian nghỉ ngơi.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Có thể đón nhận những điều chưa theo kế hoạch.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 3,
    prompt: "Khi ai đó góp ý hoặc phê bình bạn, phản ứng nào gần với bạn nhất?",
    options: [
      { label: "Tôi cố tỏ ra ổn nhưng bên trong vẫn bị ảnh hưởng.", scores: { A: 2, B: 1, C: 0, D: 0 } },
      { label: "Tôi nghĩ đi nghĩ lại và tự hỏi vì sao mình lại phản ứng như thế.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Tôi cần thời gian một mình để cảm nhận và sắp xếp lại.", scores: { A: 1, B: 0, C: 2, D: 0 } },
      { label: "Tôi muốn giải thích hoặc làm mọi thứ trở lại đúng ý mình.", scores: { A: 0, B: 1, C: 0, D: 2 } }
    ]
  },
  {
    id: 4,
    prompt: "Trước một quyết định quan trọng, bạn thường…",
    options: [
      { label: "Tìm cách bình tâm trước khi lựa chọn.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Tự hỏi điều gì đang thật sự chi phối mình.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Quan sát thời điểm và nguồn năng lượng hiện tại của mình.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Cố tìm phương án chắc chắn nhất để tránh sai sót.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 5,
    prompt: "Bạn mệt nhưng vẫn còn nhiều việc phải làm. Điều gì khó nhất?",
    options: [
      { label: "Cho phép mình dừng lại mà không thấy có lỗi.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Nhận ra nhu cầu thật của mình thay vì bỏ qua cảm xúc.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Biết nên nghỉ bao lâu và khi nào quay lại.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Chấp nhận rằng không phải việc gì cũng hoàn thành theo kế hoạch.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 6,
    prompt: "Khi có điều xảy ra ngoài dự tính, bạn thường…",
    options: [
      { label: "Cần tìm lại sự bình tĩnh trước tiên.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Muốn hiểu vì sao sự việc khiến mình phản ứng mạnh.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Điều chỉnh nhịp độ và xem mình cần gì lúc này.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Cố gắng sửa tình hình ngay để lấy lại quyền kiểm soát.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 7,
    prompt: "Nếu có thể thay đổi một điều trong cách sống hiện tại, bạn muốn…",
    options: [
      { label: "Bớt căng thẳng và cảm thấy an ổn hơn.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Hiểu mình sâu hơn và ít tự trách hơn.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Sống theo nhịp riêng, không ép mình chạy theo người khác.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Bớt kiểm soát và dành sức cho điều thật sự quan trọng.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 8,
    prompt: "Cuối ngày, câu hỏi nào bạn muốn dành cho chính mình?",
    options: [
      { label: "Hôm nay điều gì giúp mình trở lại bình tâm?", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Điều gì đã chạm vào cảm xúc và nhu cầu của mình?", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Năng lượng của mình hôm nay lên xuống theo nhịp nào?", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Điều gì mình có thể thôi cố gắng kiểm soát?", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 9,
    prompt: "Bạn có thể dành khoảng 12 phút mỗi ngày cho một thực hành nhỏ. Bạn mong điều gì nhất?",
    options: [
      { label: "Một khoảng lặng để ổn định và trở về hiện tại.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Một cách quan sát bản thân mà không phán xét.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Một cuốn sổ để theo dõi nhịp điệu cá nhân.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Một lời nhắc để buông điều không nằm trong tầm tay.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  },
  {
    id: 10,
    prompt: "Điều bạn hy vọng nhận được từ hành trình này là…",
    options: [
      { label: "Sự vững vàng để đi qua những ngày nhiều biến động.", scores: { A: 2, B: 0, C: 1, D: 0 } },
      { label: "Sự thấu hiểu và kết nối chân thật hơn với bản thân.", scores: { A: 0, B: 2, C: 0, D: 1 } },
      { label: "Cảm nhận rõ hơn nhịp sống phù hợp với mình.", scores: { A: 0, B: 1, C: 2, D: 0 } },
      { label: "Sống nhẹ hơn, có chủ đích và bớt bị điều khiển bởi nỗi lo.", scores: { A: 1, B: 0, C: 0, D: 2 } }
    ]
  }
];

export type QuizResult = {
  scores: ScoreVector;
  highest: number;
  salient: Dimension[];
  recommendedBookIds: string[];
  exploratory: boolean;
};

export function calculateResults(answers: Record<number, number>): QuizResult {
  const scores: ScoreVector = { A: 0, B: 0, C: 0, D: 0 };

  QUIZ_QUESTIONS.forEach((question) => {
    const selectedIndex = answers[question.id];
    if (selectedIndex === undefined) return;
    const selected = question.options[selectedIndex];
    if (!selected) return;
    (Object.keys(scores) as Dimension[]).forEach((key) => {
      scores[key] += selected.scores[key];
    });
  });

  const highest = Math.max(...Object.values(scores));
  const salient = (Object.keys(scores) as Dimension[]).filter(
    (key) => scores[key] >= 12 && highest > 0 && scores[key] >= highest * 0.7
  );

  const recommendedBookIds = Array.from(
    new Set(salient.map((dimension) => DIMENSIONS[dimension].bookId))
  );

  return {
    scores,
    highest,
    salient,
    recommendedBookIds,
    exploratory: salient.length === 0
  };
}
