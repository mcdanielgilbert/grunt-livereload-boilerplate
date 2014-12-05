
/*
 *Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 *You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 *Unless required by applicable law or agreed to in writing, software
 *distributed under the License is distributed on an "AS IS" BASIS,
 *WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *See the License for the specific language governing permissions and
 *limitations under the License.
 */

/*
 * Adopted from Seth Ladd's excellent Box2D Tutorial
 * http://blog.sethladd.com/2011/09/box2d-javascript-example-walkthrough.html
 */
window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

var canvas = document.getElementById('c');
var SCALE = 30;

world = new Box2D.Dynamics.b2World(
	new Box2D.Common.Math.b2Vec2(0, 10),    //gravity
	true                 //allow sleep
);


(function makeGround(){
	// fixture definition defines attributes of the object, 
	// e.g. density, friction, restitution (bounciness)
	var fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	var bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

	// positions the center of the object (not upper left like HTML5 Canvas!)
	bodyDef.position.x = canvas.width / 2 / SCALE;
	bodyDef.position.y = canvas.height / SCALE;

	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	fixDef.shape.SetAsBox((600 / SCALE) / 2, (10/SCALE) / 2);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

})();

(function makeObjects(){
	var fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	var bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

	//make a bunch of random circles or rectangles
	for(var i = 0; i < 100; ++i) {
		if(Math.random() > 0.5) {
			fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
			fixDef.shape.SetAsBox(
				Math.random() + 0.1, //half width
				Math.random() + 0.1 //half height
			);
		} else {
			fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(
				Math.random() + 0.1 //radius
			);
		}
		bodyDef.position.x = Math.random() * 25;
		bodyDef.position.y = Math.random() * 10;
		world.CreateBody(bodyDef).CreateFixture(fixDef);
	}
})();

//setup debug draw
var debugDraw = new Box2D.Dynamics.b2DebugDraw();
debugDraw.SetSprite(document.getElementById("c").getContext("2d"));
debugDraw.SetDrawScale(SCALE);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

function update(){
	world.Step(
		1 / 60,   //frame-rate
		10,       //velocity iterations
		10       //position iterations
	);
	world.DrawDebugData();
	world.ClearForces();

	requestAnimFrame(update);
}

requestAnimFrame(update);

