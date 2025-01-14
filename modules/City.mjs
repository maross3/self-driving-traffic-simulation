import {Intersection} from "./Intersection.mjs";
import {Road} from "./Road.mjs";
import {Connection} from "./Connection.mjs";

export class City {
    intersections = [];
    roads = [];

    constructor() {
    }

    buildIntersection(x, y, center = false) {
        let inter;
        if (center)
            inter = new Intersection(x - Intersection.width / 2, y - Intersection.height / 2);
        else
            inter = new Intersection(x, y);

        this.intersections.push(inter);

        return inter;
    }

    intersect(x, y) {
        let inter = this.getIntersectionAt(x, y);
        return !(inter === null && this.potentialBoundsCleared(x, y));
    }

    potentialBoundsCleared(x, y) {
        return (this.topRightIntersectionClear(x, y) &&
            this.bottomRightIntersectionClear(x, y) &&
            this.bottomLeftIntersectionClear(x, y) &&
            this.topLeftIntersectionClear(x, y))
    }

    topLeftIntersectionClear(x, y) {
        return this.getIntersectionAt(x - Intersection.width / 2, y - Intersection.height / 2) === null;
    }

    topRightIntersectionClear(x, y) {
        return this.getIntersectionAt(x + Intersection.width / 2,
            y + Intersection.height / 2) === null;
    }

    bottomLeftIntersectionClear(x, y) {
        return this.getIntersectionAt(x - Intersection.width / 2,
            y + Intersection.height / 2) === null;
    }

    bottomRightIntersectionClear(x, y) {
        return this.getIntersectionAt(x + Intersection.width / 2, y + Intersection.width / 2) === null;
    }

    buildRoad(connectionA, connectionB) {
        const road = new Road(connectionA, connectionB);
        this.roads.push(road);
        return road;
    }

    autoBuildRoad(interA, interB) {
        let connectionA;
        let connectionB;

        if (Math.abs(interA.x - interB.x) < Math.abs(interA.y - interB.y)) {
            if (interA.y < interB.y) {
                connectionA = new Connection(interA, 2);
                connectionB = new Connection(interB, 0);
            } else {
                connectionA = new Connection(interA, 0);
                connectionB = new Connection(interB, 2);
            }
            if (connectionA.valid === false) {
                if (interA.x < interB.x) {
                    connectionA = new Connection(interA, 1);
                } else {
                    connectionA = new Connection(interA, 3);
                }
            }
            if (connectionB.valid === false) {
                if (interA.x < interB.x) {
                    connectionB = new Connection(interB, 3);
                } else {
                    connectionB = new Connection(interB, 1);
                }
            }
        } else {
            if (interA.x < interB.x) {
                connectionA = new Connection(interA, 1);
                connectionB = new Connection(interB, 3);
            } else {
                connectionA = new Connection(interA, 3);
                connectionB = new Connection(interB, 1);
            }
            if (connectionA.valid === false) {
                if (interA.y < interB.y) {
                    connectionA = new Connection(interA, 2);
                } else {
                    connectionA = new Connection(interA, 0);
                }
            }
            if (connectionB.valid === false) {
                if (interA.y < interB.y) {
                    connectionB = new Connection(interB, 0);
                } else {
                    connectionB = new Connection(interB, 2);
                }
            }
        }

        if (connectionA.valid && connectionB.valid) {
            return this.buildRoad(connectionA, connectionB);
        } else {
            console.warn("autoBuildRoad failed to make a valid connection");
            return null;
        }
    }

    getIntersectionAt(x, y) {
        let match = null;
        let width = Intersection.width;
        let height = Intersection.height;

        this.intersections.forEach(inter => {
            if (match) return;
            if (Math.abs((inter.x + width / 2) - x) < width / 2 && Math.abs((inter.y + height / 2) - y) < height / 2)
                match = inter;
        });
        return match;
    }

    draw(ctx) {
        this.roads.forEach(road => {
            road.draw(ctx);
        });
        this.intersections.forEach(inter => {
            inter.draw(ctx);
        });
    }
}
