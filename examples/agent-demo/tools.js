// e:\Vue\vue-project\examples\agent-demo\tools.js
/**
 * 模拟的工具库，Agent 可以调用的外部能力
 */
const tools = {
  // 获取天气工具
  get_weather: (city) => {
    const mockData = {
      '北京': '晴，25°C',
      '上海': '雨，20°C',
      '广州': '多云，28°C',
      'Paris': 'Sunny, 18°C'
    };
    return mockData[city] || '未知天气';
  },

  // 获取穿衣建议
  get_clothing_advice: (weather) => {
    if (weather.includes('雨')) return '建议带伞，穿防水外套。';
    if (weather.includes('25') || weather.includes('28')) return '天气炎热，建议穿短袖。';
    return '气温适中，建议穿长袖或薄外套。';
  }
};

module.exports = tools;
