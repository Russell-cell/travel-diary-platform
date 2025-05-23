// 假设数据源是这样的结构：countries -> provinces -> cities
export default [
  {
    name: '中国',
    provinces: [
      {
        name: "北京",
        cities: ["北京市"]
      },
      {
        name: "天津",
        cities: ["天津市"]
      },
      {
        name: "河北省",
        cities: ["石家庄市", "唐山市", "秦皇岛市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "沧州市", "廊坊市", "衡水市"]
      },
      {
        name: "山西省",
        cities: ["太原市", "大同市", "阳泉市", "长治市", "晋城市", "朔州市", "晋中市", "运城市", "忻州市", "临汾市", "吕梁市"]
      },
      {
        name: "内蒙古自治区",
        cities: ["呼和浩特市", "包头市", "乌海市", "赤峰市", "通辽市", "鄂尔多斯市", "呼伦贝尔市", "巴彦淖尔市", "乌兰察布市", "兴安盟", "锡林郭勒盟", "阿拉善盟"]
      },
      {
        name: "辽宁省",
        cities: ["沈阳市", "大连市", "鞍山市", "抚顺市", "本溪市", "丹东市", "锦州市", "营口市", "阜新市", "辽阳市", "盘锦市", "铁岭市", "朝阳市", "葫芦岛市"]
      },
      {
        name: "吉林省",
        cities: ["长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"]
      },
      {
        name: "黑龙江省",
        cities: ["哈尔滨市", "齐齐哈尔市", "鸡西市", "鹤岗市", "双鸭山市", "大庆市", "伊春市", "佳木斯市", "七台河市", "牡丹江市", "黑河市", "绥化市", "大兴安岭地区"]
      },
      {
        name: "上海",
        cities: ["上海市"]
      },
      {
        name: "江苏省",
        cities: ["南京市", "无锡市", "徐州市", "常州市", "苏州市", "南通市", "连云港市", "淮安市", "盐城市", "扬州市", "镇江市", "泰州市", "宿迁市"]
      },
      {
        name: "浙江省",
        cities: ["杭州市", "宁波市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "衢州市", "舟山市", "台州市", "丽水市"]
      },
      {
        name: "安徽省",
        cities: ["合肥市", "芜湖市", "蚌埠市", "淮南市", "马鞍山市", "淮北市", "铜陵市", "安庆市", "黄山市", "滁州市", "阜阳市", "宿州市", "六安市", "亳州市", "池州市", "宣城市"]
      },
      {
        name: "福建省",
        cities: ["福州市", "厦门市", "莆田市", "三明市", "泉州市", "漳州市", "南平市", "龙岩市", "宁德市"]
      },
      {
        name: "江西省",
        cities: ["南昌市", "景德镇市", "萍乡市", "九江市", "新余市", "鹰潭市", "赣州市", "吉安市", "宜春市", "抚州市", "上饶市"]
      },
      {
        name: "山东省",
        cities: ["济南市", "青岛市", "淄博市", "枣庄市", "东营市", "烟台市", "潍坊市", "济宁市", "泰安市", "威海市", "日照市", "莱芜市", "临沂市", "德州市", "聊城市", "滨州市", "菏泽市"]
      },
      {
        name: "河南省",
        cities: ["郑州市", "开封市", "洛阳市", "平顶山市", "安阳市", "鹤壁市", "新乡市", "焦作市", "濮阳市", "许昌市", "漯河市", "三门峡市", "南阳市", "商丘市", "信阳市", "周口市", "驻马店市"]
      },
      {
        name: "湖北省",
        cities: ["武汉市", "黄石市", "十堰市", "宜昌市", "襄阳市", "鄂州市", "荆门市", "孝感市", "荆州市", "黄冈市", "咸宁市", "随州市", "恩施土家族苗族自治州"]
      },
      {
        name: "湖南省",
        cities: ["长沙市", "株洲市", "湘潭市", "衡阳市", "邵阳市", "岳阳市", "常德市", "张家界市", "益阳市", "郴州市", "永州市", "怀化市", "娄底市", "湘西土家族苗族自治州"]
      },
      {
        name: "广东省",
        cities: ["广州市", "韶关市", "深圳市", "珠海市", "汕头市", "佛山市", "江门市", "湛江市", "茂名市", "肇庆市", "惠州市", "梅州市", "汕尾市", "河源市", "阳江市", "清远市", "东莞市", "中山市", "东沙群岛", "潮州市", "揭阳市", "云浮市"]
      },
      {
        name: "广西壮族自治区",
        cities: ["南宁市", "柳州市", "桂林市", "梧州市", "北海市", "防城港市", "钦州市", "贵港市", "玉林市", "百色市", "贺州市", "河池市", "来宾市", "崇左市"]
      },
      {
        name: "海南省",
        cities: ["海口市", "三亚市", "三沙市"]
      },
      {
        name: "重庆",
        cities: ["重庆市"]
      },
      {
        name: "四川省",
        cities: ["成都市", "自贡市", "攀枝花市", "泸州市", "德阳市", "绵阳市", "广元市", "遂宁市", "内江市", "乐山市", "南充市", "眉山市", "宜宾市", "广安市", "达州市", "雅安市", "巴中市", "资阳市", "阿坝藏族羌族自治州", "甘孜藏族自治州", "凉山彝族自治州"]
      },
      {
        name: "贵州省",
        cities: ["贵阳市", "六盘水市", "遵义市", "安顺市", "铜仁市", "黔西南布依族苗族自治州", "毕节市", "黔东南苗族侗族自治州", "黔南布依族苗族自治州"]
      },
      {
        name: "云南省",
        cities: ["昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "普洱市", "临沧市", "楚雄彝族自治州", "红河哈尼族彝族自治州", "文山壮族苗族自治州", "西双版纳傣族自治州", "大理白族自治州", "德宏傣族景颇族自治州", "怒江傈僳族自治州", "迪庆藏族自治州"]
      },
      {
        name: "西藏自治区",
        cities: ["拉萨市", "昌都市", "山南地区", "日喀则市", "那曲地区", "阿里地区", "林芝市"]
      },
      {
        name: "陕西省",
        cities: ["西安市", "铜川市", "宝鸡市", "咸阳市", "渭南市", "延安市", "汉中市", "榆林市", "安康市", "商洛市"]
      },
      {
        name: "甘肃省",
        cities: ["兰州市", "嘉峪关市", "金昌市", "白银市", "天水市", "武威市", "张掖市", "平凉市", "酒泉市", "庆阳市", "定西市", "陇南市", "临夏回族自治州", "甘南藏族自治州"]
      },
      {
        name: "青海省",
        cities: ["西宁市", "海东市", "海北藏族自治州", "黄南藏族自治州", "海南藏族自治州", "果洛藏族自治州", "玉树藏族自治州", "海西蒙古族藏族自治州"]
      },
      {
        name: "宁夏回族自治区",
        cities: ["银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"]
      },
      {
        name: "新疆维吾尔自治区",
        cities: ["乌鲁木齐市", "克拉玛依市", "吐鲁番市", "哈密地区", "昌吉回族自治州", "博尔塔拉蒙古自治州", "巴音郭楞蒙古自治州", "阿克苏地区", "克孜勒苏柯尔克孜自治州", "喀什地区", "和田地区", "伊犁哈萨克自治州", "塔城地区", "阿勒泰地区"]
      },
      {
        name: "台湾",
        cities: ["台北市", "高雄市", "台南市", "台中市", "金门县", "南投县", "基隆市", "新竹市", "嘉义市", "新北市", "宜兰县", "新竹县", "桃园县", "苗栗县", "彰化县", "嘉义县", "云林县", "屏东县", "台东县", "花莲县", "澎湖县", "连江县"]
      },
      {
        name: "香港特别行政区",
        cities: ["香港岛", "九龙", "新界"]
      },
      {
        name: "澳门特别行政区",
        cities: ["澳门半岛", "离岛"]
      }
    ]
  },
  {
    name: "英国",
    provinces: [
      {
        name: "英格兰",
        cities: ["伦敦", "曼彻斯特", "伯明翰", "利物浦", "利兹", "布里斯托"]
      },
      {
        name: "苏格兰",
        cities: ["爱丁堡", "格拉斯哥", "阿伯丁", "邓迪", "因弗内斯"]
      },
      {
        name: "威尔士",
        cities: ["卡迪夫", "斯旺西", "新港", "班戈"]
      },
      {
        name: "北爱尔兰",
        cities: ["贝尔法斯特", "伦敦德里", "纽里", "阿马尔"]
      }
    ]
  },
  {
    name: "美国",
    provinces: [
      { name: "加利福尼亚州", cities: ["洛杉矶", "旧金山", "圣地亚哥", "圣荷西"] },
      { name: "纽约州", cities: ["纽约市", "布鲁克林", "奥尔巴尼"] },
      { name: "德克萨斯州", cities: ["休斯顿", "达拉斯", "奥斯汀", "圣安东尼奥"] }
    ]
  },
  {
    name: "法国",
    provinces: [
      { name: "法兰西岛", cities: ["巴黎", "马赛", "里昂", "图卢兹"] },
      { name: "奥克西塔尼", cities: ["波尔多", "图卢兹", "米卢斯"] },
      { name: "普罗旺斯", cities: ["马赛", "尼斯", "阿维尼翁"] }
    ]
  },
  {
    name: "德国",
    provinces: [
      { name: "巴伐利亚州", cities: ["慕尼黑", "奥格斯堡", "纽伦堡", "维尔茨堡"] },
      { name: "威斯特法伦州", cities: ["杜塞尔多夫", "科隆", "多特蒙德", "波鸿"] }
    ]
  },
  {
    name: "意大利",
    provinces: [
      { name: "拉齐奥", cities: ["罗马", "拉丁", "费鲁特"] },
      { name: "坎帕尼亚", cities: ["那不勒斯", "萨莱诺", "庞贝"] },
      { name: "托斯卡纳", cities: ["佛罗伦萨", "比萨", "锡耶纳"] }
    ]
  },
  {
    name: "日本",
    provinces: [
      { name: "东京都", cities: ["东京", "横滨", "川崎", "千叶"] },
      { name: "大阪府", cities: ["大阪", "堺", "岸和田"] },
      { name: "北海道", cities: ["札幌", "函馆", "小樽"] }
    ]
  },
  {
    name: "西班牙",
    provinces: [
      { name: "加泰罗尼亚", cities: ["巴塞罗那", "塞维利亚", "马德里"] },
      { name: "安达卢西亚", cities: ["马拉加", "格拉纳达", "塞维利亚"] },
      { name: "巴利阿里群岛", cities: ["马略卡岛", "伊维萨岛", "弗雷伊岛"] }
    ]
  },
  {
    name: "澳大利亚",
    provinces: [
      { name: "新南威尔士", cities: ["悉尼", "新堡", "伍伦贡"] },
      { name: "维多利亚", cities: ["墨尔本", "吉朗", "本迪戈"] },
      { name: "昆士兰", cities: ["布里斯班", "黄金海岸", "凯恩斯"] }
    ]
  },
  {
    name: "加拿大",
    provinces: [
      { name: "安大略省", cities: ["多伦多", "渥太华", "密西沙加"] },
      { name: "魁北克省", cities: ["蒙特利尔", "魁北克市", "舍布鲁克"] },
      { name: "不列颠哥伦比亚省", cities: ["温哥华", "维多利亚", "本拿比"] }
    ]
  },
  {
    name: "巴西",
    provinces: [
      { name: "圣保罗", cities: ["圣保罗", "里约热内卢", "萨尔瓦多"] },
      { name: "里约热内卢", cities: ["里约热内卢", "新圣彼得堡", "里约大区"] },
      { name: "米纳斯吉拉斯", cities: ["贝洛奥里藏特", "乌贝兰迪亚", "伊塔基"] }
    ]
  },
  {
    name: "俄罗斯",
    provinces: [
      { name: "莫斯科", cities: ["莫斯科", "圣彼得堡", "新西伯利亚"] },
      { name: "圣彼得堡", cities: ["圣彼得堡", "诺夫哥罗德", "新加里宁格勒"] },
      { name: "喀山", cities: ["喀山", "叶卡捷琳堡", "喀秋莎"] }
    ]
  },
  {
    name: "墨西哥",
    provinces: [
      { name: "墨西哥城", cities: ["墨西哥城", "瓜达拉哈拉", "蒙特雷"] },
      { name: "哈利斯科", cities: ["瓜达拉哈拉", "托雷翁", "齐马塔兰"] },
      { name: "新莱昂", cities: ["蒙特雷", "圣尤利安", "瓜达鲁普埃"] }
    ]
  }
]