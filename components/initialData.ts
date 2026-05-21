import { Article, Activity } from "./types";

export const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuArimo4U5FgI8lcu6b2F4pc2-CZ_jdsdQgv-gwZ-oEp3MHkTyhNMm7fAJklekM1AEfjaTXCtuGmft-MkniU3GpP8RYPj9MDBSOjWOTFhtgvvTgHEA7pkTQGRugCJYrgSq8xMn_zK850eP5GXqSmS5_54fa6WjniUYM_yIU0ezgwUnK7k0bZ_VianTIl6B-Fu081h3cgnpSWQOQsoecapKFwNSE9Sb3EeuXeV6JS-C-XL7l09vD033ZIwFDQKGUfOzMq8XS6fr9xXna_";

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "the-future-of-editorial-systems",
    title: "The Future of Editorial Systems: Why Invisible Infrastructure Matters",
    category: "TECHNOLOGY",
    author: "Elena Vance",
    date: "Oct 24, 2024",
    readTime: "8 min read",
    views: 1205,
    likes: 248,
    dislikes: 12,
    content: "The landscape of digital publishing is shifting. No longer is it enough to simply provide a text box and a publish button. The modern author requires an environment that understands the rhythm of their work—an invisible partner that handles the complexity of distribution, SEO, and formatting while staying out of the way.\n\nIn the pursuit of performance, many CMS platforms have become bloated with features that distract rather than enable. We believe the future lies in \"Minimalist Corporate\" aesthetics—a style where every border, every pixel of whitespace, and every typographic choice is engineered for focus.\n\nContent is King, but the Author is the Architect. We build the scaffolding so they can build the cathedral.\n\nAs we look ahead to 2025, the integration of generative tools within editorial workflows must be handled with surgical precision. It's not about replacing the writer, but about augmenting their capability to produce high-quality, authoritative content at scale.",
    tags: ["#CMS", "#DesignSystems", "#UX", "#FutureOfWork"],
    status: "Published",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhidqJXsOLKnbAtXkH0Pj0ZkSzTcg3IsvJ1JeMA0W7O9Ss4wUNXlbnplfayC4AijLehtPZhmNWrYSG0TgozoCoVcoTAo2DWrzL9gkdz5uOUy6wTWcE4asgGDkq4ceKalyK9Dit7wArNweINb7VQdfHqtR-dKulXkM36EAIeYJvG8fLIlSP6Zqc4FEJRbGJgDdw3un00OZIkERlzHY9GPa8dUEtVIgqWG-xu7TXc8Cog6UpKGCnV9r_Hl-BvuByJuZiKIxhc_gyutB1",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiBMCLG10GcpQTm6nDQ1Db5QxycKwn3Uzl22UBaDarzyqxRbISMCgO9j_RFKHKC5jZ3uqiKvwkETk2DAyejZvy2vxVBtCrGaqXB2xpUcl1Jow55K9E6wfC-_w2x4vfeQgWyAWq3wLk3Vu8apPX081qQg_TYiiot39ZVwYYpHVrfQ-xAMV3nG0xTO0XFuMz0ow1JGngN65KfKnTmYcXr8h5rEWmEjafNxSeaIeLaK3IFdmJhcZpC3_wnzKomJkcywMZYDACVsBRZi-Z",
    comments: [
      {
        id: "c1",
        author: "Marcus Thorne",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjI7MdEXKmkdS7HSE3Xf0Erk93Bt3hJekTQWyin_lnkQbn4WH3Z2_IRiVW-Iis_xR5QXyDEEAX0fP_VbPzjUFy6Y8bmoQVtLqNP87jAQxYqOCOjr1xMll_e8WFScDN87TBX1ThLohP1at8Rzr6uazxkDJqdeZYergdJEuUDHhU2FN9vp1ZgmqwhAzGqtV2yF8mySxuXCOz2jJvJwdZOhyQiDt1Lrao96q_z8RUiYHXTJQCC-1kMmfmk_u5qAwzE7z1z5f0vdmUGtLq",
        content: "Finally, a take that focuses on the authoring experience rather than just the end-reader. The backend of most CMS platforms is a nightmare for actual writers.",
        time: "2h ago",
        likes: 14,
      }
    ]
  },
  {
    id: "mastering-the-art-of-minimalist-ui-design",
    title: "Mastering the Art of Minimalist UI Design",
    category: "DESIGN",
    author: "Marcus Thorne",
    date: "Oct 12, 2024",
    readTime: "6 min read",
    views: 2410,
    likes: 185,
    dislikes: 4,
    content: "Minimalist UI design isn't about removing elements at random. It is an intentional philosophy where every single border, pixel of padding, and font weight is selected with mathematical precision.\n\nWhen we restrict our components from relying on deep drop shadows and complex multi-color gradients, we elevate the typography. Text is no longer just instructions; it becomes the graphic element itself.\n\nIn this article, we outline key strategies for establishing proportional rhythm using an 8px layout grid and restrictive color boundaries.",
    tags: ["#UI", "#DesignSystems", "#Minimalism", "#Whitespace"],
    status: "Published",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2DspUKEAxUcsHsvFPvrD7HoHSnGFlCWX6O19tSGlTCK0_mDnWf2kG6pN2MprNN2Nt9Q3bxPkz1csel9x103R8OJEjk_6AsPqZU1kv3bXx5YWJLbuuWUvXq_6kRAdu37wnY0vZ5Npy_eJM4CvzoZlc5J-g7x-C5cL0dR6NYVTot0mWGQc-su_ULCO4ncZJHBLjgMUGIh34m1c2o-ZjiSyyGseL00P7JdZkO9yPhPbCHgpwQx5WAuuTY8kew_PZFIaNd3lCSGeXlOiK",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMe7CDwOf-V4yca0dZcDnhab3OEkG34aQj0ELJHV_ZaezOy1GKbg5WvYyYu5x_QjnCZZja5yiMmOyWmm9smhEWF2fNx_j29wOB13nUn252OyQQcXjAY1WosdQdj_dCm798PS0X4VrM78u48cWNAsfFll4gxwkxwg-oBC90i8wdCHOs9LCvWxJm0ViufEcDJJ5d0wKKywhsuXZsJlbEy8OpmN9D9g3d0cJiPm9mIVVYafYBGsvb1H5BHwaB1M6vuuoSEmMb2LhOGmVx",
    comments: []
  },
  {
    id: "the-future-of-serverless-architecture",
    title: "The Future of Serverless Architecture",
    category: "ARCHITECTURE",
    author: "Sarah Jenkins",
    date: "May 10, 2024",
    readTime: "4 min read",
    views: 1422,
    likes: 92,
    dislikes: 1,
    content: "Serverless architectures compile your workload down to event-driven functions that scale from zero to millions of concurrent executions in milliseconds. By treating infrastructure as an invisible execution platform, we shift entire operations onto providers so teams can build features instead of tuning virtual machines.\n\nWhile cold starts continue to pose challenge guidelines for low-latency nodes, optimization techniques like instant snapshot resume and edge orchestration keep systems resilient.",
    tags: ["#Serverless", "#Backend", "#Cloud", "#Architecture"],
    status: "Draft",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKRXNT-8yMDaqcGGdMw5y9ZjD16RLspozm16U6RZwBXNccmVcVm8X6yXLpJ7ILU-cIstQoFNGQATIL8DuisHEvcvNs8824qN4VXxtuCREbTd2GhDyuxnApi7GIXmUOlLA51rzOwOlLsBMJv9VVTg6fCx4ZhYDjxHTn0gIdb5equATIpGYRl6VxQgKIiDyeiaT1XCZO7TjmrWUAiD2BTADJKxsVhc_THGEHdomDtwwi3Efx6y1KCcu75l0A2q_1UrEkPjbHuEzdLw9M",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEuMM1SQG-vlxoJ10eRsWi0GeAX0uf7X5woza9geBi4MvpG2D3IpmIX-1z7VZ4rh0m289W5HKL4pDNfDBnvwQMbI8w_3NIeOTZDFKgfWmSpJqllGYOOcNHYuG97fkp7Q88X7PvGCzUwCge7CwDijjT1Er2kZNeoEeS0vHvC9im0g2pL4WPj8rYReEHlZf1acoWbcellF8stLpjZ2kNnjCW8awVUXubBN8z9Kz1NspCy-UUZoVWw2SyDWV42xRDK851etpZwldLMkOG",
    comments: []
  },
  {
    id: "building-resilient-data-pipelines",
    title: "Building Resilient Data Pipelines",
    category: "ENGINEERING",
    author: "Elena Vance",
    date: "Sep 28, 2024",
    readTime: "10 min read",
    views: 1100,
    likes: 85,
    dislikes: 2,
    content: "Modern data platform engineering demands high resilience against partition drift, stream duplicates, and unpredictable network bursts. Building on distributed message logs (such as Apache Kafka or RabbitMQ) provides custom visual buffers to scale under backpressure without data loss.\n\nWe analyze dead-letter queueing architectures and atomic stream processing to guarantee exactly-once deliveries across multi-region environments.",
    tags: ["#Data", "#Kafka", "#Pipelines", "#Engineering"],
    status: "Paused",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-_3ntKQeCpYVuHOPkDRl7nB1drZVnmesduYU1SPSvpM1Q9erqwO24IJ_xSSYwu8DmMHEDiMklLQJEU_lpQAh-IEoul00OVazY49D2NmedxhWYnixCPRYP3x7ItzfYuShhPzU_2Ci1ZpwefUTRES2gB96uWCM6pW9rluaE4rvUXYGS8f4G_7MUbdHuW3VhSJ3ijBUKA0rDLNZVrSBnXJUhqszpg_ss-v33rovgvUVyPtuU7fcBiaxVsCm5JoTQbeJb463SyNGrptO5",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiBMCLG10GcpQTm6nDQ1Db5QxycKwn3Uzl22UBaDarzyqxRbISMCgO9j_RFKHKC5jZ3uqiKvwkETk2DAyejZvy2vxVBtCrGaqXB2xpUcl1Jow55K9E6wfC-_w2x4vfeQgWyAWq3wLk3Vu8apPX081qQg_TYiiot39ZVwYYpHVrfQ-xAMV3nG0xTO0XFuMz0ow1JGngN65KfKnTmYcXr8h5rEWmEjafNxSeaIeLaK3IFdmJhcZpC3_wnzKomJkcywMZYDACVsBRZi-Z",
    comments: []
  },
  {
    id: "10-tips-for-better-typography-in-web-apps",
    title: "10 Tips for Better Typography in Web Apps",
    category: "DESIGN",
    author: "Elena Vance",
    date: "Sep 15, 2024",
    readTime: "5 min read",
    views: 1120,
    likes: 198,
    dislikes: 3,
    content: "Typography is 95% of web design. Setting an optimal reading measure (50-75 characters per line), structuring generous leading, and selecting a highly legible typeface are foundational skills that distinguish elite interfaces.\n\nLearn how to scale responsive font scales, adjust letter tracking proportionally for heading styles, and maintain consistent vertical rhythm across layouts.",
    tags: ["#Typography", "#UI", "#WebDev", "#DesignTips"],
    status: "Published",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArimo4U5FgI8lcu6b2F4pc2-CZ_jdsdQgv-gwZ-oEp3MHkTyhNMm7fAJklekM1AEfjaTXCtuGmft-MkniU3GpP8RYPj9MDBSOjWOTFhtgvvTgHEA7pkTQGRugCJYrgSq8xMn_zK850eP5GXqSmS5_54fa6WjniUYM_yIU0ezgwUnK7k0bZ_VianTIl6B-Fu081h3cgnpSWQOQsoecapKFwNSE9Sb3EeuXeV6JS-C-XL7l09vD033ZIwFDQKGUfOzMq8XS6fr9xXna_",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiBMCLG10GcpQTm6nDQ1Db5QxycKwn3Uzl22UBaDarzyqxRbISMCgO9j_RFKHKC5jZ3uqiKvwkETk2DAyejZvy2vxVBtCrGaqXB2xpUcl1Jow55K9E6wfC-_w2x4vfeQgWyAWq3wLk3Vu8apPX081qQg_TYiiot39ZVwYYpHVrfQ-xAMV3nG0xTO0XFuMz0ow1JGngN65KfKnTmYcXr8h5rEWmEjafNxSeaIeLaK3IFdmJhcZpC3_wnzKomJkcywMZYDACVsBRZi-Z",
    comments: []
  },
  {
    id: "optimizing-your-workflow-for-multi-channel-publishing",
    title: "Optimizing Your Workflow for Multi-Channel Publishing",
    category: "STRATEGY",
    author: "Marcus Thorne",
    date: "May 12, 2024",
    readTime: "6 min read",
    views: 1530,
    likes: 310,
    dislikes: 8,
    content: "Modern content workflows are fragmented across newsletters, core sites, RSS, and social networks. Maintaining consistency without drowning in repetition requires a master strategy that slices monolithic posts into custom micro-assets.\n\nWe highlight the creation of a 'Single Source of Truth' blueprint using headless database integrations, streamlining scheduling, and utilizing templates.",
    tags: ["#CMS", "#Workflow", "#Strategy", "#SEO"],
    status: "Published",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyRlxWYO06q7tXKCqgJhtYkYaWF7W0apGUHvBYsq2cQ_uYpOpjNP3gYBo7eudSnGTTfHPjn7tSFIcGDAlyhOCLPEJBTWIvFjmiUgbttkRPeaHei0e47pFAgIFmuUDtoX_ayqYB8-dbhGUBetvep8rQvP91bQCO2HNsq5bY2I6RafKGIdea0z2gvfxm6HF1CbgBxDxmP-j4VGXLUJ9q1XSe9WTXA2QrtFPNcJ24_avjI-YsWrYK3mRLA-2FcQWCP7TeieHfWSECHWyi",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMe7CDwOf-V4yca0dZcDnhab3OEkG34aQj0ELJHV_ZaezOy1GKbg5WvYyYu5x_QjnCZZja5yiMmOyWmm9smhEWF2fNx_j29wOB13nUn252OyQQcXjAY1WosdQdj_dCm798PS0X4VrM78u48cWNAsfFll4gxwkxwg-oBC90i8wdCHOs9LCvWxJm0ViufEcDJJ5d0wKKywhsuXZsJlbEy8OpmN9D9g3d0cJiPm9mIVVYafYBGsvb1H5BHwaB1M6vuuoSEmMb2LhOGmVx",
    comments: []
  },
  {
    id: "the-psychology-of-click-through-rates-in-saas",
    title: "The Psychology of Click-Through Rates in SaaS",
    category: "ANALYTICS",
    author: "Elena Rodriguez",
    date: "May 10, 2024",
    readTime: "4 min read",
    views: 890,
    likes: 120,
    dislikes: 4,
    content: "Why do users click? It isn't just about color contrasts or bigger fonts. It centers primarily on context relevancy, cognitive effort pathways, and emotional triggers.\n\nWe dissect how the reading trajectory flows across content cards, why micro-benefit hooks improve conversions by up to 40%, and how to minimize choices to prevent decision overload.",
    tags: ["#SaaS", "#Conversion", "#Marketing", "#Psychology"],
    status: "Draft",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKRXNT-8yMDaqcGGdMw5y9ZjD16RLspozm16U6RZwBXNccmVcVm8X6yXLpJ7ILU-cIstQoFNGQATIL8DuisHEvcvNs8824qN4VXxtuCREbTd2GhDyuxnApi7GIXmUOlLA51rzOwOlLsBMJv9VVTg6fCx4ZhYDjxHTn0gIdb5equATIpGYRl6VxQgKIiDyeiaT1XCZO7TjmrWUAiD2BTADJKxsVhc_THGEHdomDtwwi3Efx6y1KCcu75l0A2q_1UrEkPjbHuEzdLw9M",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEuMM1SQG-vlxoJ10eRsWi0GeAX0uf7X5woza9geBi4MvpG2D3IpmIX-1z7VZ4rh0m289W5HKL4pDNfDBnvwQMbI8w_3NIeOTZDFKgfWmSpJqllGYOOcNHYuG97fkp7Q88X7PvGCzUwCge7CwDijjT1Er2kZNeoEeS0vHvC9im0g2pL4WPj8rYReEHlZf1acoWbcellF8stLpjZ2kNnjCW8awVUXubBN8z9Kz1NspCy-UUZoVWw2SyDWV42xRDK851etpZwldLMkOG",
    comments: []
  },
  {
    id: "the-future-of-headless-cms-architecture-in-2024",
    title: "The Future of Headless CMS Architecture in 2024",
    category: "STRATEGY",
    author: "Marcus Thorne",
    date: "May 08, 2024",
    readTime: "7 min read",
    views: 1840,
    likes: 242,
    dislikes: 1,
    content: "The monolithic CMS age is ending. Headless systems split the editorial database from the visual presentation layer, allowing contents to sync dynamically via GraphQL or REST APIs into any device. This architecture lets engineering use Next.js for web while simultaneously updating native mobile apps without formatting leaks.",
    tags: ["#Strategy", "#Headless", "#CMS", "#API"],
    status: "Published",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9sNumSayePc08Fe4ejcQ6QFsSt2G2GYXId0r_rghPFUoYk5D3MZrFGaJhFKgwwJx-ccL2aohrvilw_EsYEmpQLBarnLnMLu76lyXNk-d1it2CbDkqJ8XxPT-oEkpL_OT5kIkzjgkjYJ4XKNH9mbr-s_Hgr0PabDgurQuj_hCvJEtHPmhhGdrdRFSOCiPek356roZVI_Ui8LJR1gosqtDUzGB2Onehdn3g-NkMhOWQUHqNJ8NfnMFmtgmEi0P3XrfWJEEBvD7_FsK_",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMe7CDwOf-V4yca0dZcDnhab3OEkG34aQj0ELJHV_ZaezOy1GKbg5WvYyYu5x_QjnCZZja5yiMmOyWmm9smhEWF2fNx_j29wOB13nUn252OyQQcXjAY1WosdQdj_dCm798PS0X4VrM78u48cWNAsfFll4gxwkxwg-oBC90i8wdCHOs9LCvWxJm0ViufEcDJJ5d0wKKywhsuXZsJlbEy8OpmN9D9g3d0cJiPm9mIVVYafYBGsvb1H5BHwaB1M6vuuoSEmMb2LhOGmVx",
    comments: []
  },
  {
    id: "scaling-your-editorial-team-a-framework",
    title: "Scaling Your Editorial Team: A Framework",
    category: "STRATEGY",
    author: "Marcus Thorne",
    date: "May 08, 2024",
    readTime: "8 min read",
    views: 940,
    likes: 145,
    dislikes: 2,
    content: "Growing an editorial machine isn't just about hiring more writers. Content production at scale is primarily an orchestration challenge. It requires solid style boundaries, transparent review gates, and structural feedback pathways.\n\nWe present three scalable organizational templates, clarifying when to hire specialists, how to design collaborative pipelines, and methods to monitor author output metrics.",
    tags: ["#Management", "#Editorial", "#Scaling", "#Content"],
    status: "Published",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-_3ntKQeCpYVuHOPkDRl7nB1drZVnmesduYU1SPSvpM1Q9erqwO24IJ_xSSYwu8DmMHEDiMklLQJEU_lpQAh-IEoul00OVazY49D2NmedxhWYnixCPRYP3x7ItzfYuShhPzU_2Ci1ZpwefUTRES2gB96uWCM6pW9rluaE4rvUXYGS8f4G_7MUbdHuW3VhSJ3ijBUKA0rDLNZVrSBnXJUhqszpg_ss-v33rovgvUVyPtuU7fcBiaxVsCm5JoTQbeJb463SyNGrptO5",
    authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMe7CDwOf-V4yca0dZcDnhab3OEkG34aQj0ELJHV_ZaezOy1GKbg5WvYyYu5x_QjnCZZja5yiMmOyWmm9smhEWF2fNx_j29wOB13nUn252OyQQcXjAY1WosdQdj_dCm798PS0X4VrM78u48cWNAsfFll4gxwkxwg-oBC90i8wdCHOs9LCvWxJm0ViufEcDJJ5d0wKKywhsuXZsJlbEy8OpmN9D9g3d0cJiPm9mIVVYafYBGsvb1H5BHwaB1M6vuuoSEmMb2LhOGmVx",
    comments: []
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "published",
    title: "Post Published",
    description: '"10 Tips for Modern UI Design"',
    time: "2h ago"
  },
  {
    id: "act-2",
    type: "draft",
    title: "New Draft Created",
    description: '"The Future of CMS Platforms"',
    time: "5h ago"
  },
  {
    id: "act-3",
    type: "subscriber",
    title: "New Subscriber",
    description: "alex.j@company.com",
    time: "8h ago"
  },
  {
    id: "act-4",
    type: "flagged",
    title: "Comment Flagged",
    description: 'Review required on "React Hooks"',
    time: "1d ago"
  }
];
