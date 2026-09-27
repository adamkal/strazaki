# Strażaki

A simple game for a 4-year-old: the child uses the arrow keys to move a Firefighter to a Fire, and the Firefighter then puts it out.

## Language

**Firefighter**:
The single character the Player controls with the arrow keys; each press moves it one Tile; at the Board edge it simply stays put.
_Avoid_: Strażak (Polish UI name only), hero, player character

**Fire**:
A harmless burning spot the Firefighter must reach and put out. Exactly one Fire exists at a time; when it is put out, a new one appears at a random Tile at least 3 Tiles away from the Firefighter, forever.
_Avoid_: Ogień, pożar (Polish UI names only), flame

**Extinguishing**:
The Firefighter putting out a Fire, which starts on its own as soon as the Firefighter reaches it (the Player presses nothing extra) and lasts about 2 seconds, during which the Firefighter cannot move.
_Avoid_: Gaszenie (Polish UI name only), spraying

**Player**:
The child at the keyboard.
_Avoid_: User, kid

**Board**:
The small grid of Tiles, with no obstacles, that fits entirely on one screen.
_Avoid_: Plansza (Polish UI name only), map, level

**Tile**:
One square of the Board; the Firefighter and a Fire each occupy one Tile.
_Avoid_: Cell, field, square

**Reaching a Fire**:
The Firefighter standing on a Tile orthogonally adjacent to the Fire (never on the Fire's Tile itself).
_Avoid_: Touching, colliding

**Celebration**:
The short reward (sound and stars) that follows every Extinguishing, before the next Fire appears.
_Avoid_: Reward, win screen

**Tally**:
The growing row of icons, one per extinguished Fire, that shows progress without digits; it holds at most 10 icons.
_Avoid_: Score, points, counter

**Big Celebration**:
The larger reward (a fire engine driving across the screen) that happens when the Tally reaches 10 icons, after which the Tally starts again from empty.
_Avoid_: Level up, bonus, win
