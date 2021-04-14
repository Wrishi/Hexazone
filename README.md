# Hexazone

Turn based strategy game made with HTML, CSS, Javascript.

Two players has to play in the same device. Each has to conquer territory until they conquer enemy capital. The army is represented as a dice with the strength value. Maximum strength possible is 100. One player has white dice, the other black.

Each hexagon is a piece of land.
- Red: Capital (Generates army)
- Yellow: Cities (Generates army)
- Brown: Ports (Army can cross water from ports)
- Blue: Water (Accessible only through ports)
- Green: Land (Neutral territory. Light green are hexes conquered by white and Dark green are ones conquered by black.)

When armies crash the strengths reduce. The army with support of more army around it causes less damage. Armies can be merged to make bigger armies.
