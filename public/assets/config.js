/* =====================================================================
 *  页面文案配置（唯一需要日常修改的文件）
 *  UCARS 城市车生活体验站 · 前海人寿金融中心秋日车生活嘉年华
 *
 *  编辑说明：
 *  1. 所有对外文案都在下面的 SITE_CONFIG 里，改完保存、刷新页面即可。
 *  2. 文案中的 【标签】 语法仍可用（会显示为小标签）；已确认内容请勿再写待确认。
 *  3. 文字会被自动转义（不能写 HTML），换行请拆成数组的多项。
 *  4. 链接（href）目前都是 '#' 占位。
 *  5. 购车礼遇：benefits.enabled=false 可整体隐藏。
 *  6. 活动日期写在 event 里；打卡领好礼自每日 12:00 起。
 * ===================================================================== */
window.SITE_CONFIG = {

  /* ---------- 活动基础信息（北京时间 UTC+8） ---------- */
  event: {
    startDate: '2026-10-27',
    endDate:   '2026-10-31',
    sessions: [],                 // 已取消午间场/下午场
    checkInStart: '12:00'         // 每日打卡领好礼开始时间
  },

  /* ---------- 场次/打卡状态提示 ---------- */
  status: {
    before:     '活动将于10月27日开始',
    upcoming:   '今日 12:00 起打卡领好礼',
    live:       '打卡领好礼进行中 · 数量有限先到先得',
    dayOver:    '今日打卡领好礼已结束',
    dayOverTip: '明天 12:00 打卡领好礼见',
    allOver:    '本次活动已圆满结束，感谢参与'
  },

  /* ---------- 1. 首屏 ---------- */
  hero: {
    brand: 'UCARS',
    logo: 'assets/img/ucars-logo-official.png',
    station: '城市车生活体验站',
    eventName: '前海人寿金融中心秋日车生活嘉年华',
    eventNameTbc: false,
    slogan: '下楼逛逛',
    subSlogan: '看展车 / 体验车生活 / 了解专属购车权益',
    image: 'assets/img/hero-final-effect.png',
    imageAlt: '前海人寿金融中心前广场秋日车生活嘉年华最终效果实景',
    facts: [
      { label: '日期', value: '2026年10月27日（周二）—31日（周六万圣夜）' },
      { label: '地点', value: '前海人寿金融中心前广场' },
      { label: '打卡领好礼', value: '每日12点开始 · 数量有限先到先得' }
    ]
  },

  /* ---------- 气氛图（首屏下方，不替换 hero） ---------- */
  atmosphere: {
    enabled: false,
    image: 'assets/img/halloween-sunset-six-cars-text.png',
    imageAlt: '今日宜下楼鬼混 · 六车剪影气氛海报',
    caption: '今日宜下楼鬼混 · 10.27–31 前海人寿金融中心前广场'
  },

  /* ---------- 顶部快捷导航 ---------- */
  nav: [
    { id: 'benefits', label: '专属购车权益' },
    { id: 'scenes', label: '四大场景' },
    { id: 'interaction', label: '周末装备互动' },
    { id: 'care', label: '养车选UCARS' },
    { id: 'experience', label: '现场体验' },
    { id: 'join', label: '参与方式' },
    { id: 'gift', label: '打卡领好礼' },
    { id: 'tips', label: '温馨提示' }
  ],

  /* ---------- 2. 四大生活场景 ---------- */
  scenes: {
    kicker: 'SCENES',
    title: '四大生活场景',
    intro: '6台展车、4种生活场景。点开图片，看看车型在日常里的不同体验。',
    note: '车型及展车组合以最终现场安排为准；图片为车型官图示意。',
    items: [
      {
        no: '01', name: '移动·清醒舱', color: 'blue',
        cars: '享界 S9T、尚界 Z7T',
        models: [
          { name: '享界 S9T', scene: '08:30｜出门前，蓄势待发', highlights: ['行政级座舱', '智慧日程领航', '清晨元气音乐'] },
          { name: '尚界 Z7T', scene: '12:30｜午间重启', highlights: ['零重力云感座椅', '双层隔音 × 智能光幕', '深度助眠香氛系统'] }
        ],
        modelNote: '',
        moments: ['08:30 出发前', '12:30 午间重启'],
        desc: '通勤出发与午间重启，在楼下找回一天的节奏。',
        images: ['assets/img/cars/xiangjie-s9t.jpg', 'assets/img/cars/shangjie-z7t.jpg'],
        imageAlts: ['享界 S9T', '尚界 Z7T']
      },
      {
        no: '02', name: '智慧·第三空间', color: 'green',
        cars: '智界 V9、享界 V8',
        models: [
          { name: '智界 V9', scene: '智慧·第三空间', highlights: ['安静陪伴', '家庭继续出发'] },
          { name: '享界 V8', scene: '智慧·第三空间', highlights: ['家庭智慧空间', '多人出行'] }
        ],
        modelNote: '',
        moments: ['安静陪伴', '家庭继续出发'],
        desc: '家庭多人出行、安静陪伴，下班后与家人继续出发。',
        images: ['assets/img/cars/zhijie-v9.jpg', 'assets/img/cars/xiangjie-v8.jpg'],
        imageAlts: ['智界 V9', '享界 V8']
      },
      {
        no: '03', name: '云端·名利场', color: 'violet',
        cars: '尊界 S800',
        models: [
          { name: '尊界 S800', scene: '云端·名利场', highlights: ['重要会面', '商务接待'] }
        ],
        modelNote: '车型参数、版本与配置以现场实车及品牌资料为准。',
        moments: ['重要会面', '商务接待'],
        desc: '为重要会面与商务接待准备的从容空间。',
        image: 'assets/img/cars/zunjie-s800.jpg'
      },
      {
        no: '04', name: '无界·轻野奢', color: 'amber',
        cars: '享界 G9',
        models: [
          { name: '享界 G9', scene: '周末状态切换', highlights: ['精致生活', '轻野奢出行灵感'] }
        ],
        modelNote: '车型参数、版本与实际可展示配置以现场实车及品牌资料为准。',
        moments: ['周末状态切换', '精致生活'],
        desc: '从工作日切换到周末，秋日出行灵感与精致生活。',
        image: 'assets/img/cars/xiangjie-g9.jpg'
      }
    ]
  },

  /* ---------- 3. 周末去哪儿（保留海报/目的地；三步玩法文案已下线） ---------- */
  interaction: {
    enabled: true,
    kicker: 'UCARS CAR LIFE PLAY',
    title: '周末去哪儿？装备你来配',
    intro: '花一分钟，给自己的秋日周末配一套出行装备。就在享界 G9 旁边玩。',
    poster: {
      image: 'assets/img/weekend-gear-poster.png',
      imageAlt: '周末去哪儿？装备你来配 · UCARS 未来车生活',
      eyebrow: '秋日车生活 · 轻松打卡',
      location: '前海人寿金融中心',
      title: '周末去哪儿？',
      titleAccent: '装备你来配',
      tags: ['看车', '周末灵感', 'UCARS车生活'],
      caption: '拍下你的秋日车生活组合'
    },
    steps: [],
    prompt: '抽张卡，选三件，给自己配一个秋日周末。',
    destinations: [
      { place: '大鹏看海', line: '今天不赶路，去海边吹吹风。', gear: ['防晒帽', '折叠椅', '保温杯'] },
      { place: '马峦山轻行', line: '把消息提醒调小声，去山里走走。', gear: ['薄外套', '饮用水', '相机'] },
      { place: '莲花山 / 中心公园', line: '不必跑太远，找块绿地坐一会儿。', gear: ['野餐垫', '书', '零食'] },
      { place: '光明田园漫游', line: '沿着田园慢慢逛，今天不赶时间。', gear: ['轻便背包', '帽子', '相机'] }
    ],
    footnote: '',
    connection: ''
  },

  /* ---------- 3b. 养车选UCARS（周末板块下方） ---------- */
  care: {
    enabled: true,
    kicker: 'UCARS CARE',
    title: '周末回来 养车选UCARS',
    intro: '周末出游回来，洗车、取送车、漆面与内饰养护——左右滑动看看 UCARS 养车服务。',
    images: [
      'assets/img/ucars-care/care-01.jpg',
      'assets/img/ucars-care/care-02.jpg',
      'assets/img/ucars-care/care-03.jpg',
      'assets/img/ucars-care/care-04.jpg',
      'assets/img/ucars-care/care-05.jpg'
    ],
    imageAlts: [
      '周末出游回来 · 德式精洗 PLUS',
      '会员取送车服务',
      '漆面净化与打蜡养护',
      '漆面划痕处理 · 全车抛光打蜡',
      '德式匠人内饰精洗'
    ],
    footnote: '服务项目、方案与费用以门店确认为准；可通过海报二维码预约或咨询客服。'
  },

  /* ---------- 4. 现场体验 ---------- */
  experience: {
    kicker: 'EXPERIENCE',
    title: '来现场，可以这样体验',
    intro: '午休或下班路过，看看车、坐进座舱，完成现场打卡领取好礼。',
    items: [
      {
        icon: 'harmony', name: '鸿蒙生态体验',
        tags: ['超级桌面', '一碰流转', '小艺语音'],
        desc: '由产品顾问带领，使用现场演示设备体验手机与座舱的协同。仅演示现场实际可用的功能'
      },
      {
        icon: 'cabin', name: '座舱场景',
        tags: ['小憩 / 露营模式', '氛围灯'],
        desc: '坐进车里，感受不同场景下的座舱状态。按车型实际配置演示。'
      },
      {
        icon: 'camera', name: '现场打卡',
        tags: ['UCARS 打卡点', '轻量拍照'],
        desc: '在广场 UCARS 打卡点拍照，按现场指引完成打卡。'
      },
      {
        icon: 'stamp', name: '打卡领好礼',
        tags: ['每日12点起', '先到先得'],
        desc: '完成打卡后领取现场好礼；数量有限，领完即止，以现场公示为准。'
      }
    ]
  },

  /* ---------- 5. 参与方式 ---------- */
  join: {
    kicker: 'HOW TO JOIN',
    title: '来现场，按自己的节奏逛',
    steps: [
      { title: '逛车与生活场景', desc: '看看现场展车，体验开放的座舱与场景布置。' },
      { title: '周末去哪儿？装备你来配', desc: '看看目的地灵感与出行装备组合，拍下一张自己的秋日周末清单。就在享界 G9 旁。' },
      { title: '周末回来 养车选UCARS', desc: '洗车精洗、会员取送车、漆面与内饰养护——现场了解 UCARS 养车服务，也可扫码预约。' },
      { title: '现场打卡领好礼', desc: '在广场打卡点拍照，按现场指引完成打卡；每日 12:00 开始领取，数量有限先到先得，礼品以现场公示为准。' }
    ],
    noPhone: {
      title: '',
      desc: ''
    },
    privacy: '',
    privacyTbc: false
  },

  /* ---------- 5. 打卡领好礼 ---------- */
  gift: {
    kicker: 'HALLOWEEN GIFT',
    title: '打卡领好礼',
    lead: '每日12点开始 · 数量有限先到先得',
    image: 'assets/img/halloween-candy-checkin-gift.jpg',
    imageAlt: '糖给你，好运也给你 · 打卡领好礼',
    images: [
      'assets/img/halloween-candy-checkin-gift.jpg',
      'assets/img/halloween-gift-bags.png',
      'assets/img/halloween-checkin-howto.jpg'
    ],
    imageAlts: [
      '糖给你，好运也给你 · 打卡领好礼',
      '万圣节礼包 · 打卡领好礼',
      '打卡领好礼 · 两步领礼'
    ],
    split: [],
    rules: [
      '须按现场公示规则完成现场打卡后领取。',
      '每日余量以现场为准，领完即止。',
      '礼品实物与核验方式以现场公示为准。'
    ],
    tbc: false
  },

  /* ---------- 6. 抽奖（已删除） ---------- */
  lottery: {
    enabled: false
  },

  /* ---------- 7. 购车礼遇 ---------- */
  benefits: {
    enabled: true,
    brandText: '鸿蒙智行授权用户中心',
    kicker: '前海人寿金融中心 · 楼宇专属礼遇',
    title: '前海人寿金融中心专属购车权益',
    lead: '为前海人寿金融中心业主与员工准备的专属购车礼遇。适用范围和细则以品牌最终公布为准。',
    pending: '',
    categories: ['到店体验礼', '金融与智能权益', '锁单与提车礼遇', '车主与转介绍礼'],
    note: '权益项目、金额、适用车型、活动期限、参与条件与叠加规则，以品牌最终活动细则为准。',
    storesTitle: '试驾承接门店',
    stores: [
      { name: '鸿蒙智行授权用户中心·深圳宝安沙井北环路', phone: '0755-83666123' },
      { name: '鸿蒙智行授权用户中心·深圳龙华龙观大道', phone: '0755-61006888' }
    ]
  },

  /* ---------- 8. 现场导览（已下线） ---------- */
  map: {
    enabled: false,
    kicker: 'SITE GUIDE',
    title: '现场导览',
    note: '依据现场效果图整理 · 点位示意；以现场为准',
    image: 'assets/img/site-guide.png',
    imageAlt: '前海人寿金融中心前广场现场导览',
    route: [
      '入口（T1 / T2 两侧人行通道）',
      '展车区（四大生活场景）',
      '现场打卡',
      '礼品领取',
      '试驾咨询'
    ],
    openNote: '赛百味、M STAND 出入口及经营通道正常开放，请放心通行。'
  },

  /* ---------- 9. 温馨提示 ---------- */
  tips: {
    kicker: 'NOTICE',
    title: '温馨提示',
    items: [
      '遇降雨、大风或台风预警，可能暂停户外互动，请以现场通知为准。',
      '展车为静态展示；试驾由试驾承接门店安排（深圳宝安沙井北环路 0755-83666123；深圳龙华龙观大道 0755-61006888），名额以现场为准。',
      '请勿占用楼梯、扶梯、人行及消防通道，注意过往车辆。',
      '午间日照较强，请注意防晒补水。'
    ]
  },

  /* ---------- 页脚 ---------- */
  footer: {
    brand: '前海人寿金融中心秋日车生活嘉年华 · UCARS',
    logo: 'assets/img/ucars-logo-official.png',
    lines: [
      '活动细则以现场公示及品牌发布为准'
    ]
  },

  placeholderToast: '入口请以现场公示为准'
};
