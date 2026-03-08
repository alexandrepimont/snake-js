export default class Board {
	constructor() {
		this.init();
		this.create();
	}
	init() {
		this.cells = [];
		this.boadWidth = 20;
		this.boadHeight = 20;
	}
	create() {
		for (let x = 0; x < this.boadWidth; x++) {
			for (let y = 0; y < this.boadHeight; y++) {
				this.cells.push({ x, y });
			}
		}
	}
}
