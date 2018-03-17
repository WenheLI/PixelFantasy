class JarvisMarch {
    //the JarvisMarch class is built to sort an array of points
    //in the sorted order, they can be connected and build a polygon
    constructor(points) {
        this.points = points;
    }

    compare(a, b) {
        return ((a.y < b.y) || (a.y === b.y && a.x < b.x));
    }

    cross(o, a, b) {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }

    distSq(a, b) {
        return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
    }

    aIsFar(o, a, b) {
        return this.distSq(o, a) > this.distSq(o, b);
    }

    jarvisMarch() {
        let inputs = this.points;
        let outputs = [];
        let start = 0;
        for (let i = 0; i < inputs.length; ++i) {
            if (this.compare(inputs[i], inputs[start])) start = i;
        }
        outputs.push(inputs[start]);
        for (let output_length = 1; true; output_length++) {
            let next = start;
            for (let i = 0; i < inputs.length; ++i) {
                let c = this.cross(outputs[output_length - 1], inputs[i], inputs[next]);
                if (c > 0 || c === 0 && this.aIsFar(outputs[output_length - 1], inputs[i], inputs[next])) {
                    next = i;
                }
            }
            if (next === start) break;
            outputs[output_length] = inputs[next];
        }
        this.points = outputs;
        return outputs;
    }
}