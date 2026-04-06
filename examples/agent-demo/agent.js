// e:\Vue\vue-project\examples\agent-demo\agent.js
const tools = require('./tools');

/**
 * 模拟 Agent 核心逻辑
 * 展示 ReAct (Reasoning + Acting) 循环
 */
class Agent {
  constructor(query) {
    this.query = query;
    this.step = 1;
  }

  // 模拟大脑决策 (实际上这一步会调用 LLM)
  // state 现在是一个对象，包含当前已有的观察结果
  async brain(state) {
    console.log(`\n--- 第 ${this.step} 步思维 ---`);
    
    if (!state.weather) {
      return {
        thought: `用户想知道 ${this.query}。我需要先查询北京的天气。`,
        action: 'get_weather',
        params: '北京'
      };
    } 
    
    if (!state.advice) {
      return {
        thought: `北京现在的天气是 ${state.weather}。现在我需要获取针对这个天气的穿衣建议。`,
        action: 'get_clothing_advice',
        params: state.weather
      };
    }

    return {
      thought: `我已经拿到了天气和建议。现在可以回答用户了。`,
      finalAnswer: `北京现在的天气是 ${state.weather}，${state.advice}`
    };
  }

  // 执行循环
  async run() {
    console.log(`用户提问: ${this.query}`);
    let state = {
      weather: null,
      advice: null
    };
    let isFinished = false;

    // 限制最大步骤，防止死循环
    const MAX_STEPS = 5;

    while (!isFinished && this.step <= MAX_STEPS) {
      // 1. 推理 (Thought)
      const decision = await this.brain(state);
      console.log(`思考: ${decision.thought}`);

      if (decision.finalAnswer) {
        // 最终回答
        console.log(`\n✅ 最终结果: ${decision.finalAnswer}`);
        isFinished = true;
      } else {
        // 2. 行动 (Action)
        console.log(`执行工具: ${decision.action}(${decision.params})`);
        const observation = tools[decision.action](decision.params);
        
        // 3. 观察 (Observation)
        console.log(`观察结果: ${observation}`);
        
        // 更新状态
        if (decision.action === 'get_weather') {
          state.weather = observation;
        } else if (decision.action === 'get_clothing_advice') {
          state.advice = observation;
        }
        this.step++;
      }
    }

    if (this.step > MAX_STEPS) {
      console.log('达到最大步数限制，停止运行。');
    }
  }
}

// 启动 Agent
const myAgent = new Agent('北京现在的穿衣建议是什么？');
myAgent.run();
