import type { EventListProps } from "../entities/CardEntities";

export const events: EventListProps = {
  events: [
    {
      title: "春の同人誌即売会",
      date: "2026年4月12日",
      circles: [
        {
          id: "sakura-bunko",
          circleVisitId: "sakura-bunko-visit",
          priority: 1,
          visited: false,
          name: "さくら文庫",
          penName: "桜井はる",
          space: "A-01",
          totalPrice: 1000,
          books: [
            {
              id: "sakura-bunko-book-1",
              title: "春色の手紙",
              price: 500,
              status: "not_acquired",
            },
            {
              id: "sakura-bunko-book-2",
              title: "桜の街を歩いて",
              price: 500,
              status: "not_acquired",
            },
          ],
        },
      ],
    },
    {
      title: "夏の創作マーケット",
      date: "2026年7月19日",
      circles: [
        {
          id: "aozora-atelier",
          circleVisitId: "aozora-atelier-visit",
          priority: 1,
          visited: false,
          name: "青空アトリエ",
          penName: "青井なつ",
          space: "B-12",
          totalPrice: 1500,
          books: [
            {
              id: "aozora-atelier-book-1",
              title: "青空スケッチ",
              price: 1000,
              status: "not_acquired",
            },
            {
              id: "aozora-atelier-book-2",
              title: "夏の小さな物語",
              price: 500,
              status: "not_acquired",
            },
          ],
        },
      ],
    },
    {
      title: "秋の本まつり",
      date: "2026年10月27日",
      circles: [
        {
          id: "tsukiyo-shobo",
          circleVisitId: "tsukiyo-shobo-visit",
          priority: 1,
          visited: false,
          name: "月夜書房",
          penName: "月野あき",
          space: "C-03",
          totalPrice: 800,
          books: [
            {
              id: "tsukiyo-shobo-book-1",
              title: "月夜の読書会",
              price: 800,
              status: "not_acquired",
            },
          ],
        },
      ],
    },
  ],
};
