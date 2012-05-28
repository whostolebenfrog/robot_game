'use strict';

/* Controllers */

function RobotCtrl($scope, $document) {
    var MAX_X = 5;
    var MAX_Y = 3;

    $scope.moves  =  [];
    $scope.f1     =  [];
    $scope.f2     =  [];

    $scope.map = [['#', 'o', 'o', 'o', 'o'],
                  ['o', 'o', 'x', 'o', 'o'],
                  ['o', 'o', '*', 'x', '*']];

    $scope.selected = null;
    $scope.robot = {x : 0, y : 0, vX : 0, vY : 1};

    $scope.selectNode = function(move) {
        $scope.selected = move;
    };

    $scope.evaluate = function() {
        var robot = $scope.robot;
        resetRobot(robot);
        _.each($scope.moves, function(move) {
            switch (move.command) {
                case 'Up':
                    robot.x = Math.min(Math.max(robot.x + robot.vX, 0), MAX_X - 1);
                    robot.y = Math.min(Math.max(robot.y + robot.vY, 0), MAX_Y - 1);
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
            }
            $scope.map[robot.y][robot.x] = '#';    
            if (finished($scope.map)) {
                console.log("WOOOOOO");
            }
            console.log("x: " + robot.x + ", y: " + robot.y);

        });
    };

    function resetRobot(robot) {
        robot.x  = 0, robot.y  = 0;
        robot.vX = 0, robot.vY = 1;
    }

    function finished(map) {
        var finished = true;
        _.each(map, function(col) {
            _.each(col, function(cell) {
                if (cell == '*') {
                    finished = false;
                }
            });
        });
        return finished;
    }

    function createMove() {
        return {command : ''};
    }

    function keyPressHandler(event) {
        var code = null;
        console.log(event.keyCode);
        switch(event.keyCode) {
            case 38: // up
                code = 'Up'; break;
            case 37: // left
                code = 'Lt'; break;
            case 39: // right
                code = 'Rt'; break;
            case 32:
                code = ''; break;
        }
        if (code !== null && $scope.selected !== null) {
            $scope.$apply(function() {
                $scope.selected.command = code;
                console.log($scope.selected);
            });
        }
    }

    function init() {
        $scope.moves = _.map(_.range(10), createMove);
        $scope.f1    = _.map(_.range(4),  createMove);
        $scope.f2    = _.map(_.range(4),  createMove);

        $document.bind('keyup', function(event) { keyPressHandler(event); });
    } 
    init();

}
