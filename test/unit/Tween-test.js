suite('Tween', function() {

    // ======================================================
    test('tween node', function(done) {
        var stage = addStage();

        var layer = new Konva.Layer();

        var circle = new Konva.Circle({
            x: 100,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'blue',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);

        var finishCount = 0;
        var onFinish = function() {
            assert(++finishCount <= 1, 'finishCount should not exceed 1');
            done();
        }

        var tweens = 0;
        var attrs = 0;

        for (var key in Konva.Tween.tweens) {
            tweens++;
        }
        for (var key in Konva.Tween.attrs) {
            attrs++;
        }

        assert.equal(tweens, 0);
        assert.equal(attrs, 0);

        var tween = new Konva.Tween({
            node: circle,
            duration: 0.2,
            x: 200,
            y: 100,
            onFinish: onFinish
        }).play();

        var tweens = 0;
        var attrs = 0;
        for (var key in Konva.Tween.tweens) {
            tweens++;
        }
        for (var key in Konva.Tween.attrs[circle._id][tween._id]) {
            attrs++;
        }

        assert.equal(tweens, 1);
        assert.equal(attrs, 2);

        assert.notEqual(Konva.Tween.attrs[circle._id][tween._id].x, undefined);
        assert.notEqual(Konva.Tween.attrs[circle._id][tween._id].y, undefined);

    });

    // ======================================================
    test('destroy tween while tweening', function() {
        var stage = addStage();

        var layer = new Konva.Layer();

        var circle = new Konva.Circle({
            x: 100,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'blue',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);


        var tween = new Konva.Tween({
            node: circle,
            duration: 0.2,
            x: 200,
            y: 100
        }).play();

        // start/diff object = attrs.nodeId.tweenId.attr
        // tweenId = tweens.nodeId.attr

        assert.notEqual(tween._id, undefined);
        assert.equal(Konva.Tween.tweens[circle._id].x, tween._id);
        assert.notEqual(Konva.Tween.attrs[circle._id][tween._id], undefined);

        tween.destroy();

        assert.equal(Konva.Tween.tweens[circle._id].x, undefined);
        assert.equal(Konva.Tween.attrs[circle._id][tween._id], undefined);


    });

    // ======================================================
    test('zero duration', function(done) {
        var stage = addStage();

        var layer = new Konva.Layer();

        var circle = new Konva.Circle({
            x: 100,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'green',
            stroke: 'blue',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);


        var tween = new Konva.Tween({
            node: circle,
            duration: 0,
            x: 200,
            y: 100
        });
        tween.play();


        setTimeout(function(){
            assert.equal(circle.x(), 200);
            assert.equal(circle.y(), 100);
            done();
        }, 60);

    });

    test('color tweening', function(done) {
        var stage = addStage();

        var layer = new Konva.Layer();

        var circle = new Konva.Circle({
            x: 100,
            y: stage.getHeight() / 2,
            radius: 70,
            fill: 'red',
            stroke: 'blue',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);

        var c = Konva.Util.colorToRGBA('green');
        var endFill = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
        var tween = new Konva.Tween({
            node: circle,
            duration: 0.1,
            fill : endFill,
            onFinish : function() {
                assert.equal(endFill, circle.fill());
                done();
            }
        });
        tween.play();
    });

    test('transitionTo method', function(done) {
        var stage = addStage();

        var layer = new Konva.Layer();

        var circle = new Konva.Circle({
            radius: 70,
            fill: 'red',
            stroke: 'blue',
            strokeWidth: 4
        });

        layer.add(circle);
        stage.add(layer);

        circle.to({
            x: stage.width() / 2,
            y: stage.getHeight() / 2,
            duration : 0.1,
            onFinish : function() {
                assert.equal(circle.x(), stage.width() / 2);
                assert.equal(Object.keys(Konva.Tween.attrs[circle._id]).length, 0);
                done();
            }
        });
    });


});
