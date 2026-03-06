/*
File:      github.com/ETmbit/sumo-bas.ts
Copyright: ETmbit, 2026

License:
This file is part of the ETmbit extensions for MakeCode for micro:bit.
It is free software and you may distribute it under the terms of the
GNU General Public License (version 3 or later) as published by the
Free Software Foundation. The full license text you find at
https://www.gnu.org/licenses.

Disclaimer:
ETmbit extensions are distributed without any warranty.

Dependencies:
ETmbit/general, ETmbit/match, ETmbit/sumobuilder
*/

//% color="#00CC00" icon="\uf0c1"
//% block="Sumo"
//% block.loc.nl="Sumo"
namespace SumoPlayer {

    let fielddiameter: number

    //% block="the field is %diameter cm in diameter"
    //% block.loc.nl="het veld heeft een doorsnede van %diameter cm"
    export function setFieldDiameter(diameter: number) {
        fielddiameter = diameter
        Sumo.setFieldDiameter( diameter)
    }

    //% block="put down opponent"
    //% block.loc.nl="zet de tegenstander neer"
    export function leverDown() {
        if (!Match.isPlaying()) return
        NezhaBrick.servoAngle(ServoPort.S4, 180)
    }

    //% block="lever opponent"
    //% block.loc.nl="til de tegenstander op"
    export function leverUp() {
        if (!Match.isPlaying()) return
        NezhaBrick.servoAngle(ServoPort.S4, 210)
    }

    //% block="drive back"
    //% block.loc.nl="rijd terug"
    export function moveBackward() {
        if (!Match.isPlaying()) return
        Sumo.move(Move.Backward, 50, Bend.None)
        General.wait(2)
        Sumo.stop()
    }

    //% block="push the opponent"
    //% block.loc.nl="duw de tegenstander"
    export function pushOpponent() {
        if (!Match.isPlaying()) return
        if (Sumo.readDistance() > 20) return
        Sumo.leverUp()
        while (Sumo.readFloorPos() == FloorPos.Field && Sumo.readDistance() < 20) {
            if (!Match.isPlaying()) break
            basic.pause(1)
        }
        Sumo.stop()
    }

    //% block="run to the opponent"
    //% block.loc.nl="rijd naar de tegenstander"
    export function runToOpponent() {
        if (!Match.isPlaying()) return
        let cm: number
        Sumo.leverDown()
        Sumo.move(Move.Forward, 100, Bend.None)
        do {
            if (!Match.isPlaying()) return
            cm = Sumo.readDistance()
            basic.pause(10)
        } while (cm > 10 && cm < fielddiameter)
        Sumo.stop()
    }

    //% block="turn to the opponent"
    //% block.loc.nl="draai richting tegenstander"
    export function findOpponent() {
        if (!Match.isPlaying()) return
        Sumo.leverDown()
        Sumo.turn(Rotate.Clockwise, 15)
        while (Sumo.readDistance() > fielddiameter) {
            if (!Match.isPlaying()) return
            basic.pause(1)
        }
        Sumo.stop()
    }

    //% subcategory="Show"
    //% color="#FFCC44"
    //% block="tornado"
    //% block.loc.nl="tornado"
    export function tornado() {
        let on = true
        for (let speed = 10; speed < 50; speed += 5) {
            if (on) {
                ETledRing.setClear()
                ETledRing.show()
            }
            else {
                if (showHandler) showHandler()
            }
            on = !on
            Sumo.turn(Rotate.Clockwise, speed)
            basic.pause(200)
        }
        for (let speed = 50; speed >= 0; speed -= 5) {
            if (on) {
                ETledRing.setClear()
                ETledRing.show()
            }
            else {
                if (showHandler) showHandler()
            }
            on = !on
            Sumo.turn(Rotate.Clockwise, speed)
            basic.pause(200)
        }
        if (showHandler) showHandler()
    }

    //% subcategory="Show"
    //% color="#FFCC44"
    //% block="shake"
    //% block.loc.nl="schudden"
    export function shake() {
        for (let i = 0; i < 6; i++) {
            Sumo.move(Move.Forward, 30, Bend.None)
            NezhaBrick.twoWheelSpeed(30, 30)
            basic.pause(200)
            ETledRing.setClear()
            ETledRing.show()
            Sumo.move(Move.Backward, 30, Bend.None)
            basic.pause(230)
        }
        Sumo.stop()
        if (showHandler) showHandler()
    }
}
