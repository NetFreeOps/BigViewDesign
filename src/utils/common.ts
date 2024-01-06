const padLeft = function(str: string | number, length: number, replaceChar?: string): string {
	return ("0000000000000000".replace(/[0]/g, replaceChar || '0') + str).substr(-length);
}

export function randomExtend(minNum: number, maxNum: number): number {
	if (arguments.length === 1) {
		return parseInt((Math.random() * minNum + 1).toString(), 10);
	} else {
		return parseInt((Math.random() * (maxNum - minNum + 1) + minNum).toString(), 10);
	}
}
// 防抖函数
export function debounce(delay, callback) {
	let lastTime

	return function() {
		clearTimeout(lastTime)

		const [that, args] = [this, arguments]

		lastTime = setTimeout(() => {
			callback.apply(that, args)
		}, delay)
	}
}

export function observerDomResize(dom, callback) {
	const MutationObserver = window.MutationObserver || window.MutationObserver || window.MutationObserver

	const observer = new MutationObserver(callback)

	observer.observe(dom, {
		attributes: true,
		attributeFilter: ['style'],
		attributeOldValue: true
	})

	return observer
}

export function getPointDistance(pointOne, pointTwo) {
	const minusX = Math.abs(pointOne[0] - pointTwo[0])

	const minusY = Math.abs(pointOne[1] - pointTwo[1])

	return Math.sqrt(minusX * minusX + minusY * minusY)
}

export function uuid(hasHyphen) {
	return (hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g,
		function(c) {
			const r = Math.random() * 16 | 0
			const v = c == 'x' ? r : (r & 0x3 | 0x8)
			return v.toString(16)
		})
}

export function swapItems(arr, index1, index2, direction) {
	if (direction == "up") { //置顶
		arr.unshift(arr[index1]);
		arr.splice(index1 + 1, 1);
		return arr;
	}
	if (direction == "down") { //置底
		arr.push(arr[index1]);
		arr.splice(index1, 1);
		return arr;
	}
	arr[index1] = arr.splice(index2, 1, arr[index1])[0];
	return arr;
}

export function getNowDT(addDay, date) {
	date = date || new Date();
	addDay = addDay || 0;
	date.setDate(date.getDate() + addDay);
	return date.getFullYear() + "-" + padLeft((date.getMonth() + 1), 2) + "-" + padLeft(date.getDate(), 2) +
		" " + padLeft(date.getHours(), 2) + ":" + padLeft(date.getMinutes(), 2) + ":" + padLeft(date.getSeconds(), 2);
}