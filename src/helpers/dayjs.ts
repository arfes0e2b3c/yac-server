import inst, { PluginFunc, UnitType } from 'dayjs'

declare module 'dayjs' {
	interface Dayjs {
		floor(unit: Exclude<UnitType, 'date' | 'dates'>, amount: number): inst.Dayjs
	}
}

export const floor: PluginFunc = (option, dayjsClass) => {
	dayjsClass.prototype.floor = function (unit, amount) {
		return this.subtract(this.get(unit) % amount, unit).startOf(unit)
	}
}
