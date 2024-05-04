class particle {
	constructor(x, y) {
		this.pos = {
			x : x,
			y : y
		}
		this.speed = {
			x : 0,
			y : 0
		}
		this.acc = {
			x : 0,
			y : 0
		}

		this.speedLimitMin = .00001;
		this.speedDepletion = .05;
		this.accDepletion = .1;
	}

	update() {
		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;
		this.speed.x += this.acc.x;
		this.speed.y += this.acc.y;

		if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height)
			this.wrap();

		if (Math.abs(this.speed.x) < this.speedLimitMin) this.speed.x = 0;
			else this.speed.x /= (this.speedDepletion+1);

		if (Math.abs(this.speed.y) < this.speedLimitMin) this.speed.y = 0;
			else this.speed.y /= (this.speedDepletion+1);

		if (Math.abs(this.acc.x) < this.speedLimitMin) this.acc.x = 0;
			else this.acc.x /= (this.accDepletion+1);

		if (Math.abs(this.acc.y) < this.speedLimitMin) this.acc.y = 0;
			else this.acc.y /= (this.accDepletion+1);
	}

	applyForce(x ,y) {
		this.acc.x += x;
		this.acc.y += y;
	}

	wrap() {
		this.pos.x = (this.pos.x+width)%width;
		this.pos.y = (this.pos.y+height)%height;
	}
}

let points = [], flowfeild = [], flowRes = [500, 250], noiseZoom = 150, flowSpeed = .05;

function setup() {
	createCanvas(window.visualViewport.width, window.visualViewport.height);
	background(255, 0, 0);
	stroke(255);
	strokeWeight(3);

	for (let i = 0; i < 500; i++) {
		points.push(new particle(random(width), random(height)));
	}

	for (let i = 0; i < flowRes[1]; i++) {
		flowfeild.push([]);
		for (let j = 0; j < flowRes[0]; j++) {
			flowfeild[i].push([]);
			flowfeild[i][j].push((noise(j/noiseZoom, i/noiseZoom)*flowSpeed)-(flowSpeed/2));
			flowfeild[i][j].push((noise((j/noiseZoom)+1000, (i/noiseZoom)+1000)*flowSpeed)-(flowSpeed/2));
		}
	}
}

function draw() {
	background(0, 0, 0, 10);
	//displayFlow();
	displayPoints();
	applyFeildForce();
}

function displayPoints() {
	stroke(255);
	strokeWeight(1);
	for (let i = 0; i < points.length; i++) {
		point(points[i].pos.x, points[i].pos.y);
	}
	stroke(2000, 0, 200, 10);
	strokeWeight(10);
	for (let i = 0; i < points.length; i++) {
		point(points[i].pos.x, points[i].pos.y);
		points[i].update();
	}
}

function applyFeildForce() {
	for (let i = 0; i < points.length; i++) {
		let x = Math.floor(map(points[i].pos.x, 0, width, 0, flowRes[0])),
		y = Math.floor(map(points[i].pos.y, 0, height, 0, flowRes[1]));
		points[i].applyForce(flowfeild[y][x][0], flowfeild[y][x][1]);
	}
}

function displayFlow() {
	strokeWeight(.1);
	stroke(255);

	for (let i = 0; i < flowRes[1]; i++) {
		for (let j = 0; j < flowRes[0]; j++) {
			let x1 = j*(width/flowRes[0]),
			y1 = i*(height/flowRes[1]),
			x2 = x1+(flowfeild[i][j][0]*500),
			y2 = y1+(flowfeild[i][j][1]*500);

			line(x1, y1, x2, y2);
		}
	}
}
