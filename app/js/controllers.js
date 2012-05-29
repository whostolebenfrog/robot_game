'use strict';

/* Controllers */

function RobotCtrl($scope, $document) {
    var MAX_X = 5;
    var MAX_Y = 3;

    $scope.moves  =  [];
    $scope.f1     =  [];
    $scope.f2     =  [];

    $scope.map = [];

    $scope.selected = null;
    $scope.robot = {};

    $scope.commands = [{code : 'Up', label : 'Forward'},
                       {code : 'Rt', label : 'Right 90'},
                       {code : 'Lt', label : 'Left 90'},
                       {code : 'f1', label : 'Function 1'},
                       {code : 'f2', label : 'Function 2'}];

    $scope.selectNode = function(move) {
        $scope.selected = move;
    };

    $scope.setCommand = function(command) {
        if ($scope.selected == null) {
            return;
        }
        $scope.selected.command = command.code;
    };

    $scope.evaluate = function() {
        resetGame();
        var robot = $scope.robot;
        var moveQueue = _.compact($scope.moves);

        while (moveQueue.length > 0) {
            var move = moveQueue.shift();
            switch (move.command) {
                case 'Up':
                    var newX = Math.min(Math.max(robot.x + robot.vX, 0), MAX_X - 1);
                    var newY = Math.min(Math.max(robot.y + robot.vY, 0), MAX_Y - 1);
                    if ($scope.map[newY][newX] != 'wall') {
                        robot.x = newX;
                        robot.y = newY;
                    }
                    break;
                case 'Rt':
                    var oldVY = robot.vY;
                    robot.vY  = robot.vX;
                    robot.vX  = -oldVY;
                    break;
                case 'Lt':
                    var oldVX = robot.vX;
                    robot.vX  = robot.vY;
                    robot.vY  = -oldVX;
                    break;
                case 'f1':
                    appendToMoveQueue(moveQueue, $scope.f1);
                    break;
                case 'f2':
                    appendToMoveQueue(moveQueue, $scope.f2);
                    break;
            }
            $scope.map[robot.y][robot.x] = 'empty';    
            if (finished($scope.map)) {
                console.log("WOOOOOO");
                break;
            }
        }
        $scope.map[robot.y][robot.x] = 'robot';    
    };

    function appendToMoveQueue(moveQueue, funQueue) {
        _.each(funQueue.slice(0).reverse(), function(move) {
            moveQueue.unshift(move);
        });
    }

    function resetGame() {
        $scope.map = [['robot', 'empty', 'empty', 'empty', 'empty'],
                      ['empty', 'empty', 'wall', 'empty', 'empty'],
                      ['empty', 'empty', 'goal', 'wall', 'goal']];
        $scope.robot = {x : 0, y : 0, vX : 0, vY : 1};
    }

    function finished(map) {
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                if (map[i][j] == 'goal')
                    return false;
            }
        }
        return true;
    }

    function keyPressHandler(event) {
        var code = null;
        switch(event.keyCode) {
            case 38: // up
                code = 'Up'; break;
            case 37: // left
                code = 'Lt'; break;
            case 39: // right
                code = 'Rt'; break;
            case 49: // 1
                code = 'f1'; break;
            case 50: // 2
                code = 'f2'; break;
            case 32: // space
                code = ''; break;
        }
        if (code !== null && $scope.selected !== null) {
            $scope.$apply(function() {
                $scope.selected.command = code;
            });
        }
    }

    function init() {
        $scope.moves = _.map(_.range(10), createMove);
        $scope.f1    = _.map(_.range(4),  createMove);
        $scope.f2    = _.map(_.range(4),  createMove);

        $document.bind('keyup', function(event) { keyPressHandler(event); });
        resetGame();
    } 

    function createMove() {
        return {command : ''};
    }

    init();

}
