import { Context } from 'hono'
import { env as getEnv } from 'hono/adapter'
import OpenAI from 'openai'
import { ReneEnv } from '../types'

// const openai = new OpenAI()

class OpenAiApi {
	async evaluateSentiment(c: Context, text: string) {
		const openAiApiKey = getEnv<ReneEnv>(c).OPENAI_API_KEY
		const openai = new OpenAI({
			apiKey: openAiApiKey,
		})

		const res = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'user',
					content: evaluateSentimentPrompt(text),
				},
			],
		})
		return Number(res.choices[0].message.content)
	}
}

export const openAiApi = new OpenAiApi()

const evaluateSentimentPrompt = (
	text: string
) => `以下の文章について感情分析を行い、次のルールに従ってスコアを出力してください。出力するのはスコアだけで、それ以外は出力しないでください。

# 文章
${text}

# スコアリング基準
1. スコア範囲
スコアは -1 から 1 までの小数値で算出します（小数点第2位まで）。
感情が完全に中立でない限り、スコアは -0.1 ～ 0.1 の範囲を避けてください。

2. スコア段階
-1 ～ -0.9 / 0.9 ～ 1: 人生における非常に重大な出来事や危機。
例： 人生を変えるような大成功、大切な人の喪失感。
（避けるべきスコア範囲。特別な場合以外、このスコアは出さないでください。）
-0.89 ～ -0.75 / 0.75 ～ 0.89: 日常を逸脱した稀な出来事。
例： 重要な試験の合格、大規模なプロジェクトの達成、恋人との別れ、特別な記念日。
-0.74 ～ -0.5 / 0.5 ～ 0.74: 日常の中では大きな出来事。
例： 仕事での大きな成功やミス、恋人とのデートでの大きな喜び。
-0.49 ～ -0.3 / 0.3 ～ 0.49: 日常の中程度の出来事。
例： 同僚に対する小さな不満、人に褒められる、思いがけない幸運。
-0.29 ～ -0.11 / 0.11 ～ 0.29: 日常の小程度の出来事。
例： 些細な苛立ちや喜び、些末な気になり。
-0.1 ～ 0.1: 中立的で感情がほとんど動いていない状態（スコアはできる限りこの範囲を避ける）。

3. 補正ルール
- 文脈を重視して、最終的な感情がスコアに反映されるようにしてください。
- 長い文章は感情が強調される傾向があるため、文章の長さに応じてスコアに最大 1.25倍 の補正をかけてください。
- 補正後もスコアが -1 または 1 を超えないようにしてください。
`
