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

export type RecommendedBookId = "book_tinh_lang" | "book_vu_tru";

export const DIMENSIONS: Record<
  Dimension,
  { bookId: RecommendedBookId; title: string; description: string; practice: string; reflection: string }
> = {
  A: {
    bookId: "book_tinh_lang",
    title: "Có lẽ bạn đang cần một điểm tựa vững vàng hơn.",
    description: "“Có những lúc cuộc sống diễn ra quá nhanh khiến chúng ta khó nghe thấy chính mình. Bạn không cần giải quyết tất cả ngay lập tức. Đôi khi, bước đầu tiên chỉ là dừng lại, nhận biết trạng thái hiện tại và cho mình một khoảng thở.”",
    practice: "Dành 3 phút để cảm nhận bàn chân chạm sàn, nhịp thở và những điểm tiếp xúc của cơ thể với chiếc ghế. Không cần ép mình phải bình an. Chỉ nhận biết điều đang diễn ra.",
    reflection: "“Ngay lúc này, điều gì có thể giúp tôi cảm thấy vững vàng hơn một chút?”"
  },
  B: {
    bookId: "book_tinh_lang",
    title: "Bạn có thể bắt đầu bằng việc lắng nghe chính mình, không phán xét.",
    description: "“Đôi khi điều khiến chúng ta mệt mỏi không chỉ là một sự việc, mà còn là những suy nghĩ và phán xét xuất hiện sau đó. Quan sát không có nghĩa là phải sửa mình ngay. Đó có thể là bước đầu tiên để hiểu mình rõ hơn.”",
    practice: "Viết ba dòng:\n- Điều gì vừa xảy ra?\n- Tôi đang cảm thấy gì?\n- Tôi có thể cần điều gì lúc này?",
    reflection: "“Nếu không cần kết luận mình đúng hay sai, tôi có thể hiểu điều gì về phản ứng vừa rồi?”"
  },
  C: {
    bookId: "book_vu_tru",
    title: "Có lẽ đã đến lúc bạn lắng nghe nhịp điệu riêng.",
    description: "“Không phải lúc nào tiến nhanh hơn cũng là lựa chọn tốt nhất. Có những giai đoạn chúng ta sẵn sàng mở rộng, cũng có những giai đoạn cần thu mình, nghỉ ngơi hoặc sắp xếp lại. Điều quan trọng không phải là chạy theo nhịp của người khác, mà là quan sát nhịp sống thực tế của mình.”",
    practice: "Hãy nghĩ về một việc bạn đang muốn bắt đầu. Tự hỏi: “Tôi đang thực sự có năng lượng để thực hiện, hay đang ép mình vì sợ bị chậm lại?”",
    reflection: "“Nếu cho phép mình điều chỉnh nhịp độ, tôi sẽ lựa chọn khác đi như thế nào?”"
  },
  D: {
    bookId: "book_vu_tru",
    title: "Bạn có thể nhẹ hơn khi phân biệt điều mình có thể làm và điều cần buông.",
    description: "“Khi mọi thứ không diễn ra như mong muốn, chúng ta dễ dành nhiều năng lượng để cố kiểm soát kết quả. Nhưng không phải điều gì cũng nằm trong tay mình. Đôi khi, sự chủ động bắt đầu từ việc nhận ra đâu là phần việc thực sự thuộc về mình.”",
    practice: "Chia một tờ giấy thành hai cột:\n- Điều nằm trong khả năng hành động của tôi.\n- Điều tôi không thể kiểm soát hoàn toàn.\n\nChọn một hành động nhỏ từ cột đầu tiên.",
    reflection: "“Nếu ngừng cố kiểm soát phần không thuộc về mình, tôi có thể dành năng lượng cho điều gì?”"
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
    listPrice: 99000,
    launchPrice: 89000,
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
    listPrice: 189000,
    launchPrice: 159000,
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
